import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { GraduationCap, Wrench, FolderKanban } from "lucide-react";

const departments = [
  {
    name: "Formation",
    icon: GraduationCap,
    sessions: 12,
    completed: 8,
    color: "bg-chart-1",
  },
  {
    name: "Ingénierie",
    icon: Wrench,
    sessions: 25,
    completed: 18,
    color: "bg-chart-2",
  },
  {
    name: "Projets",
    icon: FolderKanban,
    sessions: 15,
    completed: 6,
    color: "bg-chart-3",
  },
];

export function DepartmentOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Aperçu des Départements</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {departments.map((dept) => {
          const percentage = Math.round((dept.completed / dept.sessions) * 100);
          return (
            <div key={dept.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${dept.color}`}>
                    <dept.icon className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <span className="text-sm font-medium">{dept.name}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {dept.completed}/{dept.sessions}
                </span>
              </div>
              <Progress value={percentage} className="h-2" />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
