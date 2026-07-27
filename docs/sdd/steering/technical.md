# Technical Steering

## Stack actual

1. Next.js 16 con App Router.
2. React 19.
3. TypeScript.
4. Prisma para datos locales y admin.
5. CSS global custom con una capa fuerte de direccion visual propia.

## Criterios tecnicos

1. Mantener compatibilidad con el App Router actual.
2. Evitar complejidad innecesaria si el resultado puede resolverse con componentes y CSS del proyecto.
3. Priorizar performance de la home, especialmente en el hero con video sujeto a scroll.
4. Tratar assets pesados y artefactos de testing como elementos locales, no como parte del historial salvo que sean parte deliberada del producto.

## Convenciones

1. Componentes de experiencia en `src/components/`.
2. Rutas publicas en `src/app/`.
3. APIs internas en `src/app/api/`.
4. Documentacion viva en `docs/sdd/` y `specs/`.

## Validacion minima

1. Build de Next sin errores.
2. Revision funcional local en `localhost`.
3. Lint focalizado en los archivos modificados cuando el repo completo tenga deuda previa.
