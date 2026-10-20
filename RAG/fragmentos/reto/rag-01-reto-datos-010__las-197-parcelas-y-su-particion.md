@id: rag-01-reto-datos-010
@documento: rag-01-reto-datos | temas/01_reto_agrocebada_y_datos.md
@categoria: reto
@titulo: Las 197 parcelas y su partición
@titulo_documento: Reto AgroCebada 2026: bases, dataset y fuentes del proyecto
@etiquetas: reto agrocebada; fira 2026; rendimiento cebada; hidalgo puebla tlaxcala; dataset parcelas; sentinel-2; planet; chirps; chirts-era5; topografia cem
@claves: reto agrocebada fira 2026 rendimiento cebada hidalgo puebla tlaxcala dataset parcelas sentinel-2 planet chirps chirts-era5 topografia cem parcelas dataset particion bases rendimiento reto seccion agrocebada aleatorio aproximadamente area campanas campo conjunto contiene corpus cultivo dato dentro describen descripcion desde entrenamiento evaluacion exigente
@fuente: DESCRIPCION_oficial_dataset.txt (sección 1, Parcelas de cultivo); BASES_oficiales_Reto_AgroCebada.txt (sección Dataset); literature_review__report__sections__02_reto_corpus.typ.txt.
# Las 197 parcelas y su partición

El dataset contiene 197 parcelas con identificador único desde AGC_001 hasta AGC_197. Cada una tiene área en hectáreas (de 0.35 a 64.30 ha; mediana 5.46 ha) y el campo CONJUNTO, que indica ENTRENAMIENTO (138 parcelas, con rendimiento visible en t/ha) o PREDICCION (59 parcelas, con rendimiento oculto). La partición es
aproximadamente 70/30. Las bases no describen el mecanismo con que se seleccionaron las parcelas ocultas; si fue aleatorio entre vecinas, la evaluación mide sobre todo interpolación dentro de la región, y si se reservaron municipios o campañas, la transferencia es más exigente. Ese dato no está en las fuentes.

Fuente: DESCRIPCION_oficial_dataset.txt (sección 1, Parcelas de cultivo); BASES_oficiales_Reto_AgroCebada.txt (sección Dataset); literature_review__report__sections__02_reto_corpus.typ.txt.
