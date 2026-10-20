@id: rag-09-experimentos-tabulares-016
@documento: rag-09-experimentos-tabulares | temas/09_experimentos_tabulares_espaciales_y_fenologicos.md
@categoria: experimentos
@titulo: Kumo recalculado por split: optimismo de los pliegues canónicos
@titulo_documento: Experimentos tabulares, espaciales y fenológicos del proyecto: resultados y lecciones
@etiquetas: experimentos; validación cruzada; rmse; kumo; modelos fundacionales; regresión espacial; fenología; señal intramunicipal; lluvia; ndvi; mtci; área de parcela; techo de error
@claves: experimentos validacion cruzada rmse kumo modelos fundacionales regresion espacial fenologia senal intramunicipal lluvia ndvi mtci area de parcela techo de error canonicos pliegues recalculado split columna confirmacion desarrollo division hereda optimismo version ajuste canonica canonico cifras cinco combinaciones control cuarto diez divisiones error evaluacion
@fuente: experimentos_tabulares/iterate_20261017__research__A5_kumo.md
# Kumo recalculado por split: optimismo de los pliegues canónicos

La columna de Kumo que usaban las combinaciones previas está fuera de pliegue solo para los cinco pliegues canónicos, y el marco de evaluación la reutilizó en las 21 divisiones. Como cada división hereda el error de partición de los canónicos, el RMSE de Kumo canónico (0.4848) queda cuarto de 21. Al recalcular Kumo por
división, con la receta exacta de diez pasos, el RMSE fue de 0.4899 en desarrollo y 0.4933 en confirmación; el control sin ajuste FIRA dio 0.4904 y 0.4934. Con Kumo recalculado por split, la versión honesta dio 0.4805 y 0.4820, frente a 0.4793 y 0.4800 de la versión que hereda la columna canónica. El margen sobre la
referencia C2 se mantuvo en 0.0027 (desarrollo) y 0.0032 (confirmación). Lección: las cifras con pliegues reutilizados subestiman el RMSE real por unas milésimas.

Fuente: experimentos_tabulares/iterate_20261017__research__A5_kumo.md
