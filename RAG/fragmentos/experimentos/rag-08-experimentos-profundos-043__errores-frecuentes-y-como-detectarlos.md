@id: rag-08-experimentos-profundos-043
@documento: rag-08-experimentos-profundos | temas/08_experimentos_modelos_profundos_y_fundacionales.md
@categoria: experimentos
@titulo: Errores frecuentes y cómo detectarlos
@titulo_documento: Modelos profundos, fundacionales y de proceso: literatura y nuestros experimentos con validación cruzada
@etiquetas: estimación de rendimiento; cebada maltera; validación cruzada; MMST-ViT; redes profundas; modelos fundacionales; modelos de cultivo; pocas etiquetas; techo de información; Prithvi; TabPFN
@claves: estimacion de rendimiento cebada maltera validacion cruzada mmst-vit redes profundas modelos fundacionales modelos de cultivo pocas etiquetas techo de informacion prithvi tabpfn afirmacion correccion erronea cebada cruzada validacion maiz reporta calibracion frente mexico modelos referencia rendimiento solo soya tiene wofost argentina articulo busqueda ceres-barley condados cota datos
@fuente: [mmst-vit__README.md, mmst-vit__docs__model_selection_20261006.md, mmst-vit__docs__yield_information_identifiability_20261007.md, mmst-vit__outputs__transfer_iteration_20261007__research__information_ceiling_audit_20261007.md, model__README.md, prithvi-yield__README.md,
# Errores frecuentes y cómo detectarlos

- **Afirmación errónea:** "DeepCropNet usa imágenes satelitales y alcanza 0.82 Mg/ha en cebada." → **Corrección:** DeepCropNet (Lin et al., 2020) usa solo tres variables meteorológicas semanales y se evaluó en maíz de Estados Unidos. El 0.82 Mg/ha es de la prueba 2015-2016 de maíz.
- **Afirmación errónea:** "MMST-ViT mejoró el error a 0.3226 t/ha, así que la mejora es significativa." → **Corrección:** 0.3226 t/ha es el MAE más bajo de la búsqueda; la diferencia frente a 0.3342 t/ha tiene un intervalo que incluye cero, así que no es concluyente.
- **Afirmación errónea:** "Prithvi-EO-2.0 con nuestra capa FFN ya tiene un error de validación cruzada documentado." → **Corrección:** la documentación del experimento no reporta métricas. No hay cifra publicable hasta completar la validación cruzada.
- **Afirmación errónea:** "La cota de 0.19 t/ha es el techo de información de la cebada." → **Corrección:** es la cota inferior con solo clima y cobertura, obtenida con las etiquetas de cinco pliegues. No es un techo general.
- **Afirmación errónea:** "Un resultado medido en una sola partición de entrenamiento y prueba equivale a validación cruzada." → **Corrección:** una partición única no es validación cruzada sobre las 138 parcelas; las cifras de desempeño de este documento proceden solo de validación cruzada.
- **Afirmación errónea:** "Los modelos de proceso como WOFOST se usan sin calibración para predecir el rendimiento de la cebada." → **Corrección:** WOFOST, DSSAT y APSIM requieren calibración local de cultivar, fenología y manejo, que el dataset no contiene.
- **Afirmación errónea:** "El ajuste fino de modelos preentrenados es la estrategia principal con pocos datos, como en soya de Argentina y Brasil." → **Corrección:** la referencia previa no se localizó. Los trabajos encontrados (Wang et al., 2024, Computers and Electronics in Agriculture, DOI
  10.1016/j.compag.2024.108978, que compara regresión de panel con aprendizaje profundo en soya de Argentina; Khaki et al., 2021) no establecen esa afirmación.
- **Afirmación errónea:** "El MMST-ViT original reporta resultados de cebada o de condados de México." → **Corrección:** el artículo usa condados de Estados Unidos y cuatro cultivos (maíz, algodón, soya y trigo de invierno).
- **Afirmación errónea:** "WOFOST ya tiene parámetros de cebada de temporal validados para México." → **Corrección:** en la búsqueda no se localizaron calibraciones de cebada de temporal en México; la calibración debe hacerse con datos locales.

- **Afirmación errónea:** AgriFM (2026) predice el rendimiento con R² de 0.9. → **Corrección:** el artículo no reporta R², RMSE ni exactitud; reporta AUROC y AUPRC para estrés y falla de rendimiento, con diseño retrospectivo.
- **Afirmación errónea:** Los embeddings de AlphaEarth transfieren bien de condado a campo. → **Corrección:** en Ma et al. (Tabla 4, XGB) la transferencia es peor que la de teledetección: 0.25 frente a 0.38 en maíz y −0.04 frente a 0.22 en trigo.
- **Afirmación errónea:** La referencia primaria de CERES-Barley es Otter-Nacke et al. (1991). → **Corrección:** ese trabajo trata modelos de nitrógeno; la referencia primaria de CERES-Barley no se localizó (SIN EVIDENCIA).
