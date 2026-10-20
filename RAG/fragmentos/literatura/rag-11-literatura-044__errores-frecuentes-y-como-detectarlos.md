@id: rag-11-literatura-044
@documento: rag-11-literatura | temas/11_revision_de_literatura_y_transferencia.md
@categoria: literatura
@titulo: Errores frecuentes y cómo detectarlos
@titulo_documento: Revisión de literatura y transferencia a aplicaciones FIRA (rendimiento de cebada con satélite)
@etiquetas: cebada; teledetección; rendimiento; transferencia; validación espacial; modelos fundacionales; seguro paramétrico; crédito rural; fira; cimmyt
@claves: cebada teledeteccion rendimiento transferencia validacion espacial modelos fundacionales seguro parametrico credito rural fira cimmyt afirmacion correccion erronea literature review articulo coordenadas report codificador datos mejora millones parcela registros satelital sections seguro tiene aquacrop campo comparison credito
@fuente: literature_review__report__chapters__04_transferencia.typ.txt; literature_review__report__sections__05_modelos.typ.txt; literature_review__report__sections__07_economia_aplicacion.typ.txt; literature_review__research__cebada_comparison_20261011__comparison.typ.txt;
# Errores frecuentes y cómo detectarlos

- **Afirmación errónea:** EarthShift muestra un deterioro de 15–20 % en RMSE para cebada. → **Corrección:** su cifra promedia deterioro fuera de distribución en otras tareas y puntuaciones; no es una proyección del RMSE de cebada FIRA.
- **Afirmación errónea:** Presto tiene 0.81 millones de parámetros en su codificador. → **Corrección:** 0.81 millones corresponde al conjunto codificador más decodificador; el codificador congelado tiene 402 000 (≈0.40 millones), según las Tablas 4 y 8 del artículo.
- **Afirmación errónea:** el vector anual de AlphaEarth 2025 sirve para pronosticar en octubre. → **Corrección:** incorpora noviembre y diciembre; solo es admisible para análisis retrospectivo.
- **Afirmación errónea:** una media municipal de SIAP es la etiqueta de cada parcela. → **Corrección:** es una referencia agregada; asignarla a muchas parcelas no aporta observaciones independientes.
- **Afirmación errónea:** el experimento de adaptación mejoró el error. → **Corrección:** la diferencia de 11.64 kg/ha tiene un intervalo pareado que incluye cero; no demuestra mejora externa.
- **Afirmación errónea:** la geografía mejoró nuestro modelo. → **Corrección:** en el experimento de coordenadas, 0.331045 t/ha frente a 0.324975 t/ha del control sin coordenadas; no hubo mejora en esa comparación.
- **Afirmación errónea:** las coordenadas CIMMYT permiten extraer el píxel exacto de cada parcela. → **Corrección:** las coordenadas están anonimizadas; el error de ubicación puede llevar a un píxel vecino.
- **Afirmación errónea:** los 968 registros de cebada del artículo de CIMMYT son de temporal en tres estados. → **Corrección:** el artículo reporta 968 registros de rendimiento de cebada a escala nacional (todos los regímenes); los 94 registros de temporal en Hidalgo, Tlaxcala y Puebla salen de nuestra auditoría con
  otro filtro.
- **Afirmación errónea:** la FND es hoy una institución de crédito y gestión de riesgos agrícolas. → **Corrección:** el decreto del DOF de 29/05/2023 la extinguió y la dejó en liquidación (INDEP); las referencias a la FND deben fecharse o sustituirse por FIRA cuando corresponda.
- **Afirmación errónea:** un mapeador escalable de rendimiento funciona en cualquier región sin datos de campo. → **Corrección:** Azzari et al. (2017) reportan R² ≥ 0.5 solo para EE. UU. en el resumen; Zambia e India no se verificaron, y Jain et al. (2016) obtienen R² de 0.27 y 0.33 para rendimiento en Bihar, con
  mejores resultados al calibrar con cortes de cultivo.
- **Afirmación errónea:** la agricultura de conservación aumenta el rendimiento de cebada según Ferguson et al. → **Corrección:** el trabajo mide exposición a contaminación y mortalidad infantil; no estima rendimiento de cebada ni efecto causal sobre parcelas.
- **Afirmación errónea:** la literatura demuestra que un pronóstico satelital mejora el crédito rural en México. → **Corrección:** no hay evidencia verificable en fuentes académicas o institucionales; es una hipótesis que requiere evaluación.
- **Afirmación errónea:** el seguro paramétrico satelital de AGROASEMEX es un seguro de cebada. → **Corrección:** el diseño documentado en Terra Latinoamericana 36(2) (2018) es para ganadería y pastizales, con índice 1/NDVIcp; no hay evidencia verificada de un seguro de cebada con rendimiento satelital.
- **Afirmación errónea:** Gómez Mercado et al. (2009) usaron AquaCrop. → **Corrección:** el texto usa la metodología FAO de zonas agroecológicas (con factores de ajuste por región y genotipo); AquaCrop no aparece en el artículo.
- **Afirmación errónea:** Iranzo et al. (2022) trabajan con etiquetas distritales. → **Corrección:** el estudio es de un campo de 127 ha en Belchite (España), a escala de parcela.
- **Afirmación errónea:** el daño por heladas en cebada reduce el rendimiento final. → **Corrección:** en los experimentos de Fonteyne et al. (2023) las plantas se recuperaron y el daño no afectó el rendimiento en esas condiciones; la conclusión no se extiende a otras fases ni ambientes.

Fuente: literature_review__report__chapters__04_transferencia.typ.txt; literature_review__report__sections__05_modelos.typ.txt; literature_review__report__sections__07_economia_aplicacion.typ.txt; literature_review__research__cebada_comparison_20261011__comparison.typ.txt;
reto_y_datos/literature_review__report__sections__04_datos.typ.txt; Gómez Mercado et al. (2009), Iranzo et al. (2022), Terra Latinoamericana 36(2) (2018), Fonteyne et al. (2023), resúmenes y textos consultados.
