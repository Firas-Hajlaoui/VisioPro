import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Project } from '@/types/project';

interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}

interface ProjectFilters {
    page?: number;
    limit?: number;
    search?: string;
    statut?: string;
    client?: string;
}

/**
 * Fetch paginated list of projects
 */
export function useProjects(filters: ProjectFilters = {}) {
    return useQuery<PaginatedResponse<Project>>({
        queryKey: ['projects', filters],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (filters.page) params.append('page', filters.page.toString());
            if (filters.limit) params.append('limit', filters.limit.toString());
            if (filters.search) params.append('search', filters.search);
            if (filters.statut) params.append('statut', filters.statut);
            if (filters.client) params.append('client', filters.client);

            const response = await api.get(`/projects/?${params.toString()}`);
            return response.data;
        },
    });
}

/**
 * Fetch single project by ID
 */
export function useProject(id: number) {
    return useQuery<Project>({
        queryKey: ['project', id],
        queryFn: async () => {
            const response = await api.get(`/projects/${id}/`);
            return response.data;
        },
        enabled: !!id,
    });
}

/**
 * Create new project
 */
export function useCreateProject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: Partial<Project>) => {
            const response = await api.post('/projects/', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        },
    });
}

/**
 * Update existing project
 */
export function useUpdateProject(id: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: Partial<Project>) => {
            const response = await api.put(`/projects/${id}/`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            queryClient.invalidateQueries({ queryKey: ['project', id] });
        },
    });
}

/**
 * Delete project
 */
export function useDeleteProject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            await api.delete(`/projects/${id}/`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        },
    });
}
