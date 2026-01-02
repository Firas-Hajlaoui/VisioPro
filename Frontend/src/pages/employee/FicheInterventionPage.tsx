
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Plus,
  Save,
  CheckCircle,
  Wrench,
  Clock,
  Upload,
  X,
  Search,
  PenTool,
  Eraser,
  UserCheck,
  ArrowLeft,
  Filter,
  MapPin,
  Calendar,
  ClipboardList,
  PenLine
} from "lucide-react";
import { toast } from "sonner";
import type { Intervention, Photo } from "@/types/intervention";

// Shared Components
import { StatCard } from "@/components/shared/StatCard";
import { FilterBar } from "@/components/shared/FilterBar";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { MobileDataCard } from "@/components/shared/MobileDataCard";

// --- Composant Signature Pad (Zone de dessin) ---
const SignaturePad = ({
  onSave,
  onClear,
}: {
  onSave: (dataUrl: string) => void;
  onClear: () => void;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Initialisation du canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = 200;
      }
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.strokeStyle = "#000000";
      }
    }
  }, []);

  // Gestion des coordonnées (Souris & Touch)
  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    let clientX, clientY;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const { x, y } = getPos(e);
    const ctx = canvasRef.current?.getContext("2d");
    ctx?.beginPath();
    ctx?.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const { x, y } = getPos(e);
    const ctx = canvasRef.current?.getContext("2d");
    ctx?.lineTo(x, y);
    ctx?.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleSaveInternal = () => {
    if (canvasRef.current) {
      onSave(canvasRef.current.toDataURL("image/png"));
    }
  };

  const handleClearInternal = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    onClear();
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg bg-white touch-none overflow-hidden">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-[200px] cursor-crosshair block"
        />
      </div>
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={handleClearInternal} size="sm" type="button">
          <Eraser className="w-4 h-4 mr-2" /> Effacer
        </Button>
        <Button onClick={handleSaveInternal} size="sm" type="button">
          <CheckCircle className="w-4 h-4 mr-2" /> Valider la signature
        </Button>
      </div>
    </div>
  );
};

// --- Données Mock Initiales ---
const mockReports: Intervention[] = [
  {
    id: "1",
    code: "250101-0001",
    numeroBT: "BT-2024-001",
    date: "2024-12-28",
    site: "Casablanca, site principal",
    equipment: "Système d'automatisation Ligne A",
    internalIntervenants: "Ahmed Bennani, Karim Idrissi",
    clientIntervenants: "Mohammed Hassan (COSUMAR)",
    durationDays: 1,
    durationHours: 4,
    defectDescription: "Matériels: Variateur ABB, Câblage cuivre 4mm²",
    workPerformed: "Installation et configuration du variateur de fréquence",
    actionsToRealize: "Tester en condition réelle la semaine prochaine",
    observations: "Client satisfait, travaux conformes ISO",
    photos: [],
    clientSignature: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
    techSignature: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
    statut: "validated",
    createdAt: "2024-12-28",
  },
];

