import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, FileText, Users, Wrench } from "lucide-react";

const activities = [
  {
    id: 1,
    type: "conge",
    title: "Demande de congé approuvée",
    user: "Ahmed Bennani",
    code: "RH-CG-2024-0145",
    time: "Il y a 2 heures",
    icon: Users,
  },
  {
    id: 2,
    type: "intervention",
    title: "Intervention planifiée",
    user: "Youssef Alami",
    code: "ING-INT-2024-0089",
    time: "Il y a 3 heures",
    icon: Wrench,
  },
  {
    id: 3,
    type: "projet",
    title: "Nouveau projet créé",
    user: "Sara Fassi",
    code: "PRJ-DEV-2024-0034",
    time: "Il y a 5 heures",
    icon: FileText,
  },
  {
    id: 4,
    type: "formation",
    title: "Session de formation terminée",
    user: "Mohammed Ouazzani",
    code: "FOR-SES-2024-0012",
    time: "Hier",
    icon: Clock,
  },
];

const badgeVariants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  conge: "secondary",
  intervention: "default",
  projet: "outline",
  formation: "secondary",
};

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Activité Récente</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-4 rounded-lg border border-border p-3 transition-colors hover:bg-accent/50">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <activity.icon className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{activity.title}</p>
                <Badge variant={badgeVariants[activity.type]} className="text-xs">
                  {activity.code}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {activity.user} • {activity.time}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
