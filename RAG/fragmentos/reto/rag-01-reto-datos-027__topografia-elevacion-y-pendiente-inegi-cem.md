@id: rag-01-reto-datos-027
@documento: rag-01-reto-datos | temas/01_reto_agrocebada_y_datos.md
@categoria: reto
@titulo: Topografía: elevación y pendiente (INEGI CEM)
@titulo_documento: Reto AgroCebada 2026: bases, dataset y fuentes del proyecto
@etiquetas: reto agrocebada; fira 2026; rendimiento cebada; hidalgo puebla tlaxcala; dataset parcelas; sentinel-2; planet; chirps; chirts-era5; topografia cem
@claves: reto agrocebada fira 2026 rendimiento cebada hidalgo puebla tlaxcala dataset parcelas sentinel-2 planet chirps chirts-era5 topografia cem resolucion pendiente elevacion horn inegi dataset terreno descripcion evidencia oficial parcelas pixeles ronda seccion tienen topografia version accidentado agro algoritmo algunas anteriores antes archivo archivos
@fuente: DESCRIPCION_oficial_dataset.txt (sección 4); modelado__docs__ORIGINAL_FIRA_INPUT_AUDIT.md (sección Terrain); dataset__DATASET_RETO_AGRO_2026__plot_features__README.md.
# Topografía: elevación y pendiente (INEGI CEM)

Elevación y pendiente son dos rasters estáticos derivados del Continuo de Elevaciones Mexicano de INEGI. Los archivos entregados tienen 2,900 × 3,362 píxeles, EPSG:6372 y resolución de 120 m. La pendiente se da en grados (Horn 3 × 3). El algoritmo de Horn (1981, Proceedings of the IEEE 69: 14–47) usa una ventana de 3 ×
3 píxeles; GDAL ofrece Horn o Zevenbergen-Thorne y señala que Horn funciona mejor en terreno más accidentado (verificado en la ronda 3). Que el CEM o el procesamiento del proyecto usen exactamente esa fórmula no está documentado (sin evidencia). La descripción oficial menciona CEM 4.0 con resolución de 15 m, pero las
capas efectivamente entregadas son de 120 m; las auditorías toman el archivo real como referencia. En la verificación de la ronda 2, INEGI documenta el CEM versión 3.0 (2012) con resolución de 15 m y las versiones anteriores con 30 m; no se encontró documentación pública de una versión 4.0 ni de su resolución (sin
evidencia). Una malla de 120 m no coincide con la resolución nativa publicada, así que probablemente es un remuestreo; esto debe confirmarse con el equipo antes de citar la resolución del terreno. Algunas parcelas tienen cobertura baja: la pendiente cubre 0.65 de AGC_020, 0.29 de AGC_023, 0.55 de AGC_164 y solo 0.02 de
AGC_170, y la elevación 0.76 de AGC_170. Las estadísticas de terreno de esas parcelas deben tratarse
como incompletas.

Fuente: DESCRIPCION_oficial_dataset.txt (sección 4); modelado__docs__ORIGINAL_FIRA_INPUT_AUDIT.md (sección Terrain); dataset__DATASET_RETO_AGRO_2026__plot_features__README.md.
