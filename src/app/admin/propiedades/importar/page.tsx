"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OPERATIONS, PROPERTY_TYPES, CURRENCIES, AMENITIES_LIST } from "@/lib/constants";

interface ScrapedData {
  title: string;
  operation: string;
  propertyType: string;
  price: string;
  currency: string;
  expenses: string;
  address: string;
  neighborhood: string;
  city: string;
  description: string;
  totalArea: string;
  coveredArea: string;
  rooms: string;
  bedrooms: string;
  bathrooms: string;
  garages: string;
  age: string;
  amenities: string[];
  images: string[];
  source: string;
  externalUrl: string;
  warning?: string;
}

export default function ImportPropertyPage() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<ScrapedData | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleScrape() {
    if (!url.trim()) return;
    setLoading(true);
    setError("");
    setData(null);

    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Error al importar");
      setData(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }

  function updateField<K extends keyof ScrapedData>(key: K, value: ScrapedData[K]) {
    if (!data) return;
    setData({ ...data, [key]: value });
  }

  function toggleAmenity(amenity: string) {
    if (!data) return;
    updateField("amenities",
      data.amenities.includes(amenity)
        ? data.amenities.filter((a) => a !== amenity)
        : [...data.amenities, amenity]
    );
  }

  function removeImage(index: number) {
    if (!data) return;
    updateField("images", data.images.filter((_, i) => i !== index));
  }

  async function handlePublish() {
    if (!data || !data.title) return;
    setSaving(true);

    try {
      const res = await fetch("/api/propiedades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.title,
          operation: data.operation,
          propertyType: data.propertyType,
          status: "draft",
          featured: false,
          price: data.price ? Number(data.price) : null,
          currency: data.currency,
          expenses: data.expenses ? Number(data.expenses) : null,
          address: data.address,
          neighborhood: data.neighborhood,
          city: data.city,
          province: "Ciudad Autónoma de Buenos Aires",
          description: data.description,
          totalArea: data.totalArea ? Number(data.totalArea) : null,
          coveredArea: data.coveredArea ? Number(data.coveredArea) : null,
          rooms: data.rooms ? Number(data.rooms) : null,
          bedrooms: data.bedrooms ? Number(data.bedrooms) : null,
          bathrooms: data.bathrooms ? Number(data.bathrooms) : null,
          garages: data.garages ? Number(data.garages) : null,
          age: data.age ? Number(data.age) : null,
          amenities: data.amenities,
          images: data.images,
          externalUrl: data.externalUrl,
          externalSource: data.source,
        }),
      });

      if (res.ok) {
        router.push("/admin/propiedades");
        router.refresh();
      } else {
        throw new Error("Error al guardar");
      }
    } catch {
      alert("Error al guardar la propiedad");
    } finally {
      setSaving(false);
    }
  }

  const inputClass = "w-full px-3 py-2.5 border border-brand-warm-gray rounded-sm text-sm bg-brand-surface text-brand-dark focus:outline-none focus:border-brand-sage transition-colors";
  const labelClass = "block text-xs font-medium text-brand-dark/60 uppercase tracking-wider mb-1.5";

  return (
    <div>
      <h1 className="text-2xl font-serif font-medium text-brand-dark mb-8">Importar propiedad por link</h1>

      <div className="bg-brand-surface border border-brand-warm-gray/50 p-6 mb-8">
        <p className="text-sm text-brand-medium-gray mb-4">
          Pegá el link de una propiedad de Zonaprop, Argenprop o MercadoLibre. Se extraerán los datos disponibles para que puedas editarlos antes de publicar.
        </p>
        <div className="flex gap-3">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.zonaprop.com.ar/propiedades/..."
            className={inputClass}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleScrape(); } }}
          />
          <button
            onClick={handleScrape}
            disabled={loading || !url.trim()}
            className="px-6 py-2.5 bg-brand-sage text-white text-sm font-medium shrink-0 hover:bg-brand-sage-dark transition-colors disabled:opacity-50"
          >
            {loading ? "Extrayendo..." : "Extraer datos"}
          </button>
        </div>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </div>

      {data && (
        <div className="space-y-6">
          {data.warning && (
            <div className="bg-amber-500/10 border border-amber-500/35 p-5 text-sm text-amber-300 rounded-sm flex items-start gap-3">
              <svg className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <span className="font-semibold block mb-0.5">Extracción automática bloqueada</span>
                {data.warning}
              </div>
            </div>
          )}
          <div className="flex items-center gap-3 mb-2">
            <span className="px-2 py-1 text-xs uppercase tracking-wider bg-brand-cream text-brand-dark">
              {data.source}
            </span>
            <span className="text-xs text-brand-medium-gray">
              Revisá y editá los datos antes de publicar
            </span>
          </div>

          <div className="bg-brand-surface border border-brand-warm-gray/50 p-6">
            <h2 className="text-lg font-serif font-medium text-brand-dark mb-4">Información principal</h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Título *</label>
                <input type="text" value={data.title} onChange={(e) => updateField("title", e.target.value)} className={inputClass} />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className={labelClass}>Operación</label>
                  <select value={data.operation} onChange={(e) => updateField("operation", e.target.value)} className={inputClass}>
                    {OPERATIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Tipo</label>
                  <select value={data.propertyType} onChange={(e) => updateField("propertyType", e.target.value)} className={inputClass}>
                    {PROPERTY_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Moneda</label>
                  <select value={data.currency} onChange={(e) => updateField("currency", e.target.value)} className={inputClass}>
                    {CURRENCIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Precio</label>
                  <input type="number" value={data.price} onChange={(e) => updateField("price", e.target.value)} className={inputClass} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Expensas</label>
                <input type="number" value={data.expenses} onChange={(e) => updateField("expenses", e.target.value)} className={`${inputClass} max-w-xs`} />
              </div>
            </div>
          </div>

          <div className="bg-brand-surface border border-brand-warm-gray/50 p-6">
            <h2 className="text-lg font-serif font-medium text-brand-dark mb-4">Ubicación</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div><label className={labelClass}>Dirección</label><input type="text" value={data.address} onChange={(e) => updateField("address", e.target.value)} className={inputClass} /></div>
              <div><label className={labelClass}>Barrio</label><input type="text" value={data.neighborhood} onChange={(e) => updateField("neighborhood", e.target.value)} className={inputClass} /></div>
              <div><label className={labelClass}>Ciudad</label><input type="text" value={data.city} onChange={(e) => updateField("city", e.target.value)} className={inputClass} /></div>
            </div>
          </div>

          <div className="bg-brand-surface border border-brand-warm-gray/50 p-6">
            <h2 className="text-lg font-serif font-medium text-brand-dark mb-4">Características</h2>
            <div className="grid grid-cols-3 md:grid-cols-7 gap-4">
              <div><label className={labelClass}>Sup. total m²</label><input type="number" value={data.totalArea} onChange={(e) => updateField("totalArea", e.target.value)} className={inputClass} /></div>
              <div><label className={labelClass}>Sup. cubierta m²</label><input type="number" value={data.coveredArea} onChange={(e) => updateField("coveredArea", e.target.value)} className={inputClass} /></div>
              <div><label className={labelClass}>Ambientes</label><input type="number" value={data.rooms} onChange={(e) => updateField("rooms", e.target.value)} className={inputClass} /></div>
              <div><label className={labelClass}>Dormitorios</label><input type="number" value={data.bedrooms} onChange={(e) => updateField("bedrooms", e.target.value)} className={inputClass} /></div>
              <div><label className={labelClass}>Baños</label><input type="number" value={data.bathrooms} onChange={(e) => updateField("bathrooms", e.target.value)} className={inputClass} /></div>
              <div><label className={labelClass}>Cocheras</label><input type="number" value={data.garages} onChange={(e) => updateField("garages", e.target.value)} className={inputClass} /></div>
              <div><label className={labelClass}>Antigüedad</label><input type="number" value={data.age} onChange={(e) => updateField("age", e.target.value)} className={inputClass} /></div>
            </div>
          </div>

          <div className="bg-brand-surface border border-brand-warm-gray/50 p-6">
            <h2 className="text-lg font-serif font-medium text-brand-dark mb-4">Descripción</h2>
            <textarea value={data.description} onChange={(e) => updateField("description", e.target.value)} rows={6} className={inputClass + " resize-none"} />
          </div>

          <div className="bg-brand-surface border border-brand-warm-gray/50 p-6">
            <h2 className="text-lg font-serif font-medium text-brand-dark mb-4">Amenities</h2>
            <div className="flex flex-wrap gap-2">
              {AMENITIES_LIST.map((a) => (
                <button key={a} type="button" onClick={() => toggleAmenity(a)} className={`px-3 py-1.5 text-xs border transition-colors ${data.amenities.includes(a) ? "bg-brand-sage text-white border-brand-sage" : "border-brand-warm-gray text-brand-dark/60 hover:border-brand-sage"}`}>
                  {a}
                </button>
              ))}
            </div>
          </div>

          {data.images.length > 0 && (
            <div className="bg-brand-surface border border-brand-warm-gray/50 p-6">
              <h2 className="text-lg font-serif font-medium text-brand-dark mb-4">
                Imágenes extraídas ({data.images.length})
              </h2>
              <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                {data.images.map((img, i) => (
                  <div key={i} className="relative aspect-[4/3] bg-cover bg-center bg-brand-cream group" style={{ backgroundImage: `url('${img}')` }}>
                    <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={handlePublish}
              disabled={saving || !data.title}
              className="px-8 py-3 bg-brand-sage text-white text-sm font-medium hover:bg-brand-sage-dark transition-colors disabled:opacity-50"
            >
              {saving ? "Guardando..." : "Guardar como borrador"}
            </button>
            <button
              onClick={() => { setData(null); setUrl(""); }}
              className="px-8 py-3 border border-brand-warm-gray text-brand-dark text-sm hover:bg-brand-sage hover:text-white hover:border-brand-sage transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
