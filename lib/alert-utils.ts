export type AlertLevel = 'none' | 'low' | 'medium' | 'high' | 'critical';

interface AlertLevelInfo {
  color: string;
  icon: string;
  label: string;
}

export function getAlertLevel(level: AlertLevel): AlertLevelInfo {
  switch (level) {
    case 'none':
      return {
        color: 'green',
        icon: 'check-circle',
        label: 'Aucune alerte'
      };
    case 'low':
      return {
        color: 'green',
        icon: 'check-circle',
        label: 'Faible'
      };
    case 'medium':
      return {
        color: 'yellow',
        icon: 'alert-circle',
        label: 'Modéré'
      };
    case 'high':
      return {
        color: 'orange',
        icon: 'alert-triangle',
        label: 'Élevé'
      };
    case 'critical':
      return {
        color: 'red',
        icon: 'alert-octagon',
        label: 'Critique'
      };
    default:
      return {
        color: 'green',
        icon: 'check-circle',
        label: 'Aucune alerte'
      };
  }
}

export interface AlertInfo {
  id: string;
  type: 'earthquake' | 'flood';
  level: AlertLevel;
  location: {
    arrondissements: string[];
    coordinates?: [number, number];
  };
  timestamp: string;
  details: string;
  magnitude?: number; // For earthquakes
  waterLevel?: number; // For floods
  source: string;
  verified: boolean;
}