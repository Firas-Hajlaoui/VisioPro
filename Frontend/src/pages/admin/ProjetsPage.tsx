
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Plus, FolderKanban, Download, FileText, Code, Settings, Eye, Paperclip,
  User, Briefcase, Clock, Upload, MoreHorizontal, Pencil, Trash2, CheckCircle
} from "lucide-react";
import { generateFormCode } from "@/lib/codification";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

// Shared Components
import { StatCard } from "@/components/shared/StatCard";
import { FilterBar } from "@/components/shared/FilterBar";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { MobileDataCard } from "@/components/shared/MobileDataCard";

import type { Project as Projet } from "@/types/project";

const mockProjets: Projet[] = [
  {
    id: 1,
    code: "PRJ-2024-001",
    intitule: "Refonte Site Web",
    client: "Groupe ABC",
    chefProjet: "Karim Idrissi",
    dateDebut: "2024-01-10",
    dateFin: "2024-06-30",
    description: "Refonte complète du portail corporate avec React/Next.js.",
    progression: 65,
    statut: "En cours",
    stats: { devis: 2, fiches: 12, technique: 5, backup: 3 },
    docsList: []
  },
  {
    id: 2,
    code: "PRJ-2024-002",
    intitule: "Audit Sécurité SI",
    client: "Banque Populaire",
    chefProjet: "Sarah Benali",
    dateDebut: "2024-02-15",
    dateFin: "2024-04-15",
    description: "Audit pentesting et revue de conformité ISO 27001.",
    progression: 100,
    statut: "Terminé",
    stats: { devis: 1, fiches: 4, technique: 8, backup: 1 },
    docsList: []
  },
  {
    id: 3,
    code: "PRJ-2024-003",
    intitule: "Déploiement ERP",
    client: "Industrie Maroc",
    chefProjet: "Mohamed Tazi",
    dateDebut: "2023-11-01",
    dateFin: "2024-12-31",
    description: "Migration vers Odoo Enterprise.",
    progression: 35,
    statut: "En pause",
    stats: { devis: 3, fiches: 25, technique: 10, backup: 15 },
    docsList: []
  },
  {
    id: 4,
    code: "PRJ-2024-004",
    intitule: "Application Mobile RH",
    client: "Interne",
    chefProjet: "Karim Idrissi",
    dateDebut: "2024-03-01",
    dateFin: "2024-09-01",
    description: "App pour la gestion des congés et notes de frais.",
    progression: 15,
    statut: "En cours",
    stats: { devis: 0, fiches: 2, technique: 3, backup: 0 },
    docsList: []
  },
];

const documentTypes = [
  { type: "Devis", code: "DEV", icon: FileText },
  { type: "Fiche d'intervention", code: "FI", icon: Paperclip },
  { type: "Document technique", code: "DT", icon: Settings },
  { type: "Backup projet", code: "BKP", icon: Code },
];

