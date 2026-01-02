
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import {
  Plus, Receipt, Download, Check, X, Calendar, DollarSign, Briefcase, Search,
  FileText, Tag, MoreHorizontal, Pencil, Trash2, Filter
} from "lucide-react";
import { generateFormCode } from "@/lib/codification";
import { toast } from "sonner";

// Shared Components
import { StatCard } from "@/components/shared/StatCard";
import { FilterBar } from "@/components/shared/FilterBar";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { MobileDataCard } from "@/components/shared/MobileDataCard";

import type { ExpenseReport } from "@/types/rh";

const initialData: ExpenseReport[] = [
  {
    id: 1,
    code: "NDF-2024-0042",
    employe: "Ahmed Bennani",
    date: "2024-12-20",
    designation: "Déjeuner client OCP",
    montant: 450.00,
    projet: "Installation Khouribga",
    type: "Restauration",
    statut: "En attente"
  },
  {
    id: 2,
    code: "NDF-2024-0041",
    employe: "Sara Fassi",
    date: "2024-12-18",
    designation: "Billet train Casa-Rabat",
    montant: 85.00,
    projet: "Audit Siège",
    type: "Transport",
    statut: "Validé"
  },
  {
    id: 3,
    code: "NDF-2024-0040",
    employe: "Youssef Alami",
    date: "2024-12-15",
    designation: "Achat câbles urgence",
    montant: 1200.50,
    projet: "Maintenance T1",
    type: "Matériel",
    statut: "Validé"
  },
  {
    id: 4,
    code: "NDF-2024-0039",
    employe: "Karim Idrissi",
    date: "2024-12-10",
    designation: "Hôtel 2 nuits",
    montant: 1800.00,
    projet: "Chantier Tanger",
    type: "Hébergement",
    statut: "Refusé"
  },
];

