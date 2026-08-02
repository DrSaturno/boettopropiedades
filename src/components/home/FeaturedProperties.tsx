import Link from "next/link";
import PropertyCard from "@/components/properties/PropertyCard";
import { getFeaturedCatalogProperties } from "@/lib/property-catalog";

export default async function FeaturedProperties() {
  const properties = await getFeaturedCatalogProperties();

  if (properties.length === 0) return null;

  return (
    <section className="py-24">
      <div className="container-wide">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-brand-sage text-sm uppercase tracking-[0.3em] mb-3 font-medium">
              Destacadas
            </p>
            <h2 className="text-3xl md:text-4xl font-serif font-medium text-brand-dark">
              Propiedades seleccionadas
            </h2>
          </div>
          <Link
            href="/propiedades"
            className="hidden md:inline-flex items-center gap-2 text-sm font-medium text-brand-dark border-b border-brand-dark pb-1 hover:text-brand-sage hover:border-brand-sage transition-colors"
          >
            Ver todas
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
            />
          ))}
        </div>

        <div className="text-center mt-10 md:hidden">
          <Link
            href="/propiedades"
            className="inline-flex items-center gap-2 text-sm font-medium text-brand-dark border-b border-brand-dark pb-1"
          >
            Ver todas las propiedades
          </Link>
        </div>
      </div>
    </section>
  );
}
