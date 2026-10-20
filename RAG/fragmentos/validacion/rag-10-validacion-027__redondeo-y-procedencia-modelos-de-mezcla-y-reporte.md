@id: rag-10-validacion-027
@documento: rag-10-validacion | temas/10_validacion_fugas_y_muestras_pequenas.md
@categoria: validacion
@titulo: Redondeo y procedencia: modelos de mezcla y reportes heaped
@titulo_documento: Validación, fugas de información y muestras pequeñas en el Reto AgroCebada
@etiquetas: validación cruzada; fuga de información; muestras pequeñas; ruido de etiquetas; redondeo de rendimientos; bootstrap; intervalos de confianza; rmse; sesgo de selección; validación espacial; heaping
@claves: validacion cruzada fuga de informacion muestras pequenas ruido de etiquetas redondeo de rendimientos bootstrap intervalos de confianza rmse sesgo de seleccion validacion espacial heaping mezcla redondeo reportes statistics heaped procedencia wang annals applied clase colaboradores crawford etiquetas heitjan medicine modelo modelos pero recuerdo redondeados research validacion verificado ajustar
@fuente: validacion/modelado__research_notes__Barley_yield_ceiling_solution_strategies__heaped_labels_and_hierarchical.md; validacion/iterate_20261017__research__B3_small_n_methods.md; Wang y Heitjan (2008), Statistics in Medicine 27(19), 3789-3804
# Redondeo y procedencia: modelos de mezcla y reportes heaped

(Literatura) Heaping es la preferencia por valores redondos al reportar cantidades. Wang y Heitjan (2008), en un estudio sobre conteos de cigarros autorreportados, modelan la respuesta como una mezcla de reportes exactos y redondeados, con una clase latente de comportamiento de reporte (verificado, Statistics in
Medicine 27(19), 3789-3804). Wang y colaboradores (2012) extienden el modelo a un proceso de recuerdo y redondeo en dos etapas (sin evidencia: no localizado en OpenAlex en dos búsquedas), y Crawford y colaboradores (2015) señalan que el heaping es no ignorable cuando su probabilidad depende del valor verdadero (no
verificado: el candidato encontrado, «Sex, lies and self-reported counts», Annals of Applied Statistics, DOI 10.1214/15-aoas809, existe, pero la autoría se confirmó en Crossref (Crawford, Weiss y Suchard; Annals of Applied Statistics 9(2):572–596), pero el contenido no se leyó).

(Nuestros experimentos y análisis) Las etiquetas de Calpulalpan (solo 2.5, 3.0 y 3.5) sugieren estimaciones de recuerdo más que pesadas. Un modelo ordinal por grupo produciría la esperanza Σ p_k g_k y no la clase más probable; si las clases son casi uniformes, colapsa a la media municipal (≈3.0).

(Recomendación) Si se modela la mezcla, ajustar un componente de error mayor para reportes redondeados por municipio, sin usar snap. La procedencia de las etiquetas (dos formatos de polígono en la base) importa más que el redondeo mismo.

Fuente: validacion/modelado__research_notes__Barley_yield_ceiling_solution_strategies__heaped_labels_and_hierarchical.md; validacion/iterate_20261017__research__B3_small_n_methods.md; Wang y Heitjan (2008), Statistics in Medicine 27(19), 3789-3804
