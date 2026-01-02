
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Plus, GraduationCap, Download, Users, Calendar, Clock,
  UserCheck, Briefcase, BookOpen, Trash2, Pencil, MoreHorizontal
} from "lucide-react";
import { generateFormCode } from "@/lib/codification";
import { toast } from "sonner";

// Shared Components
import { StatCard } from "@/components/shared/StatCard";
import { FilterBar } from "@/components/shared/FilterBar";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { MobileDataCard } from "@/components/shared/MobileDataCard";

import type { TrainingSession as Session } from "@/types/formation";

// Données initiales
const initialData: Session[] = [
  { id: 1, code: "FOR-SES-2024-0012", titre: "Sécurité au travail", formateur: "Dr. Hassan", date: "2024-12-15", participants: 12, duree: "8h", statut: "Terminée" },
  { id: 2, code: "FOR-SES-2024-0011", titre: "Excel Avancé", formateur: "Mme. Khadija", date: "2024-12-20", participants: 8, duree: "16h", statut: "En cours" },
  { id: 3, code: "FOR-SES-2024-0010", titre: "Gestion de projet", formateur: "M. Rachid", date: "2025-01-10", participants: 15, duree: "24h", statut: "Planifiée" },
  { id: 4, code: "FOR-SES-2024-0009", titre: "ISO 9001:2015", formateur: "Expert externe", date: "2024-12-01", participants: 20, duree: "16h", statut: "Terminée" },
  { id: 5, code: "FOR-SES-2024-0013", titre: "Leadership & Management", formateur: "Coach Sarah", date: "2025-01-15", participants: 10, duree: "12h", statut: "Planifiée" },
];

