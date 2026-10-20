@id: rag-08-experimentos-profundos-026
@documento: rag-08-experimentos-profundos | temas/08_experimentos_modelos_profundos_y_fundacionales.md
@categoria: experimentos
@titulo: Nuestros experimentos: modelo Prithvi con capa de salida
@titulo_documento: Modelos profundos, fundacionales y de proceso: literatura y nuestros experimentos con validación cruzada
@etiquetas: estimación de rendimiento; cebada maltera; validación cruzada; MMST-ViT; redes profundas; modelos fundacionales; modelos de cultivo; pocas etiquetas; techo de información; Prithvi; TabPFN
@claves: estimacion de rendimiento cebada maltera validacion cruzada mmst-vit redes profundas modelos fundacionales modelos de cultivo pocas etiquetas techo de informacion prithvi tabpfn experimento modelo cambios capa experimentos fira metricas nuestros parcelas salida abril afirmar agera5 agrocebada altura biomasa canales carga cerrar comparacion cruzada documentacion documentadas dosel
@fuente: Proyecto FIRA 2026 «Reto AgroCebada», README del experimento Prithvi-yield (sin métricas documentadas).
# Nuestros experimentos: modelo Prithvi con capa de salida

Nuestro experimento con Prithvi-EO-2.0-600M-TL usó el modelo sin cambios, salvo una red feed-forward al final, con 32 canales de entrada y 7 fotogramas mensuales. Carga 493 de 498 tensores preentrenados sin cambios. Las entradas son 7 meses (abril a octubre) de imágenes de 224 x 224 px a 10 m (2.24 km por lado): NDVI
de Sentinel-2, biomasa y altura de dosel de modelos Granite, temperatura superficial y 27 variables de AgERA5.

El entrenamiento fue en dos etapas: primero con rendimientos municipales de temporal de SIAP (89 municipios con etiquetas de 2016 a 2024) y luego con las parcelas FIRA. La documentación del experimento no reporta métricas, así que no es posible afirmar si funcionó. Este resultado queda como pendiente: se necesita la
evaluación con validación cruzada sobre las 138 parcelas para cerrar la comparación.

Fuente: Proyecto FIRA 2026 «Reto AgroCebada», README del experimento Prithvi-yield (sin métricas documentadas).
