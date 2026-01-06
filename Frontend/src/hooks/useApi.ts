// API Base Configuration
import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from "@tanstack/react-query";
import { toast } from "sonner";

// Base API URL - will be set by environment
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

// Generic API fetch function with error handling
export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      let errorMessage = `Erreur ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorData.message || errorMessage;
      } catch {
        // Ignore JSON parse errors
      }
      throw new Error(errorMessage);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message);
      throw error;
    }
    toast.error("Erreur réseau");
    throw new Error("Erreur réseau");
  }
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
  email: string;
  password: string;
  role?: string;
}

export interface AuthResponse {
  user: {
    id: number;
    email: string;
    first_name?: string;
    last_name?: string;
    role?: string;
  };
  access: string;
  refresh: string;
}

export function useLogin(): UseMutationResult<AuthResponse, Error, LoginCredentials> {
  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await fetch("http://localhost:8000/api/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Invalid credentials");
      }

      const tokens = await response.json();

      // Get user info
      const userResponse = await fetch("http://localhost:8000/api/user/me/", {
        headers: {
          "Authorization": `Bearer ${tokens.access}`,
        },
      });

      if (!userResponse.ok) {
        throw new Error("Failed to fetch user info");
      }

      const userData = await userResponse.json();

      return {
        user: {
          ...userData,
          email: credentials.email,
          role: credentials.role || userData.role || "employee",
        },
        access: tokens.access,
        refresh: tokens.refresh,
      };
    },
    onSuccess: () => {
      toast.success("Connexion réussie");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

// ===== EMPLOYEES API =====

export interface Employee {
  id?: number;
  code?: string;
  nom: string;
  prenom: string;
  email: string;
  poste: string;
  departement: string;
  date_embauche: string;
  salaire: number;
  statut: string;
  password?: string;
}

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
        `/rh/employees/?${buildQueryParams(params || {})}`
      ),
  });

  const createMutation = useMutation({
    mutationFn: (newEmployee: Omit<Employee, "id" | "code">) =>
      apiFetch<Employee>("/rh/employees/", {
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
      apiFetch<Employee>(`/rh/employees/${employee.id}/`, {
        method: "PUT",
        body: JSON.stringify({
          nom: employee.nom,
          prenom: employee.prenom,
          email: employee.email,
          poste: employee.poste,
          departement: employee.departement,
          date_embauche: employee.date_embauche,
          salaire: employee.salaire,
          statut: employee.statut
        }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success("Employé modifié avec succès");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      apiFetch(`/rh/employees/${id}/`, {
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
    createEmployeeAsync: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateEmployee: updateMutation.mutate,
    updateEmployeeAsync: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteEmployee: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
}

// ===== LEAVE REQUESTS API =====

export interface LeaveRequest {
  id?: number;
  code?: string;
  employee?: string;
  employeeId?: number;
  dateFrom: string;
  dateTo: string;
  leaveType: string;
  reason?: string;
  status: string;
  notes?: string;
}

export function useLeaveRequests(params?: {
  status?: string;
  employee?: string;
  dateFrom?: string;
  dateTo?: string;
  type?: string;
  page?: number;
}) {
  const queryClient = useQueryClient();
  
  const queryKey = ["leave-requests", params];
  
  const queryResult = useQuery({
    queryKey,
    queryFn: () =>
      apiFetch<PaginatedResponse<LeaveRequest>>(
        `/rh/leave-requests/?${buildQueryParams(params || {})}`
      ),
  });

  const createMutation = useMutation({
    mutationFn: (newRequest: Omit<LeaveRequest, "id" | "code">) =>
      apiFetch<LeaveRequest>("/rh/leave-requests/", {
        method: "POST",
        body: JSON.stringify({
          employee: newRequest.employeeId,
          dateFrom: newRequest.dateFrom,
          dateTo: newRequest.dateTo,
          leaveType: newRequest.leaveType,
          reason: newRequest.reason
        }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leave-requests"] });
      toast.success("Demande de congé créée avec succès");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (request: LeaveRequest) =>
      apiFetch<LeaveRequest>(`/rh/leave-requests/${request.id}/`, {
        method: "PUT",
        body: JSON.stringify({
          employee: request.employeeId,
          dateFrom: request.dateFrom,
          dateTo: request.dateTo,
          leaveType: request.leaveType,
          reason: request.reason
        }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leave-requests"] });
      toast.success("Demande de congé modifiée avec succès");
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, notes }: { id: number; status: string; notes?: string }) =>
      apiFetch<LeaveRequest>(`/rh/leave-requests/${id}/status/`, {
        method: "PATCH",
        body: JSON.stringify({ status, notes }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leave-requests"] });
      toast.success("Statut mis à jour avec succès");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      apiFetch(`/rh/leave-requests/${id}/`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leave-requests"] });
      toast.success("Demande de congé supprimée avec succès");
    },
  });

  return {
    ...queryResult,
    createLeaveRequest: createMutation.mutate,
    updateLeaveRequest: updateMutation.mutate,
    updateLeaveRequestStatus: updateStatusMutation.mutate,
    deleteLeaveRequest: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isUpdatingStatus: updateStatusMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

// ===== TIME RECORDS API =====

export interface TimeRecord {
  id?: number;
  code?: string;
  employeeId?: number;
  date: string;
  heure_entree: string;
  heure_sortie: string;
  lieu: string;
  type: string;
  heures?: number;
  statut: string;
  hs_valide?: boolean;
}

export function useTimeRecords(params?: {
  employee?: string;
  date?: string;
  date_from?: string;
  date_to?: string;
  lieu?: string;
  page?: number;
}) {
  const queryClient = useQueryClient();
  
  const queryKey = ["time-records", params];
  
  const queryResult = useQuery({
    queryKey,
    queryFn: () =>
      apiFetch<PaginatedResponse<TimeRecord>>(
        `/rh/time-records/?${buildQueryParams(params || {})}`
      ),
  });

  const createMutation = useMutation({
    mutationFn: (newRecord: Omit<TimeRecord, "id" | "code">) =>
      apiFetch<TimeRecord>("/rh/time-records/", {
        method: "POST",
        body: JSON.stringify({
          employee: newRecord.employeeId,
          date: newRecord.date,
          heure_entree: newRecord.heure_entree,
          heure_sortie: newRecord.heure_sortie,
          lieu: newRecord.lieu,
          type: newRecord.type
        }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["time-records"] });
      toast.success("Pointage créé avec succès");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (record: TimeRecord) =>
      apiFetch<TimeRecord>(`/rh/time-records/${record.id}/`, {
        method: "PUT",
        body: JSON.stringify({
          employee: record.employeeId,
          date: record.date,
          heure_entree: record.heure_entree,
          heure_sortie: record.heure_sortie,
          lieu: record.lieu,
          type: record.type
        }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["time-records"] });
      toast.success("Pointage modifié avec succès");
    },
  });

  const validateMutation = useMutation({
    mutationFn: ({ id, hsValide, notes }: { id: number; hsValide: boolean; notes?: string }) =>
      apiFetch<TimeRecord>(`/rh/time-records/${id}/validate/`, {
        method: "PATCH",
        body: JSON.stringify({ hsValide, notes }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["time-records"] });
      toast.success("Validation effectuée avec succès");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      apiFetch(`/rh/time-records/${id}/`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["time-records"] });
      toast.success("Pointage supprimé avec succès");
    },
  });

  return {
    ...queryResult,
    createTimeRecord: createMutation.mutate,
    updateTimeRecord: updateMutation.mutate,
    validateTimeRecord: validateMutation.mutate,
    deleteTimeRecord: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isValidating: validateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

// ===== AUTHORIZATIONS API =====

export interface Authorization {
  id?: number;
  code?: string;
  employeeId?: number;
  date: string;
  duree: string;
  type: string;
  motif: string;
  statut: string;
  notes?: string;
}

export function useAuthorizations(params?: {
  statut?: string;
  employee?: string;
  type?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
}) {
  const queryClient = useQueryClient();
  
  const queryKey = ["authorizations", params];
  
  const queryResult = useQuery({
    queryKey,
    queryFn: () =>
      apiFetch<PaginatedResponse<Authorization>>(
        `/rh/authorizations/?${buildQueryParams(params || {})}`
      ),
  });

  const createMutation = useMutation({
    mutationFn: (newAuth: Omit<Authorization, "id" | "code">) =>
      apiFetch<Authorization>("/rh/authorizations/", {
        method: "POST",
        body: JSON.stringify({
          employee: newAuth.employeeId,
          date: newAuth.date,
          duree: newAuth.duree,
          type: newAuth.type,
          motif: newAuth.motif
        }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authorizations"] });
      toast.success("Autorisation créée avec succès");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (auth: Authorization) =>
      apiFetch<Authorization>(`/rh/authorizations/${auth.id}/`, {
        method: "PUT",
        body: JSON.stringify({
          employee: auth.employeeId,
          date: auth.date,
          duree: auth.duree,
          type: auth.type,
          motif: auth.motif
        }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authorizations"] });
      toast.success("Autorisation modifiée avec succès");
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, notes }: { id: number; status: string; notes?: string }) =>
      apiFetch<Authorization>(`/rh/authorizations/${id}/status/`, {
        method: "PATCH",
        body: JSON.stringify({ status, notes }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authorizations"] });
      toast.success("Statut mis à jour avec succès");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      apiFetch(`/rh/authorizations/${id}/`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authorizations"] });
      toast.success("Autorisation supprimée avec succès");
    },
  });

  return {
    ...queryResult,
    createAuthorization: createMutation.mutate,
    updateAuthorization: updateMutation.mutate,
    updateAuthorizationStatus: updateStatusMutation.mutate,
    deleteAuthorization: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isUpdatingStatus: updateStatusMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

// ===== EXPENSE REPORTS API =====

export interface ExpenseReport {
  id?: number;
  code?: string;
  employeeId?: number;
  date: string;
  designation: string;
  montant: number;
  projet: string;
  type: string;
  statut: string;
  notes?: string;
  montant_autorise?: number;
}

export function useExpenseReports(params?: {
  statut?: string;
  employee?: string;
  type?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
}) {
  const queryClient = useQueryClient();
  
  const queryKey = ["expense-reports", params];
  
  const queryResult = useQuery({
    queryKey,
    queryFn: () =>
      apiFetch<PaginatedResponse<ExpenseReport>>(
        `/rh/expense-reports/?${buildQueryParams(params || {})}`
      ),
  });

  const createMutation = useMutation({
    mutationFn: (newExpense: Omit<ExpenseReport, "id" | "code">) =>
      apiFetch<ExpenseReport>("/rh/expense-reports/", {
        method: "POST",
        body: JSON.stringify({
          employee: newExpense.employeeId,
          date: newExpense.date,
          designation: newExpense.designation,
          montant: newExpense.montant,
          projet: newExpense.projet,
          type: newExpense.type
        }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expense-reports"] });
      toast.success("Note de frais créée avec succès");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (expense: ExpenseReport) =>
      apiFetch<ExpenseReport>(`/rh/expense-reports/${expense.id}/`, {
        method: "PUT",
        body: JSON.stringify({
          employee: expense.employeeId,
          date: expense.date,
          designation: expense.designation,
          montant: expense.montant,
          projet: expense.projet,
          type: expense.type
        }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expense-reports"] });
      toast.success("Note de frais modifiée avec succès");
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, statut, notes, montantAutorise }: { 
      id: number; 
      statut: string; 
      notes?: string;
      montantAutorise?: number;
    }) =>
      apiFetch<ExpenseReport>(`/rh/expense-reports/${id}/status/`, {
        method: "PATCH",
        body: JSON.stringify({ 
          statut, 
          notes,
          ...(montantAutorise !== undefined && { montant_autorise: montantAutorise })
        }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expense-reports"] });
      toast.success("Statut mis à jour avec succès");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      apiFetch(`/rh/expense-reports/${id}/`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expense-reports"] });
      toast.success("Note de frais supprimée avec succès");
    },
  });

  return {
    ...queryResult,
    data: queryResult.data?.results || queryResult.data,
    total: (queryResult.data as any)?.count || (Array.isArray(queryResult.data) ? queryResult.data.length : 0),
    createExpenseReport: createMutation.mutate,
    updateExpenseReport: updateMutation.mutate,
    updateExpenseReportStatus: updateStatusMutation.mutate,
    deleteExpenseReport: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isUpdatingStatus: updateStatusMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

// Export all hooks from a single file
export * from './useApi';
