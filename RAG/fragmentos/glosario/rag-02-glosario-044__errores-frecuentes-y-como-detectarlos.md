@id: rag-02-glosario-044
@documento: rag-02-glosario | temas/02_glosario_terminos_es.md
@categoria: glosario
@titulo: Errores frecuentes y cómo detectarlos
@titulo_documento: Glosario del Reto AgroCebada (agronomía, teledetección, clima, estadística y aprendizaje automático)
@etiquetas: glosario; cebada maltera; temporal; fenología de la cebada; zadoks; índices de vegetación; rmse; validación cruzada; fuga de información; regionalismos
@claves: glosario cebada maltera temporal fenologia de la cebada zadoks indices de vegetacion rmse validacion cruzada fuga de informacion regionalismos afirmacion correccion erronea cebada piso literatura rendimiento validacion aparece aplicacion fira indice literature report review alto amplitud base chapters cruzada desempeno fondo garantias maiz puede
@fuente: agronomia/modelado__research_notes__Barley_yield_predictors_Mexican_highlands__regional_agronomy.md; literatura_aplicacion/literature_review__report__sections__08b_lecturas.typ.txt; reto_y_datos/Descripcion_general_variables_DataSet.txt;
# Errores frecuentes y cómo detectarlos

- **Afirmación errónea:** "Un índice de vegetación alto indica rendimiento alto en t/ha." → **Corrección:** El NDVI y otros índices son predictores potenciales, no mediciones de toneladas por hectárea. Dos parcelas con verdor semejante pueden diferir en llenado de grano, manejo o daños.
- **Afirmación errónea:** "El R² de 0.79 de García-Martínez en Acambay valida la estimación de cebada." → **Corrección:** Ese R² es de maíz bajo sequía, de ajuste y no de validación externa. La propia fuente señala sobreestimación en valores altos del índice.
- **Afirmación errónea:** "Piso siempre significa suelo." → **Corrección:** En el corpus, "piso" aparece como piso de desempeño. La acepción altitudinal se expresa como elevación o piso térmico, y el piso de arado y el piso como terreno no están documentados.
- **Afirmación errónea:** "La amplitud térmica se calcula con la temperatura máxima y mínima diarias." → **Corrección:** Las capas del reto son promedios mensuales de CHIRTS-ERA5, por lo que la amplitud derivada es una amplitud media mensual.
- **Afirmación errónea:** "Temporal significa temporada de lluvias." → **Corrección:** Temporal es la modalidad hídrica sin riego. La temporada de lluvias es un periodo del año; el dataset distingue "Temporal" y "Riego" como modalidades.
- **Afirmación errónea:** "Una helada que daña la hoja reduce el rendimiento." → **Corrección:** En los contextos estudiados, las plantas se recuperaron y el mayor daño observado no implicó menor rendimiento. El daño transitorio y la pérdida final de grano no son equivalentes.
- **Afirmación errónea:** "Un R² alto en validación cruzada garantiza buen desempeño en parcelas nuevas." → **Corrección:** La validación cruzada en un mismo conjunto puede inflar ganancias, y el desempeño cae al cambiar de campaña o región (Franch y colaboradores reportan R² cercano a 0.45 entre regiones).
- **Afirmación errónea:** "El orden de las filas del archivo es una variable válida." → **Corrección:** El orden de almacenamiento se asocia con la etiqueta por causas de recolección. Usarlo es fuga de información.
- **Afirmación errónea:** "Una diferencia de 0.01 t/ha entre dos modelos demuestra que uno es mejor." → **Corrección:** Diferencias de esa magnitud pueden quedar dentro del ruido de la validación cruzada. Hay que comparar con una línea base fuerte y con intervalos.
- **Afirmación errónea:** "Milpa es un cultivo de cebada en el Altiplano." → **Corrección:** La milpa es un policultivo de maíz, frijol y calabaza. En el corpus solo aparece en el topónimo Nanacamilpa.
- **Afirmación errónea:** "El artículo de Chapingo de 2025 fija la temperatura base de grados-día para cebada." → **Corrección:** El artículo de Chapingo (2026) trata sobre maíz. Para cebada de invierno, la base 0 °C aparece en un estudio de Serbia, y una tabla de Minnesota usa 4.4 °C; las bases no son intercambiables.
- **Afirmación errónea:** "Doña Josefa, la cebada de Hidalgo, es de seis hileras según la literatura." → **Corrección:** El dato de seis hileras viene de la verificación local del proyecto; las fuentes externas consultadas no lo confirman.

Fuente: agronomia/modelado__research_notes__Barley_yield_predictors_Mexican_highlands__regional_agronomy.md; literatura_aplicacion/literature_review__report__sections__08b_lecturas.typ.txt; reto_y_datos/Descripcion_general_variables_DataSet.txt;
literatura_aplicacion/literature_review__report__chapters__04_transferencia.typ.txt; literatura_aplicacion/literature_review__report__chapters__03_representaciones.typ.txt; validacion/iterate_20261017__research__critique_leakage.md; experimentos_tabulares/iterate_20261017__research__A3_headroom.md;
literatura_aplicacion/literature_review__report__chapters__04_transferencia.typ.txt

- **Afirmación errónea:** AGROASEMEX tiene un seguro paramétrico satelital de cebada basado en NDVI. → **Corrección:** el diseño documentado en Terra Latinoamericana 36(2) (2018) es para ganadería y pastizales, con índice 1/NDVIcp; no hay evidencia de un seguro de cebada.
- **Afirmación errónea:** FIRA publica pronósticos de rendimiento con satélite para su crédito. → **Corrección:** las páginas oficiales consultadas listan informes de gestión, garantías y cotizador de coberturas; no describen pronósticos de rendimiento (SIN EVIDENCIA).
- **Afirmación errónea:** el índice de siniestralidad es la razón de indemnizaciones a primas. → **Corrección:** en el SIAP es la superficie siniestrada entre la superficie sembrada, multiplicada por cien (NTGEBAP 2022).
- **Afirmación errónea:** "FONAGA es uno de los fideicomisos de FIRA." → **Corrección:** FIRA se integra por cuatro fideicomisos (FONDO, FEFA, FEGA y FOPESCA); FONAGA (Fondo Nacional de Garantías) aparece como fondo de garantías pagadas, no entre los cuatro (FIRA, Programa Institucional 2025).
- **Afirmación errónea:** "El SPI incluye la evapotranspiración y por eso mide el calor." → **Corrección:** el SPI usa solo precipitación; el SPEI resta la evapotranspiración potencial y es la variante sensible al calentamiento (Vicente-Serrano et al., 2010).
- **Afirmación errónea:** "Sentinel-2 revisita cada 10 días." → **Corrección:** con su constelación de dos satélites, la revisita es de 5 días (Copernicus, misión Sentinel-2).
- **Afirmación errónea:** "La superficie cosechada puede ser mayor que la sembrada." → **Corrección:** la NTGEBAP 2022 del SIAP establece que no puede serlo.
