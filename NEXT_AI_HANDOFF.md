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
  - Prisma (actualmente configurado en modo local con SQLite `prisma/dev.db` para desarrollo/testing).
  - Supabase (Migración preparada en `supabase/migrations/` y cliente configurado en `src/lib/supabase/admin.ts`, pendiente de adopción total).
- **Autenticación**: NextAuth (`/api/auth/[...nextauth]`) para proteger el panel `/admin`.
- **Manejo de Formularios y Correos**: 
  - `react-hook-form` con validación en `zod`.
  - Endpoint de contacto en `src/app/api/contacto/route.ts` que notifica a `ventas@boettopropiedades.com` vía Nodemailer (`src/lib/inquiry-email.ts`).

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
- `npm run lint` y `npx next build` pasan correctamente de forma local. 
- Vercel realiza deploy automático de la rama `main` sin trabas.

## 5. Trabajo Pendiente para la Próxima IA (To-Do)

El agente que retome el proyecto deberá consultar al usuario cuál es la prioridad, eligiendo entre:

1. **Gestión de Entorno y Producción**: 
   - Terminar la migración de datos hacia **Supabase** para abandonar SQLite en producción (si el usuario así lo requiere).
   - Reemplazar las credenciales hardcodeadas del admin y el SMTP de `.env` por secretos formales en Vercel.
2. **Desarrollo del Backend de Propiedades**: 
   - Habilitar el ABM (Alta, Baja y Modificación) completo en el panel admin para la carga de propiedades reales.
3. **Páginas Faltantes o Secciones Dinámicas**: 
   - Poblar la sección `/propiedades` con la conexión a la base de datos real.
4. **Mantenimiento**: 
   - Monitorear logs de Vercel en caso de fallos de caché o de conexión a Prisma en producción.

---

*Fin del SDD y Hand-off.* 
*Regla obligatoria para la próxima IA: Lee este documento y confía en el estado actual; no rompas el diseño premium ya consolidado.*
