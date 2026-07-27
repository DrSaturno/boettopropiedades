"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OPERATIONS, PROPERTY_TYPES, CURRENCIES, PROPERTY_STATUS, AMENITIES_LIST } from "@/lib/constants";

interface PropertyFormData {
  id?: number;
  title: string;
  operation: string;
  propertyType: string;
  status: string;
  featured: boolean;
  price: string;
  currency: string;
  expenses: string;
  address: string;
  neighborhood: string;
  city: string;
  province: string;
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
  videoUrl: string;
  externalUrl: string;
  externalSource: string;
}

interface Props {
  initialData?: Partial<PropertyFormData>;
  isEditing?: boolean;
}

const emptyForm: PropertyFormData = {
  title: "", operation: "venta", propertyType: "casa", status: "draft", featured: false,
  price: "", currency: "USD", expenses: "", address: "", neighborhood: "", city: "Capital Federal",
  province: "Ciudad Autónoma de Buenos Aires", description: "", totalArea: "", coveredArea: "", rooms: "", bedrooms: "",
  bathrooms: "", garages: "", age: "", amenities: [], images: [], videoUrl: "", externalUrl: "",
  externalSource: "manual",
};

export default function PropertyForm({ initialData, isEditing }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<PropertyFormData>({ ...emptyForm, ...initialData });
  const [saving, setSaving] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadError, setUploadError] = useState("");

  function update<K extends keyof PropertyFormData>(key: K, value: PropertyFormData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function addImage() {
    if (!imageUrl.trim()) return;
    update("images", [...form.images, imageUrl.trim()]);
    setImageUrl("");
  }

  function removeImage(index: number) {
    update("images", form.images.filter((_, i) => i !== index));
  }

  async function uploadImages(files: FileList | null) {
    if (!files?.length) return;

    setUploadingImages(true);
    setUploadError("");

    try {
      const uploads = await Promise.all(
        Array.from(files).map(async (file) => {
          const payload = new FormData();
          payload.append("file", file);

          const response = await fetch("/api/upload", {
            method: "POST",
            body: payload,
          });
          const result = await response.json();

          if (!response.ok || !result.url) {
            throw new Error(result.error || "No se pudo subir la imagen");
          }

          return result.url as string;
        })
      );

      update("images", [...form.images, ...uploads]);
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : "No se pudieron subir las imágenes"
      );
    } finally {
      setUploadingImages(false);
    }
  }

  function toggleAmenity(amenity: string) {
    update("amenities",
      form.amenities.includes(amenity)
        ? form.amenities.filter((a) => a !== amenity)
        : [...form.amenities, amenity]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.operation || !form.propertyType) return;
    setSaving(true);

    const url = isEditing ? `/api/propiedades/${form.id}` : "/api/propiedades";
    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: form.price ? Number(form.price) : null,
          expenses: form.expenses ? Number(form.expenses) : null,
          totalArea: form.totalArea ? Number(form.totalArea) : null,
          coveredArea: form.coveredArea ? Number(form.coveredArea) : null,
          rooms: form.rooms ? Number(form.rooms) : null,
          bedrooms: form.bedrooms ? Number(form.bedrooms) : null,
          bathrooms: form.bathrooms ? Number(form.bathrooms) : null,
          garages: form.garages ? Number(form.garages) : null,
          age: form.age !== "" ? Number(form.age) : null,
        }),
      });

      if (res.ok) {
        router.push("/admin/propiedades");
        router.refresh();
      }
    } catch {
      alert("Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  const inputClass = "w-full px-3 py-2.5 border border-brand-warm-gray rounded-sm text-sm bg-brand-surface text-brand-dark focus:outline-none focus:border-brand-sage transition-colors";
  const labelClass = "block text-xs font-medium text-brand-dark/60 uppercase tracking-wider mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-brand-surface border border-brand-warm-gray/50 p-6">
        <h2 className="text-lg font-serif font-medium text-brand-dark mb-4">Información principal</h2>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Título *</label>
            <input type="text" required value={form.title} onChange={(e) => update("title", e.target.value)} className={inputClass} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className={labelClass}>Operación *</label>
              <select value={form.operation} onChange={(e) => update("operation", e.target.value)} className={inputClass}>
                {OPERATIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Tipo *</label>
              <select value={form.propertyType} onChange={(e) => update("propertyType", e.target.value)} className={inputClass}>
                {PROPERTY_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Estado</label>
              <select value={form.status} onChange={(e) => update("status", e.target.value)} className={inputClass}>
                {PROPERTY_STATUS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Moneda</label>
              <select value={form.currency} onChange={(e) => update("currency", e.target.value)} className={inputClass}>
                {CURRENCIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Precio</label>
              <input type="number" value={form.price} onChange={(e) => update("price", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Expensas</label>
              <input type="number" value={form.expenses} onChange={(e) => update("expenses", e.target.value)} className={inputClass} />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer py-2.5">
                <input type="checkbox" checked={form.featured} onChange={(e) => update("featured", e.target.checked)} className="w-4 h-4 accent-brand-sage" />
                <span className="text-sm text-brand-dark">Destacada</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-brand-surface border border-brand-warm-gray/50 p-6">
        <h2 className="text-lg font-serif font-medium text-brand-dark mb-4">Ubicación</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div><label className={labelClass}>Dirección</label><input type="text" value={form.address} onChange={(e) => update("address", e.target.value)} className={inputClass} /></div>
          <div><label className={labelClass}>Barrio</label><input type="text" value={form.neighborhood} onChange={(e) => update("neighborhood", e.target.value)} className={inputClass} /></div>
          <div><label className={labelClass}>Ciudad</label><input type="text" value={form.city} onChange={(e) => update("city", e.target.value)} className={inputClass} /></div>
          <div><label className={labelClass}>Provincia</label><input type="text" value={form.province} onChange={(e) => update("province", e.target.value)} className={inputClass} /></div>
        </div>
      </div>

      <div className="bg-brand-surface border border-brand-warm-gray/50 p-6">
        <h2 className="text-lg font-serif font-medium text-brand-dark mb-4">Características</h2>
        <div className="grid grid-cols-3 md:grid-cols-7 gap-4">
          <div><label className={labelClass}>Sup. total m²</label><input type="number" value={form.totalArea} onChange={(e) => update("totalArea", e.target.value)} className={inputClass} /></div>
          <div><label className={labelClass}>Sup. cubierta m²</label><input type="number" value={form.coveredArea} onChange={(e) => update("coveredArea", e.target.value)} className={inputClass} /></div>
          <div><label className={labelClass}>Ambientes</label><input type="number" value={form.rooms} onChange={(e) => update("rooms", e.target.value)} className={inputClass} /></div>
          <div><label className={labelClass}>Dormitorios</label><input type="number" value={form.bedrooms} onChange={(e) => update("bedrooms", e.target.value)} className={inputClass} /></div>
          <div><label className={labelClass}>Baños</label><input type="number" value={form.bathrooms} onChange={(e) => update("bathrooms", e.target.value)} className={inputClass} /></div>
          <div><label className={labelClass}>Cocheras</label><input type="number" value={form.garages} onChange={(e) => update("garages", e.target.value)} className={inputClass} /></div>
          <div><label className={labelClass}>Antigüedad</label><input type="number" value={form.age} onChange={(e) => update("age", e.target.value)} className={inputClass} /></div>
        </div>
      </div>

      <div className="bg-brand-surface border border-brand-warm-gray/50 p-6">
        <h2 className="text-lg font-serif font-medium text-brand-dark mb-4">Descripción</h2>
        <textarea value={form.description} onChange={(e) => update("description", e.target.value)} rows={6} className={inputClass + " resize-none"} placeholder="Descripción de la propiedad..." />
      </div>

      <div className="bg-brand-surface border border-brand-warm-gray/50 p-6">
        <h2 className="text-lg font-serif font-medium text-brand-dark mb-4">Amenities</h2>
        <div className="flex flex-wrap gap-2">
          {AMENITIES_LIST.map((a) => (
            <button key={a} type="button" onClick={() => toggleAmenity(a)} className={`px-3 py-1.5 text-xs border transition-colors ${form.amenities.includes(a) ? "bg-brand-sage text-white border-brand-sage" : "border-brand-warm-gray text-brand-dark/60 hover:border-brand-sage"}`}>
              {a}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-brand-surface border border-brand-warm-gray/50 p-6">
        <h2 className="text-lg font-serif font-medium text-brand-dark mb-4">Imágenes</h2>
        <label className="block mb-4">
          <span className={labelClass}>Subir desde el dispositivo</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            multiple
            disabled={uploadingImages}
            onChange={(event) => {
              void uploadImages(event.target.files);
              event.currentTarget.value = "";
            }}
            className={`${inputClass} file:mr-4 file:border-0 file:bg-brand-dark file:px-4 file:py-2 file:text-xs file:font-medium file:text-white`}
          />
          <span className="mt-2 block text-xs text-brand-medium-gray">
            JPG, PNG, WebP o AVIF. Máximo 10 MB por imagen.
          </span>
        </label>
        {uploadingImages && (
          <p className="mb-4 text-sm text-brand-medium-gray">Subiendo imágenes...</p>
        )}
        {uploadError && (
          <p className="mb-4 text-sm text-red-600">{uploadError}</p>
        )}
        <div className="flex gap-2 mb-4">
          <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="URL de la imagen" className={inputClass} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addImage(); } }} />
          <button type="button" onClick={addImage} className="px-4 py-2 bg-brand-sage text-white text-sm shrink-0 hover:bg-brand-sage-dark transition-colors">Agregar</button>
        </div>
        {form.images.length > 0 && (
          <div className="grid grid-cols-4 gap-3">
            {form.images.map((img, i) => (
              <div key={i} className="relative aspect-[4/3] bg-cover bg-center group" style={{ backgroundImage: `url('${img}')` }}>
                <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">×</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-brand-surface border border-brand-warm-gray/50 p-6">
        <h2 className="text-lg font-serif font-medium text-brand-dark mb-4">Link externo</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className={labelClass}>URL original</label><input type="url" value={form.externalUrl} onChange={(e) => update("externalUrl", e.target.value)} className={inputClass} /></div>
          <div><label className={labelClass}>Plataforma</label>
            <select value={form.externalSource} onChange={(e) => update("externalSource", e.target.value)} className={inputClass}>
              <option value="manual">Manual</option>
              <option value="zonaprop">Zonaprop</option>
              <option value="argenprop">Argenprop</option>
              <option value="mercadolibre">MercadoLibre</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button type="submit" disabled={saving} className="px-8 py-3 bg-brand-sage text-white text-sm font-medium hover:bg-brand-sage-dark transition-colors disabled:opacity-50">
          {saving ? "Guardando..." : isEditing ? "Guardar cambios" : "Crear propiedad"}
        </button>
        <button type="button" onClick={() => router.back()} className="px-8 py-3 border border-brand-warm-gray text-brand-dark text-sm hover:bg-brand-sage hover:text-white hover:border-brand-sage transition-colors">
          Cancelar
        </button>
      </div>
    </form>
  );
}
