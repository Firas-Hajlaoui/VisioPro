import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Calendar, FileCheck, User,Wrench, FolderKanban } from "lucide-react";
import { Link } from "react-router-dom";

const EmployeeDashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Bienvenue</h2>
          <p className="text-muted-foreground">
            Utilisez ce portail pour saisir vos temps de travail, demandes de congés et autorisations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Temps de Travail</CardTitle>
              <CardDescription>
                Saisissez vos heures de travail quotidiennes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/employee/rh/temps">Saisir mes heures</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-2">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Demande de Congés</CardTitle>
              <CardDescription>
                Soumettez vos demandes de congés et absences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full" variant="outline">
                <Link to="/employee/rh/conges">Demander un congé</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center mb-2">
                <FileCheck className="h-6 w-6 text-orange-600" />
              </div>
              <CardTitle>Demande d'Autorisation</CardTitle>
              <CardDescription>
                Demandez des autorisations de sortie ou autres
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full" variant="outline">
                <Link to="/employee/rh/autorisations">Faire une demande</Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-600/10 rounded-lg flex items-center justify-center mb-2">
                    <Wrench className="h-5 w-5 text-blue-600" />
              </div>
              <CardTitle>Fiche d'Intervention</CardTitle>
              <CardDescription>
                Accédez à vos fiches d'intervention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full" variant="outline">
                <Link to="/employee/fiche-intervention">Accéder aux fiches</Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-indigo-600/10 rounded-lg flex items-center justify-center mb-2">
                    <FolderKanban className="h-5 w-5 text-indigo-600" />
              </div>
              <CardTitle>Projets</CardTitle>
              <CardDescription>
                Accédez à vos projets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full" variant="outline">
                <Link to="/employee/projets">Accéder aux fiches</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default EmployeeDashboard;
