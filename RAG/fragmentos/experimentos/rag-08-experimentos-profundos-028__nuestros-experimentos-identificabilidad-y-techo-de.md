@id: rag-08-experimentos-profundos-028
@documento: rag-08-experimentos-profundos | temas/08_experimentos_modelos_profundos_y_fundacionales.md
@categoria: experimentos
@titulo: Nuestros experimentos: identificabilidad y techo de información
@titulo_documento: Modelos profundos, fundacionales y de proceso: literatura y nuestros experimentos con validación cruzada
@etiquetas: estimación de rendimiento; cebada maltera; validación cruzada; MMST-ViT; redes profundas; modelos fundacionales; modelos de cultivo; pocas etiquetas; techo de información; Prithvi; TabPFN
@claves: estimacion de rendimiento cebada maltera validacion cruzada mmst-vit redes profundas modelos fundacionales modelos de cultivo pocas etiquetas techo de informacion prithvi tabpfn valores techo clima cota distintos identificabilidad informacion solo duplicados error etiquetas experimentos nuestros temporal vectores absoluto agrocebada anos archivo auditoria cero cinco clasificacion cobertura conflicto
@fuente: Proyecto FIRA 2026 «Reto AgroCebada», registros de identificabilidad y auditoría del techo de información (7 de octubre de 2026).
# Nuestros experimentos: identificabilidad y techo de información

Las 138 etiquetas de rendimiento van de 2.00 a 5.59 t/ha, con 67 valores distintos en una cuadrícula de 0.01 t/ha. El archivo no incluye mediciones repetidas de una misma parcela-temporada, ni otros años etiquetados, ni una clasificación medida de riego o temporal. Tampoco hay fechas de siembra o cosecha, cultivar ni
fertilización. Por eso, "temporal" solo puede usarse como supuesto de modelado.

Con las representaciones de entrada, las 138 etiquetas tienen vectores distintos en AEF 2024 (64 valores), en Sentinel-2 corregido (155 valores), en SoilGrids (76 valores) y en Sentinel-1 (91 valores). Solo el clima y la cobertura (462 valores) producen 43 vectores distintos, con 11 grupos duplicados en conflicto. La
cota inferior con solo clima es 0.190724649 t/ha, sumando en los cinco pliegues el mínimo error absoluto de cada grupo. Esta cota muestra confusión por clima grueso, no un techo general. Con todas las entradas, la cota por duplicados es cero, y eso no prueba generalización perfecta ni un piso de error positivo.

Fuente: Proyecto FIRA 2026 «Reto AgroCebada», registros de identificabilidad y auditoría del techo de información (7 de octubre de 2026).
