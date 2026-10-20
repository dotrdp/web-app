@id: rag-09-experimentos-tabulares-060
@documento: rag-09-experimentos-tabulares | temas/09_experimentos_tabulares_espaciales_y_fenologicos.md
@categoria: experimentos
@titulo: Errores frecuentes y cómo detectarlos
@titulo_documento: Experimentos tabulares, espaciales y fenológicos del proyecto: resultados y lecciones
@etiquetas: experimentos; validación cruzada; rmse; kumo; modelos fundacionales; regresión espacial; fenología; señal intramunicipal; lluvia; ndvi; mtci; área de parcela; techo de error
@claves: experimentos validacion cruzada rmse kumo modelos fundacionales regresion espacial fenologia senal intramunicipal lluvia ndvi mtci area de parcela techo de error afirmacion correccion erronea cebada rendimiento frente ronda tabulares datos mexico solo base evidencia licencia maiz mejora modelos tabla alphaearth apar articulo arxiv
@fuente: experimentos_tabulares/iterate_20261017__research__A3_headroom.md; experimentos_tabulares/iterate_20261017__research__A6_signal_audit.md; experimentos_tabulares/literature_vars_20261017__README.md; experimentos_tabulares/modelado__KUMO_V2.md; experimentos_tabulares/modelado__KUMO_RAINFED.md
# Errores frecuentes y cómo detectarlos

- **Afirmación errónea:** "Kumo mejora el RMSE del proyecto." → **Corrección:** la mejora de Kumo versión 2 fue de 0.002433 t/ha (0.50 %), con IC [−0.013490, 0.010861] que incluye cero, y los pliegues canónicos se reutilizaron muchas veces.
- **Afirmación errónea:** "Kumo rainfed alcanzó R² de 0.85." → **Corrección:** no hay evaluación held-out completa del corpus de un millón de registros; el R² de 0.85 exige RMSE ≤ 0.3285 t/ha y el objetivo de RMSE ≤ 0.10 sigue sin cumplirse.
- **Afirmación errónea:** "El APAR o el NDVI mejoran la regresión espacial." → **Corrección:** en 20 splits, ninguna de las variantes con APAR o NDVI superó la referencia (0/20).
- **Afirmación errónea:** "El área de parcela explica el rendimiento." → **Corrección:** sólo en Chignahuapan (correlación −0.315); en Calpulalpan y Singuilucan es ≈0.
- **Afirmación errónea:** "Las curvas fenológicas predicen el rendimiento." → **Corrección:** el primario de M1 dio RMSE 0.5841 frente a 0.5126 de B0; con efectos municipales, la ganancia es 0.0006.
- **Afirmación errónea:** "El ajuste de ae2020_43 reduce el RMSE a 0.4599." → **Corrección:** es sesgo de selección (p = 0.33 bajo un nulo de selección de ruido).
- **Afirmación errónea:** "Un desplazamiento por mediana municipal mejora la validación." → **Corrección:** es un artefacto del conjunto fijo; el beneficio esperado en datos nuevos es de −0.001 a +0.001.
- **Afirmación errónea:** "AlphaEarth o TESSERA mejoran la predicción." → **Corrección:** AlphaEarth en XGBoost municipal empeoró por +0.044 t/ha (RMSE de ensamble 0.5015 frente a 0.4576 de la referencia; B4).
- **Afirmación errónea:** "Las fechas de PlanetScope confirman que los sensores coinciden." → **Corrección:** las fechas estaban leídas mes-primero; 28,304 de 47,804 filas quedaron sin fecha y 17,835 estaban intercambiadas. Tras corregirlas, la conclusión se mantiene.
- **Afirmación errónea:** "Las fallas de cultivo se ven en el dosel." → **Corrección:** las parcelas con fallas tienen z de dosel entre −0.8 y +2.3, es decir, aparentan normalidad.
- **Afirmación errónea:** "Los embeddings de modelos fundacionales igualan a una RF específica en maíz de España (Nedungadi et al. 2025)." → **Corrección:** en la Tabla 2 el nRMSE fue 26.59 (RFFM), 29.32 (Galileo-RF) y 31.10 (Presto-RF), frente a 14.28 de la RF específica (RFTS); casi el doble de error relativo.
- **Afirmación errónea:** "Ma et al. (2026) muestran R² intra-condado de 0.44 frente a 0.46 en maíz." → **Corrección (ronda 4):** los valores 0.44 y 0.46 son correctos según la Tabla 4 de arXiv:2601.00857, pero son R² a nivel de campo con validación por año de condado, no intra-condado, y los datos son de Estados
  Unidos; el artículo se envió el 30 de diciembre de 2025 (arXiv:2601.00857) y su resumen solo afirma competitividad con datos locales y transferibilidad
  espacial limitada.
