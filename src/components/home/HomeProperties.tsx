import Link from "next/link";
import { connection } from "next/server";
import PropertyCard from "@/components/properties/PropertyCard";
import { getHomeCatalogProperties } from "@/lib/property-catalog";

export default async function HomeProperties() {
  await connection();
  const properties = await getHomeCatalogProperties();

  if (properties.length === 0) return null;

  return (
    <section
      className="home-properties"
      aria-labelledby="home-properties-title"
    >
      <div className="section-shell">
        <header className="home-properties__header" data-reveal>
          <h2 id="home-properties-title">
            Una selección lista para conocer.
          </h2>
          <Link
            href="/propiedades"
            className="home-properties__all"
          >
            Explorar propiedades
            <span aria-hidden="true">→</span>
          </Link>
        </header>

        <div className="property-catalog-grid home-properties__grid">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              imageSizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 25vw"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
