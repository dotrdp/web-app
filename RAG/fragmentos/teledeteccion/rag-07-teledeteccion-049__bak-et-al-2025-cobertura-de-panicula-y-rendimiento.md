@id: rag-07-teledeteccion-049
@documento: rag-07-teledeteccion | temas/07_teledeteccion_y_fenologia.md
@categoria: teledeteccion
@titulo: Bak et al. (2025): cobertura de panícula y rendimiento de arroz (no cebada)
@titulo_documento: Teledetección y fenología satelital para la cebada de temporal en el Altiplano
@etiquetas: teledeteccion; sentinel-2; fenologia satelital; ndvi; red-edge; resolucion espacial; nubosidad; curvas sigmoides; cebada; cobertura de espiga; ventana critica; calibracion entre sensores
@claves: teledeteccion sentinel-2 fenologia satelital ndvi red-edge resolucion espacial nubosidad curvas sigmoides cebada cobertura de espiga ventana critica calibracion entre sensores rendimiento cobertura arroz panicula frontiers modelos numero plant science segmentacion advertencia ajusto alcanzaron aprendizaje articulo campo cinco compararon componentes conjunto correlaciono cubre deeplabv3 describen
@fuente: Bak et al. (2025), Frontiers in Plant Science 16, doi 10.3389/fpls.2025.1611653
# Bak et al. (2025): cobertura de panícula y rendimiento de arroz (no cebada)

Bak et al. (2025), en Frontiers in Plant Science vol. 16, describen un método de segmentación semántica con aprendizaje profundo para medir la cobertura de panícula en imágenes RGB de arroz. Cada imagen cubre 1 m² de una parcela, se tomó cada 3–7 días, y el conjunto de rendimiento procede de 152 parcelas (20 de campo
en 2023 y 132 en 2024). Compararon cinco modelos de segmentación; DeepLabv3+ y LinkNet tuvieron el mejor mIoU, por encima de 0.81. La cobertura a lo largo del tiempo se ajustó con una función por partes, y sus parámetros se usaron como predictores de rendimiento y de sus componentes. El parámetro K, la cobertura máxima
de panícula, correlacionó con el rendimiento (r = 0.87, p < 0.001), con el número de granos (r = 0.85) y con el número de panículas por m² (r = 0.70). Según el registro institucional del artículo, los mejores modelos de rendimiento alcanzaron R² = 0.89. Advertencia: es arroz, con fotografías a nivel de suelo y no con
satélite; no mide espiga de cebada desde el espacio, y su resultado no se traslada directamente a la cebada de temporal.

Fuente: Bak et al. (2025), Frontiers in Plant Science 16, doi 10.3389/fpls.2025.1611653
