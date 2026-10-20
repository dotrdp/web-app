@id: rag-09-experimentos-tabulares-008
@documento: rag-09-experimentos-tabulares | temas/09_experimentos_tabulares_espaciales_y_fenologicos.md
@categoria: experimentos
@titulo: Sensores cruzados: Sentinel-2 contra PlanetScope (CROSS_SENSOR)
@titulo_documento: Experimentos tabulares, espaciales y fenológicos del proyecto: resultados y lecciones
@etiquetas: experimentos; validación cruzada; rmse; kumo; modelos fundacionales; regresión espacial; fenología; señal intramunicipal; lluvia; ndvi; mtci; área de parcela; techo de error
@claves: experimentos validacion cruzada rmse kumo modelos fundacionales regresion espacial fenologia senal intramunicipal lluvia ndvi mtci area de parcela techo de error cross diferencias sensor sensores comercial contra cruzados dias licencia mediana modelo parcelas planetscope sentinel-2 tabpfn tres variables ajustes alcanzo ambos aparte aportan arrastrar atencion
@fuente: experimentos_tabulares/modelado__CROSS_SENSOR.md
# Sensores cruzados: Sentinel-2 contra PlanetScope (CROSS_SENSOR)

CROSS_SENSOR preguntó si las diferencias entre Sentinel y Planet en fechas cercanas aportan información. Emparejamos observaciones de ambos productos con como máximo dos días de separación, sin interpolar ni arrastrar extremos, y cada observación se usó una sola vez: 8,837 pares para las 197 parcelas, con 445
variables. Las diferencias de índices (NDVI, EVI y LAI) se resumieron por ventana: diferencia mediana con signo, desviación, correlación de Pearson y deriva de 30 días. Las diferencias no se tratan como daño medido, porque reflejan respuesta espectral, tamaño de píxel y procesamiento distintos. La búsqueda declaró 13
configuraciones con selección interna en tres subpliegues y 210 ajustes auditados. Cada modelo corregía la predicción del modelo original de atención.

La configuración primaria obtuvo MAE 0.355416, RMSE 0.507008 t/ha y R² 0.642592. Los tres mejores procedimientos internos dieron 0.352152 / 0.507155 / 0.642385. Ninguno mejoró la línea base ni alcanzó la meta de 30 %. Un diagnóstico con TabPFN 3.5 congelado, usando las 445 variables, dio con la media MAE 0.355986, RMSE
0.512704 y R² 0.634515; con la mediana, 0.332336 / 0.503646 / 0.647316, también sin mejora. El uso de TabPFN 3.5 está limitado por una licencia no comercial (verificado en el README de Prior Labs, que indica que los pesos de TabPFN-3.5 son no comerciales y que la producción requiere una licencia comercial aparte), por
lo que no se promovió. Conclusión: las diferencias entre sensores son reales pero no ayudan a predecir el rendimiento de estas parcelas.

Fuente: experimentos_tabulares/modelado__CROSS_SENSOR.md