export default function NoteFraisPage() {
  const [data, setData] = useState<ExpenseReport[]>(initialData);
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ExpenseReport | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("tous");

  // --- Handlers ---
  const handleOpenNew = () => {
    setEditingItem(null);
    setOpen(true);
  };

  const handleOpenEdit = (item: ExpenseReport) => {
    setEditingItem(item);
    setOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Voulez-vous vraiment supprimer cette note de frais ?")) {
      setData((prev) => prev.filter((item) => item.id !== id));
      toast.success("Note de frais supprimée.");
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const reportData = {
      employe: formData.get("employe") as string,
      date: formData.get("date") as string,
      type: formData.get("type") as string,
      projet: formData.get("projet") as string,
      montant: parseFloat(formData.get("montant") as string),
      designation: formData.get("designation") as string,
      statut: editingItem ? editingItem.statut : "En attente" as const,
    };

    if (editingItem) {
      setData((prev) => prev.map((item) =>
        item.id === editingItem.id ? { ...item, ...reportData } : item
      ));
      toast.success(`Note de frais modifiée: ${editingItem.code}`);
    } else {
      const newItem: ExpenseReport = {
        id: Date.now(),
        code: generateFormCode("RH", "NOTE_DE_FRAIS"),
        ...reportData
      };
      setData([newItem, ...data]);
      toast.success(`Note de frais soumise: ${newItem.code}`);
    }
    setOpen(false);
  };

  const handleAction = (action: "approve" | "reject", id: number) => {
    setData((prev) => prev.map((item) => {
      if (item.id === id) {
        return { ...item, statut: action === "approve" ? "Validé" : "Refusé" };
      }
      return item;
    }));
    if (action === "approve") toast.success(`Note de frais validée.`);
    else toast.error(`Note de frais refusée.`);
  };

  // --- Filters ---
  const filteredData = data.filter((item) => {
    const matchesSearch =
      item.employe.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.projet.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = dateFilter ? item.date === dateFilter : true;
    const matchesStatus = statusFilter === "tous" || statusFilter === "all" ? true : item.statut === statusFilter;
    return matchesSearch && matchesDate && matchesStatus;
  });

  const getStatusVariant = (statut: string) => {
    if (statut === "Validé") return "default";
    if (statut === "Refusé") return "destructive";
    return "secondary";
  };

  // --- DataTable Config ---
  const columns: Column<ExpenseReport>[] = [
    { header: "Code", accessorKey: "code", className: "font-mono text-xs text-muted-foreground w-[130px]" },
    { header: "Employé", accessorKey: "employe", className: "font-medium" },
    { header: "Date", accessorKey: "date" },
    { header: "Désignation", accessorKey: "designation", className: "max-w-[200px] truncate" },
    { header: "Projet", accessorKey: "projet" },
    { header: "Type", accessorKey: "type", cell: (row) => <Badge variant="outline" className="font-normal">{row.type}</Badge> },
    { header: "Montant TTC", accessorKey: "montant", className: "text-right font-bold", cell: (row) => row.montant.toFixed(2) },
    {
      header: "Statut",
      accessorKey: "statut",
      className: "text-center",
      cell: (row) => <Badge variant={getStatusVariant(row.statut) as any}>{row.statut}</Badge>
    },
    {
      header: "Validation",
      className: "text-right",
      cell: (row) => (
        <div className="flex justify-end gap-2 items-center">
          {row.statut === "En attente" && (
            <>
              <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => handleAction("approve", row.id)} title="Valider">
                <Check className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-red-700 hover:bg-red-50" onClick={() => handleAction("reject", row.id)} title="Refuser">
                <X className="h-4 w-4" />
              </Button>
            </>
          )}
          <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(row)} className="h-8 w-8">
            <Pencil className="h-4 w-4 text-muted-foreground" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleDelete(row.id)} className="h-8 w-8 text-red-600">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  const filterConfig = [
    {
      key: "status",
      label: "Statut",
      value: statusFilter,
      onChange: setStatusFilter,
      options: [
        { label: "En attente", value: "En attente" },
        { label: "Validé", value: "Validé" },
        { label: "Refusé", value: "Refusé" },
      ]
    }
  ];

  return (
    <div className="space-y-6 p-2 sm:p-4 md:p-6 pb-20 sm:pb-10">
      {/* --- Header --- */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Notes de Frais</h1>
          <p className="text-sm text-muted-foreground">Gestion des remboursements et dépenses</p>
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
                <span className="hidden sm:inline">Déclarer frais</span>
                <span className="sm:hidden">Nouveau</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-md rounded-lg sm:rounded-xl">
              <DialogHeader>
                <DialogTitle>{editingItem ? "Modifier Note de Frais" : "Nouvelle Note de Frais"}</DialogTitle>
                <DialogDescription className="text-xs sm:text-sm">
                  {editingItem
                    ? `Modification de ${editingItem.code}`
                    : <span>Réf: <span className="font-mono bg-muted px-1 rounded">{generateFormCode("RH", "NOTE_DE_FRAIS")}</span></span>
                  }
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4 py-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="employe">Employé</Label>
                    <Select name="employe" defaultValue={editingItem?.employe || "Ahmed Bennani"}>
                      <SelectTrigger>
                        <SelectValue placeholder="Qui ?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Ahmed Bennani">Ahmed Bennani</SelectItem>
                        <SelectItem value="Sara Fassi">Sara Fassi</SelectItem>
                        <SelectItem value="Youssef Alami">Youssef Alami</SelectItem>
                        <SelectItem value="Karim Idrissi">Karim Idrissi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Date dépense</Label>
                    <Input type="date" name="date" id="date" defaultValue={editingItem?.date} required />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Type de frais</Label>
                    <Select name="type" defaultValue={editingItem?.type || "Transport"}>
                      <SelectTrigger>
                        <SelectValue placeholder="Catégorie..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Transport">Transport</SelectItem>
                        <SelectItem value="Restauration">Restauration</SelectItem>
                        <SelectItem value="Hébergement">Hébergement</SelectItem>
                        <SelectItem value="Matériel">Matériel / Outillage</SelectItem>
                        <SelectItem value="Divers">Divers</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="projet">Projet concerné</Label>
                    <Input id="projet" name="projet" defaultValue={editingItem?.projet} placeholder="Ex: Chantier A" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="montant">Montant TTC</Label>
                  <div className="relative">
                    <Input
                      type="number"
                      id="montant"
                      name="montant"
                      defaultValue={editingItem?.montant}
                      placeholder="0.00"
                      className="pl-8"
                      required
                      min="0"
                      step="0.01"
                    />
                    <span className="absolute left-3 top-2.5 text-muted-foreground text-sm">$</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="designation">Désignation</Label>
                  <Textarea
                    id="designation"
                    name="designation"
                    defaultValue={editingItem?.designation}
                    placeholder="Description détaillée de la dépense..."
                    className="resize-none"
                    rows={3}
                    required
                  />
                </div>

                <DialogFooter className="flex-col sm:flex-row gap-2 mt-4">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)} className="w-full sm:w-auto">
                    Annuler
                  </Button>
                  <Button type="submit" className="w-full sm:w-auto">
                    {editingItem ? "Enregistrer" : "Envoyer"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* --- KPI Cards --- */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Déclaré (Mois)"
          value="3,535.50"
          description="Devise locale"
          icon={DollarSign}
        />
        <StatCard
          title="En attente"
          value={data.filter(i => i.statut === "En attente").length}
          description="demandes à traiter"
          icon={Receipt}
        />
        <StatCard
          title="Remboursés"
          value="92%"
          description="Taux de validation"
          icon={Check}
        />
      </div>

      <div className="space-y-4">
        <FilterBar
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          filters={filterConfig}
          onReset={() => { setSearchTerm(""); setStatusFilter("tous"); setDateFilter(""); }}
          searchPlaceholder="Rechercher employé ou projet..."
        >
          <div className="w-full sm:w-[150px]">
            <Input
              type="date"
              className="bg-background"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
        </FilterBar>

        {/* --- Desktop Table --- */}
        <div className="hidden md:block">
          <DataTable
            columns={columns}
            data={filteredData}
            defaultPageSize={10}
          />
        </div>

        {/* --- Mobile Cards --- */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {filteredData.length === 0 && <div className="text-center py-6 text-muted-foreground">Aucune note de frais</div>}
          {filteredData.map((row) => (
            <MobileDataCard
              key={row.id}
              title={row.employe}
              subtitle={row.code}
              status={{ label: row.statut, variant: getStatusVariant(row.statut) as any }}
              data={[
                { icon: <FileText className="h-3.5 w-3.5" />, value: row.designation },
                { icon: <Calendar className="h-3.5 w-3.5" />, value: row.date },
                { icon: <DollarSign className="h-3.5 w-3.5" />, value: row.montant.toFixed(2), className: "font-bold" },
                { icon: <Tag className="h-3.5 w-3.5" />, value: row.type },
                { icon: <Briefcase className="h-3.5 w-3.5" />, value: row.projet },
              ]}
              actions={
                <div className="w-full pt-2 flex flex-col gap-2">
                  {row.statut === "En attente" && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 border-destructive text-destructive hover:bg-destructive/10" onClick={() => handleAction("reject", row.id)}>
                        Refuser
                      </Button>
                      <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => handleAction("approve", row.id)}>
                        Valider
                      </Button>
                    </div>
                  )}
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleOpenEdit(row)}>
                      Modifier
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(row.id)} className="text-red-600">
                      Supprimer
                    </Button>
                  </div>
                </div>
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}