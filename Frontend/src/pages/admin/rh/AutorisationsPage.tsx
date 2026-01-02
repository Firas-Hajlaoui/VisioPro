
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
  Plus, KeyRound, Download, Check, X, Calendar, Clock, Briefcase, Search,
  MoreHorizontal, Pencil, Trash2, Filter
} from "lucide-react";
import { generateFormCode } from "@/lib/codification";
import { toast } from "sonner";

// Shared Components
import { StatCard } from "@/components/shared/StatCard";
import { FilterBar } from "@/components/shared/FilterBar";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { MobileDataCard } from "@/components/shared/MobileDataCard";

import type { Authorization } from "@/types/rh";

const initialData: Authorization[] = [
  { id: 1, code: "RH-AUT-2024-0078", employe: "Ahmed Bennani", date: "2024-12-20", duree: "2h", type: "Sortie anticipée", statut: "Approuvé" },
  { id: 2, code: "RH-AUT-2024-0077", employe: "Sara Fassi", date: "2024-12-19", duree: "3h", type: "Arrivée tardive", statut: "En attente" },
  { id: 3, code: "RH-AUT-2024-0076", employe: "Youssef Alami", date: "2024-12-18", duree: "1h", type: "Pause prolongée", statut: "Approuvé" },
  { id: 4, code: "RH-AUT-2024-0075", employe: "Karim Idrissi", date: "2024-12-17", duree: "4h", type: "Absence personnelle", statut: "Refusé" },
  { id: 5, code: "RH-AUT-2024-0074", employe: "Fatima Zohra", date: "2024-12-20", duree: "1h", type: "Sortie anticipée", statut: "En attente" },
];

