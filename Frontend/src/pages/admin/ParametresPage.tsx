import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Building2, Users, Shield, Bell, Database } from "lucide-react";
import { toast } from "sonner";

export default function ParametresPage() {
  const handleSave = () => {
    toast.success("Paramètres enregistrés avec succès");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Paramètres</h1>
        <p className="text-sm text-muted-foreground">Configuration du système VisioPro ISO 9001</p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-flex">
          <TabsTrigger value="general" className="gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Général</span>
          </TabsTrigger>
          <TabsTrigger value="entreprise" className="gap-2">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">Entreprise</span>
          </TabsTrigger>
          <TabsTrigger value="utilisateurs" className="gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Utilisateurs</span>
          </TabsTrigger>
          <TabsTrigger value="securite" className="gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Sécurité</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres Généraux</CardTitle>
              <CardDescription>Configuration de base de l'application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="appName">Nom de l'application</Label>
                    <Input id="appName" defaultValue="VisioPro ISO" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="version">Version</Label>
                    <Input id="version" defaultValue="1.0.0" disabled />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Fuseau horaire</Label>
                  <Input id="timezone" defaultValue="Africa/Casablanca (GMT+1)" />
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Codification ISO</h4>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="prefixRH">Préfixe RH</Label>
                    <Input id="prefixRH" defaultValue="RH" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="prefixFOR">Préfixe Formation</Label>
                    <Input id="prefixFOR" defaultValue="FOR" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="prefixING">Préfixe Ingénierie</Label>
                    <Input id="prefixING" defaultValue="ING" />
                  </div>
                </div>
              </div>
              <Button onClick={handleSave}>Enregistrer</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="entreprise">
          <Card>
            <CardHeader>
              <CardTitle>Informations Entreprise</CardTitle>
              <CardDescription>Données de l'entreprise pour les documents officiels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="raisonSociale">Raison sociale</Label>
                  <Input id="raisonSociale" placeholder="Nom de l'entreprise" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ice">ICE</Label>
                  <Input id="ice" placeholder="Identifiant Commun de l'Entreprise" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="adresse">Adresse</Label>
                <Input id="adresse" placeholder="Adresse complète" />
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="ville">Ville</Label>
                  <Input id="ville" placeholder="Casablanca" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telephone">Téléphone</Label>
                  <Input id="telephone" placeholder="+212 5XX XX XX XX" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="contact@entreprise.ma" />
                </div>
              </div>
              <Button onClick={handleSave}>Enregistrer</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="utilisateurs">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des Utilisateurs</CardTitle>
              <CardDescription>Paramètres des comptes utilisateurs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Inscription ouverte</Label>
                  <p className="text-sm text-muted-foreground">Permettre aux nouveaux utilisateurs de s'inscrire</p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Validation par admin</Label>
                  <p className="text-sm text-muted-foreground">Les nouveaux comptes doivent être validés</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Double authentification</Label>
                  <p className="text-sm text-muted-foreground">Activer la 2FA pour tous les utilisateurs</p>
                </div>
                <Switch />
              </div>
              <Button onClick={handleSave}>Enregistrer</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="securite">
          <Card>
            <CardHeader>
              <CardTitle>Sécurité</CardTitle>
              <CardDescription>Configuration de la sécurité du système</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="sessionDuration">Durée de session (minutes)</Label>
                <Input id="sessionDuration" type="number" defaultValue="60" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxAttempts">Tentatives de connexion max</Label>
                <Input id="maxAttempts" type="number" defaultValue="5" />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Journalisation des actions</Label>
                  <p className="text-sm text-muted-foreground">Enregistrer toutes les actions utilisateurs</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Button onClick={handleSave}>Enregistrer</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Gérer les notifications par email et système</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notifications email</Label>
                  <p className="text-sm text-muted-foreground">Recevoir les alertes par email</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Rappels de congés</Label>
                  <p className="text-sm text-muted-foreground">Notifier les managers des demandes en attente</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Alertes interventions</Label>
                  <p className="text-sm text-muted-foreground">Notifier les techniciens des nouvelles interventions</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Résumé hebdomadaire</Label>
                  <p className="text-sm text-muted-foreground">Recevoir un rapport d'activité chaque semaine</p>
                </div>
                <Switch />
              </div>
              <Button onClick={handleSave}>Enregistrer</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
