import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from "@tanstack/react-query";
import { toast } from "sonner"; // Or "@/components/ui/use-toast" depending on your setup
import { Employee, LeaveRequest, TimeRecord, Authorization, ExpenseReport } from "../types/rh";
import { User } from "../types/user";
import { Project } from "../types/project";
import { Notification } from "../types/notification";

// Base API URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

// Generic API fetch function with error handling and Token Injection
export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  // Get token from storage
  const token = localStorage.getItem("access_token");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Inject Bearer token if it exists
  if (token) {
    (headers as any)["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorMessage = `Erreur ${response.status}`;
      try {
        const errorData = await response.json();
        // Handle Django DRF error formats
        errorMessage = errorData.detail || errorData.message || JSON.stringify(errorData) || errorMessage;
      } catch {
        // Ignore JSON parse errors
      }
      
      // Handle 401 Unauthorized (Token expired)
      if (response.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
        window.location.href = "/login"; // Force redirect
        throw new Error("Session expirée. Veuillez vous reconnecter.");
      }

      throw new Error(errorMessage);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      // Don't toast on 401 redirects to avoid spamming
      if (error.message !== "Session expirée. Veuillez vous reconnecter.") {
        console.error(error.message);
      }
      throw error;
    }
    throw new Error("Erreur réseau");
  }
}

// ... (Rest of your buildQueryParams and other hooks remain the same) ...

// ===== AUTHENTICATION API =====

export interface LoginCredentials {
  email?: string;
  username?: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  access: string;
  refresh: string;
}

