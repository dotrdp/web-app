@id: rag-10-validacion-037
@documento: rag-10-validacion | temas/10_validacion_fugas_y_muestras_pequenas.md
@categoria: validacion
@titulo: Ablaciones e interpretación de importancia
@titulo_documento: Validación, fugas de información y muestras pequeñas en el Reto AgroCebada
@etiquetas: validación cruzada; fuga de información; muestras pequeñas; ruido de etiquetas; redondeo de rendimientos; bootstrap; intervalos de confianza; rmse; sesgo de selección; validación espacial; heaping
@claves: validacion cruzada fuga de informacion muestras pequenas ruido de etiquetas redondeo de rendimientos bootstrap intervalos de confianza rmse sesgo de seleccion validacion espacial heaping importancia particiones ablacion ablaciones clima diferencia ejemplo familia interpretacion mismas parcelas reportar validacion agrupada alta aporta ausencia bajo bandas cambia causalidad cero climatico colinealidad compara
@fuente: validacion/literature_review__report__sections__06_validacion.typ.txt
# Ablaciones e interpretación de importancia

(Literatura y definición) Una ablación compara modelos que difieren en un componente definido, evaluados sobre las mismas particiones externas. La importancia por permutación agrupada y su estabilidad entre particiones son más informativas que un ranking único, porque la colinealidad (NDVI y bandas NIR, por ejemplo)
hace que permutar una variable subestime su utilidad.

(Límites) Una importancia alta no es causalidad. SHAP describe el comportamiento del modelo, no una intervención. Si el clima aporta poco tras incluir vegetación, eso indica contribución incremental bajo esa representación, no ausencia de mecanismo climático.

(Ejemplo de lectura) Una ablación que retire la familia óptica y conserve clima y relieve debe reportar su diferencia de RMSE con el mismo error estándar y las mismas particiones que cualquier otra comparación. Si la diferencia es de unas milésimas, la conclusión correcta es que la familia no se puede distinguir de
cero con 138 parcelas.

(Recomendación) Reportar intervalos de variación de la importancia entre particiones y ejemplos de parcelas donde la explicación cambia. Si el orden es inestable, esa inestabilidad es el resultado.

Fuente: validacion/literature_review__report__sections__06_validacion.typ.txt
