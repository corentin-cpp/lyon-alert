import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hlzmxhutxdisryxhzzuz.supabase.co/';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhsem14aHV0eGRpc3J5eGh6enV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyOTcyNjIsImV4cCI6MjA2Mjg3MzI2Mn0.ZUCejH8zUVFpBW9MQK-JRsgwi2Wi2KlO3U_TmuU7Ea0';
const supabase = createClient(supabaseUrl, supabaseKey);

function randomRecentDate() {
  const now = Date.now();
  const daysInMs = 24 * 60 * 60 * 1000;
  const randomDaysAgo = Math.floor(Math.random() * 30) * daysInMs;
  return new Date(now - randomDaysAgo).toISOString();
}

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function randomFloat(min: number, max: number): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(4));
}

function generateRandomCoordinates(): [number, number] {
  const latMin = 45.735;
  const latMax = 45.778;
  const lngMin = 4.807;
  const lngMax = 4.860;
  
  return [
    randomFloat(latMin, latMax),
    randomFloat(lngMin, lngMax)
  ];
}

// Définition des zones des arrondissements (approximatives)
const arrondissementZones = [
  {
    name: 'Lyon 1er',
    bounds: {
      lat: [45.764, 45.775],
      lng: [4.813, 4.840]
    }
  },
  {
    name: 'Lyon 2e',
    bounds: {
      lat: [45.744, 45.766],
      lng: [4.813, 45.840]
    }
  },
  {
    name: 'Lyon 3e',
    bounds: {
      lat: [45.739, 45.764],
      lng: [4.838, 4.898]
    }
  },
  {
    name: 'Lyon 4e',
    bounds: {
      lat: [45.771, 45.790],
      lng: [4.809, 4.843]
    }
  },
  {
    name: 'Lyon 5e',
    bounds: {
      lat: [45.744, 45.768],
      lng: [4.772, 4.830]
    }
  },
  {
    name: 'Lyon 6e',
    bounds: {
      lat: [45.764, 45.787],
      lng: [4.839, 4.870]
    }
  },
  {
    name: 'Lyon 7e',
    bounds: {
      lat: [45.707, 45.757],
      lng: [4.819, 4.860]
    }
  },
  {
    name: 'Lyon 8e',
    bounds: {
      lat: [45.719, 45.749],
      lng: [4.848, 4.892]
    }
  },
  {
    name: 'Lyon 9e',
    bounds: {
      lat: [45.759, 45.808],
      lng: [4.784, 4.841]
    }
  }
];

function getArrondissementFromCoordinates(coordinates: [number, number]): string {
  const [lat, lng] = coordinates;
  
  for (const arrondissement of arrondissementZones) {
    const { bounds } = arrondissement;
    if (
      lat >= bounds.lat[0] && lat <= bounds.lat[1] &&
      lng >= bounds.lng[0] && lng <= bounds.lng[1]
    ) {
      return arrondissement.name;
    }
  }
  
  // Si aucun arrondissement n'est trouvé, retourner le plus proche
  return 'Lyon 1er';
}

const riskLevels = ['low', 'medium', 'high', 'critical'];

const eventTypes = [
  {
    type: 'earthquake',
    detailsTemplates: [
      'Secousse légère ressentie dans le {arrondissement}',
      'Activité sismique mineure enregistrée dans le {arrondissement}',
      'Secousse modérée dans le {arrondissement} de Lyon',
      'Tremblement de terre ressenti dans le {arrondissement}'
    ],
    getSpecificData: () => ({ 
      magnitude: randomFloat(1.5, 6.0)
    })
  },
  {
    type: 'tsunami',
    detailsTemplates: [
      'Alerte tsunami sur le Rhône dans le {arrondissement}',
      'Montée des eaux observée dans le {arrondissement}',
      'Risque d\'inondation soudaine dans le {arrondissement}',
      'Vague anormale signalée sur la Saône près du {arrondissement}'
    ],
  },
  {
    type: 'hack',
    detailsTemplates: [
      'Intrusion informatique détectée dans les systèmes municipaux du {arrondissement}',
      'Faille de sécurité dans le réseau public du {arrondissement}',
      'Vulnérabilité critique découverte dans les équipements connectés du {arrondissement}',
      'Attaque par déni de service affectant les services en ligne du {arrondissement}'
    ],
  },
  {
    type: 'community',
    detailsTemplates: [
      'Signalement communautaire: Fissures observées sur un bâtiment du {arrondissement}'
    ],
  }
];

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function seedEvents(numEvents = 2000) {
  console.log(`Starting to seed ${numEvents} events...`);
  
  for (let i = 0; i < numEvents; i++) {
    const eventTypeConfig = getRandomElement(eventTypes);
    const coordinates = generateRandomCoordinates();
    const location = getArrondissementFromCoordinates(coordinates);
    const level = getRandomElement(riskLevels);
    
    const detailTemplate = getRandomElement(eventTypeConfig.detailsTemplates);
    const details = detailTemplate.replace('{arrondissement}', location);
    
    let event: any = {
      type: eventTypeConfig.type,
      location,
      coordinates,
      level,
      timestamp: randomRecentDate(),
      details,
    };
    
    if (eventTypeConfig.type === 'earthquake') {
      event.magnitude = randomFloat(1.5, 6.0);
    } else if (eventTypeConfig.type === 'tsunami') {
      event.magnitude = randomFloat(0.5, 3.0);
    }
    
    const { data, error } = await supabase
      .from('Events')
      .insert([event]);
    
    if (error) {
      console.error(`Error inserting event #${i+1}:`, error);
      continue;
    }
    
    console.log(`Event #${i+1} inserted:`, JSON.stringify(event, null, 2));
    
    if (i < numEvents - 1) {
      const delayMs = Math.floor(Math.random() * 19000) + 1000; // 1-20 seconds
      console.log(`Waiting ${(delayMs/1000).toFixed(1)} seconds before next insertion...`);
      await sleep(delayMs);
    }
  }
  
  console.log(`Successfully completed seeding ${numEvents} events into the database`);
}

seedEvents()
  .then(() => console.log('Seeding complete!'))
  .catch(err => console.error('Error during seeding:', err));