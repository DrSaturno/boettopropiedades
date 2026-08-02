"use client";

import { useState } from "react";
import { OPERATIONS, PROPERTY_TYPES } from "@/lib/constants";

export default function TasacionForm() {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      const response = await fetch("/api/tasaciones", {
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

      if (!response.ok) throw new Error();
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="valuation-form__success" role="status">
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        <h3>Solicitud enviada</h3>
        <p>Nos comunicaremos a la brevedad para coordinar la tasación.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="valuation-form">
      <label className="valuation-form__group">
        <span>Nombre completo *</span>
        <input
          name="name"
          type="text"
          required
          autoComplete="name"
          placeholder="Nombre y apellido"
        />
      </label>

      <div className="valuation-form__grid">
        <label className="valuation-form__group">
          <span>Email *</span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="nombre@email.com"
          />
        </label>
        <label className="valuation-form__group">
          <span>Teléfono *</span>
          <input
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            placeholder="+54 11 ..."
          />
        </label>
      </div>

      <div className="valuation-form__grid">
        <label className="valuation-form__group">
          <span>Tipo de propiedad *</span>
          <select name="propertyType" required defaultValue="">
            <option value="" disabled>
              Seleccionar
            </option>
            {PROPERTY_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </label>
        <label className="valuation-form__group">
          <span>Operación deseada *</span>
          <select name="operation" required defaultValue="">
            <option value="" disabled>
              Seleccionar
            </option>
            {OPERATIONS.map((operation) => (
              <option key={operation.value} value={operation.value}>
                {operation.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="valuation-form__group">
        <span>Ubicación de la propiedad *</span>
        <input
          name="location"
          type="text"
          required
          placeholder="Barrio y dirección aproximada"
        />
      </label>

      <label className="valuation-form__group">
        <span>Comentarios adicionales</span>
        <textarea
          name="message"
          rows={3}
          placeholder="Superficie, estado o cualquier dato que quieras sumar."
        />
      </label>

      <button type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Enviando..." : "Solicitar tasación"}
      </button>

      {status === "error" ? (
        <p className="valuation-form__error" role="alert">
          No pudimos enviar la solicitud. Intentá nuevamente.
        </p>
      ) : null}
    </form>
  );
}
