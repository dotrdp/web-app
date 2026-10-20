@id: rag-06-plagas-danos-039
@documento: rag-06-plagas-danos | temas/06_plagas_enfermedades_y_deteccion_de_danos.md
@categoria: plagas
@titulo: Recorte de atípicos y RMSE
@titulo_documento: Plagas, enfermedades y detección de daños en cebada de temporal con satélite
@etiquetas: plagas; enfermedades; cebada; valles altos; detección de daño; ndvi; anomalía; teledetección; malezas; roya
@claves: plagas enfermedades cebada valles altos deteccion de dano ndvi anomalia teledeteccion malezas roya rmse atipicos debe perdidas porque recorte ajustarse aproximadamente atipico aumentaria ayudan caso chignahuapan condicional daria estimador explicadas forensics incluir iterate mano media medio metrica modelo
@fuente: `iterate_20261017__research__A2_outlier_forensics.md` (§7).
# Recorte de atípicos y RMSE

A2 recomienda no recortar ni reducir el peso de los atípicos cuando la métrica es RMSE, porque la media condicional debe incluir el riesgo de pérdidas no explicadas. Subir las predicciones de Chignahuapan en 0.04 t/ha, aproximadamente lo que daría un estimador robusto de nivel, aumentaría el RMSE en unos 0.002, porque
el residual medio de la zona es −0.026. Las pérdidas robustas ayudan al MAE, no al RMSE. Por tanto, un valor del modelo para un atípico no debe ajustarse a mano para "reparar" el caso.

Fuente: `iterate_20261017__research__A2_outlier_forensics.md` (§7).
