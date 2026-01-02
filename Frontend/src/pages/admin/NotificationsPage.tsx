
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Bell, Send, User, CheckCircle, Clock, Trash2, Mail, AlertCircle, X } from "lucide-react";
import { toast } from "sonner";
import type { Notification } from "@/types/notification";
import type { User } from "@/types/user";
import { mockUsers, getFullName } from "@/types/user";

// Shared Components
import { StatCard } from "@/components/shared/StatCard";
import { FilterBar } from "@/components/shared/FilterBar";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { MobileDataCard } from "@/components/shared/MobileDataCard";

const mockNotifications: Notification[] = [
    {
        id: "1",
        subject: "Maintenance Serveur",
        message: "Le serveur sera en maintenance ce soir à 22h.",
        audience: "all",
        sentAt: "2025-01-02T10:00:00Z",
        sender: "admin@company.com",
        status: "sent",
        type: "warning",
        priority: "high",
    },
    {
        id: "2",
        subject: "Rappel Feuilles de temps",
        message: "Merci de soumettre vos feuilles de temps avant vendredi.",
        audience: "employee",
        sentAt: "2025-01-01T09:00:00Z",
        sender: "rh@company.com",
        status: "sent",
        type: "info",
        priority: "normal",
    },
    {
        id: "3",
        subject: "Congé approuvé",
        message: "Votre demande de congé du 15-20 janvier a été approuvée.",
        audience: "specific",
        recipientNames: ["Ahmed Bennani"],
        sentAt: "2025-01-02T11:30:00Z",
        sender: "rh@company.com",
        status: "sent",
        type: "success",
        priority: "normal",
        read: true,
        readAt: "2025-01-02T12:00:00Z",
    },
];

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

    // Form States
    const [audience, setAudience] = useState<"all" | "admin" | "employee" | "specific">("all");
    const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
    const [notificationType, setNotificationType] = useState<"info" | "warning" | "success" | "error">("info");
    const [priority, setPriority] = useState<"low" | "normal" | "high">("normal");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");

    // Filter States
    const [filterText, setFilterText] = useState("");
    const [filterAudience, setFilterAudience] = useState("tous");

    const handleAddRecipient = (fullName: string) => {
        if (!selectedRecipients.includes(fullName)) {
            setSelectedRecipients([...selectedRecipients, fullName]);
        }
    };

    const handleRemoveRecipient = (fullName: string) => {
        setSelectedRecipients(selectedRecipients.filter(r => r !== fullName));
    };

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();

        if (!subject.trim() || !message.trim()) {
            toast.error("Veuillez remplir le sujet et le message");
            return;
        }

        if (audience === "specific" && selectedRecipients.length === 0) {
            toast.error("Veuillez sélectionner au moins un destinataire");
            return;
        }

        const newNotif: Notification = {
            id: Math.random().toString(36).substr(2, 9),
            subject,
            message,
            audience,
            ...(audience === "specific" && {
                recipientNames: selectedRecipients,
                read: false,
            }),
            sentAt: new Date().toISOString(),
            sender: "admin@company.com",
            status: "sent",
            type: notificationType,
            priority,
        };

        setNotifications([newNotif, ...notifications]);
        toast.success("Notification envoyée avec succès");

        // Reset form
        setSubject("");
        setMessage("");
        setSelectedRecipients([]);
        setAudience("all");
        setNotificationType("info");
        setPriority("normal");
    };

    const handleDelete = (id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        toast.success("Notification supprimée");
    };

    const handleMarkAsRead = (id: string) => {
        setNotifications((prev) =>
            prev.map((n) =>
                n.id === id
                    ? { ...n, read: true, readAt: new Date().toISOString() }
                    : n
            )
        );
        toast.success("Notification marquée comme lue");
    };

    // Helpers
    const getAudienceLabel = (aud: string, names?: string[]) => {
        switch (aud) {
            case "all": return "Tous";
            case "admin": return "Admins";
            case "employee": return "Employés";
            case "specific": return names && names.length > 0 ? names.join(", ") : "Spécifique";
            default: return aud;
        }
    };

    const getTypeColor = (type?: string) => {
        switch (type) {
            case "success": return "bg-green-100 text-green-800 hover:bg-green-100";
            case "warning": return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
            case "error": return "bg-red-100 text-red-800 hover:bg-red-100";
            default: return "bg-blue-100 text-blue-800 hover:bg-blue-100";
        }
    };

    const getPriorityColor = (priority?: string) => {
        switch (priority) {
            case "high": return "bg-red-100 text-red-800 hover:bg-red-100";
            case "low": return "bg-gray-100 text-gray-800 hover:bg-gray-100";
            default: return "bg-blue-100 text-blue-800 hover:bg-blue-100";
        }
    };

    // Filter Logic
    const filteredNotifications = notifications.filter((n) => {
        const matchText =
            n.subject.toLowerCase().includes(filterText.toLowerCase()) ||
            n.message.toLowerCase().includes(filterText.toLowerCase()) ||
            (n.recipientNames || []).some(name => name.toLowerCase().includes(filterText.toLowerCase()));

        const matchAudience = filterAudience === "tous" || filterAudience === "all" ? true : n.audience === filterAudience;

        return matchText && matchAudience;
    });

    // DataTable Configuration
    const columns: Column<Notification>[] = [
        {
            header: "Message",
            accessorKey: "subject",
            cell: (n) => (
                <div>
                    <div className="font-medium">{n.subject}</div>
                    <div className="text-xs text-muted-foreground line-clamp-1" title={n.message}>{n.message}</div>
                </div>
            )
        },
        {
            header: "Cible",
            accessorKey: "audience",
            className: "w-[200px]",
            cell: (n) => (
                <Badge variant="outline" className="capitalize whitespace-nowrap">
                    {getAudienceLabel(n.audience, n.recipientNames)}
                </Badge>
            )
        },
        {
            header: "Type",
            accessorKey: "type",
            className: "w-[100px]",
            cell: (n) => (
                <Badge className={getTypeColor(n.type)} variant="secondary">
                    {n.type || "info"}
                </Badge>
            )
        },
        {
            header: "Priorité",
            accessorKey: "priority",
            className: "w-[100px]",
            cell: (n) => (
                <Badge className={getPriorityColor(n.priority)} variant="secondary">
                    {n.priority || "normal"}
                </Badge>
            )
        },
        {
            header: "Date",
            accessorKey: "sentAt",
            className: "w-[140px] text-xs text-muted-foreground",
            cell: (n) => new Date(n.sentAt).toLocaleDateString("fr-FR", { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
        },
        {
            header: "",
            cell: (n) => (
                <div className="flex gap-1 justify-end">
                    {n.audience === "specific" && !n.read && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleMarkAsRead(n.id)}
                            className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                            title="Marquer comme lue"
                        >
                            <CheckCircle className="h-4 w-4" />
                        </Button>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(n.id)}
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            )
        }
    ];

    const filterConfig = [
        {
            key: "audience",
            label: "Cible",
            value: filterAudience,
            onChange: setFilterAudience,
            options: [
                { label: "Tous", value: "all" },
                { label: "Employés", value: "employee" },
                { label: "Admins", value: "admin" },
                { label: "Spécifique", value: "specific" },
            ]
        }
    ];

    return (
        <div className="space-y-6 p-2 sm:p-4 md:p-6 pb-20 sm:pb-10">
            <div className="flex flex-col gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Notifications</h1>
                    <p className="text-sm text-muted-foreground">Centre de communication centralisé</p>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
                <StatCard
                    title="Envoyées (Mois)"
                    value={notifications.length}
                    description="Total notifications"
                    icon={Send}
                />
                <StatCard
                    title="Priorité Haute"
                    value={notifications.filter(n => n.priority === 'high').length}
                    description="Notifications urgentes"
                    icon={AlertCircle}
                />
                <StatCard
                    title="Ciblées"
                    value={notifications.filter(n => n.audience === 'specific').length}
                    description="Messages directs"
                    icon={User}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Formulaire d'envoi */}
                <Card className="lg:col-span-1 h-fit">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Send className="h-5 w-5 text-blue-600" />
                            Nouvelle Notification
                        </CardTitle>
                        <CardDescription>Envoyer un message</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSend} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Cible</Label>
                                <Select
                                    value={audience}
                                    onValueChange={(val: any) => setAudience(val)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tous les utilisateurs</SelectItem>
                                        <SelectItem value="employee">Employés uniquement</SelectItem>
                                        <SelectItem value="admin">Administrateurs uniquement</SelectItem>
                                        <SelectItem value="specific">Utilisateurs spécifiques</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {audience === "specific" && (
                                <div className="space-y-2">
                                    <Label>Sélectionner les destinataires</Label>
                                    <div className="border rounded-md p-3 space-y-2 max-h-[300px] overflow-y-auto">
                                        {mockUsers.map((user) => (
                                            <div key={user.id} className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    id={user.id}
                                                    checked={selectedRecipients.includes(getFullName(user))}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            handleAddRecipient(getFullName(user));
                                                        } else {
                                                            handleRemoveRecipient(getFullName(user));
                                                        }
                                                    }}
                                                    className="rounded"
                                                />
                                                <label htmlFor={user.id} className="text-sm cursor-pointer flex-1">
                                                    {getFullName(user)}
                                                    <span className="text-xs text-muted-foreground ml-1">({user.role})</span>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    {selectedRecipients.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {selectedRecipients.map((name) => (
                                                <Badge key={name} variant="secondary" className="cursor-pointer" onClick={() => handleRemoveRecipient(name)}>
                                                    {name}
                                                    <X className="h-3 w-3 ml-1" />
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label>Type</Label>
                                <Select value={notificationType} onValueChange={(val: any) => setNotificationType(val)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="info">Information</SelectItem>
                                        <SelectItem value="warning">Avertissement</SelectItem>
                                        <SelectItem value="success">Succès</SelectItem>
                                        <SelectItem value="error">Erreur</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Priorité</Label>
                                <Select value={priority} onValueChange={(val: any) => setPriority(val)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="low">Basse</SelectItem>
                                        <SelectItem value="normal">Normale</SelectItem>
                                        <SelectItem value="high">Haute</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Sujet</Label>
                                <Input
                                    placeholder="Titre du message"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Message</Label>
                                <Textarea
                                    placeholder="Contenu de la notification..."
                                    className="min-h-[120px]"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    required
                                />
                            </div>

                            <Button type="submit" className="w-full">
                                <Send className="h-4 w-4 mr-2" /> Envoyer
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Historique */}
                <div className="lg:col-span-2 space-y-4">
                    <Card className="h-full flex flex-col">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2">
                                <Bell className="h-5 w-5 text-primary" />
                                Historique des envois
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 space-y-4">
                            {/* Filter Bar */}
                            <FilterBar
                                searchValue={filterText}
                                onSearchChange={setFilterText}
                                searchPlaceholder="Rechercher..."
                                filters={filterConfig}
                                onReset={() => { setFilterText(""); setFilterAudience("tous"); }}
                            />

                            <div className="hidden md:block">
                                <DataTable
                                    columns={columns}
                                    data={filteredNotifications}
                                    defaultPageSize={5}
                                />
                            </div>

                            {/* Mobile History View */}
                            <div className="grid grid-cols-1 gap-4 md:hidden">
                                {filteredNotifications.length === 0 && <div className="text-center py-6 text-muted-foreground">Aucune notification</div>}
                                {filteredNotifications.map((n) => (
                                    <MobileDataCard
                                        key={n.id}
                                        title={n.subject}
                                        subtitle={getAudienceLabel(n.audience)}
                                        status={{ label: n.type || "INFO", variant: getTypeColor(n.type) as any }}
                                        data={[
                                            { icon: <Clock className="h-3.5 w-3.5" />, value: new Date(n.sentAt).toLocaleDateString() },
                                            { label: "Message", value: n.message, className: "col-span-2 line-clamp-2" }
                                        ]}
                                        actions={
                                            <Button variant="ghost" size="sm" onClick={() => handleDelete(n.id)} className="text-red-500 h-8 w-8 p-0">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        }
                                    />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
