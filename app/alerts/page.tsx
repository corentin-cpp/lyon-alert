"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Droplets, CalendarClock, MapPin } from "lucide-react";
import supabase from "@/lib/supabase";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

type Event = {
  id: string;
  type: 'earthquake' | 'flood';
  level: string;
  location: {
    arrondissements: string[];
    coordinates: [number, number];
  };
  timestamp: string;
  details: string;
  magnitude: number;
};

export default function AlertsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  
  useEffect(() => {
    fetchEvents();
  }, [activeTab]);
  
  const fetchEvents = async () => {
    setLoading(true);
    
    let query = supabase
      .from('events')
      .select('*')
      .order('timestamp', { ascending: false });
    
    if (activeTab !== 'all') {
      query = query.eq('type', activeTab);
    }
    
    const { data, error } = await query.limit(20);
    
    if (!error && data) {
      // Parse location if it's stored as a JSON string
      const processedData = data.map((event: any) => ({
        ...event,
        location: typeof event.location === 'string' 
          ? JSON.parse(event.location) 
          : event.location
      }));
      
      setEvents(processedData);
    } else {
      console.error('Erreur lors de la récupération des alertes:', error);
    }
    
    setLoading(false);
  };

  const getLevelBadge = (level: string) => {
    switch(level.toLowerCase()) {
      case 'critical':
        return <Badge variant="destructive">Critique</Badge>;
      case 'high':
        return <Badge variant="destructive">Élevé</Badge>;
      case 'medium':
        return <Badge variant="warning">Moyen</Badge>;
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
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="all">
                Toutes les alertes
              </TabsTrigger>
              <TabsTrigger value="earthquake" className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Séismes
              </TabsTrigger>
              <TabsTrigger value="flood" className="flex items-center gap-2">
                <Droplets className="h-4 w-4" />
                Inondations
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-6">
              {renderEventList(events)}
            </TabsContent>
            
            <TabsContent value="earthquake" className="mt-6">
              {renderEventList(events)}
            </TabsContent>
            
            <TabsContent value="flood" className="mt-6">
              {renderEventList(events)}
            </TabsContent>
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
          
          const Icon = event.type === 'earthquake' ? AlertTriangle : Droplets;
          const typeLabel = event.type === 'earthquake' ? "Séisme" : "Inondation";
          
          return (
            <div 
              key={event.id}
              className="p-4 border rounded-lg bg-card hover:bg-accent/5 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">{typeLabel}</h3>
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
                    {event.type === 'earthquake' ? (
                      <span>Magnitude: {event.magnitude}</span>
                    ) : (
                      <span>Niveau: {event.magnitude}</span>
                    )}
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