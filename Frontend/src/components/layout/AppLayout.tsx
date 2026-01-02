import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useLocation } from "react-router-dom";

interface AppLayoutProps {
  children: React.ReactNode;
}

const breadcrumbMap: Record<string, { label: string; parent?: string }> = {
  "/admin": { label: "Tableau de bord" },
  "/admin/rh/employe": { label: "Gestion Employee", parent: "Gestion RH" },

  "/admin/rh/temps": { label: "Temps de travail", parent: "Gestion RH" },
  "/admin/rh/conges": { label: "Congés", parent: "Gestion RH" },
  "/admin/rh/autorisations": { label: "Autorisations", parent: "Gestion RH" },
  "/admin/rh/frais": { label: "Frais", parent: "Gestion RH" },

  "/admin/formation": { label: "Formation" },
  "/admin/ingenierie": { label: "Ingénierie" },
  "/admin/projets": { label: "Projets" },
  "/admin/notifications": { label: "Notifications" },
  "/admin/documents": { label: "Documents" },
  "/admin/parametres": { label: "Paramètres" },
};

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const currentBreadcrumb = breadcrumbMap[location.pathname] || { label: "Page" };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-50 flex h-14 sm:h-16 shrink-0 items-center gap-2 border-b border-border bg-card px-3 sm:px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin" className="text-xs sm:text-sm">Accueil</BreadcrumbLink>
              </BreadcrumbItem>
              {currentBreadcrumb.parent && (
                <>
                  <BreadcrumbSeparator className="hidden sm:flex" />
                  <BreadcrumbItem className="hidden sm:flex">
                    <BreadcrumbPage className="text-xs sm:text-sm">{currentBreadcrumb.parent}</BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-xs sm:text-sm">{currentBreadcrumb.label}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <main className="flex-1 overflow-auto p-3 sm:p-4 md:p-6 space-y-4">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
