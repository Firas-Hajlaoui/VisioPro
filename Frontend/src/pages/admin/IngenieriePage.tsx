
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, Download, MapPin, User, Calendar, MoreHorizontal, Pencil, Trash2, Globe, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { generateFormCode } from "@/lib/codification";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

// Shared Components
import { StatCard } from "@/components/shared/StatCard";
import { FilterBar } from "@/components/shared/FilterBar";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { MobileDataCard } from "@/components/shared/MobileDataCard";

// Définition du type
import type { Intervention } from "@/types/intervention";

// Données initiales
const mockData: Intervention[] = [
  { id: 1, code: "ING-INT-2024-0089", client: "ONCF", site: "Rabat", technicien: "Youssef Alami", date: "2024-12-22", type: "Maintenance", statut: "Planifiée" },
  { id: 2, code: "ING-INT-2024-0088", client: "OCP", site: "Khouribga", technicien: "Omar Benjelloun", date: "2024-12-20", type: "Installation", statut: "En cours" },
  { id: 3, code: "ING-INT-2024-0087", client: "COSUMAR", site: "Casablanca", technicien: "Ahmed Bennani", date: "2024-12-18", type: "Dépannage", statut: "Terminée" },
  { id: 4, code: "ING-INT-2024-0086", client: "LYDEC", site: "Casablanca", technicien: "Karim Idrissi", date: "2024-12-15", type: "Maintenance", statut: "Terminée" },
  { id: 5, code: "ING-INT-2024-0090", client: "Marjane", site: "Tanger", technicien: "Salim Tazi", date: "2024-12-23", type: "Audit", statut: "Planifiée" },
];