export function useLogin(): UseMutationResult<AuthResponse, Error, LoginCredentials> {
  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const payload = {
        username: credentials.email || credentials.username, 
        password: credentials.password
      };

      // Note: We use raw fetch here to avoid attaching an old/invalid token via apiFetch during login
      const response = await fetch(`${API_BASE_URL}/token/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Identifiants invalides");
      }

      const tokens = await response.json();

      // IMPORTANT: In a real app, decode the JWT here or call /users/me/ to get real user data.
      // Returning a placeholder based on input for now as per your previous code structure.
      return {
        user: { 
            id: "1", // Placeholder ID
            email: payload.username || "", 
            firstName: "Utilisateur", 
            lastName: "VisioPro", 
            role: "employee" // This will be overwritten by the UI selection in AuthProvider
        },
        access: tokens.access,
        refresh: tokens.refresh
      };
    },
    onError: (error: Error) => {
      console.error("Login API Error:", error);
    },
  });
}



// Query parameters helper
export function buildQueryParams(params: Record<string, any>): string {
  const filtered = Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v !== undefined && v !== null && v !== "")
  );
  return new URLSearchParams(filtered).toString();
}

// ===== AUTHENTICATION API =====

export interface LoginCredentials {
  email?: string;
  username?: string;
  password: string;
}

export interface AuthResponse {
  user: User; // We will fetch user details and map to User type
  access: string;
  refresh: string;
}


// ===== EMPLOYEES API =====

export interface PaginatedResponse<T> {
  results: T[];
  count: number;
  next: string | null;
  previous: string | null;
}

export function useEmployees(params?: {
  search?: string;
  statut?: string;
  departement?: string;
  page?: number;
}) {
  const queryClient = useQueryClient();
  const queryKey = ["employees", params];

  const queryResult = useQuery({
    queryKey,
    queryFn: () =>
      apiFetch<PaginatedResponse<Employee>>(
        `/employees/?${buildQueryParams(params || {})}`
      ),
  });

  const createMutation = useMutation({
    mutationFn: (newEmployee: Omit<Employee, "id" | "code">) =>
      apiFetch<Employee>("/employees/", {
        method: "POST",
        body: JSON.stringify(newEmployee),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success("Employé créé avec succès");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (employee: Employee) =>
      apiFetch<Employee>(`/employees/${employee.id}/`, {
        method: "PUT",
        body: JSON.stringify(employee),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success("Employé modifié avec succès");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      apiFetch(`/employees/${id}/`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success("Employé supprimé avec succès");
    },
  });

  return {
    ...queryResult,
    createEmployee: createMutation.mutate,
    updateEmployee: updateMutation.mutate,
    deleteEmployee: deleteMutation.mutate,
  };
}

// ===== LEAVE REQUESTS API =====

export function useLeaveRequests(params?: {
  statut?: string;
  employe?: string;
  dateFrom?: string; // YAML doesn't specify filter params clearly but standard django filters usually match fields
  // Mapping 'dateFrom' to 'debut__gte' or similar might be needed backend side. 
  // For now assuming backend handles query params or we send as is.
  page?: number;
}) {
  const queryClient = useQueryClient();
  const queryKey = ["leaves", params];

  const queryResult = useQuery({
    queryKey,
    queryFn: () =>
      apiFetch<PaginatedResponse<LeaveRequest>>(
        `/leaves/?${buildQueryParams(params || {})}`
      ),
  });

  const createMutation = useMutation({
    mutationFn: (newRequest: Omit<LeaveRequest, "id" | "employe"> & { employeId?: number }) =>
      apiFetch<LeaveRequest>("/leaves/", {
        method: "POST",
        body: JSON.stringify(newRequest),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaves"] });
      toast.success("Demande de congé créée");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (request: LeaveRequest) =>
      apiFetch<LeaveRequest>(`/leaves/${request.id}/`, {
        method: "PUT",
        body: JSON.stringify(request),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaves"] });
      toast.success("Demande de congé modifiée");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiFetch(`/leaves/${id}/`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaves"] });
      toast.success("Supprimé");
    }
  });

  return {
    ...queryResult,
    createLeaveRequest: createMutation.mutate,
    updateLeaveRequest: updateMutation.mutate,
    deleteLeaveRequest: deleteMutation.mutate,
  };
}

// ===== TIME RECORDS API =====

export function useTimeRecords(params?: {
  employe?: string;
  date?: string;
  page?: number;
}) {
  const queryClient = useQueryClient();
  const queryKey = ["time-records", params];

  const queryResult = useQuery({
    queryKey,
    queryFn: () =>
      apiFetch<PaginatedResponse<TimeRecord>>(
        `/time-records/?${buildQueryParams(params || {})}`
      ),
  });

  const createMutation = useMutation({
    mutationFn: (newRecord: Partial<TimeRecord>) =>
      apiFetch<TimeRecord>("/time-records/", {
        method: "POST",
        body: JSON.stringify(newRecord),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["time-records"] });
      toast.success("Pointage créé");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (record: TimeRecord) =>
      apiFetch<TimeRecord>(`/time-records/${record.id}/`, {
        method: "PUT",
        body: JSON.stringify(record),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["time-records"] });
      toast.success("Pointage mis à jour");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiFetch(`/time-records/${id}/`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["time-records"] });
      toast.success("Pointage supprimé");
    }
  });

  return {
    ...queryResult,
    createTimeRecord: createMutation.mutate,
    updateTimeRecord: updateMutation.mutate,
    deleteTimeRecord: deleteMutation.mutate,
  };
}

// ===== AUTHORIZATIONS API =====

export function useAuthorizations(params?: {
  statut?: string;
  page?: number;
}) {
  const queryClient = useQueryClient();
  const queryKey = ["authorizations", params];

  const queryResult = useQuery({
    queryKey,
    queryFn: () =>
      apiFetch<PaginatedResponse<Authorization>>(
        `/authorizations/?${buildQueryParams(params || {})}`
      ),
  });

  const createMutation = useMutation({
    mutationFn: (newAuth: Partial<Authorization>) =>
      apiFetch<Authorization>("/authorizations/", {
        method: "POST",
        body: JSON.stringify(newAuth),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authorizations"] });
      toast.success("Autorisation créée");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (auth: Authorization) =>
      apiFetch<Authorization>(`/authorizations/${auth.id}/`, {
        method: "PUT",
        body: JSON.stringify(auth),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authorizations"] });
      toast.success("Autorisation mise à jour");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiFetch(`/authorizations/${id}/`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authorizations"] });
      toast.success("Autorisation supprimée");
    }
  });

  return {
    ...queryResult,
    createAuthorization: createMutation.mutate,
    updateAuthorization: updateMutation.mutate,
    deleteAuthorization: deleteMutation.mutate,
  };
}

// ===== EXPENSE REPORTS API =====

export function useExpenseReports(params?: {
  statut?: string;
  page?: number;
}) {
  const queryClient = useQueryClient();
  const queryKey = ["expenses", params];

  const queryResult = useQuery({
    queryKey,
    queryFn: () =>
      apiFetch<PaginatedResponse<ExpenseReport>>(
        `/expenses/?${buildQueryParams(params || {})}`
      ),
  });

  const createMutation = useMutation({
    mutationFn: (newExpense: Partial<ExpenseReport>) =>
      apiFetch<ExpenseReport>("/expenses/", {
        method: "POST",
        body: JSON.stringify(newExpense),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      toast.success("Note de frais créée");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (expense: ExpenseReport) =>
      apiFetch<ExpenseReport>(`/expenses/${expense.id}/`, {
        method: "PUT",
        body: JSON.stringify(expense),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      toast.success("Note de frais mise à jour");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiFetch(`/expenses/${id}/`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      toast.success("Note de frais supprimée");
    }
  });

  return {
    ...queryResult,
    createExpenseReport: createMutation.mutate,
    updateExpenseReport: updateMutation.mutate,
    deleteExpenseReport: deleteMutation.mutate,
  };
}

// ===== PROJECTS API =====

export function useProjects(params?: {
  statut?: string;
  page?: number;
}) {
  const queryClient = useQueryClient();
  const queryKey = ["projects", params];

  const queryResult = useQuery({
    queryKey,
    queryFn: () =>
      apiFetch<PaginatedResponse<Project>>(
        `/projects/?${buildQueryParams(params || {})}`
      ),
  });

  return { ...queryResult };
}

// ===== NOTIFICATIONS API =====

export function useNotifications() {
  const queryClient = useQueryClient();
  const queryKey = ["notifications"];

  const queryResult = useQuery({
    queryKey,
    queryFn: () => apiFetch<PaginatedResponse<Notification>>("/notifications/"),
  });

  return { ...queryResult };
}

