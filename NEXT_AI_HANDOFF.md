# SDD & AI HANDOFF: Boetto Propiedades

Este documento sigue los lineamientos de Spec-Driven Development (SDD). Es la fuente única de contexto arquitectónico, de diseño y de estado actual para que cualquier IA retome el proyecto de inmediato sin necesidad de leer todo el historial previo.

## 1. Visión General del Proyecto

- **Nombre**: `boetto-web`
- **Ruta local**: `C:\Users\nicol\OneDrive\Documentos\Planeta Saturno\Claude\Boettopropiedades\boetto-web`
- **Repositorio**: `https://github.com/DrSaturno/boettopropiedades`
- **Rama activa**: `main`
- **Último Commit**: (Se actualiza constantemente, ver `git log`)
- **Propósito**: Sitio web editorial y panel de administración privado para una agencia de "Servicio Inmobiliario" (curaduría) en Capital Federal. El enfoque es premium, minimalista, de alta confianza y orientado a captar consultas estructuradas en lugar de ser un simple catálogo de propiedades masivo.

## 2. Arquitectura y Stack Tecnológico

- **Framework**: Next.js 16.2.9 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Vanilla CSS (`globals.css`) y Tailwind CSS (usado principalmente para utilidades de layout en la página de contacto).
- **Base de Datos / ORM**: 
  - Prisma. En desarrollo usa SQLite local (`prisma/dev.db`).
  - En producción usa **Turso** (libSQL) mediante `@prisma/adapter-libsql`: `src/lib/prisma.ts` lo activa cuando existe `TURSO_DATABASE_URL`. Prisma CLI 5 no puede hacer `db push` contra Turso; `npm run build` ejecuta `scripts/prepare-database.mjs` para crear las tablas faltantes con `scripts/turso-setup.mjs` antes del prerender. Cualquier cambio futuro de esquema necesita una migración explícita.
  - Supabase quedó sin uso (el proyecto original ya no existe). El código de `src/lib/supabase/admin.ts` solo se usa si `SUPABASE_STORAGE_ENABLED="true"`.
- **Hosting**: Vercel (el proyecto está asociado a `main`, pendiente de verificar el despliegue actual). El dominio y el correo siguen en SiteGround. Vercel no tiene disco persistente: nada puede escribirse en `public/` en producción.
- **Imágenes de propiedades**: Vercel Blob (`BLOB_READ_WRITE_TOKEN`) desde `/api/upload`. El navegador achica las fotos grandes antes de subirlas porque Vercel rechaza pedidos de más de 4.5 MB.
- **Importador por link** (`src/lib/scraper.ts`): Argenprop y MercadoLibre se leen directo. Zonaprop responde con un desafío de Cloudflare a cualquier servidor, así que el panel ofrece pegar el código fuente de la publicación y se interpreta el objeto `avisoInfo` embebido.
- **Caché**: la home, las fichas y el sitemap son estáticos. Toda alta, edición o baja de propiedades llama a `revalidatePublicCatalog()` (`src/lib/property-input.ts`).
- **Autenticación**: NextAuth (`/api/auth/[...nextauth]`) para proteger el panel `/admin`. En producción las credenciales salen de `ADMIN_EMAIL` y `ADMIN_PASSWORD`, no de la tabla `User`. Todas las rutas `/api` del panel exigen sesión.
- **Manejo de Formularios y Correos**: 
  - `react-hook-form` con validación en `zod`.
  - Endpoint de contacto en `src/app/api/contacto/route.ts` que notifica a `info@boettopropiedades.com` vía Nodemailer (`src/lib/inquiry-email.ts`).

## 3. Guías de UI/UX y Diseño (Reglas Estrictas)

- **Estética "Awwwards" Premium**: Minimalismo extremo, uso de tipografías Serif elegantes (Playfair Display) combinadas con sans-serif limpias.
- **Paleta de Colores**: Tonos cálidos oscuros (`--brand-charcoal`, `--brand-taupe`, `--brand-cream-official`, `--oxblood`), evitando colores genéricos o saturados.
- **Layouts "Full-Bleed"**: Las imágenes deben ocupar 100% del ancho o usar contenedores exactos (`section-shell`) pero con fondos inmersivos.
- **Micro-interacciones**: Transiciones suaves al hacer hover (ej: botones, enlaces, zoom suave en imágenes de tarjetas).

## 4. Estado Actual Validado (Lo que ya funciona)

