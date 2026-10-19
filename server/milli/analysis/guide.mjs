// plot_guide: recipes the model can read before building a figure. Each recipe is the exact tool
// sequence, so any model (not only a strong one) can produce a correct, well-labelled figure.
export const PLOT_GUIDE = {
  basico: `# Cómo se arma una figura (igual que matplotlib)
1. Datos: data_load (parcelas | serie_mensual | error_regional | adjunto) → dataset con nombre. Ajusta con data_transform (filter, derive, group_by/aggregate, pivot, melt, join). No copies números: refiérete a columnas por nombre.
2. plot_figure: título, subtítulo, disposición (rows/cols, mosaic o facet) y tipo de cada ejes (axes_types: xy, 3d, map, polar, pie).
3. Artistas, uno por llamada, indicando ax: plot_line, plot_scatter, plot_bar, plot_hist, plot_hist2d, plot_box, plot_kde, plot_errorbar, plot_fill_between, plot_heatmap, plot_contour, plot_surface, plot_regression, plot_pie, plot_map, plot_reference, plot_annotate.
4. Formato: plot_axes (etiquetas CON unidades, escalas, límites, ticks, orden de categorías, aspecto, vista 3D, mapa base) y plot_legend.
5. plot_show: se dibuja en el chat y recibes un PNG al ancho del chat (≈400 px; en pantallas angostas los paneles se apilan en una columna), que es lo que el usuario ve primero; review "large" o "both" agrega la vista ampliada. Revísalo como lo haría un analista: ¿se leen las etiquetas? ¿la escala engaña? ¿sobran o faltan series? Corrige (plot_axes, plot_update, plot_remove, más artistas) y vuelve a llamar plot_show: la versión anterior se pliega sola.
   Si mejor empiezas otra figura, pasa replaces: "<figure_id del borrador>" a plot_figure (el borrador se pliega) o usa plot_withdraw. No dejes borradores a la vista.
6. Lo que esté en ejes de tipo map también aparece en el mapa de la app como capa temporal (reloj de arena; el usuario la quita con un clic). Si hablas de lugares, muéstralos así.
7. En finish_task explica qué muestra la figura y qué concluyes (cifras, no solo «ver gráfica»).
Puedes enviar varias llamadas de herramientas en un mismo turno (p. ej. plot_figure + 3 artistas + plot_axes + plot_show).`,

  tiempo: `# Series de tiempo
- NDVI mensual promedio de un grupo con su rango:
  data_load {source: "serie_mensual", years: [2025], filters: {municipality: "Calpulalpan"}, as: "s"}
  data_transform {dataset: "s", as: "m", steps: [{group_by: ["date"], aggregate: {ndvi: "mean(ndvi_mean)", p10: "q(ndvi_mean, 0.1)", p90: "q(ndvi_mean, 0.9)", lluvia: "mean(precip_mm)"}}]}
  plot_figure {title: "NDVI y lluvia 2025 · Calpulalpan"}
  plot_bar {dataset: "m", x: "date", y: "lluvia", y_axis: "right", color: "azul", alpha: 0.45, label: "Lluvia (mm)"}
  plot_fill_between {dataset: "m", x: "date", y1: "p90", y2: "p10", color: "verde", label: "P10–P90"}
  plot_line {dataset: "m", x: "date", y: "ndvi", color: "verde", marker: true, label: "NDVI medio"}
  plot_axes {x: {label: "Mes", tickformat: "%b"}, y: {label: "NDVI", lim: [0, 1]}, y2: {label: "Lluvia (mm)"}}
  plot_show
- Comparar años: plot_line con x "month", y "ndvi" y group_by "year" (un color por año); plot_axes x ticks {values: [1..12], labels: ["ene", …]}.
- Muchas parcelas (spaghetti): plot_line group_by "id" con alpha 0.25 y plot_legend show false; encima, la media con plot_line width 3.
- Climograma / estacionalidad circular: ejes polar; plot_bar x = month*30 (grados) o nombres de mes, y = lluvia.`,

  relaciones: `# Relaciones entre variables
- Estimado contra registrado: data_load parcelas; plot_figure; plot_scatter {x: "observed", y: "predicted", color_by: "state", hover: ["id", "municipality"]}; plot_reference {kind: "identity", label: "y = x"}; plot_axes {x: {label: "Registrado (t/ha)"}, y: {label: "Estimado (t/ha)"}, equal_aspect: true}.
- Con ajuste e IC: plot_regression {x, y, fit: "linear" | "poly" (degree) | "lowess", group_by?} devuelve R², pendiente y p; show_equation los pone en la leyenda.
- Una tercera variable: color_by numérica (colormap viridis, colorbar_title con unidad) o size_by.
- Matriz de correlación: stats_correlation {dataset, columns: [...], method: "spearman"} → plot_heatmap {dataset: "correlaciones", x: "var_x", y: "var_y", z: "r", colormap: "rdbu", z_range: [-1, 1], annotate: true}.
- Diagnóstico de regresión: stats_regression (agrega reg_fitted, reg_residual, reg_cooks_d) → plot_scatter x reg_fitted, y reg_residual + plot_reference hline 0; plot_hist de reg_residual; mapa de residuos (ver espacial).
- Muchos puntos superpuestos: plot_hist2d o plot_scatter con alpha 0.3.`,

  distribuciones: `# Distribuciones
- Histograma: plot_hist {x, bins: "auto"}; por grupo superpuesto: group_by + alpha 0.5; density "density" para comparar grupos de distinto tamaño. Marca la media con plot_reference vline.
- Densidad: plot_kde {x, group_by} (más limpio que histogramas superpuestos).
- Por categoría: plot_box {y, x: "state", kind: "box" | "violin" | "strip", points: "all"}; con muchos grupos usa orientation "h".
- Medias con IC: stats_compare_groups {value, group} → plot_bar {dataset: "grupos_<value>", x: "group", y: "mean", error: "ci_high"…} o directamente plot_bar {x: "state", y: "observed", aggregate: "mean", error: "ci95"}. Informa el p de ANOVA / Kruskal–Wallis.
- Ranking: plot_bar {x: "municipality", y: "mae", orientation: "h", sort: "desc", labels: true, label_format: ".2f"}.
- Proporciones (pocas categorías): ejes pie + plot_pie {labels, values}.`,

  mapas: `# Mapas
- Ejes de tipo map: plot_figure {axes_types: ["map"]}.
- Coropleta de parcelas: plot_map {layer: "parcelas", dataset: "p", color_by: "predicted", colormap: "ylgn", colorbar_title: "t/ha"}. Añade contexto: plot_map {layer: "limites", which: "municipios"} y, si ayuda, {layer: "etiquetas", dataset: "mun", text: "region"}.
- Variables con signo (error, residuos): colormap "rdbu_r" con color_mid 0 (rojo = sobreestima).
- Categorías (estado, cluster): color_by texto → leyenda con un color por clase (color_map para fijarlos).
- Puntos/burbujas: {layer: "puntos", size_by: "production_t"}; densidad: {layer: "densidad", weight: "production_t"}.
- Para comparar mapas (p. ej. varios meses o estimado vs registrado) usa la misma color_range en todos; facet {type: "map"} hace small multiples.
- Superficies sobre el mapa: stats_interpolate {dataset, column} → plot_map {layer: "malla", dataset: "malla_<column>", colormap} + {layer: "parcelas"} encima y {layer: "limites"}.
- Notas en el mapa: plot_annotate {ax: <ejes map>, dataset: "p", where: "id == 'AGC_171'", x: "lon", y: "lat", text: "AGC_171\\nmuy bajo"}: queda un marcador con el texto, en la figura y en el mapa de la app.
- basemap: auto / claro / oscuro / satelite / calles / ninguno.
- Al mostrar la figura, cada ejes map se copia al mapa de la app como capa temporal con su leyenda; map_show_figure la vuelve a poner y map_clear_temp_layers las quita.`,

  espacial: `# Autocorrelación espacial (¿las parcelas cercanas se parecen?)
Usa un punto por parcela (dataset de parcelas con lon/lat), nunca la serie mensual.
1. Prueba global y local:
   stats_spatial_autocorrelation {dataset: "p", column: "error", weights: {type: "knn", k: 8}, getis: true}
   → I de Moran (z, p normal y por permutaciones), C de Geary y columnas error_z, error_lag, error_lisa (HH, LL, HL, LH, no significativo), error_hotspot.
2. Figura de 2×2 con mosaic [["moran","lisa"],["vario","corr"]] y axes_types {lisa: "map"}:
   - Diagrama de Moran: plot_scatter {ax: "moran", x: "error_z", y: "error_lag", color_by: "error_lisa"} + plot_regression {ax: "moran", x: "error_z", y: "error_lag", scatter: false} (la pendiente es I) + plot_reference hline 0 y vline 0; plot_axes {ax: "moran", x: {label: "Error estandarizado (z)"}, y: {label: "Rezago espacial de z"}}.
   - Mapa LISA: plot_map {ax: "lisa", layer: "parcelas", dataset: "p", color_by: "error_lisa"} (colores estándar automáticos) + {layer: "limites"}.
   - Variograma: stats_variogram {dataset: "p", column: "error", model: "spherical"} → plot_scatter {ax: "vario", dataset: "variograma_error", x: "lag_km", y: "gamma", size_by: "pairs"} + plot_line {ax: "vario", dataset: "variograma_error_modelo", x: "lag_km", y: "gamma"} + plot_reference hline en sample_variance (label "varianza"). Lee pepita/meseta/alcance práctico.
   - Correlograma: stats_correlogram → plot_line {x: "mid_km", y: "moran_i", marker: true} + plot_reference hline 0 (I esperado ≈ 0); marca bandas con p < 0.05 con plot_scatter where "p < 0.05".
3. Interpreta: I > 0 y p < 0.05 = agrupamiento (el error del modelo tiene estructura espacial: falta una covariable espacial o hay un efecto regional); clusters HH/LL dicen dónde; el alcance del variograma dice hasta qué distancia (km) llega la dependencia.
Otras: superficie continua con stats_interpolate (IDW) → plot_map layer "malla" (sobre el mapa base) o plot_contour {x: "lon", y: "lat", z: "value"} + plot_scatter de las parcelas encima + plot_axes equal_aspect.
Regresión espacial: stats_regression {y, x: [...], spatial: {}} devuelve el I de Moran de los residuos y las pruebas LM-error / LM-lag (y sus formas robustas): si solo LM-error es significativa, el error tiene estructura espacial; si LM-lag, influyen los vecinos; con ambas, decide con las robustas. Mapea los residuos (reg_residual) con colormap "rdbu_r" y color_mid 0.
Variograma: lee fit.warnings; si el alcance supera la distancia analizada no hay meseta (tendencia regional): repite con los residuos de una regresión.
Pesos: knn (k 6–10) es robusto con parcelas agrupadas; distance {km} solo si todas tienen vecinos dentro de esa distancia.`,

  '3d': `# Tres dimensiones (eje z)
- plot_figure {axes_types: ["3d"]}; plot_scatter {x, y, z, color_by}; plot_line {x, y, z}; plot_surface {x, y, z} desde una malla (stats_interpolate) o interpolate "idw".
- plot_axes {x: {label}, y: {label}, z: {label}, view: {elev: 25, azim: -60}, aspect: "cube"}.
- Ejemplo: superficie del NDVI pico sobre lon/lat con la elevación: stats_interpolate {column: "ndvi_peak"} → plot_surface {dataset: "malla_ndvi_peak", x: "lon", y: "lat", z: "value", colormap: "ylgn"}.
- Usa 3D solo si aporta: casi siempre un mapa de color (heatmap/contour) o color_by se lee mejor.`,

  estilo: `# Buenas prácticas
- Título que dice la conclusión o la pregunta; ejes con nombre y unidad («Rendimiento registrado (t/ha)»); fuente en caption.
- Colores: categorías con la paleta (verde, azul, ambar…); secuenciales viridis/ylgn/blues; divergentes (rdbu_r, coolwarm) centrados en 0 para errores/residuos; LISA estándar.
- No uses 3D, pastel con muchas categorías ni doble eje y si confunde; prefiere facetas.
- Mismas escalas (share_y, color_range) al comparar paneles.
- Barras desde 0; para cambios pequeños usa puntos o líneas.
- Señala lo importante con plot_annotate (arrow) o plot_reference (umbral, media, punto de equilibrio).
- Leyenda: cada ejes tiene la suya ("top" por defecto, se acomoda en filas dentro de sus ejes; "bottom", "right", esquinas internas o "best"); en facetas hay una sola para toda la figura. group_labels renombra categorías ({"training": "Con rendimiento"}).
- Ejes compartidos (share_x/share_y) muestran etiquetas solo en los paneles exteriores, como matplotlib.
- Valores con signo menos se escriben con «−»; las fechas salen en español.
- Fechas: x "date" (AAAA-MM-01) con tickformat "%b %Y".
- Revisa el PNG que devuelve plot_show antes de responder.`,
};
