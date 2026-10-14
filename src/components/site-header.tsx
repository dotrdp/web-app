// Site header after shadcn's dashboard-01: sidebar trigger, page title, actions.
import type { ReactNode } from "react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function SiteHeader({ title, description, technical, children }: { title: string; description?: string; technical?: boolean; children?: ReactNode }) {
  return <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
    <div className="flex w-full min-w-0 items-center gap-1 px-4 lg:gap-2 lg:px-6">
      <SidebarTrigger className="-ml-1"/>
      <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4"/>
      <h1 className="truncate text-base font-medium">{title}</h1>
      {description && <span className="hidden truncate text-sm text-muted-foreground md:inline">· {description}</span>}
      {technical && <Badge variant="secondary" className="ml-1 hidden sm:inline-flex">Análisis Pro</Badge>}
      <div className="ml-auto flex items-center gap-2">{children}</div>
    </div>
  </header>
}