export default function IngenieriePage() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<Intervention[]>(mockData);
  const [editingItem, setEditingItem] = useState<Intervention | null>(null);

  // --- États de filtrage ---
  const [filterText, setFilterText] = useState("");
  const [filterType, setFilterType] = useState("tous");
  const [filterStatus, setFilterStatus] = useState("tous");

  // --- Ouvrir Modal Création ---
  const handleOpenNew = () => {
    setEditingItem(null);
    setOpen(true);
  };

  // --- Ouvrir Modal Édition ---
  const handleOpenEdit = (item: Intervention) => {
    setEditingItem(item);
    setOpen(true);
  };

  // --- Suppression ---
  const handleDelete = (id: string | number) => {
    if (confirm("Voulez-vous vraiment supprimer cette intervention ?")) {
      setData((prev) => prev.filter((item) => item.id !== id));
      toast.success("Intervention supprimée.");
    }
  };

  // --- Gestion du formulaire (Ajout/Modif) ---
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const interventionData = {
      client: formData.get("client") as string,
      site: formData.get("site") as string,
      technicien: formData.get("technicien") as string,
      date: formData.get("date") as string,
      type: formData.get("type") as string,
      description: formData.get("description") as string,
      statut: editingItem ? editingItem.statut : "Planifiée" as const, // Par défaut Planifiée
    };

    if (editingItem) {
      // Modification
      setData((prev) => prev.map((item) =>
        item.id === editingItem.id ? { ...item, ...interventionData } : item
      ));
      toast.success(`Intervention modifiée: ${editingItem.code}`);
    } else {
      // Création
      const newIntervention: Intervention = {
        id: Date.now(),
        code: generateFormCode("INGENIERIE", "INTERVENTION"),
        ...interventionData
      };
      setData([newIntervention, ...data]);
      toast.success(`Intervention créée: ${newIntervention.code}`);
    }
    setOpen(false);
  };

  // --- Logique de filtrage ---
  const filteredData = data.filter((item) => {
    const matchText =
      item.client.toLowerCase().includes(filterText.toLowerCase()) ||
      item.site.toLowerCase().includes(filterText.toLowerCase()) ||
      item.technicien.toLowerCase().includes(filterText.toLowerCase());

    const matchType = filterType === "tous" || filterType === "all" ? true : item.type === filterType;
    const matchStatus = filterStatus === "tous" || filterStatus === "all" ? true : item.statut === filterStatus;

    return matchText && matchType && matchStatus;
  });

  const getStatusVariant = (statut: string) => {
    switch (statut) {
      case "Terminée": return "default";
      case "En cours": return "secondary";
      case "Planifiée": return "outline";
      default: return "default";
    }
  };

  // --- Configuration des Colonnes pour DataTable ---
  const columns: Column<Intervention>[] = [
    {
      header: "Code",
      accessorKey: "code",
      className: "font-mono text-xs text-muted-foreground w-[150px]",
      sortable: true
    },
    {
      header: "Client",
      accessorKey: "client",
      className: "font-medium",
      sortable: true
    },
    {
      header: "Site",
      accessorKey: "site",
      cell: (item) => (
        <div className="flex items-center gap-1.5">
          <MapPin className="h-3 w-3 text-muted-foreground" />
          {item.site}
        </div>
      )
    },
    {
      header: "Technicien",
      accessorKey: "technicien",
      cell: (item) => (
        <div className="flex items-center gap-1.5">
          <User className="h-3 w-3 text-muted-foreground" />
          {item.technicien}
        </div>
      )
    },
    {
      header: "Date",
      accessorKey: "date",
      sortable: true
    },
    {
      header: "Type",
      accessorKey: "type",
      className: "hidden md:table-cell"
    },
    {
      header: "Statut",
      accessorKey: "statut",
      className: "text-right",
      cell: (item) => (
        <div className="flex justify-end">
          <Badge variant={getStatusVariant(item.statut || "Planifiée")}>
            {item.statut}
          </Badge>
        </div>
      )
    },
    {
      header: "",
      cell: (item) => (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleOpenEdit(item)}>
                <Pencil className="mr-2 h-4 w-4" /> Modifier
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleDelete(item.id)} className="text-red-600 focus:text-red-600">
                <Trash2 className="mr-2 h-4 w-4" /> Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    }
  ];

  // --- Configuration des Filtres ---
  const filterConfig = [
    {
      key: "type",
      label: "Type",
      value: filterType,
      onChange: setFilterType,
      options: [
        { label: "Maintenance", value: "Maintenance" },
        { label: "Installation", value: "Installation" },
        { label: "Dépannage", value: "Dépannage" },
        { label: "Audit", value: "Audit" }
      ]
    },
    {
      key: "status",
      label: "Statut",
      value: filterStatus,
      onChange: setFilterStatus,
      options: [
        { label: "Planifiée", value: "Planifiée" },
        { label: "En cours", value: "En cours" },
        { label: "Terminée", value: "Terminée" }
      ]
    }
  ];

  return (
    <div className="space-y-6 p-2 sm:p-4 md:p-6 pb-20 sm:pb-10">
      {/* --- En-tête --- */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Département Ingénierie</h1>
          <p className="text-sm text-muted-foreground">Gestion des interventions techniques et chantiers</p>
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
                Intervention
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg w-[95vw] rounded-lg">
              <DialogHeader>
                <DialogTitle>{editingItem ? "Modifier l'Intervention" : "Nouvelle Intervention"}</DialogTitle>
                <DialogDescription>
                  {editingItem
                    ? `Modification de ${editingItem.code}`
                    : <span>Code: <span className="font-mono bg-muted px-1 rounded">{generateFormCode("INGENIERIE", "INTERVENTION")}</span></span>
                  }
                </DialogDescription>
              </DialogHeader>

              <form key={editingItem ? editingItem.id : 'new'} onSubmit={handleSubmit} className="space-y-4 py-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="client">Client</Label>
                    <Input id="client" name="client" defaultValue={editingItem?.client} placeholder="Nom du client" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="site">Site</Label>
                    <Input id="site" name="site" defaultValue={editingItem?.site} placeholder="Lieu d'intervention" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="technicien">Technicien assigné</Label>
                  <Select name="technicien" defaultValue={editingItem?.technicien || ""}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Youssef Alami">Youssef Alami</SelectItem>
                      <SelectItem value="Omar Benjelloun">Omar Benjelloun</SelectItem>
                      <SelectItem value="Ahmed Bennani">Ahmed Bennani</SelectItem>
                      <SelectItem value="Karim Idrissi">Karim Idrissi</SelectItem>
                      <SelectItem value="Salim Tazi">Salim Tazi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input type="date" id="date" name="date" defaultValue={editingItem?.date} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select name="type" defaultValue={editingItem?.type || "Maintenance"}>
                      <SelectTrigger>
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                        <SelectItem value="Installation">Installation</SelectItem>
                        <SelectItem value="Dépannage">Dépannage</SelectItem>
                        <SelectItem value="Audit">Audit technique</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" defaultValue={editingItem?.description} placeholder="Détails..." />
                </div>
                <DialogFooter className="flex-col sm:flex-row gap-2 mt-4">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)} className="w-full sm:w-auto">
                    Annuler
                  </Button>
                  <Button type="submit" className="w-full sm:w-auto">
                    {editingItem ? "Modifier" : "Créer"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* --- KPI Cards --- */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Interventions ce mois"
          value={data.length}
          description="vs mois dernier"
          trend={{ value: "+15%", positive: true }}
          icon={Globe}
        />
        <StatCard
          title="En cours"
          value={data.filter(d => d.statut === "En cours").length}
          description="Interventions actives"
          icon={Clock}
        />
        <StatCard
          title="Taux de résolution"
          value="96%"
          description="Premier passage"
          icon={CheckCircle}
        />
        <StatCard
          title="Temps moyen"
          value="4.2h"
          description="Par intervention"
          icon={AlertCircle}
        />
      </div>

      {/* --- Liste des Interventions --- */}
      <div className="space-y-4">
        <FilterBar
          searchValue={filterText}
          onSearchChange={setFilterText}
          searchPlaceholder="Rechercher client, site, technicien..."
          filters={filterConfig}
          onReset={() => {
            setFilterText("");
            setFilterType("tous");
            setFilterStatus("tous");
          }}
        />

        {/* --- 1. Vue Tableau (Desktop) --- */}
        <div className="hidden md:block">
          <DataTable
            data={filteredData}
            columns={columns}
            title="Liste des Interventions"
            defaultPageSize={10}
          />
        </div>

        {/* --- 2. Vue Cartes (Mobile) --- */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {filteredData.length === 0 && (
            <div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-lg">Aucun résultat</div>
          )}
          {filteredData.map((row) => (
            <MobileDataCard
              key={row.id}
              title={row.client}
              subtitle={row.code}
              status={{
                label: row.statut || "Planifiée",
                variant: getStatusVariant(row.statut || "Planifiée") as any
              }}
              data={[
                { icon: <MapPin className="h-3.5 w-3.5" />, value: row.site },
                { icon: <User className="h-3.5 w-3.5" />, value: row.technicien },
                { icon: <Calendar className="h-3.5 w-3.5" />, label: "Date", value: row.date },
                { label: "Type", value: row.type || "-" },
              ]}
              actions={
                <>
                  <DropdownMenuItem onClick={() => handleOpenEdit(row)}>
                    Modifier
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDelete(row.id)} className="text-red-600">
                    Supprimer
                  </DropdownMenuItem>
                </>
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}