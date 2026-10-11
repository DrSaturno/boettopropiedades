import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Prisma } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { readPropertyFields, revalidatePublicCatalog } from "@/lib/property-input";
import { deleteUnusedPropertyImages, parsePropertyImages } from "@/lib/property-images";

interface RouteContext {
  params: Promise<{ id: string }>;
}

async function readId(context: RouteContext) {
  const { id } = await context.params;
  const numericId = Number(id);
  return Number.isInteger(numericId) && numericId > 0 ? numericId : null;
}

function isNotFound(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025"
  );
}

const notFound = () => NextResponse.json({ error: "No encontrada" }, { status: 404 });

export async function GET(_request: Request, context: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const id = await readId(context);
  if (!id) return notFound();

  try {
    const property = await prisma.property.findUnique({ where: { id } });
    return property ? NextResponse.json(property) : notFound();
  } catch (error) {
    console.error(`[propiedades] No se pudo leer ${id}`, error);
    return NextResponse.json(
      { error: "No se pudo leer la base de datos" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, context: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const id = await readId(context);
  if (!id) return notFound();

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const { data, error } = readPropertyFields(body);
  if (error) return NextResponse.json({ error }, { status: 400 });
  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "No hay cambios para guardar" }, { status: 400 });
  }

  try {
    const previous = await prisma.property.findUnique({ where: { id }, select: { images: true } });
    if (!previous) return notFound();
    const property = await prisma.property.update({ where: { id }, data });
    revalidatePublicCatalog();
    const currentImages = new Set(parsePropertyImages(property.images));
    await deleteUnusedPropertyImages(
      parsePropertyImages(previous.images).filter((url) => !currentImages.has(url))
    );
    return NextResponse.json(property);
  } catch (error) {
    if (isNotFound(error)) return notFound();
    console.error(`[propiedades] No se pudo actualizar ${id}`, error);
    return NextResponse.json(
      { error: "No se pudo guardar el cambio en la base de datos" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const id = await readId(context);
  if (!id) return notFound();

  try {
    const property = await prisma.property.findUnique({ where: { id }, select: { images: true } });
    if (!property) return notFound();
    // Inquiries and leads are customer records: unlink them instead of deleting them.
    await prisma.$transaction([
      prisma.inquiry.updateMany({ where: { propertyId: id }, data: { propertyId: null } }),
      prisma.lead.updateMany({ where: { propertyId: id }, data: { propertyId: null } }),
      prisma.property.delete({ where: { id } }),
    ]);
    revalidatePublicCatalog();
    await deleteUnusedPropertyImages(parsePropertyImages(property.images));
    return NextResponse.json({ success: true });
  } catch (error) {
    if (isNotFound(error)) return notFound();
    console.error(`[propiedades] No se pudo eliminar ${id}`, error);
    return NextResponse.json(
      { error: "No se pudo eliminar la propiedad" },
      { status: 500 }
    );
  }
}
