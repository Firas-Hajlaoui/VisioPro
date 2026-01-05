import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types/auth';

/**
 * Hook for user login
 */
export function useLogin() {
    const { login } = useAuth();

    return useMutation({
        mutationFn: async ({
            email,
            password,
            role,
        }: {
            email: string;
            password: string;
            role?: UserRole;
        }) => {
            await login(email, password, role);
        },
    });
}

/**
 * Hook for user logout
 */
export function useLogout() {
    const { logout } = useAuth();

    return useMutation({
        mutationFn: async () => {
            await logout();
        },
    });
}
