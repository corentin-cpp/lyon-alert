"use client";

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { AlertTriangle, Droplets, Users, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';

interface MapFilterProps {
  onFilterChange: (type: string | null) => void;
  currentFilter: string | null;
}

export function MapFilter({ onFilterChange, currentFilter }: MapFilterProps) {
  const [showEarthquakes, setShowEarthquakes] = useState(true);
  const [showFloods, setShowFloods] = useState(true);
  const [showCommunity, setShowCommunity] = useState(true);
  const [timeRange, setTimeRange] = useState([30]); // Days
  
  // Sync with parent component
  useEffect(() => {
    if (currentFilter === 'earthquake') {
      setShowEarthquakes(true);
      setShowFloods(false);
      setShowCommunity(false);
    } else if (currentFilter === 'flood') {
      setShowEarthquakes(false);
      setShowFloods(true);
      setShowCommunity(false);
    }
  }, [currentFilter]);
  
  // Apply filters
  const applyFilters = () => {
    if (!showEarthquakes && !showFloods && !showCommunity) {
      // If nothing selected, show all
      onFilterChange(null);
      return;
    }
    
    if (showEarthquakes && !showFloods && !showCommunity) {
      onFilterChange('earthquake');
    } else if (!showEarthquakes && showFloods && !showCommunity) {
      onFilterChange('flood');
    } else if (!showEarthquakes && !showFloods && showCommunity) {
      onFilterChange('community');
    } else {
      onFilterChange(null); // Mixed filters
    }
  };
  
  const resetFilters = () => {
    setShowEarthquakes(true);
    setShowFloods(true);
    setShowCommunity(true);
    setTimeRange([30]);
    onFilterChange(null);
  };
  
  return (
    <div className="p-4 border-t">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h3 className="font-medium mb-3">Types d&apos;événements</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="filter-earthquake" 
                checked={showEarthquakes}
                onCheckedChange={(checked) => setShowEarthquakes(!!checked)}
              />
              <Label htmlFor="filter-earthquake" className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                Séismes
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="filter-flood" 
                checked={showFloods}
                onCheckedChange={(checked) => setShowFloods(!!checked)}
              />
              <Label htmlFor="filter-flood" className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-blue-500" />
                Inondations
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="filter-community" 
                checked={showCommunity}
                onCheckedChange={(checked) => setShowCommunity(!!checked)}
              />
              <Label htmlFor="filter-community" className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                Signalements communautaires
              </Label>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="font-medium mb-3 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            Période de temps
          </h3>
          <div className="px-2">
            <Slider
              defaultValue={[30]}
              max={90}
              min={1}
              step={1}
              value={timeRange}
              onValueChange={setTimeRange}
            />
            <div className="flex justify-between mt-2">
              <span className="text-sm text-muted-foreground">1 jour</span>
              <span className="text-sm font-medium">{timeRange[0]} jours</span>
              <span className="text-sm text-muted-foreground">90 jours</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col justify-center space-y-2 md:items-end">
          <Button 
            onClick={applyFilters}
            className="w-full md:w-auto"
          >
            Appliquer les filtres
          </Button>
          <Button 
            variant="outline" 
            onClick={resetFilters}
            className="w-full md:w-auto"
          >
            Réinitialiser
          </Button>
        </div>
      </div>
    </div>
  );
}