import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Authorization } from '@/types/rh';

interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}

interface AuthorizationFilters {
    page?: number;
    limit?: number;
    statut?: string;
    employe?: string;
    type?: string;
    dateFrom?: string;
    dateTo?: string;
}

/**
 * Fetch paginated list of authorizations
 */
export function useAuthorizations(filters: AuthorizationFilters = {}) {
    return useQuery<PaginatedResponse<Authorization>>({
        queryKey: ['authorizations', filters],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (filters.page) params.append('page', filters.page.toString());
            if (filters.limit) params.append('limit', filters.limit.toString());
            if (filters.statut) params.append('statut', filters.statut);
            if (filters.employe) params.append('employe', filters.employe);
            if (filters.type) params.append('type', filters.type);
            if (filters.dateFrom) params.append('date_from', filters.dateFrom);
            if (filters.dateTo) params.append('date_to', filters.dateTo);

            const response = await api.get(`/rh/autorisations/?${params.toString()}`);
            return response.data;
        },
    });
}

/**
 * Fetch single authorization by ID
 */
export function useAuthorization(id: number) {
    return useQuery<Authorization>({
        queryKey: ['authorization', id],
        queryFn: async () => {
            const response = await api.get(`/rh/autorisations/${id}/`);
            return response.data;
        },
        enabled: !!id,
    });
}

/**
 * Create new authorization
 */
export function useCreateAuthorization() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: Partial<Authorization>) => {
            const response = await api.post('/rh/autorisations/', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['authorizations'] });
        },
    });
}

/**
 * Update existing authorization
 */
export function useUpdateAuthorization(id: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: Partial<Authorization>) => {
            const response = await api.put(`/rh/autorisations/${id}/`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['authorizations'] });
            queryClient.invalidateQueries({ queryKey: ['authorization', id] });
        },
    });
}

/**
 * Update authorization status (approve/reject)
 */
export function useUpdateAuthorizationStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            statut,
            notes,
        }: {
            id: number;
            statut: 'Approuvé' | 'Refusé';
            notes?: string;
        }) => {
            const response = await api.patch(`/rh/autorisations/${id}/status/`, {
                statut,
                notes,
            });
            return response.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['authorizations'] });
            queryClient.invalidateQueries({ queryKey: ['authorization', variables.id] });
        },
    });
}

/**
 * Delete authorization
 */
export function useDeleteAuthorization() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            await api.delete(`/rh/autorisations/${id}/`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['authorizations'] });
        },
    });
}
