"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Droplets, CalendarClock, MapPin } from "lucide-react";
import supabase from "@/lib/supabase";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";

type Event = {
  id: string;
  type: string;
  level: string;
  location: {
    arrondissements: string[];
    coordinates?: [number, number];
  };
  timestamp: string;
  details: string;
  magnitude?: number;
};

export default function AlertsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [eventTypes, setEventTypes] = useState<string[]>(['earthquake', 'flood']);
  
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    
    try {
      console.log("Début de la récupération des events");
      
      let query = supabase
        .from('Events')
        .select('*')
        .order('timestamp', { ascending: false });
      
      if (activeTab !== 'all') {
        query = query.eq('type', activeTab);
      }
      
      console.log("Exécution de la requête:", activeTab);
      const { data, error } = await query.limit(20);
      
      console.log("Réponse reçue:", { data, error });
      
      // Get unique event types
      const { data: typesData, error: typesError } = await supabase
        .from('Events')
        .select('type')
        .limit(50);

      console.log("Types d'événements:", { typesData, typesError });

      if (typesData) {
        const uniqueTypes = Array.from(new Set(typesData.map(item => item.type)));
        console.log("Types uniques détectés:", uniqueTypes);
        setEventTypes(uniqueTypes);
      }
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        console.log("Données à traiter:", data);
        
        // Traiter les données pour assurer la structure correcte
        const processedData = data.map(event => {
          console.log("Traitement de l'événement:", event);
          let locationData;
          try {
            if (event.location && typeof event.location === 'object') {
              locationData = event.location;
            } 
            else if (typeof event.location === 'string' && 
                    (event.location.trim().startsWith('{') || event.location.trim().startsWith('['))) {
              locationData = JSON.parse(event.location);
            } 
            else {
              locationData = { 
                arrondissements: typeof event.location === 'string' ? [event.location] : ["Non précisé"] 
              };
            }
          } catch (e) {
            console.error("Erreur lors du traitement de location:", e);
            locationData = { arrondissements: ["Non précisé"] };
          }
          
          return {
            id: event.id,
            type: event.type,
            level: event.level || 'low',
            location: locationData,
            timestamp: event.timestamp,
            details: event.details || 'Pas de détails disponibles',
            magnitude: event.magnitude
          };
        });
        
        console.log("Données traitées:", processedData);
        setEvents(processedData);
      } else {
        console.log("Aucune donnée reçue ou tableau vide");
        setEvents([]);
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des événements:', err);
    } finally {
      setLoading(false);
    }
  
  useEffect(() => {
    fetchEvents();
  
  const getLevelBadge = (level: string) => {
    switch(level.toLowerCase()) {
      case 'critical':
        return <Badge variant="destructive">Critique</Badge>;
      case 'high':
        return <Badge variant="destructive">Élevé</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Moyen</Badge>;
      case 'low':
        return <Badge variant="outline">Faible</Badge>;
      default:
        return <Badge variant="secondary">{level}</Badge>;
    }
  };
  
  const formatArrondissements = (arrondissements: string[]) => {
    if (!arrondissements || arrondissements.length === 0) return "Non précisé";
    
    if (arrondissements.includes('all')) return "Tous les arrondissements";
    
    return arrondissements.map(arr => `Lyon ${arr}`).join(', ');
  };

  function getEventIcon(type: string) {
    switch(type.toLowerCase()) {
      case 'earthquake':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'flood':
        return <Droplets className="h-5 w-5 text-blue-500" />;
      case 'tsunami':
        return <Droplets className="h-5 w-5 text-indigo-600" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-primary" />;
    }
  }

  function getEventLabel(type: string) {
    switch(type.toLowerCase()) {
      case 'earthquake':
        return 'Séisme';
      case 'flood':
        return 'tsunami';
      case 'Tsunami':
        return 'Tsunami';
      default:
        return type;
    }
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      <Card className="border shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Alertes récentes</CardTitle>
          </div>
          <CardDescription>
            Les dernières alertes concernant les risques naturels à Lyon
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid" style={{ gridTemplateColumns: `repeat(${eventTypes.length + 1}, 1fr)` }}>
              <TabsTrigger value="all">
                Toutes les alertes
              </TabsTrigger>
              {eventTypes.map(type => (
                <TabsTrigger 
                  key={type} 
                  value={type} 
                  className="flex items-center gap-2"
                >
                  {getEventIcon(type)}
                  {getEventLabel(type)}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <TabsContent value="all" className="mt-6">
              {renderEventList(events)}
            </TabsContent>
            
            {eventTypes.map(type => (
              <TabsContent key={type} value={type} className="mt-6">
                {renderEventList(events.filter(event => event.type === type))}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
  
  function renderEventList(eventList: Event[]) {
    if (loading) {
      return (
        <div className="flex justify-center py-12">
          <div className="animate-pulse">Chargement des alertes...</div>
        </div>
      );
    }
    
    if (eventList.length === 0) {
      return (
        <div className="text-center py-12 text-muted-foreground">
          <p>Aucune alerte trouvée</p>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {eventList.map((event) => {
          const timeAgo = formatDistanceToNow(new Date(event.timestamp), { 
            addSuffix: true,
            locale: fr
          });
          
          const eventIcon = getEventIcon(event.type);
          const eventLabel = getEventLabel(event.type);
          
          return (
            <div 
              key={event.id}
              className="p-4 border rounded-lg bg-card hover:bg-accent/5 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {eventIcon}
                  <h3 className="font-medium">{eventLabel}</h3>
                  {getLevelBadge(event.level)}
                </div>
                <div className="flex items-center text-sm text-muted-foreground gap-1">
                  <CalendarClock className="h-3.5 w-3.5" />
                  <span>{timeAgo}</span>
                </div>
              </div>
              
              <p className="text-sm mb-2">{event.details}</p>
              
              <div className="flex flex-wrap gap-y-2 gap-x-4 mt-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" /> 
                  {formatArrondissements(event.location?.arrondissements || [])}
                </div>
                
                {event.magnitude && (
                  <div className="flex items-center gap-1">
                    <span>
                      {event.type === 'earthquake' ? 'Magnitude' : 'Niveau'}: {event.magnitude}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}