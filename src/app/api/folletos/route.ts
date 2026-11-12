import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buildFlyerDefaults } from "@/lib/flyers/defaults";
import { createRemoteLoader, flyerToPdf, renderFlyer } from "@/lib/flyers/render";
import { FLYER_MAX_CHIPS, FLYER_MAX_PHOTOS, flyerDataSchema } from "@/lib/flyers/types";
import { parseJsonField, slugify } from "@/lib/utils";

export const maxDuration = 60;

const unauthorized = () => NextResponse.json({ error: "No autorizado" }, { status: 401 });

async function findProperty(value: unknown) {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) return null;
  return prisma.property.findUnique({ where: { id } });
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return unauthorized();

  const property = await findProperty(new URL(request.url).searchParams.get("propertyId"));
  if (!property) return NextResponse.json({ error: "Propiedad no encontrada" }, { status: 404 });

  return NextResponse.json({
    property: {
      id: property.id,
      title: property.title,
      slug: property.slug,
      status: property.status,
      images: parseJsonField<string[]>(property.images, []),
    },
    flyers: {
      story: buildFlyerDefaults(property, "story"),
      price: buildFlyerDefaults(property, "price"),
    },
  });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return unauthorized();

  const body = await request.json().catch(() => null);
  const parsed = flyerDataSchema.safeParse(body?.data);
  if (!parsed.success) {
    return NextResponse.json({ error: "Revisá los datos del folleto" }, { status: 400 });
  }
  const data = parsed.data;
  const format = body?.format === "jpg" ? "jpg" : "pdf";

  if (data.chips.length > FLYER_MAX_CHIPS[data.template] || data.photos.length > FLYER_MAX_PHOTOS[data.template]) {
    return NextResponse.json({ error: "Hay más fotos o datos de los que entran en esta plantilla" }, { status: 400 });
  }

  const property = await findProperty(body?.propertyId);
  if (!property) return NextResponse.json({ error: "Propiedad no encontrada" }, { status: 404 });

  const allowed = new Set(parseJsonField<string[]>(property.images, []));
  if (data.photos.some((url) => !allowed.has(url))) {
    return NextResponse.json({ error: "Solo se pueden usar fotos cargadas en la propiedad" }, { status: 400 });
  }

  try {
    const flyer = await renderFlyer(data, createRemoteLoader(new URL(request.url).origin));
    const name = `folleto-${slugify(data.zone) || "propiedad"}-${data.template === "price" ? "precio" : "historia"}`;

    if (format === "jpg") {
      return new Response(new Uint8Array(flyer.jpeg), {
        headers: {
          "Content-Type": "image/jpeg",
          "Content-Disposition": `inline; filename="${name}.jpg"`,
          "Cache-Control": "no-store",
        },
      });
    }

    const pdf = await flyerToPdf(flyer, `${data.zone} - Boetto Propiedades`);
    return new Response(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${name}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("[folletos] No se pudo generar el folleto", error);
    const message = error instanceof Error && /foto|descargar/i.test(error.message) ? error.message : "No se pudo generar el folleto";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
