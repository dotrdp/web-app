@id: rag-03-agronomia-071
@documento: rag-03-agronomia | temas/03_agronomia_cebada_altiplano.md
@categoria: agronomia
@titulo: Errores frecuentes y cómo detectarlos
@titulo_documento: Agronomía de la cebada maltera de temporal en el Altiplano (Hidalgo, Tlaxcala y Puebla)
@etiquetas: cebada maltera; temporal; valles altos; esmeralda; adabella; doña josefa; voyager; siembra; fertilización; heladas; granizo; sequía; acame; calidad maltera; siap; reto agrocebada
@claves: cebada maltera temporal valles altos esmeralda adabella dona josefa voyager siembra fertilizacion heladas granizo sequia acame calidad maltera siap reto agrocebada afirmacion correccion erronea cebada agenda hidalgo junio variedad hileras roya texto variedades buena dice norma oficial rendimiento rinde solo tlaxcala amarilla
@fuente: [agronomia/error-spotting-ai-agent-dataset__barley-agronomy-mexico-2026-10-02__barley-agronomy-mexico.typ.txt, agronomia/error-spotting-ai-agent-dataset__barley-agronomy-mexico-2026-10-02__problems.csv, agronomia/error-spotting-ai-agent-dataset__barley-agronomy-mexico-2026-10-02__grower-cases.csv,
# Errores frecuentes y cómo detectarlos

- **Afirmación errónea:** "La cebada de temporal del Altiplano rinde 1.5 a 3 t/ha según la agenda de Hidalgo." → **Corrección:** esa cifra pertenece al capítulo de canola de la agenda, no a la cebada; la cebada de temporal rinde en promedio entre 2 y 2.5 t/ha en los datos del SIAP (no verificados en esta ronda) y de
  1.3 a 3.5 t/ha en los presupuestos del INIFAP (no verificados).
- **Afirmación errónea:** "El SIAP 2025 da 4.00 t/ha para Calpulalpan y Nanacamilpa, así que son las zonas más productivas." → **Corrección:** son cifras redondeadas fijadas al primer reporte de cosecha y no revisadas; no deben usarse como prior.
- **Afirmación errónea:** "Adabella siempre rinde más que Esmeralda." → **Corrección:** Adabella rinde 15% más en buenos ambientes (más de 500 mm), pero menos que Esmeralda en ambientes de baja lluvia (Zamora-Díaz et al., 2008).
- **Afirmación errónea:** "El pulgón ruso transmite el virus del enanismo amarillo (BYDV)." → **Corrección:** el pulgón ruso no es vector del BYDV; otros pulgones de cereal sí lo son. La especie debe identificarse.
- **Afirmación errónea:** "Más semilla siempre da más rendimiento." → **Corrección:** la tasa debe calibrarse con la germinación y el número de plantas logradas; el exceso aumenta el acame y la competencia.
- **Afirmación errónea:** "Las heladas de 2025 dañaron la cebada de la zona." → **Corrección:** no hay siniestros de cebada registrados por el SIAP en los nueve municipios; las heladas de noviembre cayeron con el cultivo todavía en llenado (30% de las parcelas de Chignahuapan seguían con NDVI mayor de 0.5 entre el 1 y
  el 9 de noviembre), y un efecto en rendimiento es **no verificado**.
- **Afirmación errónea:** "La NDVI mide toneladas por hectárea." → **Corrección:** es un indicador de vigor del dosel; el rendimiento depende también del llenado, el manejo y el daño.
- **Afirmación errónea:** "La caída de 2011 se debió solo al granizo." → **Corrección:** la caída de 2011 parece compuesta: exceso de lluvia y granizo al inicio, sequía después y heladas en septiembre.
- **Afirmación errónea:** "La nota de SADER de 2014 dice que Esmeralda es la primera variedad mexicana para temporal con tolerancia a la roya lineal amarilla." → **Corrección:** la nota dice dos cosas distintas: que es la primera variedad desarrollada en México para condiciones de temporal, y que tiene tolerancia a la
  roya lineal amarilla. No dice que sea la única ni la primera con esa tolerancia.
- **Afirmación errónea:** "Esperanza es solo una variedad de riego." → **Corrección:** la revisión de INIFAP de 2021 la menciona, junto con Esmeralda, como variedad que permitió producir cebada cervecera en riego y en temporal.
- **Afirmación errónea:** "Todas las parcelas del reto son de la misma variedad." → **Corrección:** las parcelas se reparten entre Doña Josefa (seis hileras) y Voyager (dos hileras); el dataset no indica la variedad de cada parcela.
- **Afirmación errónea:** "La norma NMX-FF-043 exige una proteína menor de 12%." → **Corrección:** refutado como requisito: las dos tesis de la UNAM que reproducen la norma no incluyen proteína entre sus análisis de calidad; el texto oficial lo confirma (verificado en el texto oficial de la NMX-FF-043-SCFI-2003,
  sección 5.1; ver rag-16-malteo-calidad).
- **Afirmación errónea:** "Esmeralda y Pastor Ortiz tuvieron germinación de 86 a 92% en Apan." → **Corrección:** el rango de 86 a 92% es de Doña Josefa en el resumen de Soto Carrasquel et al. (2016); el texto da 85 a 89% en promedio para las tres variedades.
- **Afirmación errónea:** "Calpulalpan se siembra del 15 de mayo al 15 de junio, con variedades de 107 a 136 días, según el boletín de Tlaxcala de 2025." → **Corrección:** el boletín da para cebada de temporal en la zona de Calpulalpan siembra del 1 de mayo al 30 de junio (Adabella, Brennus, Prunella y Doña Josefa, 110
  a 135 días); el rango de 107 a 136 días corresponde a variedades de trigo de la tabla.
- **Afirmación errónea:** "En Hidalgo se perdieron 14,000 ha de cebada por heladas en 2011." → **Corrección:** es una estimación de productores citada en prensa para cuatro cultivos; no hay cifra oficial de cebada.
- **Afirmación errónea:** "El peso hectolítrico mínimo de la cebada de dos hileras es 56 kg/hL." → **Corrección:** la norma fija 56 kg/hL para seis hileras y 58 kg/hL para dos hileras (texto oficial de la norma; también en dos tesis de la UNAM).
- **Afirmación errónea:** "La agenda de Hidalgo 2017 permite sembrar cebada hasta el 10 de junio." → **Corrección:** la agenda de Hidalgo (Cuadro 2) fija del 1 al 30 de junio para mediana y baja productividad; la fecha del 10 de junio aparece en la agenda de Tlaxcala 2017 como inicio de la ventana de 10 a 30 de junio,
  no como límite.
- **Afirmación errónea:** "Con Esmeralda y Adabella no hace falta fungicida para ninguna roya." → **Corrección:** la agenda de Hidalgo 2017 (Cuadro 7) dice que con esas variedades no se requiere control químico de royas; la agenda de Tlaxcala 2017 sí recomienda Folicur contra roya lineal amarilla y roya de la hoja. Las
  dos agendas no coinciden; la estrategia debe confirmarse por región.
- **Afirmación errónea:** "La fertilización de Hidalgo es 60-46-30 para toda la cebada." → **Corrección:** 60-46-30 es solo para «muy buena productividad»; «buena» y «mediana» usan 46-46-30, y «baja» solo foliares (agenda de Hidalgo 2017, Cuadro 4). La agenda de Tlaxcala 2017 usa 60-40-30 en «muy buena» y «buena».
- **Afirmación errónea:** "Voyager no tiene datos publicados en México." → **Corrección:** un estudio de INIFAP (2021) la evaluó junto con otras cinco variedades en tres ambientes de temporal en 2018. El texto completo no se leyó, y el rendimiento de Voyager por separado no aparece en el resumen consultado.
