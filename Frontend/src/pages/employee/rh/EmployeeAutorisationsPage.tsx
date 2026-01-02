
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileCheck, Plus, Send, Calendar, Clock, CheckCircle, Hourglass, Search, Filter, X } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { generateFormCode } from "@/lib/codification";

// Shared Components
import { FilterBar } from "@/components/shared/FilterBar";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { MobileDataCard } from "@/components/shared/MobileDataCard";

const EmployeeAutorisationsPage = () => {
  // --- États ---
  const [formData, setFormData] = useState({
    typeAutorisation: "",
    date: new Date().toISOString().split('T')[0],
    heureSortie: "",
    heureRetour: "",
    motif: "",
    remarques: ""
  });

  const [mesAutorisations, setMesAutorisations] = useState([
    { id: 1, code: "RH-AU-2024-0020", type: "Sortie personnelle", date: "2024-01-18", heureSortie: "14:00", heureRetour: "16:00", statut: "Approuvé" },
    { id: 2, code: "RH-AU-2024-0023", type: "RDV médical", date: "2024-01-22", heureSortie: "10:00", heureRetour: "12:00", statut: "Approuvé" },
    { id: 3, code: "RH-AU-2024-0025", type: "Démarche administrative", date: "2024-01-25", heureSortie: "09:00", heureRetour: "11:00", statut: "En attente" },
  ]);

  // --- Filtres ---
  const [filterText, setFilterText] = useState("");
  const [filterStatus, setFilterStatus] = useState("tous");

  const filteredAutorisations = mesAutorisations.filter((item) => {
    const matchText =
      item.code.toLowerCase().includes(filterText.toLowerCase()) ||
      item.type.toLowerCase().includes(filterText.toLowerCase());
    const matchStatus = filterStatus === "tous" || filterStatus === "all" ? true : item.statut === filterStatus;

    return matchText && matchStatus;
  });

  // --- Logique ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = generateFormCode("RH", "AUTORISATION");

    const newItem = {
      id: mesAutorisations.length + 1,
      code: code,
      type: formData.typeAutorisation || "Autre",
      date: formData.date,
      heureSortie: formData.heureSortie,
      heureRetour: formData.heureRetour,
      statut: "En attente"
    };

    setMesAutorisations([newItem, ...mesAutorisations]);
    toast.success(`Demande soumise: ${code}`);

    setFormData({
      typeAutorisation: "",
      date: new Date().toISOString().split('T')[0],
      heureSortie: "",
      heureRetour: "",
      motif: "",
      remarques: ""
    });
  };

  const getStatusBadgeVariant = (statut: string) => {
    if (statut === "Approuvé") return "default";
    if (statut === "En attente") return "secondary";
    return "destructive";
  };

  // --- DataTable Config ---
  const columns: Column<any>[] = [
    { header: "Code", accessorKey: "code", className: "font-mono text-xs text-muted-foreground" },
    { header: "Type", accessorKey: "type", className: "font-medium" },
    { header: "Date", accessorKey: "date" },
    { header: "Sortie", accessorKey: "heureSortie" },
    { header: "Retour", accessorKey: "heureRetour" },
    {
      header: "Statut",
      accessorKey: "statut",
      className: "text-right",
      cell: (row) => {
        const variant = getStatusBadgeVariant(row.statut);
        return (
          <Badge variant={variant === 'default' ? 'default' : variant as any}>
            {variant === 'default' && <CheckCircle className="w-3 h-3 mr-1 inline" />}
            {variant === 'secondary' && <Hourglass className="w-3 h-3 mr-1 inline" />}
            {row.statut}
          </Badge>
        )
      }
    }
  ];

  const filterConfig = [
    {
      key: "status",
      label: "Statut",
      value: filterStatus,
      onChange: setFilterStatus,
      options: [
        { label: "Approuvé", value: "Approuvé" },
        { label: "En attente", value: "En attente" },
        { label: "Refusé", value: "Refusé" },
      ]
    }
  ];


  return (
    <div className="container mx-auto p-2 sm:p-4 md:p-6 space-y-6 max-w-5xl pb-20">

      {/* --- En-tête --- */}
      <Card className="border-none shadow-sm bg-muted/30">
        <div className="p-4 flex flex-row items-center gap-2">
          <Button variant="outline" size="icon" className="shrink-0 bg-background" asChild>
            <Link to="/employee">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center shadow-sm shrink-0">
              <FileCheck className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold">Demande d'Autorisation</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">Sorties temporaires et permissions</p>
            </div>
          </div>
        </div>
      </Card>

      {/* --- Formulaire --- */}
      <Card className="shadow-md">
        <CardHeader className="bg-muted/10 pb-4">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Plus className="h-5 w-5 text-primary" />
            Nouvelle demande
          </CardTitle>
          <CardDescription>
            Remplissez le formulaire ci-dessous
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="typeAutorisation">Type d'autorisation</Label>
                <Select
                  value={formData.typeAutorisation}
                  onValueChange={(value) => setFormData({ ...formData, typeAutorisation: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le type..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sortie personnelle">Sortie personnelle</SelectItem>
                    <SelectItem value="RDV médical">RDV médical</SelectItem>
                    <SelectItem value="Démarche administrative">Démarche administrative</SelectItem>
                    <SelectItem value="Urgence familiale">Urgence familiale</SelectItem>
                    <SelectItem value="Formation externe">Formation externe</SelectItem>
                    <SelectItem value="Autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <div className="relative">
                  <Input
                    id="date"
                    type="date"
                    className="pl-9"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                  <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="heureSortie">Heure de sortie</Label>
                <div className="relative">
                  <Input
                    id="heureSortie"
                    type="time"
                    className="pl-9"
                    value={formData.heureSortie}
                    onChange={(e) => setFormData({ ...formData, heureSortie: e.target.value })}
                    required
                  />
                  <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="heureRetour">Heure de retour</Label>
                <div className="relative">
                  <Input
                    id="heureRetour"
                    type="time"
                    className="pl-9"
                    value={formData.heureRetour}
                    onChange={(e) => setFormData({ ...formData, heureRetour: e.target.value })}
                    required
                  />
                  <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="motif">Motif détaillé</Label>
              <Textarea
                id="motif"
                placeholder="Expliquez la raison..."
                className="resize-none"
                value={formData.motif}
                onChange={(e) => setFormData({ ...formData, motif: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="remarques">Remarques (Optionnel)</Label>
              <Textarea
                id="remarques"
                placeholder="Info complémentaire..."
                className="resize-none"
                rows={2}
                value={formData.remarques}
                onChange={(e) => setFormData({ ...formData, remarques: e.target.value })}
              />
            </div>

            <Button type="submit" className="w-full sm:w-auto">
              <Send className="h-4 w-4 mr-2" />
              Soumettre la demande
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* --- Historique & Filtres --- */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Clock className="h-5 w-5 text-muted-foreground" />
          Historique
        </h2>

        <FilterBar
          searchValue={filterText}
          onSearchChange={setFilterText}
          filters={filterConfig}
          onReset={() => { setFilterText(""); setFilterStatus("tous"); }}
          searchPlaceholder="Rechercher..."
        />

        {/* 1. Vue TABLEAU (Desktop) */}
        <div className="hidden md:block">
          <DataTable
            columns={columns}
            data={filteredAutorisations}
            defaultPageSize={10}
          />
        </div>

        {/* 2. Vue CARTES (Mobile) */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {filteredAutorisations.length === 0 && (
            <div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-lg">Aucune demande</div>
          )}
          {filteredAutorisations.map((item) => (
            <MobileDataCard
              key={item.id}
              title={item.type}
              subtitle={item.code}
              status={{ label: item.statut, variant: getStatusBadgeVariant(item.statut) as any }}
              data={[
                { icon: <Calendar className="h-3.5 w-3.5" />, value: item.date },
                { icon: <span className="text-[10px] text-muted-foreground flex items-center w-12"><Clock className="h-3 w-3 mr-1" /> Sortie</span>, value: item.heureSortie },
                { icon: <span className="text-[10px] text-muted-foreground flex items-center w-12"><Clock className="h-3 w-3 mr-1" /> Retour</span>, value: item.heureRetour },
              ]}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmployeeAutorisationsPage;