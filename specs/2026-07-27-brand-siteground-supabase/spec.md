# Identidad, SiteGround y Supabase

## Summary

La web debe consolidar una identidad negro, dorado y blanco, mejorar la selección de barrios de Capital Federal y dejar preparada la operación real sobre SiteGround y Supabase.

## Goals

1. Usar negro, dorado y blanco como paleta dominante en la experiencia pública y los botones.
2. Mantener el logo negro sobre el header materializado.
3. Permitir recorrer todos los barrios de Capital Federal en un menú con scroll.
4. Mostrar la dirección y el horario comercial vigentes.
5. Enviar consultas mediante el SMTP seguro del hosting.
6. Centralizar propiedades, consultas, usuarios administrativos e imágenes en Supabase.
7. Mantener secretos exclusivamente del lado servidor y fuera de Git.

## Security

1. La clave `service_role` nunca se expone con prefijo `NEXT_PUBLIC_`.
2. Las credenciales SMTP viven únicamente en variables de entorno.
3. Las tablas expuestas por la Data API tienen RLS habilitado.
4. La lectura anónima se limita a propiedades publicadas.
5. Las escrituras se realizan desde rutas autenticadas del servidor.

## Acceptance Criteria

1. No quedan superficies verdes o beige como colores de marca dominantes.
2. El selector de ubicación lista los 48 barrios de CABA, permite filtrar y tiene scroll visible.
3. Footer y contacto muestran `Carlos Antonio Lopez 3483` y el horario de lunes a viernes.
4. SMTP usa conexión segura por el puerto 465.
5. El repositorio incluye una migración SQL repetible para Supabase.
6. El código de Supabase usa un cliente `server-only`.
7. El sitio sigue funcionando en escritorio y mobile.

