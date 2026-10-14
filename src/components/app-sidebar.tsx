// Application sidebar after shadcn's dashboard-01 / sidebar-07 blocks: brand,
// primary action, grouped navigation, presentation switch and the user menu.
import type { ComponentProps } from "react"
import { ChartNoAxesCombined, ChevronsUpDown, Database, FlaskConical, LogOut, Map as MapIcon, Moon, Sun, Table2, UserRound, Users, WandSparkles } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem, SidebarRail, useSidebar } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { LoadingValue } from "@/AgentProgress"
import { LogoMark } from "@/Logo"
import { DEMO_USERS, ROLE_NAMES } from "@/demo"
import { IS_DEMO } from "@/lib"
import type { User, View } from "@/types"

const ICONS: Record<View, typeof MapIcon> = { map: MapIcon, parcels: Table2, technical: ChartNoAxesCombined, models: FlaskConical, sources: Database, admin: Users }

export function PresentationSwitch({ technical, onChange, className }: { technical: boolean; onChange: (technical: boolean) => void; className?: string }) {
  return <div role="group" aria-label="Presentación" className={cn("grid grid-cols-2 gap-1 rounded-lg bg-muted p-1", className)}>
    {([[false, "Productor"], [true, "Análisis Pro"]] as const).map(([value, label]) =>
      <button key={label} type="button" aria-pressed={technical === value} onClick={() => onChange(value)}
        className="h-7 rounded-md text-xs font-medium text-muted-foreground transition-colors hover:text-foreground aria-pressed:bg-background aria-pressed:text-foreground aria-pressed:shadow-sm">{label}</button>)}
  </div>
}

interface Props extends ComponentProps<typeof Sidebar> {
  user: User; view: View; views: Record<View, string>; parcelCount: number; loading: boolean; technical: boolean; dark: boolean
  onNavigate: (view: View) => void; onAnalyze: () => void; onPresentation: (technical: boolean) => void; onSwitchUser: (username: string) => void; onLogout: () => void; onTheme: () => void
}

export function AppSidebar({ user, view, views, parcelCount, loading, technical, dark, onNavigate, onAnalyze, onPresentation, onSwitchUser, onLogout, onTheme, ...props }: Props) {
  const { isMobile, setOpenMobile } = useSidebar()
  const go = (next: View) => { onNavigate(next); if (isMobile) setOpenMobile(false) }
  const groups: [string, View[]][] = [["Atlas", ["map", "parcels", "technical", "models"]], ["Proyecto", user.role === "admin" ? ["sources", "admin"] : ["sources"]]]
  return <Sidebar aria-label="Menú lateral" {...props}>
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" asChild>
            <a href="#/map" onClick={event => { event.preventDefault(); go("map") }}>
              <LogoMark size={32}/>
              <span className="grid flex-1 text-left leading-tight"><span className="truncate font-semibold">AgroCebada</span><span className="truncate text-xs text-muted-foreground">Atlas FIRA 2026</span></span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Analizar mi terreno" onClick={() => { onAnalyze(); if (isMobile) setOpenMobile(false) }} className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground">
                <WandSparkles/><span>Analizar mi terreno</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <nav aria-label="Navegación principal">
        {groups.map(([label, items]) => <SidebarGroup key={label}>
          <SidebarGroupLabel>{label}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{items.map(item => { const Icon = ICONS[item]; return <SidebarMenuItem key={item}>
              <SidebarMenuButton asChild isActive={view === item} tooltip={views[item]}>
                <a href={`#/${item}`} aria-label={views[item]} aria-current={view === item ? "page" : undefined} onClick={event => { event.preventDefault(); go(item) }}><Icon/><span>{views[item]}</span></a>
              </SidebarMenuButton>
              {item === "parcels" && <SidebarMenuBadge aria-hidden={!loading}>{loading ? <LoadingValue label="Parcelas disponibles pendientes"/> : parcelCount}</SidebarMenuBadge>}
            </SidebarMenuItem> })}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>)}
      </nav>
    </SidebarContent>
    <SidebarFooter>
      <div className="grid gap-1.5 px-2 pb-1 group-data-[collapsible=icon]:hidden" title="Análisis Pro añade umbrales, series históricas y exportaciones.">
        <span className="text-xs font-medium text-sidebar-foreground/70">Presentación</span>
        <PresentationSwitch technical={technical} onChange={next => { onPresentation(next); if (isMobile) setOpenMobile(false) }}/>
      </div>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton size="lg" aria-label={`Abrir menú de ${user.username}`} className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                <Avatar className="size-8 rounded-lg"><AvatarFallback className="rounded-lg bg-brand text-brand-foreground uppercase">{user.name.slice(0, 1)}</AvatarFallback></Avatar>
                <span className="grid flex-1 text-left text-sm leading-tight"><span className="truncate font-medium">{user.username}</span><span className="truncate text-xs text-muted-foreground">{ROLE_NAMES[user.role]}</span></span>
                <ChevronsUpDown className="ml-auto size-4"/>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width) min-w-60 rounded-lg" side={isMobile ? "bottom" : "right"} align="end" sideOffset={4}>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="size-8 rounded-lg"><AvatarFallback className="rounded-lg bg-brand text-brand-foreground uppercase">{user.name.slice(0, 1)}</AvatarFallback></Avatar>
                  <span className="grid flex-1 leading-tight"><span className="truncate font-medium">{user.name}</span><span className="truncate text-xs text-muted-foreground">{user.username} · {ROLE_NAMES[user.role]}</span></span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator/>
              <DropdownMenuItem onSelect={onTheme}>{dark ? <Sun/> : <Moon/>}{dark ? "Tema claro" : "Tema oscuro"}</DropdownMenuItem>
              {IS_DEMO && <><DropdownMenuSeparator/><DropdownMenuGroup><DropdownMenuLabel className="text-xs text-muted-foreground">Cambiar cuenta de prueba</DropdownMenuLabel>
                {DEMO_USERS.filter(u => u.id !== user.id).map(u => <DropdownMenuItem key={u.id} onSelect={() => onSwitchUser(u.username)}><UserRound/>Demo: {u.username} · {ROLE_NAMES[u.role]}</DropdownMenuItem>)}
              </DropdownMenuGroup></>}
              <DropdownMenuSeparator/>
              <DropdownMenuItem variant="destructive" onSelect={onLogout}><LogOut/>Cerrar sesión</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
    <SidebarRail/>
  </Sidebar>
}
