"use client";

import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, AlertTriangle, Droplets, Compass, ZoomIn, ZoomOut, Home, Users } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

// This would be a real Mapbox or Leaflet implementation in a production app
// Here we're just creating a simplified map UI to demonstrate the concept

// Mock data for map markers
const mockMarkers = [
  {
    id: 1,
    type: 'earthquake',
    location: 'Lyon 5e',
    coordinates: [45.759, 4.821],
    level: 'low',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    details: 'Secousse légère ressentie dans le 5e arrondissement',
    magnitude: 2.4
  },
  {
    id: 2,
    type: 'flood',
    location: 'Lyon 2e - Quais',
    coordinates: [45.751, 4.836],
    level: 'medium',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    details: 'Montée des eaux sur les quais du Rhône',
    waterLevel: 1.2
  },
  {
    id: 3,
    type: 'earthquake',
    location: 'Lyon 1er',
    coordinates: [45.767, 4.834],
    level: 'low',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    details: 'Activité sismique mineure enregistrée',
    magnitude: 1.8
  },
  {
    id: 4,
    type: 'flood',
    location: 'Lyon 7e',
    coordinates: [45.745, 4.842],
    level: 'low',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    details: 'Alerte préventive de crue, surveillance accrue',
    waterLevel: 0.8
  },
  {
    id: 5,
    type: 'earthquake',
    location: 'Lyon 9e',
    coordinates: [45.778, 4.807],
    level: 'medium',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    details: 'Secousse modérée dans la zone nord-ouest de Lyon',
    magnitude: 3.1
  },
  {
    id: 6,
    type: 'community',
    location: 'Lyon 3e',
    coordinates: [45.758, 4.853],
    level: 'low',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    details: 'Signalement communautaire: Fissures observées sur un bâtiment',
    reportCount: 4
  }
];

// Define the areas of risk
const riskZones = [
  { arrondissement: "1er", risks: ["earthquake", "flood"], coords: [[45.767, 4.834], [45.763, 4.831], [45.770, 4.827], [45.774, 4.830]] },
  { arrondissement: "2e", risks: ["earthquake", "flood"], coords: [[45.757, 4.835], [45.751, 4.836], [45.755, 4.829], [45.760, 4.827]] },
  { arrondissement: "3e", risks: ["flood"], coords: [[45.758, 4.853], [45.752, 4.860], [45.745, 4.865], [45.739, 4.870]] },
  { arrondissement: "4e", risks: ["earthquake", "flood"], coords: [[45.775, 4.830], [45.780, 4.835], [45.772, 4.840], [45.767, 4.845]] },
  { arrondissement: "5e", risks: ["earthquake"], coords: [[45.759, 4.821], [45.754, 4.815], [45.760, 4.810], [45.765, 4.816]] },
  { arrondissement: "6e", risks: ["flood"], coords: [[45.770, 4.850], [45.775, 4.855], [45.765, 4.865], [45.760, 4.860]] },
  { arrondissement: "7e", risks: ["flood"], coords: [[45.745, 4.842], [45.740, 4.848], [45.735, 4.852], [45.730, 4.846]] },
  { arrondissement: "8e", risks: ["flood"], coords: [[45.735, 4.860], [45.730, 4.865], [45.725, 4.870], [45.720, 4.865]] },
  { arrondissement: "9e", risks: ["earthquake"], coords: [[45.778, 4.807], [45.783, 4.802], [45.788, 4.807], [45.783, 4.812]] }
];

interface Marker {
  id: number;
  type: string;
  location: string;
  coordinates: [number, number];
  level: string;
  timestamp: string;
  details: string;
  magnitude?: number;
  waterLevel?: number;
  reportCount?: number;
}

interface MapProps {
  filterType: string | null;
}

