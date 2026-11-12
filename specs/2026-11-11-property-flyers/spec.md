# Folletos de propiedades

## Summary

El panel genera folletos en PDF de las propiedades cargadas en la web, con el mismo diseño que hoy produce la skill externa de la inmobiliaria. Reemplaza ese proceso manual: se elige la propiedad, se revisan los textos y se descarga el archivo.

## Goals

1. Generar el folleto de cualquier propiedad cargada, sin salir del panel.
2. Reproducir con fidelidad las dos piezas de referencia: "Sin precio (historia vertical)", 720 × 1280, y "Con precio", 949 × 1599.
3. Precargar los textos desde los datos de la propiedad y permitir editarlos antes de descargar.
4. Entregar PDF de una página y también la imagen JPG, para compartir en redes.
5. Usar solo fotos ya cargadas en la propiedad.

## Layouts

**Sin precio (historia vertical)**: logo vertical, etiqueta (VENTA / ALQUILER), zona, subtítulo, dos fotos anchas, fila de hasta tres fotos chicas, recuadro con título (con una parte resaltada en cobre), descripción y características (algunas resaltadas en verde salvia) y firma del corredor.

**Con precio**: logo, etiqueta, zona, subtítulo, foto principal, hasta tres fotos chicas, tres recuadros destacados, tarjeta con precio, detalle, seis características y descripción en cursiva, cinta diagonal RESERVADO opcional y firma.

## Security

1. Solo usuarios con sesión de administrador pueden consultar o generar folletos.
2. Cada foto pedida debe figurar en la lista de imágenes de la propiedad indicada; no se descargan direcciones arbitrarias.
3. Los datos del folleto se validan en el servidor con límites de longitud y cantidad.
4. Las descargas de fotos tienen tiempo límite y tamaño máximo.

## Acceptance Criteria

1. Con las fotos y textos de las referencias, el resultado coincide con ellas salvo diferencias de pocos píxeles.
2. El PDF tiene una página del tamaño de la plantilla y pesa menos de 1 MB en uso normal.
3. Funciona con el build de producción y en Vercel.
4. Sin sesión, la API responde 401.
