@id: rag-02-glosario-005
@documento: rag-02-glosario | temas/02_glosario_terminos_es.md
@categoria: glosario
@titulo: Glosario: sensores y conceptos de percepción remota
@titulo_documento: Glosario del Reto AgroCebada (agronomía, teledetección, clima, estadística y aprendizaje automático)
@etiquetas: glosario; cebada maltera; temporal; fenología de la cebada; zadoks; índices de vegetación; rmse; validación cruzada; fuga de información; regionalismos
@claves: glosario cebada maltera temporal fenologia de la cebada zadoks indices de vegetacion rmse validacion cruzada fuga de informacion regionalismos radar pixel bandas combinan espacial indices infrarrojo literatura reto banda cercano colaboradores conceptos diccionario fechas fluorescencia humedad landsat literature observaciones optico percepcion red-edge remota
@fuente: reto_y_datos/Diccionario_de_indices_satelitales.txt; teledeteccion_fenologia/literature_review__report__chapters__02_observacion.typ.txt; literatura_aplicacion/literature_review__report__sections__05_modelos.typ.txt
# Glosario: sensores y conceptos de percepción remota

Contexto: las observaciones del reto combinan imágenes ópticas y radar, así como series de fechas por parcela. Cada sensor tiene resolución espacial, frecuencia y procesamiento propios, por lo que el diccionario recomienda conservar la identificación del sensor en el análisis.

- **Sentinel-2 (nivel L2A)**: satélite óptico con bandas visibles e infrarrojo cercano a 10 m; red-edge y SWIR a 20 m; otras bandas a 60 m.
- **Sentinel-1**: radar de apertura sintética. Es sensible a estructura, humedad y geometría de adquisición, y su complementariedad con el óptico es una hipótesis física que debe probarse en la campaña concreta.
- **Landsat**: serie de satélites que el reto usa para VI6T. Landsat 6 no alcanzó órbita y no aporta observaciones.
- **Planet / PlanetScope**: fuente comercial del Dataset PRO (2025), con acceso y fechas sujetos a disponibilidad.
- **Banda red-edge (borde rojo)**: bandas entre el rojo y el infrarrojo cercano, sensibles a la clorofila.
- **SWIR (infrarrojo de onda corta)**: banda usada en varios índices de humedad y labranza.
- **Retrodispersión (backscatter)**: intensidad de la señal radar devuelta por el terreno y la vegetación.
- **Cociente radar CR**: relación entre señales radar que Iranzo y colaboradores combinan con ópticos (literatura; definición exacta no verificada).
- **Fluorescencia inducida por el sol (SIF)**: señal de fluorescencia de la vegetación. Li y colaboradores la combinan con índices para estimar rendimiento distrital en Suecia (R² de 0.77; literatura).
- **Resolución espacial (píxel)**: tamaño del área que representa cada valor de imagen. Un píxel de 10 m no es una medición de un punto; es un promedio de su superficie.
- **Mezcla espacial (mixed pixel)**: situación en que un píxel contiene varias cubiertas, como cultivo, camino o suelo desnudo.

Fuente: reto_y_datos/Diccionario_de_indices_satelitales.txt; teledeteccion_fenologia/literature_review__report__chapters__02_observacion.typ.txt; literatura_aplicacion/literature_review__report__sections__05_modelos.typ.txt
