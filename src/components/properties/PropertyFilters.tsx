"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { OPERATIONS, PROPERTY_TYPES } from "@/lib/constants";

export default function PropertyFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`/propiedades?${params.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <div className="bg-brand-surface border border-brand-warm-gray/50 p-6 mb-8">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div>
          <label className="block text-xs font-medium text-brand-dark/60 uppercase tracking-wider mb-1.5">
            Operación
          </label>
          <select
            value={searchParams.get("operation") || ""}
            onChange={(e) => updateFilter("operation", e.target.value)}
            className="w-full px-3 py-2.5 border border-brand-warm-gray rounded-sm text-sm bg-brand-surface focus:outline-none focus:border-brand-sage"
          >
            <option value="">Todas</option>
            {OPERATIONS.map((op) => (
              <option key={op.value} value={op.value}>{op.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-brand-dark/60 uppercase tracking-wider mb-1.5">
            Tipo
          </label>
          <select
            value={searchParams.get("propertyType") || ""}
            onChange={(e) => updateFilter("propertyType", e.target.value)}
            className="w-full px-3 py-2.5 border border-brand-warm-gray rounded-sm text-sm bg-brand-surface focus:outline-none focus:border-brand-sage"
          >
            <option value="">Todos</option>
            {PROPERTY_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-brand-dark/60 uppercase tracking-wider mb-1.5">
            Ubicación
          </label>
          <input
            type="text"
            placeholder="Ciudad o barrio"
            defaultValue={searchParams.get("city") || ""}
            onBlur={(e) => updateFilter("city", e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") updateFilter("city", e.currentTarget.value);
            }}
            className="w-full px-3 py-2.5 border border-brand-warm-gray rounded-sm text-sm placeholder:text-brand-medium-gray focus:outline-none focus:border-brand-sage"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-brand-dark/60 uppercase tracking-wider mb-1.5">
            Precio mínimo
          </label>
          <input
            type="number"
            placeholder="Desde"
            defaultValue={searchParams.get("minPrice") || ""}
            onBlur={(e) => updateFilter("minPrice", e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") updateFilter("minPrice", e.currentTarget.value);
            }}
            className="w-full px-3 py-2.5 border border-brand-warm-gray rounded-sm text-sm placeholder:text-brand-medium-gray focus:outline-none focus:border-brand-sage"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-brand-dark/60 uppercase tracking-wider mb-1.5">
            Precio máximo
          </label>
          <input
            type="number"
            placeholder="Hasta"
            defaultValue={searchParams.get("maxPrice") || ""}
            onBlur={(e) => updateFilter("maxPrice", e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") updateFilter("maxPrice", e.currentTarget.value);
            }}
            className="w-full px-3 py-2.5 border border-brand-warm-gray rounded-sm text-sm placeholder:text-brand-medium-gray focus:outline-none focus:border-brand-sage"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-brand-dark/60 uppercase tracking-wider mb-1.5">
            Dormitorios
          </label>
          <select
            value={searchParams.get("bedrooms") || ""}
            onChange={(e) => updateFilter("bedrooms", e.target.value)}
            className="w-full px-3 py-2.5 border border-brand-warm-gray rounded-sm text-sm bg-brand-surface focus:outline-none focus:border-brand-sage"
          >
            <option value="">Todos</option>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>{n}+</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
