// From GestionEmployee.tsx
export interface Employee {
    id: number;
    code: string;
    nom: string;
    prenom: string;
    email: string;
    poste: string;
    departement: string;
    dateEmbauche: string;
    salaire: number;
    statut: "Actif" | "Inactif" | "En congé";
}

// From CongesPage.tsx
export interface LeaveRequest {
    id: number;
    code: string;
    employe: string;
    debut: string;
    fin: string;
    jours: number;
    type: string;
    motif?: string;
    statut: "En attente" | "Approuvé" | "Refusé";
}

// From TempsPage.tsx
export interface TimeRecord {
    id: number;
    code: string;
    employe: string;
    date: string;
    heureEntree: string;
    heureSortie: string;
    lieu: string;
    heures: number;
    type: string;
    statut: string;
    hsValide: boolean;
}

// From NoteFrais.tsx
export interface ExpenseReport {
    id: number;
    code: string;
    employe: string;
    date: string;
    designation: string;
    montant: number;
    projet: string;
    type: string;
    statut: "En attente" | "Validé" | "Refusé";
}

// From AutorisationsPage.tsx
export interface Authorization {
    id: number;
    code: string;
    employe: string;
    date: string;
    duree: string; // Format "2h"
    type: string;
    motif?: string;
    statut: "En attente" | "Approuvé" | "Refusé";
}
