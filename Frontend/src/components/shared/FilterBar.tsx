
import { Input } from "@/components/ui/input";
import { Search, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface FilterOption {
    label: string;
    value: string;
}

interface FilterGroup {
    key: string;  // State key
    label: string;
    options: FilterOption[];
    value: string;
    onChange: (val: string) => void;
}

interface FilterBarProps {
    searchValue?: string;
    onSearchChange?: (val: string) => void;
    searchPlaceholder?: string;
    filters?: FilterGroup[];
    onReset?: () => void;
    children?: React.ReactNode; // For extra buttons (Export, Add New)
    className?: string;
}

export function FilterBar({
    searchValue,
    onSearchChange,
    searchPlaceholder = "Rechercher...",
    filters = [],
    onReset,
    children,
    className
}: FilterBarProps) {
    const hasActiveFilters =
        (searchValue && searchValue.length > 0) ||
        filters.some(f => f.value && f.value !== 'tous' && f.value !== 'all');

    return (
        <div className={`flex flex-col sm:flex-row gap-4 mb-6 ${className}`}>
            {/* Search Input */}
            {onSearchChange && (
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder={searchPlaceholder}
                        className="pl-8 bg-background"
                        value={searchValue}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>
            )}

            {/* Filter Selects */}
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                {filters.map((filter) => (
                    <div key={filter.key} className="w-full sm:w-[160px]">
                        <Select value={filter.value} onValueChange={filter.onChange}>
                            <SelectTrigger className="bg-background">
                                <div className="flex items-center gap-2 truncate">
                                    <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
                                    <span className="truncate">{filter.value === 'tous' || filter.value === 'all' ? filter.label : filter.options.find(o => o.value === filter.value)?.label || filter.value}</span>
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="tous">Tous</SelectItem>
                                {filter.options.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                ))}
            </div>

            {/* Reset & Actions */}
            <div className="flex gap-2 items-center">
                {hasActiveFilters && onReset && (
                    <Button variant="ghost" size="icon" onClick={onReset} title="Réinitialiser les filtres">
                        <X className="h-4 w-4" />
                    </Button>
                )}
                {children}
            </div>
        </div>
    );
}
