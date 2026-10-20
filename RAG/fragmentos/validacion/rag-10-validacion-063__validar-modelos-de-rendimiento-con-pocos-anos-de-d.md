@id: rag-10-validacion-063
@documento: rag-10-validacion | temas/10_validacion_fugas_y_muestras_pequenas.md
@categoria: validacion
@titulo: Validar modelos de rendimiento con pocos años de datos
@titulo_documento: Validación, fugas de información y muestras pequeñas en el Reto AgroCebada
@etiquetas: validación cruzada; fuga de información; muestras pequeñas; ruido de etiquetas; redondeo de rendimientos; bootstrap; intervalos de confianza; rmse; sesgo de selección; validación espacial; heaping
@claves: validacion cruzada fuga de informacion muestras pequenas ruido de etiquetas redondeo de rendimientos bootstrap intervalos de confianza rmse sesgo de seleccion validacion espacial heaping anos datos modelos pocos rendimiento anuales articulo development elegir geoscientific model modelo parcelas propone prueba validacion validar anidada aporta autores bajo busqueda calidad campana casos
@fuente: Geoscientific Model Development 15(9), artículo 3519, 2022, DOI 10.5194/gmd-15-3519-2022 (DOI inferido de la URL; resumen consultado en búsqueda; título y autores no obtenidos).
# Validar modelos de rendimiento con pocos años de datos

Con pocas observaciones anuales, la validación de un modelo de rendimiento es inestable. Un artículo de Geoscientific Model Development (2022) señala que unos 20 registros anuales son pocos para modelos guiados por datos, y que con muestras pequeñas es difícil tanto elegir el modelo como evaluar su calidad. Propone una
validación cruzada anidada de dejar dos fuera (leave-two-out), de modo que cada partición de prueba contenga datos que no intervinieron al elegir hiperparámetros. Para el proyecto, esto coincide con lo que documenta esta ficha: cuando el número de años o de localidades es bajo, el error depende de qué años quedan en
prueba, y el conteo de parcelas sobreestima la información independiente si varias comparten campaña o localidad. Un resultado con 138 parcelas no equivale a 138 casos independientes. La fuente propone un procedimiento de evaluación; no aporta una cifra de desempeño transferible a la cebada de temporal.
Fuente: Geoscientific Model Development 15(9), artículo 3519, 2022, DOI 10.5194/gmd-15-3519-2022 (DOI inferido de la URL; resumen consultado en búsqueda; título y autores no obtenidos).
