@id: rag-10-validacion-030
@documento: rag-10-validacion | temas/10_validacion_fugas_y_muestras_pequenas.md
@categoria: validacion
@titulo: Dominio de aplicabilidad y extrapolación
@titulo_documento: Validación, fugas de información y muestras pequeñas en el Reto AgroCebada
@etiquetas: validación cruzada; fuga de información; muestras pequeñas; ruido de etiquetas; redondeo de rendimientos; bootstrap; intervalos de confianza; rmse; sesgo de selección; validación espacial; heaping
@claves: validacion cruzada fuga de informacion muestras pequenas ruido de etiquetas redondeo de rendimientos bootstrap intervalos de confianza rmse sesgo de seleccion validacion espacial heaping dentro extrapolacion validacion aplicabilidad dominio area bandera datos distancia distancias entrenamiento estar meyer pebesma punto solo acotarse agregar ambiental aplicacion aprendidas auditorias autores basada cercano
@fuente: validacion/literature_review__report__sections__06_validacion.typ.txt; validacion/iterate_20261017__research__critique_expected_value.md; Meyer y Pebesma (2021), Methods in Ecology and Evolution 12, 1620-1633, https://doi.org/10.1111/2041-210X.13650
# Dominio de aplicabilidad y extrapolación

(Literatura, verificado) Meyer y Pebesma (2021) estiman un área de aplicabilidad (AOA) a partir de un índice de disimilitud: la distancia, en el espacio de predictores, entre cada punto nuevo y los datos de entrenamiento, comparada con la distribución de esas distancias en la validación. Estar dentro de la región
geográfica no garantiza estar dentro del dominio ambiental del modelo. Los autores recomiendan presentar predicciones solo dentro del AOA; un resumen de 2024 (EGU24-10278) critica que el criterio depende solo de la distancia al dato más cercano.

(Recomendación) Agregar una bandera de extrapolación basada en distancias a los datos de entrenamiento, cobertura de sensores y valores fuera de rango, con escalas aprendidas sin etiquetas de evaluación. La bandera informa la condición de aplicación; no reemplaza un intervalo.

(Ejemplo general) Un término de área lineal puede extrapolarse a parcelas mucho más grandes que cualquiera con etiqueta dentro de su municipio. Esa extrapolación debe declararse en la interfaz y, de ser necesario, acotarse; las auditorías de despliegue la tratan como punto de revisión.

Fuente: validacion/literature_review__report__sections__06_validacion.typ.txt; validacion/iterate_20261017__research__critique_expected_value.md; Meyer y Pebesma (2021), Methods in Ecology and Evolution 12, 1620-1633, https://doi.org/10.1111/2041-210X.13650
