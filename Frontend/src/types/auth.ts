export type UserRole = "admin" | "manager" | "employee";

export interface AuthUser {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    department: string;
    employeeCode?: string;
    fullName?: string;
}

export interface AuthTokens {
    access: string;
    refresh: string;
}

export interface LoginResponse {
    user: AuthUser;
    tokens: AuthTokens;
}

export interface AuthContextType {
    user: AuthUser | null;
    isAuthenticated: boolean;
    login: (email: string, password: string, role?: UserRole) => Promise<void>;
    logout: () => Promise<void>;
}
