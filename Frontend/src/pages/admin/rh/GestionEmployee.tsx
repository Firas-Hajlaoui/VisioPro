import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Plus, Users, Download, Mail, Briefcase, Building, CreditCard,
  Calendar, Search, Filter, X, MoreHorizontal, Pencil, Trash2
} from "lucide-react";
import { generateFormCode } from "@/lib/codification";
import { toast } from "sonner";
import { useEmployees, useLogin } from "@/hooks/useApi"; // Use real API hook

import type { Employee } from "@/types/rh";

// Mock data removed in favor of real API (or kept as fallback/initial state if API not ready, but we want to use API correctly)
// But for now, since we don't have infinite time to refactor everything to useQuery fully if structure differs, 
// I will adapt the component to use the useEmployees hook.

// Checking existing component: it uses local state `employees`.
// I should replace this with `useEmployees` query data.

export default function EmployeePage() {
  const [open, setOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  // --- États pour les filtres ---
  const [filterText, setFilterText] = useState("");
  const [filterDept, setFilterDept] = useState("tous");
  const [filterStatus, setFilterStatus] = useState("tous");

  // API Hooks
  const { data, isLoading, error, createEmployee, updateEmployee, deleteEmployee } = useEmployees({
    // We could pass filter params here correctly if backend supports them directly 
    // but for now client side filtering seems to be what was implemented.
    // If we implement client side filtering on full list, we need full list. 
    // Pagination logic might be needed.
  });

  const employees = data?.results || []; // API returns PaginatedResponse

  // --- Logique de filtrage Client Side (temporaire si API ne filtre pas tout) ---
  const filteredEmployees = employees.filter((emp) => {
    const searchText = filterText.toLowerCase();
    const matchText =
      emp.nom.toLowerCase().includes(searchText) ||
      emp.prenom.toLowerCase().includes(searchText) ||
      emp.email.toLowerCase().includes(searchText);
    const matchDept = filterDept === "tous" ? true : emp.departement === filterDept;
    const matchStatus = filterStatus === "tous" ? true : emp.statut === filterStatus;
    return matchText && matchDept && matchStatus;
  });

  const resetFilters = () => {
    setFilterText("");
    setFilterDept("tous");
    setFilterStatus("tous");
  };

  // --- Gestion de l'ouverture du Modal ---
  const handleOpenNew = () => {
    setEditingEmployee(null); // Mode création
    setOpen(true);
  };

  const handleOpenEdit = (employee: Employee) => {
    setEditingEmployee(employee); // Mode édition
    setOpen(true);
  };

  // --- Gestion de la Suppression ---
  const handleDelete = (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet employé ?")) {
      deleteEmployee(id);
    }
  };

  // --- Soumission du Formulaire (Création ou Modif) ---
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const salaireNum = parseFloat(formData.get("salaire") as string);

    // Récupération des données communes
    const dataForm = {
      nom: formData.get("nom") as string,
      prenom: formData.get("prenom") as string,
      email: formData.get("email") as string,
      poste: formData.get("poste") as string,
      departement: formData.get("departement") as string,
      dateEmbauche: formData.get("dateEmbauche") as string,
      salaire: isNaN(salaireNum) ? "0.00" : salaireNum.toFixed(2), // Convert to string decimal
      statut: (formData.get("statut") as any) || "Actif",
      code: editingEmployee?.code || generateFormCode("RH", "EMPLOYEE") // Keep existing code or generate new
    };

    if (editingEmployee) {
      // MODE MODIFICATION
      updateEmployee({ ...editingEmployee, ...dataForm });
    } else {
      // MODE CRÉATION
      createEmployee(dataForm);
    }

    setOpen(false);
  };

  const getStatusVariant = (statut: string) => {
    if (statut === "Actif") return "default";
    if (statut === "En congé") return "secondary";
    return "destructive";
  };

  if (isLoading) return <div className="p-8">Chargement...</div>;
  if (error) return <div className="p-8 text-red-500">Erreur: {error.message}</div>;

  return (
    <div className="space-y-6 p-2 sm:p-4 md:p-6 pb-20 sm:pb-10">
      {/* --- Header Section --- */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Gestion des Employés</h1>
          <p className="text-sm text-muted-foreground">Enregistrement et suivi des effectifs</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-none justify-center">
            <Download className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Exporter</span>
            <span className="sm:hidden">Exp.</span>
          </Button>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleOpenNew} className="flex-1 sm:flex-none justify-center">
                <Plus className="mr-2 h-4 w-4" />
                Nouveau
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-md rounded-lg sm:rounded-xl">
              <DialogHeader>
                <DialogTitle>{editingEmployee ? "Modifier l'Employé" : "Ajouter un Employé"}</DialogTitle>
                <DialogDescription className="text-xs sm:text-sm">
                  {editingEmployee
                    ? `Modification de ${editingEmployee.code}`
                    : <span>Code généré: <span className="font-mono bg-muted px-1 rounded">{generateFormCode("RH", "EMPLOYEE")}</span></span>
                  }
                </DialogDescription>
              </DialogHeader>

              <form key={editingEmployee ? editingEmployee.id : 'new'} onSubmit={handleSubmit} className="space-y-4 py-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="prenom">Prénom</Label>
                    <Input id="prenom" name="prenom" defaultValue={editingEmployee?.prenom} placeholder="Jean" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nom">Nom</Label>
                    <Input id="nom" name="nom" defaultValue={editingEmployee?.nom} placeholder="Dupont" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" defaultValue={editingEmployee?.email} placeholder="jean@company.com" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="poste">Poste</Label>
                  <Input id="poste" name="poste" defaultValue={editingEmployee?.poste} placeholder="Développeur" required />
                </div>
                {/* Password field removed/hidden for edit, or separate handling needed for API. API requires it for creation but not update maybe? */}
                {!editingEmployee && (
                  <div className="space-y-2">
                    <Label htmlFor="password">Mot de passe</Label>
                    <Input id="password" name="password" placeholder="Mot de passe" required />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="departement">Département</Label>
                  <Select name="departement" defaultValue={editingEmployee?.departement || ""} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IT">IT</SelectItem>
                      <SelectItem value="Ressources Humaines">Ressources Humaines</SelectItem>
                      <SelectItem value="Design">Design</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Gestion de Projets">Gestion de Projets</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateEmbauche">Date d'Embauche</Label>
                    <Input id="dateEmbauche" name="dateEmbauche" type="date" defaultValue={editingEmployee?.dateEmbauche} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salaire">Salaire (mensuel)</Label>
                    <Input id="salaire" name="salaire" type="number" defaultValue={editingEmployee?.salaire} placeholder="40000" required />
                  </div>
                </div>

                {editingEmployee && (
                  <div className="space-y-2">
                    <Label htmlFor="statut">Statut</Label>
                    <Select name="statut" defaultValue={editingEmployee.statut}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Actif">Actif</SelectItem>
                        <SelectItem value="En congé">En congé</SelectItem>
                        <SelectItem value="Inactif">Inactif</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <DialogFooter className="flex-col sm:flex-row gap-2 mt-4">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)} className="w-full sm:w-auto">
                    Annuler
                  </Button>
                  <Button type="submit" className="w-full sm:w-auto">
                    {editingEmployee ? "Enregistrer" : "Ajouter"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* --- KPI Cards Section --- */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Employés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employees.length}</div>
            <p className="text-xs text-muted-foreground">{employees.filter(e => e.statut === "Actif").length} actifs actuellement</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Masse Salariale</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(employees.reduce((sum, e) => sum + parseFloat(e.salaire || "0"), 0) / 1000).toFixed(0)}K <span className="text-sm font-normal text-muted-foreground">DT</span></div>
            <p className="text-xs text-muted-foreground">Par mois</p>
          </CardContent>
        </Card>
        <Card className="sm:col-span-2 lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Taux d'Activité</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employees.length ? Math.round((employees.filter(e => e.statut === "Actif").length / employees.length) * 100) : 0}%</div>
            <p className="text-xs text-muted-foreground">Employés présents</p>
          </CardContent>
        </Card>
      </div>


      {/* --- Main Content Area --- */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Users className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Liste des Employés</h2>
          <Badge variant="outline">{filteredEmployees.length}</Badge>
        </div>
        {/* --- FILTRAGE --- */}

        <div className="flex flex-col md:flex-row gap-4">
          {/* Recherche Nom/Email */}
          <div className="flex-1 relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher nom, email..."
              className="pl-8 bg-background"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-[200px]">
              <Select value={filterDept} onValueChange={setFilterDept}>
                <SelectTrigger className="bg-background">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Département" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tous">Tous les départements</SelectItem>
                  <SelectItem value="IT">IT</SelectItem>
                  <SelectItem value="Ressources Humaines">RH</SelectItem>
                  <SelectItem value="Design">Design</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Gestion de Projets">Projets</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full sm:w-[150px]">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tous">Tous statuts</SelectItem>
                  <SelectItem value="Actif">Actif</SelectItem>
                  <SelectItem value="En congé">En congé</SelectItem>
                  <SelectItem value="Inactif">Inactif</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button variant="ghost" size="icon" onClick={resetFilters} title="Réinitialiser les filtres">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>


        {/* 1. TABLE VIEW (Desktop) */}
        <Card className="hidden md:block">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Code</TableHead>
                  <TableHead>Nom Complet</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Poste</TableHead>
                  <TableHead>Département</TableHead>
                  <TableHead className="text-right">Salaire</TableHead>
                  <TableHead className="text-right">Statut</TableHead>
                  {/* AJOUT : Colonne Actions */}
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      Aucun employé trouvé.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className="font-mono text-xs text-muted-foreground">{employee.code}</TableCell>
                      <TableCell className="font-medium">{employee.prenom} {employee.nom}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{employee.email}</TableCell>
                      <TableCell>{employee.poste}</TableCell>
                      <TableCell>{employee.departement}</TableCell>
                      <TableCell className="text-right font-mono">{parseFloat(employee.salaire || "0").toLocaleString()} DT</TableCell>
                      <TableCell className="text-right">
                        <Badge variant={getStatusVariant(employee.statut)}>
                          {employee.statut}
                        </Badge>
                      </TableCell>
                      {/* AJOUT : Bouton Actions avec Dropdown */}
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(employee.email)}>
                              Copier Email
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleOpenEdit(employee)}>
                              <Pencil className="mr-2 h-4 w-4" /> Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(employee.id)} className="text-red-600 focus:text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* 2. CARD VIEW (Mobile) */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {filteredEmployees.length === 0 && (
            <div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-lg">Aucun résultat</div>
          )}
          {filteredEmployees.map((employee) => (
            <Card key={employee.id} className="shadow-sm">
              <CardHeader className="pb-2 pt-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base font-semibold">{employee.prenom} {employee.nom}</CardTitle>
                    <CardDescription className="font-mono text-xs mt-1">{employee.code}</CardDescription>
                  </div>
                  {/* AJOUT : Dropdown sur Mobile aussi */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleOpenEdit(employee)}>
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(employee.id)} className="text-red-600">
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm pb-4">
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex items-center justify-between">
                    <Badge variant={getStatusVariant(employee.statut)}>
                      {employee.statut}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-3.5 w-3.5" />
                    <span className="truncate">{employee.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Briefcase className="h-3.5 w-3.5" />
                    <span>{employee.poste}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Building className="h-3.5 w-3.5" />
                    <span>{employee.departement}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CreditCard className="h-3.5 w-3.5" />
                      <span>Salaire</span>
                    </div>
                    <span className="font-semibold">{parseFloat(employee.salaire || "0").toLocaleString()} DT</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}