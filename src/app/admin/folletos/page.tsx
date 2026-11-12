"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import ErrorNotice from "@/components/admin/ErrorNotice";
import { FLYER_SIZES } from "@/lib/flyers/config";
import { errorMessage, fetchJson } from "@/lib/admin-fetch";
import {
  FLYER_MAX_CHIPS,
  FLYER_MAX_PHOTOS,
  FLYER_TEMPLATES,
  FLYER_TEMPLATE_LABELS,
  type FlyerData,
  type FlyerTemplate,
} from "@/lib/flyers/types";

interface PropertyOption {
  id: number;
  title: string;
  status: string;
}

interface FlyerSource {
  property: { id: number; title: string; slug: string; status: string; images: string[] };
  flyers: Record<FlyerTemplate, FlyerData>;
}

const inputClass =
  "w-full px-3 py-2.5 border border-brand-warm-gray rounded-sm text-sm bg-brand-surface text-brand-dark focus:outline-none focus:border-brand-sage transition-colors";
const labelClass = "block text-xs font-medium text-brand-dark/60 uppercase tracking-wider mb-1.5";
const cardClass = "bg-brand-surface border border-brand-warm-gray/50 p-5";

async function requestFlyer(propertyId: number, data: FlyerData, format: "pdf" | "jpg") {
  let response: Response;
  try {
    response = await fetch("/api/folletos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ propertyId, data, format }),
    });
  } catch {
    throw new Error("No se pudo conectar con el servidor. Revisá tu conexión.");
  }

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    if (response.status === 401) throw new Error("Tu sesión venció. Volvé a ingresar.");
    throw new Error(payload?.error || `No se pudo generar el folleto (${response.status}).`);
  }

  return response.blob();
}

