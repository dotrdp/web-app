@id: rag-02-glosario-002
@documento: rag-02-glosario | temas/02_glosario_terminos_es.md
@categoria: glosario
@titulo: Glosario: índices de vegetación (verdor y estructura del dosel)
@titulo_documento: Glosario del Reto AgroCebada (agronomía, teledetección, clima, estadística y aprendizaje automático)
@etiquetas: glosario; cebada maltera; temporal; fenología de la cebada; zadoks; índices de vegetación; rmse; validación cruzada; fuga de información; regionalismos
@claves: glosario cebada maltera temporal fenologia de la cebada zadoks indices de vegetacion rmse validacion cruzada fuga de informacion regionalismos index vegetacion indice vegetation dataset indices suelo ambos datasets difference influencia normalized proveedor reduce adimensional area datos diccionario dosel estructura foliar general reto savi
@fuente: reto_y_datos/Diccionario_de_indices_satelitales.txt; reto_y_datos/Descripcion_general_variables_DataSet.txt
# Glosario: índices de vegetación (verdor y estructura del dosel)

Contexto: índices calculados por el proveedor para las 197 parcelas, en el Dataset Básico (Sentinel-2 y Landsat, 2022–2025) y en el Dataset PRO (Planet, 2025). Cada índice se resume por parcela y fecha con promedio, desviación estándar (std), máximo y mínimo.

- **NDVI (Normalized Difference Vegetation Index; Índice de Vegetación de Diferencia Normalizada)**: indicador general de presencia, vigor y actividad de vegetación verde. Es adimensional. Aparece en ambos datasets, pero proviene de sensores distintos y no debe fusionarse automáticamente.
- **EVI (Enhanced Vegetation Index)**: índice de vigor vegetal que reduce parte de la influencia del suelo y de la atmósfera. Está en ambos datasets.
- **SAVI (Soil-Adjusted Vegetation Index; índice de vegetación ajustado al suelo)**: reduce la influencia del brillo del suelo, útil cuando la cubierta vegetal aún es incompleta.
- **MSAVI (Modified Soil-Adjusted Vegetation Index)**: variante de SAVI que reduce de forma adaptativa la influencia del suelo. Solo está en el Dataset PRO.
- **LAI (Leaf Area Index; índice de área foliar)**: superficie foliar por unidad de superficie de terreno (m²/m²). Variable biofísica presente en ambos datasets.
- **FAPAR (Fraction of Absorbed Photosynthetically Active Radiation)**: fracción de la radiación fotosintéticamente activa que absorbe la vegetación (adimensional, de 0 a 1).
- **NDSVI (Normalized Difference Senescent Vegetation Index)**: sensible a vegetación senescente y a material no fotosintético. Ayuda a ubicar la maduración.
- **SRNDI (Shortwave Red Normalized Difference Index)**: contrasta el infrarrojo de onda corta con la región roja del espectro.
- **MRA**: variable entregada con esa abreviatura por el proveedor. El diccionario no la desarrolla; su interpretación queda como **no documentada** hasta confirmar la ficha del proveedor.

Fuente: reto_y_datos/Diccionario_de_indices_satelitales.txt; reto_y_datos/Descripcion_general_variables_DataSet.txt
