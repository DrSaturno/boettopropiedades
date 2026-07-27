# NEXT AI HANDOFF

Este archivo es la fuente unica de contexto para retomar el proyecto sin leer el resto del historial.

## Proyecto

- Nombre: `boetto-web`
- Ruta local: `C:\Users\nicol\OneDrive\Documentos\Planeta Saturno\Claude\Boettopropiedades\boetto-web`
- Repo GitHub: `https://github.com/DrSaturno/boettopropiedades`
- Rama actual: `main`
- Ultimo commit subido: `48fe3b4 feat: refine admin and contact experience`
- Estado git al momento de este handoff: limpio

## Objetivo actual del sitio

Sitio inmobiliario editorial para Boetto Propiedades, enfocado mas en marca, confianza, contexto y captacion de consultas que en un catalogo grande de propiedades.

La home actual trabaja con:

- hero con video sujeto a scroll
- buscador integrado al final del recorrido del hero
- seccion de proxima conversacion
- bloque de tres tarjetas informativas
- formulario de contacto
- panel admin separado del sitio publico

## Estado actual validado

### Sitio publico

- La home fue ajustada a la paleta negro, dorado y blanco.
- La seccion `Proxima conversacion` ahora tiene fondo blanco, imagen editorial y CTA hacia `/contacto`.
- El footer ya incluye Instagram y WhatsApp reales.
- Las tres imagenes de tarjetas fueron reemplazadas por assets mas familiares, calidos y confiables.

### Panel admin

- El admin ya no hereda header ni footer del sitio publico.
- La barra lateral del admin usa logo blanco y texto blanco.
- El login del admin usa el logo negro dentro del recuadro.
- La sesion del panel quedo cerrada al terminar el ultimo trabajo.
- URL local del login: `http://localhost:3004/admin/login`

### Build y calidad

- `npm run lint` pasa
- `npm run build` pasa
- El fix de Vercel para Prisma ya esta aplicado:
  - `build`: `prisma generate && next build`
  - `postinstall`: `prisma generate`

## Archivos clave del estado actual

- `src/components/home/HomeExperience.tsx`
- `src/app/globals.css`
- `src/components/layout/Footer.tsx`
- `src/components/layout/SiteChrome.tsx`
- `src/app/layout.tsx`
- `src/components/admin/AdminSidebar.tsx`
- `src/app/admin/login/page.tsx`
- `src/app/api/contacto/route.ts`
- `src/lib/inquiry-email.ts`
- `src/lib/inquiry-notifications.ts`
- `src/lib/constants.ts`

## Assets nuevos ya integrados

- `public/images/boetto-service-family-guidance.png`
- `public/images/boetto-service-family-context.png`
- `public/images/boetto-service-family-visit.png`
- `public/images/boetto-next-visit.png`

## Infraestructura y datos

### Contacto y correo

- Las consultas del formulario se procesan por `POST /api/contacto`
- El backend registra la consulta y luego intenta enviar notificacion por email
- La salida actual de consultas apunta a `ventas@boettopropiedades.com`
- La configuracion real de SMTP esta en `.env` local y no esta comiteada

### Prisma

- El sitio sigue usando Prisma local para la operacion actual del panel
- Existe base local `prisma/dev.db`
- Hay seed local con usuario admin por defecto

### Supabase

- Ya existe trabajo previo para Supabase
- Hay migracion creada en:
  - `supabase/migrations/202607270001_boetto_core.sql`
- Hay cliente admin server-side en:
  - `src/lib/supabase/admin.ts`
- Hay chequeo en:
  - `scripts/check-supabase.mjs`

Importante:

- Hubo una etapa donde Supabase estaba preparado pero no necesariamente activado como fuente principal del panel
- Antes de cambiar el panel a produccion real, verificar si Prisma local sigue siendo la fuente efectiva y terminar la migracion si hace falta

## Credenciales y seguridad

- No guardar secretos nuevos en archivos trackeados
- `.env` real esta ignorado por git
- `.env.example` tiene placeholders
- Si se va a seguir con produccion, revisar rotacion de credenciales que hayan sido compartidas en chat antes de este handoff

## Acceso local admin

Para entorno local, el seed deja este acceso por defecto:

- email: `admin@boettopropiedades.com.ar`
- password: `admin123`

Esto sirve solo como acceso local de continuidad. No asumir que es valido para produccion ni dejarlo asi en un deploy final.

## Ultimos cambios hechos

1. Se corrigio el error de build en Vercel relacionado con Prisma Client desactualizado.
2. Se separo el chrome publico del admin mediante `SiteChrome`.
3. Se refino visualmente el panel admin.
4. Se rehizo la seccion de contacto intermedia con imagen y CTA a `/contacto`.
5. Se actualizaron footer y redes.
6. Se generaron e integraron nuevas imagenes calidas para las tarjetas.
7. Todo eso fue comiteado y pusheado a `main`.

## Cosas pendientes razonables para la proxima IA

Elegir segun lo que pida el usuario:

1. Revisar el deploy en Vercel despues del ultimo push.
2. Completar la migracion del panel a una base persistente real en produccion.
3. Conectar definitivamente el panel admin a Supabase si ese sigue siendo el camino elegido.
4. Reemplazar credenciales locales por un esquema de acceso de produccion.
5. Hacer QA visual final mobile y desktop del sitio publicado.

## Comandos utiles

Desde la raiz del proyecto:

```powershell
npm run dev
npm run lint
npm run build
npm run supabase:check
```

## Regla de continuidad

Si una nueva IA toma este proyecto, debe asumir:

- que este archivo es el punto de partida principal
- que el repo ya esta sincronizado con GitHub en `main`
- que el admin local existe y el sitio local responde
- que no debe volver a tocar secretos ni inventar configuraciones faltantes sin verificar el repo y el entorno actual
