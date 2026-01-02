export interface EngineeringIntervention {
    id: number;
    code: string;
    client: string;
    site: string;
    technicien: string;
    date: string;
    type: string;
    description?: string;
    statut: "Planifiée" | "En cours" | "Terminée";
}
