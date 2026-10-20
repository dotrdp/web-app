@id: rag-08-experimentos-profundos-022
@documento: rag-08-experimentos-profundos | temas/08_experimentos_modelos_profundos_y_fundacionales.md
@categoria: experimentos
@titulo: Nuestros experimentos: búsqueda de arquitectura de MMST-ViT
@titulo_documento: Modelos profundos, fundacionales y de proceso: literatura y nuestros experimentos con validación cruzada
@etiquetas: estimación de rendimiento; cebada maltera; validación cruzada; MMST-ViT; redes profundas; modelos fundacionales; modelos de cultivo; pocas etiquetas; techo de información; Prithvi; TabPFN
@claves: estimacion de rendimiento cebada maltera validacion cruzada mmst-vit redes profundas modelos fundacionales modelos de cultivo pocas etiquetas techo de informacion prithvi tabpfn arquitectura busqueda experimentos nuestros atencion cruzada parcelas pliegue validacion agrocebada alcanzo apilamiento bajo cebada cero clima conclusion concluyente confianza configuracion demostrar diferencia distribuciones entrenamiento
@fuente: Proyecto FIRA 2026 «Reto AgroCebada», iteración de arquitectura del 7 de octubre de 2026 (mmst-vit README y registros de validación cruzada).
# Nuestros experimentos: búsqueda de arquitectura de MMST-ViT

Nuestros experimentos evaluaron MMST-ViT con validación cruzada de 5 pliegues sobre las 138 parcelas etiquetadas, con 28 o 27 parcelas en cada pliegue. Cada parcela se predijo una vez fuera de su pliegue de entrenamiento. El MAE más bajo medido fue 0.3226 t/ha, frente a 0.3342 t/ha de la configuración pareada. El
intervalo de confianza de la diferencia incluye cero, así que la mejora no es concluyente. Otras variantes (pérdida con atención, distribuciones de salida, atención geográfica, historia oficial de clima de cebada y apilamiento) no superaron 0.3226 t/ha.

El objetivo de 0.100 t/ha (100 kg/ha) no se alcanzó. Tampoco se logró demostrar un techo de información. Conclusión: la búsqueda de arquitectura no redujo el error de forma sustancial.

Fuente: Proyecto FIRA 2026 «Reto AgroCebada», iteración de arquitectura del 7 de octubre de 2026 (mmst-vit README y registros de validación cruzada).
