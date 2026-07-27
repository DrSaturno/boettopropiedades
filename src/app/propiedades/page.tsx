import { Metadata } from "next";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { parseJsonField } from "@/lib/utils";
import PropertyFilters from "@/components/properties/PropertyFilters";
import PropertyGrid from "@/components/properties/PropertyGrid";
import { Prisma } from "@prisma/client";

export const metadata: Metadata = {
  title: "Propiedades",
  description:
    "Explorá las propiedades disponibles en Boetto Propiedades. Casas, departamentos, terrenos y más en Córdoba.",
};

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

async function getPublishedProperties(where: Prisma.PropertyWhereInput) {
  try {
    const properties = await prisma.property.findMany({
      where,
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    });

    return { properties, unavailable: false };
  } catch (error) {
    console.error("[properties] Unable to load the property catalog", error);
    return { properties: [], unavailable: true };
  }
}

export default async function PropertiesPage({ searchParams }: Props) {
  const params = await searchParams;

  const where: Prisma.PropertyWhereInput = { status: "published" };

  if (params.operation) where.operation = String(params.operation);
  if (params.propertyType) where.propertyType = String(params.propertyType);
  if (params.city) {
    const city = String(params.city);
    where.OR = [
      { city: { contains: city } },
      { neighborhood: { contains: city } },
      { address: { contains: city } },
    ];
  }
  if (params.minPrice || params.maxPrice) {
    where.price = {};
    if (params.minPrice) where.price.gte = Number(params.minPrice);
    if (params.maxPrice) where.price.lte = Number(params.maxPrice);
  }
  if (params.bedrooms) where.bedrooms = { gte: Number(params.bedrooms) };

  const { properties, unavailable } = await getPublishedProperties(where);

  const mapped = properties.map((p) => ({
    ...p,
    images: parseJsonField<string[]>(p.images, []),
    amenities: parseJsonField<string[]>(p.amenities, []),
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));

  return (
    <>
      <section className="bg-brand-cream py-16">
        <div className="container-wide">
          <p className="text-brand-sage text-sm uppercase tracking-[0.3em] mb-3 font-medium">
            Propiedades
          </p>
          <h1 className="text-3xl md:text-4xl font-serif font-medium text-brand-dark">
            Encontrá tu próxima propiedad
          </h1>
        </div>
      </section>

      <section className="py-10">
        <div className="container-wide">
          <Suspense fallback={null}>
            <PropertyFilters />
          </Suspense>
          {unavailable ? (
            <div
              className="border border-brand-warm-gray/50 bg-brand-surface p-8 text-center"
              role="status"
            >
              <h2 className="mb-3 font-serif text-2xl text-brand-dark">
                Estamos actualizando el catálogo
              </h2>
              <p className="mx-auto max-w-xl text-sm leading-relaxed text-brand-dark/60">
                Las propiedades van a volver a estar disponibles en breve. Mientras
                tanto, podés escribirnos desde la sección de contacto para contarnos
                qué estás buscando.
              </p>
            </div>
          ) : (
            <>
              <p className="mb-6 text-sm text-brand-medium-gray">
                {mapped.length} propiedad{mapped.length !== 1 ? "es" : ""} encontrada
                {mapped.length !== 1 ? "s" : ""}
              </p>
              <PropertyGrid properties={mapped} />
            </>
          )}
        </div>
      </section>
    </>
  );
}
