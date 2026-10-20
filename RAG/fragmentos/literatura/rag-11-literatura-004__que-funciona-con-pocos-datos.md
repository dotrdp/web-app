@id: rag-11-literatura-004
@documento: rag-11-literatura | temas/11_revision_de_literatura_y_transferencia.md
@categoria: literatura
@titulo: Qué funciona con pocos datos
@titulo_documento: Revisión de literatura y transferencia a aplicaciones FIRA (rendimiento de cebada con satélite)
@etiquetas: cebada; teledetección; rendimiento; transferencia; validación espacial; modelos fundacionales; seguro paramétrico; crédito rural; fira; cimmyt
@claves: cebada teledeteccion rendimiento transferencia validacion espacial modelos fundacionales seguro parametrico credito rural fira cimmyt modelos datos literature pocos report review sections aprendizaje automatico etiquetas funciona media meroni metodos numero proyecto redes simples solo superaron agregados agrformet agricultural aleatorio
@fuente: Meroni et al. (2021), Agricultural and Forest Meteorology 308:108555, DOI 10.1016/j.agrformet.2021.108555 (resumen y preprint arXiv:2104.13246); literature_review__report__sections__05_modelos.typ.txt; literature_review__report__sections__08b_lecturas.typ.txt (S17);
# Qué funciona con pocos datos

Meroni y colaboradores (2021) estudian pronóstico de rendimiento con aprendizaje automático y pocos datos, con un caso de estudio en Argelia (cebada y dos tipos de trigo a nivel nacional). Su mensaje principal para el proyecto es definir modelos base fuertes (media, regresión regularizada) antes de comparar redes
complejas, para evitar triunfos fortuitos: los modelos de aprendizaje automático superaron a los métodos simples en años de bajo rendimiento, pero en algunos casos la ventaja fue pequeña y los métodos simples superaron hasta el 60 % de los modelos probados. Los errores agregados rondaron 0.16–0.20 t/ha (13–14 % del
rendimiento medio) y no fijan el error esperado por parcela. La revisión del proyecto recomienda la misma secuencia: media calculada solo con entrenamiento, Ridge o Elastic Net, PLS o GAM reducido, bosque aleatorio y boosting regularizado, y solo después representaciones preentrenadas. Con ~138 etiquetas, las redes
profundas entrenadas desde cero no son la prioridad inicial. Las etiquetas independientes son el límite real: el número de parcelas no equivale al número de observaciones efectivas si varias comparten localidad o campaña.

Fuente: Meroni et al. (2021), Agricultural and Forest Meteorology 308:108555, DOI 10.1016/j.agrformet.2021.108555 (resumen y preprint arXiv:2104.13246); literature_review__report__sections__05_modelos.typ.txt; literature_review__report__sections__08b_lecturas.typ.txt (S17);
literature_review__report__sections__02_reto_corpus.typ.txt.
