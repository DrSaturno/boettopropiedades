import { Metadata } from "next";
import { Suspense } from "react";
import PropertyFilters from "@/components/properties/PropertyFilters";
import PropertyGrid from "@/components/properties/PropertyGrid";
import InteriorHero from "@/components/layout/InteriorHero";
import { getPublicPropertyCatalog } from "@/lib/property-catalog";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Propiedades",
  description:
    "Explorá una selección curada de propiedades en venta y alquiler en Capital Federal.",
};

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function PropertiesPage({ searchParams }: Props) {
  const params = await searchParams;
  const propertyTypes = params.propertyType
    ? String(params.propertyType)
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean)
    : undefined;
  const { properties, demoMode } = await getPublicPropertyCatalog({
    operation: params.operation ? String(params.operation) : undefined,
    propertyTypes,
    city: params.city ? String(params.city) : undefined,
    minPrice: params.minPrice ? Number(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    bedrooms: params.bedrooms ? Number(params.bedrooms) : undefined,
  });

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

          <div className="catalog-results__header" aria-live="polite">
            <p>
              {properties.length} propiedad{properties.length !== 1 ? "es" : ""}
            </p>
            <span>
              {demoMode
                ? "Ejemplos ficticios para visualizar el catálogo"
                : "Ordenadas por relevancia"}
            </span>
          </div>
          <PropertyGrid properties={properties} />
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
