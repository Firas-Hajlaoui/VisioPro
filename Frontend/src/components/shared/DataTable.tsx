
import * as React from "react";
import { cn } from "@/lib/utils";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    ChevronLeft,
    ChevronRight,
    Settings,
    MoreHorizontal,
    ArrowUpDown,
    Search,
    Filter,
    Plus
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface Column<T> {
    header: React.ReactNode;
    accessorKey?: keyof T;
    cell?: (item: T) => React.ReactNode;
    className?: string;
    sortable?: boolean;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    title?: string;
    description?: string;
    searchPlaceholder?: string;
    searchKey?: keyof T; // Key to search on
    onSearch?: (value: string) => void; // Optional custom search handler
    pageSizeOptions?: number[];
    defaultPageSize?: number;
    actions?: React.ReactNode; // Top right actions (e.g. Add button)
    filters?: React.ReactNode; // Filter components
}

export function DataTable<T extends { id: string | number }>({
    data,
    columns,
    title,
    description,
    searchPlaceholder = "Rechercher...",
    searchKey,
    onSearch,
    pageSizeOptions = [5, 10, 20, 50],
    defaultPageSize = 10,
    actions,
    filters,
}: DataTableProps<T>) {
    // State
    const [currentPage, setCurrentPage] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(defaultPageSize);
    const [searchTerm, setSearchTerm] = React.useState("");
    const [sortConfig, setSortConfig] = React.useState<{
        key: keyof T | null;
        direction: "asc" | "desc";
    }>({ key: null, direction: "asc" });

    // Filtering
    const filteredData = React.useMemo(() => {
        let res = data;
        if (searchTerm && searchKey) {
            res = res.filter((item) =>
                String(item[searchKey])
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
            );
        }
        return res;
    }, [data, searchTerm, searchKey]);

    // Sorting
    const sortedData = React.useMemo(() => {
        if (!sortConfig.key) return filteredData;
        return [...filteredData].sort((a, b) => {
            const aValue = a[sortConfig.key!];
            const bValue = b[sortConfig.key!];

            if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
            return 0;
        });
    }, [filteredData, sortConfig]);

    // Pagination
    const totalPages = Math.ceil(sortedData.length / pageSize);
    const paginatedData = React.useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return sortedData.slice(start, start + pageSize);
    }, [sortedData, currentPage, pageSize]);

    // Handlers
    const handleSort = (key: keyof T) => {
        setSortConfig((current) => ({
            key,
            direction:
                current.key === key && current.direction === "asc" ? "desc" : "asc",
        }));
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
        if (onSearch) onSearch(e.target.value);
    };

    return (
        <div className="space-y-4">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-background p-1">
                <div className="space-y-1">
                    {title && <h3 className="font-semibold text-lg tracking-tight">{title}</h3>}
                    {description && <p className="text-sm text-muted-foreground">{description}</p>}
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    {searchKey && (
                        <div className="relative flex-1 sm:w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder={searchPlaceholder}
                                value={searchTerm}
                                onChange={handleSearch}
                                className="pl-8 bg-background"
                            />
                        </div>
                    )}
                    {filters}
                    {actions}
                </div>
            </div>

            {/* Table Section */}
            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            {columns.map((col, idx) => (
                                <TableHead
                                    key={idx}
                                    className={cn(col.className, col.sortable && "cursor-pointer select-none")}
                                    onClick={() => col.sortable && col.accessorKey && handleSort(col.accessorKey)}
                                >
                                    <div className="flex items-center gap-2">
                                        {col.header}
                                        {col.sortable && sortConfig.key === col.accessorKey && (
                                            <ArrowUpDown className={cn("h-3 w-3", sortConfig.direction === "asc" ? "opacity-100" : "opacity-50")} />
                                        )}
                                    </div>
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedData.length > 0 ? (
                            paginatedData.map((row) => (
                                <TableRow key={row.id}>
                                    {columns.map((col, idx) => (
                                        <TableCell key={idx} className={col.className}>
                                            {col.cell
                                                ? col.cell(row)
                                                : col.accessorKey
                                                    ? (row[col.accessorKey] as React.ReactNode)
                                                    : null
                                            }
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Aucune donnée trouvée.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Section */}
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Lignes par page</span>
                    <Select
                        value={pageSize.toString()}
                        onValueChange={(val: any) => {
                            setPageSize(Number(val));
                            setCurrentPage(1);
                        }}
                    >
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={pageSize} />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {pageSizeOptions.map((size) => (
                                <SelectItem key={size} value={size.toString()}>
                                    {size}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <span>
                        {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, sortedData.length)} sur {sortedData.length}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages || totalPages === 0}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
