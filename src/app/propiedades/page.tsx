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

  const properties = await prisma.property.findMany({
    where,
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });

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
          <p className="text-sm text-brand-medium-gray mb-6">
            {mapped.length} propiedad{mapped.length !== 1 ? "es" : ""} encontrada{mapped.length !== 1 ? "s" : ""}
          </p>
          <PropertyGrid properties={mapped} />
        </div>
      </section>
    </>
  );
}
