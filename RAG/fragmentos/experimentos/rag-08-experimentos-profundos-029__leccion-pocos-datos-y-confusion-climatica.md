@id: rag-08-experimentos-profundos-029
@documento: rag-08-experimentos-profundos | temas/08_experimentos_modelos_profundos_y_fundacionales.md
@categoria: experimentos
@titulo: Lección: pocos datos y confusión climática
@titulo_documento: Modelos profundos, fundacionales y de proceso: literatura y nuestros experimentos con validación cruzada
@etiquetas: estimación de rendimiento; cebada maltera; validación cruzada; MMST-ViT; redes profundas; modelos fundacionales; modelos de cultivo; pocas etiquetas; techo de información; Prithvi; TabPFN
@claves: estimacion de rendimiento cebada maltera validacion cruzada mmst-vit redes profundas modelos fundacionales modelos de cultivo pocas etiquetas techo de informacion prithvi tabpfn clima confusion etiquetas modelos base climatica cruzada datos frente leccion literatura mejora municipal nuestros parcelas pero pocas pocos recomendacion validacion apunta asigna ayudan cebada citada
@fuente: Síntesis de la literatura citada en este documento y de nuestros resultados de validación cruzada (recomendación, no resultado publicado).
# Lección: pocos datos y confusión climática

Con 138 parcelas de una sola temporada, las comparaciones de modelos son relativas. Por ejemplo, la CNN temporal (MAE 0.4422 t/ha) y la línea base de media (MAE 0.7592 t/ha) están separadas por más de 0.3 t/ha, pero la mejora de MMST-ViT frente a su configuración pareada (0.3226 frente a 0.3342 t/ha) no es concluyente.
Nuestro registro de identificabilidad muestra que el clima grueso (462 valores de clima y cobertura) asigna 43 vectores distintos a las 138 etiquetas, con grupos en conflicto, lo que apunta a confusión por clima más que a una relación municipal demostrada; el efecto municipal no se midió en nuestros experimentos.

La literatura de pocas etiquetas (TabPFN, Presto, modelos fundacionales) indica que los modelos preentrenados ayudan cuando hay pocas etiquetas, pero no garantizan mejora en cebada. Nuestra recomendación es usar validación cruzada por parcelas completas, comparar con líneas base sencillas y reportar intervalos de la
diferencia.

Fuente: Síntesis de la literatura citada en este documento y de nuestros resultados de validación cruzada (recomendación, no resultado publicado).
