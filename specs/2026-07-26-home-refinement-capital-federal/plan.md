# Plan Técnico

## Implementation Shape

La iteración se mantiene dentro de `HomeExperience`, `Header`, `Footer`, constantes y estilos globales. No se agregan librerías de animación: el scrub existente ya usa `requestAnimationFrame`, valores transitorios en refs locales y una interpolación amortiguada adecuada para el gesto.

## Decisions

1. El capítulo de contexto absorbe la idea de selección para reducir el relato a cuatro pasos.
2. La sección de servicios usa `next/image` con assets locales optimizados.
3. El cambio del header se vincula a un marcador DOM en la primera sección posterior al hero, no a un número fijo de scroll.
4. El header usa dos variantes oficiales del logo y transiciona entre ellas por opacidad.
5. Capital Federal se aplica a buscador, metadatos y textos institucionales visibles.
6. El correo comercial se centraliza en `COMPANY_INFO`.
7. Los tokens globales se derivan de los cinco colores definidos en el manual de identidad.
8. La versión materializada del header usa el logo monocromático negro.
9. `ContactForm` incorpora una variante editorial reutilizable para la home.

## Files

1. `src/components/home/HomeExperience.tsx`
2. `src/components/layout/Header.tsx`
3. `src/components/layout/Footer.tsx`
4. `src/lib/constants.ts`
5. `src/app/layout.tsx`
6. `src/app/globals.css`
7. `specs/README.md`
8. `src/components/forms/ContactForm.tsx`

## Risks

1. El formulario final del hero necesita conservar altura suficiente en pantallas bajas.
2. El logo oficial tiene un lienzo SVG amplio; su contenedor debe usar `object-fit: contain` y dimensiones estables.
3. La entrega automática de formularios por correo requiere una fase posterior con proveedor y credenciales, aunque los CTA directos ya pueden usar `mailto`.
4. La paleta salvia y cálida requiere texto carbón en botones para conservar contraste.

## Validation

1. Compilación de producción.
2. Verificación visual de los umbrales del header.
3. Pruebas del buscador, dropdowns y CTA.
4. Capturas desktop y mobile para revisar encuadre y desbordes.
