import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const property = await prisma.property.findUnique({
    where: { id: Number(id) },
    include: { inquiries: { orderBy: { createdAt: "desc" } } },
  });
  if (!property) return NextResponse.json({ error: "No encontrada" }, { status: 404 });
  return NextResponse.json(property);
}

export async function PUT(request: Request, context: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await context.params;
  const body = await request.json();

  try {
    const property = await prisma.property.update({
      where: { id: Number(id) },
      data: {
        title: body.title,
        operation: body.operation,
        propertyType: body.propertyType,
        status: body.status,
        featured: body.featured,
        price: body.price != null ? Number(body.price) : null,
        currency: body.currency,
        expenses: body.expenses != null ? Number(body.expenses) : null,
        address: body.address || null,
        neighborhood: body.neighborhood || null,
        city: body.city || null,
        province: body.province || "Córdoba",
        description: body.description || null,
        totalArea: body.totalArea != null ? Number(body.totalArea) : null,
        coveredArea: body.coveredArea != null ? Number(body.coveredArea) : null,
        rooms: body.rooms != null ? Number(body.rooms) : null,
        bedrooms: body.bedrooms != null ? Number(body.bedrooms) : null,
        bathrooms: body.bathrooms != null ? Number(body.bathrooms) : null,
        garages: body.garages != null ? Number(body.garages) : null,
        age: body.age != null ? Number(body.age) : null,
        amenities: body.amenities ? JSON.stringify(body.amenities) : null,
        images: body.images ? JSON.stringify(body.images) : null,
        videoUrl: body.videoUrl || null,
        externalUrl: body.externalUrl || null,
        externalSource: body.externalSource,
        seoTitle: body.seoTitle || null,
        seoDescription: body.seoDescription || null,
      },
    });
    return NextResponse.json(property);
  } catch {
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await context.params;
  try {
    await prisma.inquiry.deleteMany({ where: { propertyId: Number(id) } });
    await prisma.property.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });
  }
}
