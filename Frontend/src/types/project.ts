export interface ProjectDoc {
    id: string;
    name: string;
    type: "Devis" | "Technique" | "Administratif" | "Autre";
    date: string;
    size: string;
}

export interface Project {
    id: number; // API: integer
    code: string;
    intitule: string;
    client: string;
    chefProjet: string;
    dateDebut: string;
    dateFin: string;
    description?: string | null;
    progression: number;
    statut: "En cours" | "Terminé" | "En pause" | "Annulé";
    stats?: string; // API defines as string (json string?) or readOnly. keeping loose for now as API says string.
    docsList?: ProjectDoc[];
}