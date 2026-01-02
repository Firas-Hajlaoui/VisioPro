
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string | number;
    description?: string;
    icon?: LucideIcon;
    trend?: {
        value: string; // e.g., "+12%"
        positive?: boolean; // true = green, false = red, undefined = gray
    };
    className?: string;
    iconClassName?: string;
}

export function StatCard({
    title,
    value,
    description,
    icon: Icon,
    trend,
    className,
    iconClassName
}: StatCardProps) {
    return (
        <Card className={cn("overflow-hidden", className)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
                {Icon && <Icon className={cn("h-4 w-4 text-muted-foreground", iconClassName)} />}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {(description || trend) && (
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                        {trend && (
                            <span
                                className={cn(
                                    "mr-2 font-medium",
                                    trend.positive === true ? "text-green-600" :
                                        trend.positive === false ? "text-red-600" :
                                            "text-muted-foreground"
                                )}
                            >
                                {trend.value}
                            </span>
                        )}
                        {description}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
