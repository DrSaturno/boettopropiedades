# Homepage Editorial Premium

## Summary

La home debe presentar a Boetto Propiedades como un estudio inmobiliario sofisticado, informativo y altamente visual, usando un hero con video sujeto a scroll para conducir la narrativa antes de llevar al usuario al buscador.

## Problem

La experiencia inicial de una web inmobiliaria suele caer en plantillas genericas, grillas repetidas y foco excesivo en inventario. En este proyecto, la oferta publicada todavia es acotada, por lo que la home necesita construir autoridad, deseo y claridad sin depender de muchas fichas.

## Goals

1. Convertir la home en una experiencia editorial de marca con lenguaje premium.
2. Usar un video inmersivo en el hero como hilo conductor del relato.
3. Mantener la pagina mas informativa que listadora.
4. Terminar el scroll del hero en un buscador claro y accionable.
5. Resolver desktop y mobile sin perder el concepto visual.

## Non-Goals

1. Construir un portal masivo de propiedades.
2. Llenar la home con decenas de cards o listados repetitivos.
3. Reemplazar el resto del sitio publico o el admin completo en esta etapa.

## Experience

### Hero

1. Video real de una casa premium visto desde arriba, usado como fondo inmersivo.
2. Scroll sujeto al video con capitulos narrativos.
3. Transiciones suaves, tipografia elegante y capas superpuestas.

### Conversion

1. El ultimo capitulo del hero debe terminar en un buscador.
2. El buscador debe priorizar operacion, ubicacion y tipo de propiedad.
3. Para venta de propietarios, la accion debe redirigir a tasaciones.

### Home posterior al hero

1. Maximo aproximado de cinco secciones.
2. Mayor peso en servicios, contexto de zonas, lectura de mercado y contacto.
3. Menor peso en exhibicion de stock.

### Navegacion

1. Header claro y funcional.
2. Accesos rapidos a comprar, alquilar, vender y contenido secundario.

## Acceptance Criteria

1. La home usa el video local del proyecto como pieza principal del hero.
2. El video responde al scroll de forma suave y controlada.
3. El ultimo capitulo del hero incluye tabs de operacion y filtros de busqueda.
4. La home no repite un segundo buscador redundante debajo del hero.
5. El sitio conserva una lectura informativa y premium con pocas secciones.
6. La version mobile mantiene legibilidad, centrado y usabilidad de filtros.

## Constraints

1. Debe trabajar con Next.js App Router.
2. Debe funcionar con el asset local `public/video/boetto-luxury-tour.mp4`.
3. Debe evitar dependencias innecesarias para motion si el comportamiento ya puede resolverse de forma nativa.

## Validation

1. Build de produccion exitosa.
2. Verificacion local en `http://localhost:3004`.
3. Revision visual desktop y mobile.
