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
7. Reforzar la llamada a conversación y usar `info@boettopropiedades.com`.
8. Respetar los logos horizontales oficiales de la carpeta de branding y corregir su encuadre en header y footer.
9. Aplicar la paleta oficial del manual de identidad.
10. Cerrar la home con un formulario de contacto.

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
3. Fondo claro, logo monocromático negro y texto oscuro al alcanzar la primera sección posterior.
4. Menú mobile legible en ambos estados.

### Orden posterior al hero

1. La sección “Próxima conversación” aparece inmediatamente después del hero.
2. Luego se muestra una fila de tres tarjetas con fotografía y texto.
3. Las tarjetas tienen igual ancho y altura en desktop.
4. Las imágenes representan acompañamiento humano, lectura arquitectónica y selección cuidada.
5. No se muestra la antigua sección interactiva de zonas.
6. La última sección contiene el formulario de contacto.

### Paleta oficial

1. Principal: `#2E2C29`.
2. Secundario salvia: `#93A896`.
3. Secundario taupe: `#989282`.
4. Acento cálido: `#D4AA87`.
5. Soporte crema: `#F1E7D5`.
6. Botones e interacciones mantienen contraste suficiente usando carbón como texto o fondo.

### Contacto

1. El CTA principal abre un correo dirigido a `info@boettopropiedades.com`.
2. El mismo correo se usa en constantes, home y footer.
3. El contenido público menciona Capital Federal.

## Acceptance Criteria

1. El indicador del hero muestra cuatro capítulos.
2. Ningún título o texto principal toca los bordes en anchos de 360 px, 768 px, 1024 px y 1440 px.
3. El header permanece transparente hasta el límite real de la segunda sección.
4. El buscador solo sugiere barrios de Capital Federal.
5. La primera sección posterior al hero contiene exactamente tres tarjetas con imagen.
6. La sección de zonas ya no se renderiza.
7. El CTA destacado y el correo visible usan `info@boettopropiedades.com`.
8. Header y footer usan assets oficiales de branding sin recortes visibles.
9. El build de producción finaliza correctamente.
10. La sección “Próxima conversación” es la primera después del hero.
11. Las tres tarjetas forman una fila uniforme en desktop.
12. El formulario de contacto es la última sección antes del footer.
13. La interfaz no utiliza el bordó anterior como color de acción.

## Validation

1. `npm run build`
2. ESLint focalizado sobre los componentes modificados.
3. Revisión visual en desktop y mobile sobre `http://localhost:3004`.
