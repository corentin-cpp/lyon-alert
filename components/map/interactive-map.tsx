'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, AlertTriangle, Droplets, Compass, ZoomIn, ZoomOut, Users, Layers, MessageCircle, Skull } from 'lucide-react';
import { MapContainer, TileLayer, GeoJSON, Marker as LeafletMarker, Popup } from 'react-leaflet';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import arrondissementsData from '@/data/arrondissements-lyon.json';
import { createClient } from '@supabase/supabase-js';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
	iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
	iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
	shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.NEXT_PUBLIC_SUPABASE_KEY!
);

type Marker = {
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
};

interface MapProps {
	filterType: string | null;
}

export default function InteractiveMap({ filterType }: MapProps) {
	const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null);
	const [selectedZone, setSelectedZone] = useState<{ nom: string; color: string } | null>(null);
	const [markers, setMarkers] = useState<Marker[]>([]);
	const [zoomLevel, setZoomLevel] = useState(12);
	const [showRiskZones, setShowRiskZones] = useState(true);
	const [showEarthquake, setShowEarthquake] = useState(true);
	const [showTsunami, setShowTsunami] = useState(true);
	const [showCommunity, setShowCommunity] = useState(true);
	const [showHack, setShowHack] = useState(true);

	useEffect(() => {
		if (filterType === 'earthquake') {
			setShowEarthquake(true);
			setShowTsunami(false);
			setShowCommunity(false);
			setShowHack(false);
		} else if (filterType === 'tsunami') {
			setShowEarthquake(false);
			setShowTsunami(true);
			setShowCommunity(false);
			setShowHack(false);
		} else if (filterType === 'hack') {
			setShowEarthquake(false);
			setShowTsunami(false);
			setShowCommunity(false);
			setShowHack(true);
		} else {
			setShowEarthquake(true);
			setShowTsunami(true);
			setShowCommunity(true);
			setShowHack(true);
		}
	}, [filterType]);

	useEffect(() => {
		const fetchMarkers = async () => {
			const { data, error } = await supabase.from('Events').select('*').limit(1000);
			if (error) {
				console.error('Erreur Supabase:', error);
				return;
			}
			const parsed = data.map((event: any): Marker => ({
				id: event.id,
				type: event.type,
				location: event.location,
				coordinates: [event.coordinates[0], event.coordinates[1]],
				level: event.level,
				timestamp: event.timestamp,
				details: event.details,
				magnitude: event.magnitude ?? undefined,
				waterLevel: event.waterLevel ?? undefined,
				reportCount: event.reportCount ?? undefined,
			}));
			setMarkers(parsed);
		};
		fetchMarkers();
	}, []);

	const filteredMarkers = markers.filter((marker) => {
		if (marker.type === 'earthquake' && !showEarthquake) return false;
		if (marker.type === 'tsunami' && !showTsunami) return false;
		if (marker.type === 'community' && !showCommunity) return false;
		if (marker.type === 'hack' && !showHack) return false;
		return true;
	});

	const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 1, 18));
	const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 1, 10));
	const handleResetView = () => setZoomLevel(12);

	const formatTime = (timestamp: string) => {
		const date = new Date(timestamp);
		return date.toLocaleString('fr-FR', {
			day: '2-digit',
			month: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	const onEachFeature = (feature: any, layer: any) => {
		const arrondissement = feature?.properties?.nom;
		let zoneColor = '#3388ff'; // bleu par défaut

		if (arrondissement === 'Lyon 9e Arrondissement' || arrondissement === 'Lyon 5e Arrondissement') {
			zoneColor = '#f97316'; // orange
		} else if (arrondissement === 'Lyon 4e Arrondissement' || 
				  arrondissement === 'Lyon 1er Arrondissement' || 
				  arrondissement === 'Lyon 2e Arrondissement') {
			zoneColor = '#4ade80'; // vert
		}

		layer.on({
			mouseover: (e: any) => {
				const layer = e.target;
				layer.setStyle({
					weight: 2,
					color: '#666',
					dashArray: '',
					fillOpacity: 0.7,
				});
			},
			mouseout: (e: any) => {
				const layer = e.target;
				layer.setStyle({
					weight: 1,
					color: '#666',
					dashArray: '',
					fillOpacity: 0.5,
				});
			},
			click: () => {
				setSelectedZone({
					nom: arrondissement,
					color: zoneColor
				});
			}
		});
	};

	const getMarkerIcon = (type: string) => {
		const iconOptions = {
			iconSize: [32, 32] as [number, number],
			iconAnchor: [16, 16] as [number, number],
			popupAnchor: [0, -16] as [number, number],
		};

		if (type === 'earthquake') {
			return L.divIcon({
				...iconOptions,
				html: `<div class="text-orange-500"><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg></div>`,
				className: 'custom-icon'
			});
		} else if (type === 'tsunami') {
			return L.divIcon({
				...iconOptions,
				html: `<div class="text-blue-500"><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg></div>`,
				className: 'custom-icon'
			});
		} else if (type === 'hack') {
			return L.divIcon({
				...iconOptions,
				html: `<div class="text-blue-500"><svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" stroke-width="2.5" width="20px" fill="#BB271A"><path d="M252-96v-163l-24.5-13Q203-285 174-315.5T120.5-398Q96-450 96-528q0-145 110.5-240.5T480-864q163 0 273.5 95.5T864-528q0 78-24.5 130T786-315.5Q757-285 732.5-272L708-259v163H252Zm72-72h48v-72h72v72h72v-72h72v72h48v-139l24.5-7.5q24.5-7.5 53.5-31t53.5-67Q792-456 792-528q0-114-89-189t-223-75q-134 0-223 75t-89 189q0 72 24 115.5t53.5 67q29.5 23.5 54 31L324-307v139Zm96-192h120l-60-120-60 120Zm-83.79-96Q366-456 387-477.21t21-51Q408-558 386.79-579t-51-21Q306-600 285-578.79t-21 51Q264-498 285.21-477t51 21Zm288 0Q654-456 675-477.21t21-51Q696-558 674.79-579t-51-21Q594-600 573-578.79t-21 51Q552-498 573.21-477t51 21ZM480-168Z"/></svg></div>`,
				className: 'custom-icon'
			});
		} else {
			return L.divIcon({
				...iconOptions,
				html: `<div class="text-primary"><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg></div>`,
				className: 'custom-icon'
			});
		}
	};

	return (
		<Card className="w-full h-[70vh] relative overflow-hidden">
			{/* Map Controls */}
			<div className="absolute top-4 right-4 z-20 bg-background/90 backdrop-blur-sm rounded-lg shadow-md">
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
						variant={showRiskZones ? 'secondary' : 'outline'}
						size="icon"
						onClick={() => setShowRiskZones(!showRiskZones)}
						title="Afficher/masquer les zones de risque"
					>
						<Layers className="h-4 w-4" />
					</Button>
				</div>
			</div>

			{/* Map container */}
			<MapContainer center={[45.75, 4.85]} zoom={zoomLevel} style={{ height: '100%', width: '100%', position: 'relative', zIndex: 0 }}>
				<TileLayer
					url={`https://api.mapbox.com/styles/v1/mapbox/light-v11/tiles/{z}/{x}/{y}?access_token=${process.env.NEXT_PUBLIC_MAPBOX_SK}`}
					attribution='© <a href="https://www.mapbox.com/about/maps/">Mapbox</a>'
				/>
				{showRiskZones && (
					<GeoJSON
						data={arrondissementsData}
						style={(feature) => {
							const arrondissement = feature?.properties?.nom;
							let fillColor = '#3388ff'; // bleu par défaut

							if (arrondissement === 'Lyon 9e Arrondissement' || arrondissement === 'Lyon 5e Arrondissement') {
								fillColor = '#f97316'; // orange
							} else if (arrondissement === 'Lyon 4e Arrondissement' || 
										arrondissement === 'Lyon 1er Arrondissement' || 
										arrondissement === 'Lyon 2e Arrondissement') {
								fillColor = '#4ade80'; // vert
							} else if (arrondissement === 'Lyon 6e Arrondissement' || 
										arrondissement === 'Lyon 3e Arrondissement' || 
										arrondissement === 'Lyon 8e Arrondissement' || 
										arrondissement === 'Lyon 7e Arrondissement') {
								fillColor = '#3388ff'; // bleu
							}

							return {
								fillColor,
								weight: 1,
								opacity: 1,
								color: '#666',
								fillOpacity: 0.5,
							};
						}}
						onEachFeature={onEachFeature}
					/>
				)}

				{filteredMarkers.map((marker) => (
					<LeafletMarker key={marker.id} position={marker.coordinates} icon={getMarkerIcon(marker.type)}>
						<Popup>
							<div className="w-80 p-0">
								<div className={cn(
									"px-4 py-3",
									marker.type === 'earthquake' ? "bg-orange-500/10" : 
									marker.type === 'tsunami' ? "bg-blue-500/10" : 
									marker.type === 'hack' ? "bg-red-500/10" :
									"bg-primary/10"
								)}>
									<div className="flex items-center justify-between">
										<h3 className="font-medium flex items-center gap-1">
											{marker.type === 'earthquake' && <AlertTriangle className="h-4 w-4 text-orange-500" />}
											{marker.type === 'tsunami' && <Droplets className="h-4 w-4 text-blue-500" />}
											{marker.type === 'hack' && <Skull className="h-4 w-4 text-red-500" />}
											{marker.type === 'community' && <Users className="h-4 w-4 text-primary" />}
											{marker.type === 'earthquake' && 'Séisme'}
											{marker.type === 'tsunami' && 'Tsunami'}
											{marker.type === 'hack' && 'Cyber-attaque'}
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
							</div>
						</Popup>
					</LeafletMarker>
				))}
			</MapContainer>

			{/* Zone Dialog */}
			<Dialog open={!!selectedZone} onOpenChange={() => setSelectedZone(null)}>
				<DialogContent className="sm:max-w-[425px] z-50">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							<div 
								className="w-3 h-3 rounded-full" 
								style={{ backgroundColor: selectedZone?.color }}
							/>
							{selectedZone?.nom}
						</DialogTitle>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="space-y-2">
							<h4 className="font-medium">Statistiques de la zone</h4>
							<div className="grid grid-cols-2 gap-2">
								<div className="p-3 rounded-lg bg-orange-500/10">
									<div className="text-sm font-medium text-orange-500">Séismes</div>
									<div className="text-2xl font-bold">{markers.filter(m => m.type === 'earthquake' && m.location.includes(selectedZone?.nom.split(' ')[1] || '')).length}</div>
								</div>
								<div className="p-3 rounded-lg bg-blue-500/10">
									<div className="text-sm font-medium text-blue-500">Tsunamis</div>
									<div className="text-2xl font-bold">{markers.filter(m => m.type === 'tsunami' && m.location.includes(selectedZone?.nom.split(' ')[1] || '')).length}</div>
								</div>
								<div className="p-3 rounded-lg bg-red-500/10">
									<div className="text-sm font-medium text-red-500">Cyber-attaques</div>
									<div className="text-2xl font-bold">{markers.filter(m => m.type === 'hack' && m.location.includes(selectedZone?.nom.split(' ')[1] || '')).length}</div>
								</div>
							</div>
						</div>
						<div className="space-y-2">
							<h4 className="font-medium">Derniers événements</h4>
							<div className="space-y-2">
								{markers
									.filter(m => m.location.includes(selectedZone?.nom.split(' ')[1] || ''))
									.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
									.slice(0, 3)
									.map(marker => (
										<div key={marker.id} className="p-3 rounded-lg bg-muted">
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-2">
													{marker.type === 'earthquake' && <AlertTriangle className="h-4 w-4 text-orange-500" />}
													{marker.type === 'tsunami' && <Droplets className="h-4 w-4 text-blue-500" />}
													{marker.type === 'hack' && <Skull className="h-4 w-4 text-red-500" />}
													{marker.type === 'community' && <Users className="h-4 w-4 text-primary" />}
													<span className="text-sm font-medium">{marker.location}</span>
												</div>
												<Badge variant="outline">{formatTime(marker.timestamp)}</Badge>
											</div>
										</div>
									))}
							</div>
						</div>
					</div>
					<div className="flex justify-end">
						<Button asChild>
							<a href={`/chat/${selectedZone?.nom.split(' ')[1].replace(/[^0-9]/g, '')}`}>
								<MessageCircle className="mr-2 h-4 w-4" />
								Accéder au chat
							</a>
						</Button>
					</div>
				</DialogContent>
			</Dialog>
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