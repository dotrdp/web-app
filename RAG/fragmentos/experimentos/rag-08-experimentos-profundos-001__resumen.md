@id: rag-08-experimentos-profundos-001
@documento: rag-08-experimentos-profundos | temas/08_experimentos_modelos_profundos_y_fundacionales.md
@categoria: experimentos
@titulo: Resumen
@titulo_documento: Modelos profundos, fundacionales y de proceso: literatura y nuestros experimentos con validación cruzada
@etiquetas: estimación de rendimiento; cebada maltera; validación cruzada; MMST-ViT; redes profundas; modelos fundacionales; modelos de cultivo; pocas etiquetas; techo de información; Prithvi; TabPFN
@claves: estimacion de rendimiento cebada maltera validacion cruzada mmst-vit redes profundas modelos fundacionales modelos de cultivo pocas etiquetas techo de informacion prithvi tabpfn experimentos modelos parcelas proceso resumen alcanzo arbitrada bajo calibracion cebada clima configuracion confusion consideran cruzada datos describe distintos enfasis escasos esos establecio estimar etiquetadas etiquetas
@fuente: [mmst-vit__README.md, mmst-vit__docs__model_selection_20261006.md, mmst-vit__docs__yield_information_identifiability_20261007.md, mmst-vit__outputs__transfer_iteration_20261007__research__information_ceiling_audit_20261007.md, model__README.md, prithvi-yield__README.md,
# Resumen

Este fragmento describe las familias de modelos profundos, fundacionales y de proceso que se consideran para estimar el rendimiento de cebada maltera de temporal, resume lo que reporta la literatura arbitrada sobre cada una (con énfasis en pocas etiquetas) y reúne nuestros experimentos. Solo se presentan resultados de
validación cruzada de 5 pliegues sobre las 138 parcelas etiquetadas. En esos experimentos, el MAE más bajo de MMST-ViT fue 0.3226 t/ha, frente a 0.3342 t/ha de la configuración pareada, y el objetivo de 0.100 t/ha no se alcanzó. Ningún experimento estableció un techo de información. Las lecciones principales son que
los datos son escasos, que el clima grueso produce confusión entre parcelas con rendimientos distintos, y que los modelos de proceso necesitan calibración local.