- **Afirmación errónea:** "TabPFN supera siempre a los árboles o a la regresión en rendimiento agrícola." → **Corrección:** en Nedungadi et al. (2026, Tabla 3) la ventaja sobre RF fue de 0.65 frente a 0.55 en Estados Unidos, empate a 0.53 en Alemania y, en Sabo et al. (2025), precisión comparable con modelos de ML; la
  ventaja depende del conjunto de datos.
- **Afirmación errónea:** "La eficiencia de uso de la radiación de Monteith es constante durante todo el ciclo del cultivo." → **Corrección:** en el modelo original de Monteith (1972), la producción se sobreestimó durante el crecimiento reproductivo; la relación lineal con la radiación interceptada no describe igual
  todas las fases.

Fuente: experimentos_tabulares/iterate_20261017__research__A3_headroom.md; experimentos_tabulares/iterate_20261017__research__A6_signal_audit.md; experimentos_tabulares/literature_vars_20261017__README.md; experimentos_tabulares/modelado__KUMO_V2.md; experimentos_tabulares/modelado__KUMO_RAINFED.md


- **Afirmación errónea:** Lowder et al. (2016) muestra que las parcelas pequeñas son más productivas. → **Corrección:** Lowder, Skoet y Raney (2016, World Development 87: 16–29) describen el número, tamaño y distribución de granjas en el mundo; no miden la productividad por parcela.
- **Afirmación errónea:** McMaster y Wilhelm (1997) fijan la base térmica de los grados-día para la cebada. → **Corrección:** ese artículo trata dos interpretaciones de la ecuación de grados-día; la base de la cebada no se verificó en esta ronda ni en la ronda 4; sigue sin fuente primaria.
- **Afirmación errónea:** La pérdida pinball de Kumo-Tabular está documentada por NVIDIA. → **Corrección:** su ficha pública no la menciona; solo documenta salidas de 999 cuantiles y la licencia OpenMDW 1.1.
- **Afirmación errónea:** El kriging del rendimiento de cebada en México está establecido en la literatura. → **Corrección:** los estudios localizados son de Burkina Faso (2015) y de soya en Brasil (2026). En la ronda 4, las búsquedas en México encontraron kriging de lluvia en Nuevo León, de materia orgánica de suelos
  en Zapopan y de plagas del maíz en el Estado de México, pero ninguno de rendimiento de cebada (SIN EVIDENCIA).

- **Afirmación errónea:** El NIM de KumoRFM tiene licencia no comercial de investigación. → **Corrección:** la búsqueda de la ronda 4 no encontró esa licencia (SIN EVIDENCIA); el servicio ofrece un nivel gratuito sin condiciones descritas.
- **Afirmación errónea:** Los efectos mixtos por municipio ya se aplican al rendimiento de cebada en México. → **Corrección:** no se localizó literatura mexicana de modelos mixtos o SAE para rendimiento de cebada (SIN EVIDENCIA).
- **Afirmación errónea:** La base térmica de 0 °C para la cebada está establecida. → **Corrección:** solo hay citas de resumen de un estudio brasileño (Tb 0, óptima 22 y Tmax 35 °C); sin fuente primaria, debe calibrarse con fenología local.
