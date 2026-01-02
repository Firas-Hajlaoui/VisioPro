
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Receipt, Plus, Send, Calendar, DollarSign, CheckCircle, Hourglass, Search, Filter, X, Briefcase, Tag, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { generateFormCode } from "@/lib/codification";

// Shared Components
import { FilterBar } from "@/components/shared/FilterBar";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { MobileDataCard } from "@/components/shared/MobileDataCard";

const EmployeeNoteFraisPage = () => {
  // --- États ---
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    designation: "",
    montant: "",
    projet: "",
    typeFrais: "",
    remarques: ""
  });

  const [mesNotes, setMesNotes] = useState([
    { id: 1, code: "NDF-2024-0042", date: "2024-01-18", designation: "Déjeuner client OCP", montant: "450.00", projet: "Installation Khouribga", type: "Restauration", statut: "Approuvé" },
    { id: 2, code: "NDF-2024-0041", date: "2024-01-15", designation: "Billet train Tunis-Gafsa", montant: "85.00", projet: "Audit Siège", type: "Transport", statut: "Approuvé" },
    { id: 3, code: "NDF-2024-0040", date: "2024-01-10", designation: "Hôtel 2 nuits", montant: "1200.00", projet: "Chantier Tanger", type: "Hébergement", statut: "En attente" },
  ]);

  // --- Filtres ---
  const [filterText, setFilterText] = useState("");
  const [filterStatus, setFilterStatus] = useState("tous");

  const filteredNotes = mesNotes.filter((item) => {
    const matchText =
      item.code.toLowerCase().includes(filterText.toLowerCase()) ||
      item.projet.toLowerCase().includes(filterText.toLowerCase()) ||
      item.designation.toLowerCase().includes(filterText.toLowerCase());
    const matchStatus = filterStatus === "tous" || filterStatus === "all" ? true : item.statut === filterStatus;

    return matchText && matchStatus;
  });

  // --- Logique ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = generateFormCode("RH", "NOTE_DE_FRAIS");

    const newItem = {
      id: mesNotes.length + 1,
      code: code,
      date: formData.date,
      designation: formData.designation,
      montant: parseFloat(formData.montant).toFixed(2),
      projet: formData.projet,
      type: formData.typeFrais || "Divers",
      statut: "En attente"
    };

    setMesNotes([newItem, ...mesNotes]);
    toast.success(`Note de frais envoyée: ${code}`);

    setFormData({
      date: new Date().toISOString().split('T')[0],
      designation: "",
      montant: "",
      projet: "",
      typeFrais: "",
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
    { header: "Date", accessorKey: "date" },
    { header: "Désignation", accessorKey: "designation", className: "max-w-[200px] truncate" },
    { header: "Projet", accessorKey: "projet" },
    { header: "Type", accessorKey: "type", cell: (row) => <Badge variant="outline" className="font-normal text-xs">{row.type}</Badge> },
    { header: "Montant", accessorKey: "montant", className: "text-right font-bold", cell: (row) => `${row.montant} DT` },
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
        <div className="p-4 flex flex-row items-center gap-4">
          <Button variant="outline" size="icon" className="shrink-0 bg-background" asChild>
            <Link to="/employee">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center shadow-sm shrink-0">
              <Receipt className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold leading-tight">Note de Frais</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">Déclarez vos dépenses professionnelles</p>
            </div>
          </div>
        </div>
      </Card>

      {/* --- Formulaire --- */}
      <Card className="shadow-md">
        <CardHeader className="bg-muted/10 pb-4">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Plus className="h-5 w-5 text-primary" />
            Nouvelle déclaration
          </CardTitle>
          <CardDescription>
            Remplissez les détails de la dépense
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Ligne 1 : Date & Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date de la dépense</Label>
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
                <Label htmlFor="typeFrais">Type de frais</Label>
                <Select
                  value={formData.typeFrais}
                  onValueChange={(value) => setFormData({ ...formData, typeFrais: value })}
                >
                  <SelectTrigger className="pl-9 relative">
                    <Tag className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
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
            </div>

            {/* Ligne 2 : Montant & Projet */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="montant">Montant TTC</Label>
                <div className="relative">
                  <Input
                    id="montant"
                    type="number"
                    placeholder="0.00"
                    className="pl-9"
                    min="0"
                    step="0.01"
                    value={formData.montant}
                    onChange={(e) => setFormData({ ...formData, montant: e.target.value })}
                    required
                  />
                  <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="projet">Projet concerné</Label>
                <div className="relative">
                  <Input
                    id="projet"
                    placeholder="Ex: Chantier Khouribga"
                    className="pl-9"
                    value={formData.projet}
                    onChange={(e) => setFormData({ ...formData, projet: e.target.value })}

                  />
                  <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="designation">Désignation</Label>
              <Textarea
                id="designation"
                placeholder="Description détaillée (ex: Déjeuner avec client...)"
                className="resize-none"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                required
              />
            </div>

            <Button type="submit" className="w-full sm:w-auto">
              <Send className="h-4 w-4 mr-2" />
              Envoyer
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
            data={filteredNotes}
            defaultPageSize={10}
          />
        </div>

        {/* 2. Vue CARTES (Mobile) */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {filteredNotes.length === 0 && (
            <div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-lg">Aucune note de frais</div>
          )}
          {filteredNotes.map((item) => (
            <MobileDataCard
              key={item.id}
              title={item.type}
              subtitle={item.code}
              status={{ label: item.statut, variant: getStatusBadgeVariant(item.statut) as any }}
              data={[
                { icon: <Calendar className="h-3.5 w-3.5" />, value: item.date },
                { icon: <span className="text-[10px] text-muted-foreground w-12 uppercase">Projet</span>, value: item.projet },
                { icon: <span className="text-[10px] text-muted-foreground w-12 uppercase">Montant</span>, value: `${item.montant} DT`, className: "font-bold text-primary" },
              ]}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmployeeNoteFraisPage;