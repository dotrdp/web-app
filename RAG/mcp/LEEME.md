# Servidor MCP agrocebada

Servidor MCP por stdio, solo con la biblioteca estándar de Python 3.10 o superior. Expone el RAG (búsqueda con tgrep) y la base `datos/agrocebada.sqlite` (solo lectura).

## Herramientas

| Herramienta | Uso |
|---|---|
| `rag_buscar` | Regex sobre `indices/` (por defecto), `temas/`, `fragmentos/` o todo. Usa tgrep si está disponible; si no, búsqueda en Python. |
| `rag_leer_fragmento` | Texto de un fragmento por su @id. |
| `datos_listar_tablas` | Tablas, cobertura y advertencias. |
| `datos_describir_tabla` | Columnas, significado y filas de ejemplo. |
| `datos_consultar_sql` | SELECT o WITH, hasta 500 filas y 10 s. Escrituras rechazadas. |
| `datos_parcela` | Ficha de una parcela (AGC_001 a AGC_197). |
| `datos_serie_temporal` | Serie de una variable por parcela (basico, pro o hls). |

## Configuración

Claude Code (`.mcp.json` en el directorio de trabajo) u otro cliente MCP:

```json
{
  "mcpServers": {
    "agrocebada": {
      "command": "python3",
      "args": ["-I", "<ruta-al-RAG>/mcp/servidor_agrocebada.py"],
      "env": { "AGROCEBADA_TGREP": "/ruta/a/tgrep" }
    }
  }
}
```

`AGROCEBADA_TGREP` es opcional (por defecto se busca `tgrep` en el PATH). `AGROCEBADA_RAG` cambia la raíz del RAG.

## Prueba manual

```
printf '%s\n' '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"prueba","version":"0"}}}' \
  '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"datos_parcela","arguments":{"id_poligono":"AGC_001"}}}' \
  | python3 -I mcp/servidor_agrocebada.py
```

## Para entrenar un agente

Los nombres y esquemas de las herramientas son estables: no los cambies después de generar trayectorias de entrenamiento. Las respuestas son texto en español (tablas Markdown) con un tope de unos 24,000 caracteres; los errores vuelven con `isError: true` y un mensaje que sugiere la corrección.