export default function FormationPage() {
  const [data, setData] = useState<Session[]>(initialData);
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Session | null>(null);

  // --- États de filtrage ---
  const [filterText, setFilterText] = useState("");
  const [filterStatus, setFilterStatus] = useState("tous");

  // --- Actions ---
  const handleOpenNew = () => {
    setEditingItem(null);
    setOpen(true);
  };

  const handleOpenEdit = (item: Session) => {
    setEditingItem(item);
    setOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Voulez-vous vraiment supprimer cette session de formation ?")) {
      setData((prev) => prev.filter((item) => item.id !== id));
      toast.success("Session supprimée.");
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const dureeRaw = formData.get("duree") as string;
    const dureeFormatted = dureeRaw.includes("h") ? dureeRaw : `${dureeRaw}h`;

    const sessionData = {
      titre: formData.get("titre") as string,
      formateur: formData.get("formateur") as string,
      date: formData.get("date") as string,
      participants: parseInt(formData.get("participants") as string) || 0,
      duree: dureeFormatted,
      description: formData.get("description") as string,
      statut: editingItem ? editingItem.statut : "Planifiée" as const,
    };

    if (editingItem) {
      setData((prev) => prev.map((item) =>
        item.id === editingItem.id ? { ...item, ...sessionData } : item
      ));
      toast.success(`Session modifiée: ${editingItem.code}`);
    } else {
      const newSession: Session = {
        id: Date.now(),
        code: generateFormCode("FORMATION", "SESSION"),
        ...sessionData
      };
      setData([newSession, ...data]);
      toast.success(`Formation créée: ${newSession.code}`);
    }
    setOpen(false);
  };

  // --- Filtrage ---
  const filteredData = data.filter((item) => {
    const matchText =
      item.titre.toLowerCase().includes(filterText.toLowerCase()) ||
      item.formateur.toLowerCase().includes(filterText.toLowerCase());
    const matchStatus = filterStatus === "tous" || filterStatus === "all" ? true : item.statut === filterStatus;
    return matchText && matchStatus;
  });

  const getStatusVariant = (statut: string) => {
    switch (statut) {
      case "Terminée": return "default";
      case "En cours": return "secondary";
      case "Planifiée": return "outline";
      default: return "default"; // Changed simplified return
    }
  };

  // --- Configuration Table ---
  const columns: Column<Session>[] = [
    { header: "Code", accessorKey: "code", className: "font-mono text-xs text-muted-foreground w-[150px]" },
    { header: "Titre", accessorKey: "titre", className: "font-medium" },
    { header: "Formateur", accessorKey: "formateur" },
    { header: "Date", accessorKey: "date", className: "w-[120px]" },
    {
      header: "Participants",
      accessorKey: "participants",
      className: "w-[120px]",
      cell: (row) => (
        <div className="flex items-center gap-1">
          <Users className="h-3 w-3 text-muted-foreground" />
          <span>{row.participants}</span>
        </div>
      )
    },
    { header: "Durée", accessorKey: "duree", className: "w-[80px]" },
    {
      header: "Statut",
      accessorKey: "statut",
      className: "w-[120px]",
      cell: (row) => (
        <Badge variant={getStatusVariant(row.statut) as any}>
          {row.statut}
        </Badge>
      )
    },
    {
      header: "",
      cell: (row) => (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(row)} className="h-8 w-8">
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleDelete(row.id)} className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50">
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
      value: filterStatus,
      onChange: setFilterStatus,
      options: [
        { label: "Planifiée", value: "Planifiée" },
        { label: "En cours", value: "En cours" },
        { label: "Terminée", value: "Terminée" },
      ]
    }
  ];

  return (
    <div className="space-y-6 p-2 sm:p-4 md:p-6 pb-20 sm:pb-10">
      {/* --- En-tête --- */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Département Formation</h1>
          <p className="text-sm text-muted-foreground">Planification et suivi des compétences</p>
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
                Nouvelle
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg w-[95vw] rounded-lg">
              <DialogHeader>
                <DialogTitle>{editingItem ? "Modifier la Session" : "Nouvelle Session"}</DialogTitle>
                <DialogDescription>
                  {editingItem
                    ? `Modification de ${editingItem.code}`
                    : <span>Code: <span className="font-mono bg-muted px-1 rounded">{generateFormCode("FORMATION", "SESSION")}</span></span>
                  }
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="titre">Titre de la formation</Label>
                  <Input id="titre" name="titre" defaultValue={editingItem?.titre} placeholder="Ex: Sécurité au travail" required />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="formateur">Formateur</Label>
                    <Input id="formateur" name="formateur" defaultValue={editingItem?.formateur} placeholder="Nom du formateur" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duree">Durée (heures)</Label>
                    <Input
                      type="number"
                      id="duree"
                      name="duree"
                      defaultValue={editingItem?.duree.replace('h', '')}
                      placeholder="8"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input type="date" id="date" name="date" defaultValue={editingItem?.date} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="participants">Participants max</Label>
                    <Input type="number" id="participants" name="participants" defaultValue={editingItem?.participants} placeholder="20" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" defaultValue={editingItem?.description} placeholder="Objectifs..." />
                </div>
                <DialogFooter className="flex-col sm:flex-row gap-2 mt-2">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)} className="w-full sm:w-auto">
                    Annuler
                  </Button>
                  <Button type="submit" className="w-full sm:w-auto">
                    {editingItem ? "Enregistrer" : "Créer"}
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
          title="Sessions planifiées"
          value={data.filter(d => d.statut === "Planifiée").length}
          description="À venir"
          icon={Calendar}
        />
        <StatCard
          title="En cours"
          value={data.filter(d => d.statut === "En cours").length}
          description="Formations actives"
          icon={BookOpen}
        />
        <StatCard
          title="Participants"
          value={data.reduce((acc, curr) => acc + curr.participants, 0)}
          description="Total inscrits"
          icon={Users}
        />
        <StatCard
          title="Heures Dispensées"
          value="480h"
          description="Cumul annuel"
          icon={Clock}
        />
      </div>

      <div className="space-y-4">
        <FilterBar
          searchValue={filterText}
          onSearchChange={setFilterText}
          filters={filterConfig}
          onReset={() => { setFilterText(""); setFilterStatus("tous"); }}
          searchPlaceholder="Rechercher formation..."
        />

        {/* --- 1. Vue Tableau (Desktop) --- */}
        <div className="hidden md:block">
          <DataTable
            columns={columns}
            data={filteredData}
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
              title={row.titre}
              subtitle={row.code}
              status={{ label: row.statut, variant: getStatusVariant(row.statut) as any }}
              data={[
                { icon: <UserCheck className="h-3.5 w-3.5" />, value: row.formateur },
                { icon: <Calendar className="h-3.5 w-3.5" />, value: row.date },
                { icon: <Users className="h-3.5 w-3.5" />, value: `${row.participants} pers.` },
                { icon: <Clock className="h-3.5 w-3.5" />, value: row.duree },
              ]}
              actions={
                <div className="flex gap-2 justify-end w-full pt-2">
                  <Button variant="outline" size="sm" onClick={() => handleOpenEdit(row)}>
                    Modifier
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(row.id)} className="text-red-600">
                    Supprimer
                  </Button>
                </div>
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}