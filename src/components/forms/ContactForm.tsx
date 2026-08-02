"use client";

import { useState } from "react";

interface Props {
  propertyId?: number;
  propertyTitle?: string;
  type?: "contact" | "property" | "tasacion";
  variant?: "default" | "editorial" | "dark";
  showLabels?: boolean;
}

export default function ContactForm({
  propertyId,
  propertyTitle,
  type = "contact",
  variant = "default",
  showLabels = false,
}: Props) {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");

    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      const response = await fetch("/api/contacto", {
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

      if (!response.ok) throw new Error();
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  const modifier =
    variant === "editorial"
      ? "contact-form--editorial"
      : variant === "dark"
        ? "contact-form--dark"
        : "";

  const labelClass = showLabels ? "contact-form__label" : "sr-only";

  if (status === "success") {
    return (
      <div
        className={`contact-form__success ${
          variant === "editorial"
            ? "contact-form__success--editorial"
            : variant === "dark"
              ? "contact-form__success--dark"
              : ""
        }`}
        role="status"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        <h3>Consulta enviada</h3>
        <p>Recibimos tu mensaje. Nos comunicaremos a la brevedad.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`contact-form ${modifier}`}>
      {propertyTitle ? (
        <p className="contact-form__property">
          Consulta sobre: <strong>{propertyTitle}</strong>
        </p>
      ) : null}

      <label className="contact-form__group">
        <span className={labelClass}>Nombre completo *</span>
        <input
          name="name"
          type="text"
          required
          autoComplete="name"
          placeholder={showLabels ? "Nombre y apellido" : "Nombre completo *"}
          className="contact-form__field"
        />
      </label>

      <div className="contact-form__grid">
        <label className="contact-form__group">
          <span className={labelClass}>Email *</span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder={showLabels ? "nombre@email.com" : "Email *"}
            className="contact-form__field"
          />
        </label>
        <label className="contact-form__group">
          <span className={labelClass}>Teléfono</span>
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder={showLabels ? "+54 11 ..." : "Teléfono"}
            className="contact-form__field"
          />
        </label>
      </div>

      <label className="contact-form__group">
        <span className={labelClass}>¿En qué podemos ayudarte?</span>
        <textarea
          name="message"
          rows={4}
          placeholder={
            showLabels
              ? "Contanos brevemente qué estás buscando."
              : "Tu consulta..."
          }
          className="contact-form__field contact-form__field--message"
        />
      </label>

      <button
        type="submit"
        disabled={status === "loading"}
        className="contact-form__submit"
      >
        {status === "loading" ? "Enviando..." : "Enviar consulta"}
      </button>

      {status === "error" ? (
        <p className="contact-form__error" role="alert">
          No pudimos enviar la consulta. Intentá nuevamente.
        </p>
      ) : null}
    </form>
  );
}
