# Spec-Driven Development

Este proyecto usa Spec-Driven Development (SDD) como marco de trabajo para cambios de producto y evoluciones funcionales.

## Objetivo

La spec es la fuente principal de contexto. Antes de construir una funcionalidad relevante, primero dejamos claro:

1. Que problema resuelve.
2. Como se ve para el usuario.
3. Como se implementa.
4. Que tareas concretas habilita.

## Estructura

`specs/`
Carpeta de iniciativas versionadas. Cada iniciativa tiene su propio directorio.

`specs/<fecha>-<slug>/spec.md`
Describe la necesidad, alcance, criterios de aceptacion, experiencia deseada y restricciones.

`specs/<fecha>-<slug>/plan.md`
Baja la spec a decisiones tecnicas, impacto en archivos, datos, integraciones y validacion.

`specs/<fecha>-<slug>/tasks.md`
Lista ejecutable de trabajo. Se actualiza a medida que avanzamos.

`docs/sdd/steering/`
Contexto estable del producto. Sirve para no repetir en cada spec las decisiones estructurales del estudio, la marca y la arquitectura.

`docs/sdd/templates/`
Plantillas base para crear nuevas iniciativas sin arrancar de cero.

## Flujo de trabajo

1. Crear una carpeta nueva en `specs/` con formato `YYYY-MM-DD-slug`.
2. Redactar `spec.md` antes de tocar implementacion.
3. Crear `plan.md` cuando la direccion funcional ya este aprobada.
4. Romper el trabajo en `tasks.md`.
5. Implementar y actualizar la spec cuando cambie el alcance real.
6. Cerrar la iniciativa con evidencia de validacion y pendientes claros.

## Reglas del repo

1. No se considera "terminado" un cambio importante si no tiene spec asociada.
2. La spec describe comportamiento y experiencia, no solo tecnologia.
3. El plan tecnico debe citar archivos, rutas o modulos afectados.
4. Las tareas deben ser accionables y verificables.
5. El README resume el estado actual; las specs cuentan la historia de cambios.

## Iniciativa activa

La iniciativa que documenta el estado actual del homepage editorial y el scroll sujeto a video esta en:

`specs/2026-07-27-home-experience/`
