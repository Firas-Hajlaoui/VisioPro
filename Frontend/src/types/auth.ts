export type UserRole = "admin" | "employee" | "manager";

export interface AuthUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
    departement: string;
}

export interface AuthContextType {
    user: AuthUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface TokenResponse {
    access: string;
    refresh: string;
}
