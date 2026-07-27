import "server-only";

import nodemailer from "nodemailer";
import { COMPANY_INFO } from "@/lib/constants";

export interface InquiryEmailPayload {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  message?: string | null;
  type: string;
  propertyTitle?: string | null;
  createdAt: Date;
}

function requiredEnvironment(name: string) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Falta configurar ${name}`);
  }
  return value;
}

function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[character] ?? character
  );
}

function inquiryLabel(type: string) {
  if (type === "tasacion") return "Solicitud de tasación";
  if (type === "property") return "Consulta por propiedad";
  return "Consulta general";
}

function smtpTransport() {
  const host = requiredEnvironment("SMTP_HOST");
  const port = Number(requiredEnvironment("SMTP_PORT"));
  const user = requiredEnvironment("SMTP_USER");
  const pass = requiredEnvironment("SMTP_PASS");

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error("SMTP_PORT debe ser un número válido");
  }

  const secure =
    process.env.SMTP_SECURE?.trim().toLowerCase() === "true" || port === 465;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
}

export async function sendInquiryEmail(payload: InquiryEmailPayload) {
  const destination =
    process.env.INQUIRY_EMAIL_TO?.trim() || COMPANY_INFO.email;
  const sender = requiredEnvironment("SMTP_FROM");
  const label = inquiryLabel(payload.type);
  const date = new Intl.DateTimeFormat("es-AR", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "America/Argentina/Buenos_Aires",
  }).format(payload.createdAt);

  const details = [
    ["Nombre", payload.name],
    ["Email", payload.email],
    ["Teléfono", payload.phone || "No informado"],
    ["Tipo", label],
    ["Propiedad", payload.propertyTitle || "No aplica"],
    ["Fecha", date],
  ] as const;

  const text = [
    `${label} #${payload.id}`,
    "",
    ...details.map(([key, value]) => `${key}: ${value}`),
    "",
    "Mensaje:",
    payload.message || "Sin mensaje adicional.",
  ].join("\n");

  const rows = details
    .map(
      ([key, value]) =>
        `<tr><td style="padding:8px 16px 8px 0;color:#8b7348">${escapeHtml(
          key
        )}</td><td style="padding:8px 0;color:#0b0b0b">${escapeHtml(
          value
        )}</td></tr>`
    )
    .join("");

  const html = `
    <div style="margin:0;padding:32px;background:#f4f4f2;font-family:Arial,sans-serif;color:#0b0b0b">
      <div style="max-width:680px;margin:0 auto;padding:36px;background:#ffffff;border-top:8px solid #c5a05c">
        <p style="margin:0 0 12px;color:#8b7348;font-size:12px;letter-spacing:2px;text-transform:uppercase">Boetto Propiedades</p>
        <h1 style="margin:0 0 28px;font-family:Georgia,serif;font-size:32px;font-weight:400">${escapeHtml(
          label
        )} #${payload.id}</h1>
        <table style="width:100%;border-collapse:collapse">${rows}</table>
        <div style="margin-top:28px;padding:24px;border-left:5px solid #c5a05c;background:#f4f4f2">
          <p style="margin:0 0 10px;color:#8b7348;font-size:12px;letter-spacing:1.5px;text-transform:uppercase">Mensaje</p>
          <p style="margin:0;line-height:1.7;white-space:pre-wrap">${escapeHtml(
            payload.message || "Sin mensaje adicional."
          )}</p>
        </div>
        <p style="margin:28px 0 0;color:#70706d;font-size:12px">Respondé este correo para contactar directamente a ${escapeHtml(
          payload.name
        )}.</p>
      </div>
    </div>
  `;

  return smtpTransport().sendMail({
    from: sender,
    to: destination,
    replyTo: { name: payload.name, address: payload.email },
    subject: `${label} #${payload.id} - ${payload.name}`,
    text,
    html,
  });
}
