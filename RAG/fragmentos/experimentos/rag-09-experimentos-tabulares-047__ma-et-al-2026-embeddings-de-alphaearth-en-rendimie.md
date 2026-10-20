@id: rag-09-experimentos-tabulares-047
@documento: rag-09-experimentos-tabulares | temas/09_experimentos_tabulares_espaciales_y_fenologicos.md
@categoria: experimentos
@titulo: Ma et al. (2026): embeddings de AlphaEarth en rendimiento a nivel de campo
@titulo_documento: Experimentos tabulares, espaciales y fenológicos del proyecto: resultados y lecciones
@etiquetas: experimentos; validación cruzada; rmse; kumo; modelos fundacionales; regresión espacial; fenología; señal intramunicipal; lluvia; ndvi; mtci; área de parcela; techo de error
@claves: experimentos validacion cruzada rmse kumo modelos fundacionales regresion espacial fenologia senal intramunicipal lluvia ndvi mtci area de parcela techo de error alphaearth frente campo arxiv condado datos embeddings nivel rendimiento corteva estados limitada lobell maiz modelos shen swatantran teledeteccion transferibilidad trigo unidos agricultural agriscience aplico aportados
@fuente: Ma, Shen, Swatantran, Lobell (2025/2026), arXiv:2601.00857. https://arxiv.org/abs/2601.00857
# Ma et al. (2026): embeddings de AlphaEarth en rendimiento a nivel de campo

Ma, Shen, Swatantran y Lobell («Harvesting AlphaEarth: Benchmarking the Geospatial Foundation Model for Agricultural Downstream Tasks», arXiv:2601.00857, enviado el 30 de diciembre de 2025) evaluaron los embeddings de AlphaEarth Foundations en predicción de rendimiento, clasificación de labranza y mapeo de cultivos de
cobertera, a escala de condado y de campo, con datos de Estados Unidos aportados por Corteva Agriscience. El resumen señala que los modelos basados en AlphaEarth son competitivos frente a modelos de teledetección específicos cuando se entrenan con datos locales, y que tienen una transferibilidad espacial limitada, baja
interpretabilidad y poca sensibilidad temporal. Las cifras de la Tabla 4 del PDF completo (ronda 4) son: en evaluación a nivel de campo con validación por año de condado, XGB con AlphaEarth frente a teledetección obtuvo R² de 0.44 frente a 0.46 en maíz, 0.37 frente a 0.35 en soya y 0.43 frente a 0.41 en trigo; en la
transferencia de condado a campo, AlphaEarth queda atrás: 0.25 frente a 0.38 en maíz y −0.04 frente a 0.22 en trigo (verificado: arXiv:2601.00857). Los datos son de Corteva en Estados Unidos, no de México. Por eso el año de publicación debe leerse como 2025 (identificador 2601). El hecho relevante para el
proyecto es la transferibilidad limitada, que justifica la misma cautela que aplicó el corpus al evaluar AlphaEarth.

Fuente: Ma, Shen, Swatantran, Lobell (2025/2026), arXiv:2601.00857. https://arxiv.org/abs/2601.00857
