export type UserRole = "admin" | "employee" | "manager";

export interface AuthUser {
    id: string;
    email: string;
    role: UserRole;
    firstName?: string;
    lastName?: string;
}

export interface LoginResult {
    success: boolean;
    error?: Error | unknown;
}

export interface AuthContextType {
    user: AuthUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string, role: UserRole) => Promise<LoginResult>;
    logout: () => void;
}
