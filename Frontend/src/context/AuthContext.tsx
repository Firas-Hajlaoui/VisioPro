import React, { createContext, useContext, useState, useEffect } from "react";
import { useLogin as useLoginApi } from "@/hooks/useApi";
import { AuthUser, AuthContextType, UserRole, LoginResult } from "@/types/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const loginMutation = useLoginApi();

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("access_token");
    
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("user");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: UserRole): Promise<LoginResult> => {
    try {
      setIsLoading(true);
      const result = await loginMutation.mutateAsync({ email, password, role });
      
      const newUser: AuthUser = {
        id: result.user.id.toString(),
        email: result.user.email,
        role: result.user.role || role,
        firstName: result.user.first_name,
        lastName: result.user.last_name,
      };
      
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
      localStorage.setItem("access_token", result.access);
      localStorage.setItem("refresh_token", result.refresh);
      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
