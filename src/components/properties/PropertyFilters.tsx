"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { OPERATIONS, PROPERTY_TYPES } from "@/lib/constants";

export default function PropertyFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      router.push(`/propiedades?${params.toString()}`);
    },
    [router, searchParams]
  );

  const rawPropertyType = searchParams.get("propertyType") || "";
  const multiplePropertyTypes = rawPropertyType.includes(",");

  return (
    <div className="catalog-filters" aria-label="Filtros de propiedades">
      <div className="catalog-filters__grid">
        <label>
          <span>Operación</span>
          <select
            value={searchParams.get("operation") || ""}
            onChange={(event) => updateFilter("operation", event.target.value)}
          >
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
          <select
            value={rawPropertyType}
            onChange={(event) =>
              updateFilter("propertyType", event.target.value)
            }
          >
            <option value="">Todos</option>
            {multiplePropertyTypes ? (
              <option value={rawPropertyType}>Varios tipos</option>
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
            key={searchParams.get("city") || "all-locations"}
            type="text"
            placeholder="Barrio o zona"
            defaultValue={searchParams.get("city") || ""}
            onBlur={(event) => updateFilter("city", event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                updateFilter("city", event.currentTarget.value);
              }
            }}
          />
        </label>

        <label>
          <span>Precio desde</span>
          <input
            key={searchParams.get("minPrice") || "no-minimum"}
            type="number"
            min="0"
            placeholder="Sin mínimo"
            defaultValue={searchParams.get("minPrice") || ""}
            onBlur={(event) => updateFilter("minPrice", event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                updateFilter("minPrice", event.currentTarget.value);
              }
            }}
          />
        </label>

        <label>
          <span>Precio hasta</span>
          <input
            key={searchParams.get("maxPrice") || "no-maximum"}
            type="number"
            min="0"
            placeholder="Sin máximo"
            defaultValue={searchParams.get("maxPrice") || ""}
            onBlur={(event) => updateFilter("maxPrice", event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                updateFilter("maxPrice", event.currentTarget.value);
              }
            }}
          />
        </label>

        <label>
          <span>Dormitorios</span>
          <select
            value={searchParams.get("bedrooms") || ""}
            onChange={(event) => updateFilter("bedrooms", event.target.value)}
          >
            <option value="">Todos</option>
            {[1, 2, 3, 4, 5].map((number) => (
              <option key={number} value={number}>
                {number} o más
              </option>
            ))}
          </select>
        </label>
      </div>

      <Link href="/propiedades" className="catalog-filters__reset">
        Limpiar filtros
        <span aria-hidden="true">×</span>
      </Link>
    </div>
  );
}
