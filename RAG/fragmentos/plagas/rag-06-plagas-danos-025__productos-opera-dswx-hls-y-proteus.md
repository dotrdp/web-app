@id: rag-06-plagas-danos-025
@documento: rag-06-plagas-danos | temas/06_plagas_enfermedades_y_deteccion_de_danos.md
@categoria: plagas
@titulo: Productos OPERA DSWx-HLS y PROTEUS
@titulo_documento: Plagas, enfermedades y detección de daños en cebada de temporal con satélite
@etiquetas: plagas; enfermedades; cebada; valles altos; detección de daño; ndvi; anomalía; teledetección; malezas; roya
@claves: plagas enfermedades cebada valles altos deteccion de dano ndvi anomalia teledeteccion malezas roya agua dswx dswx-hls opera proteus abierta abril atbd escenas etiquetas parcial productos ronda verificado abierto adyacente apache-2 busquedas capa catalogo cinco clasifica codigo consistentes consulto
@fuente: `segmentation_pests_ndvi_water__research__prior_work.md` (§4, §8).
# Productos OPERA DSWx-HLS y PROTEUS

OPERA DSWx-HLS clasifica cada escena HLS v2.0 a 30 m en la misma retícula de los mosaicos del proyecto (tiles T14QNG y T14QNH). Sus valores de la capa WTR son: 0 no agua, 1 agua abierta, 2 agua superficial parcial (≥ 20 % y < 100 % agua), 252 nieve o hielo, 253 nube, sombra o adyacente, y 255 relleno. El documento
técnico (ATBD) reporta 96 % de exactitud en agua abierta y 88 % en agua parcial (no verificado en la ronda 4: el ATBD de DSWx no se consultó por el límite de búsquedas). Está validado desde abril de 2023; el catálogo de Earth Engine empieza el 4 de abril de 2023, por lo que las escenas de 2022 y de Landsat 9 no tienen
etiquetas oficiales de agua en la versión 1.0. PROTEUS
(código abierto de la NASA, licencia Apache-2.0) reproduce DSWx con cinco pruebas espectrales, así que puede generar etiquetas consistentes para esas escenas (no verificado en la ronda 2). DSWx no mapea daño: sólo agua.

Fuente: `segmentation_pests_ndvi_water__research__prior_work.md` (§4, §8).
