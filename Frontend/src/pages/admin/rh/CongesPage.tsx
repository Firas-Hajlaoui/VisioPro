
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
  Plus, Calendar, Download, Check, X, Clock, Briefcase, Search,
  MoreHorizontal, Pencil, Trash2, Filter
} from "lucide-react";
import { generateFormCode } from "@/lib/codification";
import { toast } from "sonner";

// Shared Components
import { StatCard } from "@/components/shared/StatCard";
import { FilterBar } from "@/components/shared/FilterBar";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { MobileDataCard } from "@/components/shared/MobileDataCard";

import type { LeaveRequest } from "@/types/rh";

const initialData: LeaveRequest[] = [
  { id: 1, code: "RH-CG-2024-0145", employe: "Karim Idrissi", debut: "2025-01-15", fin: "2025-01-20", jours: 5, type: "Congé annuel", statut: "En attente" },
  { id: 2, code: "RH-CG-2024-0144", employe: "Fatima Zohra", debut: "2025-01-22", fin: "2025-01-24", jours: 2, type: "Congé maladie", statut: "En attente" },
  { id: 3, code: "RH-CG-2024-0143", employe: "Omar Benjelloun", debut: "2024-12-23", fin: "2024-12-25", jours: 2, type: "Congé annuel", statut: "Approuvé" },
  { id: 4, code: "RH-CG-2024-0142", employe: "Sara Fassi", debut: "2024-12-18", fin: "2024-12-18", jours: 1, type: "Personnel", statut: "Approuvé" },
  { id: 5, code: "RH-CG-2024-0141", employe: "Youssef Alami", debut: "2024-11-10", fin: "2024-11-15", jours: 5, type: "Congé annuel", statut: "Refusé" },
];

