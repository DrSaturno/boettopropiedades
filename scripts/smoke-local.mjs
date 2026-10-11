// Run against a local server with an isolated database and test admin credentials.
// Example: SMOKE_ADMIN_EMAIL=... SMOKE_ADMIN_PASSWORD=... node scripts/smoke-local.mjs
import assert from "node:assert/strict";
import { unlink } from "node:fs/promises";
import path from "node:path";

const base = process.env.SMOKE_BASE_URL || "http://localhost:3004";
const parsedBase = new URL(base);
if (!["localhost", "127.0.0.1"].includes(parsedBase.hostname)) {
  throw new Error("El smoke test solo se puede ejecutar contra localhost");
}

const email = process.env.SMOKE_ADMIN_EMAIL || "audit@local.test";
const password = process.env.SMOKE_ADMIN_PASSWORD || "audit-test-only";
const stamp = Date.now();
const visitorEmail = `audit-${stamp}@example.test`;
const title = `Propiedad auditoría ${stamp}`;
const cookies = new Map();
const created = { property: null, leads: [], inquiries: [], upload: null };

function rememberCookies(response) {
  for (const item of response.headers.getSetCookie()) {
    const pair = item.split(";", 1)[0];
    const separator = pair.indexOf("=");
    if (separator > 0) cookies.set(pair.slice(0, separator), pair.slice(separator + 1));
  }
}

async function request(path, { method = "GET", body, form } = {}) {
  const headers = {};
  if (cookies.size) {
    headers.cookie = [...cookies].map(([key, value]) => `${key}=${value}`).join("; ");
  }
  if (body !== undefined) headers["content-type"] = "application/json";
  const response = await fetch(new URL(path, base), {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : form,
    redirect: "manual",
  });
  rememberCookies(response);
  const text = await response.text();
  let data;
  try { data = JSON.parse(text); } catch { data = text; }
  return { status: response.status, data };
}

function expect(result, status, label) {
  assert.equal(result.status, status, `${label}: ${JSON.stringify(result.data).slice(0, 500)}`);
  console.log(`OK ${label}`);
  return result.data;
}

async function login() {
  const csrf = expect(await request("/api/auth/csrf"), 200, "CSRF").csrfToken;
  const form = new URLSearchParams({ csrfToken: csrf, email, password, callbackUrl: `${base}/admin`, json: "true" });
  const result = await request("/api/auth/callback/credentials", { method: "POST", form });
  assert.ok(result.status === 200 || result.status === 302, `Login: ${JSON.stringify(result)}`);
  expect(await request("/api/auth/session"), 200, "sesión admin");
  assert.ok(cookies.has("next-auth.session-token"), "No se creó cookie de sesión");
}

