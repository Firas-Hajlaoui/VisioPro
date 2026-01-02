import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Search, Filter, Eye, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const mockDocuments = [
  { id: 1, code: "PRJ-DEV-2024-0034", nom: "Devis automatisation COSUMAR", type: "Devis", departement: "Projets", date: "2024-10-15", taille: "2.4 MB" },
  { id: 2, code: "ING-INT-2024-0087", nom: "Rapport intervention COSUMAR", type: "Rapport", departement: "Ingénierie", date: "2024-12-18", taille: "1.8 MB" },
  { id: 3, code: "FOR-SES-2024-0012", nom: "Support formation sécurité", type: "Formation", departement: "Formation", date: "2024-12-15", taille: "5.2 MB" },
  { id: 4, code: "PRJ-DT-2024-0045", nom: "Schéma électrique ligne A", type: "Technique", departement: "Projets", date: "2024-11-20", taille: "12.1 MB" },
  { id: 5, code: "PRJ-BKP-2024-0018", nom: "Backup automate S7-1500", type: "Backup", departement: "Projets", date: "2024-12-01", taille: "45.3 MB" },
  { id: 6, code: "RH-CG-2024-0145", nom: "Formulaire congé Idrissi", type: "RH", departement: "RH", date: "2024-12-20", taille: "0.2 MB" },
];

export default function DocumentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Centre de Documents</h1>
          <p className="text-sm text-muted-foreground">Gestion documentaire conforme ISO 9001</p>
        </div>
        <Button variant="outline" size="sm" className="sm:size-default w-fit">
          <Download className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Exporter tout</span>
          <span className="sm:hidden">Exporter</span>
        </Button>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,245</div>
            <p className="text-xs text-muted-foreground">Tous départements</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ce mois</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">Nouveaux documents</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Stockage utilisé</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.4 GB</div>
            <p className="text-xs text-muted-foreground">Sur 50 GB disponibles</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Conformité ISO</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">100%</div>
            <p className="text-xs text-muted-foreground">Documents codifiés</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Tous les Documents
          </CardTitle>
          <CardDescription>Recherche et gestion centralisée des documents</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Rechercher..." className="pl-10" />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Select>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Département" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="rh">RH</SelectItem>
                  <SelectItem value="formation">Formation</SelectItem>
                  <SelectItem value="ingenierie">Ingénierie</SelectItem>
                  <SelectItem value="projets">Projets</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-full sm:w-[130px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="devis">Devis</SelectItem>
                  <SelectItem value="rapport">Rapport</SelectItem>
                  <SelectItem value="technique">Technique</SelectItem>
                  <SelectItem value="backup">Backup</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table className="min-w-[700px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">Code</TableHead>
                  <TableHead>Nom du document</TableHead>
                  <TableHead className="hidden sm:table-cell">Type</TableHead>
                  <TableHead className="hidden md:table-cell">Département</TableHead>
                  <TableHead className="hidden lg:table-cell">Date</TableHead>
                  <TableHead className="hidden lg:table-cell">Taille</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockDocuments.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-mono text-xs whitespace-nowrap">{doc.code}</TableCell>
                    <TableCell className="font-medium max-w-[200px] truncate">{doc.nom}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant="outline">{doc.type}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{doc.departement}</TableCell>
                    <TableCell className="hidden lg:table-cell">{doc.date}</TableCell>
                    <TableCell className="hidden lg:table-cell text-muted-foreground">{doc.taille}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
