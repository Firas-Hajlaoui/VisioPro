
import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  FolderKanban,
  Plus,
  Clock,
  Briefcase,
  AlertCircle,
  FileText,
  Eye,
  Upload,
  Paperclip,
  Download,
  Ban,
  PauseCircle
} from "lucide-react";
import { toast } from "sonner";
import { generateFormCode } from "@/lib/codification";

import type { Project as Projet, ProjectDoc } from "@/types/project";

// Shared Components
import { StatCard } from "@/components/shared/StatCard";
import { FilterBar } from "@/components/shared/FilterBar";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { MobileDataCard } from "@/components/shared/MobileDataCard";

const mockProjets: Projet[] = [
  {
    id: 1,
    code: "PRJ-DEV-2024-0034",
    intitule: "Automatisation ligne de production",
    client: "COSUMAR",
    chefProjet: "Moi",
    dateDebut: "2024-10-01",
    dateFin: "2025-03-15",
    progression: 65,
    statut: "En cours",
    docsList: [
      { id: "d1", name: "Cahier des charges.pdf", type: "Technique", date: "2024-10-01", size: "2.4 MB" }
    ],
  },
  {
    id: 2,
    code: "PRJ-DEV-2024-0033",
    intitule: "Système SCADA usine Khouribga",
    client: "OCP",
    chefProjet: "Ahmed Bennani",
    dateDebut: "2024-08-15",
    dateFin: "2025-01-30",
    progression: 85,
    statut: "En cours",
    docsList: []
  },
  {
    id: 3,
    code: "PRJ-DEV-2024-0032",
    intitule: "Rénovation automates gare",
    client: "ONCF",
    chefProjet: "Moi",
    dateDebut: "2024-06-01",
    dateFin: "2024-12-15",
    progression: 100,
    statut: "Terminé",
    docsList: []
  },
  {
    id: 4,
    code: "PRJ-DEV-2024-0035",
    intitule: "Etude faisabilité R&D",
    client: "Internal",
    chefProjet: "Moi",
    dateDebut: "2024-11-01",
    dateFin: "2024-12-31",
    progression: 10,
    statut: "En pause",
    docsList: []
  }
];