try {
  expect(await request("/api/propiedades"), 401, "API privada sin sesión");
  await login();
  const initialCatalog = expect(await request("/propiedades"), 200, "catálogo inicial");
  assert.ok(!initialCatalog.includes("Ejemplos ficticios"), "Se muestra el catálogo ficticio sin autorización");

  expect(await request("/api/contacto", {
    method: "POST", body: { name: "A", email: "correo-inválido" },
  }), 400, "validar formulario público");
  expect(await request("/api/scrape", {
    method: "POST", body: { url: "http://127.0.0.1:3004/admin" },
  }), 400, "bloquear importación de red interna");
  const importHtml = `<html><script>var avisoInfo = ${JSON.stringify({
    postingTitle: "Casa de prueba en Palermo",
    pricesData: [{ prices: [{ amount: 245000, isoCode: "USD" }], operationType: { name: "Venta" } }],
    realEstateType: { name: "Casa" },
    pictures: [{ url1200x1200: "https://img.example.test/casa.jpg" }],
  })};</script></html>`;
  const imported = expect(await request("/api/scrape", {
    method: "POST", body: { url: "https://www.zonaprop.com.ar/casa-prueba.html", html: importHtml },
  }), 200, "importar código pegado de Zonaprop");
  assert.equal(imported.title, "Casa de prueba en Palermo");
  assert.equal(imported.price, "245000");
  assert.equal(imported.images.length, 1);

  const property = expect(await request("/api/propiedades", {
    method: "POST",
    body: { title, operation: "venta", propertyType: "casa", status: "draft", price: 135000, city: "Buenos Aires", images: [] },
  }), 201, "crear propiedad");
  created.property = property.id;
  assert.equal(property.status, "draft");
  expect(await request(`/propiedades/${property.slug}`), 404, "borrador no visible");

  expect(await request(`/api/propiedades/${property.id}`, {
    method: "PUT", body: { price: "no es un número" },
  }), 400, "validar precio");

  const partial = expect(await request(`/api/propiedades/${property.id}`, {
    method: "PUT", body: { featured: true },
  }), 200, "actualización parcial");
  assert.equal(partial.title, title);
  assert.equal(partial.price, 135000);

  expect(await request(`/api/propiedades/${property.id}`, {
    method: "PUT", body: { status: "published" },
  }), 200, "publicar propiedad");
  const publishedHome = expect(await request("/"), 200, "home tras publicar");
  assert.ok(publishedHome.includes(title), "La propiedad destacada no aparece en la home");
  const catalog = expect(await request("/propiedades"), 200, "catálogo público");
  assert.ok(catalog.includes(title), "La propiedad publicada no aparece en el catálogo");
  const detail = expect(await request(`/propiedades/${property.slug}`), 200, "ficha pública");
  assert.ok(detail.includes(title), "La ficha no muestra el título");

  const upload = new FormData();
  upload.append("file", new Blob([Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/lAAAAABJRU5ErkJggg==", "base64")], { type: "image/png" }), "audit.png");
  const uploaded = expect(await request("/api/upload", { method: "POST", form: upload }), 200, "subir imagen");
  assert.ok(uploaded.url.startsWith("/uploads/") || uploaded.url.startsWith("https://"));
  if (uploaded.url.startsWith("/uploads/")) created.upload = path.join(process.cwd(), "public", uploaded.url.slice(1));

  const inquiry = expect(await request("/api/contacto", {
    method: "POST",
    body: { name: "Visita auditoría", email: visitorEmail, phone: "+541100000000", message: "Consulta de prueba", type: "property", propertyId: property.id },
  }), 200, "formulario de propiedad");
  created.inquiries.push(inquiry.id);
  const repeatedInquiry = expect(await request("/api/contacto", {
    method: "POST",
    body: { name: "Visita auditoría", email: visitorEmail.toUpperCase(), message: "Segunda consulta", type: "property", propertyId: property.id },
  }), 200, "segunda consulta del mismo cliente");
  created.inquiries.push(repeatedInquiry.id);

  const leads = expect(await request(`/api/crm/leads?search=${encodeURIComponent(visitorEmail)}`), 200, "buscar lead");
  assert.equal(leads.total, 1);
  const leadId = leads.leads[0].id;
  created.leads.push(leadId);
  const linked = expect(await request(`/api/crm/leads/${leadId}`), 200, "detalle CRM");
  assert.ok(linked.inquiries.some((item) => item.id === inquiry.id), "La consulta no quedó asociada al lead");
  assert.ok(linked.inquiries.some((item) => item.id === repeatedInquiry.id), "La segunda consulta no quedó asociada al mismo lead");

  expect(await request(`/api/crm/leads/${leadId}`, {
    method: "PUT", body: { stage: "cerrado_ganado" },
  }), 200, "cambiar etapa");
  expect(await request(`/api/crm/leads/${leadId}`, {
    method: "PUT", body: { stage: "etapa-inexistente" },
  }), 400, "validar etapa CRM");
  const stats = expect(await request("/api/crm/stats"), 200, "estadísticas CRM");
  assert.ok(stats.byStage.cerrado_ganado >= 1);
  expect(await request(`/api/crm/leads/${leadId}/interactions`, {
    method: "POST", body: { type: "llamada", notes: "Seguimiento de prueba" },
  }), 201, "crear interacción");

  const valuation = expect(await request("/api/tasaciones", {
    method: "POST",
    body: { name: "Tasación auditoría", email: `tasacion-${visitorEmail}`, phone: "+541100000001", propertyType: "casa", operation: "venta", location: "Palermo", message: "Prueba" },
  }), 200, "solicitud de tasación");
  created.inquiries.push(valuation.id);
  const valuationLead = expect(await request(`/api/crm/leads?search=tasacion-${visitorEmail}`), 200, "lead de tasación");
  assert.equal(valuationLead.total, 1);
  created.leads.push(valuationLead.leads[0].id);

  expect(await request(`/api/propiedades/${property.id}`, {
    method: "PUT", body: { status: "paused" },
  }), 200, "pausar propiedad");
  const pausedHome = expect(await request("/"), 200, "home tras pausar");
  assert.ok(!pausedHome.includes(title), "La propiedad pausada sigue en la home");
  expect(await request(`/propiedades/${property.slug}`), 404, "ficha pausada no visible");
  const pausedCatalog = expect(await request("/propiedades"), 200, "catálogo tras pausar");
  assert.ok(!pausedCatalog.includes(title));
  assert.ok(!pausedCatalog.includes("Ejemplos ficticios"));
  expect(await request(`/api/propiedades/${property.id}`, {
    method: "PUT", body: { status: "published" },
  }), 200, "republicar propiedad");

  expect(await request(`/api/propiedades/${property.id}`, { method: "DELETE" }), 200, "eliminar propiedad");
  created.property = null;
  const retained = expect(await request(`/api/crm/leads/${leadId}`), 200, "conservar lead y consulta");
  assert.equal(retained.propertyId, null);
  assert.ok(retained.inquiries.some((item) => item.id === inquiry.id));
  expect(await request(`/propiedades/${property.slug}`), 404, "ficha eliminada no visible");
  const finalCatalog = expect(await request("/propiedades"), 200, "catálogo tras baja");
  assert.ok(!finalCatalog.includes("Ejemplos ficticios"));
  console.log("Smoke test completo");
} finally {
  if (created.property) await request(`/api/propiedades/${created.property}`, { method: "DELETE" });
  for (const id of created.inquiries) await request(`/api/consultas/${id}`, { method: "DELETE" });
  for (const id of created.leads) await request(`/api/crm/leads/${id}`, { method: "DELETE" });
  if (created.upload) await unlink(created.upload).catch(() => {});
}
