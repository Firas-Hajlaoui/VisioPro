
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, Plus, Send, Calendar, Briefcase, CheckCircle, Hourglass, Search, X } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { generateFormCode } from "@/lib/codification";

// Shared Components
import { FilterBar } from "@/components/shared/FilterBar";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { MobileDataCard } from "@/components/shared/MobileDataCard";

const EmployeeTempsPage = () => {
  // --- État du formulaire ---
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    heureArrivee: "",
    heureDepart: "",
    typeJournee: "",
    localisation: "",
    remarques: ""
  });

  // --- Données Mockées ---
  const [mesHeures, setMesHeures] = useState([
    { id: 1, code: "RH-TT-2024-0015", date: "2024-01-15", heures: "8h", type: "Journée normale", statut: "Validé" },
    { id: 2, code: "RH-TT-2024-0016", date: "2024-01-16", heures: "7h30", type: "Télétravail", statut: "En attente" },
    { id: 3, code: "RH-TT-2024-0017", date: "2024-01-17", heures: "8h", type: "Déplacement", statut: "En attente" },
    { id: 4, code: "RH-TT-2024-0018", date: "2024-01-18", heures: "4h", type: "Formation", statut: "Validé" },
  ]);

  // --- Filtres ---
  const [filterDate, setFilterDate] = useState("");
  const [filterType, setFilterType] = useState("tous");

  const filteredData = mesHeures.filter((item) => {
    const matchDate = filterDate ? item.date === filterDate : true;
    const matchType = filterType === "tous" || filterType === "all" ? true : item.type === filterType;
    return matchDate && matchType;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = generateFormCode("RH", "TEMPS_TRAVAIL");

    // Simulation d'ajout
    const newEntry = {
      id: mesHeures.length + 1,
      code: code,
      date: formData.date,
      heures: "0h", // Calculer la durée réelle ici normalement
      type: formData.typeJournee || "Non spécifié",
      statut: "En attente"
    };

    setMesHeures([newEntry, ...mesHeures]);
    toast.success(`Temps enregistré: ${code}`);

    // Reset form
    setFormData({
      date: new Date().toISOString().split('T')[0],
      heureArrivee: "",
      heureDepart: "",
      localisation: "",
      typeJournee: "",
      remarques: ""
    });
  };

  const getStatusBadgeVariant = (statut: string) => {
    if (statut === "Validé") return "default"; // or custom 'success' if available, default is dark/primary
    return "secondary";
  };

  // --- DataTable Config ---
  const columns: Column<any>[] = [
    { header: "Code", accessorKey: "code", className: "font-mono text-xs text-muted-foreground" },
    { header: "Date", accessorKey: "date", className: "font-medium" },
    { header: "Type", accessorKey: "type" },
    { header: "Total Heures", accessorKey: "heures", className: "font-bold" },
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

  // Just using FilterBar for unified look, even if search value isn't used for text.
  // Actually we can filter by type as "search" or just use custom filters.
  // Let's use date as main filter, but FilterBar expects a text search.
  // I can make the text search hidden or use it for "Code" or "Type".
  // I'll use text search for Type/Code and add Date as additional filter.
  const [searchText, setSearchText] = useState("");

  // Update filter logic to include search text
  const refinedFilteredData = mesHeures.filter((item) => {
    const matchDate = filterDate ? item.date === filterDate : true;
    const matchText =
      item.code.toLowerCase().includes(searchText.toLowerCase()) ||
      item.type.toLowerCase().includes(searchText.toLowerCase());
    return matchDate && matchText;
  });

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
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-sm">
              <Clock className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold">Saisie Temps de Travail</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">Déclarez vos horaires quotidiens</p>
            </div>
          </div>
        </div>
      </Card>

      {/* --- Formulaire de Saisie --- */}
      <Card className="shadow-md">
        <CardHeader className="bg-muted/10 pb-4">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Plus className="h-5 w-5 text-primary" />
            Nouvelle déclaration
          </CardTitle>
          <CardDescription>
            Remplissez les horaires pour la journée
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Grille responsive : 1 col mobile, 2 cols tablette, 3 cols desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

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
                <Label htmlFor="typeJournee">Type de journée</Label>
                <Select
                  value={formData.typeJournee}
                  onValueChange={(value) => setFormData({ ...formData, typeJournee: value })}
                >
                  <SelectTrigger className="pl-9 relative">
                    <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Sélectionner..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Journée normale">Journée normale</SelectItem>
                    <SelectItem value="Télétravail">Télétravail</SelectItem>
                    <SelectItem value="Déplacement">Déplacement</SelectItem>
                    <SelectItem value="Formation">Formation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Vide sur desktop pour alignement, ou autre champ */}
              <div className="hidden lg:block"></div>

              <div className="space-y-2">
                <Label htmlFor="heureArrivee">Heure d'arrivée</Label>
                <Input
                  id="heureArrivee"
                  type="time"
                  value={formData.heureArrivee}
                  onChange={(e) => setFormData({ ...formData, heureArrivee: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="heureDepart">Heure de départ</Label>
                <Input
                  id="heureDepart"
                  type="time"
                  value={formData.heureDepart}
                  onChange={(e) => setFormData({ ...formData, heureDepart: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="localisation">Localisation</Label>
                <Select
                  value={formData.localisation || "TOM Oued ELil"}
                  onValueChange={(value) => setFormData({ ...formData, localisation: value })}
                >
                  <SelectTrigger className="pl-9 relative">
                    <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Sélectionner..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TOM Oued ELil">TOM Oued ELil</SelectItem>
                    <SelectItem value="Siege Lac 1">Siege Lac 1</SelectItem>
                    <SelectItem value="Autre">Autre (à préciser)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

            </div>

            <div className="space-y-2">
              <Label htmlFor="remarques">Remarques (Optionnel)</Label>
              <Textarea
                id="remarques"
                placeholder="Précisions sur les tâches effectuées..."
                className="resize-none"
                rows={2}
                value={formData.remarques}
                onChange={(e) => setFormData({ ...formData, remarques: e.target.value })}
              />
            </div>

            <Button type="submit" className="w-full sm:w-auto">
              <Send className="h-4 w-4 mr-2" />
              Enregistrer
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* --- Historique --- */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Clock className="h-5 w-5 text-muted-foreground" />
          Mes dernières saisies
        </h2>

        <FilterBar
          searchValue={searchText}
          onSearchChange={setSearchText}
          filters={[]} // No complex dropdown filters needed here for now
          onReset={() => { setSearchText(""); setFilterDate(""); }}
          searchPlaceholder="Rechercher code ou type..."
        >
          <div className="w-full sm:w-[150px]">
            <Input
              type="date"
              className="bg-background"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </div>
        </FilterBar>

        {/* 1. Vue TABLEAU (Desktop) */}
        <div className="hidden md:block">
          <DataTable
            columns={columns}
            data={refinedFilteredData}
            defaultPageSize={10}
          />
        </div>

        {/* 2. Vue CARTES (Mobile) */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {refinedFilteredData.length === 0 && (
            <div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-lg">Aucune donnée trouvée</div>
          )}
          {refinedFilteredData.map((item) => (
            <MobileDataCard
              key={item.id}
              title={item.date}
              subtitle={item.code}
              status={{ label: item.statut, variant: getStatusBadgeVariant(item.statut) as any }}
              data={[
                { icon: <Briefcase className="h-3.5 w-3.5" />, value: item.type },
                { icon: <Clock className="h-3.5 w-3.5" />, value: `${item.heures} (Total)` },
              ]}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmployeeTempsPage;