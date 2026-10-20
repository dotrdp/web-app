@id: rag-08-experimentos-profundos-044
@documento: rag-08-experimentos-profundos | temas/08_experimentos_modelos_profundos_y_fundacionales.md
@categoria: experimentos
@titulo: Preguntas y respuestas
@titulo_documento: Modelos profundos, fundacionales y de proceso: literatura y nuestros experimentos con validación cruzada
@etiquetas: estimación de rendimiento; cebada maltera; validación cruzada; MMST-ViT; redes profundas; modelos fundacionales; modelos de cultivo; pocas etiquetas; techo de información; Prithvi; TabPFN
@claves: estimacion de rendimiento cebada maltera validacion cruzada mmst-vit redes profundas modelos fundacionales modelos de cultivo pocas etiquetas techo de informacion prithvi tabpfn datos rendimiento cebada frente rmse calibracion chirps condado dataset desempeno experimentos parcelas segun temporal usda variables alcanzo aprendizaje apsim base cinco conjunto conjuntos cota
@fuente: [mmst-vit__README.md, mmst-vit__docs__model_selection_20261006.md, mmst-vit__docs__yield_information_identifiability_20261007.md, mmst-vit__outputs__transfer_iteration_20261007__research__information_ceiling_audit_20261007.md, model__README.md, prithvi-yield__README.md,
# Preguntas y respuestas

**P:** ¿Qué métrica mide el mejor resultado de MMST-ViT en nuestros experimentos?
**R:** El MAE más bajo de la validación cruzada de cinco pliegues sobre las 138 parcelas fue 0.3226 t/ha, frente a 0.3342 t/ha de la configuración pareada.

**P:** ¿Se alcanzó el objetivo de 0.100 t/ha?
**R:** No. Ninguna variante de MMST-ViT ni de los experimentos de transferencia alcanzó 0.100 t/ha.

**P:** ¿Qué RMSE y MAE tiene la CNN temporal con validación cruzada?
**R:** RMSE 0.5907 t/ha, MAE 0.4422 t/ha y R² 0.5149, frente a una línea base de media con RMSE 0.8605 t/ha.

**P:** ¿DeepCropNet usa datos satelitales?
**R:** No. Según Lin et al. (2020), usa solo tres variables meteorológicas semanales: grados-día de crecimiento, grados-día de muerte y precipitación.

**P:** ¿Qué dice la literatura sobre el desempeño de LSTM y CNN temporales?
**R:** Bai et al. (2018) encontraron que una CNN simple superó a las LSTM en diversas tareas de secuencias. Pelletier et al. (2019) reportaron que TempCNN fue más precisa que Random Forest y que las redes recurrentes en clasificación de series satelitales. Ninguno evalúa rendimiento de cebada.

**P:** ¿Qué es TabPFN y para qué tamaños de datos fue diseñado?
**R:** Es un modelo fundacional tabular preentrenado con datos sintéticos (Hollmann et al., 2025). Su mejor desempeño reportado es en tablas pequeñas, de hasta unos 10,000 muestras.

**P:** ¿Un modelo fundacional geoespacial como Prithvi-EO-2.0 ya demostró estimar el rendimiento de cebada?
**R:** No en la literatura consultada. En nuestro proyecto, el experimento con Prithvi-EO-2.0-600M-TL no tiene métricas documentadas.

**P:** ¿Cuántas escenas HLS se prepararon y cuántas parcelas hay?
**R:** 1,198 escenas HLS v2.0 (666 Landsat 8/9 L30 y 532 Sentinel-2 S30) para 197 parcelas, de enero de 2022 a octubre de 2025.

**P:** ¿La lluvia diaria de CHIRPS mejoró el error en nuestros experimentos?
**R:** No. El control con lluvia mensual FIRA tuvo RMSE 0.5309 t/ha, frente a 0.6055 (CHIRPS sat) y 0.6306 (CHIRPS rnl).

**P:** ¿Podemos afirmar que los datos permiten calcular un techo de información?
**R:** No. La cota con solo clima es 0.190724649 t/ha, y la cota por duplicados con todas las entradas es cero. Ninguna establece un techo general.

**P:** ¿Por qué no usar directamente WOFOST o APSIM para predecir el rendimiento?
**R:** Porque requieren calibración local de cultivar, fenología y manejo, y el dataset no incluye esas variables.

**P:** ¿Qué rendimientos de cebada se reportan en ensayos del INIFAP en Valles Altos?
**R:** Cuatro líneas experimentales de temporal rindieron 3.5 a 4.0 t/ha en cinco ambientes de los ciclos 2012 y 2013, en un diseño látice 4 x 4.

**P:** ¿Cuál es el DOI de Cho et al. (2014), la referencia de la GRU?
**R:** 10.3115/v1/D14-1179 (EMNLP 2014, pp. 1724-1734), según Crossref. El preprint es arXiv:1406.1078.

**P:** ¿Cuál es el DOI de Jones et al. (2003), la referencia de DSSAT?
**R:** 10.1016/S1161-0301(02)00107-7, European Journal of Agronomy 18(3-4):235-265, según Crossref.

**P:** ¿Qué concluye la revisión de TELKOMNIKA sobre pocos datos?
**R:** Anand y Jhajharia (2025) concluyen que los modelos de aprendizaje profundo son más eficaces con conjuntos grandes, mientras que el aprendizaje automático clásico se mantiene robusto con conjuntos pequeños.

**P:** ¿Qué conjunto de datos usó el MMST-ViT original?
**R:** El USDA Crop Dataset (producción y rendimiento por condado de maíz, algodón, soya y trigo de invierno), variables meteorológicas del HRRR y cuadrículas Sentinel-2 de 9 km, en más de 200 condados de Estados Unidos.

**P:** ¿PANGAEA o GEO-Bench evalúan rendimiento agrícola de cebada?
**R:** No en las fuentes consultadas. Son protocolos de evaluación de modelos fundacionales geoespaciales; su aporte para nosotros es metodológico, por ejemplo comparar con líneas base supervisadas.

**P:** ¿Hay parámetros de WOFOST o APSIM calibrados para cebada de temporal en México?
**R:** No se localizaron en la búsqueda bibliográfica realizada. Cualquier uso requiere calibración con datos locales de fenología, cultivar y manejo.

**P:** ¿Qué métricas reporta AgriFM (2026) para evaluar su desempeño?
**R:** AUROC y AUPRC para estrés y para falla de rendimiento, error de calibración esperado (ECE) y anticipación de alertas (mediana de 24 días). No reporta R² ni RMSE.

**P:** ¿Los embeddings de AlphaEarth transfieren bien de la escala de condado a la de campo?
**R:** No en Ma et al. (2026): con XGBoost, R² de 0.25 frente a 0.38 en maíz y de −0.04 frente a 0.22 en trigo de invierno, a favor de la teledetección.

**P:** ¿Qué fuente de rendimiento usa el conjunto MMST-ViT?
**R:** El USDA Crop Dataset por condado; el artículo cita «USDA (2022)» sin URL ni nombre del producto específico.
