import Link from "next/link";
import PropertyCard from "@/components/properties/PropertyCard";
import { getFeaturedCatalogProperties } from "@/lib/property-catalog";

export default async function FeaturedProperties() {
  const properties = await getFeaturedCatalogProperties();

  if (properties.length === 0) return null;

  return (
    <section
      className="home-properties"
      aria-labelledby="home-properties-title"
    >
      <div className="section-shell">
        <header className="home-properties__header" data-reveal>
          <div>
            <h2 id="home-properties-title">
              Una selección lista para conocer.
            </h2>
            <p>
              Seis maneras distintas de vivir la ciudad, elegidas por su
              arquitectura, ubicación y calidad espacial.
            </p>
          </div>
          <Link
            href="/propiedades"
            className="home-properties__all"
          >
            Explorar las 20 propiedades
            <span aria-hidden="true">→</span>
          </Link>
        </header>

        <div className="property-catalog-grid home-properties__grid">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </section>
  );
}
