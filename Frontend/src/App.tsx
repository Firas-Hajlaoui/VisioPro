import { Toaster } from "@/components/ui/toaster";
import NotificationsPage from "./pages/admin/NotificationsPage";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { AppLayoutEmp } from "@/components/layout/AppLayoutEmployee";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/admin/Dashboard";
import TempsPage from "./pages/admin/rh/TempsPage";
import Employee from "./pages/admin/rh/GestionEmployee";
import FicheInterventionPage from "./pages/employee/FicheInterventionPage";
import CongesPage from "./pages/admin/rh/CongesPage";
import AutorisationsPage from "./pages/admin/rh/AutorisationsPage";
import FormationPage from "./pages/admin/FormationPage";
import IngenieriePage from "./pages/admin/IngenieriePage";
import ProjetsPage from "./pages/admin/ProjetsPage";
import DocumentsPage from "./pages/admin/DocumentsPage";
import ParametresPage from "./pages/admin/ParametresPage";
import NotFound from "./pages/NotFound";
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import EmployeeTempsPage from "./pages/employee/rh/EmployeeTempsPage";
import EmployeeCongesPage from "./pages/employee/rh/EmployeeCongesPage";
import EmployeeAutorisationsPage from "./pages/employee/rh/EmployeeAutorisationsPage";
import EmployeeNoteFraisPage from "./pages/employee/rh/EmployeeNoteFrais";
import NoteFraisPage from "./pages/admin/rh/NoteFrais";
import EmployeeProjetsPage from "./pages/employee/EmployeeProjetsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Root redirect to login */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Login Page */}
            <Route path="/login" element={<Login />} />

            {/* Employee Portal - With AppLayout */}
            <Route path="/employee/*" element={
              <AppLayoutEmp>
                <Routes>
                  <Route path="/" element={<EmployeeDashboard />} />
                  <Route path="/rh/temps" element={<EmployeeTempsPage />} />
                  <Route path="/rh/conges" element={<EmployeeCongesPage />} />
                  <Route path="/rh/autorisations" element={<EmployeeAutorisationsPage />} />
                  <Route path="/rh/frais" element={<EmployeeNoteFraisPage />} />
                  <Route path="/fiche-intervention" element={<FicheInterventionPage />} />
                  <Route path="/projets" element={<EmployeeProjetsPage />} />

                  <Route path="*" element={<NotFound />} />

                </Routes>
              </AppLayoutEmp>
            } />

            {/* Admin/Manager Portal - With AppLayout */}
            <Route path="admin/*" element={
              <AppLayout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/rh/employe" element={<Employee />} />
                  <Route path="/rh/temps" element={<TempsPage />} />
                  <Route path="/rh/conges" element={<CongesPage />} />
                  <Route path="/rh/autorisations" element={<AutorisationsPage />} />
                  <Route path="/rh/frais" element={<NoteFraisPage />} />
                  <Route path="/formation" element={<FormationPage />} />
                  <Route path="/ingenierie" element={<IngenieriePage />} />
                  <Route path="/projets" element={<ProjetsPage />} />
                  <Route path="/documents" element={<DocumentsPage />} />
                  <Route path="/notifications" element={<NotificationsPage />} />
                  <Route path="/parametres" element={<ParametresPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AppLayout>
            } />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
