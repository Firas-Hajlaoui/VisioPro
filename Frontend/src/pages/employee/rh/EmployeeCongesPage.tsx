
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Plus, Send, CheckCircle, Hourglass, PieChart, Clock, CalendarDays, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { generateFormCode } from "@/lib/codification";
import { useLeaveRequests } from "@/hooks/useApi";
import type { LeaveRequest } from "@/types/rh";

// Shared Components
import { StatCard } from "@/components/shared/StatCard";
import { FilterBar } from "@/components/shared/FilterBar";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { MobileDataCard } from "@/components/shared/MobileDataCard";

const EmployeeCongesPage = () => {
  // --- États ---
  const [formData, setFormData] = useState({
    typeConge: "",
    dateDebut: "",
    dateFin: "",
    motif: "",
    remarques: ""
  });

  // API Call
  // Assuming the user can see their own requests
  const { data: leavesData, isLoading, createLeaveRequest } = useLeaveRequests();
  const mesConges = leavesData?.results || [];

  // --- Filtres ---
  const [filterText, setFilterText] = useState("");
  const [filterStatus, setFilterStatus] = useState("tous");

  const filteredConges = mesConges.filter((item: LeaveRequest) => {
    const matchText =
      item.code.toLowerCase().includes(filterText.toLowerCase()) ||
      item.type.toLowerCase().includes(filterText.toLowerCase());
    const matchStatus = filterStatus === "tous" || filterStatus === "all" ? true : item.statut === filterStatus;

    return matchText && matchStatus;
  });

  const calculateDays = () => {
    if (formData.dateDebut && formData.dateFin) {
      const start = new Date(formData.dateDebut);
      const end = new Date(formData.dateFin);
      const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      return diff > 0 ? diff : 0;
    }
    return 0;
  };

  // --- Logique ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = generateFormCode("RH", "CONGE");
    const days = calculateDays();

    // Map to API Interface
    // LeaveRequest in rh.ts: code, debut, fin, jours (string), type, statut
    createLeaveRequest({
      code: code,
      type: formData.typeConge === "annuel" ? "Congé annuel" : formData.typeConge, // Assuming simple mapping for now
      debut: formData.dateDebut,
      fin: formData.dateFin,
      jours: days.toString(), // Convert number to string for decimal format
      statut: "En attente", // Default status
      motif: formData.motif
    });

    setFormData({
      typeConge: "",
      dateDebut: "",
      dateFin: "",
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
  const columns: Column<LeaveRequest>[] = [
    { header: "Code", accessorKey: "code", className: "font-mono text-xs text-muted-foreground" },
    { header: "Type", accessorKey: "type", className: "font-medium" },
    { header: "Du", accessorKey: "debut" },
    { header: "Au", accessorKey: "fin" },
    { header: "Durée", accessorKey: "jours", cell: (row) => <span className="font-bold">{parseFloat(row.jours).toFixed(1)} j</span> },
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

  if (isLoading) return <div className="p-8">Chargement...</div>;

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
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center shadow-sm shrink-0">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold">Demande de Congés</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">Gérez vos absences et soldes</p>
            </div>
          </div>
        </div>
      </Card>

      {/* --- KPIs (Cartes de solde) --- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Solde disponible"
          value="22 jours"
          description="Annuel"
          icon={PieChart}
          className="text-green-600"
        />
        <StatCard
          title="Déjà pris"
          value={`${mesConges.filter((l: LeaveRequest) => l.statut === "Approuvé").length} jours`} // Simple count for now
          description="Cumul"
          icon={CalendarDays}
          className="text-blue-600"
        />
        <StatCard
          title="En attente"
          value={`${mesConges.filter((l: LeaveRequest) => l.statut === "En attente").length} demandes`}
          description="Demandes en cours"
          icon={Clock}
          className="text-orange-500"
        />
      </div>

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
                <Label htmlFor="typeConge">Type de congé</Label>
                <Select
                  value={formData.typeConge}
                  onValueChange={(value) => setFormData({ ...formData, typeConge: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le type..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="annuel">Congé annuel</SelectItem>
                    <SelectItem value="maladie">Congé maladie</SelectItem>
                    <SelectItem value="maternite">Congé maternité</SelectItem>
                    <SelectItem value="paternite">Congé paternité</SelectItem>
                    <SelectItem value="mariage">Congé mariage</SelectItem>
                    <SelectItem value="deces">Congé décès</SelectItem>
                    <SelectItem value="sans_solde">Congé sans solde</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Durée estimée</Label>
                <div className="relative">
                  <Input value={`${calculateDays()} jours`} disabled className="bg-muted pl-9" />
                  <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateDebut">Date de début</Label>
                <div className="relative">
                  <Input
                    id="dateDebut"
                    type="date"
                    className="pl-9"
                    value={formData.dateDebut}
                    onChange={(e) => setFormData({ ...formData, dateDebut: e.target.value })}
                    required
                  />
                  <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateFin">Date de fin</Label>
                <div className="relative">
                  <Input
                    id="dateFin"
                    type="date"
                    className="pl-9"
                    value={formData.dateFin}
                    onChange={(e) => setFormData({ ...formData, dateFin: e.target.value })}
                    required
                  />
                  <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="motif">Motif</Label>
              <Textarea
                id="motif"
                placeholder="Décrivez le motif..."
                className="resize-none"
                value={formData.motif}
                onChange={(e) => setFormData({ ...formData, motif: e.target.value })}
                required
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
          <CalendarDays className="h-5 w-5 text-muted-foreground" />
          Historique
        </h2>

        <FilterBar
          searchValue={filterText}
          onSearchChange={setFilterText}
          filters={filterConfig}
          onReset={() => { setFilterText(""); setFilterStatus("tous"); }}
          searchPlaceholder="Rechercher code..."
        />

        {/* 1. Vue TABLEAU (Desktop) */}
        <div className="hidden md:block">
          <DataTable
            columns={columns}
            data={filteredConges}
            defaultPageSize={10}
          />
        </div>

        {/* 2. Vue CARTES (Mobile) */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {filteredConges.length === 0 && (
            <div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-lg">Aucune demande</div>
          )}
          {filteredConges.map((item: LeaveRequest) => (
            <MobileDataCard
              key={item.id}
              title={item.type}
              subtitle={item.code}
              status={{ label: item.statut, variant: getStatusBadgeVariant(item.statut) as any }}
              data={[
                { icon: <span className="text-[10px] text-muted-foreground uppercase w-10">Début</span>, value: item.debut },
                { icon: <span className="text-[10px] text-muted-foreground uppercase w-10">Fin</span>, value: item.fin },
                { icon: <span className="text-muted-foreground">Durée</span>, value: `${parseFloat(item.jours).toFixed(1)} jours` },
              ]}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmployeeCongesPage;
