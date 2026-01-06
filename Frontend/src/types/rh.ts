// From GestionEmployee.tsx
export interface Employee {
    id: number;
    password?: string;
    code: string;
    nom: string;
    prenom: string;
    email: string;
    poste: string;
    departement: string;
    dateEmbauche: string;
    salaire: string; // API defines as decimal string
    statut: "Actif" | "Inactif" | "En congé";
    user?: number;
}

// From CongesPage.tsx
export interface LeaveRequest {
    id: number;
    code: string;
    employe: string; // ReadOnly name
    debut: string;
    fin: string;
    jours: string; // API defines as decimal string
    type: string;
    motif?: string | null;
    statut: "En attente" | "Approuvé" | "Refusé";
}

// From TempsPage.tsx
export interface TimeRecord {
    id: number;
    code: string;
    employe: string; // ReadOnly name
    date: string;
    heureEntree: string;
    heureSortie: string;
    lieu: string;
    heures: string; // API defines as decimal string
    type: string;
    statut: string;
    hsValide: boolean;
}

// From NoteFrais.tsx
export interface ExpenseReport {
    id: number;
    code: string;
    employe: string; // ReadOnly name
    date: string;
    designation: string;
    montant: string; // API defines as decimal string
    projet: string;
    type: string;
    statut: "En attente" | "Validé" | "Refusé";
}

// From AutorisationsPage.tsx
export interface Authorization {
    id: number;
    code: string;
    employe: string; // ReadOnly name
    date: string;
    duree: string;
    type: string;
    motif?: string | null;
    statut: "En attente" | "Approuvé" | "Refusé";
}
