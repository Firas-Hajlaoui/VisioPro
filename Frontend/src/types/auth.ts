export type UserRole = "admin" | "employee";

export interface AuthUser {
    email: string;
    role: UserRole;
}

export interface AuthContextType {
    user: AuthUser | null;
    isAuthenticated: boolean;
    login: (email: string, password: string, role: UserRole) => void;
    logout: () => void;
}
