import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Clock,
  Calendar,
  KeyRound,
  GraduationCap,
  Wrench,
  FolderKanban,
  FileText,
  Settings,
  Building2,
  ChevronDown,
  Banknote,
  Bell,
} from "lucide-react";
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
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Profiler } from "react";

const menuItems = {
  main: [
    { icon: LayoutDashboard, label: "Tableau de bord", href: "/admin" },
  ],
  rh: {
    label: "Gestion RH",
    icon: Users,
    items: [
       { icon: Users, label: "Gestion Employee", href: "/admin/rh/employe" },
      { icon: Clock, label: "Temps de travail", href: "/admin/rh/temps" },
      { icon: Calendar, label: "Congés", href: "/admin/rh/conges" },
      { icon: KeyRound, label: "Autorisations", href: "/admin/rh/autorisations" },
      { icon: Banknote, label: "Note de frais", href: "/admin/rh/frais" },
    ],
  },
  departments: [
    { icon: GraduationCap, label: "Formation", href: "/admin/formation" },
    { icon: Wrench, label: "Ingénierie", href: "/admin/ingenierie" },
    { icon: FolderKanban, label: "Projets", href: "/admin/projets" },
  ],
  docs: [
    { icon: Bell , label: "Notifications", href: "/admin/notifications" },
    { icon: FileText, label: "Documents", href: "/admin/documents" },
    { icon: Settings, label: "Paramètres", href: "/admin/parametres" },
  ],
};

export function AppSidebar() {
  const location = useLocation();

  const isActive = (href: string) => location.pathname === href;
  const isGroupActive = (items: { href: string }[]) =>
    items.some((item) => location.pathname.startsWith(item.href));

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Building2 className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-sidebar-foreground">VisioPro</h1>
            <p className="text-xs text-muted-foreground">ISO 9001</p>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.main.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={isActive(item.href)}>
                    <Link to={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Ressources Humaines</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible defaultOpen={isGroupActive(menuItems.rh.items)}>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <menuItems.rh.icon className="h-4 w-4" />
                      <span>{menuItems.rh.label}</span>
                      <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {menuItems.rh.items.map((item) => (
                        <SidebarMenuSubItem key={item.href}>
                          <SidebarMenuSubButton asChild isActive={isActive(item.href)}>
                            <Link to={item.href}>
                              <item.icon className="h-4 w-4" />
                              <span>{item.label}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Départements</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.departments.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={isActive(item.href)}>
                    <Link to={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Système</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.docs.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={isActive(item.href)}>
                    <Link to={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="text-xs text-muted-foreground">
          Version 1.0.0 • Conforme ISO 9001
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
