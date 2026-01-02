
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MoreHorizontal } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DataItem {
    label?: string;
    value: React.ReactNode;
    icon?: React.ReactNode;
    className?: string;
}

interface MobileDataCardProps {
    title: string;
    subtitle?: string;
    status?: {
        label: string;
        variant?: "default" | "secondary" | "destructive" | "outline";
        className?: string;
    };
    data: DataItem[];
    actions?: React.ReactNode; // Dropdown menu items or buttons
    className?: string;
    onClick?: () => void;
}

export function MobileDataCard({
    title,
    subtitle,
    status,
    data,
    actions,
    className,
    onClick
}: MobileDataCardProps) {
    return (
        <Card className={cn("shadow-sm", className)} onClick={onClick}>
            <CardHeader className="pb-2 pt-4">
                <div className="flex justify-between items-start">
                    <div className="flex-1 mr-2">
                        <CardTitle className="text-base font-semibold line-clamp-1">{title}</CardTitle>
                        {subtitle && <CardDescription className="text-xs font-mono mt-1 line-clamp-1">{subtitle}</CardDescription>}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        {status && (
                            <Badge variant={status.variant || "outline"} className={status.className}>
                                {status.label}
                            </Badge>
                        )}
                        {actions && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    {actions}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm pb-4">
                {data.map((item, idx) => (
                    <div key={idx} className={cn("flex items-center gap-2 text-muted-foreground", item.className)}>
                        {item.icon && <span className="shrink-0">{item.icon}</span>}
                        {item.label && <span className="font-medium text-foreground">{item.label}: </span>}
                        <span className={cn("truncate", !item.label && "font-medium text-foreground")}>{item.value}</span>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
