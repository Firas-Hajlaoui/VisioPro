export interface Notification {
    id: number;
    user: number;
    title: string;
    message: string;
    read: boolean;
    created_at: string; // ISO 8601 date-time
}