export default function ProjetsPage() {
  const [open, setOpen] = useState(false);
  const [docOpen, setDocOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [data, setData] = useState<Projet[]>(mockProjets);
  const [selectedProject, setSelectedProject] = useState<Projet | null>(null);
  const [editingItem, setEditingItem] = useState<Projet | null>(null);

  const [filterText, setFilterText] = useState("");
  const [filterStatus, setFilterStatus] = useState("tous");

  // --- Gestion des Modals ---
  const handleOpenNew = () => { setEditingItem(null); setOpen(true); };
  const handleOpenEdit = (item: Projet) => { setEditingItem(item); setOpen(true); };

  const handleDelete = (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) {
      setData((prev) => prev.filter((item) => item.id !== id));
      toast.success("Projet supprimé.");
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const projectData = {
      intitule: formData.get("intitule") as string,
      client: formData.get("client") as string,
      chefProjet: formData.get("chefProjet") as string,
      dateDebut: formData.get("dateDebut") as string,
      dateFin: formData.get("dateFin") as string,
      description: formData.get("description") as string,
      statut: editingItem ? editingItem.statut : "En cours" as const,
      progression: editingItem ? editingItem.progression : 0,
      documents: editingItem ? editingItem.documents : { devis: 0, fiches: 0, technique: 0, backup: 0 },
    };

    if (editingItem) {
      setData((prev) => prev.map((item) => item.id === editingItem.id ? { ...item, ...projectData } : item));
      toast.success(`Projet modifié: ${editingItem.code}`);
    } else {
      const newProject: Projet = { id: Date.now(), code: generateFormCode("PROJET", "DEVIS"), ...projectData };
      setData([newProject, ...data]);
      toast.success(`Projet créé: ${newProject.code}`);
    }
    setOpen(false);
  };

  const handleDocSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = generateFormCode("PROJET", "DOC_TECHNIQUE");
    toast.success(`Document ajouté: ${code}`);
    setDocOpen(false);
  };

  const handleStatusChange = (id: number, newStatus: "En cours" | "Terminé" | "En pause") => {
    setData((prevData) => prevData.map((p) => p.id === id ? { ...p, statut: newStatus } : p));
    toast.success("Statut mis à jour");
  };

  const openDetails = (projet: Projet) => { setSelectedProject(projet); setDetailsOpen(true); };
  const openAddDoc = (projet: Projet) => { setSelectedProject(projet); setDocOpen(true); };

  const filteredData = data.filter((projet) => {
    const matchText =
      projet.intitule.toLowerCase().includes(filterText.toLowerCase()) ||
      projet.client.toLowerCase().includes(filterText.toLowerCase()) ||
      projet.chefProjet.toLowerCase().includes(filterText.toLowerCase());
    const matchStatus = filterStatus === "tous" || filterStatus === "all" ? true : projet.statut === filterStatus;
    return matchText && matchStatus;
  });

  const getStatusVariant = (statut: string) => {
    switch (statut) {
      case "Terminé": return "default";
      case "En cours": return "outline"; // Changed to outline to differentiate
      case "En pause": return "secondary";
      default: return "outline";
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "2-digit" });
  };

  // --- Configuration Colonnes DataTable ---
  const columns: Column<Projet>[] = [
    { header: "Code", accessorKey: "code", className: "font-mono text-xs text-muted-foreground w-[120px]", sortable: true },
    { header: "Intitulé", accessorKey: "intitule", className: "font-medium max-w-[180px] truncate", sortable: true },
    { header: "Client", accessorKey: "client", sortable: true },
    {
      header: "Chef",
      accessorKey: "chefProjet",
      cell: (p) => <span className="whitespace-nowrap">{p.chefProjet.split(' ')[0]} {p.chefProjet.split(' ')[1]?.charAt(0)}.</span>
    },
    {
      header: "Période",
      className: "text-xs whitespace-nowrap",
      cell: (p) => (
        <div className="flex flex-col">
          <span>{formatDate(p.dateDebut)}</span>
          <span className="text-muted-foreground">{formatDate(p.dateFin)}</span>
        </div>
      )
    },
    {
      header: "Prog.",
      className: "w-[100px]",
      cell: (p) => (
        <div className="flex items-center gap-2">
          <Progress value={p.progression} className="h-2 w-full" />
          <span className="text-xs text-muted-foreground">{p.progression}%</span>
        </div>
      )
    },
    {
      header: "Docs",
      className: "w-[120px] text-center",
      cell: (p) => (
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50" onClick={() => openDetails(p)} title="Voir les documents">
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10" onClick={() => openAddDoc(p)} title="Uploader un document">
              <Upload className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-[10px] text-muted-foreground mt-0.5">
            {(p.stats?.devis || 0) + (p.stats?.fiches || 0) + (p.stats?.technique || 0) + (p.stats?.backup || 0)} fichiers
          </div>
        </div>
      )
    },
    {
      header: "Statut",
      className: "w-[150px]",
      cell: (p) => (
        <Select value={p.statut} onValueChange={(val: any) => handleStatusChange(p.id, val)}>
          <SelectTrigger className="h-8 text-xs w-full bg-transparent border-input">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="En cours">En cours</SelectItem>
            <SelectItem value="Terminé">Terminé</SelectItem>
            <SelectItem value="En pause">En pause</SelectItem>
          </SelectContent>
        </Select>
      )
    },
    {
      header: "",
      cell: (p) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => handleOpenEdit(p)}>
              <Pencil className="mr-2 h-4 w-4" /> Modifier
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleDelete(p.id)} className="text-red-600 focus:text-red-600">
              <Trash2 className="mr-2 h-4 w-4" /> Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
        { label: "En cours", value: "En cours" },
        { label: "Terminé", value: "Terminé" },
        { label: "En pause", value: "En pause" }
      ]
    }
  ];

  return (
    <div className="space-y-6 p-2 sm:p-4 md:p-6 pb-24 sm:pb-10 w-full max-w-[100vw] overflow-x-hidden">

      {/* --- En-tête Responsive --- */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Département Projets</h1>
          <p className="text-sm text-muted-foreground mt-1">Gestion, jalons et documentation</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <Button variant="outline" className="w-full sm:w-auto justify-center">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleOpenNew} className="w-full sm:w-auto justify-center">
                <Plus className="mr-2 h-4 w-4" />
                Nouveau
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg w-[95vw] max-h-[90vh] overflow-y-auto rounded-lg">
              <DialogHeader>
                <DialogTitle>{editingItem ? "Modifier Projet" : "Nouveau Projet"}</DialogTitle>
                <DialogDescription>
                  {editingItem
                    ? `Modification de ${editingItem.code}`
                    : <span>Code: <span className="font-mono bg-muted px-1 rounded">{generateFormCode("PROJET", "DEVIS")}</span></span>
                  }
                </DialogDescription>
              </DialogHeader>
              <form key={editingItem ? editingItem.id : 'new'} onSubmit={handleSubmit} className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="intitule">Intitulé</Label>
                  <Input id="intitule" name="intitule" defaultValue={editingItem?.intitule} placeholder="Nom du projet" required />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="client">Client</Label>
                    <Input id="client" name="client" defaultValue={editingItem?.client} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="chefProjet">Chef de projet</Label>
                    <Select name="chefProjet" defaultValue={editingItem?.chefProjet || "Sara Fassi"}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sara Fassi">Sara Fassi</SelectItem>
                        <SelectItem value="Ahmed Bennani">Ahmed Bennani</SelectItem>
                        <SelectItem value="Youssef Alami">Youssef Alami</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateDebut">Début</Label>
                    <Input type="date" name="dateDebut" id="dateDebut" defaultValue={editingItem?.dateDebut} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateFin">Fin</Label>
                    <Input type="date" name="dateFin" id="dateFin" defaultValue={editingItem?.dateFin} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" defaultValue={editingItem?.description} placeholder="Objectifs..." className="resize-none" />
                </div>

                <DialogFooter className="flex-col sm:flex-row gap-2 mt-4">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)} className="w-full sm:w-auto">Annuler</Button>
                  <Button type="submit" className="w-full sm:w-auto">{editingItem ? "Enregistrer" : "Créer"}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* --- Dialog Ajout Document --- */}
      <Dialog open={docOpen} onOpenChange={setDocOpen}>
        <DialogContent className="sm:max-w-[425px] w-[95vw] rounded-lg">
          <DialogHeader>
            <DialogTitle>Ajouter Document</DialogTitle>
            <DialogDescription className="truncate">
              Projet : {selectedProject?.code}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleDocSubmit} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir..." />
                </SelectTrigger>
                <SelectContent>
                  {documentTypes.map((doc) => (
                    <SelectItem key={doc.code} value={doc.code}>{doc.type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Fichier</Label>
              <Input type="file" />
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full">Ajouter</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* --- Dialog Détails --- */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-xl w-[95vw] max-h-[85vh] overflow-y-auto rounded-lg">
          <DialogHeader>
            <div className="flex flex-wrap items-center gap-2 pr-6">
              <DialogTitle className="line-clamp-2 text-left">{selectedProject?.intitule}</DialogTitle>
              <Badge variant={getStatusVariant(selectedProject?.statut || "") as any} className="whitespace-nowrap">
                {selectedProject?.statut}
              </Badge>
            </div>
            <DialogDescription className="font-mono text-left">
              {selectedProject?.code}
            </DialogDescription>
          </DialogHeader>
          {selectedProject && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Client</Label>
                  <div className="font-medium flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground shrink-0" /> {selectedProject.client}
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Chef de projet</Label>
                  <div className="font-medium flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground shrink-0" /> {selectedProject.chefProjet}
                  </div>
                </div>
              </div>
              <div className="space-y-2 border-t pt-4">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground">Documents associés</Label>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="py-1"><FileText className="h-3 w-3 mr-1" /> Devis: {selectedProject.stats?.devis || 0}</Badge>
                  <Badge variant="outline" className="py-1"><Paperclip className="h-3 w-3 mr-1" /> FI: {selectedProject.stats?.fiches || 0}</Badge>
                  <Badge variant="outline" className="py-1"><Settings className="h-3 w-3 mr-1" /> Tech: {selectedProject.stats?.technique || 0}</Badge>
                  <Badge variant="outline" className="py-1"><Code className="h-3 w-3 mr-1" /> Backup: {selectedProject.stats?.backup || 0}</Badge>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setDetailsOpen(false)} className="w-full sm:w-auto">Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- KPIs --- */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Projets actifs"
          value={data.filter(p => p.statut === "En cours").length}
          description="En cours de réalisation"
          icon={FolderKanban}
        />
        <StatCard
          title="Terminés"
          value={data.filter(p => p.statut === "Terminé").length}
          description="Projets livrés"
          icon={CheckCircle}
        />
        <StatCard
          title="Documents"
          value="234"
          description="Documents archivés"
          icon={FileText}
        />
        <StatCard
          title="Moyenne Progression"
          value={`${Math.round(data.reduce((acc, curr) => acc + curr.progression, 0) / data.length)}%`}
          description="Sur l'ensemble des projets"
        />
      </div>

      <Tabs defaultValue="projets" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="projets">Projets</TabsTrigger>
          <TabsTrigger value="documents">Docs</TabsTrigger>
        </TabsList>

        <TabsContent value="projets" className="space-y-4">
          {/* --- Component FilterBar --- */}
          <FilterBar
            searchValue={filterText}
            onSearchChange={setFilterText}
            filters={filterConfig}
            onReset={() => { setFilterText(""); setFilterStatus("tous"); }}
          />

          {/* --- Vue Tableau (Desktop) --- */}
          <div className="hidden md:block">
            <DataTable
              data={filteredData}
              columns={columns}
              title="Liste des Projets"
              defaultPageSize={10}
            />
          </div>

          {/* --- Vue Cartes (Mobile) --- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
            {filteredData.length === 0 && (
              <div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-lg col-span-full">Aucun résultat</div>
            )}
            {filteredData.map((projet) => (
              <MobileDataCard
                key={projet.id}
                title={projet.intitule}
                subtitle={projet.code}
                status={{ label: projet.statut, variant: getStatusVariant(projet.statut) as any }}
                data={[
                  { icon: <Briefcase className="h-3.5 w-3.5" />, value: projet.client },
                  { icon: <User className="h-3.5 w-3.5" />, value: projet.chefProjet },
                  { icon: <Clock className="h-3.5 w-3.5" />, label: "Fin", value: formatDate(projet.dateFin) },
                  { label: "Progression", value: `${projet.progression}%` },
                ]}
                actions={
                  <>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => openDetails(projet)}>
                      <Eye className="h-4 w-4 text-blue-600" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => openAddDoc(projet)}>
                      <Upload className="h-4 w-4 text-primary" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleOpenEdit(projet)}>Modifier</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(projet.id)} className="text-red-600">Supprimer</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                }
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5 text-primary" />
                Référentiel
              </CardTitle>
              <CardDescription>Standards ISO 9001</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
                {documentTypes.map((doc) => (
                  <Card key={doc.code} className="border hover:border-primary/50 transition-colors cursor-pointer">
                    <CardContent className="flex flex-col items-center justify-center p-4">
                      <doc.icon className="h-6 w-6 text-primary mb-2" />
                      <h3 className="font-semibold text-center text-xs sm:text-sm leading-tight">{doc.type}</h3>
                      <code className="text-[10px] bg-muted px-1.5 py-0.5 rounded mt-2 text-muted-foreground">{doc.code}</code>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}