import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function GET() {
  const properties = await prisma.property.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { inquiries: true } } },
  });
  return NextResponse.json(properties);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  try {
    const body = await request.json();
    const slug = body.slug || slugify(body.title) + "-" + Date.now().toString(36);

    const property = await prisma.property.create({
      data: {
        title: body.title,
        slug,
        operation: body.operation,
        propertyType: body.propertyType,
        status: body.status || "draft",
        featured: body.featured || false,
        price: body.price ? Number(body.price) : null,
        currency: body.currency || "USD",
        expenses: body.expenses ? Number(body.expenses) : null,
        address: body.address || null,
        neighborhood: body.neighborhood || null,
        city: body.city || null,
        province: body.province || "Ciudad Autónoma de Buenos Aires",
        description: body.description || null,
        totalArea: body.totalArea ? Number(body.totalArea) : null,
        coveredArea: body.coveredArea ? Number(body.coveredArea) : null,
        rooms: body.rooms ? Number(body.rooms) : null,
        bedrooms: body.bedrooms ? Number(body.bedrooms) : null,
        bathrooms: body.bathrooms ? Number(body.bathrooms) : null,
        garages: body.garages ? Number(body.garages) : null,
        age: body.age != null ? Number(body.age) : null,
        amenities: body.amenities ? JSON.stringify(body.amenities) : null,
        images: body.images ? JSON.stringify(body.images) : null,
        videoUrl: body.videoUrl || null,
        externalUrl: body.externalUrl || null,
        externalSource: body.externalSource || "manual",
        seoTitle: body.seoTitle || null,
        seoDescription: body.seoDescription || null,
      },
    });

    return NextResponse.json(property, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Error al crear la propiedad" }, { status: 500 });
  }
}
