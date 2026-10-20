#!/usr/bin/env python3
"""Servidor MCP (stdio) del RAG AgroCebada: búsqueda en el RAG y consulta de datos de solo lectura.

Solo usa la biblioteca estándar. Ejecución: python3 -I mcp/servidor_agrocebada.py
Variables de entorno opcionales:
  AGROCEBADA_RAG    raíz del RAG (por defecto, el directorio padre de este archivo)
  AGROCEBADA_TGREP  ruta al binario tgrep (por defecto, «tgrep» en el PATH; si no existe, búsqueda en Python)
"""
import json, os, re, shutil, sqlite3, subprocess, sys, time

RAG = os.path.abspath(os.environ.get('AGROCEBADA_RAG') or os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
DB = os.path.join(RAG, 'datos', 'agrocebada.sqlite')
TGREP = os.environ.get('AGROCEBADA_TGREP') or shutil.which('tgrep')
MAX_TEXTO = 24000          # caracteres por respuesta
MAX_FILAS = 500
TIEMPO_SQL = 10.0          # segundos
PROTOCOLO = '2025-06-18'
AMBITOS = {'indices': 'indices/**', 'temas': 'temas/**', 'fragmentos': 'fragmentos/**', 'todo': None}
FUENTES_SERIE = {'basico': 'obs_basico', 'pro': 'obs_pro', 'hls': 'hls_2025'}

INSTRUCCIONES = (
    'Herramientas del RAG AgroCebada (cebada maltera de temporal en Hidalgo, Puebla y Tlaxcala). '
    'Para hechos, definiciones y veredictos usa rag_buscar (primero ambito «indices») y cita el @id con rag_leer_fragmento. '
    'Para cifras de parcelas, índices satelitales, clima, AlphaEarth o SIAP usa las herramientas datos_*; '
    'empieza por datos_listar_tablas y datos_describir_tabla antes de escribir SQL. '
    'Las 59 parcelas de PREDICCION no tienen rendimiento (NULL). Todo es de solo lectura.')

TOOLS = [
    {'name': 'rag_buscar',
     'description': 'Busca un patrón regex en el RAG con tgrep. Devuelve líneas con ruta y número de línea. '
                    'Ámbito «indices» (por defecto) busca en glosario, preguntas, errores y fragmentos.tsv; «temas» en los documentos completos. '
                    'Si no hay resultados, prueba sin acentos o con un patrón más corto.',
     'inputSchema': {'type': 'object', 'properties': {
         'patron': {'type': 'string', 'description': 'Expresión regular, p. ej. "amplitud t[eé]rmica"'},
         'ambito': {'type': 'string', 'enum': list(AMBITOS), 'default': 'indices'},
         'contexto': {'type': 'integer', 'minimum': 0, 'maximum': 5, 'default': 0, 'description': 'Líneas de contexto'},
         'max_lineas': {'type': 'integer', 'minimum': 1, 'maximum': 200, 'default': 40}},
         'required': ['patron'], 'additionalProperties': False}},
    {'name': 'rag_leer_fragmento',
     'description': 'Devuelve el texto completo de un fragmento del RAG por su @id (p. ej. «rag-06-plagas-danos-062»), con su fuente.',
     'inputSchema': {'type': 'object', 'properties': {'id': {'type': 'string'}}, 'required': ['id'], 'additionalProperties': False}},
    {'name': 'datos_listar_tablas',
     'description': 'Lista las tablas de datos (oficiales del reto y obtenidas por el proyecto) con descripción, fuente, cobertura, advertencias y número de filas.',
     'inputSchema': {'type': 'object', 'properties': {}, 'additionalProperties': False}},
    {'name': 'datos_describir_tabla',
     'description': 'Describe una tabla: columnas con tipo y significado, advertencias y filas de ejemplo. Úsala antes de escribir SQL.',
     'inputSchema': {'type': 'object', 'properties': {
         'tabla': {'type': 'string'},
         'filas_ejemplo': {'type': 'integer', 'minimum': 0, 'maximum': 10, 'default': 3}},
         'required': ['tabla'], 'additionalProperties': False}},
    {'name': 'datos_consultar_sql',
     'description': 'Ejecuta una consulta SQLite de solo lectura (SELECT o WITH) y devuelve una tabla. '
                    f'Máximo {MAX_FILAS} filas y {int(TIEMPO_SQL)} s. Agrega con GROUP BY en lugar de pedir filas crudas.',
     'inputSchema': {'type': 'object', 'properties': {
         'sql': {'type': 'string'},
         'limite': {'type': 'integer', 'minimum': 1, 'maximum': MAX_FILAS, 'default': 100}},
         'required': ['sql'], 'additionalProperties': False}},
    {'name': 'datos_parcela',
     'description': 'Ficha de una parcela: atributos, rendimiento (si es de ENTRENAMIENTO), terreno, clima de la temporada 2025, '
                    'observaciones satelitales disponibles y rendimiento municipal del SIAP.',
     'inputSchema': {'type': 'object', 'properties': {'id_poligono': {'type': 'string', 'description': 'AGC_001 a AGC_197'}},
                     'required': ['id_poligono'], 'additionalProperties': False}},
    {'name': 'datos_serie_temporal',
     'description': 'Serie temporal de una variable para una parcela. fuente «basico» (Sentinel-2/Landsat), «pro» (Planet) o «hls» (bandas HLS 2025). '
                    'Ejemplos de variable: ndvi_promedio, evi_promedio, lai_promedio (basico, pro); nir, rojo (hls).',
     'inputSchema': {'type': 'object', 'properties': {
         'id_poligono': {'type': 'string'},
         'variable': {'type': 'string'},
         'fuente': {'type': 'string', 'enum': list(FUENTES_SERIE), 'default': 'basico'},
         'desde': {'type': 'string', 'description': 'aaaa-mm-dd (opcional)'},
         'hasta': {'type': 'string', 'description': 'aaaa-mm-dd (opcional)'},
         'nubosidad_max': {'type': 'number', 'description': 'Porcentaje máximo de nubosidad (basico y pro; opcional)'}},
         'required': ['id_poligono', 'variable'], 'additionalProperties': False}},
]


class ErrorHerramienta(Exception):
    pass


def conectar():
    if not os.path.exists(DB):
        raise ErrorHerramienta(f'No se encontró la base de datos en {DB}')
    con = sqlite3.connect(f'file:{DB}?mode=ro', uri=True, check_same_thread=False)
    con.execute('PRAGMA query_only = ON')
    permitidas = {sqlite3.SQLITE_SELECT, sqlite3.SQLITE_READ, sqlite3.SQLITE_FUNCTION, getattr(sqlite3, 'SQLITE_RECURSIVE', 33)}
    def autorizar(accion, arg1, *_):
        if accion in permitidas or (accion == sqlite3.SQLITE_PRAGMA and arg1 == 'table_info'):
            return sqlite3.SQLITE_OK
        return sqlite3.SQLITE_DENY
    con.set_authorizer(autorizar)
    return con


def tabla_md(cols, filas):
    def celda(v):
        if v is None:
            return 'NULL'
        if isinstance(v, float):
            v = f'{v:.6g}'
        return str(v).replace('|', '\\|').replace('\n', ' ')[:300]
    out = ['| ' + ' | '.join(cols) + ' |', '|' + '---|' * len(cols)]
    out += ['| ' + ' | '.join(celda(v) for v in f) + ' |' for f in filas]
    return '\n'.join(out)


def consultar(sql, params=(), limite=MAX_FILAS):
    con = conectar()
    fin = time.monotonic() + TIEMPO_SQL
    con.set_progress_handler(lambda: 1 if time.monotonic() > fin else 0, 10000)
    try:
        cur = con.execute(sql, params)
        cols = [d[0] for d in cur.description or []]
        filas = cur.fetchmany(limite + 1)
    except sqlite3.DatabaseError as e:
        msg = str(e)
        if 'interrupted' in msg:
            msg = f'la consulta excedió {TIEMPO_SQL:.0f} s; agrega filtros o agrega con GROUP BY'
        elif 'not authorized' in msg:
            msg = 'solo se permiten consultas de lectura (SELECT o WITH)'
        raise ErrorHerramienta(f'Error de SQL: {msg}')
    finally:
        con.close()
    return cols, filas[:limite], len(filas) > limite


def rag_buscar(patron, ambito='indices', contexto=0, max_lineas=40):
    if ambito not in AMBITOS:
        raise ErrorHerramienta(f'ambito debe ser uno de {list(AMBITOS)}')
    glob = AMBITOS[ambito]
    lineas = []
    if TGREP:
        cmd = [TGREP, '-i', '-n'] + (['-C', str(contexto)] if contexto else []) + (['-g', glob] if glob else []) + ['--', patron, '.']
        r = subprocess.run(cmd, cwd=RAG, capture_output=True, text=True, timeout=30)
        if r.returncode not in (0, 1):
            raise ErrorHerramienta(f'tgrep falló: {r.stderr.strip()[:500]}')
        lineas = r.stdout.splitlines()
    else:
        try:
            rx = re.compile(patron, re.I)
        except re.error as e:
            raise ErrorHerramienta(f'Regex inválida: {e}')
        bases = [glob.split('/')[0]] if glob else ['indices', 'temas', 'fragmentos', 'AGENTS.md']
        for b in bases:
            for raiz, _, archivos in os.walk(os.path.join(RAG, b)) if os.path.isdir(os.path.join(RAG, b)) else [(RAG, [], [b])]:
                for fn in sorted(archivos):
                    p = os.path.join(raiz, fn)
                    if not fn.endswith(('.md', '.tsv')):
                        continue
                    for i, l in enumerate(open(p, encoding='utf-8'), 1):
                        if rx.search(l):
                            lineas.append(f'./{os.path.relpath(p, RAG)}:{i}:{l.rstrip()}')
    if not lineas:
        return f'Sin resultados para «{patron}» en {ambito}. Prueba sin acentos, con menos palabras o con ambito «todo».'
    extra = len(lineas) - max_lineas
    texto = '\n'.join(lineas[:max_lineas])
    if extra > 0:
        texto += f'\n… {extra} líneas más; acota el patrón o el ámbito.'
    return texto


def rag_leer_fragmento(id):
    if not re.fullmatch(r'[a-z0-9-]+', id):
        raise ErrorHerramienta('id inválido; usa el formato rag-NN-tema-NNN')
    base = os.path.join(RAG, 'fragmentos')
    for raiz, _, archivos in os.walk(base):
        for fn in archivos:
            if fn.startswith(id + '__'):
                return open(os.path.join(raiz, fn), encoding='utf-8').read()
    raise ErrorHerramienta(f'No existe el fragmento {id}; búscalo con rag_buscar en indices/fragmentos.tsv')


def datos_listar_tablas():
    cols, filas, _ = consultar('SELECT tabla, filas, columnas, descripcion, cobertura, advertencias FROM catalogo_tablas')
    return tabla_md(cols, filas)


def tablas_validas():
    _, filas, _ = consultar("SELECT name FROM sqlite_master WHERE type = 'table'")
    return {f[0] for f in filas}


def datos_describir_tabla(tabla, filas_ejemplo=3):
    if tabla not in tablas_validas():
        raise ErrorHerramienta(f'Tabla desconocida: {tabla}. Usa datos_listar_tablas.')
    _, info, _ = consultar(f'SELECT name, type FROM pragma_table_info(?)', (tabla,))
    _, desc, _ = consultar('SELECT columna, descripcion FROM diccionario_columnas WHERE tabla = ?', (tabla,))
    _, cat, _ = consultar('SELECT descripcion, fuente, cobertura, advertencias, filas FROM catalogo_tablas WHERE tabla = ?', (tabla,))
    d = dict(desc)
    partes = []
    if cat:
        c = cat[0]
        partes.append(f'{tabla}: {c[0]}\nFuente: {c[1]}\nCobertura: {c[2]}\nAdvertencias: {c[3]}\nFilas: {c[4]}')
    filas, emb = [], [n for n, _ in info if re.fullmatch(r'a\d\d', n)]
    for n, t in info:
        if n in emb[1:]:
            continue
        nombre = f'{emb[0]} … {emb[-1]}' if emb and n == emb[0] else n
        filas.append((nombre, t, 'Dimensiones del embedding (adimensionales; sin significado físico individual)' if emb and n == emb[0] else d.get(n, '')))
    partes.append(tabla_md(['columna', 'tipo', 'descripción'], filas))
    if filas_ejemplo:
        sel = ', '.join(f'"{n}"' for n, _ in info if n not in emb[3:] and n != 'geometria_wkt' and n != 'texto')
        cols, ej, _ = consultar(f'SELECT {sel} FROM "{tabla}" LIMIT ?', (filas_ejemplo,))
        partes.append('Ejemplo:\n' + tabla_md(cols, ej))
    return '\n\n'.join(partes)


def datos_consultar_sql(sql, limite=100):
    if not re.match(r'\s*(--[^\n]*\n\s*)*(select|with)\b', sql, re.I):
        raise ErrorHerramienta('Solo se permiten consultas SELECT o WITH.')
    cols, filas, mas = consultar(sql, limite=min(int(limite), MAX_FILAS))
    texto = tabla_md(cols, filas) + f'\n\n{len(filas)} filas' + (' (truncado: hay más; agrega o filtra)' if mas else '')
    return texto


def datos_parcela(id_poligono):
    pid = id_poligono.strip().upper()
    _, p, _ = consultar('SELECT id_poligono, conjunto, area_ha, rendimiento_t_ha, cultivo, municipio, estado, latitud, longitud '
                        'FROM parcelas WHERE id_poligono = ?', (pid,))
    if not p:
        raise ErrorHerramienta(f'No existe la parcela {pid} (válidas: AGC_001 a AGC_197)')
    p = p[0]
    rend = f'{p[3]} t/ha' if p[3] is not None else 'sin etiqueta (parcela de PREDICCION)'
    out = [f'Parcela {p[0]} ({p[1]}): {p[5]}, {p[6]}; {p[2]} ha; cultivo {p[4]}; centroide {p[7]:.5f}, {p[8]:.5f}; rendimiento: {rend}.',
           'La variedad (Doña Josefa o Voyager) no está registrada por parcela.']
    _, t, _ = consultar('SELECT elevacion_m_mean, pendiente_grados_mean FROM terreno WHERE id_poligono = ?', (pid,))
    if t:
        out.append(f'Terreno: elevación media {t[0][0]:.0f} m; pendiente media {t[0][1]:.1f}°.')
    _, c, _ = consultar("SELECT round(sum(precip_mm_mes),1), round(avg(tmin_c),1), round(avg(tmax_c),1) FROM clima_mensual "
                        "WHERE id_poligono = ? AND mes BETWEEN '2025-05' AND '2025-10'", (pid,))
    if c and c[0][0] is not None:
        out.append(f'Clima mayo–octubre 2025: precipitación {c[0][0]} mm; media de Tmin {c[0][1]} °C; media de Tmax {c[0][2]} °C (CHIRPS y rasters oficiales).')
    for tabla, fuente in [('obs_basico', 'Básico'), ('obs_pro', 'PRO')]:
        _, s, _ = consultar(f"SELECT sensor, count(*), min(fecha), max(fecha), round(max(ndvi_promedio),3) FROM {tabla} "
                            f"WHERE id_poligono = ? GROUP BY sensor", (pid,))
        for r in s:
            ndvi = f'; NDVI promedio máximo {r[4]}' if r[4] is not None else ' (sin NDVI; en Landsat el Básico trae VI6T)'
            out.append(f'{fuente} · {r[0]}: {r[1]} observaciones de {r[2]} a {r[3]}{ndvi}.')
    _, h, _ = consultar('SELECT count(*), sum(fraccion_despejada > 0.5) FROM hls_2025 WHERE id_poligono = ?', (pid,))
    if h and h[0][0]:
        out.append(f'HLS 2025: {h[0][0]} fechas, {h[0][1]} con más de 50 % despejado.')
    _, ae, _ = consultar('SELECT count(*), min(anio), max(anio) FROM alphaearth_anual WHERE id_poligono = ?', (pid,))
    if ae and ae[0][0]:
        out.append(f'AlphaEarth: {ae[0][0]} años ({ae[0][1]}–{ae[0][2]}).')
    _, sm, _ = consultar("SELECT round(sum(produccion_t)/sum(cosechada_ha),2), min(anio), max(anio), count(*) FROM siap_municipal "
                         "WHERE municipio = ? AND estado = ? AND ciclo = 'Primavera-Verano' AND anio >= 2015 AND cosechada_ha > 0", (p[5], p[6]))
    if sm and sm[0][0] is not None:
        out.append(f'SIAP {p[5]} (temporal, Primavera-Verano, {sm[0][1]}–{sm[0][2]}, {sm[0][3]} años): rendimiento municipal agregado {sm[0][0]} t/ha. '
                   'Es un agregado municipal, no una medición de la parcela.')
    else:
        out.append(f'SIAP: sin registros de cebada grano de temporal para {p[5]} desde 2015.')
    return '\n'.join(out)


def datos_serie_temporal(id_poligono, variable, fuente='basico', desde=None, hasta=None, nubosidad_max=None):
    if fuente not in FUENTES_SERIE:
        raise ErrorHerramienta(f'fuente debe ser una de {list(FUENTES_SERIE)}')
    tabla = FUENTES_SERIE[fuente]
    _, info, _ = consultar('SELECT name FROM pragma_table_info(?)', (tabla,))
    cols = {r[0] for r in info}
    if variable not in cols - {'id_poligono', 'fecha', 'fecha_captura', 'sensor'}:
        raise ErrorHerramienta(f'Variable desconocida en {tabla}. Disponibles: {", ".join(sorted(c for c in cols if c not in ("id_poligono", "fecha_captura")))}')
    where, params = ['id_poligono = ?', f'"{variable}" IS NOT NULL'], [id_poligono.strip().upper()]
    if desde:
        where.append('fecha >= ?'); params.append(desde)
    if hasta:
        where.append('fecha <= ?'); params.append(hasta)
    extra = ''
    if 'porcentaje_nubosidad' in cols:
        extra = ', porcentaje_nubosidad'
        if nubosidad_max is not None:
            where.append('porcentaje_nubosidad <= ?'); params.append(nubosidad_max)
    elif 'fraccion_despejada' in cols:
        extra = ', fraccion_despejada'
    c, f, mas = consultar(f'SELECT fecha, sensor, "{variable}"{extra} FROM {tabla} WHERE {" AND ".join(where)} ORDER BY fecha, sensor',
                          tuple(params))
    if not f:
        return 'Sin observaciones con esos filtros.'
    return tabla_md(c, f) + f'\n\n{len(f)} observaciones' + (' (truncado; acota las fechas)' if mas else '')


FUNCIONES = {'rag_buscar': rag_buscar, 'rag_leer_fragmento': rag_leer_fragmento, 'datos_listar_tablas': datos_listar_tablas,
             'datos_describir_tabla': datos_describir_tabla, 'datos_consultar_sql': datos_consultar_sql,
             'datos_parcela': datos_parcela, 'datos_serie_temporal': datos_serie_temporal}


def llamar(nombre, args):
    if nombre not in FUNCIONES:
        raise ErrorHerramienta(f'Herramienta desconocida: {nombre}')
    try:
        texto = FUNCIONES[nombre](**(args or {}))
    except TypeError as e:
        raise ErrorHerramienta(f'Argumentos inválidos: {e}')
    except subprocess.TimeoutExpired:
        raise ErrorHerramienta('La búsqueda tardó demasiado; acota el patrón.')
    if len(texto) > MAX_TEXTO:
        texto = texto[:MAX_TEXTO] + '\n… (respuesta truncada; acota la consulta)'
    return texto


def responder(msg):
    metodo, mid = msg.get('method'), msg.get('id')
    if metodo == 'initialize':
        return {'protocolVersion': msg.get('params', {}).get('protocolVersion', PROTOCOLO),
                'capabilities': {'tools': {}}, 'serverInfo': {'name': 'agrocebada', 'version': '1.0.0'},
                'instructions': INSTRUCCIONES}
    if metodo == 'ping':
        return {}
    if metodo == 'tools/list':
        return {'tools': TOOLS}
    if metodo == 'tools/call':
        p = msg.get('params', {})
        try:
            return {'content': [{'type': 'text', 'text': llamar(p.get('name'), p.get('arguments'))}], 'isError': False}
        except ErrorHerramienta as e:
            return {'content': [{'type': 'text', 'text': str(e)}], 'isError': True}
    raise LookupError(metodo)


def main():
    for linea in sys.stdin:
        if not linea.strip():
            continue
        try:
            msg = json.loads(linea)
        except json.JSONDecodeError:
            print(json.dumps({'jsonrpc': '2.0', 'id': None, 'error': {'code': -32700, 'message': 'JSON inválido'}}), flush=True)
            continue
        if 'id' not in msg:          # notificación (p. ej. notifications/initialized)
            continue
        try:
            res = {'jsonrpc': '2.0', 'id': msg['id'], 'result': responder(msg)}
        except LookupError:
            res = {'jsonrpc': '2.0', 'id': msg['id'], 'error': {'code': -32601, 'message': f'Método no soportado: {msg.get("method")}'}}
        except Exception as e:      # nunca tumbar el servidor por una petición
            res = {'jsonrpc': '2.0', 'id': msg['id'], 'error': {'code': -32603, 'message': f'Error interno: {e}'}}
        print(json.dumps(res, ensure_ascii=False), flush=True)


if __name__ == '__main__':
    main()
