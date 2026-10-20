@id: rag-07-teledeteccion-038
@documento: rag-07-teledeteccion | temas/07_teledeteccion_y_fenologia.md
@categoria: teledeteccion
@titulo: Representaciones aprendidas y contexto anual
@titulo_documento: Teledetección y fenología satelital para la cebada de temporal en el Altiplano
@etiquetas: teledeteccion; sentinel-2; fenologia satelital; ndvi; red-edge; resolucion espacial; nubosidad; curvas sigmoides; cebada; cobertura de espiga; ventana critica; calibracion entre sensores
@claves: teledeteccion sentinel-2 fenologia satelital ndvi red-edge resolucion espacial nubosidad curvas sigmoides cebada cobertura de espiga ventana critica calibracion entre sensores arxiv representaciones alphaearth contexto presto anual aporta aprendidas codificador dimensiones millones tseng vector vectores ademas adicional agrupada ancho anterior anticiparla anuales articulo base capas chapters
@fuente: literature_review__report__chapters__03_representaciones.typ.txt; Tseng et al. (2023), Presto, arXiv:2304.14065; arXiv:2605.10029 (AlphaEarth, estudio secundario)
# Representaciones aprendidas y contexto anual

Las representaciones de modelos fundacionales (Presto, Galileo, Prithvi-EO-2.0, AlphaEarth y otros) resumen series temporales en vectores. Presto (Tseng et al. 2023, arXiv:2304.14065) tiene unos 0.40 millones de parámetros en su codificador (tablas 5 y 6 del artículo) y 0.81 millones en codificador más decodificador en
la variante de profundidad 2 y ancho 128 de su tabla 8 (verificado). AlphaEarth Foundations produce vectores anuales de 64 dimensiones a 10 m, con cobertura publicada de 2017–2024 según estudios que la usan (p. ej. arXiv:2605.10029); el proyecto, además, descargó y validó capas de 2025 para las 197 parcelas, por lo que
la colección disponible ya incluye 2025. Un vector de un año anterior puede servir como contexto, mientras que uno del mismo año aporta información de todo el periodo. Esta distinción importa porque estimar una cosecha histórica y anticiparla son tareas diferentes. Las dimensiones no tienen interpretación directa como
fertilidad o lluvia sin evidencia adicional. Como recomendación (no resultado), cualquier vector de representación debe compararse contra una línea base de índices simples como NDVI o red-edge, con validación agrupada por municipio, para medir cuánto aporta de verdad.

Fuente: literature_review__report__chapters__03_representaciones.typ.txt; Tseng et al. (2023), Presto, arXiv:2304.14065; arXiv:2605.10029 (AlphaEarth, estudio secundario)
