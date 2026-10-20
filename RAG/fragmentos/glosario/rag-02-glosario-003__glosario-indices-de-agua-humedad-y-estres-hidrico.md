@id: rag-02-glosario-003
@documento: rag-02-glosario | temas/02_glosario_terminos_es.md
@categoria: glosario
@titulo: Glosario: índices de agua, humedad y estrés hídrico
@titulo_documento: Glosario del Reto AgroCebada (agronomía, teledetección, clima, estadística y aprendizaje automático)
@etiquetas: glosario; cebada maltera; temporal; fenología de la cebada; zadoks; índices de vegetación; rmse; validación cruzada; fuga de información; regionalismos
@claves: glosario cebada maltera temporal fenologia de la cebada zadoks indices de vegetacion rmse validacion cruzada fuga de informacion regionalismos index estres humedad hidrico indices agua difference enhanced indice normalized diccionario stress variante bandas basico caracterizar dataset drought landsat moisture vegetacion water advierte ampliar
@fuente: reto_y_datos/Diccionario_de_indices_satelitales.txt
# Glosario: índices de agua, humedad y estrés hídrico

Contexto: índices del Dataset Básico (Sentinel-2), salvo que se indique otra cosa. Sirven para caracterizar estrés hídrico durante la temporada, y su lectura depende de la fecha y de la fase del cultivo. El diccionario advierte que no existen umbrales universales válidos para todas las parcelas, fechas y etapas.

- **NDWI (Normalized Difference Water Index)**: índice relacionado con agua o humedad a partir del contraste entre bandas.
- **ENDWI (Enhanced Normalized Difference Water Index)**: variante "enhanced" del índice anterior.
- **MSI (Moisture Stress Index; índice de estrés por humedad)**: sensible al contenido de agua de la vegetación y al estrés hídrico.
- **EMSI (Enhanced Moisture Stress Index)**: variante orientada a ampliar la sensibilidad a cambios de humedad.
- **DSWI2, DSWI3, DSWI4 y DSWI5 (Disease-Water Stress Index)**: familia de índices con distintas combinaciones de bandas. El nombre contiene "disease", pero el diccionario los describe como indicadores de estrés hídrico y condición vegetal; **no deben leerse como detección de enfermedades**.
- **NDDI (Normalized Difference Drought Index)**: integra vegetación y humedad para caracterizar sequedad.
- **ENDDI (Enhanced Normalized Difference Drought Index)**: variante que incorpora una señal hídrica complementaria.
- **VI6T**: índice espectral-térmico de Landsat que combina una banda espectral con información térmica de superficie. Es la única variable de Landsat en el Dataset Básico.

Fuente: reto_y_datos/Diccionario_de_indices_satelitales.txt