export default function CongesPage() {
  const [data, setData] = useState<LeaveRequest[]>(initialData);
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<LeaveRequest | null>(null);

  // Filtres
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("tous");

  // --- Handlers ---
  const handleOpenNew = () => {
    setEditingItem(null);
    setOpen(true);
  };

  const handleOpenEdit = (item: LeaveRequest) => {
    setEditingItem(item);
    setOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette demande ?")) {
      setData((prev) => prev.filter((item) => item.id !== id));
      toast.success("Demande supprimée avec succès.");
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const debut = new Date(formData.get("debut") as string);
    const fin = new Date(formData.get("fin") as string);
    const diffTime = Math.abs(fin.getTime() - debut.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const requestData = {
      employe: formData.get("employeText") as string,
      type: formData.get("type") as string,
      debut: formData.get("debut") as string,
      fin: formData.get("fin") as string,
      jours: diffDays > 0 ? diffDays : 1,
      motif: formData.get("motif") as string,
      statut: editingItem ? editingItem.statut : "En attente" as const,
    };

    if (editingItem) {
      setData((prev) => prev.map((item) =>
        item.id === editingItem.id ? { ...item, ...requestData } : item
      ));
      toast.success(`Demande modifiée: ${editingItem.code}`);
    } else {
      const newItem: LeaveRequest = {
        id: Date.now(),
        code: generateFormCode("RH", "CONGE"),
        ...requestData
      };
      setData([newItem, ...data]);
      toast.success(`Demande créée: ${newItem.code}`);
    }
    setOpen(false);
  };

  const handleAction = (action: "approve" | "reject", id: number) => {
    setData((prev) => prev.map((item) => {
      if (item.id === id) {
        return { ...item, statut: action === "approve" ? "Approuvé" : "Refusé" };
      }
      return item;
    }));
    if (action === "approve") toast.success(`Congé approuvé`);
    else toast.error(`Congé refusé`);
  };

  // --- Filtres ---
  const filteredData = data.filter((item) => {
    const matchesSearch = item.employe.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "tous" || statusFilter === "all" ? true : item.statut === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusVariant = (statut: string) => {
    if (statut === "Approuvé") return "default"; // green would happen if badge variants defined or via className
    if (statut === "Refusé") return "destructive";
    return "secondary";
  };

  const getStatusBadge = (statut: string) => {
    // Could add specific classNames if needed, relying on variant for now
    return statut;
  }

  // --- DataTable Config ---
  const columns: Column<LeaveRequest>[] = [
    { header: "Code", accessorKey: "code", className: "font-mono text-xs text-muted-foreground w-[140px]" },
    { header: "Employé", accessorKey: "employe", className: "font-medium" },
    {
      header: "Période",
      cell: (row) => (
        <span className="text-sm">{row.debut} <span className="text-muted-foreground">au</span> {row.fin}</span>
      )
    },
    { header: "Durée", accessorKey: "jours", cell: (row) => `${row.jours} jours` },
    { header: "Type", accessorKey: "type" },
    {
      header: "Statut",
      accessorKey: "statut",
      cell: (row) => (
        <Badge variant={getStatusVariant(row.statut) as any}>
          {getStatusBadge(row.statut)}
        </Badge>
      )
    },
    {
      header: "Actions",
      className: "text-right",
      cell: (row) => (
        <div className="flex justify-end gap-2 items-center">
          {row.statut === "En attente" && (
            <>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                onClick={() => handleAction("approve", row.id)}
                title="Approuver"
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-destructive hover:text-red-700 hover:bg-red-50"
                onClick={() => handleAction("reject", row.id)}
                title="Refuser"
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          )}
          <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(row)} className="h-8 w-8">
            <Pencil className="h-4 w-4 text-muted-foreground" />
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
        { label: "Approuvé", value: "Approuvé" },
        { label: "Refusé", value: "Refusé" },
      ]
    }
  ];

  return (
    <div className="space-y-6 p-2 sm:p-4 md:p-6 pb-20 sm:pb-10">
      {/* --- Header --- */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Gestion des Congés</h1>
          <p className="text-sm text-muted-foreground">Demandes et suivi des absences</p>
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
                <span className="hidden sm:inline">Nouvelle demande</span>
                <span className="sm:hidden">Nouveau</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-md rounded-lg sm:rounded-xl">
              <DialogHeader>
                <DialogTitle>{editingItem ? "Modifier la demande" : "Nouvelle Demande"}</DialogTitle>
                <DialogDescription>
                  {editingItem
                    ? `Modification de ${editingItem.code}`
                    : <span>Code: <span className="font-mono bg-muted px-1 rounded">{generateFormCode("RH", "CONGE")}</span></span>
                  }
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="employe">Employé</Label>
                  <Select name="employeText" defaultValue={editingItem?.employe || "Ahmed Bennani"}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ahmed Bennani">Ahmed Bennani</SelectItem>
                      <SelectItem value="Sara Fassi">Sara Fassi</SelectItem>
                      <SelectItem value="Youssef Alami">Youssef Alami</SelectItem>
                      <SelectItem value="Karim Idrissi">Karim Idrissi</SelectItem>
                      <SelectItem value="Fatima Zohra">Fatima Zohra</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type de congé</Label>
                  <Select name="type" defaultValue={editingItem?.type || "Congé annuel"}>
                    <SelectTrigger>
                      <SelectValue placeholder="Type..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Congé annuel">Congé annuel</SelectItem>
                      <SelectItem value="Congé maladie">Congé maladie</SelectItem>
                      <SelectItem value="Personnel">Personnel</SelectItem>
                      <SelectItem value="Maternité">Maternité</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="debut">Date début</Label>
                    <Input type="date" name="debut" id="debut" defaultValue={editingItem?.debut} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fin">Date fin</Label>
                    <Input type="date" name="fin" id="fin" defaultValue={editingItem?.fin} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="motif">Motif</Label>
                  <Textarea
                    name="motif"
                    id="motif"
                    defaultValue={editingItem?.motif}
                    placeholder="Raison de la demande..."
                    className="resize-none"
                    rows={3}
                  />
                </div>
                <DialogFooter className="flex-col sm:flex-row gap-2 mt-4">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)} className="w-full sm:w-auto">
                    Annuler
                  </Button>
                  <Button type="submit" className="w-full sm:w-auto">
                    {editingItem ? "Modifier" : "Soumettre"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* --- KPIs --- */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="En attente"
          value={data.filter(i => i.statut === "En attente").length}
          description="Demandes à traiter"
          icon={Clock}
        />
        <StatCard
          title="Approuvés"
          value={data.filter(i => i.statut === "Approuvé").length}
          description="Ce mois-ci"
          icon={Check}
        />
        <StatCard
          title="Refusés"
          value={data.filter(i => i.statut === "Refusé").length}
          description="Ce mois-ci"
          icon={X}
        />
        <StatCard
          title="Solde moyen"
          value="15j"
          description="Par employé"
          icon={Briefcase}
        />
      </div>

      <div className="space-y-4">
        <FilterBar
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          filters={filterConfig}
          onReset={() => { setSearchTerm(""); setStatusFilter("tous"); }}
          searchPlaceholder="Rechercher employé..."
        />

        <div className="hidden md:block">
          <DataTable
            columns={columns}
            data={filteredData}
            defaultPageSize={10}
          />
        </div>

        {/* --- Mobile View --- */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {filteredData.length === 0 && <div className="text-center py-6 text-muted-foreground">Aucune demande</div>}
          {filteredData.map((row) => (
            <MobileDataCard
              key={row.id}
              title={row.employe}
              subtitle={row.code}
              status={{ label: row.statut, variant: getStatusVariant(row.statut) as any }}
              data={[
                { icon: <Calendar className="h-3.5 w-3.5" />, value: `${row.debut} au ${row.fin}` },
                { icon: <Clock className="h-3.5 w-3.5" />, value: `${row.jours} jours` },
                { icon: <Briefcase className="h-3.5 w-3.5" />, value: row.type },
              ]}
              actions={
                <div className="w-full flex flex-col gap-2 pt-2">
                  {row.statut === "En attente" && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-destructive text-destructive hover:bg-destructive/10"
                        onClick={() => handleAction("reject", row.id)}
                      >
                        Refuser
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={() => handleAction("approve", row.id)}
                      >
                        Approuver
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