# Entrega de Consultas por Email

## Summary

Todas las consultas creadas desde contacto, propiedades y tasaciones deben persistirse y generar una notificación dirigida a `info@boettopropiedades.com`.

## Goals

1. Mantener la consulta en base de datos antes de intentar el envío.
2. Enviar una notificación por SMTP al correo comercial.
3. Usar el email del visitante como `reply-to`.
4. Registrar si la notificación fue enviada o falló.
5. No exponer credenciales SMTP al navegador ni al repositorio.
6. Conservar la consulta aunque el proveedor de correo esté temporalmente caído.

## Non-Goals

1. Configurar una cuenta externa o crear credenciales en nombre del cliente.
2. Implementar campañas, newsletters o automatizaciones comerciales.
3. Reemplazar todavía la persistencia local por Supabase.

## Configuration

1. `SMTP_HOST`
2. `SMTP_PORT`
3. `SMTP_SECURE`
4. `SMTP_USER`
5. `SMTP_PASS`
6. `SMTP_FROM`
7. `INQUIRY_EMAIL_TO`, opcional; por defecto usa `info@boettopropiedades.com`.

## Acceptance Criteria

1. Contacto y tasaciones crean primero un registro `Inquiry`.
2. Cada registro comienza con estado `pending`.
3. Un envío exitoso registra `sent` y `notifiedAt`.
4. Un envío fallido registra `failed` y un error acotado.
5. El formulario recibe éxito si la consulta fue guardada, aunque el email falle.
6. El cuerpo del correo incluye nombre, email, teléfono, tipo, mensaje y propiedad cuando corresponda.
7. El build no incorpora secretos en el bundle cliente.
