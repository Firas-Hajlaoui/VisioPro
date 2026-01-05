import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Notification } from '@/types/notification';

interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}

interface NotificationFilters {
    page?: number;
    limit?: number;
    read?: boolean;
    type?: string;
    priority?: string;
}

/**
 * Fetch paginated list of notifications for current user
 */
export function useNotifications(filters: NotificationFilters = {}) {
    return useQuery<PaginatedResponse<Notification>>({
        queryKey: ['notifications', filters],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (filters.page) params.append('page', filters.page.toString());
            if (filters.limit) params.append('limit', filters.limit.toString());
            if (filters.read !== undefined) params.append('read', filters.read.toString());
            if (filters.type) params.append('type', filters.type);
            if (filters.priority) params.append('priority', filters.priority);

            const response = await api.get(`/notifications/?${params.toString()}`);
            return response.data;
        },
    });
}

/**
 * Fetch single notification by ID
 */
export function useNotification(id: number) {
    return useQuery<Notification>({
        queryKey: ['notification', id],
        queryFn: async () => {
            const response = await api.get(`/notifications/${id}/`);
            return response.data;
        },
        enabled: !!id,
    });
}

/**
 * Create/send new notification (admin only)
 */
export function useCreateNotification() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: Partial<Notification>) => {
            const response = await api.post('/notifications/', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });
}

/**
 * Mark notification as read
 */
export function useMarkNotificationAsRead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            const response = await api.post(`/notifications/${id}/mark_as_read/`);
            return response.data;
        },
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            queryClient.invalidateQueries({ queryKey: ['notification', id] });
        },
    });
}

/**
 * Mark all notifications as read
 */
export function useMarkAllNotificationsAsRead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const response = await api.post('/notifications/mark_all_as_read/');
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });
}

/**
 * Delete notification
 */
export function useDeleteNotification() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            await api.delete(`/notifications/${id}/`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });
}

/**
 * Get unread notification count
 */
export function useUnreadNotificationCount() {
    return useQuery<{ count: number }>({
        queryKey: ['notifications', 'unread-count'],
        queryFn: async () => {
            const response = await api.get('/notifications/unread_count/');
            return response.data;
        },
        refetchInterval: 60000, // Refetch every minute
    });
}
