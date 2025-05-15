"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, Droplets, CheckCircle2, CornerRightDown } from 'lucide-react';
import { motion } from '@/lib/motion';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { getAlertLevel, AlertLevel } from '@/lib/alert-utils';

// Mock data - would come from API
const mockAlerts = {
  earthquake: {
    level: 'low' as AlertLevel,
    lastUpdate: '2025-04-12T08:23:00',
    locations: ['5e', '9e', '1er', '2e', '4e'],
    details: 'Activité sismique faible détectée. Aucune action immédiate requise.',
  },
  flood: {
    level: 'medium' as AlertLevel,
    lastUpdate: '2025-04-12T09:15:00',
    locations: ['1er', '2e', '3e', '4e', '6e', '7e', '8e'],
    details: 'Vigilance crue sur le Rhône. Surveillance accrue recommandée dans les zones basses.',
  }
};

export function AlertPanel() {
  const [activeTab, setActiveTab] = useState('all');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const anyHighAlert = 
    mockAlerts.earthquake.level === 'high' || 
    mockAlerts.flood.level === 'high' || 
    mockAlerts.earthquake.level === 'critical' || 
    mockAlerts.flood.level === 'critical';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className={cn(
        "overflow-hidden border-2",
        anyHighAlert ? "border-destructive" : "border-border"
      )}>
        <div className={cn(
          "px-6 py-4 flex items-center justify-between",
          anyHighAlert ? "bg-destructive/10" : "bg-muted"
        )}>
          <div className="flex items-center gap-2">
            <AlertTriangle className={cn(
              "h-5 w-5",
              anyHighAlert ? "text-destructive" : "text-muted-foreground"
            )} />
            <h2 className="font-semibold text-lg">État des alertes</h2>
          </div>
          <Button size="sm" variant="outline" asChild>
            <Link href="/alerts">
              Historique
              <CornerRightDown className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="p-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">Toutes les alertes</TabsTrigger>
            <TabsTrigger value="earthquake">Séismes</TabsTrigger>
            <TabsTrigger value="flood">Inondations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4 pt-4">
            <AlertCard 
              type="earthquake"
              level={mockAlerts.earthquake.level}
              lastUpdate={mockAlerts.earthquake.lastUpdate}
              locations={mockAlerts.earthquake.locations}
              details={mockAlerts.earthquake.details}
            />
            <AlertCard 
              type="flood"
              level={mockAlerts.flood.level}
              lastUpdate={mockAlerts.flood.lastUpdate}
              locations={mockAlerts.flood.locations}
              details={mockAlerts.flood.details}
            />
          </TabsContent>
          
          <TabsContent value="earthquake" className="pt-4">
            <AlertCard 
              type="earthquake"
              level={mockAlerts.earthquake.level}
              lastUpdate={mockAlerts.earthquake.lastUpdate}
              locations={mockAlerts.earthquake.locations}
              details={mockAlerts.earthquake.details}
              expanded
            />
          </TabsContent>
          
          <TabsContent value="flood" className="pt-4">
            <AlertCard 
              type="flood"
              level={mockAlerts.flood.level}
              lastUpdate={mockAlerts.flood.lastUpdate}
              locations={mockAlerts.flood.locations}
              details={mockAlerts.flood.details}
              expanded
            />
          </TabsContent>
        </Tabs>
      </Card>
    </motion.div>
  );
}

interface AlertCardProps {
  type: 'earthquake' | 'flood';
  level: AlertLevel;
  lastUpdate: string;
  locations: string[];
  details: string;
  expanded?: boolean;
}

function AlertCard({ type, level, lastUpdate, locations, details, expanded = false }: AlertCardProps) {
  const { color, icon, label } = getAlertLevel(level);
  const formattedDate = new Date(lastUpdate).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  const Icon = type === 'earthquake' ? AlertTriangle : Droplets;
  const title = type === 'earthquake' ? 'Risque sismique' : 'Risque d\'inondation';
  
  return (
    <div className={cn(
      "rounded-md border p-4",
      level === 'critical' || level === 'high' ? "border-destructive/50 bg-destructive/5" : "border-border"
    )}>
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-2 rounded-full",
            color === 'green' ? "bg-green-100 dark:bg-green-900/20" :
            color === 'yellow' ? "bg-yellow-100 dark:bg-yellow-900/20" :
            color === 'orange' ? "bg-orange-100 dark:bg-orange-900/20" :
            "bg-red-100 dark:bg-red-900/20"
          )}>
            <Icon className={cn(
              "h-5 w-5",
              color === 'green' ? "text-green-600 dark:text-green-400" :
              color === 'yellow' ? "text-yellow-600 dark:text-yellow-400" :
              color === 'orange' ? "text-orange-600 dark:text-orange-400" :
              "text-destructive"
            )} />
          </div>
          <div>
            <h3 className="font-medium">{title}</h3>
            <p className="text-sm text-muted-foreground">
              Mise à jour: {formattedDate}
            </p>
          </div>
        </div>
        <Badge variant={
          color === 'green' ? "secondary" :
          color === 'yellow' ? "outline" :
          color === 'orange' ? "default" :
          "destructive"
        }>
          {label}
        </Badge>
      </div>
      
      {expanded && (
        <div className="mt-4 space-y-2">
          <p className="text-sm">{details}</p>
          <div>
            <p className="text-sm font-medium mb-1">Arrondissements concernés:</p>
            <div className="flex flex-wrap gap-1">
              {locations.map((loc) => (
                <Badge key={loc} variant="outline">{loc}</Badge>
              ))}
            </div>
          </div>
          <div className="pt-2">
            <Button size="sm" asChild>
              <Link href={`/map?filter=${type}`}>
                Voir sur la carte
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}