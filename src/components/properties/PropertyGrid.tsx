import Link from "next/link";
import type { PropertyData } from "@/types";
import PropertyCard from "./PropertyCard";

interface Props {
  properties: PropertyData[];
}

export default function PropertyGrid({ properties }: Props) {
  if (properties.length === 0) {
    return (
      <div className="property-catalog-empty">
        <span aria-hidden="true">Sin coincidencias</span>
        <h3>No encontramos una propiedad con esos filtros.</h3>
        <p>
          Podés ampliar la búsqueda o contarnos qué necesitás para que preparemos
          una selección personalizada.
        </p>
        <div>
          <Link href="/propiedades">Limpiar filtros</Link>
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
