@id: rag-06-plagas-danos-042
@documento: rag-06-plagas-danos | temas/06_plagas_enfermedades_y_deteccion_de_danos.md
@categoria: plagas
@titulo: La herramienta de segmentación de la aplicación web
@titulo_documento: Plagas, enfermedades y detección de daños en cebada de temporal con satélite
@etiquetas: plagas; enfermedades; cebada; valles altos; detección de daño; ndvi; anomalía; teledetección; malezas; roya
@claves: plagas enfermedades cebada valles altos deteccion de dano ndvi anomalia teledeteccion malezas roya aplicacion herramienta incluye segmentacion webapp actualizacion agua ajusta alertas antes aproximados asistida calculan campo candidatos celdas composiciones confirmados contornos cultivo danos delimitacion delineation detecta diagnosticos
@fuente: `webapp__README.md` (Interface; Scientific products and delineation); `webapp__PLAN.md` (§4).
# La herramienta de segmentación de la aplicación web

La aplicación web del proyecto incluye una herramienta de delimitación asistida. Usa SAM 2.1 tiny (modelo fijo y pinneado, sin entrenamiento ni actualización de pesos) sobre composiciones RGB de Sentinel-2 L2A a 10 m, con puntos de inclusión y exclusión. El usuario revisa la propuesta, ajusta vértices y la guarda de
forma explícita. Las propuestas se mantienen separadas de las parcelas guardadas. El agua se muestra como **candidatos**, no como límites confirmados, y los contornos son aproximados a 10 m. La versión no incluye alertas, diagnósticos de cultivo, visitas de campo ni predicción en la nube, y no detecta plagas ni daños.
Los índices (NDVI y MNDWI) se calculan antes del remuestreo y las celdas sin observación quedan transparentes sin interpolación.

Fuente: `webapp__README.md` (Interface; Scientific products and delineation); `webapp__PLAN.md` (§4).