function FlyersTool() {
  const searchParams = useSearchParams();
  const [initialId] = useState(() => {
    const fromLink = Number(searchParams.get("propiedad"));
    return Number.isInteger(fromLink) && fromLink > 0 ? fromLink : null;
  });
  const [options, setOptions] = useState<PropertyOption[]>([]);
  const [propertyId, setPropertyId] = useState<number | null>(initialId);
  const [source, setSource] = useState<FlyerSource | null>(null);
  const [drafts, setDrafts] = useState<Record<FlyerTemplate, FlyerData> | null>(null);
  const [template, setTemplate] = useState<FlyerTemplate>("story");
  const [previewUrl, setPreviewUrl] = useState("");
  const [busy, setBusy] = useState<"" | "load" | "preview" | "pdf" | "jpg">(initialId ? "load" : "");
  const [error, setError] = useState("");
  const previewRef = useRef("");

  useEffect(() => {
    fetchJson<PropertyOption[]>("/api/propiedades")
      .then(setOptions)
      .catch((e) => setError(errorMessage(e)));
  }, []);

  useEffect(
    () => () => {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    },
    []
  );

  const showPreview = useCallback(async (id: number, data: FlyerData) => {
    setBusy("preview");
    setError("");
    try {
      const blob = await requestFlyer(id, data, "jpg");
      const url = URL.createObjectURL(blob);
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
      previewRef.current = url;
      setPreviewUrl(url);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy("");
    }
  }, []);

  const applyFlyers = useCallback(
    (id: number, result: FlyerSource) => {
      setSource(result);
      setDrafts(result.flyers);
      setBusy("");
      void showPreview(id, result.flyers.story);
    },
    [showPreview]
  );

  function chooseProperty(id: number) {
    setPropertyId(id);
    setTemplate("story");
    setBusy("load");
    setError("");
    fetchJson<FlyerSource>(`/api/folletos?propertyId=${id}`)
      .then((result) => applyFlyers(id, result))
      .catch((e) => {
        setError(errorMessage(e));
        setBusy("");
      });
  }

  useEffect(() => {
    if (!initialId) return;
    fetchJson<FlyerSource>(`/api/folletos?propertyId=${initialId}`)
      .then((result) => applyFlyers(initialId, result))
      .catch((e) => {
        setError(errorMessage(e));
        setBusy("");
      });
  }, [initialId, applyFlyers]);

  const data = drafts?.[template] ?? null;

  function update(patch: Partial<FlyerData>) {
    setDrafts((current) => (current ? { ...current, [template]: { ...current[template], ...patch } } : current));
  }

  function updateChip(index: number, patch: Partial<FlyerData["chips"][number]>) {
    if (!data) return;
    update({ chips: data.chips.map((chip, i) => (i === index ? { ...chip, ...patch } : chip)) });
  }

  function togglePhoto(url: string) {
    if (!data) return;
    if (data.photos.includes(url)) {
      if (data.photos.length === 1) return;
      update({ photos: data.photos.filter((item) => item !== url) });
    } else if (data.photos.length < FLYER_MAX_PHOTOS[template]) {
      update({ photos: [...data.photos, url] });
    }
  }

  function cleanData(value: FlyerData): FlyerData {
    return {
      ...value,
      chips: value.chips.filter((chip) => chip.text.trim()),
      features: value.features.filter((feature) => feature.trim()),
    };
  }

  async function download(format: "pdf" | "jpg") {
    if (!data || !propertyId) return;
    setBusy(format);
    setError("");
    try {
      const blob = await requestFlyer(propertyId, cleanData(data), format);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `folleto-${source?.property.slug ?? propertyId}-${template === "price" ? "precio" : "historia"}.${format}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy("");
    }
  }

  const working = busy !== "";

  return (
    <div>
      <h1 className="text-2xl font-serif font-medium text-brand-dark mb-2">Folletos</h1>
      <p className="text-sm text-brand-medium-gray mb-8">
        Elegí una propiedad cargada, revisá los textos y descargá el folleto en PDF.
      </p>

      <ErrorNotice message={error} />

      <div className={`${cardClass} mb-6`}>
        <label className={labelClass} htmlFor="flyer-property">
          Propiedad
        </label>
        <select
          id="flyer-property"
          value={propertyId ?? ""}
          disabled={working}
          onChange={(e) => e.target.value && chooseProperty(Number(e.target.value))}
          className={inputClass}
        >
          <option value="">Seleccioná una propiedad…</option>
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.title}
              {option.status !== "published" ? ` (${option.status === "paused" ? "pausada" : "borrador"})` : ""}
            </option>
          ))}
        </select>
        {busy === "load" && <p className="mt-3 text-sm text-brand-medium-gray">Cargando propiedad…</p>}
      </div>

      {data && source && drafts && (
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_420px]">
          <div className="space-y-6 min-w-0">
            <div className={cardClass}>
              <p className={labelClass}>Plantilla</p>
              <div className="flex flex-wrap gap-2">
                {FLYER_TEMPLATES.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setTemplate(item)}
                    className={`px-4 py-2 text-sm border transition-colors ${
                      template === item
                        ? "bg-brand-sage text-white border-brand-sage"
                        : "border-brand-warm-gray text-brand-dark/70 hover:border-brand-sage"
                    }`}
                  >
                    {FLYER_TEMPLATE_LABELS[item]}
                  </button>
                ))}
              </div>
            </div>

            <div className={`${cardClass} space-y-4`}>
              <h2 className="text-lg font-serif font-medium text-brand-dark">Encabezado</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <label className={labelClass}>Etiqueta</label>
                  <select value={data.badge} onChange={(e) => update({ badge: e.target.value })} className={inputClass}>
                    <option value="VENTA">VENTA</option>
                    <option value="ALQUILER">ALQUILER</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Zona (título grande)</label>
                  <input
                    value={data.zone}
                    maxLength={40}
                    onChange={(e) => update({ zone: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Subtítulo</label>
                <input
                  value={data.subtitle}
                  maxLength={64}
                  onChange={(e) => update({ subtitle: e.target.value })}
                  className={inputClass}
                />
                <p className="mt-1.5 text-xs text-brand-medium-gray">Separá los datos con “ · ” (espacio, punto medio, espacio).</p>
              </div>
            </div>

            {template === "story" && (
              <div className={`${cardClass} space-y-4`}>
                <h2 className="text-lg font-serif font-medium text-brand-dark">Título del recuadro</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className={labelClass}>Título</label>
                    <input
                      value={data.headline}
                      maxLength={60}
                      onChange={(e) => update({ headline: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Parte resaltada (color cobre)</label>
                    <input
                      value={data.headlineAccent}
                      maxLength={30}
                      onChange={(e) => update({ headlineAccent: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            )}

            {template === "price" && (
              <div className={`${cardClass} space-y-4`}>
                <h2 className="text-lg font-serif font-medium text-brand-dark">Precio y estado</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className={labelClass}>Precio</label>
                    <input
                      value={data.price}
                      maxLength={24}
                      placeholder="USD 149.000"
                      onChange={(e) => update({ price: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Detalle bajo el precio</label>
                    <input
                      value={data.priceNote}
                      maxLength={40}
                      placeholder="2º piso · Contrafrente"
                      onChange={(e) => update({ priceNote: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.reserved}
                    onChange={(e) => update({ reserved: e.target.checked })}
                    className="w-4 h-4 accent-brand-sage"
                  />
                  <span className="text-sm text-brand-dark">Marcar como RESERVADO (cinta diagonal sobre la foto)</span>
                </label>
                <div>
                  <p className={labelClass}>Tres destacados (recuadros bajo las fotos)</p>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    {[0, 1, 2].map((i) => (
                      <input
                        key={i}
                        value={data.features[i] ?? ""}
                        maxLength={28}
                        onChange={(e) => {
                          const next = [0, 1, 2].map((n) => (n === i ? e.target.value : (data.features[n] ?? "")));
                          update({ features: next });
                        }}
                        className={inputClass}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className={`${cardClass} space-y-4`}>
              <h2 className="text-lg font-serif font-medium text-brand-dark">
                {template === "story" ? "Descripción y características" : "Características y descripción"}
              </h2>
              <div>
                <label className={labelClass}>Descripción</label>
                <textarea
                  value={data.description}
                  maxLength={220}
                  rows={3}
                  onChange={(e) => update({ description: e.target.value })}
                  className={`${inputClass} resize-none`}
                />
                <p className="mt-1.5 text-xs text-brand-medium-gray">{data.description.length}/220 caracteres. Mejor corta: entra en dos líneas.</p>
              </div>
              <div>
                <p className={labelClass}>
                  Características ({data.chips.length}/{FLYER_MAX_CHIPS[template]})
                </p>
                <div className="space-y-2">
                  {data.chips.map((chip, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        value={chip.text}
                        maxLength={40}
                        onChange={(e) => updateChip(i, { text: e.target.value })}
                        className={inputClass}
                      />
                      {template === "story" && (
                        <label className="flex shrink-0 items-center gap-1.5 text-xs text-brand-dark/70 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={Boolean(chip.highlight)}
                            onChange={(e) => updateChip(i, { highlight: e.target.checked })}
                            className="accent-brand-sage"
                          />
                          Resaltar
                        </label>
                      )}
                      <button
                        type="button"
                        aria-label="Quitar característica"
                        onClick={() => update({ chips: data.chips.filter((_, n) => n !== i) })}
                        className="shrink-0 px-2 py-1 text-lg leading-none text-brand-medium-gray hover:text-red-500 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  disabled={data.chips.length >= FLYER_MAX_CHIPS[template]}
                  onClick={() => update({ chips: [...data.chips, { text: "" }] })}
                  className="mt-3 px-3 py-1.5 text-xs border border-brand-warm-gray text-brand-dark hover:border-brand-sage transition-colors disabled:opacity-40"
                >
                  + Agregar característica
                </button>
              </div>
            </div>

            <div className={cardClass}>
              <h2 className="text-lg font-serif font-medium text-brand-dark mb-1">Fotos</h2>
              <p className="mb-4 text-xs text-brand-medium-gray">
                Hacé clic para elegir hasta {FLYER_MAX_PHOTOS[template]}. El número indica el orden: la 1 es la foto grande.
              </p>
              {source.property.images.length === 0 ? (
                <p className="text-sm text-brand-medium-gray">Esta propiedad no tiene fotos cargadas.</p>
              ) : (
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
                  {source.property.images.map((url) => {
                    const position = data.photos.indexOf(url);
                    const selected = position !== -1;
                    return (
                      <button
                        key={url}
                        type="button"
                        onClick={() => togglePhoto(url)}
                        aria-pressed={selected}
                        className={`relative aspect-[4/3] overflow-hidden border-2 transition-colors ${
                          selected ? "border-brand-sage" : "border-transparent opacity-60 hover:opacity-100"
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url} alt="" loading="lazy" className="h-full w-full object-cover" />
                        {selected && (
                          <span className="absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-brand-sage text-xs font-medium text-white">
                            {position + 1}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="mx-auto w-full max-w-[420px] xl:sticky xl:top-6 xl:max-w-none xl:self-start">
            <div className={cardClass}>
              <div
                className="relative w-full bg-brand-cream border border-brand-warm-gray/40"
                style={{ aspectRatio: `${FLYER_SIZES[template].width} / ${FLYER_SIZES[template].height}` }}
              >
                {previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewUrl}
                    alt="Vista previa del folleto"
                    className={`h-full w-full object-contain transition-opacity ${busy === "preview" ? "opacity-40" : ""}`}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center px-6 text-center text-sm text-brand-medium-gray">
                    La vista previa aparece acá.
                  </div>
                )}
                {busy === "preview" && (
                  <div className="absolute inset-0 flex items-center justify-center text-sm text-brand-dark">Generando…</div>
                )}
              </div>
              <div className="mt-4 flex flex-col gap-2">
                <button
                  type="button"
                  disabled={working}
                  onClick={() => propertyId && void showPreview(propertyId, cleanData(data))}
                  className="px-4 py-2.5 border border-brand-warm-gray text-brand-dark text-sm hover:border-brand-sage transition-colors disabled:opacity-50"
                >
                  {busy === "preview" ? "Generando vista previa…" : "Actualizar vista previa"}
                </button>
                <button
                  type="button"
                  disabled={working}
                  onClick={() => void download("pdf")}
                  className="px-4 py-2.5 bg-brand-sage text-white text-sm font-medium hover:bg-brand-sage-dark transition-colors disabled:opacity-50"
                >
                  {busy === "pdf" ? "Preparando PDF…" : "Descargar PDF"}
                </button>
                <button
                  type="button"
                  disabled={working}
                  onClick={() => void download("jpg")}
                  className="px-4 py-2.5 border border-brand-warm-gray text-brand-dark text-sm hover:border-brand-sage transition-colors disabled:opacity-50"
                >
                  {busy === "jpg" ? "Preparando imagen…" : "Descargar imagen (JPG)"}
                </button>
              </div>
              <p className="mt-3 text-xs text-brand-medium-gray">
                La vista previa no cambia sola: actualizala después de editar los textos o las fotos.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function FlyersPage() {
  return (
    <Suspense fallback={<p className="text-sm text-brand-medium-gray">Cargando…</p>}>
      <FlyersTool />
    </Suspense>
  );
}
