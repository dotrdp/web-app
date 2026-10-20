@id: rag-08-experimentos-profundos-027
@documento: rag-08-experimentos-profundos | temas/08_experimentos_modelos_profundos_y_fundacionales.md
@categoria: experimentos
@titulo: Nuestros experimentos: datos HLS y Landsat preparados
@titulo_documento: Modelos profundos, fundacionales y de proceso: literatura y nuestros experimentos con validación cruzada
@etiquetas: estimación de rendimiento; cebada maltera; validación cruzada; MMST-ViT; redes profundas; modelos fundacionales; modelos de cultivo; pocas etiquetas; techo de información; Prithvi; TabPFN
@claves: estimacion de rendimiento cebada maltera validacion cruzada mmst-vit redes profundas modelos fundacionales modelos de cultivo pocas etiquetas techo de informacion prithvi tabpfn datos landsat experimentos preparados superficial temperatura modelos nuestros parcela parcelas septiembre tienen absoluta agrocebada altura aportan approach archivos biomasa calculo considerarse contra debe diferencia documentacion
@fuente: Proyecto FIRA 2026 «Reto AgroCebada», documentación de datos HLS y Landsat (tabular-vit_approach).
# Nuestros experimentos: datos HLS y Landsat preparados

Los datos satelitales preparados incluyen 1,198 escenas HLS v2.0 (666 de Landsat 8/9 L30 y 532 de Sentinel-2 S30) de enero de 2022 a octubre de 2025, para las 197 parcelas. Cada parcela tiene una ventana de 224 x 224 px a 30 m. La temperatura superficial de Landsat se calculó por parcela con reglas de píxel y se
verificó contra valores previos: 17,310 observaciones parcela-escena, con diferencia media absoluta de 0.0008 °C.

En 2025, 130 de las 197 parcelas no tienen ninguna escena observada en septiembre, y 29 no tienen en junio. Esto limita el uso de temperatura superficial de septiembre y debe considerarse en los modelos. Estos archivos son datos; no aportan ningún RMSE. Los modelos Granite de temperatura superficial, biomasa y altura
de dosel se prepararon pero no se usaron en los experimentos de modelado.

Fuente: Proyecto FIRA 2026 «Reto AgroCebada», documentación de datos HLS y Landsat (tabular-vit_approach).
