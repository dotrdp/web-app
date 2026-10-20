@id: rag-02-glosario-006
@documento: rag-02-glosario | temas/02_glosario_terminos_es.md
@categoria: glosario
@titulo: Glosario: representaciones aprendidas y modelos fundacionales geoespaciales
@titulo_documento: Glosario del Reto AgroCebada (agronomía, teledetección, clima, estadística y aprendizaje automático)
@etiquetas: glosario; cebada maltera; temporal; fenología de la cebada; zadoks; índices de vegetación; rmse; validación cruzada; fuga de información; regionalismos
@claves: glosario cebada maltera temporal fenologia de la cebada zadoks indices de vegetacion rmse validacion cruzada fuga de informacion regionalismos representaciones aprendidas literature observaciones report representacion review vector chapters datos fundacionales fusion geoespaciales literatura modelo modelos observacion optico proyecto radar resume sensores ademas adicional
@fuente: teledeteccion_fenologia/literature_review__report__chapters__03_representaciones.typ.txt; reto_y_datos/literature_review__report__sections__04_datos.typ.txt; literatura_aplicacion/literature_review__report__chapters__04_transferencia.typ.txt
# Glosario: representaciones aprendidas y modelos fundacionales geoespaciales

Contexto: además de los índices definidos por el investigador, el corpus revisa representaciones aprendidas a partir de grandes colecciones de observaciones de la Tierra. El proyecto las evalúa como alternativas, sin asumir que mejoran el rendimiento de cebada.

- **Modelo fundacional geoespacial (geospatial foundation model)**: modelo preentrenado con observaciones de satélite, reutilizable en tareas posteriores. Presto, Galileo, Prithvi, SatMAE, CROMA y TerraMind son ejemplos citados en la literatura revisada.
- **Embedding o vector de representación**: vector numérico que resume una observación o una serie. Una dimensión individual no se interpreta como fertilidad, lluvia o manejo sin evidencia adicional.
- **AlphaEarth**: producto de representación anual a 10 m, de 64 dimensiones, que resume un año natural. La ficha del catálogo consultada mostraba 2017–2024, pero el proyecto descargó y validó capas de 2017 a 2025.
- **Fusión de sensores (sensor fusion)**: integración de observaciones de sensores distintos, como radar y óptico.
- **Representación multimodal**: vector que combina fuentes distintas, por ejemplo óptico, radar y clima.
- **Modalidad ausente**: fuente sin observación en una parcela o fecha. En estas representaciones, la ausencia forma parte del problema de modelado.

Fuente: teledeteccion_fenologia/literature_review__report__chapters__03_representaciones.typ.txt; reto_y_datos/literature_review__report__sections__04_datos.typ.txt; literatura_aplicacion/literature_review__report__chapters__04_transferencia.typ.txt
