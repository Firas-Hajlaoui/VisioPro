
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import {
  Plus, Clock, Download, Calendar, Briefcase, MapPin, LogIn, LogOut,
  CheckCircle, MoreHorizontal, Pencil, Trash2, Filter, AlertCircle
} from "lucide-react";
import { generateFormCode } from "@/lib/codification";
import { toast } from "sonner";

// Shared Components
import { StatCard } from "@/components/shared/StatCard";
import { FilterBar } from "@/components/shared/FilterBar";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { MobileDataCard } from "@/components/shared/MobileDataCard";

import type { TimeRecord } from "@/types/rh";

const initialData: TimeRecord[] = [
  {
    id: 1,
    code: "RH-TT-2024-0001",
    employe: "Ahmed Bennani",
    date: "2024-12-20",
    heureEntree: "08:00",
    heureSortie: "16:00",
    lieu: "Bureau local",
    heures: 8,
    type: "Normal",
    statut: "Validé",
    hsValide: false
  },
  {
    id: 2,
    code: "RH-TT-2024-0002",
    employe: "Sara Fassi",
    date: "2024-12-20",
    heureEntree: "08:00",
    heureSortie: "18:00",
    lieu: "Tom Oued Ellil",
    heures: 10,
    type: "Heures sup",
    statut: "En attente",
    hsValide: false
  },
  {
    id: 3,
    code: "RH-TT-2024-0003",
    employe: "Youssef Alami",
    date: "2024-12-19",
    heureEntree: "08:30",
    heureSortie: "16:30",
    lieu: "Atelier Fouchana",
    heures: 8,
    type: "Normal",
    statut: "Validé",
    hsValide: false
  },
  {
    id: 4,
    code: "RH-TT-2024-0004",
    employe: "Fatima Zohra",
    date: "2024-12-19",
    heureEntree: "09:00",
    heureSortie: "13:00",
    lieu: "Chantier Externe",
    heures: 4,
    type: "Mi-temps",
    statut: "Validé",
    hsValide: false
  },
];

