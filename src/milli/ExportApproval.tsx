// request_export as an assistant-ui human tool: Milli's run pauses on this card until the user
// allows or declines the download. The decision becomes the tool result (addResult), and the
// continuation run sends it to the server, which only then tells the screen to download.
import { Check, Download, ShieldQuestion, X } from 'lucide-react';
import { useAuiState } from '@assistant-ui/react';
import type { ToolCallMessagePartComponent } from '@assistant-ui/react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { actionTitle } from './parts';
import { getOutcome, useOutcomeVersion } from './runtime';

const SCOPE: Record<string, string> = { mostradas: 'las filas que se muestran', seleccionadas: 'las parcelas seleccionadas', todas: 'todas las parcelas' };

const ExportApproval: ToolCallMessagePartComponent<{ kind?: string; scope?: string; reason?: string }, { approved?: boolean }> = ({ toolCallId, args, result, addResult }) => {
  useOutcomeVersion();
  const isLast = useAuiState(s => s.message.isLast);
  const running = useAuiState(s => s.thread.isRunning);
  const outcome = getOutcome(toolCallId)?.result as { archivo?: string; filas?: number; parcelas?: number } | undefined;
  const decided = result?.approved;
  const what = actionTitle('request_export', args ?? {}).replace(/^Descargar /, '');
  return <section data-milli aria-label="Permiso de descarga" className="grid gap-2.5 rounded-2xl border border-primary/25 bg-primary-container/45 p-3.5 text-on-primary-container">
    <div className="flex items-start gap-2.5">
      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground"><Download className="size-4"/></span>
      <div className="grid min-w-0 gap-0.5">
        <h3 className="text-[13px] font-medium">Milli quiere descargar {what}</h3>
        <p className="text-[12px] leading-snug opacity-80">{args?.scope && !/entrega|mapa/.test(String(args.kind)) ? `Con ${SCOPE[args.scope] ?? args.scope}. ` : ''}{args?.reason}</p>
      </div>
    </div>
    {decided === undefined
      ? isLast
        ? <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" className="rounded-full" onClick={() => addResult({ approved: true })}><Check/>Permitir descarga</Button>
            <Button size="sm" variant="outline" className="rounded-full bg-transparent" onClick={() => addResult({ approved: false })}><X/>Rechazar</Button>
            <span className="flex items-center gap-1 text-[11px] opacity-75"><ShieldQuestion className="size-3.5"/>Milli espera tu permiso</span>
          </div>
        : <p className="text-[12px] opacity-75">Sin respuesta: la conversación siguió.</p>
      : decided
        ? <p className="flex items-center gap-1.5 text-[12px] font-medium">{outcome?.archivo
            ? <><Check className="size-3.5"/>Descargado · {outcome.archivo}{outcome.filas != null ? ` · ${outcome.filas} filas` : outcome.parcelas != null ? ` · ${outcome.parcelas} parcelas` : ''}</>
            : running ? <><Spinner className="size-3.5"/>Permitida · descargando…</> : <><Check className="size-3.5"/>Permitida</>}</p>
        : <p className="flex items-center gap-1.5 text-[12px]"><X className="size-3.5"/>Rechazaste la descarga.</p>}
  </section>;
};
export default ExportApproval;
