# Supabase

## 1. Crear la estructura

Abrir el SQL Editor del proyecto y ejecutar:

`migrations/202607270001_boetto_core.sql`

El script crea:

- `properties`
- `inquiries`
- `users`
- índices y trigger de actualización
- RLS para todas las tablas
- lectura pública limitada a propiedades publicadas
- bucket público `property-images` con escritura reservada al servidor

## 2. Variables del servidor

Configurar las variables documentadas en `.env.example`. La clave administrativa no debe usar el prefijo `NEXT_PUBLIC_`.

## 3. Activación

Después de ejecutar la migración:

```bash
npm run supabase:check
```

Luego migrar los registros locales antes de activar Supabase como fuente de verdad.

Para que las nuevas imágenes del panel se guarden en el bucket, establecer:

```env
SUPABASE_STORAGE_ENABLED="true"
```
