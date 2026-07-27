"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { OPERATIONS, PROPERTY_TYPES } from "@/lib/constants";

export default function SearchBar() {
  const router = useRouter();
  const [operation, setOperation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [location, setLocation] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (operation) params.set("operation", operation);
    if (propertyType) params.set("propertyType", propertyType);
    if (location) params.set("city", location);
    router.push(`/propiedades?${params.toString()}`);
  }

  return (
    <section className="relative -mt-12 z-10">
      <div className="container-wide">
        <form
          onSubmit={handleSearch}
          className="bg-brand-surface rounded-sm shadow-xl p-6 md:p-8 grid grid-cols-1 md:grid-cols-4 gap-4 items-end border border-brand-warm-gray/50"
        >
          <div>
            <label className="block text-xs font-medium text-brand-dark/60 uppercase tracking-wider mb-2">
              Operación
            </label>
            <select
              value={operation}
              onChange={(e) => setOperation(e.target.value)}
              className="w-full px-4 py-3 border border-brand-warm-gray rounded-sm text-sm text-brand-dark bg-brand-surface focus:outline-none focus:border-brand-sage transition-colors"
            >
              <option value="">Todas</option>
              {OPERATIONS.map((op) => (
                <option key={op.value} value={op.value}>
                  {op.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-brand-dark/60 uppercase tracking-wider mb-2">
              Tipo de propiedad
            </label>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="w-full px-4 py-3 border border-brand-warm-gray rounded-sm text-sm text-brand-dark bg-brand-surface focus:outline-none focus:border-brand-sage transition-colors"
            >
              <option value="">Todas</option>
              {PROPERTY_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-brand-dark/60 uppercase tracking-wider mb-2">
              Ubicación
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ciudad o barrio"
              className="w-full px-4 py-3 border border-brand-warm-gray rounded-sm text-sm text-brand-dark placeholder:text-brand-medium-gray focus:outline-none focus:border-brand-sage transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full px-8 py-3 bg-brand-sage text-white text-sm font-medium tracking-wide hover:bg-brand-sage-dark transition-colors"
          >
            Buscar propiedades
          </button>
        </form>
      </div>
    </section>
  );
}
