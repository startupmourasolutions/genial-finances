import { useState } from "react"
import { NavLink, useLocation } from "react-router-dom"
import {
  LayoutDashboard,
  ArrowUpCircle,
  ArrowDownCircle,
  Repeat,
  FileText,
  Tag,
  PieChart,
  Target,
  ShoppingCart,
  Car,
  UserCircle,
  LogOut
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar"

const navItems = [
  { id: "dashboard", text: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { id: "receitas", text: "Receitas", icon: ArrowUpCircle, path: "/receitas" },
  { id: "despesas", text: "Despesas", icon: ArrowDownCircle, path: "/despesas" },
  { id: "transacoes", text: "Transações", icon: Repeat, path: "/transacoes" },
  { id: "dividas", text: "Dívidas", icon: FileText, path: "/dividas" },
  { id: "categorias", text: "Categorias", icon: Tag, path: "/categorias" },
  { id: "relatorios", text: "Relatórios", icon: PieChart, path: "/relatorios" },
  { id: "metas", text: "Metas", icon: Target, path: "/metas" },
  { id: "mercado", text: "Mercado", icon: ShoppingCart, path: "/mercado" },
  { id: "veiculos", text: "Veículos", icon: Car, path: "/veiculos" }
]

const footerItems = [
  { id: "perfil", text: "Perfil", icon: UserCircle, path: "/perfil" },
  { id: "sair", text: "Sair", icon: LogOut, path: "/logout" }
]

export function AppSidebar() {
  const { state } = useSidebar()
  const location = useLocation()
  const currentPath = location.pathname
  const collapsed = state === "collapsed"

  const isActive = (path: string) => currentPath === path

  const getNavClasses = (path: string) => {
    const isActiveItem = isActive(path)
    return `transition-smooth rounded-lg mx-2 ${
      isActiveItem 
        ? "bg-brand-orange text-white shadow-lg font-medium" 
        : "text-muted-foreground hover:bg-muted hover:text-foreground"
    }`
  }

  return (
    <Sidebar className={`border-r border-border ${collapsed ? "w-16" : "w-64"}`}>
      <SidebarHeader className="border-b border-border p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-orange rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">G</span>
          </div>
          {!collapsed && (
            <div>
              <h2 className="text-lg font-semibold text-foreground">Gênio</h2>
              <p className="text-xs text-muted-foreground">Financeiro</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground px-2 mb-2">
            Menu Principal
          </SidebarGroupLabel>
          <SidebarGroupContent className="space-y-2">
            <SidebarMenu className="space-y-1">
              {navItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton asChild className="h-11">
                    <NavLink 
                      to={item.path} 
                      className={getNavClasses(item.path)}
                    >
                      <item.icon className="w-5 h-5" />
                      {!collapsed && <span className="ml-3">{item.text}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-2">
        <SidebarMenu>
          {footerItems.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton asChild>
                <NavLink 
                  to={item.path} 
                  className={getNavClasses(item.path)}
                >
                  <item.icon className="w-4 h-4" />
                  {!collapsed && <span>{item.text}</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}