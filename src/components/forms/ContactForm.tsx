"use client";

import { useState } from "react";

interface Props {
  propertyId?: number;
  propertyTitle?: string;
  type?: "contact" | "property" | "tasacion";
  variant?: "default" | "editorial";
}

export default function ContactForm({
  propertyId,
  propertyTitle,
  type = "contact",
  variant = "default",
}: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          phone: data.get("phone"),
          message: data.get("message"),
          type,
          propertyId,
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
      <div className={`contact-form__success ${variant === "editorial" ? "contact-form__success--editorial" : ""} bg-brand-sage/10 border border-brand-sage/30 p-8 text-center`}>
        <svg className="w-12 h-12 mx-auto text-brand-sage mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-lg font-serif text-brand-dark mb-2">Consulta enviada</h3>
        <p className="text-sm text-brand-dark/60">
          Recibimos tu mensaje. Nos comunicaremos a la brevedad.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`contact-form ${variant === "editorial" ? "contact-form--editorial" : ""} space-y-4`}
    >
      {propertyTitle && (
        <p className="text-sm text-brand-dark/60 mb-2">
          Consulta sobre: <strong>{propertyTitle}</strong>
        </p>
      )}

      <div>
        <input
          name="name"
          type="text"
          required
          placeholder="Nombre completo *"
          className="contact-form__field w-full px-4 py-3 border border-brand-warm-gray rounded-sm text-sm bg-brand-surface text-brand-dark placeholder:text-brand-medium-gray focus:outline-none focus:border-brand-sage transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          name="email"
          type="email"
          required
          placeholder="Email *"
          className="contact-form__field w-full px-4 py-3 border border-brand-warm-gray rounded-sm text-sm bg-brand-surface text-brand-dark placeholder:text-brand-medium-gray focus:outline-none focus:border-brand-sage transition-colors"
        />
        <input
          name="phone"
          type="tel"
          placeholder="Teléfono"
          className="contact-form__field w-full px-4 py-3 border border-brand-warm-gray rounded-sm text-sm bg-brand-surface text-brand-dark placeholder:text-brand-medium-gray focus:outline-none focus:border-brand-sage transition-colors"
        />
      </div>

      <div>
        <textarea
          name="message"
          rows={4}
          placeholder="Tu consulta..."
          className="contact-form__field contact-form__field--message w-full px-4 py-3 border border-brand-warm-gray rounded-sm text-sm bg-brand-surface text-brand-dark placeholder:text-brand-medium-gray focus:outline-none focus:border-brand-sage transition-colors resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="contact-form__submit w-full px-6 py-3 bg-brand-sage text-white text-sm font-medium tracking-wide hover:bg-brand-sage-dark transition-colors disabled:opacity-50"
      >
        {status === "loading" ? "Enviando..." : "Enviar consulta"}
      </button>

      {status === "error" && (
        <p className="text-red-600 text-sm text-center">
          Hubo un error al enviar. Intentá de nuevo.
        </p>
      )}
    </form>
  );
}