export default function FicheInterventionPage() {
  const [reports, setReports] = useState<Intervention[]>(mockReports);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // États de navigation et modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [signatureModalOpen, setSignatureModalOpen] = useState(false);
  const [currentSignatureType, setCurrentSignatureType] = useState<"client" | "tech" | null>(null);

  // État du formulaire
  const [formData, setFormData] = useState({
    code: "",
    numeroBT: "",
    date: new Date().toISOString().split("T")[0],
    site: "",
    equipment: "",
    internalIntervenants: "",
    clientIntervenants: "",
    durationDays: 0,
    durationHours: 0,
    defectDescription: "",
    workPerformed: "",
    actionsToRealize: "",
    observations: "",
  });

  const [signatures, setSignatures] = useState<{ client: string | null; tech: string | null }>({
    client: null,
    tech: null,
  });

  // États Filtres
  const [filterText, setFilterText] = useState("");
  const [filterStatus, setFilterStatus] = useState("tous");

  // --- Helpers ---
  const generateFINumber = () => {
    const today = new Date();
    const year = today.getFullYear().toString().slice(-2);
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day = today.getDate().toString().padStart(2, "0");
    const time = today.getTime().toString().slice(-4);
    return `${year}${month}${day}-${time}`;
  };

  const handleFormChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const filteredReports = reports.filter((r) => {
    const matchText =
      r.code.toLowerCase().includes(filterText.toLowerCase()) ||
      r.site.toLowerCase().includes(filterText.toLowerCase()) ||
      (r.equipment || "").toLowerCase().includes(filterText.toLowerCase());
    const matchStatus = filterStatus === "tous" || filterStatus === "all" ? true : r.statut === filterStatus;
    return matchText && matchStatus;
  });

  const getStatusBadge = (statut: string) => {
    // For use in Mobile & regular badges
    if (statut === "validated") return "Validé";
    return "Brouillon";
  };
  const getStatusVariant = (statut: string) => {
    if (statut === "validated") return "default"; // green would be better but keeping simple
    return "secondary";
  };


  // --- Gestion Photos ---
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newPhoto: Photo = {
          id: Math.random().toString(36).substr(2, 9),
          file,
          preview: event.target?.result as string,
          designation: "",
        };
        setPhotos((prev) => [...prev, newPhoto]);
      };
      reader.readAsDataURL(file);
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removePhoto = (id: string) => setPhotos((prev) => prev.filter((p) => p.id !== id));
  const updatePhotoDesignation = (id: string, designation: string) => {
    setPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, designation } : p)));
  };

  // --- Gestion Signatures ---
  const openSignatureModal = (type: "client" | "tech") => {
    setCurrentSignatureType(type);
    setSignatureModalOpen(true);
  };

  const handleSignatureSave = (dataUrl: string) => {
    if (currentSignatureType === "client") {
      setSignatures(prev => ({ ...prev, client: dataUrl }));
    } else if (currentSignatureType === "tech") {
      setSignatures(prev => ({ ...prev, tech: dataUrl }));
    }
    setSignatureModalOpen(false);
    toast.success("Signature enregistrée");
  };

  const clearSignature = (type: "client" | "tech") => {
    if (type === "client") setSignatures(prev => ({ ...prev, client: null }));
    if (type === "tech") setSignatures(prev => ({ ...prev, tech: null }));
  };

  // --- Sauvegarde ---
  const validateForm = (): boolean => {
    const requiredFields = ["site", "equipment", "internalIntervenants", "clientIntervenants"];
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]?.toString().trim()) {
        toast.error(`Le champ ${field} est obligatoire`);
        return false;
      }
    }
    if (formData.durationDays === 0 && formData.durationHours === 0) {
      toast.error("La durée doit être spécifiée");
      return false;
    }
    return true;
  };

  const handleSave = async (status: "draft" | "validated") => {
    if (status === "validated" && !validateForm()) return;
    if (status === "validated" && (!signatures.client || !signatures.tech)) {
      toast.warning("Les deux signatures sont requises pour valider");
      return;
    }

    const code = formData.code || generateFINumber();
    const newReport: Intervention = {
      id: Math.random().toString(36).substr(2, 9),
      ...formData,
      code,
      photos,
      clientSignature: signatures.client,
      techSignature: signatures.tech,
      statut: status,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setReports((prev) => [newReport, ...prev]);
    toast.success(`Fiche ${status === "draft" ? "sauvegardée en brouillon" : "validée avec succès"}`);
    resetForm();
    setIsFormOpen(false);
  };

  const resetForm = () => {
    setFormData({
      code: "",
      numeroBT: "",
      date: new Date().toISOString().split("T")[0],
      site: "",
      equipment: "",
      internalIntervenants: "",
      clientIntervenants: "",
      durationDays: 0,
      durationHours: 0,
      defectDescription: "",
      workPerformed: "",
      actionsToRealize: "",
      observations: "",
    });
    setPhotos([]);
    setSignatures({ client: null, tech: null });
  };

  // --- DataTable Columns ---
  const columns: Column<Intervention>[] = [
    { header: "Code", accessorKey: "code", className: "font-mono text-xs" },
    { header: "Date", accessorKey: "date" },
    { header: "Site", accessorKey: "site" },
    { header: "Équipement", accessorKey: "equipment", className: "truncate max-w-[200px]" },
    {
      header: "Signatures",
      cell: (r) => (
        <div className="flex gap-1">
          {r.clientSignature ? <Badge className="bg-green-100 text-green-800 border-green-200">CLI</Badge> : <Badge variant="outline" className="text-muted-foreground">CLI</Badge>}
          {r.techSignature ? <Badge className="bg-blue-100 text-blue-800 border-blue-200">AT</Badge> : <Badge variant="outline" className="text-muted-foreground">AT</Badge>}
        </div>
      )
    },
    {
      header: "Statut",
      accessorKey: "statut",
      cell: (r) => (
        <Badge variant={getStatusVariant(r.statut) as any}>{getStatusBadge(r.statut)}</Badge>
      )
    },
    {
      header: "Action",
      className: "text-right",
      cell: (r) => (
        <Button variant="ghost" size="icon" title="Modifier/Voir">
          <PenLine className="h-4 w-4 text-muted-foreground" />
        </Button>
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
        { label: "Validé", value: "validated" },
        { label: "Brouillon", value: "draft" }
      ]
    }
  ];

  return (
    <div className="container mx-auto p-2 sm:p-4 md:p-6 space-y-6 max-w-5xl pb-20">

      {/* HEADER FIXE */}
      <Card className="border-none shadow-sm bg-muted/30">
        <div className="p-4 flex flex-row items-center gap-4">
          <Button variant="outline" size="icon" className="shrink-0 bg-background" asChild>
            <Link to="/employee">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm shrink-0">
              <Wrench className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold leading-tight">Fiches d'Intervention</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">Rapports techniques et travaux</p>
            </div>
          </div>
        </div>
      </Card>

      {/* --- FORMULAIRE D'INTERVENTION --- */}
      {isFormOpen ? (
        <Card className="shadow-md animate-in fade-in slide-in-from-bottom-4">
          <CardHeader className="bg-muted/10 pb-4 border-b flex flex-row justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Plus className="h-5 w-5 text-blue-600" />
                Nouvelle Fiche
              </CardTitle>
              <CardDescription>Remplissez les détails de l'intervention</CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsFormOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </CardHeader>

          <CardContent className="pt-6 space-y-8">
            {/* 1. Infos Générales */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide border-b pb-1">Informations Générales</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date d'intervention *</Label>
                  <Input type="date" value={formData.date} onChange={(e) => handleFormChange("date", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Numéro BT</Label>
                  <Input value={formData.numeroBT} onChange={(e) => handleFormChange("numeroBT", e.target.value)} placeholder="Ex: BT-2024-001" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Lieu / Site *</Label>
                <div className="relative">
                  <Input value={formData.site} onChange={(e) => handleFormChange("site", e.target.value)} className="pl-9" placeholder="Ex: Lac 1" />
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Équipement / Projet *</Label>
                <Input value={formData.equipment} onChange={(e) => handleFormChange("equipment", e.target.value)} placeholder="Ex: Armoire T4" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Jours</Label>
                  <Input type="number" min="0" value={formData.durationDays} onChange={(e) => handleFormChange("durationDays", parseInt(e.target.value) || 0)} />
                </div>
                <div className="space-y-2">
                  <Label>Heures</Label>
                  <Input type="number" min="0" max="24" value={formData.durationHours} onChange={(e) => handleFormChange("durationHours", parseInt(e.target.value) || 0)} />
                </div>
              </div>
            </div>

            {/* 2. Intervenants */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide border-b pb-1">Intervenants</h3>
              <div className="space-y-2">
                <Label>Intervenant(s) interne(s) *</Label>
                <Input value={formData.internalIntervenants} onChange={(e) => handleFormChange("internalIntervenants", e.target.value)} placeholder="Techniciens AT" />
              </div>
              <div className="space-y-2">
                <Label>Intervenant(s) client *</Label>
                <Input value={formData.clientIntervenants} onChange={(e) => handleFormChange("clientIntervenants", e.target.value)} placeholder="Représentant client" />
              </div>
            </div>

            {/* 3. Détails & Description */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide border-b pb-1">Description Technique</h3>
              <div className="space-y-2">
                <Label>Matériel / Matière utilisés</Label>
                <Textarea value={formData.defectDescription} onChange={(e) => handleFormChange("defectDescription", e.target.value)} rows={2} placeholder="Liste du matériel..." />
              </div>
              <div className="space-y-2">
                <Label>Travaux effectués</Label>
                <Textarea value={formData.workPerformed} onChange={(e) => handleFormChange("workPerformed", e.target.value)} rows={4} placeholder="Description détaillée..." />
              </div>
              <div className="space-y-2">
                <Label>Observations / Actions à suivre</Label>
                <Textarea value={formData.observations} onChange={(e) => handleFormChange("observations", e.target.value)} rows={2} />
              </div>
            </div>

            {/* 4. Photos */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide border-b pb-1">Photo</h3>
              {photos.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {photos.map((photo) => (
                    <div key={photo.id} className="relative space-y-1">
                      <div className="aspect-square rounded border overflow-hidden relative group">
                        <img src={photo.preview} alt="preview" className="w-full h-full object-cover" />
                        <button onClick={() => removePhoto(photo.id)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-90 hover:opacity-100">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                      <Input value={photo.designation} onChange={(e) => updatePhotoDesignation(photo.id, e.target.value)} className="text-xs h-7" placeholder="Légende" />
                    </div>
                  ))}
                </div>
              )}
              <Button variant="outline" type="button" onClick={() => fileInputRef.current?.click()} className="w-full border-dashed">
                <Upload className="h-4 w-4 mr-2" /> Ajouter des photos
              </Button>
              <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            </div>

            {/* 5. Signatures */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                <PenTool className="h-4 w-4" /> Signatures
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="flex justify-between items-center">
                    <span>Client</span>
                    {signatures.client && <Badge variant="default" className="bg-green-600">Signé</Badge>}
                  </Label>
                  <div className={`border-2 border-dashed rounded-lg p-4 h-32 flex flex-col items-center justify-center transition-colors ${signatures.client ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50'}`}>
                    {signatures.client ? (
                      <div className="relative w-full h-full">
                        <img src={signatures.client} alt="Signature Client" className="w-full h-full object-contain" />
                        <Button variant="ghost" size="icon" className="absolute top-0 right-0 text-red-500 hover:bg-red-100 h-6 w-6" onClick={() => clearSignature("client")}>
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <Button variant="outline" onClick={() => openSignatureModal("client")}>
                        <PenTool className="h-4 w-4 mr-2" /> Signer
                      </Button>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="flex justify-between items-center">
                    <span>Intervenant AT</span>
                    {signatures.tech && <Badge variant="default" className="bg-green-600">Signé</Badge>}
                  </Label>
                  <div className={`border-2 border-dashed rounded-lg p-4 h-32 flex flex-col items-center justify-center transition-colors ${signatures.tech ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50'}`}>
                    {signatures.tech ? (
                      <div className="relative w-full h-full">
                        <img src={signatures.tech} alt="Signature Tech" className="w-full h-full object-contain" />
                        <Button variant="ghost" size="icon" className="absolute top-0 right-0 text-red-500 hover:bg-red-100 h-6 w-6" onClick={() => clearSignature("tech")}>
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <Button variant="outline" onClick={() => openSignatureModal("tech")}>
                        <UserCheck className="h-4 w-4 mr-2" /> Signer
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t sticky bottom-0 bg-background pb-2 z-10">
              <Button variant="outline" className="flex-1" onClick={() => setIsFormOpen(false)}>Annuler</Button>
              <Button variant="secondary" className="flex-1" onClick={() => handleSave("draft")}>
                <Save className="h-4 w-4 mr-2" /> Brouillon
              </Button>
              <Button className="flex-1" onClick={() => handleSave("validated")}>
                <CheckCircle className="h-4 w-4 mr-2" /> Valider
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* --- LISTE DES FICHES --- */
        <div className="space-y-6">

          {/* KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              title="Total Fiches"
              value={reports.length}
              description="Toutes périodes"
              icon={ClipboardList}
            />
            <StatCard
              title="Validées"
              value={reports.filter(r => r.statut === 'validated').length}
              description="Rapports finalisés"
              icon={CheckCircle}
            />
            <StatCard
              title="Cumul Heures"
              value={`${reports.reduce((acc, r) => acc + ((r.durationDays || 0) * 8 + (r.durationHours || 0)), 0)}h`}
              description="Temps total d'intervention"
              icon={Clock}
            />
          </div>

          {/* Barre d'outils (Création & Filtres) */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <Button onClick={() => { resetForm(); setIsFormOpen(true); }} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" /> Créer une fiche
            </Button>
          </div>

          <FilterBar
            searchValue={filterText}
            onSearchChange={setFilterText}
            filters={filterConfig}
            onReset={() => { setFilterText(""); setFilterStatus("tous"); }}
          />

          <div className="hidden md:block">
            <DataTable
              columns={columns}
              data={filteredReports}
              defaultPageSize={10}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:hidden">
            {filteredReports.length === 0 && <div className="text-center py-8 text-muted-foreground">Aucune fiche trouvée</div>}
            {filteredReports.map(r => (
              <MobileDataCard
                key={r.id}
                title={r.code}
                subtitle={r.site}
                status={{ label: getStatusBadge(r.statut), variant: getStatusVariant(r.statut) as any }}
                data={[
                  { icon: <Calendar className="h-3.5 w-3.5" />, value: r.date },
                  { label: "Equipement", value: r.equipment, className: "col-span-2 font-medium" },
                ]}
                actions={
                  <div className="flex justify-between items-center w-full pt-1">
                    <div className="flex gap-2">
                      {r.clientSignature && <Badge variant="outline" className="text-[10px] text-green-600 border-green-200">Signé Client</Badge>}
                      {r.techSignature && <Badge variant="outline" className="text-[10px] text-blue-600 border-blue-200">Signé AT</Badge>}
                    </div>
                    <Button variant="ghost" size="icon" title="Modifier/Voir">
                      <PenLine className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                }
              />
            ))}
          </div>
        </div>
      )}

      {/* --- MODAL DE SIGNATURE --- */}
      <Dialog open={signatureModalOpen} onOpenChange={setSignatureModalOpen}>
        <DialogContent className="sm:max-w-md w-[95vw] rounded-lg">
          <DialogHeader>
            <DialogTitle>
              Signature {currentSignatureType === "client" ? "Client" : "Intervenant AT"}
            </DialogTitle>
            <DialogDescription>
              Veuillez signer dans la zone ci-dessous puis valider.
            </DialogDescription>
          </DialogHeader>

          <div className="py-2">
            <SignaturePad
              onSave={handleSignatureSave}
              onClear={() => { }}
            />
          </div>

          <DialogFooter className="sm:justify-start">
            <Button type="button" variant="secondary" className="w-full sm:w-auto" onClick={() => setSignatureModalOpen(false)}>
              Annuler
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}