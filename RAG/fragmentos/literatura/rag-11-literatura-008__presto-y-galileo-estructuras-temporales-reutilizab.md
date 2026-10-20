@id: rag-11-literatura-008
@documento: rag-11-literatura | temas/11_revision_de_literatura_y_transferencia.md
@categoria: literatura
@titulo: Presto y Galileo: estructuras temporales reutilizables
@titulo_documento: Revisión de literatura y transferencia a aplicaciones FIRA (rendimiento de cebada con satélite)
@etiquetas: cebada; teledetección; rendimiento; transferencia; validación espacial; modelos fundacionales; seguro paramétrico; crédito rural; fira; cimmyt
@claves: cebada teledeteccion rendimiento transferencia validacion espacial modelos fundacionales seguro parametrico credito rural fira cimmyt arxiv temporales tseng galileo presto codificador estructuras literature millones report reutilizables review sections ademas advertencia agricolas articulo ausencia base benchmarks cartografia centran cero cifra coberturas
@fuente: literature_review__report__sections__05_modelos.typ.txt; literature_review__report__sections__08b_lecturas.typ.txt (S07, S08); Tseng et al. (2023), arXiv:2304.14065; Tseng et al. (2025), arXiv:2502.09356.
# Presto y Galileo: estructuras temporales reutilizables

Presto (Tseng et al., 2023; arXiv:2304.14065) está diseñado para series temporales de teledetección a nivel de píxel con un transformador ligero. Verificado en la versión HTML del artículo (arXiv:2304.14065v4, Tablas 4 y 8): el codificador congelado tiene 402 000 parámetros (≈0.40 millones), y la configuración base con
codificador y decodificador suma ≈0.81 millones; el texto no da una cifra exacta para ese conjunto. Galileo (Tseng et al., 2025; ICML 2025, PMLR 267) combina modalidades y objetivos globales y locales, con entradas espaciales, temporales, espaciotemporales y estáticas, además de máscaras y meses; es pertinente cuando
los sensores tienen coberturas distintas. Sus benchmarks agrícolas se centran en cartografía de cultivos. Para el proyecto, la advertencia técnica es que una máscara explícita representa una modalidad faltante: rellenarla con cero puede convertir una ausencia en una observación física.

Fuente: literature_review__report__sections__05_modelos.typ.txt; literature_review__report__sections__08b_lecturas.typ.txt (S07, S08); Tseng et al. (2023), arXiv:2304.14065; Tseng et al. (2025), arXiv:2502.09356.
