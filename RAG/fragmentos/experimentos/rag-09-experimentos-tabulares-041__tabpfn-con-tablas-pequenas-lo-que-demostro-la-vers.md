@id: rag-09-experimentos-tabulares-041
@documento: rag-09-experimentos-tabulares | temas/09_experimentos_tabulares_espaciales_y_fenologicos.md
@categoria: experimentos
@titulo: TabPFN con tablas pequeñas: lo que demostró la versión original y la publicada en Nature
@titulo_documento: Experimentos tabulares, espaciales y fenológicos del proyecto: resultados y lecciones
@etiquetas: experimentos; validación cruzada; rmse; kumo; modelos fundacionales; regresión espacial; fenología; señal intramunicipal; lluvia; ndvi; mtci; área de parcela; techo de error
@claves: experimentos validacion cruzada rmse kumo modelos fundacionales regresion espacial fenologia senal intramunicipal lluvia ndvi mtci area de parcela techo de error hollmann nature tablas tabpfn version datos hasta muller original pequenas publicada resumen arxiv clasificacion conjuntos demostro eggensperger hutter metodos pocos reporta s41586-024-08328-6 veces aceleracion agricola
@fuente: Hollmann, Müller, Eggensperger, Hutter (2022/2023), arXiv:2207.01848; Hollmann, Müller, Purucker et al. (2025), Nature 637, 319-326, DOI 10.1038/s41586-024-08328-6.
# TabPFN con tablas pequeñas: lo que demostró la versión original y la publicada en Nature

TabPFN es un transformador preentrenado con tablas sintéticas que predice tablas pequeñas sin ajustar pesos nuevos para cada conjunto de datos. La versión original, de Hollmann, Müller, Eggensperger y Hutter (arXiv:2207.01848, 2022, revisada hasta 2023), se evaluó en clasificación: según su resumen, resuelve problemas
de clasificación con pocos datos en menos de un segundo, no necesita ajuste de hiperparámetros y, en 18 conjuntos de OpenML-CC18, supera a los árboles potenciados. El resumen reporta una aceleración de hasta 230 veces frente a esos métodos y de 5,700 veces con GPU; estas cifras son de tiempo de cómputo, no de error de
predicción. La versión publicada en Nature (Hollmann et al., 2025, vol. 637, pp. 319-326, DOI 10.1038/s41586-024-08328-6) reporta mejor desempeño que los métodos previos en conjuntos de hasta 10,000 muestras; esta cifra se verificó con el resumen del buscador, no con el texto completo. Para nuestros proyectos, TabPFN
es una referencia legítima con pocos datos, pero su ventaja en rendimiento agrícola depende de la tarea (ver el fragmento de Nedungadi et al. 2026). Esto es un hecho de la literatura, no un resultado del proyecto.

Fuente: Hollmann, Müller, Eggensperger, Hutter (2022/2023), arXiv:2207.01848; Hollmann, Müller, Purucker et al. (2025), Nature 637, 319-326, DOI 10.1038/s41586-024-08328-6.
