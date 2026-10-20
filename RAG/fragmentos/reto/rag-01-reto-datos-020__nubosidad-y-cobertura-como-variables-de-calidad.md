@id: rag-01-reto-datos-020
@documento: rag-01-reto-datos | temas/01_reto_agrocebada_y_datos.md
@categoria: reto
@titulo: Nubosidad y cobertura como variables de calidad
@titulo_documento: Reto AgroCebada 2026: bases, dataset y fuentes del proyecto
@etiquetas: reto agrocebada; fira 2026; rendimiento cebada; hidalgo puebla tlaxcala; dataset parcelas; sentinel-2; planet; chirps; chirts-era5; topografia cem
@claves: reto agrocebada fira 2026 rendimiento cebada hidalgo puebla tlaxcala dataset parcelas sentinel-2 planet chirps chirts-era5 topografia cem calidad nubosidad cobertura faltantes proyecto criterio criterios datos diccionario filtrado fira fraccion nubes parcela valida variables area audit auditorias bases ceros conviene cosas deben decisiones
@fuente: Diccionario_de_indices_satelitales.txt (nubosidad como calidad); modelado__ORIGINAL_FIRA_AUDIT.md (criterios de cobertura del proyecto).
# Nubosidad y cobertura como variables de calidad

Las bases entregan el porcentaje de nubosidad para que cada equipo defina su criterio de filtrado y de datos faltantes. El diccionario lo trata como variable de calidad y no como índice. En el proyecto se distinguen dos cosas: la fracción de nubes de una escena y la fracción del polígono de la parcela con observación
válida. Un criterio usado en las auditorías es exigir, para Sentinel-2, al menos 50 % de área válida de la parcela, y para Planet y Landsat, el filtrado de nubes entregado de 0 a 30 %. Esos criterios son decisiones del proyecto, no de FIRA. Los datos faltantes deben seguir faltantes; no conviene rellenarlos con ceros
ni con interpolación sin declararla.

Fuente: Diccionario_de_indices_satelitales.txt (nubosidad como calidad); modelado__ORIGINAL_FIRA_AUDIT.md (criterios de cobertura del proyecto).
