@id: rag-01-reto-datos-059
@documento: rag-01-reto-datos | temas/01_reto_agrocebada_y_datos.md
@categoria: reto
@titulo: Escala de los datos frente a la parcela: una comparación para el reto
@titulo_documento: Reto AgroCebada 2026: bases, dataset y fuentes del proyecto
@etiquetas: reto agrocebada; fira 2026; rendimiento cebada; hidalgo puebla tlaxcala; dataset parcelas; sentinel-2; planet; chirps; chirts-era5; topografia cem
@claves: reto agrocebada fira 2026 rendimiento cebada hidalgo puebla tlaxcala dataset parcelas sentinel-2 planet chirps chirts-era5 topografia cem parcela frente parcelas reto area celdas escala pixel tienen chignahuapan comparacion datos mediana tiene access agera5 agrocebada archivo bases caben calculo capa climaticas
@fuente: [BASES_oficiales_Reto_AgroCebada.txt, DESCRIPCION_oficial_dataset.txt, Descripcion_general_variables_DataSet.txt, Diccionario_de_indices_satelitales.txt, HECHOS_CALCULADOS_dataset_oficial.md, modelado__ORIGINAL_FIRA_AUDIT.md, modelado__docs__ORIGINAL_FIRA_INPUT_AUDIT.md, modelado__DATASET.md,
# Escala de los datos frente a la parcela: una comparación para el reto

Las parcelas del reto tienen área de 0.35 a 64.30 ha, con mediana de 5.46 ha. Chignahuapan concentra 100 parcelas en un área de 9.9 × 6.6 km, con distancia mediana de 3.3 km entre parcelas. Frente a esa escala, CHIRPS y CHIRTS-ERA5 tienen celdas de 0.05° (unos 29 km² en esta latitud), así que dentro del área de
Chignahuapan caben solo unas 2 a 3 celdas. AgERA5 tiene celdas de 0.1° (unos 115 km²). El CEM de la capa entregada tiene 120 m (unos 1.44 ha por píxel), y Sentinel-2 y HLS tienen 10 y 30 m. Un píxel de CEM de 120 m es mayor que una parcela pequeña de 0.35 ha, por lo que la pendiente de esas parcelas proviene de una
fracción del píxel. Recomendación: presentar en el informe una tabla con la resolución efectiva de cada fuente frente al tamaño de la parcela, y no interpretar variables climáticas como si fueran de cada parcela. Fuente: cálculo a partir de BASES_oficiales_Reto_AgroCebada.txt, DESCRIPCION_oficial_dataset.txt e
iterate_20261017__research__A4_data_access.md (sección 4 a); resoluciones de las fuentes externas de este archivo.
