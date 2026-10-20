@id: rag-09-experimentos-tabulares-037
@documento: rag-09-experimentos-tabulares | temas/09_experimentos_tabulares_espaciales_y_fenologicos.md
@categoria: experimentos
@titulo: Literatura sobre embeddings y rendimiento: hechos citados
@titulo_documento: Experimentos tabulares, espaciales y fenológicos del proyecto: resultados y lecciones
@etiquetas: experimentos; validación cruzada; rmse; kumo; modelos fundacionales; regresión espacial; fenología; señal intramunicipal; lluvia; ndvi; mtci; área de parcela; techo de error
@claves: experimentos validacion cruzada rmse kumo modelos fundacionales regresion espacial fenologia senal intramunicipal lluvia ndvi mtci area de parcela techo de error frente alphaearth arxiv campo embeddings maiz cifras citados condado corpus datos espana evaluacion hechos literatura modelos nivel rendimiento tabla teledeteccion trigo verificado athanasiadis aunque bree
@fuente: experimentos_tabulares/iterate_20261017__research__B4_foundation_models.md
# Literatura sobre embeddings y rendimiento: hechos citados

Verificación en línea de las referencias citadas por el corpus (B4). Ma, Shen, Swatantran y Lobell comparan AlphaEarth con índices Landsat y clima a nivel de campo en arXiv:2601.00857 (enviado el 30 de diciembre de 2025; el año 2026 del corpus corresponde al identificador 2601). El resumen confirma que AlphaEarth es
competitivo con modelos de teledetección específicos cuando se entrena con datos locales y que su transferibilidad espacial es limitada; las cifras de R² de la Tabla 4 (evaluación a nivel de campo con validación por año de condado; XGB; AlphaEarth frente a teledetección: 0.44 frente a 0.46 en maíz; 0.37 frente a 0.35
en soya; 0.43 frente a 0.41 en trigo) y la transferencia de condado a campo (−0.04 frente a 0.22 en trigo) se verificaron en la ronda 4 con el PDF completo (verificado: arXiv:2601.00857). No son cifras intra-condado y los datos son de Estados Unidos. Nedungadi, Xiong, Potze, Van Bree, Lin, Rußwurm y Athanasiadis (2025,
arXiv:2507.05390), en su Tabla 2 para maíz de España, reportan nRMSE de 14.28 para un RF específico de la tarea (RFTS), 26.59 para RF sobre entradas de modelos
fundacionales (RFFM), 29.32 con Galileo y 31.10 con Presto (verificado; menor es mejor). Los embeddings congelados, por tanto, no igualan a la RF específica: casi duplican su error relativo en esta evaluación, aunque el contexto (España, maíz) no es el de la cebada del proyecto.

Fuente: experimentos_tabulares/iterate_20261017__research__B4_foundation_models.md
