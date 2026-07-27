# Boetto Web

Sitio web de Boetto Propiedades construido con Next.js, con una home editorial premium orientada a consulta, contexto de marca y conversion.

## Estado actual

Al 27 de julio de 2026 el proyecto incluye:

1. Home principal con hero de video sujeto a scroll.
2. Buscador integrado como ultimo capitulo del hero.
3. Navegacion publica para comprar, alquilar, vender, conocer el estudio y contactar.
4. Paginas publicas de propiedades, tasaciones, nosotros y contacto.
5. Area admin y APIs internas en desarrollo dentro del mismo repo.

## Stack

1. Next.js 16
2. React 19
3. TypeScript
4. Prisma

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

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

## Notas de validacion

1. El build de produccion debe seguir pasando antes de cerrar cambios importantes.
2. El repo tiene deuda de lint historica fuera de la home; por eso conviene validar con foco cuando el cambio no toca esas areas.
