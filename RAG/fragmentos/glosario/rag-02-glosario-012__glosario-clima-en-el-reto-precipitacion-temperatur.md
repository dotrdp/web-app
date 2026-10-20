@id: rag-02-glosario-012
@documento: rag-02-glosario | temas/02_glosario_terminos_es.md
@categoria: glosario
@titulo: Glosario: clima en el reto (precipitación, temperatura y grados-día)
@titulo_documento: Glosario del Reto AgroCebada (agronomía, teledetección, clima, estadística y aprendizaje automático)
@etiquetas: glosario; cebada maltera; temporal; fenología de la cebada; zadoks; índices de vegetación; rmse; validación cruzada; fuga de información; regionalismos
@claves: glosario cebada maltera temporal fenologia de la cebada zadoks indices de vegetacion rmse validacion cruzada fuga de informacion regionalismos temperatura base cebada grados-dia mensual reto precipitacion malla chapingo chapters chirps clima desarrollo emergencia era5-land fenologia funk hileras literature maiz maxima mensuales minima observaciones
@fuente: reto_y_datos/Descripcion_general_variables_DataSet.txt; teledeteccion_fenologia/literature_review__report__chapters__02_observacion.typ.txt; teledeteccion_fenologia/literature_review__report__chapters__03_representaciones.typ.txt; experimentos_tabulares/dynamic_change__phenocurve__docs__F1_fits.md;…
# Glosario: clima en el reto (precipitación, temperatura y grados-día)

Contexto: el reto entrega precipitación y temperaturas mensuales en rásteres (.tif) para 2022–2025, en los tres estados. Los acumulados, promedios y grados-día se construyen por cada equipo a partir de estas capas.

- **Precipitación mensual acumulada (CHIRPS)**: suma mensual de lluvia en milímetros (mm). CHIRPS tiene malla de 0.05° (Funk et al., 2015).
- **Temperatura mínima mensual y máxima mensual (CHIRTS-ERA5)**: promedio mensual de las temperaturas mínimas y máximas, en grados Celsius (°C). Son promedios de meses, no extremos diarios.
- **Temperatura media**: indicador que el reto sugiere construir; puede aproximarse con el promedio de la mínima y la máxima mensuales.
- **Grados-día de desarrollo (GDD; growing degree days)**: acumulado de temperatura por encima de una temperatura base, en °C·día. **CORREGIDO**: el artículo de Chapingo citado (Cruz-González et al., Current Topics in Agronomic Science, vol. 6, publicado el 24 de marzo de 2026, DOI 10.5154/r.ctasci.2025.03.001) trata
  sobre maíz, no sobre cebada, y no fija una temperatura base para cebada. Describe los grados-día como un método sencillo para seguir las etapas fenológicas del maíz. Franch y colaboradores lo usan para alinear
  observaciones de cebada en España.
- **Temperatura base (Tb)**: umbral por debajo del cual el desarrollo se detiene. El proyecto usa base 0 °C en su análisis fenológico, pero **no hay una Tb documentada para cebada en el Altiplano** en las fuentes revisadas. En literatura internacional, un estudio de cebada de invierno en Serbia usó base 0 °C (24
  cultivares; unos 1223 GDD de emergencia a emergencia de la hoja bandera en dos hileras y 1304 en seis hileras; verificado en resumen de la publicación). Una tabla de la Universidad de Minnesota con estadios Zadoks usa base 4.4 °C (40 °F). Las bases no son intercambiables.
- **Reanálisis (ERA5-Land, AgERA5)**: productos que combinan modelo y observaciones. ERA5-Land tiene malla aproximada de 9 km. Un reanálisis no es una estación en cada parcela.
- **Malla (grid)**: unidad espacial de un producto. Un contraste débil entre parcelas cercanas puede reflejar que comparten la misma celda.

Fuente: reto_y_datos/Descripcion_general_variables_DataSet.txt; teledeteccion_fenologia/literature_review__report__chapters__02_observacion.typ.txt; teledeteccion_fenologia/literature_review__report__chapters__03_representaciones.typ.txt; experimentos_tabulares/dynamic_change__phenocurve__docs__F1_fits.md; Funk et al.
(2015); Chapingo (2025, resumen de búsqueda).
