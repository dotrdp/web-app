@id: rag-06-plagas-danos-027
@documento: rag-06-plagas-danos | temas/06_plagas_enfermedades_y_deteccion_de_danos.md
@categoria: plagas
@titulo: Parcela vs píxel de 30 m: el límite físico
@titulo_documento: Plagas, enfermedades y detección de daños en cebada de temporal con satélite
@etiquetas: plagas; enfermedades; cebada; valles altos; detección de daño; ndvi; anomalía; teledetección; malezas; roya
@claves: plagas enfermedades cebada valles altos deteccion de dano ndvi anomalia teledeteccion malezas roya parcela pixeles mediana pixel detecta fisico limite parches research tamano algodon ancho apenas borde calcularon celdas confirmado cuadrada cubre damage dano detection escala grandes iterate
@fuente: `segmentation_pests_ndvi_water__research__prior_work.md` (§2, §5, §7); `iterate_20261017__research__B1_damage_detection.md` (§2.1).
# Parcela vs píxel de 30 m: el límite físico

Las parcelas del reto tienen 0.35 a 64 ha, con mediana de 5.5 ha (P10 1.49 ha, P90 11.92 ha). Un píxel HLS de 30 m cubre 900 m², así que la mediana tiene unos 61 píxeles y la parcela más pequeña unos 4. Muchos píxeles de borde son mixtos. En B1 se calcularon celdas puras por tamaño: 4 píxeles en 0.4 ha, 11 en 1 ha y 40
en 3.6 ha. Un parche de 14 × 14 píxeles (tamaño no confirmado en Szwarcman et al., 2024) mide 420 m, más ancho que una parcela mediana cuadrada de 5.5 ha (unos 234 m de lado). Song et al. (2017) mostraron que Sentinel-2 a 10 m apenas detecta parches de pudrición de raíz de algodón de unos 100 m², con omisiones de
16.6–19.7 % y sobreestimación de
31–37 % (no verificado en la ronda 2). Por tanto, a 30 m sólo se detecta daño de escala de parcela o de parches grandes.

Fuente: `segmentation_pests_ndvi_water__research__prior_work.md` (§2, §5, §7); `iterate_20261017__research__B1_damage_detection.md` (§2.1).
