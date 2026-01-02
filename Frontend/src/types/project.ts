export interface ProjectDoc {
    id: string;
    name: string;
    type: "Devis" | "Technique" | "Administratif" | "Autre";
    date: string;
    size: string;
}

export interface Project {
    documents?: any;
    id: number;
    code: string;
    intitule: string;
    client: string;
    chefProjet: string;
    dateDebut: string;
    dateFin: string;
    description?: string;
    progression: number;
    statut: "En cours" | "Terminé" | "En pause" | "Annulé";
    // Statistics for Admin Dashboard
    stats?: {
        devis: number;
        fiches: number;
        technique: number;
        backup: number;
    };
    // Detailed documents list for Employee View
    docsList?: ProjectDoc[];
    
}