export default function InteractiveMap({ filterType }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null);
  const [zoomLevel, setZoomLevel] = useState(12);
  const [showRiskZones, setShowRiskZones] = useState(true);
  const [showEarthquake, setShowEarthquake] = useState(true);
  const [showFlood, setShowFlood] = useState(true);
  const [showCommunity, setShowCommunity] = useState(true);
  
  // Update filters based on props
  useEffect(() => {
    if (filterType === 'earthquake') {
      setShowEarthquake(true);
      setShowFlood(false);
      setShowCommunity(false);
    } else if (filterType === 'flood') {
      setShowEarthquake(false);
      setShowFlood(true);
      setShowCommunity(false);
    } else {
      setShowEarthquake(true);
      setShowFlood(true);
      setShowCommunity(true);
    }
  }, [filterType]);
  
  // Filter markers based on settings
  const filteredMarkers = mockMarkers.filter(marker => {
    if (marker.type === 'earthquake' && !showEarthquake) return false;
    if (marker.type === 'flood' && !showFlood) return false;
    if (marker.type === 'community' && !showCommunity) return false;
    return true;
  });
  
  // Calculate marker positions based on coordinates
  // In a real app, this would be done by the mapping library
  const getMarkerStyle = (coordinates: [number, number]) => {
    // This is a very simplified fake positioning - in a real app, this would be handled by the map library
    const baseCoord = [45.75, 4.85]; // Approximate center of Lyon
    const xOffset = (coordinates[1] - baseCoord[1]) * 1000;
    const yOffset = (baseCoord[0] - coordinates[0]) * 1000;
    
    return {
      left: `calc(50% + ${xOffset}px)`,
      top: `calc(50% + ${yOffset}px)`,
    };
  };
  
  // Calculate zone polygon shapes (very simplified)
  const getZoneStyle = (coords: Array<[number, number]>) => {
    // In a real app, this would be proper SVG paths or polygon rendering from the map library
    const baseCoord = [45.75, 4.85]; // Approximate center of Lyon
    const points = coords.map(coord => {
      const x = (coord[1] - baseCoord[1]) * 1000 + 50;
      const y = (baseCoord[0] - coord[0]) * 1000 + 50;
      return `${x}% ${y}%`;
    }).join(', ');
    
    return {
      clipPath: `polygon(${points})`,
    };
  };
  
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 1, 18));
  };
  
  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 1, 10));
  };
  
  const handleResetView = () => {
    setZoomLevel(12);
  };
  
  // Format the timestamp for display
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <Card className="w-full h-[70vh] relative overflow-hidden">
      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-10 bg-background/90 backdrop-blur-sm rounded-lg shadow-md">
        <div className="p-2 flex flex-col gap-2">
          <Button variant="outline" size="icon" onClick={handleZoomIn} title="Zoom avant">
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleZoomOut} title="Zoom arrière">
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleResetView} title="Vue par défaut">
            <Compass className="h-4 w-4" />
          </Button>
          <Button 
            variant={showRiskZones ? "secondary" : "outline"} 
            size="icon" 
            onClick={() => setShowRiskZones(!showRiskZones)}
            title="Afficher/masquer les zones de risque"
          >
            <Layers className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Map container */}
      <div 
        ref={mapRef} 
        className="w-full h-full bg-[#e5e3df] relative overflow-hidden"
        style={{
          transform: `scale(${zoomLevel / 12})`,
          transition: 'transform 0.3s ease-out'
        }}
      >
        {/* This would be replaced with actual map implementation */}
        <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v11/static/4.85,45.75,11,0/1200x900?access_token=pk.placeholder')] bg-cover bg-center opacity-80">
          {/* Risk zones */}
          {showRiskZones && riskZones.map((zone, idx) => {
            const showZone = (zone.risks.includes('earthquake') && showEarthquake) ||
                           (zone.risks.includes('flood') && showFlood);
                           
            if (!showZone) return null;
            
            return (
              <div 
                key={idx}
                className={cn(
                  "absolute inset-0 opacity-25",
                  zone.risks.includes('earthquake') && zone.risks.includes('flood') 
                    ? "bg-purple-500" 
                    : zone.risks.includes('earthquake') 
                      ? "bg-orange-500" 
                      : "bg-blue-500"
                )}
                style={getZoneStyle(zone.coords)}
              >
                <div className="flex items-center justify-center h-full text-white font-bold">
                  {zone.arrondissement}
                </div>
              </div>
            );
          })}
          
          {/* Markers */}
          {filteredMarkers.map(marker => (
            <Popover key={marker.id}>
              <PopoverTrigger asChild>
                <button
                  className={cn(
                    "absolute transform -translate-x-1/2 -translate-y-1/2 z-20",
                    marker.type === 'community' ? "text-primary" : 
                    marker.type === 'earthquake' ? "text-orange-500" : "text-blue-500"
                  )}
                  style={getMarkerStyle(marker.coordinates)}
                  onClick={() => setSelectedMarker(marker)}
                >
                  <div className="relative">
                    {marker.type === 'earthquake' && <AlertTriangle className="h-8 w-8" />}
                    {marker.type === 'flood' && <Droplets className="h-8 w-8" />}
                    {marker.type === 'community' && <Users className="h-8 w-8" />}
                    
                    {/* Pulse animation for recent events */}
                    {new Date(marker.timestamp) > new Date(Date.now() - 1000 * 60 * 60) && (
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                      </span>
                    )}
                  </div>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0">
                <div className={cn(
                  "px-4 py-3",
                  marker.type === 'earthquake' ? "bg-orange-500/10" : 
                  marker.type === 'flood' ? "bg-blue-500/10" : 
                  "bg-primary/10"
                )}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium flex items-center gap-1">
                      {marker.type === 'earthquake' && <AlertTriangle className="h-4 w-4 text-orange-500" />}
                      {marker.type === 'flood' && <Droplets className="h-4 w-4 text-blue-500" />}
                      {marker.type === 'community' && <Users className="h-4 w-4 text-primary" />}
                      {marker.type === 'earthquake' && 'Séisme'}
                      {marker.type === 'flood' && 'Inondation'}
                      {marker.type === 'community' && 'Signalement communautaire'}
                    </h3>
                    <Badge variant={
                      marker.level === 'low' ? "outline" : 
                      marker.level === 'medium' ? "default" : 
                      "destructive"
                    }>
                      {marker.level === 'low' && 'Faible'}
                      {marker.level === 'medium' && 'Modéré'}
                      {marker.level === 'high' && 'Élevé'}
                      {marker.level === 'critical' && 'Critique'}
                    </Badge>
                  </div>
                </div>
                
                <div className="p-4 space-y-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <span>{marker.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{formatTime(marker.timestamp)}</span>
                  </div>
                  
                  {marker.magnitude && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Magnitude:</span>
                      <Badge variant={
                        marker.magnitude < 3 ? "outline" : 
                        marker.magnitude < 4 ? "default" : 
                        "destructive"
                      }>
                        {marker.magnitude}
                      </Badge>
                    </div>
                  )}
                  
                  {marker.waterLevel && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Niveau d&apos;eau:</span>
                      <Badge variant={
                        marker.waterLevel < 1 ? "outline" : 
                        marker.waterLevel < 2 ? "default" : 
                        "destructive"
                      }>
                        {marker.waterLevel} m
                      </Badge>
                    </div>
                  )}
                  
                  {marker.reportCount && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Signalements:</span>
                      <Badge>{marker.reportCount}</Badge>
                    </div>
                  )}
                  
                  <p className="text-sm mt-2">{marker.details}</p>
                  
                  <div className="flex justify-between pt-2">
                    <Button variant="outline" size="sm" asChild>
                      <a href={`/chat/${marker.location.split(' ')[1].replace(/[^0-9]/g, '')}`}>
                        Chat local
                      </a>
                    </Button>
                    <Button size="sm">Plus de détails</Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          ))}
        </div>
        
        {/* Attribution overlay */}
        <div className="absolute bottom-0 right-0 bg-background/80 text-xs p-1 rounded-tl-md">
          © OpenStreetMap | Mapbox
        </div>
      </div>
    </Card>
  );
}

// Simple clock icon component
function Clock({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  );
}