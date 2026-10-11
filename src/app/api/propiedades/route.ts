import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import type { Prisma } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { readPropertyFields, revalidatePublicCatalog } from "@/lib/property-input";
import { slugify } from "@/lib/utils";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  try {
    const properties = await prisma.property.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { inquiries: true } } },
    });
    return NextResponse.json(properties);
  } catch (error) {
    console.error("[propiedades] No se pudo listar", error);
    return NextResponse.json(
      { error: "No se pudo leer la base de datos" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const { data, error } = readPropertyFields(body);
  if (error) return NextResponse.json({ error }, { status: 400 });
  if (!data.title || !data.operation || !data.propertyType) {
    return NextResponse.json(
      { error: "Título, operación y tipo son obligatorios" },
      { status: 400 }
    );
  }

  const slug = `${slugify(String(data.title)) || "propiedad"}-${Date.now().toString(36)}`;

  try {
    const property = await prisma.property.create({
      data: { status: "draft", ...data, slug } as Prisma.PropertyUncheckedCreateInput,
    });
    revalidatePublicCatalog();
    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    console.error("[propiedades] No se pudo crear", error);
    return NextResponse.json(
      { error: "No se pudo guardar la propiedad en la base de datos" },
      { status: 500 }
    );
  }
}
