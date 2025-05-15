"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, Droplets, Clock, MapPin } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

// Mock data - would come from the API in a real app
const mockEvents = [
  {
    id: 1,
    type: 'earthquake',
    magnitude: 2.4,
    location: 'Lyon 5e',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    details: 'Secousse légère ressentie dans le 5e arrondissement'
  },
  {
    id: 2,
    type: 'flood',
    level: 'moderate',
    location: 'Lyon 2e - Quais',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    details: 'Montée des eaux sur les quais du Rhône'
  },
  {
    id: 3,
    type: 'earthquake',
    magnitude: 1.8,
    location: 'Lyon 1er',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    details: 'Activité sismique mineure enregistrée'
  },
  {
    id: 4,
    type: 'flood',
    level: 'minor',
    location: 'Lyon 7e',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    details: 'Alerte préventive de crue, surveillance accrue'
  },
  {
    id: 5,
    type: 'earthquake',
    magnitude: 3.1,
    location: 'Lyon 9e',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    details: 'Secousse modérée dans la zone nord-ouest de Lyon'
  }
];

export function RecentEvents() {
  const [activeTab, setActiveTab] = useState('all');
  
  const filteredEvents = activeTab === 'all' 
    ? mockEvents 
    : mockEvents.filter(event => event.type === activeTab);
  
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
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="all">Tous</TabsTrigger>
            <TabsTrigger value="earthquake">Séismes</TabsTrigger>
            <TabsTrigger value="flood">Inondations</TabsTrigger>
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

function EventCard({ event }) {
  const { type, magnitude, level, location, timestamp, details } = event;
  const isEarthquake = type === 'earthquake';
  const icon = isEarthquake ? (
    <AlertTriangle className="h-6 w-6 text-orange-500" />
  ) : (
    <Droplets className="h-6 w-6 text-blue-500" />
  );
  
  const badgeText = isEarthquake 
    ? `Magnitude ${magnitude}` 
    : level === 'minor' 
      ? 'Niveau faible'
      : level === 'moderate'
        ? 'Niveau modéré'
        : 'Niveau élevé';
  
  const badgeVariant = isEarthquake
    ? magnitude >= 3 ? 'destructive' : 'outline'
    : level === 'minor' ? 'outline' : level === 'moderate' ? 'default' : 'destructive';
    
  return (
    <div className="flex gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
      <div className="flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap gap-2 items-center mb-1">
          <h3 className="font-medium">
            {isEarthquake ? 'Séisme' : 'Inondation'}
          </h3>
          <Badge variant={badgeVariant}>
            {badgeText}
          </Badge>
          <span className="text-sm text-muted-foreground ml-auto whitespace-nowrap">
            {formatDistanceToNow(new Date(timestamp), { addSuffix: true, locale: fr })}
          </span>
        </div>
        <div className="flex items-start gap-1 text-sm text-muted-foreground mb-2">
          <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span>{location}</span>
        </div>
        <p className="text-sm">{details}</p>
      </div>
    </div>
  );
}