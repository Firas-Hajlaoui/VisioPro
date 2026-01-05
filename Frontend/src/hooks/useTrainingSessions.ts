import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

interface TrainingSession {
    id: number;
    code: string;
    titre: string;
    formateur: string;
    date: string;
    participants: number;
    duree: string;
    description?: string;
    statut: 'Planifiée' | 'En cours' | 'Terminée';
}

interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}

interface TrainingSessionFilters {
    page?: number;
    limit?: number;
    search?: string;
    statut?: string;
    dateFrom?: string;
    dateTo?: string;
}

/**
 * Fetch paginated list of training sessions
 */
export function useTrainingSessions(filters: TrainingSessionFilters = {}) {
    return useQuery<PaginatedResponse<TrainingSession>>({
        queryKey: ['trainingSessions', filters],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (filters.page) params.append('page', filters.page.toString());
            if (filters.limit) params.append('limit', filters.limit.toString());
            if (filters.search) params.append('search', filters.search);
            if (filters.statut) params.append('statut', filters.statut);
            if (filters.dateFrom) params.append('date_from', filters.dateFrom);
            if (filters.dateTo) params.append('date_to', filters.dateTo);

            const response = await api.get(`/formation/?${params.toString()}`);
            return response.data;
        },
    });
}

/**
 * Fetch single training session by ID
 */
export function useTrainingSession(id: number) {
    return useQuery<TrainingSession>({
        queryKey: ['trainingSession', id],
        queryFn: async () => {
            const response = await api.get(`/formation/${id}/`);
            return response.data;
        },
        enabled: !!id,
    });
}

/**
 * Create new training session
 */
export function useCreateTrainingSession() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: Partial<TrainingSession>) => {
            const response = await api.post('/formation/', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['trainingSessions'] });
        },
    });
}

/**
 * Update existing training session
 */
export function useUpdateTrainingSession(id: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: Partial<TrainingSession>) => {
            const response = await api.put(`/formation/${id}/`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['trainingSessions'] });
            queryClient.invalidateQueries({ queryKey: ['trainingSession', id] });
        },
    });
}

/**
 * Delete training session
 */
export function useDeleteTrainingSession() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            await api.delete(`/formation/${id}/`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['trainingSessions'] });
        },
    });
}
