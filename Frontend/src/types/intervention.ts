export interface Photo {
    id: string;
    file: File;
    preview: string;
    designation: string;
}

export interface Intervention {
    id: string | number; // Support legacy numbers from engineering or strings from reports
    code: string; // Unified code/fiNumber
    numeroBT?: string;

    // Date and Planning
    date: string; // interventionDate
    dateFin?: string;

    // Location and Context
    client?: string;
    site: string; // location
    equipment?: string;
    type?: string; // Type for engineering (Maintenance, Audit, etc.)

    // Participants
    technicien?: string; // Main technician assigned (engineering view)
    internalIntervenants?: string;
    clientIntervenants?: string;

    // Duration
    durationDays?: number;
    durationHours?: number;

    // Technical Details
    description?: string; // Generic description
    defectDescription?: string;
    workPerformed?: string;
    actionsToRealize?: string;
    observations?: string;

    // Evidence
    photos?: Photo[];
    clientSignature?: string | null;
    techSignature?: string | null;

    // Status
    statut: "Planifiée" | "En cours" | "Terminée" | "draft" | "validated";

    createdAt?: string;
}
