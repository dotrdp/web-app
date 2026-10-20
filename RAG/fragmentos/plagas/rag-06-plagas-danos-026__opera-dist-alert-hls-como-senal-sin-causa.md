@id: rag-06-plagas-danos-026
@documento: rag-06-plagas-danos | temas/06_plagas_enfermedades_y_deteccion_de_danos.md
@categoria: plagas
@titulo: OPERA DIST-ALERT-HLS como señal sin causa
@titulo_documento: Plagas, enfermedades y detección de daños en cebada de temporal con satélite
@etiquetas: plagas; enfermedades; cebada; valles altos; detección de daño; ndvi; anomalía; teledetección; malezas; roya
@claves: plagas enfermedades cebada valles altos deteccion de dano ndvi anomalia teledeteccion malezas roya atbd perdida causa dist-alert-hls ronda senal alertas base cultivos dias dist-alert evidencia fecha granulos linea opera provisional research superior abril alrededor anos anuales aparecen busqueda
@fuente: `iterate_20261017__research__B1_damage_detection.md` (§2.3, §6); `segmentation_pests_ndvi_water__research__prior_work.md` (§5).
# OPERA DIST-ALERT-HLS como señal sin causa

DIST-ALERT-HLS mapea pérdida de cubierta vegetal a 30 m por escena, comparando contra una línea base de los tres años previos en una ventana de 31 días (±15 días alrededor de la fecha; verificado en el ATBD v1, ronda 4). Sus alertas se separan en pérdida menor a 50 % y pérdida de 50 % o más, con estados primera,
provisional y confirmada. La fecha de inicio de los gránulos (1 de enero de 2023) no se confirmó en el ATBD (SIN EVIDENCIA). El producto v1 se publicó en marzo de 2024 (ATBD), y la versión 0 provisional se retiró en abril de 2025 (búsqueda, ronda 4). La especificación no menciona cultivos ni plagas. En B1 se reportan
217 gránulos de DIST-ALERT entre mayo y diciembre de 2025 para los dos tiles. El ATBD v1 consultado en la ronda 4 especifica una exactitud global superior a 80 % para alertas de pérdida de 50 % o más en DIST-ALERT, y superior a 90 % en DIST-ANN. Las cifras de precisión de 94.2 % y recall de 93.9 % no aparecen en ese
documento (SIN EVIDENCIA; se retiran). El proyecto la usa como señal sin causa y no como etiqueta de daño, porque su línea base es inestable en cultivos anuales rotados.

Fuente: `iterate_20261017__research__B1_damage_detection.md` (§2.3, §6); `segmentation_pests_ndvi_water__research__prior_work.md` (§5).
