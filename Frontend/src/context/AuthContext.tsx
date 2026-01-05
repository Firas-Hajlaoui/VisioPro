import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthUser, AuthContextType, UserRole } from "@/types/auth";
import api, { setTokens, clearTokens } from "@/lib/api";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage and validate token on mount
  useEffect(() => {
    const loadUser = async () => {
      const storedUser = localStorage.getItem("user");
      const accessToken = localStorage.getItem("access_token");

      if (storedUser && accessToken) {
        try {
          // Validate token by fetching current user
          const response = await api.get("/auth/me/");
          setUser(response.data);

          // Update stored user with fresh data
          localStorage.setItem("user", JSON.stringify(response.data));
        } catch (error) {
          // Token is invalid, clear everything
          console.error("Failed to validate token:", error);
          clearTokens();
        }
      }
      setIsLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string, role?: UserRole) => {
    try {
      const response = await api.post("/auth/login/", {
        email,
        password,
        ...(role && { role }),
      });

      const { user: userData, tokens } = response.data;

      // Store tokens and user data
      setTokens(tokens.access, tokens.refresh);
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (error: any) {
      console.error("Login failed:", error);
      throw new Error(
        error.response?.data?.message || "Invalid credentials"
      );
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");

      if (refreshToken) {
        // Call logout endpoint to blacklist token
        await api.post("/auth/logout/", { refresh: refreshToken });
      }
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      // Clear local state regardless of API call result
      setUser(null);
      clearTokens();
    }
  };

  // Don't render children until we've checked for existing session
  if (isLoading) {
    return null; // Or a loading spinner
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
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
