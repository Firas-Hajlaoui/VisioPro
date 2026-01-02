export interface TrainingSession {
    id: number;
    code: string;
    titre: string;
    formateur: string;
    date: string;
    participants: number;
    duree: string;
    description?: string;
    statut: "Planifiée" | "En cours" | "Terminée";
}
