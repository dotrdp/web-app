@id: rag-09-experimentos-tabulares-059
@documento: rag-09-experimentos-tabulares | temas/09_experimentos_tabulares_espaciales_y_fenologicos.md
@categoria: experimentos
@titulo: Efecto aleatorio por municipio: qué exigen los datos del reto
@titulo_documento: Experimentos tabulares, espaciales y fenológicos del proyecto: resultados y lecciones
@etiquetas: experimentos; validación cruzada; rmse; kumo; modelos fundacionales; regresión espacial; fenología; señal intramunicipal; lluvia; ndvi; mtci; área de parcela; techo de error
@claves: experimentos validacion cruzada rmse kumo modelos fundacionales regresion espacial fenologia senal intramunicipal lluvia ndvi mtci area de parcela techo de error municipio aleatorio efecto parcelas datos municipios proyecto modelo reto dataset efectos exigen grupos numero oficial variacion advierte calculados calculen calculo calpulalpan cercanas chignahuapan clima comparaciones
@fuente: datos del proyecto (HECHOS_CALCULADOS_dataset_oficial.md, tabla por municipio); método: Sugasawa y Kubokawa (2023), doi:10.1007/978-981-19-9486-9_4; Zimmermann y Münnich (2018), doi:10.2478/jos-2018-0024.
# Efecto aleatorio por municipio: qué exigen los datos del reto

Un modelo de efectos mixtos con municipio como efecto aleatorio separa la variación entre municipios de la variación dentro de cada municipio. Para el reto, la pregunta práctica es si hay suficientes parcelas por municipio para estimar ese componente. Según el conteo del dataset oficial, las 197 parcelas se reparten en
nueve municipios: Chignahuapan concentra 100, Calpulalpan 44 y Singuilucan 23, y varios municipios tienen 1 a 14 parcelas (cálculo derivado del proyecto). Por tanto, la varianza entre municipios se estima con pocos grupos de tamaño muy desigual. Esta es una limitación de los datos del proyecto y no un resultado del
modelo. Recomendaciones: (a) reportar el número de parcelas por municipio junto con cualquier efecto aleatorio; (b) comparar con efectos fijos de municipio, que el proyecto ya usó en su modelo espacial de referencia; (c) validar por municipio, no solo por parcela, porque las parcelas cercanas comparten clima y manejo.
Como advierte la literatura de SAE, la estimación del efecto aleatorio es sensible al número de grupos y a la forma de la distribución del error; los resultados de estas comparaciones son hipótesis hasta que se calculen con validación cruzada.

Fuente: datos del proyecto (HECHOS_CALCULADOS_dataset_oficial.md, tabla por municipio); método: Sugasawa y Kubokawa (2023), doi:10.1007/978-981-19-9486-9_4; Zimmermann y Münnich (2018), doi:10.2478/jos-2018-0024.
