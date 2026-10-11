# Boetto Web

Sitio web y panel privado de Boetto Propiedades, construido con Next.js.

## Estado actual

El sitio incluye catálogo y fichas públicas, formularios de contacto y tasación, panel de propiedades, importación desde portales, consultas y CRM con pipeline. El 11 de octubre de 2026 se verificaron estos flujos contra un build local de producción con una base de datos aislada. También se conectaron Turso, Vercel Blob y las variables de correo a Vercel. En producción se probaron el alta y la edición de una propiedad, la subida y eliminación de una foto, el formulario de contacto, la creación del lead y su cambio de etapa; el destinatario confirmó la recepción del aviso por correo. Se eliminaron los registros de prueba y, a pedido del usuario, las cuatro propiedades de ejemplo para incorporar publicaciones reales. La home muestra todas las propiedades publicadas si hay hasta ocho; con más de ocho, rota las no destacadas para completar ocho lugares y mantiene visibles todas las destacadas.

## Stack

1. Next.js 16
2. React 19
3. TypeScript
4. Prisma con SQLite local o Turso en producción
5. Vercel Blob para fotos en producción

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

Para repetir la prueba integral local, crear primero una base de datos aislada con `scripts/turso-setup.mjs`, iniciar la aplicación con `TURSO_DATABASE_URL=file:./prisma/audit-test.db` y credenciales de administrador de prueba, y ejecutar `node scripts/smoke-local.mjs`. El script solo acepta `localhost` o `127.0.0.1`, elimina los registros de prueba y comprueba el recorrido HTTP hasta la base de datos. En Windows, el servidor de desarrollo funciona de forma estable con `npm run dev -- --webpack -p 3004`.

Las variables necesarias están descritas en `.env.example`. En Vercel, `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, `NEXTAUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` y `BLOB_READ_WRITE_TOKEN` son esenciales para el panel y las fotos. Las variables `SMTP_*` e `INQUIRY_EMAIL_TO` permiten notificar consultas por correo. El catálogo ficticio solo se habilita con `CATALOG_DEMO_MODE=true` mientras no haya publicaciones reales.

Cuando se conecta una base Turso nueva, `npm run build` crea las tablas faltantes antes de prerenderizar las páginas públicas. El script utiliza `CREATE TABLE IF NOT EXISTS`: prepara una base nueva y no altera tablas existentes. Los cambios futuros de esquema requieren una migración explícita.

## Estructura principal

`src/app/`
Rutas publicas, admin y endpoints internos.

`src/components/`
Componentes de layout, home, propiedades, formularios y admin.

`public/`
Assets de marca, imagenes y video.

`prisma/`
Schema y seed local.

`docs/sdd/`
Normas y contexto estable para Spec-Driven Development.

`specs/`
Iniciativas documentadas con `spec.md`, `plan.md` y `tasks.md`.

## Flujo SDD

Este repo deja de tratar la documentacion como algo accesorio. A partir de este punto:

1. Cada cambio importante arranca con una spec.
2. La spec baja a un plan tecnico.
3. El plan se convierte en tareas verificables.
4. La implementacion y la validacion quedan ancladas a esa iniciativa.

Puntos de entrada:

- `docs/sdd/README.md`
- `specs/README.md`
- `specs/2026-07-27-home-experience/`

## Notas de validación

El 11 de octubre de 2026 pasaron `npm run lint`, `npx tsc --noEmit`, `npm run build` y `node scripts/smoke-local.mjs` contra `next start` antes del ajuste de limpieza de imágenes. El script incluye ahora comprobaciones de borrado de archivos al quitar una foto o eliminar una propiedad; no se pudo repetir la prueba HTTP local tras ese ajuste porque el entorno bloqueó las conexiones a `localhost`, aunque el build, TypeScript y lint pasaron. La subida y eliminación de una foto sí se verificaron en producción. Para el estado de producción, consultar `NEXT_AI_HANDOFF.md`.
