@id: rag-10-validacion-066
@documento: rag-10-validacion | temas/10_validacion_fugas_y_muestras_pequenas.md
@categoria: validacion
@titulo: Preguntas y respuestas
@titulo_documento: Validación, fugas de información y muestras pequeñas en el Reto AgroCebada
@etiquetas: validación cruzada; fuga de información; muestras pequeñas; ruido de etiquetas; redondeo de rendimientos; bootstrap; intervalos de confianza; rmse; sesgo de selección; validación espacial; heaping
@claves: validacion cruzada fuga de informacion muestras pequenas ruido de etiquetas redondeo de rendimientos bootstrap intervalos de confianza rmse sesgo de seleccion validacion espacial heaping parcelas validacion error segun datos informacion porque seleccion espacial estandar fuga mejora modelo municipio sesgo signo solo candidatos conviene desviacion elegir entrenamiento estimo fuera
@fuente: ["validacion/iterate_20261017__research__critique_leakage.md", "validacion/literature_review__report__sections__06_validacion.typ.txt", "validacion/iterate_20261017__research__B3_small_n_methods.md", "validacion/iterate_20261017__research__critique_expected_value.md",
# Preguntas y respuestas

**P:** ¿Por qué no basta un k-fold aleatorio para evaluar el modelo?
**R:** Porque las parcelas están agrupadas por municipio, productor y localidad; un k-fold aleatorio puede subestimar el error si el despliegue requiere estimar municipios no observados. Conviene reportar también la partición por municipio o espacial.

**P:** ¿Qué error estándar tiene el RMSE con 138 parcelas?
**R:** Con desviación de error cercana a 0.474 t/ha, el error estándar aproximado es 0.474/√276 ≈ 0.029 t/ha (aproximación heurística de las notas de métodos).

**P:** ¿Por qué una mejora de 0.003 t/ha no es significativa?
**R:** Porque es igual al error estándar de la comparación única (0.0030) y una décima parte del error estándar del RMSE (≈ 0.029), y cae dentro del ruido de muestreo de la métrica (desviación de 0.0045 en remuestreos de 59 parcelas). Solo se reporta como empate.

**P:** ¿Qué es la maldición del ganador en nuestros experimentos?
**R:** Es el sesgo por elegir el mejor de muchos candidatos. La corrección BBC-CV estimó que el mejor candidato resultó +0.0028 t/ha peor que la referencia fuera de bolsa.

**P:** ¿Qué diferencia hay entre fuga de información y sesgo de selección?
**R:** La fuga es que información de la prueba entra al entrenamiento o a la selección; el sesgo de selección es el optimismo al elegir el mejor de muchos candidatos, aunque ninguno use información de prueba. Ambos inflan la evaluación.

**P:** ¿Cuál es la distribución de parcelas por municipio?
**R:** Chignahuapan 71, Calpulalpan 30, Singuilucan 16, Almoloya 10, Cuautepec de Hinojosa 5, Emiliano Zapata 3, y Apan, Tepeapulco y Nanacamilpa una cada una; total 138 de entrenamiento.

**P:** ¿Por qué no se adoptó el prior de SIAP?
**R:** Porque la correlación entre el rendimiento medio de las parcelas y el SIAP fue negativa (−0.22 con la historia y −0.49 con 2025), y su ganancia en validación dependió de dos municipios de una sola parcela.

**P:** ¿Cuánto explica el redondeo del rendimiento en el RMSE?
**R:** Con h = 0.5, la varianza del redondeo es 0.0208 (t/ha)². Según las notas, su aporte es menor que 0.007 del MSE, con 45 de 138 etiquetas (32.6 %) exactamente sobre la rejilla de 0.5 t/ha.

**P:** ¿Conviene redondear nuestras predicciones a la rejilla de 0.5?
**R:** Solo si la desviación predictiva es menor que alrededor de 0.065 t/ha. Con la nuestra, empeora el RMSE; la mejora de validación es un artefacto de la media del municipio y no debe reportarse como mejora de RMSE.

**P:** ¿Qué es BBC-CV y qué estimó?
**R:** Es una corrección de la validación cruzada por bootstrap de las predicciones fuera de pliegue de todos los candidatos (familia de Tsamardinos et al., 2018). Estimó un efecto de selección de +0.0027 a +0.0028 t/ha frente a la referencia C2.

**P:** ¿Por qué fijar el signo esperado antes de evaluar un coeficiente?
**R:** Porque un criterio que solo exige que el signo sea estable acepta también efectos con signo contrario al mecanismo. Un efecto con signo opuesto debe contar como rechazo.

**P:** ¿Vale la pena seguir iterando sobre las mismas 138 parcelas?
**R:** Según la auditoría de valor esperado, cada candidato adicional aportaba del orden de milésimas de t/ha, con poca capacidad para detectar efectos de 0.002, y el sesgo de selección crece con cada consulta. La recomendación es priorizar la justificación técnica y la validación de calidad.

**P:** ¿Qué validación recomienda la literatura para mapas de variables ecológicas con datos agrupados?
**R:** Roberts et al. (2017) recomiendan validación por bloques cuando hay estructura de dependencia; Ploton et al. (2020) muestran que la validación no espacial puede sobreestimar el poder predictivo; Wadoux et al. (2021) cuestionan la validación espacial como estimador de exactitud y proponen muestreo probabilístico.
Conviene declarar qué pregunta responde la cifra antes de elegir la partición.

**P:** ¿Qué es el área de aplicabilidad de un modelo espacial?
**R:** Es la zona en la que el modelo aprendió de datos parecidos a los de entrenamiento, según Meyer y Pebesma (2021), que la definen con un índice de distancia en el espacio de predictores. Las predicciones fuera de esa zona no deben presentarse como confiables.

**P:** ¿Qué es la fuga de datos según Kaufman et al. (2012)?
**R:** Es cuando el modelo tiene acceso a información relacionada con el objetivo que no tendría al predecir en la práctica. Su remedio es separar el aprendizaje de la predicción con un manejo cuidadoso de los datos.

**P:** ¿Cuántos campos y artículos tenían fuga según Kapoor y Narayanan (2023)?
**R:** Según la versión publicada en Patterns, 294 artículos en 17 campos; el preprint reportaba 329. Los autores la clasifican en ocho tipos.

**P:** ¿Las cifras de Lobell et al. (2020) para Uganda están verificadas?
**R:** No. El artículo existe y compara rendimientos autorreportados con cortes de subparcela y de parcela completa, pero las cifras de 1,826, 728 y 676 kg/ha no pudieron confirmarse en el texto consultado.

**P:** ¿Por qué la contracción de Efron y Morris no garantiza una mejora en nuestro caso?
**R:** Porque su ganancia depende de cuánta información aporta cada grupo frente a la variación entre grupos. Con nuestros datos, la contracción solo importa para municipios de pocas parcelas (con 71 parcelas en Chignahuapan el prior casi no pesa), y recupera como máximo unas 0.01 t/ha de RMSE.
