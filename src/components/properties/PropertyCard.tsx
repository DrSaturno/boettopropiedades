import Image from "next/image";
import Link from "next/link";
import type { PropertyData } from "@/types";
import { formatArea, formatPrice } from "@/lib/utils";

interface Props {
  property: PropertyData;
  imageSizes?: string;
}

export default function PropertyCard({ property, imageSizes }: Props) {
  const mainImage =
    property.images?.[0] ||
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=900&q=80";
  const location =
    [property.neighborhood, property.city].filter(Boolean).join(", ") ||
    "Capital Federal";

  return (
    <Link href={`/propiedades/${property.slug}`} className="property-card">
      <div className="property-card__media">
        <Image
          src={mainImage}
          alt={`Vista de ${property.title}`}
          fill
          sizes={imageSizes ?? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
          className="property-card__image object-cover"
          loading="lazy"
        />
        <div className="property-card__veil" />
        <span className="property-card__open" aria-hidden="true">
          ↗
        </span>
      </div>

      <div className="property-card__body">
        <div className="property-card__heading">
          <h3>{property.title}</h3>
          <strong>{formatPrice(property.price, property.currency)}</strong>
        </div>

        <p className="property-card__location">{location}</p>

        <div className="property-card__facts">
          {property.bedrooms != null && property.bedrooms > 0 ? (
            <span>{property.bedrooms} dorm.</span>
          ) : null}
          {property.bathrooms != null && property.bathrooms > 0 ? (
            <span>
              {property.bathrooms} baño{property.bathrooms > 1 ? "s" : ""}
            </span>
          ) : null}
          {property.totalArea != null ? (
            <span>{formatArea(property.totalArea)}</span>
          ) : null}
          {property.garages != null && property.garages > 0 ? (
            <span>{property.garages} coch.</span>
          ) : null}
        </div>

        <span className="property-card__link">
          Ver propiedad
          <i aria-hidden="true">→</i>
        </span>
      </div>
    </Link>
  );
}
