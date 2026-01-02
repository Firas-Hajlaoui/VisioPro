export interface Notification {
    id: string;
    subject: string;
    message: string;
    audience: "all" | "admin" | "employee" | "specific";
    recipientNames?: string[]; // Full names of recipients (for specific notifications)
    sentAt: string;
    sender: string;
    status: "sent" | "scheduled" | "draft";
    type?: "info" | "warning" | "success" | "error"; // notification type
    priority?: "low" | "normal" | "high"; // notification priority
    read?: boolean; // for single user notifications
    readAt?: string; // timestamp when read
}

// Type spécifique pour les notifications à un ou plusieurs utilisateurs
export interface SpecificUserNotification extends Notification {
    recipientNames: string[]; // One or multiple full names
    read: boolean;
    readAt?: string;
}
