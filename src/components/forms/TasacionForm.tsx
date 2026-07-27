"use client";

import { useState } from "react";
import { OPERATIONS, PROPERTY_TYPES } from "@/lib/constants";

export default function TasacionForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/tasaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          phone: data.get("phone"),
          propertyType: data.get("propertyType"),
          operation: data.get("operation"),
          location: data.get("location"),
          message: data.get("message"),
        }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="text-center py-8">
        <svg className="w-12 h-12 mx-auto text-brand-sage mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-lg font-serif text-brand-dark mb-2">Solicitud enviada</h3>
        <p className="text-sm text-brand-dark/60">Nos comunicaremos a la brevedad para coordinar la tasación.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="name" type="text" required placeholder="Nombre completo *" className="w-full px-4 py-3 border border-brand-warm-gray rounded-sm text-sm bg-brand-surface text-brand-dark placeholder:text-brand-medium-gray focus:outline-none focus:border-brand-sage transition-colors" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input name="email" type="email" required placeholder="Email *" className="w-full px-4 py-3 border border-brand-warm-gray rounded-sm text-sm bg-brand-surface text-brand-dark placeholder:text-brand-medium-gray focus:outline-none focus:border-brand-sage transition-colors" />
        <input name="phone" type="tel" required placeholder="Teléfono *" className="w-full px-4 py-3 border border-brand-warm-gray rounded-sm text-sm bg-brand-surface text-brand-dark placeholder:text-brand-medium-gray focus:outline-none focus:border-brand-sage transition-colors" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <select name="propertyType" required className="w-full px-4 py-3 border border-brand-warm-gray rounded-sm text-sm text-brand-dark bg-brand-surface focus:outline-none focus:border-brand-sage transition-colors">
          <option value="">Tipo de propiedad *</option>
          {PROPERTY_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
        <select name="operation" required className="w-full px-4 py-3 border border-brand-warm-gray rounded-sm text-sm text-brand-dark bg-brand-surface focus:outline-none focus:border-brand-sage transition-colors">
          <option value="">Operación deseada *</option>
          {OPERATIONS.map((op) => (
            <option key={op.value} value={op.value}>{op.label}</option>
          ))}
        </select>
      </div>

      <input name="location" type="text" required placeholder="Ubicación de la propiedad *" className="w-full px-4 py-3 border border-brand-warm-gray rounded-sm text-sm bg-brand-surface text-brand-dark placeholder:text-brand-medium-gray focus:outline-none focus:border-brand-sage transition-colors" />

      <textarea name="message" rows={3} placeholder="Comentarios adicionales..." className="w-full px-4 py-3 border border-brand-warm-gray rounded-sm text-sm bg-brand-surface text-brand-dark placeholder:text-brand-medium-gray focus:outline-none focus:border-brand-sage transition-colors resize-none" />

      <button type="submit" disabled={status === "loading"} className="w-full px-6 py-3 bg-brand-sage text-white text-sm font-medium tracking-wide hover:bg-brand-sage-dark transition-colors disabled:opacity-50">
        {status === "loading" ? "Enviando..." : "Solicitar tasación"}
      </button>

      {status === "error" && (
        <p className="text-red-600 text-sm text-center">Hubo un error. Intentá de nuevo.</p>
      )}
    </form>
  );
}
