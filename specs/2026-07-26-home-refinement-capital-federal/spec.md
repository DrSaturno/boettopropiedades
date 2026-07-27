# Refinamiento de Home y Alcance Capital Federal

## Summary

La home debe conservar la experiencia editorial con video sujeto a scroll, pero reducir su relato a cuatro capítulos, mejorar la legibilidad responsive y alinear el contenido público con el alcance comercial actual de Boetto Propiedades en Capital Federal.

## Problem

La versión actual tiene cinco capítulos en el hero, textos que pueden acercarse demasiado a los bordes, un header sólido desde el inicio y una sección de zonas que ya no responde a la estructura deseada. La marca y los canales de contacto también aparecen con tratamientos y datos inconsistentes.

## Goals

1. Reducir el hero de cinco a cuatro capítulos sin perder el buscador final.
2. Mantener el header transparente durante todo el recorrido del video.
3. Materializar el header recién al comenzar la segunda sección.
4. Limitar las ubicaciones públicas a Capital Federal.
5. Reemplazar las tarjetas de servicios por tres piezas editoriales con imágenes que transmitan confianza.
6. Eliminar la sección de barrido por zonas.
7. Reforzar la llamada a conversación y usar `ventas@boettopropiedades.com`.
8. Respetar los logos horizontales oficiales de la carpeta de branding y corregir su encuadre en header y footer.

## Non-Goals

1. Migrar la persistencia a Supabase.
2. Implementar el panel administrativo definitivo.
3. Configurar un proveedor transaccional de correo sin credenciales.
4. Ampliar el inventario público más allá de las propiedades existentes.

## Experience

### Hero

1. Cuatro capítulos: tesis, forma de habitar, contexto/selección y buscador.
2. Textos contenidos dentro de márgenes seguros en desktop, tablet y mobile.
3. Navegación y progreso actualizados a cuatro momentos.
4. Scroll y video conservan una respuesta amortiguada e interruptible.

### Header

1. Transparente, sin borde sólido, durante el hero.
2. Logo blanco y controles claros sobre el video.
3. Fondo claro, logo color oficial y texto oscuro al alcanzar la primera sección posterior.
4. Menú mobile legible en ambos estados.

### Sección informativa

1. Tres tarjetas con fotografía, texto breve y composición editorial asimétrica.
2. Las imágenes representan acompañamiento humano, lectura arquitectónica y selección cuidada.
3. No se muestra la antigua sección interactiva de zonas.

### Contacto

1. El CTA principal abre un correo dirigido a `ventas@boettopropiedades.com`.
2. El mismo correo se usa en constantes, home y footer.
3. El contenido público menciona Capital Federal.

## Acceptance Criteria

1. El indicador del hero muestra cuatro capítulos.
2. Ningún título o texto principal toca los bordes en anchos de 360 px, 768 px, 1024 px y 1440 px.
3. El header permanece transparente hasta el límite real de la segunda sección.
4. El buscador solo sugiere barrios de Capital Federal.
5. La primera sección posterior al hero contiene exactamente tres tarjetas con imagen.
6. La sección de zonas ya no se renderiza.
7. El CTA destacado y el correo visible usan `ventas@boettopropiedades.com`.
8. Header y footer usan assets oficiales de branding sin recortes visibles.
9. El build de producción finaliza correctamente.

## Validation

1. `npm run build`
2. ESLint focalizado sobre los componentes modificados.
3. Revisión visual en desktop y mobile sobre `http://localhost:3004`.

