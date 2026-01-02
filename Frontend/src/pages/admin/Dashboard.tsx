import { StatCard } from "@/components/dashboard/StatCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { DepartmentOverview } from "@/components/dashboard/DepartmentOverview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Clock, FolderKanban, FileCheck, Calendar, TrendingUp, UserCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Link } from "react-router-dom";

const chartData = [
  { month: "Jan", projets: 4, interventions: 12 },
  { month: "Fév", projets: 3, interventions: 15 },
  { month: "Mar", projets: 5, interventions: 18 },
  { month: "Avr", projets: 7, interventions: 14 },
  { month: "Mai", projets: 6, interventions: 20 },
  { month: "Juin", projets: 8, interventions: 22 },
];

export default function Dashboard() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">Tableau de Bord</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Bienvenue sur VisioPro - Système de gestion conforme ISO 9001
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to="/employee">
            <UserCircle className="h-4 w-4 mr-2" />
            Accès Employé
          </Link>
        </Button>
      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Employés Actifs"
          value="45"
          description="3 départements"
          icon={Users}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Heures ce mois"
          value="3,240"
          description="Heures de travail enregistrées"
          icon={Clock}
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Projets en cours"
          value="12"
          description="6 projets terminés ce mois"
          icon={FolderKanban}
          trend={{ value: 5, isPositive: true }}
        />
        <StatCard
          title="Documents validés"
          value="156"
          description="Documents conformes ISO"
          icon={FileCheck}
          trend={{ value: 23, isPositive: true }}
        />
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
        <Card className="overflow-hidden">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              Activité Mensuelle
            </CardTitle>
          </CardHeader>
          <CardContent className="px-2 sm:px-6">
            <div className="w-full h-64 sm:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 'var(--radius)',
                    }} 
                  />
                  <Bar dataKey="projets" name="Projets" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="interventions" name="Interventions" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              Congés en Attente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            {[
              { name: "Karim Idrissi", dates: "15-20 Jan 2025", type: "Congé annuel", code: "RH-CG-2025-0001" },
              { name: "Fatima Zohra", dates: "22-24 Jan 2025", type: "Congé maladie", code: "RH-CG-2025-0002" },
              { name: "Omar Benjelloun", dates: "1-5 Fév 2025", type: "Congé annuel", code: "RH-CG-2025-0003" },
            ].map((leave, index) => (
              <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between rounded-lg border border-border p-2 sm:p-3 gap-2">
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{leave.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{leave.dates} • {leave.type}</p>
                </div>
                <code className="rounded bg-muted px-2 py-1 text-xs font-mono flex-shrink-0">{leave.code}</code>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
        <RecentActivity />
        <DepartmentOverview />
      </div>
    </div>
  );
}
