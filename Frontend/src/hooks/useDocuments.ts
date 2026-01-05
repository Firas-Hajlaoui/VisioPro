import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

interface Document {
    id: number;
    code: string;
    nom: string;
    type: 'Devis' | 'Technique' | 'Administratif' | 'Autre';
    departement: string;
    date: string;
    taille: string;
    minioPath?: string;
    file?: string;
}

interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}

interface DocumentFilters {
    page?: number;
    limit?: number;
    search?: string;
    type?: string;
    departement?: string;
}

/**
 * Fetch paginated list of documents
 */
export function useDocuments(filters: DocumentFilters = {}) {
    return useQuery<PaginatedResponse<Document>>({
        queryKey: ['documents', filters],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (filters.page) params.append('page', filters.page.toString());
            if (filters.limit) params.append('limit', filters.limit.toString());
            if (filters.search) params.append('search', filters.search);
            if (filters.type) params.append('type', filters.type);
            if (filters.departement) params.append('departement', filters.departement);

            const response = await api.get(`/documents/?${params.toString()}`);
            return response.data;
        },
    });
}

/**
 * Fetch single document by ID
 */
export function useDocument(id: number) {
    return useQuery<Document>({
        queryKey: ['document', id],
        queryFn: async () => {
            const response = await api.get(`/documents/${id}/`);
            return response.data;
        },
        enabled: !!id,
    });
}

/**
 * Upload new document
 */
export function useUploadDocument() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (formData: FormData) => {
            const response = await api.post('/documents/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['documents'] });
        },
    });
}

/**
 * Update existing document
 */
export function useUpdateDocument(id: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: Partial<Document>) => {
            const response = await api.put(`/documents/${id}/`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['documents'] });
            queryClient.invalidateQueries({ queryKey: ['document', id] });
        },
    });
}

/**
 * Delete document
 */
export function useDeleteDocument() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            await api.delete(`/documents/${id}/`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['documents'] });
        },
    });
}

/**
 * Download document
 */
export function useDownloadDocument() {
    return useMutation({
        mutationFn: async (id: number) => {
            const response = await api.get(`/documents/${id}/download/`, {
                responseType: 'blob',
            });

            // Create download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;

            // Extract filename from Content-Disposition header or use default
            const contentDisposition = response.headers['content-disposition'];
            const filename = contentDisposition
                ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
                : 'document';

            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            return response.data;
        },
    });
}
