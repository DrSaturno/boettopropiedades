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
- **Hosting**: Vercel (el proyecto está asociado a `main`; el despliegue de `e508fec` está en estado READY). El dominio y el correo siguen en SiteGround. Vercel no tiene disco persistente: nada puede escribirse en `public/` en producción.
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
- El 11 de octubre de 2026 pasaron localmente `npm run lint`, `npx tsc --noEmit`, `npm run build` y `node scripts/smoke-local.mjs` contra `next start`, usando `prisma/audit-test.db` y credenciales de prueba. Después del ajuste de limpieza de imágenes volvieron a pasar lint, TypeScript y build; el entorno bloqueó la conexión a `localhost` para repetir el smoke test ampliado.
- La prueba integral cubrió sesión admin, alta y edición parcial de propiedades, publicación y pausa con actualización de home/catálogo/ficha, subida de fotos, importación de código de Zonaprop, formulario de consulta, tasación, pipeline, estadísticas y conservación de clientes tras borrar una propiedad.
- Los formularios guardan la consulta y su lead en una misma transacción (`src/lib/crm-service.ts`); se comprobó que dos consultas del mismo correo quedan ligadas a un único lead.
- La revisión visual del panel y el pipeline en un viewport de 390 × 844 no mostró bloqueos de uso.
- Tras conectar Turso, Vercel Blob y las variables SMTP, el despliegue de `e508fec` terminó en estado READY. Se probaron en producción el alta y la edición de una propiedad, la subida de una imagen a Blob y su eliminación con el botón del panel, el envío del formulario de contacto, la consulta y el lead en CRM, y el cambio de etapa en el pipeline. El destinatario confirmó la recepción del correo. Se eliminaron el borrador, la consulta, el lead y la imagen de prueba; Blob informó 0 objetos y 0 bytes. Por pedido del usuario también se borraron las cuatro propiedades de ejemplo de Córdoba. Más tarde el usuario cargó publicaciones reales y el catálogo público volvió a tener contenido. La API de logs de Vercel aún devuelve 403 para `drsaturnos-projects`, aunque las consultas de proyecto, variables y despliegues funcionan.

## 5. Trabajo pendiente en producción

1. **Home**: muestra todas las publicaciones si hay hasta ocho; a partir de nueve elige al azar las no destacadas para completar ocho y conserva todas las destacadas. La grilla usa cuatro columnas en escritorio, dos en tablet y una en celular. `connection()` mantiene la selección dinámica por visita. La cabecera de la sección (`.home-properties__header`, commit `b7cb177`) ya no lleva párrafo: el título va en una sola línea junto al botón desde 1101 px, en una línea con el botón debajo en tablet y en tres líneas en celular. El tamaño `clamp(3.2rem, 5.3vw, 5.4rem)` está calculado para que el texto actual entre en una línea; si cambia el texto del título hay que volver a medirlo. Se verificó en producción a 1280 px y 375 px.
2. **Ciclo de vida de fotos**: el código borra imágenes propias que quedan sin referencias al quitarlas del formulario, editar o eliminar una propiedad. La subida y eliminación desde el formulario se verificaron en producción (Blob pasó de 1 objeto a 0). La eliminación de fotos al borrar una propiedad tiene cobertura en `scripts/smoke-local.mjs`, pero esa versión ampliada del smoke test no pudo ejecutarse aquí porque el entorno bloqueó `localhost`.
3. **Imágenes importadas**: las fotos enlazadas a portales externos pueden dejar de verse cuando se elimina la publicación original; conviene guardarlas en Blob al importar si ese flujo es importante.
4. **Observabilidad**: la integración de Vercel usada desde entornos remotos devuelve 403 para los logs. En la PC del usuario el CLI de Vercel sí tiene sesión con acceso al equipo `drsaturnos-projects`: `vercel ls boettopropiedades --scope drsaturnos-projects`, `vercel inspect <url> --logs` y `vercel env ls production` muestran despliegues, logs de build y nombres de variables.
5. **Desarrollo local en Windows**: si el navegador muestra estilos viejos después de editar `globals.css`, la caché de Turbopack quedó desactualizada; detener el servidor, borrar `.next/dev` y volver a iniciarlo.

El catálogo ficticio de `src/data/demo-properties.ts` solo aparece con `CATALOG_DEMO_MODE=true` y sin propiedades publicadas. En modo normal, la base vacía muestra un catálogo vacío y los errores de conexión no se ocultan con ejemplos.

---

*Fin del SDD y Hand-off.*
