# Plan Técnico

## Diseño

1. Negro tinta `#0B0B0B`.
2. Dorado principal `#C5A05C`.
3. Blanco editorial `#FFFFFF`.
4. Gris neutro solo para jerarquía tipográfica y divisores.
5. Mantener el video sujeto al scroll como gesto visual principal.

## Frontend

1. Remapear los tokens históricos a la nueva identidad para conservar compatibilidad.
2. Ajustar CTA, tarjetas, buscador, formulario y header.
3. Incorporar los 48 barrios de CABA.
4. Dar altura máxima, desplazamiento vertical y scrollbar estilizado a las sugerencias.
5. Actualizar datos institucionales.

## Servicios

1. Configurar Nodemailer para SMTP seguro de SiteGround.
2. Crear cliente administrativo de Supabase exclusivamente del lado servidor.
3. Agregar SQL para tablas, índices, RLS y bucket de imágenes.
4. Migrar gradualmente los repositorios de propiedades, consultas, usuarios y archivos.

## Validation

1. Verificación visual desktop y mobile.
2. Prueba SMTP controlada.
3. Verificación de conectividad con Supabase.
4. Lint focalizado, TypeScript y build de producción.

