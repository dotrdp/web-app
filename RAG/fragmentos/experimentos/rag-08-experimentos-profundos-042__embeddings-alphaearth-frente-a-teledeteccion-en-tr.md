@id: rag-08-experimentos-profundos-042
@documento: rag-08-experimentos-profundos | temas/08_experimentos_modelos_profundos_y_fundacionales.md
@categoria: experimentos
@titulo: Embeddings AlphaEarth frente a teledetección en transferencia de escala (2026)
@titulo_documento: Modelos profundos, fundacionales y de proceso: literatura y nuestros experimentos con validación cruzada
@etiquetas: estimación de rendimiento; cebada maltera; validación cruzada; MMST-ViT; redes profundas; modelos fundacionales; modelos de cultivo; pocas etiquetas; techo de información; Prithvi; TabPFN
@claves: estimacion de rendimiento cebada maltera validacion cruzada mmst-vit redes profundas modelos fundacionales modelos de cultivo pocas etiquetas techo de informacion prithvi tabpfn alphaearth frente campo embeddings escala condado nivel teledeteccion transferencia arxiv datos estados maiz soya unidos agricultural anual atribuyen autores benchmarking cambio cebada comparable comparan competir
@fuente: Ma, Y., Shen, Y., Swatantran, A. y Lobell, D. B. (2025/2026), «Harvesting AlphaEarth: Benchmarking the Geospatial Foundation Model for Agricultural Downstream Tasks», arXiv:2601.00857, Tabla 4 (leído en la ronda 4).
# Embeddings AlphaEarth frente a teledetección en transferencia de escala (2026)

En Ma et al. (arXiv:2601.00857), los embeddings de AlphaEarth Foundations se comparan con predictores de teledetección (RS) en rendimiento de campo de Estados Unidos, con más de 180,000 registros de Corteva. En la transferencia de escala, los modelos se entrenan con datos a nivel de condado y predicen rendimientos de
campo. Con XGBoost, el R² de AlphaEarth fue de 0.25 frente a 0.38 de RS en maíz, de 0.11 frente a 0.24 en soya y de −0.04 frente a 0.22 en trigo de invierno. Los autores atribuyen la pérdida a la compresión de los embeddings al promediarlos a nivel de condado, que diluye señales de crecimiento a escala de campo. En
cambio, con validación por año de condado a nivel de campo, AlphaEarth fue comparable: 0.44 frente a 0.46 en maíz y 0.37 frente a 0.35 en soya. La lección para el reto es que un embedding anual a 10 m puede competir con datos locales y, aun así, transferir mal entre escalas. Cualquier uso de AlphaEarth debería
validarse por municipio y por año, no solo por parcela. Estos resultados son de Estados Unidos y no de cebada.

Fuente: Ma, Y., Shen, Y., Swatantran, A. y Lobell, D. B. (2025/2026), «Harvesting AlphaEarth: Benchmarking the Geospatial Foundation Model for Agricultural Downstream Tasks», arXiv:2601.00857, Tabla 4 (leído en la ronda 4).
