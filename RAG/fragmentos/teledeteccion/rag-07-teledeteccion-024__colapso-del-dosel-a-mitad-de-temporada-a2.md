@id: rag-07-teledeteccion-024
@documento: rag-07-teledeteccion | temas/07_teledeteccion_y_fenologia.md
@categoria: teledeteccion
@titulo: Colapso del dosel a mitad de temporada (A2)
@titulo_documento: Teledetección y fenología satelital para la cebada de temporal en el Altiplano
@etiquetas: teledeteccion; sentinel-2; fenologia satelital; ndvi; red-edge; resolucion espacial; nubosidad; curvas sigmoides; cebada; cobertura de espiga; ventana critica; calibracion entre sensores
@claves: teledeteccion sentinel-2 fenologia satelital ndvi red-edge resolucion espacial nubosidad curvas sigmoides cebada cobertura de espiga ventana critica calibracion entre sensores dosel parcelas caida colapso change desde docs dynamic julio mediana mitad phenocurve planet temporada abril agosto ajustar ajuste confirma control cosecha cultivo debajo
@fuente: dynamic_change__phenocurve__docs__A2_rededge.md; dynamic_change__phenocurve__docs__F1_fits.md
# Colapso del dosel a mitad de temporada (A2)

En 30 de 197 parcelas, el NDVI de Sentinel-2 cae 0.30 o más por debajo de un máximo previo de al menos 0.50 y después se recupera. El colapso empieza entre el 14 de julio y el 3 de agosto de 2025. Planet confirma la caída en 28 de las 30 parcelas (caída mediana de 0.30), frente a 6 de 114 parcelas de control (caída
mediana de 0). Por eso el dosel de junio y julio probablemente no es la cebada que se cosecha: puede ser maleza o un cultivo destruido y resembrado. Un ajuste desde abril mezcla los dos dosel. La solución en el pipeline es ajustar sólo desde el último mínimo (ventana final), lo que sube R² de 0.879 a 0.958 en 36
parcelas multi-dosel con Planet NDVI.

Fuente: dynamic_change__phenocurve__docs__A2_rededge.md; dynamic_change__phenocurve__docs__F1_fits.md
