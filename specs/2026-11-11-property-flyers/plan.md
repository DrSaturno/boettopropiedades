# Plan Técnico

## Motor de render

1. `src/lib/flyers/templates.tsx` dibuja cada plantilla con JSX para `ImageResponse` (`next/og`, basado en Satori). Las medidas están en los píxeles de las referencias y se escalan por `FLYER_SCALE` (2).
2. `src/lib/flyers/render.tsx` descarga las fotos, corrige su orientación, las recorta al hueco exacto con `sharp` y arma la imagen. Los textos largos se parten solos; el recuadro crece con el contenido.
3. El PDF es una página con la imagen a tamaño completo, armada con `pdf-lib`.
4. Tipografía Montserrat (licencia SIL OFL) y logo vertical blanco se incluyen codificados en `src/lib/flyers/assets/embedded.ts`, para no depender de archivos sueltos en el servidor.

## Datos

1. `src/lib/flyers/types.ts` define el esquema `FlyerData` con zod y los límites por plantilla.
2. `src/lib/flyers/defaults.ts` propone los textos desde la propiedad: zona, ambientes, cochera, superficies, amenities, descripción resumida y precio.

## API y panel

1. `GET /api/folletos?propertyId=` devuelve la propiedad y los valores por defecto de ambas plantillas.
2. `POST /api/folletos` valida, genera y devuelve PDF o JPG (`format`).
3. `/admin/folletos` permite elegir propiedad, cambiar de plantilla, editar textos y características, elegir y ordenar fotos, ver la vista previa y descargar. En la lista de propiedades hay un acceso directo "Folleto".

## Validation

1. Comparación lado a lado y por diferencia de píxeles contra las dos referencias, usando sus propias fotos.
2. Prueba de la API con sesión de prueba: PDF, JPG, foto ajena, datos inválidos y propiedad inexistente.
3. Prueba en el navegador: vista previa, cambio de plantilla, cinta RESERVADO y descarga.
4. `npm run lint`, `npx tsc --noEmit` y `npm run build`; repetición de la generación contra `next start`.
