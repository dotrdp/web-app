@id: rag-10-validacion-065
@documento: rag-10-validacion | temas/10_validacion_fugas_y_muestras_pequenas.md
@categoria: validacion
@titulo: Errores frecuentes y cómo detectarlos
@titulo_documento: Validación, fugas de información y muestras pequeñas en el Reto AgroCebada
@etiquetas: validación cruzada; fuga de información; muestras pequeñas; ruido de etiquetas; redondeo de rendimientos; bootstrap; intervalos de confianza; rmse; sesgo de selección; validación espacial; heaping
@claves: validacion cruzada fuga de informacion muestras pequenas ruido de etiquetas redondeo de rendimientos bootstrap intervalos de confianza rmse sesgo de seleccion validacion espacial heaping afirmacion correccion erronea validacion error espacial predicciones auditoria bajo cruzada etiquetas explica mayor modelo municipio siempre aleatoria apilar bbc-cv cobertura dentro depende detectarlos errores
@fuente: ["validacion/iterate_20261017__research__critique_leakage.md", "validacion/literature_review__report__sections__06_validacion.typ.txt", "validacion/iterate_20261017__research__B3_small_n_methods.md", "validacion/iterate_20261017__research__critique_expected_value.md",
# Errores frecuentes y cómo detectarlos

- **Afirmación errónea:** "El RMSE bajó de 0.471 a 0.468; el modelo nuevo es mejor." → **Corrección:** Con n = 138 el error estándar del RMSE es ≈ 0.029 t/ha y la diferencia de 0.003 no es distinguible sin prueba pareada y repeticiones (validación de muestras pequeñas del proyecto).
- **Afirmación errónea:** "Apilar las predicciones de validación cruzada da una evaluación honesta." → **Corrección:** El apilamiento requiere predicciones fuera de pliegue sin la etiqueta propia y evaluación anidada; en nuestra auditoría el margen para apilar era de 0.0003 in-sample.
- **Afirmación errónea:** "Como la variable explica bien las etiquetas, la validación cruzada la confirma." → **Corrección:** Si la variable se eligió con las mismas etiquetas, la validación está contaminada; la auditoría de área mostró que la correlación de −0.225 usó las 21 particiones, incluidas las de confirmación.
- **Afirmación errónea:** "Excluir las dos parcelas de mayor error es una prueba de robustez." → **Corrección:** Esa exclusión puede dejar intacta una ganancia (−0.310 en la auditoría); hay que excluir también el mayor contribuyente y los que más ayudan.
- **Afirmación errónea:** "El RMSE global es bajo, luego el modelo funciona en todos los municipios." → **Corrección:** Desglosar por municipio: en Calpulalpan las predicciones casi no varían y no tienen habilidad dentro del municipio.
- **Afirmación errónea:** "Redondear las predicciones a 0.5 mejora el RMSE." → **Corrección:** Solo ayuda con desviación predictiva menor que ≈ h/8 (0.065); con σ ≈ 0.47 empeora (0.495 frente a 0.516).
- **Afirmación errónea:** "El mínimo del error de validación cruzada es una buena estimación del desempeño." → **Corrección:** Está sesgado a la baja; la BBC-CV estimó +0.0028 t/ha de efecto de selección.
- **Afirmación errónea:** "Un intervalo conforme siempre tiene la cobertura prometida." → **Corrección:** La garantía es marginal, bajo intercambiabilidad, y no cubre dependencia espacial ni cobertura por parcela.
- **Afirmación errónea:** "El ruido de las etiquetas redondeadas explica el RMSE." → **Corrección:** El redondeo explica como máximo unos 0.007 del MSE; la mayor parte del error es variación dentro de municipio.
- **Afirmación errónea:** "Como Ploton et al. (2020) muestran que la validación no espacial sobreestima, la validación espacial siempre es la correcta." → **Corrección:** Wadoux et al. (2021) cuestionan la validación espacial como estimador de exactitud de un mapa; la elección depende de la pregunta que se quiere
  responder.
- **Afirmación errónea:** "Un R² alto en validación aleatoria garantiza que el modelo sirve en municipios sin observaciones." → **Corrección:** Roberts et al. (2017) y Ploton et al. (2020) muestran que la validación aleatoria puede sobreestimar la capacidad para predecir en zonas nuevas.
- **Afirmación errónea:** "El estimador de Stein reduce siempre el error a la mitad." → **Corrección:** Efron y Morris (1975) reportan un error cuadrático menor que la mitad en sus ejemplos; la ganancia depende de la estructura de varianzas, y en nuestro conjunto es pequeña.
- **Afirmación errónea:** "«BBC-CV» es el título del artículo de Tsamardinos et al. (2018)." → **Corrección:** El título es «Bootstrapping the out-of-sample predictions for efficient and accurate cross-validation»; la versión publicada usa BBCD-CV para la variante con descarte.
- **Afirmación errónea:** "Wang y Heitjan (2008) demuestran heaping en rendimientos agrícolas." → **Corrección:** Su estudio trata conteos de cigarros autorreportados; sirve como referencia metodológica, no como evidencia para rendimientos.
