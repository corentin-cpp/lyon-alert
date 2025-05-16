"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, Droplets, Clock, MapPin, Activity } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { SuggestedActivitiesModal } from './suggested-activities-modal';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hlzmxhutxdisryxhzzuz.supabase.co/';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhsem14aHV0eGRpc3J5eGh6enV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyOTcyNjIsImV4cCI6MjA2Mjg3MzI2Mn0.ZUCejH8zUVFpBW9MQK-JRsgwi2Wi2KlO3U_TmuU7Ea0';
const supabase = createClient(supabaseUrl, supabaseKey);

type Event = {
  id: number;
  type: 'earthquake' | 'tsunami' | 'hack' | 'community';
  magnitude?: number;
  level?: 'low' | 'medium' | 'high' | 'critical';
  location: string;
  timestamp: string;
  details: string;
  coordinates: [number, number];
};

export function RecentEvents() {
  const [activeTab, setActiveTab] = useState('all');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const { data, error } = await supabase
          .from('Events')
          .select('*')
          .order('timestamp', { ascending: false })
          .limit(8);

        if (error) throw error;
        setEvents(data || []);
      } catch (error) {
        console.error('Erreur lors de la récupération des événements:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);
  
  const filteredEvents = activeTab === 'all' 
    ? events 
    : events.filter(event => event.type === activeTab);
  
  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            Événements récents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Chargement des événements...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-muted-foreground" />
          Événements récents
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 mb-4">
            <TabsTrigger value="all">Tous</TabsTrigger>
            <TabsTrigger value="earthquake">Séismes</TabsTrigger>
            <TabsTrigger value="tsunami">Tsunamis</TabsTrigger>
            <TabsTrigger value="hack">Cyber-Attaques</TabsTrigger>
            <TabsTrigger value="community">Communauté</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="space-y-4">
            {filteredEvents.length > 0 ? (
              filteredEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Aucun événement récent de ce type</p>
              </div>
            )}
            
            <div className="pt-2 text-center">
              <Button variant="outline" asChild>
                <Link href="/alerts/history">
                  Voir tous les événements
                </Link>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function EventCard({ event }: { event: Event }) {
  const [showActivities, setShowActivities] = useState(false);
  const { type, magnitude, level, location, timestamp, details } = event;

  const getEventIcon = () => {
    switch (type) {
      case 'earthquake':
        return <AlertTriangle className="h-6 w-6 text-orange-500" />;
      case 'tsunami':
        return <Droplets className="h-6 w-6 text-blue-500" />;
      case 'hack':
        return <Activity className="h-6 w-6 text-red-500" />;
      case 'community':
        return <Activity className="h-6 w-6 text-green-500" />;
      default:
        return <AlertTriangle className="h-6 w-6 text-gray-500" />;
    }
  };

  const getEventTitle = () => {
    switch (type) {
      case 'earthquake':
        return 'Séisme';
      case 'tsunami':
        return 'Tsunami';
      case 'hack':
        return 'Cyber-Attaque';
      case 'community':
        return 'Événement Communautaire';
      default:
        return 'Événement';
    }
  };

  const getBadgeText = () => {
    if (type === 'earthquake' && magnitude) {
      return `Magnitude ${magnitude}`;
    }
    if (level) {
      switch (level) {
        case 'low':
          return 'Niveau faible';
        case 'medium':
          return 'Niveau modéré';
        case 'high':
          return 'Niveau élevé';
        case 'critical':
          return 'Niveau critique';
        default:
          return '';
      }
    }
    return '';
  };

  const getBadgeVariant = () => {
    if (type === 'earthquake') {
      return magnitude && magnitude >= 3 ? 'destructive' : 'outline';
    }
    switch (level) {
      case 'low':
        return 'outline';
      case 'medium':
        return 'default';
      case 'high':
      case 'critical':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <>
      <div className="flex gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
        <div className="flex-shrink-0">
          {getEventIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap gap-2 items-center mb-1">
            <h3 className="font-medium">
              {getEventTitle()}
            </h3>
            <Badge variant={getBadgeVariant()}>
              {getBadgeText()}
            </Badge>
            <span className="text-sm text-muted-foreground ml-auto whitespace-nowrap">
              {formatDistanceToNow(new Date(timestamp), { addSuffix: true, locale: fr })}
            </span>
          </div>
          <div className="flex items-start gap-1 text-sm text-muted-foreground mb-2">
            <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>{location}</span>
          </div>
          <p className="text-sm mb-3">{details}</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={() => setShowActivities(true)}
          >
            <Activity className="h-4 w-4" />
            Voir les activités suggérées
          </Button>
        </div>
      </div>

      <SuggestedActivitiesModal
        isOpen={showActivities}
        onClose={() => setShowActivities(false)}
        eventType={type}
        eventLocation={location}
      />
    </>
  );
}