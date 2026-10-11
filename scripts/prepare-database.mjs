// Vercel builds prerender the home and sitemap, so a new Turso database must
// have its tables before Next.js starts collecting page data.
const url = process.env.TURSO_DATABASE_URL;

if (process.env.VERCEL && !url) {
  throw new Error("Falta TURSO_DATABASE_URL en Vercel. Conectá Turso Cloud al proyecto antes de desplegar.");
}
if (url?.startsWith("libsql://") && !process.env.TURSO_AUTH_TOKEN) {
  throw new Error("Falta TURSO_AUTH_TOKEN para conectar con Turso.");
}

if (url) {
  await import("./turso-setup.mjs");
} else {
  console.log("Sin TURSO_DATABASE_URL; se omite la preparación de Turso.");
}
