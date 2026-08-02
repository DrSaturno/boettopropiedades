import { Metadata } from "next";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { parseJsonField } from "@/lib/utils";
import PropertyFilters from "@/components/properties/PropertyFilters";
import PropertyGrid from "@/components/properties/PropertyGrid";
import InteriorHero from "@/components/layout/InteriorHero";
import { Prisma } from "@prisma/client";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Propiedades",
  description:
    "Explorá una selección curada de propiedades en venta y alquiler en Capital Federal.",
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
  if (params.propertyType) {
    const propertyTypes = String(params.propertyType)
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);

    where.propertyType =
      propertyTypes.length > 1 ? { in: propertyTypes } : propertyTypes[0];
  }
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
    <div className="inner-page properties-page">
      <InteriorHero
        index="01"
        kicker="Propiedades seleccionadas"
        title={
          <>
            Menos opciones.
            <em>Más criterio.</em>
          </>
        }
        summary="Una selección pensada para comparar mejor: arquitectura, entorno y forma de vivir, leídos con la misma atención."
        image="/images/boetto-courtyard.png"
        imageAlt="Casa contemporánea con patio arbolado y pileta al atardecer"
        caption="Arquitectura · contexto · Capital Federal"
      />

      <section className="catalog-section">
        <div className="section-shell">
          <div className="interior-section-heading catalog-section__heading">
            <div>
              <p className="eyebrow">Explorá la selección</p>
              <h2>Encontrá un lugar que tenga sentido para vos.</h2>
            </div>
            <p>
              Filtrá lo esencial. Si todavía no sabés exactamente qué buscar,
              contanos cómo querés vivir y armamos una selección a medida.
            </p>
          </div>

          <Suspense fallback={null}>
            <PropertyFilters />
          </Suspense>

          {unavailable ? (
            <div className="catalog-message" role="status">
              <p className="eyebrow">Catálogo temporalmente no disponible</p>
              <h2>
                Estamos actualizando el catálogo
              </h2>
              <p>
                Las propiedades van a volver a estar disponibles en breve. Mientras
                tanto, podés escribirnos desde la sección de contacto para contarnos
                qué estás buscando.
              </p>
              <Link href="/contacto">Contarnos qué buscás</Link>
            </div>
          ) : (
            <>
              <div className="catalog-results__header" aria-live="polite">
                <p>
                  {mapped.length} propiedad{mapped.length !== 1 ? "es" : ""}
                </p>
                <span>Ordenadas por relevancia</span>
              </div>
              <PropertyGrid properties={mapped} />
            </>
          )}
        </div>
      </section>

      <section className="interior-cta interior-cta--dark">
        <div className="section-shell interior-cta__layout">
          <p className="eyebrow eyebrow--light">Búsqueda guiada</p>
          <h2>La propiedad indicada puede no estar publicada todavía.</h2>
          <div>
            <p>
              Contanos tus prioridades y preparamos una búsqueda breve, concreta
              y acompañada.
            </p>
            <Link href="/contacto" className="outline-link outline-link--light">
              Iniciar una búsqueda
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
