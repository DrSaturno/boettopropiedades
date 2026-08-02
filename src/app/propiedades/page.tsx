import type { Metadata } from "next";
import Link from "next/link";
import PageMasthead from "@/components/layout/PageMasthead";
import PropertyFilters from "@/components/properties/PropertyFilters";
import PropertyGrid from "@/components/properties/PropertyGrid";
import { getPublicPropertyCatalog } from "@/lib/property-catalog";

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

type CatalogMode = "venta" | "alquiler" | "todas";

const mastheads: Record<
  CatalogMode,
  {
    title: React.ReactNode;
    summary: string;
    image: string;
    imageAlt: string;
    aside: string;
  }
> = {
  venta: {
    title: (
      <>
        Comprar mejor.
        <em>Elegir con criterio.</em>
      </>
    ),
    summary:
      "Casas con arquitectura, contexto y una forma de vivir propia. Buscá lo esencial y compará una selección más clara.",
    image: "/images/boetto-courtyard.png",
    imageAlt: "Casa contemporánea con patio arbolado y pileta al atardecer",
    aside: "Comprar · Capital Federal",
  },
  alquiler: {
    title: (
      <>
        Alquilar bien.
        <em>Sentirte en casa.</em>
      </>
    ),
    summary:
      "Una selección para encontrar rápido lo que encaja con tu rutina, tu presupuesto y la etapa que estás por empezar.",
    image: "/images/boetto-penthouse.png",
    imageAlt: "Living contemporáneo con terraza y vistas a Capital Federal",
    aside: "Alquilar · Capital Federal",
  },
  todas: {
    title: (
      <>
        Encontrá tu lugar.
        <em>Con menos ruido.</em>
      </>
    ),
    summary:
      "Venta y alquiler en una selección pensada para comparar mejor: ubicación, arquitectura y forma de vivir.",
    image: "/images/boetto-hero.png",
    imageAlt: "Casa moderna rodeada de vegetación",
    aside: "Propiedades · Capital Federal",
  },
};

function getCatalogMode(operation: string | undefined): CatalogMode {
  if (operation === "venta" || operation === "alquiler") return operation;
  return "todas";
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const mode = getCatalogMode(
    params.operation ? String(params.operation) : undefined
  );

  if (mode === "venta") {
    return {
      title: "Comprar propiedades",
      description:
        "Casas y propiedades en venta seleccionadas en Capital Federal.",
    };
  }

  if (mode === "alquiler") {
    return {
      title: "Alquilar propiedades",
      description:
        "Casas y propiedades en alquiler seleccionadas en Capital Federal.",
    };
  }

  return {
    title: "Propiedades",
    description:
      "Explorá una selección curada de propiedades en venta y alquiler en Capital Federal.",
  };
}

export default async function PropertiesPage({ searchParams }: Props) {
  const params = await searchParams;
  const operation = params.operation ? String(params.operation) : "";
  const mode = getCatalogMode(operation);
  const masthead = mastheads[mode];
  const rawPropertyType = params.propertyType
    ? String(params.propertyType)
    : "";
  const propertyTypes = rawPropertyType
    ? rawPropertyType
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean)
    : undefined;
  const { properties, demoMode } = await getPublicPropertyCatalog({
    operation: operation || undefined,
    propertyTypes,
    city: params.city ? String(params.city) : undefined,
    minPrice: params.minPrice ? Number(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    bedrooms: params.bedrooms ? Number(params.bedrooms) : undefined,
  });

  const resultContext =
    mode === "venta"
      ? "para comprar"
      : mode === "alquiler"
        ? "para alquilar"
        : "disponibles";

  return (
    <div className="inner-page properties-page">
      <PageMasthead
        title={masthead.title}
        summary={masthead.summary}
        image={masthead.image}
        imageAlt={masthead.imageAlt}
        aside={masthead.aside}
        imagePosition={mode === "alquiler" ? "right" : "center"}
      >
        <PropertyFilters
          key={JSON.stringify(params)}
          initialOperation={operation}
          initialPropertyType={rawPropertyType}
          initialCity={params.city ? String(params.city) : ""}
          initialBedrooms={params.bedrooms ? String(params.bedrooms) : ""}
          initialMaxPrice={params.maxPrice ? String(params.maxPrice) : ""}
        />
      </PageMasthead>

      <section className="catalog-section" aria-label="Catálogo de propiedades">
        <div className="section-shell">
          <div className="catalog-results__header" aria-live="polite">
            <p>
              {properties.length} propiedad{properties.length !== 1 ? "es" : ""}{" "}
              {resultContext}
            </p>
            <span>
              {demoMode
                ? "Ejemplos ficticios para visualizar el catálogo"
                : "Selección actualizada"}
            </span>
          </div>
          <PropertyGrid properties={properties} />
        </div>
      </section>

      <section className="interior-cta interior-cta--dark">
        <div className="section-shell interior-cta__layout">
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
