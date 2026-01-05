import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { ExpenseReport } from '@/types/rh';

interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}

interface ExpenseReportFilters {
    page?: number;
    limit?: number;
    statut?: string;
    employe?: string;
    dateFrom?: string;
    dateTo?: string;
    type?: string;
}

/**
 * Fetch paginated list of expense reports
 */
export function useExpenseReports(filters: ExpenseReportFilters = {}) {
    return useQuery<PaginatedResponse<ExpenseReport>>({
        queryKey: ['expenseReports', filters],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (filters.page) params.append('page', filters.page.toString());
            if (filters.limit) params.append('limit', filters.limit.toString());
            if (filters.statut) params.append('statut', filters.statut);
            if (filters.employe) params.append('employe', filters.employe);
            if (filters.dateFrom) params.append('date_from', filters.dateFrom);
            if (filters.dateTo) params.append('date_to', filters.dateTo);
            if (filters.type) params.append('type', filters.type);

            const response = await api.get(`/rh/frais/?${params.toString()}`);
            return response.data;
        },
    });
}

/**
 * Fetch single expense report by ID
 */
export function useExpenseReport(id: number) {
    return useQuery<ExpenseReport>({
        queryKey: ['expenseReport', id],
        queryFn: async () => {
            const response = await api.get(`/rh/frais/${id}/`);
            return response.data;
        },
        enabled: !!id,
    });
}

/**
 * Create new expense report
 */
export function useCreateExpenseReport() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: Partial<ExpenseReport>) => {
            const response = await api.post('/rh/frais/', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expenseReports'] });
        },
    });
}

/**
 * Update existing expense report
 */
export function useUpdateExpenseReport(id: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: Partial<ExpenseReport>) => {
            const response = await api.put(`/rh/frais/${id}/`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expenseReports'] });
            queryClient.invalidateQueries({ queryKey: ['expenseReport', id] });
        },
    });
}

/**
 * Update expense report status (validate/reject)
 */
export function useUpdateExpenseReportStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            statut,
            notes,
            montantAutorise,
        }: {
            id: number;
            statut: 'Validé' | 'Refusé';
            notes?: string;
            montantAutorise?: number;
        }) => {
            const response = await api.patch(`/rh/frais/${id}/status/`, {
                statut,
                notes,
                montantAutorise,
            });
            return response.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['expenseReports'] });
            queryClient.invalidateQueries({ queryKey: ['expenseReport', variables.id] });
        },
    });
}

/**
 * Delete expense report
 */
export function useDeleteExpenseReport() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            await api.delete(`/rh/frais/${id}/`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expenseReports'] });
        },
    });
}
