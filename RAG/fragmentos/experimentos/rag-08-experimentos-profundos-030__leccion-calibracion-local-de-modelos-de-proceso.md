@id: rag-08-experimentos-profundos-030
@documento: rag-08-experimentos-profundos | temas/08_experimentos_modelos_profundos_y_fundacionales.md
@categoria: experimentos
@titulo: Lección: calibración local de modelos de proceso
@titulo_documento: Modelos profundos, fundacionales y de proceso: literatura y nuestros experimentos con validación cruzada
@etiquetas: estimación de rendimiento; cebada maltera; validación cruzada; MMST-ViT; redes profundas; modelos fundacionales; modelos de cultivo; pocas etiquetas; techo de información; Prithvi; TabPFN
@claves: estimacion de rendimiento cebada maltera validacion cruzada mmst-vit redes profundas modelos fundacionales modelos de cultivo pocas etiquetas techo de informacion prithvi tabpfn calibracion datos modelos ceres-barley local proceso fenologia iran leccion manejo necesitan pest potencial referencia rendimiento adicionales agricultural apsim basada campo caracteristicas dataset directa directos disponibles
@fuente: de Wit, A. et al. (2019). Agricultural Systems 168:154-167; calibración de CERES-Barley con PEST en Irán (referencia de revista no verificada en esta sesión).
# Lección: calibración local de modelos de proceso

WOFOST, DSSAT (con CERES-Barley) y APSIM necesitan calibración con datos locales de fenología, rendimiento potencial y manejo. De Wit et al. (2019) recomiendan calibración espacial cuando los datos de campo son limitados. La calibración de CERES-Barley en Irán con PEST logró errores de 5.5% a 10.9% en grano y paja.
Nuestro dataset no incluye las variables de manejo y fenología que estos modelos necesitan, así que una calibración local directa no es posible sin datos adicionales.

Por eso, los modelos de proceso son más útiles como referencia o como generadores de características (por ejemplo, rendimiento potencial simulado) que como predictores directos. Esta es una recomendación basada en la literatura y en los datos disponibles, no un resultado de nuestros experimentos.

Fuente: de Wit, A. et al. (2019). Agricultural Systems 168:154-167; calibración de CERES-Barley con PEST en Irán (referencia de revista no verificada en esta sesión).
