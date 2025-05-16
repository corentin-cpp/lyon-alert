import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Info } from "lucide-react";

interface Activity {
  name: string;
  desc: string;
  location: string;
}

interface SuggestedActivitiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventType: string;
  eventLocation: string;
}

const activitiesByType: Record<string, Activity[]> = {
  earthquake: [
    {
      name: "Évaluation des dégâts",
      desc: "Inspection des bâtiments et des infrastructures pour évaluer les dommages causés par le séisme",
      location: "Centre d'évaluation des risques"
    },
    {
      name: "Mise en sécurité",
      desc: "Évacuation et sécurisation des zones à risque suite au tremblement de terre",
      location: "Point de rassemblement principal"
    },
    {
      name: "Suivi sismique",
      desc: "Surveillance continue de l'activité sismique dans la zone",
      location: "Station de surveillance sismique"
    }
  ],
  tsunami: [
    {
      name: "Évacuation côtière",
      desc: "Coordination de l'évacuation des zones côtières et des berges",
      location: "Point d'évacuation principal"
    },
    {
      name: "Surveillance des niveaux d'eau",
      desc: "Suivi des niveaux d'eau et des courants dans les cours d'eau",
      location: "Station de mesure hydrologique"
    },
    {
      name: "Protection des infrastructures",
      desc: "Mise en place de barrières et protection des installations sensibles",
      location: "Centre de coordination des secours"
    }
  ],
  hack: [
    {
      name: "Analyse de sécurité",
      desc: "Investigation approfondie des systèmes compromis",
      location: "Centre de sécurité informatique"
    },
    {
      name: "Restauration des services",
      desc: "Rétablissement des services informatiques affectés",
      location: "Centre de données principal"
    },
    {
      name: "Renforcement de la sécurité",
      desc: "Mise à jour des protocoles de sécurité et des pare-feu",
      location: "Centre de sécurité informatique"
    }
  ],
  community: [
    {
      name: "Enquête communautaire",
      desc: "Investigation des signalements par les citoyens",
      location: "Centre d'accueil communautaire"
    },
    {
      name: "Coordination des bénévoles",
      desc: "Organisation des volontaires pour l'aide aux sinistrés",
      location: "Point de coordination des bénévoles"
    },
    {
      name: "Information publique",
      desc: "Diffusion des informations et recommandations aux citoyens",
      location: "Centre d'information publique"
    }
  ]
};

export function SuggestedActivitiesModal({ isOpen, onClose, eventType, eventLocation }: SuggestedActivitiesModalProps) {
  const activities = activitiesByType[eventType] || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Activités suggérées pour {eventLocation}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 mt-4">
          {activities.map((activity, index) => (
            <Card key={index} className="hover:bg-accent/5 transition-colors">
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
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
} 