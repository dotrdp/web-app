@id: rag-02-glosario-013
@documento: rag-02-glosario | temas/02_glosario_terminos_es.md
@categoria: glosario
@titulo: Glosario: suelo, topografía y relieve
@titulo_documento: Glosario del Reto AgroCebada (agronomía, teledetección, clima, estadística y aprendizaje automático)
@etiquetas: glosario; cebada maltera; temporal; fenología de la cebada; zadoks; índices de vegetación; rmse; validación cruzada; fuga de información; regionalismos
@claves: glosario cebada maltera temporal fenologia de la cebada zadoks indices de vegetacion rmse validacion cruzada fuga de informacion regionalismos suelo elevacion humedad literatura reto agua aplicacion capacidad contexto pendiente regional relieve continuo cultivo elevaciones inegi literature mexicano parcela propiedades report residual retencion review
@fuente: reto_y_datos/Descripcion_general_variables_DataSet.txt; literatura_aplicacion/literature_review__report__sections__07_economia_aplicacion.typ.txt; agronomia/modelado__research_notes__Barley_yield_predictors_Mexican_highlands__regional_agronomy.md;
# Glosario: suelo, topografía y relieve

Contexto: el reto entrega elevación y pendiente del Continuo de Elevaciones Mexicano (CEM 4.0 de INEGI, 15 m). Las propiedades de suelo son de fuentes globales de menor resolución y deben tratarse como contexto.

- **Suelo (soil)**: capa superficial donde crece el cultivo. Su capacidad de retención de agua condiciona la humedad disponible en temporal.
- **Humedad residual (residual soil moisture)**: agua almacenada en el perfil que sostiene al cultivo de temporal cuando no llueve. La definición SIAP la menciona junto con la lluvia.
- **Capacidad de retención de humedad (water-holding capacity)**: cantidad de agua que el suelo puede retener para las plantas. En los llanos de Apan, los suelos profundos amortiguan la canícula (literatura regional).
- **SoilGrids**: propiedades de suelo estimadas globalmente a 250 m, con profundidades e incertidumbre. Es contexto de capacidad productiva, no medición de la parcela.
- **Elevación (elevation)**: altitud del terreno sobre el nivel del mar, en metros (msnm). Es raster estático del reto.
- **Pendiente (slope)**: inclinación del terreno, en grados o porcentaje. Derivada del CEM.
- **CEM (Continuo de Elevaciones Mexicano)**: modelo digital de elevación del INEGI, fuente de la elevación y la pendiente del reto.
- **Posición topográfica**: lugar de la parcela en el relieve. Las celdas bajas de la llanura endorreica conservan humedad y verdor por más tiempo (literatura regional).
- **Labranza (tillage)**: preparación mecánica del suelo. La agricultura de conservación reduce la alteración del suelo y mantiene cobertura orgánica permanente.

Fuente: reto_y_datos/Descripcion_general_variables_DataSet.txt; literatura_aplicacion/literature_review__report__sections__07_economia_aplicacion.typ.txt; agronomia/modelado__research_notes__Barley_yield_predictors_Mexican_highlands__regional_agronomy.md;
literatura_aplicacion/literature_review__report__chapters__04_transferencia.typ.txt
