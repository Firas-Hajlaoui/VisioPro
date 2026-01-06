import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, User, Lock, ArrowRight } from "lucide-react"; // Changed Mail to User
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();
  
  // Changed state from email to username
  const [username, setUsername] = useState(""); 
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState<"admin" | "employee">("admin");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check username instead of email
    if (!username || !password) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Pass username to login function
    const result = await login(username, password, userType);

    if (result.success) {
      toast({
        title: "Succès",
        description: `Connexion réussie en tant que ${userType === "admin" ? "Admin" : "Employé"}`,
      });
      
      if (userType === "admin") {
        navigate("/admin");
      } else {
        navigate("/employee");
      }
    } else {
      toast({
        title: "Échec de la connexion",
        description: result.error instanceof Error ? result.error.message : "Identifiant ou mot de passe invalide",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10 animate-blob"></div>
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10 animate-blob animation-delay-2000"></div>

      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
              <Building2 className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">VisioPro</h1>
          <p className="text-sm text-gray-500 mt-2">ISO 9001 - Système de Gestion d'Entreprise</p>
        </div>

        {/* Login Card */}
        <Card className="border-0 shadow-xl">
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="text-2xl">Connexion</CardTitle>
            <CardDescription>Connectez-vous à votre compte VisioPro</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              {/* User Type Selector */}
              <div className="flex gap-3 mb-6 p-3 bg-gray-50 rounded-lg">
                <button
                  type="button"
                  onClick={() => setUserType("admin")}
                  className={`flex-1 py-2 px-3 rounded-md font-medium text-sm transition-colors ${
                    userType === "admin"
                      ? "bg-blue-500 text-white shadow-md"
                      : "text-gray-600 hover:text-gray-900 bg-white"
                  }`}
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => setUserType("employee")}
                  className={`flex-1 py-2 px-3 rounded-md font-medium text-sm transition-colors ${
                    userType === "employee"
                      ? "bg-blue-500 text-white shadow-md"
                      : "text-gray-600 hover:text-gray-900 bg-white"
                  }`}
                >
                  Employé
                </button>
              </div>

              {/* Username Input (Changed from Email) */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-700 font-medium">
                  Nom d'utilisateur
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="ex: jdupont"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 h-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    disabled={isLoading}
                    autoComplete="username"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">
                  Mot de Passe
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    disabled={isLoading}
                    autoComplete="current-password"
                    required
                  />
                </div>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-md hover:shadow-lg transition-all"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connexion...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Se connecter
                    <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-xs font-semibold text-gray-700 mb-2">Identifiants de démonstration:</p>
              <p className="text-xs text-gray-600 mb-1"><span className="font-medium">Identifiant:</span> demo</p>
              <p className="text-xs text-gray-600"><span className="font-medium">Mot de passe:</span> demo123</p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>VisioPro © 2026 - Tous droits réservés</p>
          <p className="mt-2">Système conforme ISO 9001</p>
        </div>
      </div>
    </div>
  );
}