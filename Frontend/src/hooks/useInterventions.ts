import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Intervention } from '@/types/intervention';

interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}

interface InterventionFilters {
    page?: number;
    limit?: number;
    search?: string;
    statut?: string;
    client?: string;
    technicien?: string;
    type?: string;
}

/**
 * Fetch paginated list of engineering interventions
 */
export function useInterventions(filters: InterventionFilters = {}) {
    return useQuery<PaginatedResponse<Intervention>>({
        queryKey: ['interventions', filters],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (filters.page) params.append('page', filters.page.toString());
            if (filters.limit) params.append('limit', filters.limit.toString());
            if (filters.search) params.append('search', filters.search);
            if (filters.statut) params.append('statut', filters.statut);
            if (filters.client) params.append('client', filters.client);
            if (filters.technicien) params.append('technicien', filters.technicien);
            if (filters.type) params.append('type', filters.type);

            const response = await api.get(`/engineering/?${params.toString()}`);
            return response.data;
        },
    });
}

/**
 * Fetch single intervention by ID
 */
export function useIntervention(id: string | number) {
    return useQuery<Intervention>({
        queryKey: ['intervention', id],
        queryFn: async () => {
            const response = await api.get(`/engineering/${id}/`);
            return response.data;
        },
        enabled: !!id,
    });
}

/**
 * Create new intervention
 */
export function useCreateIntervention() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: Partial<Intervention>) => {
            const response = await api.post('/engineering/', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['interventions'] });
        },
    });
}

/**
 * Update existing intervention
 */
export function useUpdateIntervention(id: string | number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: Partial<Intervention>) => {
            const response = await api.put(`/engineering/${id}/`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['interventions'] });
            queryClient.invalidateQueries({ queryKey: ['intervention', id] });
        },
    });
}

/**
 * Delete intervention
 */
export function useDeleteIntervention() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string | number) => {
            await api.delete(`/engineering/${id}/`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['interventions'] });
        },
    });
}
