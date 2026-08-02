"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { OPERATIONS, PROPERTY_TYPES } from "@/lib/constants";

interface PropertyFiltersProps {
  initialOperation?: string;
  initialPropertyType?: string;
  initialCity?: string;
  initialBedrooms?: string;
  initialMaxPrice?: string;
}

export default function PropertyFilters({
  initialOperation = "",
  initialPropertyType = "",
  initialCity = "",
  initialBedrooms = "",
  initialMaxPrice = "",
}: PropertyFiltersProps) {
  const router = useRouter();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const params = new URLSearchParams();

    for (const key of [
      "operation",
      "propertyType",
      "city",
      "bedrooms",
      "maxPrice",
    ]) {
      const value = form.get(key)?.toString().trim();
      if (value) params.set(key, value);
    }

    router.push(`/propiedades?${params.toString()}`);
  }

  const multiplePropertyTypes = initialPropertyType.includes(",");

  return (
    <form
      className="catalog-filters"
      aria-label="Buscar propiedades"
      onSubmit={handleSubmit}
    >
      <div className="catalog-filters__grid">
        <label>
          <span>Operación</span>
          <select name="operation" defaultValue={initialOperation}>
            <option value="">Todas</option>
            {OPERATIONS.map((operation) => (
              <option key={operation.value} value={operation.value}>
                {operation.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Tipo</span>
          <select name="propertyType" defaultValue={initialPropertyType}>
            <option value="">Todos</option>
            {multiplePropertyTypes ? (
              <option value={initialPropertyType}>Varios tipos</option>
            ) : null}
            {PROPERTY_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Ubicación</span>
          <input
            name="city"
            type="text"
            placeholder="Barrio, zona o calle"
            defaultValue={initialCity}
          />
        </label>

        <label>
          <span>Hasta USD</span>
          <input
            name="maxPrice"
            type="number"
            min="0"
            placeholder="Sin límite"
            defaultValue={initialMaxPrice}
          />
        </label>

        <label>
          <span>Dormitorios</span>
          <select name="bedrooms" defaultValue={initialBedrooms}>
            <option value="">Todos</option>
            {[1, 2, 3, 4, 5].map((number) => (
              <option key={number} value={number}>
                {number} o más
              </option>
            ))}
          </select>
        </label>

        <button type="submit" className="catalog-filters__submit">
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <circle cx="10.8" cy="10.8" r="6.8" />
            <path d="m16 16 5 5" />
          </svg>
          <span>Buscar</span>
        </button>
      </div>
    </form>
  );
}
