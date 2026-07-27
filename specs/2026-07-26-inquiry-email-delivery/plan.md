# Plan Técnico

## Implementation

1. Agregar campos de estado de notificación a `Inquiry`.
2. Crear un módulo `server-only` de transporte SMTP con Nodemailer.
3. Escapar el contenido generado para la versión HTML del correo.
4. Crear un orquestador que actualice el estado después del intento.
5. Integrar el orquestador en `/api/contacto` y `/api/tasaciones`.
6. Documentar variables sin incluir secretos.

## Failure Strategy

La persistencia es la fuente de verdad. Si SMTP no está configurado o falla, la consulta continúa disponible en el panel administrativo con estado `failed`. Esto evita pérdida de leads y deja preparado un futuro mecanismo de reintentos.

## Validation

1. Sincronización del esquema Prisma local mediante `prisma db push`.
2. Build y TypeScript.
3. Prueba local del estado `failed` sin credenciales.
4. Prueba real de estado `sent` cuando se carguen credenciales válidas.
