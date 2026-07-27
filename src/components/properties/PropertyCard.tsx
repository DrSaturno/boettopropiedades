import Link from "next/link";
import { PropertyData } from "@/types";
import { formatPrice, formatArea } from "@/lib/utils";

interface Props {
  property: PropertyData;
}

export default function PropertyCard({ property }: Props) {
  const mainImage = property.images?.[0] || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80";

  return (
    <Link
      href={`/propiedades/${property.slug}`}
      className="group bg-brand-surface border border-brand-warm-gray/50 hover:border-brand-sage/50 transition-all duration-300 overflow-hidden"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
          style={{ backgroundImage: `url('${mainImage}')` }}
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="px-3 py-1 bg-brand-accent-dark/80 text-white text-xs uppercase tracking-wider font-medium">
            {property.operation === "venta" ? "Venta" : "Alquiler"}
          </span>
          {property.featured && (
            <span className="px-3 py-1 bg-brand-sage text-white text-xs uppercase tracking-wider font-medium">
              Destacada
            </span>
          )}
        </div>
        <div className="absolute bottom-4 left-4">
          <p className="text-white text-xl font-serif font-semibold drop-shadow-md">
            {formatPrice(property.price, property.currency)}
          </p>
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-base font-medium text-brand-dark mb-1 line-clamp-1 group-hover:text-brand-sage transition-colors">
          {property.title}
        </h3>
        <p className="text-sm text-brand-medium-gray mb-4 flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
          {[property.neighborhood, property.city].filter(Boolean).join(", ") || "Córdoba"}
        </p>

        <div className="flex items-center gap-4 text-xs text-brand-dark/50 border-t border-brand-warm-gray/50 pt-4">
          {property.bedrooms != null && (
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
              {property.bedrooms} dorm.
            </span>
          )}
          {property.bathrooms != null && (
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {property.bathrooms} baño{property.bathrooms > 1 ? "s" : ""}
            </span>
          )}
          {property.totalArea != null && (
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
              </svg>
              {formatArea(property.totalArea)}
            </span>
          )}
          {property.garages != null && property.garages > 0 && (
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
              </svg>
              {property.garages} coch.
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
