# Plan Tecnico

## Implementation Shape

La home queda consolidada en un componente de experiencia unica (`HomeExperience`) que concentra el hero scroll-driven, las capas narrativas y el buscador final, mientras el resto de la pagina refuerza servicios, zonas y contacto con menor dependencia de inventario publicado.

## Files and Areas

1. `src/components/home/HomeExperience.tsx`
Centraliza capitulos del hero, logica de scrub del video, reveal de secciones y buscador final.

2. `src/components/layout/Header.tsx`
Reordena la navegacion publica segun el enfoque de conversion actual.

3. `src/app/globals.css`
Define la direccion visual, layout responsive y la coreografia del hero y del buscador.

4. `src/app/page.tsx`
Mantiene una entrada simple a la experiencia principal.

5. `public/video/boetto-luxury-tour.mp4`
Asset de video usado para el hero.

## Decisions

1. La narrativa vive en la home y no se fragmenta en multiples bloques inconexos.
2. El buscador se integra al final del hero para cerrar el relato con una accion.
3. El scroll-control del video se resuelve con una interpolacion amortiguada para evitar saltos bruscos.
4. La home privilegia informacion curada sobre cantidad de propiedades visibles.

## Risks

1. El video puede sentirse pesado en dispositivos lentos si el scrub fuerza demasiados seeks.
2. El buscador final debe seguir siendo usable en mobile dentro de un espacio visualmente limitado.
3. El repo tiene deuda de lint previa fuera de la home, por lo que la validacion debe ser focalizada.

## Validation

1. `npm run build`
2. `npx eslint src/components/home/HomeExperience.tsx src/components/layout/Header.tsx`
3. Verificacion manual de la home corriendo en localhost.