export default function AutorisationsPage() {
  const [data, setData] = useState<Authorization[]>(initialData);
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Authorization | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("tous");

  // --- Handlers ---
  const handleOpenNew = () => {
    setEditingItem(null);
    setOpen(true);
  };

  const handleOpenEdit = (item: Authorization) => {
    setEditingItem(item);
    setOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Voulez-vous vraiment supprimer cette demande ?")) {
      setData((prev) => prev.filter((item) => item.id !== id));
      toast.success("Demande supprimée.");
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const dureeRaw = formData.get("duree") as string;
    const dureeFormatted = dureeRaw.includes("h") ? dureeRaw : `${dureeRaw}h`;

    const authData = {
      employe: formData.get("employe") as string,
      type: formData.get("type") as string,
      date: formData.get("date") as string,
      duree: dureeFormatted,
      motif: formData.get("motif") as string,
      statut: editingItem ? editingItem.statut : "En attente" as const,
    };

    if (editingItem) {
      setData((prev) => prev.map((item) =>
        item.id === editingItem.id ? { ...item, ...authData } : item
      ));
      toast.success(`Autorisation modifiée: ${editingItem.code}`);
    } else {
      const newItem: Authorization = {
        id: Date.now(),
        code: generateFormCode("RH", "AUTORISATION"),
        ...authData
      };
      setData([newItem, ...data]);
      toast.success(`Autorisation créée: ${newItem.code}`);
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
    if (action === "approve") toast.success(`Autorisation approuvée.`);
    else toast.error(`Autorisation refusée.`);
  };

  // --- Filters ---
  const filteredData = data.filter((item) => {
    const matchesSearch = item.employe.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = dateFilter ? item.date === dateFilter : true;
    const matchesStatus = statusFilter === "tous" || statusFilter === "all" ? true : item.statut === statusFilter;
    return matchesSearch && matchesDate && matchesStatus;
  });

  const getStatusVariant = (statut: string) => {
    if (statut === "Approuvé") return "default";
    if (statut === "Refusé") return "destructive";
    return "secondary";
  };

  // --- DataTable Config ---
  const columns: Column<Authorization>[] = [
    { header: "Code", accessorKey: "code", className: "font-mono text-xs text-muted-foreground w-[150px]" },
    { header: "Employé", accessorKey: "employe", className: "font-medium" },
    { header: "Date", accessorKey: "date" },
    { header: "Durée", accessorKey: "duree" },
    { header: "Type", accessorKey: "type" },
    {
      header: "Statut",
      accessorKey: "statut",
      cell: (row) => <Badge variant={getStatusVariant(row.statut) as any}>{row.statut}</Badge>
    },
    {
      header: "Actions",
      className: "text-right",
      cell: (row) => (
        <div className="flex justify-end gap-2 items-center">
          {row.statut === "En attente" && (
            <>
              <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => handleAction("approve", row.id)} title="Approuver">
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
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Gestion des Autorisations</h1>
          <p className="text-sm text-muted-foreground">Demandes d'autorisations exceptionnelles</p>
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
                <DialogTitle>{editingItem ? "Modifier Demande" : "Nouvelle Demande"}</DialogTitle>
                <DialogDescription className="text-xs sm:text-sm">
                  {editingItem
                    ? `Modification de ${editingItem.code}`
                    : <span>Code: <span className="font-mono bg-muted px-1 rounded">{generateFormCode("RH", "AUTORISATION")}</span></span>
                  }
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="employe">Employé</Label>
                  <Select name="employe" defaultValue={editingItem?.employe || "Ahmed Bennani"}>
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
                  <Label htmlFor="type">Type d'autorisation</Label>
                  <Select name="type" defaultValue={editingItem?.type || "Sortie anticipée"}>
                    <SelectTrigger>
                      <SelectValue placeholder="Type..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sortie anticipée">Sortie anticipée</SelectItem>
                      <SelectItem value="Arrivée tardive">Arrivée tardive</SelectItem>
                      <SelectItem value="Pause prolongée">Pause prolongée</SelectItem>
                      <SelectItem value="Absence personnelle">Absence personnelle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input type="date" name="date" id="date" defaultValue={editingItem?.date} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duree">Durée (heures)</Label>
                    <Input
                      type="number"
                      name="duree"
                      id="duree"
                      placeholder="2"
                      min="1"
                      max="8"
                      defaultValue={editingItem?.duree.replace('h', '')}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="motif">Motif</Label>
                  <Textarea
                    name="motif"
                    id="motif"
                    placeholder="Raison de la demande..."
                    className="resize-none"
                    rows={3}
                    defaultValue={editingItem?.motif}
                  />
                </div>
                <DialogFooter className="flex-col sm:flex-row gap-2 mt-4">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)} className="w-full sm:w-auto">
                    Annuler
                  </Button>
                  <Button type="submit" className="w-full sm:w-auto">
                    {editingItem ? "Enregistrer" : "Soumettre"}
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
          title="Ce mois"
          value={data.length}
          description="Demandes d'autorisations"
          icon={KeyRound}
        />
        <StatCard
          title="Approuvées"
          value={data.filter(i => i.statut === "Approuvé").length}
          description="Demandes validées"
          icon={Check}
        />
        <StatCard
          title="Heures autorisées"
          value={`${data.filter(i => i.statut === "Approuvé").reduce((acc, curr) => acc + parseInt(curr.duree), 0)}h`}
          description="Total ce mois"
          icon={Clock}
        />
      </div>

      <div className="space-y-4">
        <FilterBar
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          filters={filterConfig}
          onReset={() => { setSearchTerm(""); setStatusFilter("tous"); setDateFilter(""); }}
          searchPlaceholder="Rechercher par employé..."
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
          {filteredData.length === 0 && <div className="text-center py-6 text-muted-foreground">Aucune demande</div>}
          {filteredData.map((row) => (
            <MobileDataCard
              key={row.id}
              title={row.employe}
              subtitle={row.code}
              status={{ label: row.statut, variant: getStatusVariant(row.statut) as any }}
              data={[
                { icon: <Calendar className="h-3.5 w-3.5" />, value: row.date },
                { icon: <Clock className="h-3.5 w-3.5" />, value: row.duree },
                { icon: <Briefcase className="h-3.5 w-3.5" />, value: row.type },
              ]}
              actions={
                <div className="w-full pt-2 flex flex-col gap-2">
                  {row.statut === "En attente" && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 border-destructive text-destructive hover:bg-destructive/10" onClick={() => handleAction("reject", row.id)}>
                        Refuser
                      </Button>
                      <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => handleAction("approve", row.id)}>
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