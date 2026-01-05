import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { TimeRecord } from '@/types/rh';

interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}

interface TimeRecordFilters {
    page?: number;
    limit?: number;
    employe?: string;
    date?: string;
    dateFrom?: string;
    dateTo?: string;
    lieu?: string;
}

/**
 * Fetch paginated list of time records
 */
export function useTimeRecords(filters: TimeRecordFilters = {}) {
    return useQuery<PaginatedResponse<TimeRecord>>({
        queryKey: ['timeRecords', filters],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (filters.page) params.append('page', filters.page.toString());
            if (filters.limit) params.append('limit', filters.limit.toString());
            if (filters.employe) params.append('employe', filters.employe);
            if (filters.date) params.append('date', filters.date);
            if (filters.dateFrom) params.append('date_from', filters.dateFrom);
            if (filters.dateTo) params.append('date_to', filters.dateTo);
            if (filters.lieu) params.append('lieu', filters.lieu);

            const response = await api.get(`/rh/temps/?${params.toString()}`);
            return response.data;
        },
    });
}

/**
 * Fetch single time record by ID
 */
export function useTimeRecord(id: number) {
    return useQuery<TimeRecord>({
        queryKey: ['timeRecord', id],
        queryFn: async () => {
            const response = await api.get(`/rh/temps/${id}/`);
            return response.data;
        },
        enabled: !!id,
    });
}

/**
 * Create new time record
 */
export function useCreateTimeRecord() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: Partial<TimeRecord>) => {
            const response = await api.post('/rh/temps/', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['timeRecords'] });
        },
    });
}

/**
 * Update existing time record
 */
export function useUpdateTimeRecord(id: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: Partial<TimeRecord>) => {
            const response = await api.put(`/rh/temps/${id}/`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['timeRecords'] });
            queryClient.invalidateQueries({ queryKey: ['timeRecord', id] });
        },
    });
}

/**
 * Validate time record
 */
export function useValidateTimeRecord() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            hsValide,
            notes,
        }: {
            id: number;
            hsValide: boolean;
            notes?: string;
        }) => {
            const response = await api.patch(`/rh/temps/${id}/validate/`, {
                hsValide,
                notes,
            });
            return response.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['timeRecords'] });
            queryClient.invalidateQueries({ queryKey: ['timeRecord', variables.id] });
        },
    });
}

/**
 * Delete time record
 */
export function useDeleteTimeRecord() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            await api.delete(`/rh/temps/${id}/`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['timeRecords'] });
        },
    });
}
