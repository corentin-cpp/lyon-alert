"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Droplets, Bell, Save, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import supabase from "@/lib/supabase";

export default function AlertConfigPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  
  // Configuration pour les alertes de séismes
  const [earthquakeEnabled, setEarthquakeEnabled] = useState(true);
  const [earthquakeThreshold, setEarthquakeThreshold] = useState(2);
  const [earthquakeNotificationMethod, setEarthquakeNotificationMethod] = useState("both");
  
  // Configuration pour les alertes d'inondations
  const [floodEnabled, setFloodEnabled] = useState(true);
  const [floodThreshold, setFloodThreshold] = useState(2); // Seuil pour les niveaux d'eau
  const [floodNotificationMethod, setFloodNotificationMethod] = useState("both");
  
  // Paramètres généraux
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [arrondissements, setArrondissements] = useState<string[]>(["all"]);
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/auth/login');
        return;
      }
      
      setUser(session.user);
      
      // Récupérer les préférences d'alerte existantes
      const { data, error } = await supabase
        .from('alert_preferences')
        .select('*')
        .eq('user_id', session.user.id)
        .single();
      
      if (data) {
        // Initialiser les états avec les données existantes
        setEarthquakeEnabled(data.earthquake_enabled ?? true);
        setEarthquakeThreshold(data.earthquake_threshold ?? 2);
        setEarthquakeNotificationMethod(data.earthquake_notification_method ?? "both");
        setFloodEnabled(data.flood_enabled ?? true);
        setFloodThreshold(data.flood_threshold ?? 2); // Utilise le même champ magnitude
        setFloodNotificationMethod(data.flood_notification_method ?? "both");
        setPushEnabled(data.push_enabled ?? true);
        setEmailEnabled(data.email_enabled ?? true);
        setArrondissements(data.arrondissements ?? ["all"]);
      }
    };
    
    fetchUserProfile();
  }, [router]);
  
  const handleArrondissementChange = (value: string) => {
    if (value === "all") {
      setArrondissements(["all"]);
    } else {
      const newArr = arrondissements.includes("all") 
        ? [value]
        : arrondissements.includes(value)
          ? arrondissements.filter(a => a !== value)
          : [...arrondissements, value];
      
      setArrondissements(newArr.length ? newArr : ["all"]);
    }
  };
  
  const handleSave = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('alert_preferences')
        .upsert({
          user_id: user.id,
          earthquake_enabled: earthquakeEnabled,
          earthquake_threshold: earthquakeThreshold,
          earthquake_notification_method: earthquakeNotificationMethod,
          flood_enabled: floodEnabled,
          flood_threshold: floodThreshold, // Au lieu de flood_distance
          flood_notification_method: floodNotificationMethod,
          push_enabled: pushEnabled,
          email_enabled: emailEnabled,
          arrondissements,
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      toast({
        title: "Préférences sauvegardées",
        description: "Vos paramètres d'alerte ont été mis à jour avec succès.",
      });
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors de la sauvegarde");
    } finally {
      setLoading(false);
    }
  };
  
  if (!user) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <Card className="border shadow-lg">
          <CardContent className="flex items-center justify-center p-8">
            <p>Chargement en cours...</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      <Card className="border shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <Bell className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Configurer mes alertes</CardTitle>
          </div>
          <CardDescription>
            Personnalisez les types d&apos;alertes que vous souhaitez recevoir
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="bg-muted/50 p-4 rounded-lg border">
            <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Info className="h-4 w-4 text-muted-foreground" />
              Comment fonctionnent les alertes ?
            </h3>
            <p className="text-sm text-muted-foreground">
              Vous recevrez des alertes en temps réel en fonction de vos préférences. 
              Vous pouvez les configurer par type de risque, intensité et zone géographique.
            </p>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Méthodes de notification</h2>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex items-center justify-between space-x-2 p-4 border rounded-lg flex-1">
                <div className="flex items-center space-x-2">
                  <Bell className="h-4 w-4" />
                  <Label htmlFor="push">Notifications push</Label>
                </div>
                <Switch 
                  id="push"
                  checked={pushEnabled}
                  onCheckedChange={setPushEnabled}
                />
              </div>
              <div className="flex items-center justify-between space-x-2 p-4 border rounded-lg flex-1">
                <div className="flex items-center space-x-2">
                  <Bell className="h-4 w-4" />
                  <Label htmlFor="email">Notifications par email</Label>
                </div>
                <Switch 
                  id="email"
                  checked={emailEnabled}
                  onCheckedChange={setEmailEnabled}
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Zones surveillées</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              <Button 
                variant={arrondissements.includes("all") ? "default" : "outline"} 
                onClick={() => handleArrondissementChange("all")}
              >
                Tous
              </Button>
              {["1er", "2e", "3e", "4e", "5e", "6e", "7e", "8e", "9e"].map((arr) => (
                <Button 
                  key={arr} 
                  variant={arrondissements.includes(arr) && !arrondissements.includes("all") ? "default" : "outline"} 
                  onClick={() => handleArrondissementChange(arr)}
                  disabled={arrondissements.includes("all")}
                >
                  Lyon {arr}
                </Button>
              ))}
            </div>
          </div>
          
          <Tabs defaultValue="earthquake" className="mt-8">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="earthquake" className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Alertes séismes
              </TabsTrigger>
              <TabsTrigger value="flood" className="flex items-center gap-2">
                <Droplets className="h-4 w-4" />
                Alertes inondations
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="earthquake" className="space-y-4 pt-4">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="earthquake-toggle">Activer les alertes séismes</Label>
                <Switch 
                  id="earthquake-toggle"
                  checked={earthquakeEnabled}
                  onCheckedChange={setEarthquakeEnabled}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Seuil de magnitude minimum</Label>
                <div className="flex items-center space-x-4">
                  <Slider 
                    defaultValue={[earthquakeThreshold]} 
                    min={1} 
                    max={7} 
                    step={0.1} 
                    onValueChange={(value) => setEarthquakeThreshold(value[0])}
                    disabled={!earthquakeEnabled}
                    className="flex-1"
                  />
                  <span className="w-12 text-center font-medium">{earthquakeThreshold}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Vous recevrez des alertes uniquement pour les séismes d&apos;une magnitude supérieure ou égale à cette valeur.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="earthquake-method">Méthode de notification</Label>
                <Select 
                  value={earthquakeNotificationMethod}
                  onValueChange={setEarthquakeNotificationMethod}
                  disabled={!earthquakeEnabled}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une méthode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="push">Notifications push uniquement</SelectItem>
                    <SelectItem value="email">Email uniquement</SelectItem>
                    <SelectItem value="both">Les deux</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
            
            <TabsContent value="flood" className="space-y-4 pt-4">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="flood-toggle">Activer les alertes inondations</Label>
                <Switch 
                  id="flood-toggle"
                  checked={floodEnabled}
                  onCheckedChange={setFloodEnabled}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Niveau d&apos;alerte minimum</Label>
                <div className="flex items-center space-x-4">
                  <Slider 
                    defaultValue={[floodThreshold]} 
                    min={1} 
                    max={5} 
                    step={0.5} 
                    onValueChange={(value) => setFloodThreshold(value[0])}
                    disabled={!floodEnabled}
                    className="flex-1"
                  />
                  <span className="w-12 text-center font-medium">{floodThreshold}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Vous recevrez des alertes uniquement pour les inondations d&apos;un niveau supérieur ou égal à cette valeur.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="flood-method">Méthode de notification</Label>
                <Select 
                  value={floodNotificationMethod}
                  onValueChange={setFloodNotificationMethod}
                  disabled={!floodEnabled}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une méthode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="push">Notifications push uniquement</SelectItem>
                    <SelectItem value="email">Email uniquement</SelectItem>
                    <SelectItem value="both">Les deux</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter>
          <Button 
            className="w-full gap-2" 
            onClick={handleSave} 
            disabled={loading}
          >
            {loading ? "Sauvegarde en cours..." : "Enregistrer mes préférences"}
            {!loading && <Save className="h-4 w-4" />}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}