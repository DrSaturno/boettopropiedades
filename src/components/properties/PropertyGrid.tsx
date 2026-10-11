import Link from "next/link";
import type { PropertyData } from "@/types";
import PropertyCard from "./PropertyCard";

interface Props {
  properties: PropertyData[];
  hasFilters?: boolean;
}

export default function PropertyGrid({ properties, hasFilters = false }: Props) {
  if (properties.length === 0) {
    return (
      <div className="property-catalog-empty">
        <span aria-hidden="true">{hasFilters ? "Sin coincidencias" : "Sin propiedades"}</span>
        <h3>
          {hasFilters
            ? "No encontramos una propiedad con esos filtros."
            : "Todavía no hay propiedades publicadas."}
        </h3>
        <p>
          {hasFilters
            ? "Podés ampliar la búsqueda o contarnos qué necesitás para que preparemos una selección personalizada."
            : "Estamos preparando nuevas publicaciones. Contanos qué buscás y te ayudamos a encontrarlo."}
        </p>
        <div>
          {hasFilters && <Link href="/propiedades">Limpiar filtros</Link>}
          <Link href="/contacto">Hablar con el equipo</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="property-catalog-grid">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}
