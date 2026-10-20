@id: rag-10-validacion-064
@documento: rag-10-validacion | temas/10_validacion_fugas_y_muestras_pequenas.md
@categoria: validacion
@titulo: Rendimiento en leave-one-year-out: el caso de TabPFN frente a un pipeline clásico (maíz)
@titulo_documento: Validación, fugas de información y muestras pequeñas en el Reto AgroCebada
@etiquetas: validación cruzada; fuga de información; muestras pequeñas; ruido de etiquetas; redondeo de rendimientos; bootstrap; intervalos de confianza; rmse; sesgo de selección; validación espacial; heaping
@claves: validacion cruzada fuga de informacion muestras pequenas ruido de etiquetas redondeo de rendimientos bootstrap intervalos de confianza rmse sesgo de seleccion validacion espacial heaping maiz rendimiento tabpfn frente caso clasico leave-one-year-out menor modelo pipeline reports rrmsep s41598-026-50338-z sabo scientific sudafrica ajuste anos aprendizaje argumentan automatico autores base calculado cebada
@fuente: Sabo, F. et al. (2026). From rows to yields: how foundation models for tabular data simplify crop yield prediction. Scientific Reports, DOI 10.1038/s41598-026-50338-z (texto consultado en el repositorio JRC142524).
# Rendimiento en leave-one-year-out: el caso de TabPFN frente a un pipeline clásico (maíz)

Sabo et al. (2026, Scientific Reports, DOI 10.1038/s41598-026-50338-z) pronostican el rendimiento de cultivos de verano en Sudáfrica con FAPAR decádico, humedad del suelo y clima en malla, y validan dejando un año fuera. Para el maíz, el mejor modelo de aprendizaje automático tuvo 6.8 % de rRMSEp y TabPFN 8.8 %; a
escala nacional, los R² fueron 0.91 y 0.86 respectivamente. El rRMSEp es el RMSE dividido entre el rendimiento medio observado, calculado sobre todos los años y provincias. Los autores argumentan que TabPFN compensa su menor precisión con menor tiempo de ajuste y menos ingeniería de variables. La lección para el reto
es doble: con datos limitados, un modelo preentrenado puede ser una línea base competitiva, y diferencias de un par de puntos porcentuales deben evaluarse con intervalos y no como ganadores. Los resultados son de maíz en Sudáfrica, no de cebada en México. Esta cifra corrige la versión previa de esta ficha (8.9 % frente
a 7.4 %).
Fuente: Sabo, F. et al. (2026). From rows to yields: how foundation models for tabular data simplify crop yield prediction. Scientific Reports, DOI 10.1038/s41598-026-50338-z (texto consultado en el repositorio JRC142524).
