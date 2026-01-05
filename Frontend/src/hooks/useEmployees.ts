import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Employee } from '@/types/rh';

interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}

interface EmployeeFilters {
    page?: number;
    limit?: number;
    search?: string;
    statut?: string;
    departement?: string;
}

/**
 * Fetch paginated list of employees
 */
export function useEmployees(filters: EmployeeFilters = {}) {
    return useQuery<PaginatedResponse<Employee>>({
        queryKey: ['employees', filters],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (filters.page) params.append('page', filters.page.toString());
            if (filters.limit) params.append('limit', filters.limit.toString());
            if (filters.search) params.append('search', filters.search);
            if (filters.statut) params.append('statut', filters.statut);
            if (filters.departement) params.append('departement', filters.departement);

            const response = await api.get(`/rh/employees/?${params.toString()}`);
            return response.data;
        },
    });
}

/**
 * Fetch single employee by ID
 */
export function useEmployee(id: number) {
    return useQuery<Employee>({
        queryKey: ['employee', id],
        queryFn: async () => {
            const response = await api.get(`/rh/employees/${id}/`);
            return response.data;
        },
        enabled: !!id,
    });
}

/**
 * Create new employee
 */
export function useCreateEmployee() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: Partial<Employee>) => {
            const response = await api.post('/rh/employees/', data);
            return response.data;
        },
        onSuccess: () => {
            // Invalidate and refetch employees list
            queryClient.invalidateQueries({ queryKey: ['employees'] });
        },
    });
}

/**
 * Update existing employee
 */
export function useUpdateEmployee(id: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: Partial<Employee>) => {
            const response = await api.put(`/rh/employees/${id}/`, data);
            return response.data;
        },
        onSuccess: () => {
            // Invalidate both list and detail
            queryClient.invalidateQueries({ queryKey: ['employees'] });
            queryClient.invalidateQueries({ queryKey: ['employee', id] });
        },
    });
}

/**
 * Delete employee
 */
export function useDeleteEmployee() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            await api.delete(`/rh/employees/${id}/`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employees'] });
        },
    });
}
