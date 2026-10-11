"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ErrorNotice from "@/components/admin/ErrorNotice";
import { errorMessage, fetchJson, sendJson } from "@/lib/admin-fetch";
import { OPERATIONS, PROPERTY_TYPES, CURRENCIES, PROPERTY_STATUS, AMENITIES_LIST } from "@/lib/constants";

const MAX_IMAGE_SIDE = 2400;
const RESIZE_ABOVE_BYTES = 1.5 * 1024 * 1024;

// Phone photos exceed the 4 MB upload limit, so large files are downscaled in the browser first.
async function prepareImage(file: File): Promise<File> {
  if (file.size <= RESIZE_ABOVE_BYTES) return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_IMAGE_SIDE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.85)
    );
    if (!blob) return file;

    return new File([blob], `${file.name.replace(/\.[^.]+$/, "")}.jpg`, {
      type: "image/jpeg",
    });
  } catch {
    return file;
  }
}

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
  const [saveError, setSaveError] = useState("");
  const unsavedUploads = useRef(new Set<string>());

  useEffect(() => {
    const uploads = unsavedUploads.current;
    return () => {
      for (const url of uploads) {
        void fetch("/api/upload", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
          keepalive: true,
        }).catch(() => {});
      }
    };
  }, []);

  function update<K extends keyof PropertyFormData>(key: K, value: PropertyFormData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function addImage() {
    if (!imageUrl.trim()) return;
    update("images", [...form.images, imageUrl.trim()]);
    setImageUrl("");
  }

  function removeImage(index: number) {
    const removedUrl = form.images[index];
    update("images", form.images.filter((_, i) => i !== index));
    if (unsavedUploads.current.has(removedUrl)) {
      unsavedUploads.current.delete(removedUrl);
      void fetchJson("/api/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: removedUrl }),
      }).catch((error) => setUploadError(errorMessage(error)));
    }
  }

  async function uploadImages(files: FileList | null) {
    if (!files?.length) return;

    setUploadingImages(true);
    setUploadError("");

    // One at a time: the images that did upload are kept even if a later one fails.
    try {
      for (const original of Array.from(files)) {
        const payload = new FormData();
        payload.append("file", await prepareImage(original));

        const result = await fetchJson<{ url: string }>("/api/upload", {
          method: "POST",
          body: payload,
        });
        unsavedUploads.current.add(result.url);
        setForm((current) => ({ ...current, images: [...current.images, result.url] }));
      }
    } catch (error) {
      setUploadError(errorMessage(error));
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
    setSaveError("");

    const url = isEditing ? `/api/propiedades/${form.id}` : "/api/propiedades";

    try {
      await sendJson(url, isEditing ? "PUT" : "POST", form);
      unsavedUploads.current.clear();
      router.push("/admin/propiedades");
      router.refresh();
    } catch (error) {
      setSaveError(errorMessage(error));
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
            <label htmlFor="property-title" className={labelClass}>Título *</label>
            <input id="property-title" type="text" required value={form.title} onChange={(e) => update("title", e.target.value)} className={inputClass} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="property-operation" className={labelClass}>Operación *</label>
              <select id="property-operation" value={form.operation} onChange={(e) => update("operation", e.target.value)} className={inputClass}>
                {OPERATIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="property-type" className={labelClass}>Tipo *</label>
              <select id="property-type" value={form.propertyType} onChange={(e) => update("propertyType", e.target.value)} className={inputClass}>
                {PROPERTY_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="property-status" className={labelClass}>Estado</label>
              <select id="property-status" value={form.status} onChange={(e) => update("status", e.target.value)} className={inputClass}>
                {PROPERTY_STATUS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="property-currency" className={labelClass}>Moneda</label>
              <select id="property-currency" value={form.currency} onChange={(e) => update("currency", e.target.value)} className={inputClass}>
                {CURRENCIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="property-price" className={labelClass}>Precio</label>
              <input id="property-price" type="number" min="0" step="any" value={form.price} onChange={(e) => update("price", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label htmlFor="property-expenses" className={labelClass}>Expensas</label>
              <input id="property-expenses" type="number" min="0" step="any" value={form.expenses} onChange={(e) => update("expenses", e.target.value)} className={inputClass} />
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
          <div><label htmlFor="property-address" className={labelClass}>Dirección</label><input id="property-address" type="text" value={form.address} onChange={(e) => update("address", e.target.value)} className={inputClass} /></div>
          <div><label htmlFor="property-neighborhood" className={labelClass}>Barrio</label><input id="property-neighborhood" type="text" value={form.neighborhood} onChange={(e) => update("neighborhood", e.target.value)} className={inputClass} /></div>
          <div><label htmlFor="property-city" className={labelClass}>Ciudad</label><input id="property-city" type="text" value={form.city} onChange={(e) => update("city", e.target.value)} className={inputClass} /></div>
          <div><label htmlFor="property-province" className={labelClass}>Provincia</label><input id="property-province" type="text" value={form.province} onChange={(e) => update("province", e.target.value)} className={inputClass} /></div>
        </div>
      </div>

      <div className="bg-brand-surface border border-brand-warm-gray/50 p-6">
        <h2 className="text-lg font-serif font-medium text-brand-dark mb-4">Características</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-4">
          <div><label htmlFor="property-total-area" className={labelClass}>Sup. total m²</label><input id="property-total-area" type="number" min="0" step="any" value={form.totalArea} onChange={(e) => update("totalArea", e.target.value)} className={inputClass} /></div>
          <div><label htmlFor="property-covered-area" className={labelClass}>Sup. cubierta m²</label><input id="property-covered-area" type="number" min="0" step="any" value={form.coveredArea} onChange={(e) => update("coveredArea", e.target.value)} className={inputClass} /></div>
          <div><label htmlFor="property-rooms" className={labelClass}>Ambientes</label><input id="property-rooms" type="number" min="0" step="1" value={form.rooms} onChange={(e) => update("rooms", e.target.value)} className={inputClass} /></div>
          <div><label htmlFor="property-bedrooms" className={labelClass}>Dormitorios</label><input id="property-bedrooms" type="number" min="0" step="1" value={form.bedrooms} onChange={(e) => update("bedrooms", e.target.value)} className={inputClass} /></div>
          <div><label htmlFor="property-bathrooms" className={labelClass}>Baños</label><input id="property-bathrooms" type="number" min="0" step="1" value={form.bathrooms} onChange={(e) => update("bathrooms", e.target.value)} className={inputClass} /></div>
          <div><label htmlFor="property-garages" className={labelClass}>Cocheras</label><input id="property-garages" type="number" min="0" step="1" value={form.garages} onChange={(e) => update("garages", e.target.value)} className={inputClass} /></div>
          <div><label htmlFor="property-age" className={labelClass}>Antigüedad</label><input id="property-age" type="number" min="0" step="1" value={form.age} onChange={(e) => update("age", e.target.value)} className={inputClass} /></div>
        </div>
      </div>

      <div className="bg-brand-surface border border-brand-warm-gray/50 p-6">
        <h2 className="text-lg font-serif font-medium text-brand-dark mb-4">Descripción</h2>
        <label htmlFor="property-description" className="sr-only">Descripción de la propiedad</label>
        <textarea id="property-description" value={form.description} onChange={(e) => update("description", e.target.value)} rows={6} className={inputClass + " resize-none"} placeholder="Descripción de la propiedad..." />
      </div>

      <div className="bg-brand-surface border border-brand-warm-gray/50 p-6">
        <h2 className="text-lg font-serif font-medium text-brand-dark mb-4">Amenities</h2>
        <div className="flex flex-wrap gap-2">
          {AMENITIES_LIST.map((a) => (
            <button key={a} type="button" aria-pressed={form.amenities.includes(a)} onClick={() => toggleAmenity(a)} className={`px-3 py-1.5 text-xs border transition-colors ${form.amenities.includes(a) ? "bg-brand-sage text-white border-brand-sage" : "border-brand-warm-gray text-brand-dark/60 hover:border-brand-sage"}`}>
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
            JPG, PNG, WebP o AVIF. Las fotos grandes se optimizan automáticamente antes de subir.
          </span>
        </label>
        {uploadingImages && (
          <p className="mb-4 text-sm text-brand-medium-gray">Subiendo imágenes...</p>
        )}
        {uploadError && (
          <p className="mb-4 text-sm text-red-600">{uploadError}</p>
        )}
        <div className="flex gap-2 mb-4">
          <input type="url" aria-label="URL de la imagen" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="URL de la imagen" className={inputClass} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addImage(); } }} />
          <button type="button" onClick={addImage} className="px-4 py-2 bg-brand-sage text-white text-sm shrink-0 hover:bg-brand-sage-dark transition-colors">Agregar</button>
        </div>
        {form.images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {form.images.map((img, i) => (
              <div key={i} className="relative aspect-[4/3] bg-cover bg-center group" style={{ backgroundImage: `url('${img}')` }}>
                <button type="button" aria-label={`Quitar imagen ${i + 1}`} onClick={() => removeImage(i)} className="absolute top-1 right-1 w-7 h-7 bg-red-500 text-white rounded-full text-xs opacity-100 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100 transition-opacity flex items-center justify-center">×</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-brand-surface border border-brand-warm-gray/50 p-6">
        <h2 className="text-lg font-serif font-medium text-brand-dark mb-4">Link externo</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label htmlFor="property-external-url" className={labelClass}>URL original</label><input id="property-external-url" type="url" value={form.externalUrl} onChange={(e) => update("externalUrl", e.target.value)} className={inputClass} /></div>
          <div><label htmlFor="property-external-source" className={labelClass}>Plataforma</label>
            <select id="property-external-source" value={form.externalSource} onChange={(e) => update("externalSource", e.target.value)} className={inputClass}>
              <option value="manual">Manual</option>
              <option value="zonaprop">Zonaprop</option>
              <option value="argenprop">Argenprop</option>
              <option value="mercadolibre">MercadoLibre</option>
            </select>
          </div>
        </div>
      </div>

      <ErrorNotice message={saveError} />

      <div className="flex flex-wrap gap-4">
        <button type="submit" disabled={saving || uploadingImages} className="px-8 py-3 bg-brand-sage text-white text-sm font-medium hover:bg-brand-sage-dark transition-colors disabled:opacity-50">
          {saving ? "Guardando..." : isEditing ? "Guardar cambios" : "Crear propiedad"}
        </button>
        <button type="button" onClick={() => router.back()} className="px-8 py-3 border border-brand-warm-gray text-brand-dark text-sm hover:bg-brand-sage hover:text-white hover:border-brand-sage transition-colors">
          Cancelar
        </button>
      </div>
    </form>
  );
}
