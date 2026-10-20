@id: rag-11-literatura-006
@documento: rag-11-literatura | temas/11_revision_de_literatura_y_transferencia.md
@categoria: literatura
@titulo: Modelos fundacionales: qué son y qué no son
@titulo_documento: Revisión de literatura y transferencia a aplicaciones FIRA (rendimiento de cebada con satélite)
@etiquetas: cebada; teledetección; rendimiento; transferencia; validación espacial; modelos fundacionales; seguro paramétrico; crédito rural; fira; cimmyt
@claves: cebada teledeteccion rendimiento transferencia validacion espacial modelos fundacionales seguro parametrico credito rural fira cimmyt modelos fundacionales aprendizaje etiquetas literature report review sections vector adaptacion adaptan alphaearth anysat clasifica clasificacion clay codificador combinacion comparando congelar contrastivo croma cultivos debe dofa
@fuente: literature_review__report__sections__05_modelos.typ.txt; literature_review__report__sections__08b_lecturas.typ.txt (S07, S08, S09, S40–S46).
# Modelos fundacionales: qué son y qué no son

Los modelos fundacionales geoespaciales se preentrenan con imágenes sin etiquetas de rendimiento y luego se adaptan a una tarea. La revisión los clasifica por familia: reconstrucción enmascarada (SatMAE, Prithvi-EO-2.0), aprendizaje contrastivo y fusión radar–óptico (CROMA, TerraFM), adaptación espectral (DOFA),
representaciones multimodales (AlphaEarth, Clay, AnySat, OlmoEarth) y modelos temporales ligeros (Presto, Galileo). Sus logros suelen medirse en clasificación de cultivos o segmentación, no en toneladas por hectárea. Un extractor preentrenado reduce el aprendizaje que debe hacerse con las etiquetas locales, pero no las
elimina. Recomendación del proyecto: congelar el codificador, obtener un vector por parcela y entrenar un regresor pequeño, comparando vector solo, variables manuales solas y la combinación.

Fuente: literature_review__report__sections__05_modelos.typ.txt; literature_review__report__sections__08b_lecturas.typ.txt (S07, S08, S09, S40–S46).
