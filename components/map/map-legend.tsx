import { AlertTriangle, Droplets, Users } from 'lucide-react';

export function MapLegend() {
  return (
    <div className="p-4 border-t text-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <h3 className="font-medium mb-2">Types d&apos;événements</h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              <span>Séisme</span>
            </li>
            <li className="flex items-center gap-2">
              <Droplets className="h-4 w-4 text-blue-500" />
              <span>Inondation</span>
            </li>
            <li className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span>Signalement communautaire</span>
            </li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-medium mb-2">Niveaux d&apos;alerte</h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-green-500" />
              <span>Faible</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-yellow-500" />
              <span>Modéré</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-orange-500" />
              <span>Élevé</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-red-500" />
              <span>Critique</span>
            </li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-medium mb-2">Zones de risque</h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <span className="w-4 h-4 bg-orange-500/50" />
              <span>Zone sismique</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-4 h-4 bg-blue-500/50" />
              <span>Zone inondable</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-4 h-4 bg-purple-500/50" />
              <span>Zone mixte (séisme + inondation)</span>
            </li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-medium mb-2">Symboles additionnels</h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <div className="relative w-4 h-4 flex items-center justify-center">
                <span className="absolute w-2 h-2 bg-white rounded-full" />
                <span className="absolute w-4 h-4 bg-white rounded-full animate-ping opacity-75" />
              </div>
              <span>Événement récent (moins d&apos;1h)</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-4 h-4 border border-dashed border-gray-500" />
              <span>Zone en surveillance</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}