export default function TempsPage() {
  const [data, setData] = useState<TimeRecord[]>(initialData);
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TimeRecord | null>(null);
  const [selectedLieu, setSelectedLieu] = useState<string>("");

  // Filters
  const [filterName, setFilterName] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterType, setFilterType] = useState("tous");

  // --- Handlers ---
  const handleOpenNew = () => {
    setEditingItem(null);
    setSelectedLieu("");
    setOpen(true);
  };

  const handleOpenEdit = (item: TimeRecord) => {
    setEditingItem(item);
    const standardLieux = ["Bureau local", "Tom Oued Ellil", "Atelier Fouchana"];
    if (standardLieux.includes(item.lieu)) {
      setSelectedLieu(item.lieu);
    } else {
      setSelectedLieu("autre");
    }
    setOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce pointage ?")) {
      setData(prev => prev.filter(item => item.id !== id));
      toast.success("Enregistrement supprimé.");
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    let lieuFinal = selectedLieu;
    if (selectedLieu === "autre") {
      lieuFinal = formData.get("customLieu") as string;
    }

    const hEntree = parseInt((formData.get("heureEntree") as string).split(':')[0]);
    const hSortie = parseInt((formData.get("heureSortie") as string).split(':')[0]);
    const dureeCalculee = hSortie > hEntree ? hSortie - hEntree : 0;

    const recordData = {
      employe: formData.get("employeText") as string,
      date: formData.get("date") as string,
      heureEntree: formData.get("heureEntree") as string,
      heureSortie: formData.get("heureSortie") as string,
      lieu: lieuFinal,
      heures: dureeCalculee,
      type: formData.get("type") as string,
      statut: editingItem ? editingItem.statut : "En attente",
      hsValide: editingItem ? editingItem.hsValide : false,
    };

    if (editingItem) {
      setData(prev => prev.map(item =>
        item.id === editingItem.id ? { ...item, ...recordData } : item
      ));
      toast.success(`Enregistrement modifié: ${editingItem.code}`);
    } else {
      const newItem: TimeRecord = {
        id: Date.now(),
        code: generateFormCode("RH", "TEMPS_TRAVAIL"),
        ...recordData,
        statut: "Validé",
        hsValide: false
      };
      setData([...data, newItem]);
      toast.success(`Enregistrement créé: ${newItem.code}`);
    }
    setOpen(false);
  };

  const handleValidateHS = (id: number) => {
    setData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, hsValide: true, statut: "Validé" } : item
      )
    );
    toast.success("Heures supplémentaires confirmées !");
  };

  // --- Filter Logic ---
  const filteredData = data.filter((item) => {
    const matchName = item.employe.toLowerCase().includes(filterName.toLowerCase());
    const matchDate = filterDate ? item.date === filterDate : true;
    const matchType = filterType !== "tous" && filterType !== "all" ? item.type === filterType : true;
    return matchName && matchDate && matchType;
  });

  const getStatusBadgeVariant = (statut: string) => {
    return statut === "Validé" ? "default" : "secondary";
  };

  // --- DataTable Config ---
  const columns: Column<TimeRecord>[] = [
    {
      header: "Employé",
      accessorKey: "employe",
      cell: (row) => (
        <div>
          <div className="font-medium">{row.employe}</div>
          <div className="text-xs text-muted-foreground font-mono">{row.code}</div>
        </div>
      )
    },
    { header: "Date", accessorKey: "date" },
    {
      header: "Lieu",
      accessorKey: "lieu",
      cell: (row) => (
        <div className="flex items-center gap-1.5 min-w-[120px]">
          <MapPin className="h-3 w-3 text-muted-foreground" />
          <span className="text-sm">{row.lieu}</span>
        </div>
      )
    },
    {
      header: "Horaires",
      cell: (row) => (
        <div className="flex gap-2 text-xs">
          <span className="text-muted-foreground" title="Entrée">{row.heureEntree}</span>
          <span>-</span>
          <span className="text-muted-foreground" title="Sortie">{row.heureSortie}</span>
        </div>
      )
    },
    { header: "Durée", accessorKey: "heures", cell: (row) => <strong>{row.heures}h</strong> },
    {
      header: "Type",
      accessorKey: "type",
      cell: (row) => <Badge variant="outline" className="font-normal whitespace-nowrap">{row.type}</Badge>
    },
    {
      header: "Validation HS",
      className: "text-center",
      cell: (row) => (
        row.type === "Heures sup" ? (
          row.hsValide ? (
            <Badge variant="default" className="bg-green-600 hover:bg-green-700 whitespace-nowrap">
              <CheckCircle className="w-3 h-3 mr-1" /> Validées
            </Badge>
          ) : (
            <Button size="sm" variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-50 h-7 text-xs" onClick={() => handleValidateHS(row.id)}>
              Confirmer
            </Button>
          )
        ) : <span className="text-muted-foreground text-xs">-</span>
      )
    },
    {
      header: "Statut",
      accessorKey: "statut",
      cell: (row) => <Badge variant={getStatusBadgeVariant(row.statut) as any}>{row.statut}</Badge>
    },
    {
      header: "",
      cell: (row) => (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(row)} className="h-8 w-8">
            <Pencil className="h-4 w-4 text-muted-foreground" />
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
      key: "type",
      label: "Type",
      value: filterType,
      onChange: setFilterType,
      options: [
        { label: "Normal", value: "Normal" },
        { label: "Heures sup", value: "Heures sup" },
        { label: "Mi-temps", value: "Mi-temps" },
      ]
    }
  ];

  return (
    <div className="space-y-6 p-2 sm:p-4 md:p-6 pb-20 sm:pb-10">
      {/* --- Header --- */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Gestion du Temps</h1>
          <p className="text-sm text-muted-foreground">Suivi des horaires, validation HS et localisations</p>
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
                Pointage
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-md rounded-lg sm:rounded-xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingItem ? "Modifier Pointage" : "Nouveau Pointage"}</DialogTitle>
                <DialogDescription className="text-xs sm:text-sm">
                  {editingItem
                    ? `Modification de ${editingItem.code}`
                    : <span>Code: <span className="font-mono bg-muted px-1 rounded">{generateFormCode("RH", "TEMPS_TRAVAIL")}</span></span>
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
                      <SelectItem value="Fatima Zohra">Fatima Zohra</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input type="date" name="date" id="date" defaultValue={editingItem?.date} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lieu">Lieu</Label>
                    <Select value={selectedLieu} onValueChange={setSelectedLieu}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Bureau local">Bureau local</SelectItem>
                        <SelectItem value="Tom Oued Ellil">Tom Oued Ellil</SelectItem>
                        <SelectItem value="Atelier Fouchana">Atelier Fouchana</SelectItem>
                        <SelectItem value="autre">Autre (Préciser)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {selectedLieu === "autre" && (
                  <div className="space-y-2 animate-in fade-in zoom-in duration-300">
                    <Label htmlFor="customLieu">Précisez le lieu</Label>
                    <Input
                      id="customLieu"
                      name="customLieu"
                      defaultValue={editingItem && !["Bureau local", "Tom Oued Ellil", "Atelier Fouchana"].includes(editingItem.lieu) ? editingItem.lieu : ""}
                      placeholder="Ex: Chantier Sousse"
                      required
                    />
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="entree">Entrée</Label>
                    <div className="relative">
                      <Input type="time" name="heureEntree" id="entree" defaultValue={editingItem?.heureEntree} className="pl-8" required />
                      <LogIn className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sortie">Sortie</Label>
                    <div className="relative">
                      <Input type="time" name="heureSortie" id="sortie" defaultValue={editingItem?.heureSortie} className="pl-8" required />
                      <LogOut className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type d'heures</Label>
                  <Select name="type" defaultValue={editingItem?.type || "Normal"}>
                    <SelectTrigger>
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Normal">Normal</SelectItem>
                      <SelectItem value="Heures sup">Heures sup.</SelectItem>
                      <SelectItem value="Mi-temps">Mi-temps</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter className="flex-col sm:flex-row gap-2 mt-4">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)} className="w-full sm:w-auto">
                    Annuler
                  </Button>
                  <Button type="submit" className="w-full sm:w-auto">
                    {editingItem ? "Modifier" : "Enregistrer"}
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
          title="Heures ce mois"
          value="1,240"
          description="+8% vs mois dernier"
          icon={Clock}
        />
        <StatCard
          title="Heures supplémentaires"
          value="156"
          description="12 employés concernés"
          icon={AlertCircle}
        />
        <StatCard
          title="Taux de validation"
          value="94%"
          description="Enregistrements validés"
          icon={CheckCircle}
        />
      </div>

      <div className="space-y-4">
        <FilterBar
          searchValue={filterName}
          onSearchChange={setFilterName}
          filters={filterConfig}
          onReset={() => { setFilterName(""); setFilterType("tous"); setFilterDate(""); }}
          searchPlaceholder="Filtrer par employé..."
        />

        {/* Additional Date Filter placed manually or integrated? 
             FilterBar supports children optionally but I will keep date separate for now simply 
             or integrate it if I modify FilterBar. 
             Since FilterBar is closed off, I'll place the date picker next to it or ignore it for strict standardization 
             BUT the user needs date filtering.
             The current FilterBar doesn't support DatePicker.
             I'll modify FilterBar usage or place it alongside.
             For now, I'll put it in a flex container above the table but below FilterBar? 
             Actually FilterBar takes `children`. Ah, I will check FilterBar definition if I can pass children.
             I created FilterBar. Let me check its props in my memory. 
             Props: `children?: ReactNode`. Yes!
          */}
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          {/* I can put the date picker as a child of FilterBar if I use it cleanly, 
                 but FilterBar usually handles the row layout. 
                 Let's just put it here for now if needed or modify FilterBar to accept it.
                 Actually, standard FilterBar has search + filters + reset. 
                 If I want a date picker, I should probably pass checks or use a new prop.
                 Or just place it near.
              */}
          {/* Just relying on what I wrote: <FilterBar ... /> 
                 I'll add the date picker *inside* via children prop?
                 Wait, FilterBar implementation:
                 ```tsx
                 export function FilterBar({ ... , children }: ...) {
                    return (
                        <div className="flex flex-col md:flex-row gap-4">
                            ... search ...
                            <div className="flex gap-4 ...">
                                {filters.map...}
                                {children}
                                ... reset ...
                            </div>
                        </div>
                    )
                 }
                 ```
                 So children appear before reset. Perfect.
             */}
        </div>

        {/* Re-rendering FilterBar with Date Input as child */}
        <FilterBar
          searchValue={filterName}
          onSearchChange={setFilterName}
          filters={filterConfig}
          onReset={() => { setFilterName(""); setFilterType("tous"); setFilterDate(""); }}
          searchPlaceholder="Filtrer par employé..."
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
          {filteredData.length === 0 && <div className="text-center py-6 text-muted-foreground">Aucune donnée</div>}
          {filteredData.map((row) => (
            <MobileDataCard
              key={row.id}
              title={row.employe}
              subtitle={row.code}
              status={{ label: row.statut, variant: getStatusBadgeVariant(row.statut) as any }}
              data={[
                { icon: <Calendar className="h-3.5 w-3.5" />, value: row.date },
                { icon: <MapPin className="h-3.5 w-3.5" />, value: row.lieu },
                { icon: <Clock className="h-3.5 w-3.5" />, value: `${row.heures}h (${row.heureEntree} - ${row.heureSortie})` },
                { icon: <Briefcase className="h-3.5 w-3.5" />, value: row.type },
              ]}
              actions={
                <div className="w-full pt-2 flex flex-col gap-2">
                  {row.type === "Heures sup" && !row.hsValide && (
                    <Button size="sm" variant="outline" className="w-full border-orange-300 text-orange-700 hover:bg-orange-50" onClick={() => handleValidateHS(row.id)}>
                      <CheckCircle className="h-3.5 w-3.5 mr-2" /> Confirmer Heures Sup.
                    </Button>
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