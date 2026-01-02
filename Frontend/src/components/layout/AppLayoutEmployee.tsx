import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebarEmployee } from "./AppSidebarEmployee";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useLocation, useNavigate } from "react-router-dom"; // Ajouter useNavigate
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

// 1. Importer les composants du DropdownMenu (Shadcn UI)
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AppLayoutProps {
  children: React.ReactNode;
}

const breadcrumbMap: Record<string, { label: string; parent?: string }> = {
  "/employee": { label: "Tableau de bord" },
  "/employee/rh/temps": { label: "Temps de travail", parent: "GRH" },
  "/employee/rh/conges": { label: "Congés", parent: "GRH" },
  "/employee/rh/autorisations": { label: "Autorisations", parent: "GRH" },
  "/employee/rh/frais": { label: "Note de frais", parent: "GRH" },
  "/employee/fiche-intervention": { label: "Fiches d'Intervention" },
  "/employee/projets": { label: "Projets" },
  "/employee/parametres": { label: "Paramètres" },
};

export function AppLayoutEmp({ children }: AppLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate(); // Hook pour la navigation
  const currentBreadcrumb = breadcrumbMap[location.pathname] || { label: "Page" };

  // Fonction déclenchée au clic sur "Voir toutes les notifications"
  const handleViewAllNotifications = () => {
    console.log("Navigation vers la page de notifications");
    navigate("/employee/notifications"); // Exemple de redirection
  };

  return (
    <SidebarProvider>
      <AppSidebarEmployee />
      <SidebarInset>
        <header className="sticky top-0 z-50 flex h-14 sm:h-16 shrink-0 items-center gap-2 border-b border-border bg-card px-3 sm:px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/employee" className="text-xs sm:text-sm">Accueil</BreadcrumbLink>
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

          {/* Section Notifications avec Dropdown */}
          <div className="ml-auto flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-8 w-8 sm:h-9 sm:w-9">
                  <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-600 border border-card" />
                  <span className="sr-only">Notifications</span>
                </Button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                {/* Exemple de notifications (statique pour l'instant) */}
                <div className="flex flex-col gap-1 p-1">
                  <DropdownMenuItem className="cursor-pointer">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium">Demande approuvée</span>
                      <span className="text-xs text-muted-foreground">Votre congé a été validé.</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium">Nouveau message</span>
                      <span className="text-xs text-muted-foreground">RH vous a envoyé un message.</span>
                    </div>
                  </DropdownMenuItem>
                </div>

                <DropdownMenuSeparator />
                
                {/* 2. Le bouton "Voir toutes les notifications" avec onClick */}
                <DropdownMenuItem 
                  className="w-full cursor-pointer justify-center text-center font-medium text-primary focus:text-primary"
                  onClick={handleViewAllNotifications}
                >
                  Voir toutes les notifications
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
        </header>
        <main className="flex-1 overflow-auto p-3 sm:p-4 md:p-6 space-y-4">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}