import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Info } from "lucide-react";
import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";

interface Activity {
  id: number;
  name: string;
  desc: string;
  location: string;
  type: string;
}

interface SuggestedActivitiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventType: string;
  eventLocation: string;
}

export function SuggestedActivitiesModal({ isOpen, onClose, eventType, eventLocation }: SuggestedActivitiesModalProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      if (!isOpen) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('Activities')
          .select('*')
          .eq('type', eventType)
          .limit(5);

        if (error) {
          console.error('Erreur lors de la récupération des activités:', error);
          return;
        }

        setActivities(data || []);
      } catch (err) {
        console.error('Erreur lors de la récupération des activités:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [isOpen, eventType]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Activités suggérées pour {eventLocation}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 mt-4">
          {loading ? (
            <div className="text-center py-4">
              <p className="text-muted-foreground">Chargement des activités...</p>
            </div>
          ) : activities.length > 0 ? (
            activities.map((activity) => (
              <Card key={activity.id} className="hover:bg-accent/5 transition-colors">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{activity.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <Info className="h-4 w-4 mt-1 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">{activity.desc}</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{activity.location}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground">Aucune activité suggérée pour ce type d&aposévénement</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 