### Sitio Público (Frontend)
- **Hero Video**: Se eliminaron las anotaciones intrusivas ("01/04", "Desliza") y se redujo la opacidad de los degradados superpuestos para que el video `boetto-luxury-tour.mp4` brille con mayor claridad.
- **Sección de Servicios (Tarjetas)**: 
  - Desktop: Imágenes inmersivas de fondo completo con el texto sobre ellas.
  - Mobile: Arreglado el bug de `aspect-ratio` para que en mobile sigan comportándose como fondo de pantalla (`position: absolute; height: 100%`) y no empujen el texto hacia abajo.
- **Sección "Próxima Conversación" (Closing Panel)**: 
  - Diseño "recuadro" preservando el contenedor `.section-shell` con padding, pero la imagen llena el 100% de ese recuadro, luciendo sumamente premium y contenido.
- **Página de Contacto (`/contacto`)**: 
  - Rediseñada con un layout ultra moderno "Split-Screen" (50/50): mitad izquierda imagen de fondo (`contact_bg.jpg`), mitad derecha fondo crema con formulario de contacto limpio.
- **Footer**: 
  - Incorpora iconos minimalistas vectoriales en línea (SVG) para Email, Teléfono/WhatsApp, Dirección, Horarios e Instagram.
  - El texto gigante de "BOETTO" fue removido para mayor limpieza visual.
  - Firma `By 🪐 DrSaturno` conectada a `https://www.planetasaturno.com`.

### Panel Admin
- Completamente aislado del diseño público mediante `SiteChrome`. 
- Navbar lateral (`AdminSidebar`) y un login limpio en `/admin/login`.
- Acceso de prueba local (Vía seed local): `admin@boettopropiedades.com.ar` / `admin123` (No usar en producción).

### CI / CD (Build)
- Errores de sintaxis y compilación resueltos.
- El 11 de octubre de 2026 pasaron localmente `npm run lint`, `npx tsc --noEmit`, `npm run build` y `node scripts/smoke-local.mjs` contra `next start`, usando `prisma/audit-test.db` y credenciales de prueba.
- La prueba integral cubrió sesión admin, alta y edición parcial de propiedades, publicación y pausa con actualización de home/catálogo/ficha, subida de fotos, importación de código de Zonaprop, formulario de consulta, tasación, pipeline, estadísticas y conservación de clientes tras borrar una propiedad.
- Los formularios guardan la consulta y su lead en una misma transacción (`src/lib/crm-service.ts`); se comprobó que dos consultas del mismo correo quedan ligadas a un único lead.
- La revisión visual del panel y el pipeline en un viewport de 390 × 844 no mostró bloqueos de uso.
- El commit `45badf2` está en `main`, pero el despliegue falló mientras faltaban las variables de Turso. Luego se conectaron Turso, Vercel Blob y las variables SMTP. Se necesita un nuevo despliegue y verificar sus flujos públicos. La API de logs de Vercel aún devuelve 403 para `drsaturnos-projects`, aunque las consultas de proyecto, variables y despliegues funcionan.

## 5. Trabajo pendiente en producción

1. **Despliegue**: volver a desplegar `main` después de conectar Turso. Comprobar el resultado en Vercel y corregir cualquier fallo restante. La API de logs devuelve 403 y el CLI local carece de credenciales; los estados de despliegue sí pueden consultarse.
2. **Base y almacenamiento**: Vercel ya tiene `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN` y `BLOB_READ_WRITE_TOKEN`; se creó el almacén público `boetto-property-images`. El build crea las tablas faltantes antes del prerender. Confirmar que `/api/propiedades` deje de responder 500 y que una foto subida conserve una URL de Blob.
3. **Correo y acceso**: Vercel ya tiene `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `SMTP_*` e `INQUIRY_EMAIL_TO`. Probar una consulta real y confirmar la notificación. La verificación SMTP local quedó sin respuesta por la conexión de este entorno.
4. **Publicación**: repetir el recorrido de admin, propiedades, formularios y CRM en la URL pública; limpiar los datos de prueba después.
5. **Imágenes importadas**: las fotos enlazadas a portales externos pueden dejar de verse cuando se elimina la publicación original; conviene guardarlas en Blob al importar si ese flujo es importante.

El catálogo ficticio de `src/data/demo-properties.ts` solo aparece con `CATALOG_DEMO_MODE=true` y sin propiedades publicadas. En modo normal, la base vacía muestra un catálogo vacío y los errores de conexión no se ocultan con ejemplos.

---

*Fin del SDD y Hand-off.*