export default function EmployeeProjetsPage() {
  const [projets, setProjets] = useState<Projet[]>(mockProjets);

  // Modals
  const [createOpen, setCreateOpen] = useState(false);
  const [viewDocsOpen, setViewDocsOpen] = useState(false);
  const [addDocOpen, setAddDocOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<Projet | null>(null);

  // Formulaires
  const [formData, setFormData] = useState({
    intitule: "",
    client: "",
    dateDebut: new Date().toISOString().split('T')[0],
    dateFin: "",
    description: ""
  });

  const [docFormData, setDocFormData] = useState({
    name: "",
    type: "Autre" as ProjectDoc["type"]
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filtres
  const [filterText, setFilterText] = useState("");
  const [filterStatus, setFilterStatus] = useState("tous");

  // --- Logique ---
  const filteredProjets = projets.filter((projet) => {
    const matchText =
      projet.intitule.toLowerCase().includes(filterText.toLowerCase()) ||
      projet.client.toLowerCase().includes(filterText.toLowerCase()) ||
      projet.code.toLowerCase().includes(filterText.toLowerCase());
    const matchStatus = filterStatus === "tous" || filterStatus === "all" ? true : projet.statut.toLowerCase() === filterStatus.toLowerCase();
    return matchText && matchStatus;
  });

  const handleStatusChange = (id: number, newStatus: Projet["statut"]) => {
    setProjets((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, statut: newStatus } : p
      )
    );
    toast.success(`Statut mis à jour : ${newStatus}`);
  };

  const getStatusVariant = (statut: string) => {
    switch (statut) {
      case "Terminé": return "default"; // green-like usually default is primary (black/dark) or I should use custom logic in Badge if I want specific colors, but Badge usually supports variants like default/secondary/outline/destructive
      case "En cours": return "outline";
      case "En pause": return "secondary";
      case "Annulé": return "destructive";
      default: return "secondary";
    }
  };

  const getDocTypeIcon = (type: string) => {
    switch (type) {
      case 'Devis': return <FileText className="h-4 w-4 text-orange-500" />;
      case 'Technique': return <FolderKanban className="h-4 w-4 text-blue-500" />;
      default: return <Paperclip className="h-4 w-4 text-gray-500" />;
    }
  };

  // --- Handlers Création / Docs ---
  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    const code = generateFormCode("PROJET");

    const newProjet: Projet = {
      id: projets.length + 1,
      code: code,
      intitule: formData.intitule,
      client: formData.client,
      chefProjet: "Moi",
      dateDebut: formData.dateDebut,
      dateFin: formData.dateFin || "Non définie",
      progression: 0,
      statut: "En cours",
      docsList: []
    };

    setProjets([newProjet, ...projets]);
    toast.success(`Projet créé: ${code}`);
    setCreateOpen(false);
    setFormData({ intitule: "", client: "", dateDebut: new Date().toISOString().split('T')[0], dateFin: "", description: "" });
  };

  const handleOpenDocs = (projet: Projet) => {
    setCurrentProject(projet);
    setViewDocsOpen(true);
  };

  const handleOpenAddDoc = (projet: Projet) => {
    setCurrentProject(projet);
    setDocFormData({ name: "", type: "Autre" });
    setAddDocOpen(true);
  };

  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProject) return;

    const newDoc: ProjectDoc = {
      id: Math.random().toString(36).substr(2, 9),
      name: docFormData.name || "Nouveau document",
      type: docFormData.type,
      date: new Date().toISOString().split('T')[0],
      size: "200.0 MB"
    };

    const updatedProjects = projets.map(p => {
      if (p.id === currentProject.id) {
        return { ...p, docsList: [...p.docsList, newDoc] };
      }
      return p;
    });

    setProjets(updatedProjects);
    setCurrentProject({ ...currentProject, docsList: [...currentProject.docsList, newDoc] });
    toast.success("Document ajouté");
    setAddDocOpen(false);
  };

  // --- DataTable Columns ---
  const columns: Column<Projet>[] = [
    {
      header: "Projet",
      accessorKey: "intitule",
      cell: (p) => (
        <div>
          <div className="font-medium">{p.intitule}</div>
          <div className="text-xs text-muted-foreground font-mono">{p.code}</div>
        </div>
      )
    },
    { header: "Client", accessorKey: "client" },
    {
      header: "Dates",
      cell: (p) => (
        <div className="text-xs text-muted-foreground">
          {p.dateDebut} <br /> {p.dateFin}
        </div>
      )
    },
    {
      header: "Progression",
      accessorKey: "progression",
      className: "w-[150px]",
      cell: (p) => (
        <div className="space-y-1">
          <div className="flex justify-between text-xs"><span>{p.progression}%</span></div>
          <Progress value={p.progression} className="h-2 w-full" />
        </div>
      )
    },
    {
      header: "Documents",
      className: "text-center",
      cell: (p) => (
        <div className="flex gap-2 justify-center">
          <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => handleOpenDocs(p)}>
            <Eye className="h-4 w-4 text-blue-600" />
          </Button>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => handleOpenAddDoc(p)}>
            <Upload className="h-4 w-4 text-green-600" />
          </Button>
          {(p.docsList?.length || 0) > 0 && (
            <Badge variant="secondary" className="h-8 px-2">{p.docsList?.length}</Badge>
          )}
        </div>
      )
    },
    {
      header: "Statut",
      accessorKey: "statut",
      className: "text-right w-[160px]",
      cell: (p) => (
        <div className="flex justify-end">
          <Select
            value={p.statut}
            onValueChange={(val: any) => handleStatusChange(p.id, val)}
          >
            <SelectTrigger className={`h-8 w-[140px] text-xs font-medium border-transparent`}>
              <div className="flex items-center gap-2">
                <Badge variant={getStatusVariant(p.statut) as any}>{p.statut}</Badge>
                {/* Small arrow implies dropdown */}
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="En cours">En cours</SelectItem>
              <SelectItem value="En pause">En pause</SelectItem>
              <SelectItem value="Terminé">Terminé</SelectItem>
              <SelectItem value="Annulé">Annulé</SelectItem>
            </SelectContent>
          </Select>
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
        { label: "En cours", value: "En cours" },
        { label: "En pause", value: "En pause" },
        { label: "Terminé", value: "Terminé" },
        { label: "Annulé", value: "Annulé" },
      ]
    }
  ];

  return (
    <div className="container mx-auto p-2 sm:p-4 md:p-6 space-y-6 max-w-5xl pb-20">

      {/* --- En-tête --- */}
      <Card className="border-none shadow-sm bg-muted/30">
        <div className="p-4 flex flex-row items-center gap-4">
          <Button variant="outline" size="icon" className="shrink-0 bg-background" asChild>
            <Link to="/employee">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm shrink-0">
              <FolderKanban className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold leading-tight">Mes Projets</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">Suivi des tâches et documentation</p>
            </div>
          </div>
        </div>
      </Card>

      {/* --- KPIs --- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Projets Actifs"
          value={projets.filter(p => p.statut === "En cours").length}
          description="En cours de traitement"
          icon={Clock}
        />
        <StatCard
          title="En Pause"
          value={projets.filter(p => p.statut === "En pause").length}
          description="Suspendus"
          icon={AlertCircle}
        />
        <StatCard
          title="Progression Moy."
          value={`${Math.round(projets.reduce((acc, curr) => acc + curr.progression, 0) / projets.length)}%`}
          description="Globale"
          icon={Briefcase}
        />
      </div>

      {/* --- Actions & Filtres --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700">
              <Plus className="h-4 w-4 mr-2" /> Nouveau Projet
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg w-[95vw] rounded-lg">
            <DialogHeader>
              <DialogTitle>Créer un nouveau projet</DialogTitle>
              <DialogDescription>Code: {generateFormCode("PROJET")}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateProject} className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Intitulé *</Label>
                <Input value={formData.intitule} onChange={(e) => setFormData({ ...formData, intitule: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Client *</Label>
                <Input value={formData.client} onChange={(e) => setFormData({ ...formData, client: e.target.value })} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Début</Label>
                  <Input type="date" value={formData.dateDebut} onChange={(e) => setFormData({ ...formData, dateDebut: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Fin (est.)</Label>
                  <Input type="date" value={formData.dateFin} onChange={(e) => setFormData({ ...formData, dateFin: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description *</Label>
                <Input type="text" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
              </div>
              <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">Créer</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Component FilterBar placed after the button to separate concerns or keep it together? The previous one had it separate. 
          I will place FilterBar just below the button or integrate it. 
          Actually FilterBar is a block level element. 
          I'll use it to replace the manual search/select inputs. */}
      <FilterBar
        searchValue={filterText}
        onSearchChange={setFilterText}
        filters={filterConfig}
        onReset={() => { setFilterText(""); setFilterStatus("tous"); }}
      />


      {/* --- Liste (Responsive) --- */}
      <div className="space-y-4">
        {/* Vue Desktop */}
        <div className="hidden md:block">
          <DataTable
            columns={columns}
            data={filteredProjets}
            defaultPageSize={5}
          />
        </div>

        {/* Vue Mobile */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {filteredProjets.map((projet) => (
            <MobileDataCard
              key={projet.id}
              title={projet.intitule}
              subtitle={projet.code}
              status={{ label: projet.statut, variant: getStatusVariant(projet.statut) as any }}
              data={[
                { icon: <Briefcase className="h-3.5 w-3.5" />, value: projet.client },
                { icon: <Clock className="h-3.5 w-3.5" />, label: "Fin", value: projet.dateFin },
                { label: "Avancement", value: `${projet.progression}%` },
              ]}
              actions={
                <div className="grid grid-cols-2 gap-2 w-full pt-2">
                  <Button variant="outline" size="sm" onClick={() => handleOpenDocs(projet)}>
                    <Eye className="h-3.5 w-3.5 mr-2" />
                    Docs ({projet.docsList.length})
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleOpenAddDoc(projet)}>
                    <Upload className="h-3.5 w-3.5 mr-2" />
                    Ajouter
                  </Button>
                  {/* Status Change Dropdown on Mobile too? Maybe just stick to viewing for now or add a small dropdown. 
                            The original handled status change in the card header. 
                            I'll leave it simple for now or better yet add it.
                         */}
                </div>
              }
            />
          ))}
        </div>
      </div>

      {/* --- MODAL: VOIR LES DOCUMENTS --- */}
      <Dialog open={viewDocsOpen} onOpenChange={setViewDocsOpen}>
        <DialogContent className="sm:max-w-md w-[95vw] rounded-lg">
          <DialogHeader>
            <DialogTitle>Documents du projet</DialogTitle>
            <DialogDescription>{currentProject?.code}</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2 max-h-[60vh] overflow-y-auto">
            {currentProject?.docsList.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground border-2 border-dashed rounded-lg">
                <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                Aucun document disponible
              </div>
            ) : (
              currentProject?.docsList.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg bg-muted/20 hover:bg-muted/40 transition">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="p-2 bg-background rounded border">
                      {getDocTypeIcon(doc.type)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{doc.name}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-2">
                        <span>{doc.type}</span> • <span>{doc.date}</span>
                      </p>
                    </div>
                  </div>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-600">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
          <DialogFooter className="sm:justify-start">
            <Button variant="secondary" onClick={() => setViewDocsOpen(false)} className="w-full">Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- MODAL: AJOUTER UN DOCUMENT --- */}
      <Dialog open={addDocOpen} onOpenChange={setAddDocOpen}>
        <DialogContent className="sm:max-w-md w-[95vw] rounded-lg">
          <DialogHeader>
            <DialogTitle>Ajouter un document</DialogTitle>
            <DialogDescription>Pour: {currentProject?.intitule}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddDocument} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Type de document</Label>
              <Select
                value={docFormData.type}
                onValueChange={(val: any) => setDocFormData({ ...docFormData, type: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Devis">Devis</SelectItem>
                  <SelectItem value="Technique">Technique</SelectItem>
                  <SelectItem value="Administratif">Administratif</SelectItem>
                  <SelectItem value="Autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Nom du fichier (Optionnel)</Label>
              <Input
                placeholder="Ex: Plan v2.pdf"
                value={docFormData.name}
                onChange={(e) => setDocFormData({ ...docFormData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Fichier</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition" onClick={() => fileInputRef.current?.click()}>
                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">Cliquez pour upload</span>
                <input ref={fileInputRef} type="file" className="hidden" />
              </div>
            </div>
            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">
              Enregistrer
            </Button>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}