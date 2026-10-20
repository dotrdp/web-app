@id: rag-10-validacion-014
@documento: rag-10-validacion | temas/10_validacion_fugas_y_muestras_pequenas.md
@categoria: validacion
@titulo: Reutilizar el conjunto de confirmación erosiona su valor
@titulo_documento: Validación, fugas de información y muestras pequeñas en el Reto AgroCebada
@etiquetas: validación cruzada; fuga de información; muestras pequeñas; ruido de etiquetas; redondeo de rendimientos; bootstrap; intervalos de confianza; rmse; sesgo de selección; validación espacial; heaping
@claves: validacion cruzada fuga de informacion muestras pequenas ruido de etiquetas redondeo de rendimientos bootstrap intervalos de confianza rmse sesgo de seleccion validacion espacial heaping confirmacion conjunto iterate research validacion critique decidir desarrollo erosiona independiente particion reutilizar valor aceptar ademas advierten ajuste aporta arxiv auditorias automatica candidato candidatos casi colaboradores
@fuente: validacion/iterate_20261017__research__B3_small_n_methods.md; validacion/iterate_20261017__research__critique_expected_value.md; validacion/iterate_20261017__research__critique_leakage.md
# Reutilizar el conjunto de confirmación erosiona su valor

(Literatura) Un conjunto de prueba reutilizado para decidir entre candidatos deja de ser independiente. Dwork y colaboradores (2015) proponen holdouts reutilizables con garantías (referencia verificada, arXiv 1411.2664; el contenido técnico no se leyó); una práctica sencilla es aceptar un nuevo mejor modelo solo si
supera un umbral.

(Nuestros experimentos) Los pliegues de confirmación se usaron para diagnósticos y para evaluar tres hipótesis. Además, las ganancias de desarrollo y confirmación se correlacionaron 1.000 para diferencias fijas por parcela, y difirieron como máximo 0.0015 en pares de modelos reales. Por eso una comparación "mismo signo
y al menos la mitad de la ganancia" resulta casi automática para cualquier candidato que ya pasó desarrollo. Las auditorías advierten que una réplica sobre la misma partición de 138 parcelas aporta poca evidencia independiente y sirve sobre todo contra el ajuste a una partición concreta.

(Recomendación) Mantener un conjunto de control que nunca se use para decidir, y registrar cada vez que se mira.

Fuente: validacion/iterate_20261017__research__B3_small_n_methods.md; validacion/iterate_20261017__research__critique_expected_value.md; validacion/iterate_20261017__research__critique_leakage.md
