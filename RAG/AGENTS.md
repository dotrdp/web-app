# RAG AgroCebada 2026 — guía de búsqueda para agentes (tgrep)

Base de conocimiento en español del proyecto FIRA 2026 «Reto AgroCebada»: predicción del rendimiento (t/ha) de cebada maltera de temporal en Hidalgo, Puebla y Tlaxcala, México, ciclo abril–octubre de 2025. Sirve a un agente que actúa como **asistente** y como **analista de datos de reseñas en español**: detecta afirmaciones erróneas, interpreta la jerga agronómica y responde con evidencia citada.

Todo el contenido está en texto plano UTF-8, pensado para búsqueda por expresiones regulares con [tgrep](https://github.com/microsoft/tgrep) (índice de trigramas). No hay embeddings: la recuperación depende de **cadenas literales**.

## Estructura

| Ruta | Qué contiene | Cuándo usarla |
|---|---|---|
| `indices/preguntas.tsv` | Una pregunta y su respuesta por línea | Primera parada para preguntas directas |
| `indices/errores.tsv` | Una afirmación errónea típica y su corrección por línea | Verificar afirmaciones de una reseña |
| `indices/glosario.tsv` | Un término, su forma sin acentos y su definición por línea | Jerga, siglas, regionalismos |
| `indices/fragmentos.tsv` | Un fragmento por línea: id, categoría, título, etiquetas, claves, ruta | Encontrar qué fragmento leer |
| `indices/etiquetas.tsv` | Etiqueta → documentos | Explorar un tema |
| `fragmentos/<categoria>/<id>__<titulo>.md` | Un fragmento autónomo por archivo (120–450 palabras), con cabecera `@campo:` | Leer la evidencia completa y citarla |
| `temas/NN_*.md` | Documento temático completo (fuente de los fragmentos) | Contexto amplio de un tema |
| `datos/agrocebada.sqlite` | Datos oficiales del reto y datos obtenidos por el proyecto, en tablas SQLite de solo lectura | Calcular cifras: etiquetas, índices, clima, AlphaEarth, SIAP |
| `mcp/servidor_agrocebada.py` | Servidor MCP con herramientas de búsqueda en el RAG y de consulta de datos | Uso por un agente con MCP (ver `mcp/LEEME.md`) |

Cada fragmento empieza con líneas buscables:

```
@id: rag-04-amplitud-003
@documento: rag-04-amplitud | temas/04_amplitud_significados.md
@categoria: concepto
@titulo: Amplitud térmica mensual frente a otras formas de medirla
@etiquetas: amplitud; amplitud térmica; tmax tmin; ...
@claves: amplitud termica tmax tmin ...        ← palabras clave SIN acentos
@fuente: archivo del corpus o referencia externa
```

Categorías (`@categoria:`): `reto`, `glosario`, `agronomia`, `concepto`, `suelo`, `plagas`, `teledeteccion`, `experimentos`, `validacion`, `literatura`, `guia-resenas`, `clima`, `economia`, `calidad`, `estadistica`, `fisiologia`, `socioeconomia`, `datos`.

## Documentos

| id | Tema |
|---|---|
| rag-01-reto-datos | Bases del reto, criterios, 197/138/59 parcelas, datasets Básico y PRO, clima, topografía, estadísticas por municipio, auditorías de datos, datos externos |
| rag-02-glosario | Unos 270 términos: índices, fenología, clima, suelo, plagas, estadística, aprendizaje automático, regionalismos («piso», «amplitud», «temporal») |
| rag-03-agronomia | Cebada maltera del Altiplano: variedades, siembra, fertilización, calendario, rendimientos SIAP, temporada 2025, problemas de campo |
| rag-04-amplitud | Significados de «amplitud»: térmica, estacional del NDVI, ancho de intervalo, otras; cómo desambiguar |
| rag-05-crecimiento-piso | «Acelerar el crecimiento, pero a costa del piso»: suelo, piso de arado, fertilización, erosión, tepetate, haying-off |
| rag-06-plagas-danos | Plagas, enfermedades y malezas; detección satelital de daños y por qué el NDVI no atribuye causa |
| rag-07-teledeteccion | Sensores, índices, nubosidad, fenología satelital, calibración entre sensores |
| rag-08-experimentos-profundos | Nuestros experimentos con modelos profundos, fundacionales y de proceso (validación cruzada sobre 138 parcelas) y su literatura |
| rag-09-experimentos-tabulares | Nuestros experimentos tabulares, espaciales y fenológicos (validación cruzada repetida, 138 parcelas) |
| rag-10-validacion | Validación cruzada, fugas de información, muestras pequeñas, etiquetas redondeadas |
| rag-11-literatura | Revisión de literatura y aplicaciones para FIRA (crédito, seguros) |
| rag-12-guia-resenas | Flujo para analizar reseñas, taxonomía de errores, plantillas de respuesta, análisis de datos de reseñas |
| rag-13-variedades | Doña Josefa (6 hileras) y Voyager (2 hileras), reparto confirmado localmente por el proyecto; 2 vs 6 hileras; ensayos de temporal 2018; implicaciones para el análisis |
| rag-14-clima | Clima y riesgo climático del Altiplano: temporal, canícula, heladas, granizo, sequías (Monitor de Sequía), ENSO, SPI/SPEI, Hargreaves, cambio climático |
| rag-15-mercado | Mercado y cadena cebada–malta–cerveza: superficie y producción (SIAP), agricultura por contrato, costos, política pública |
| rag-16-malteo-calidad | Malteo y calidad industrial: NMX-FF-043-SCFI-2003 (texto oficial), parámetros de grano y malta, efecto del ambiente, 2 vs 6 hileras |
| rag-17-medicion-rendimiento | Medición del rendimiento y estadística agrícola: cosecha de muestra, autorreporte, humedad, redondeo, metodología SIAP/INEGI, piso de error |
| rag-18-fisiologia | Fisiología de la cebada: desarrollo, componentes del rendimiento, radiación, agua, temperatura, nitrógeno, señales satelitales |
| rag-19-socioeconomia | Contexto socioeconómico: municipios cebaderos, Llanos de Apan, tenencia, Censo Agropecuario 2022, crédito y seguro, tipología de productores |
| rag-20-datos-mcp | Datos estructurados (SQLite) y servidor MCP: tablas, cobertura, advertencias, recetas de SQL y comparación con el SIAP municipal |

## Recetas de búsqueda

Ejecuta desde la raíz de este directorio y busca siempre sobre `.`, acotando con `-g` (glob). Así se usa el índice `.tgrep/` de la raíz; si pasas una subcarpeta como ruta, tgrep no encuentra el índice y recorre todos los archivos (o usa `--index-path .tgrep`). Pon todas las opciones antes de `--`. No es repositorio git: usa `--no-require-git` al indexar.

```bash
tgrep index . --no-require-git                                    # una vez (o: tgrep serve . --no-require-git)
tgrep -i -g 'indices/**' -- "amplitud t[eé]rmica" .               # respuestas, errores y glosario de una vez
tgrep -i -g 'indices/glosario.tsv' -- "piso de arado" .
tgrep -i -g 'indices/**' -- "do[ñn]a josefa" .
tgrep -i -g 'indices/**' -- "follaje|densidad por m" .              # hecho local: conteo × densidad por m²
tgrep -i -g 'indices/**' -- "imperceptible|subp[ií]xel" .         # hecho local: plaga invisible al satélite
tgrep -l -i -g 'fragmentos/**' -- "@claves:.*senescencia" .       # qué fragmentos tratan un tema
tgrep -l -g 'fragmentos/**' -- "@categoria: plagas" .             # todos los fragmentos de una categoría
tgrep -g 'fragmentos/**' -- "@id: rag-10-validacion-01[0-9]" .    # fragmentos por id
tgrep -i -C 3 -g 'temas/**' -- "3\.955" .                         # rastrear una cifra hasta su contexto
tgrep --stats -i -- "voyager" .                                   # ver el plan de consulta y candidatos
```

Con la herramienta MCP `tgrep_search_code`: usa `glob` (`indices/**`, `fragmentos/<categoria>/**`) o `path` para acotar, `max_results` entre 10 y 30 y búsqueda insensible a mayúsculas. Si la salida se trunca (tope de unos 48 KB), cambia a modo de archivos o de conteo y luego lee el archivo.

**Acentos.** tgrep no ignora acentos. Busca con clases de caracteres (`fenolog[ií]a`, `t[eé]rmica`, `[ñn]`) o usa las columnas y líneas sin acentos: `@claves:` en los fragmentos y las columnas `*_sin_acentos` en los TSV (todo en minúsculas).

**Trigramas.** Las búsquedas más rápidas tienen literales de 3 o más caracteres (`chignahuapan`, `rmse`, `zadoks`). Evita patrones como `.*` solos o palabras de 1–2 letras.

## Flujo recomendado para verificar una afirmación de una reseña

1. Extrae 1–3 palabras clave literales de la afirmación (cifra, municipio, término técnico).
2. Busca en `indices/errores.tsv`: si coincide con un error típico, usa la corrección.
3. Busca en `indices/preguntas.tsv` y `indices/glosario.tsv`.
4. Localiza el fragmento con `indices/fragmentos.tsv` o `tgrep -l` sobre `fragmentos/`, léelo completo y cita su `@id`.
5. Emite el veredicto (correcta / incorrecta / imprecisa / no verificable / opinión) con la cita. Para el procedimiento completo y las plantillas, lee `fragmentos/guia-resenas/`.

## Reglas de interpretación

- **Tipos de contenido.** Los fragmentos separan hechos de la literatura, resultados de nuestros experimentos e hipótesis o recomendaciones; respeta esa distinción al responder.
- **Protocolos.** Las cifras de RMSE solo son comparables con el mismo protocolo y las mismas parcelas. Las cifras de desempeño del proyecto proceden de validación cruzada sobre las 138 parcelas etiquetadas (los mejores modelos rondan 0.47–0.48 t/ha de RMSE en validación cruzada repetida).
- **Variables ausentes.** El dataset del reto no incluye suelo, manejo ni variedad por parcela, solo elevación y pendiente como terreno.
- **Hechos locales del proyecto.** Aportados por el equipo y no se cuestionan: el reparto Doña Josefa (6 hileras) / Voyager (2 hileras); «la mejor predicción que puedo dar sería contar la cantidad de follaje en la cebada y multiplicarla por la densidad por m², y realizar ese cálculo para toda la parcela» (rag-17); y «una plaga se puede propagar y es imperceptible para el satélite» (rag-06). La literatura asociada delimita su alcance, pero no los contradice.
- **Datos no documentados.** Lo marcado «no documentado», «no verificado» o «sin evidencia» no debe presentarse como hecho.
- **Nivel de evidencia.** Las afirmaciones externas se verificaron en línea en cinco rondas (literatura arbitrada, normas e instituciones). Las marcas «(verificado: …)» indican la fuente consultada; «(prensa)» indica contexto periodístico; los registros de verificación no forman parte del RAG. Prioriza: dato oficial del reto o del proyecto > literatura arbitrada verificada > fuente institucional > prensa.

## Datos y herramientas MCP

El servidor MCP `agrocebada` expone siete herramientas con nombres fijos: `rag_buscar`, `rag_leer_fragmento`, `datos_listar_tablas`, `datos_describir_tabla`, `datos_consultar_sql`, `datos_parcela` y `datos_serie_temporal`. Detalle de tablas, recetas de SQL y advertencias en rag-20-datos-mcp.

- **Texto o datos.** Definiciones, literatura, veredictos y cifras de desempeño de nuestros experimentos: RAG (`rag_buscar`). Cifras calculables sobre parcelas, índices, clima, AlphaEarth o SIAP: base de datos (`datos_*`). Si una reseña da una cifra calculable, recalcúlala con SQL antes de dar el veredicto.
- **Antes de escribir SQL**, usa `datos_describir_tabla`; agrega con `GROUP BY` y filtra la nubosidad.
- **Cita** el @id del fragmento y el nombre de la tabla (y la consulta si es corta).
- **Límites.** Las 59 parcelas de PREDICCION no tienen rendimiento; no hay variedad, manejo ni suelo por parcela; el rendimiento del SIAP es municipal; Planet y Sentinel-2 no se fusionan como la misma variable.

## Mantenimiento

`fragmentos/` e `indices/` se generan a partir de `temas/`; edita los documentos temáticos y regenera en un directorio nuevo. La base `datos/agrocebada.sqlite` se regenera con el script de construcción del proyecto a partir de las fuentes de fira2026; no se edita a mano. Ejecuta `tgrep index .` tras cualquier cambio. El directorio `.tgrep/` es un índice generado y no debe versionarse.
