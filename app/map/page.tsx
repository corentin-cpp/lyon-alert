"use client";

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Droplets, Map, Layers, Info, Filter } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import { MapLegend } from '@/components/map/map-legend';
import { MapFilter } from '@/components/map/map-filter';

// Dynamically import the Map component with no SSR to avoid issues with window/navigator
const InteractiveMap = dynamic(() => import('@/components/map/interactive-map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[70vh] rounded-lg border overflow-hidden">
      <Skeleton className="w-full h-full" />
    </div>
  ),
});

export default function MapPage() {
  const [filterType, setFilterType] = useState<string | null>(null);
  const [showLegend, setShowLegend] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  
  // Parse URL parameters on client side
 useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const filterParam = params.get('filter');
  if (filterParam) {
    setFilterType(filterParam);
  }
}, []);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <Map className="h-7 w-7 text-primary" />
        Carte des risques
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-9">
          <Card className="mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-muted">
              <div className="flex items-center gap-2 mb-3 sm:mb-0">
                <Layers className="h-5 w-5 text-muted-foreground" />
                <h2 className="font-medium">Carte interactive de Lyon</h2>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setShowLegend(!showLegend)}
                >
                  <Info className="h-4 w-4 mr-2" />
                  {showLegend ? "Masquer légende" : "Afficher légende"}
                </Button>
                
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setShowFilter(!showFilter)}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filtres
                </Button>
              </div>
            </div>
            
            {showLegend && <MapLegend />}
            {showFilter && <MapFilter onFilterChange={setFilterType} currentFilter={filterType} />}
          </Card>
          
          <InteractiveMap filterType={filterType} />
        </div>
        
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <div className="p-4 bg-muted font-medium">
              Alertes actuelles
            </div>
            <div className="p-4">
              <Alert variant="destructive" className="mb-3">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Risque sismique - Niveau faible</AlertTitle>
                <AlertDescription className="text-xs mt-1">
                  Lyon 5e, 9e, 1er, 2e, 4e
                </AlertDescription>
              </Alert>
              
              <Alert variant="default" className="mb-3">
                <Droplets className="h-4 w-4" />
                <AlertTitle>Risque d&apos;inondation - Niveau modéré</AlertTitle>
                <AlertDescription className="text-xs mt-1">
                  Lyon 1er, 2e, 3e, 4e, 6e, 7e, 8e
                </AlertDescription>
              </Alert>
            </div>
          </Card>
          
          <Card>
            <div className="p-4 bg-muted font-medium">
              Événements récents
            </div>
            <div className="p-4 space-y-3">
              <div className="border rounded-md p-3">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    Séisme
                  </Badge>
                  <span className="text-xs text-muted-foreground">Il y a 15 min</span>
                </div>
                <p className="text-sm font-medium">Lyon 5e</p>
                <p className="text-xs text-muted-foreground">Magnitude 2.4 - Ressenti faiblement</p>
              </div>
              
              <div className="border rounded-md p-3">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="gap-1">
                    <Droplets className="h-3 w-3" />
                    Inondation
                  </Badge>
                  <span className="text-xs text-muted-foreground">Il y a 3h</span>
                </div>
                <p className="text-sm font-medium">Lyon 2e - Quais</p>
                <p className="text-xs text-muted-foreground">Montée des eaux modérée - Surveillance</p>
              </div>
            </div>
          </Card>
          
          <Card>
            <div className="p-4 bg-muted font-medium">
              Statistiques
            </div>
            <div className="p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Séismes (30 jours)</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Inondations (30 jours)</span>
                <span className="font-medium">3</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Alertes communautaires</span>
                <span className="font-medium">15</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Magnitude max</span>
                <span className="font-medium">3.1</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}