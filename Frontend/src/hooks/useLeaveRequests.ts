import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { LeaveRequest } from '@/types/rh';

interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}

interface LeaveRequestFilters {
    page?: number;
    limit?: number;
    statut?: string;
    employe?: string;
    dateDebutFrom?: string;
    dateDebutTo?: string;
    type?: string;
}

/**
 * Fetch paginated list of leave requests
 */
export function useLeaveRequests(filters: LeaveRequestFilters = {}) {
    return useQuery<PaginatedResponse<LeaveRequest>>({
        queryKey: ['leaveRequests', filters],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (filters.page) params.append('page', filters.page.toString());
            if (filters.limit) params.append('limit', filters.limit.toString());
            if (filters.statut) params.append('statut', filters.statut);
            if (filters.employe) params.append('employe', filters.employe);
            if (filters.dateDebutFrom) params.append('date_debut_from', filters.dateDebutFrom);
            if (filters.dateDebutTo) params.append('date_debut_to', filters.dateDebutTo);
            if (filters.type) params.append('type', filters.type);

            const response = await api.get(`/rh/conges/?${params.toString()}`);
            return response.data;
        },
    });
}

/**
 * Fetch single leave request by ID
 */
export function useLeaveRequest(id: number) {
    return useQuery<LeaveRequest>({
        queryKey: ['leaveRequest', id],
        queryFn: async () => {
            const response = await api.get(`/rh/conges/${id}/`);
            return response.data;
        },
        enabled: !!id,
    });
}

/**
 * Create new leave request
 */
export function useCreateLeaveRequest() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: Partial<LeaveRequest>) => {
            const response = await api.post('/rh/conges/', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['leaveRequests'] });
        },
    });
}

/**
 * Update existing leave request
 */
export function useUpdateLeaveRequest(id: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: Partial<LeaveRequest>) => {
            const response = await api.put(`/rh/conges/${id}/`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['leaveRequests'] });
            queryClient.invalidateQueries({ queryKey: ['leaveRequest', id] });
        },
    });
}

/**
 * Update leave request status (approve/reject)
 */
export function useUpdateLeaveRequestStatus() {
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
            const response = await api.patch(`/rh/conges/${id}/status/`, {
                statut,
                notes,
            });
            return response.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['leaveRequests'] });
            queryClient.invalidateQueries({ queryKey: ['leaveRequest', variables.id] });
        },
    });
}

/**
 * Delete leave request
 */
export function useDeleteLeaveRequest() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            await api.delete(`/rh/conges/${id}/`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['leaveRequests'] });
        },
    });
}
