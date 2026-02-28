import { useState, useEffect, useCallback, useRef } from 'react';
import {
    MapPin,
    Navigation,
    Globe,
    Award,
    Building2,
    Loader2,
    AlertCircle,
    ChevronDown,
    Search,
    Map,
    List,
    Star,
    ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger
} from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface College {
    id: string;
    collegeName: string;
    distance: number;
    rating: number;
    address: string;
    website: string;
    coursesOffered: string[];
    city: string;
    location?: {
        latitude: number;
        longitude: number;
    };
}

interface NearbyCollegesProps {
    specialization: string;
}

declare global {
    interface Window {
        google: typeof google;
        initMap: () => void;
    }
}

// Load Google Maps script dynamically
function loadGoogleMapsScript(apiKey: string): Promise<void> {
    return new Promise((resolve, reject) => {
        if (window.google && window.google.maps) {
            resolve();
            return;
        }
        const existing = document.getElementById('google-maps-script');
        if (existing) {
            existing.addEventListener('load', () => resolve());
            return;
        }
        const script = document.createElement('script');
        script.id = 'google-maps-script';
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Google Maps'));
        document.head.appendChild(script);
    });
}

export function NearbyColleges({ specialization }: NearbyCollegesProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [colleges, setColleges] = useState<College[]>([]);
    const [locationError, setLocationError] = useState<string | null>(null);
    const [manualCity, setManualCity] = useState('');
    const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
    const [selectedCollege, setSelectedCollege] = useState<College | null>(null);
    const [mapsLoaded, setMapsLoaded] = useState(false);

    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<google.maps.Map | null>(null);
    const markersRef = useRef<google.maps.Marker[]>([]);
    const MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

    // Load Google Maps API once
    useEffect(() => {
        if (MAPS_API_KEY) {
            loadGoogleMapsScript(MAPS_API_KEY)
                .then(() => setMapsLoaded(true))
                .catch(err => console.error('Maps load error:', err));
        }
    }, [MAPS_API_KEY]);

    // Initialize or update map when switching to map view
    useEffect(() => {
        if (viewMode === 'map' && mapsLoaded && mapRef.current && userLocation) {
            initializeMap();
        }
    }, [viewMode, mapsLoaded, colleges, userLocation]);

    const initializeMap = () => {
        if (!mapRef.current || !userLocation || !window.google) return;

        const center = { lat: userLocation.lat, lng: userLocation.lon };

        // Create map
        const map = new window.google.maps.Map(mapRef.current, {
            center,
            zoom: 10,
            mapTypeControl: false,
            fullscreenControl: true,
            streetViewControl: false,
            styles: [
                { elementType: 'geometry', stylers: [{ color: '#1e1e2e' }] },
                { elementType: 'labels.text.fill', stylers: [{ color: '#a0aec0' }] },
                { elementType: 'labels.text.stroke', stylers: [{ color: '#1e1e2e' }] },
                { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2d3748' }] },
                { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#1a365d' }] },
                { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#2d3748' }] },
            ]
        });

        mapInstanceRef.current = map;

        // Clear existing markers
        markersRef.current.forEach(m => m.setMap(null));
        markersRef.current = [];

        // User location marker (blue pulse)
        const userMarker = new window.google.maps.Marker({
            position: center,
            map,
            title: 'Your Location',
            icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: '#6c63ff',
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 3,
            },
            zIndex: 999
        });
        markersRef.current.push(userMarker);

        // Info window for user
        const userInfoWindow = new window.google.maps.InfoWindow({
            content: `<div style="color:#000;font-weight:bold;padding:4px">📍 Your Location</div>`
        });
        userMarker.addListener('click', () => userInfoWindow.open(map, userMarker));

        // College markers
        colleges.forEach(college => {
            if (!college.location) return;

            const colPos = {
                lat: college.location.latitude,
                lng: college.location.longitude
            };

            const marker = new window.google.maps.Marker({
                position: colPos,
                map,
                title: college.collegeName,
                icon: {
                    path: window.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                    scale: 7,
                    fillColor: '#f6ad55',
                    fillOpacity: 1,
                    strokeColor: '#ffffff',
                    strokeWeight: 2,
                }
            });

            const infoWindow = new window.google.maps.InfoWindow({
                content: `
                    <div style="max-width:220px;font-family:sans-serif;">
                        <h3 style="margin:0 0 4px;font-size:14px;color:#1a202c;font-weight:bold;">${college.collegeName}</h3>
                        <p style="margin:0 0 4px;font-size:12px;color:#4a5568;">📍 ${college.address}</p>
                        <p style="margin:0 0 4px;font-size:12px;color:#4a5568;">⭐ ${college.rating}/5.0 &nbsp;•&nbsp; ${college.distance ? college.distance + ' km away' : college.city}</p>
                        <a href="${college.website}" target="_blank" style="font-size:12px;color:#6c63ff;text-decoration:none;">🌐 Visit Website →</a>
                    </div>
                `
            });

            marker.addListener('click', () => {
                // Close all info windows
                markersRef.current.forEach((_, i) => {
                    if (markersRef.current[i]) {
                        // close existing
                    }
                });
                infoWindow.open(map, marker);
                setSelectedCollege(college);
            });

            markersRef.current.push(marker);
        });
    };

    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371; // km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return parseFloat((R * c).toFixed(1));
    };

    const searchGooglePlaces = (lat: number, lon: number, keyword: string): Promise<College[]> => {
        return new Promise((resolve) => {
            if (!window.google || !window.google.maps || !window.google.maps.places) {
                return resolve([]);
            }
            
            const dummyNode = document.createElement('div');
            const service = new window.google.maps.places.PlacesService(dummyNode);
            const request = {
                location: new window.google.maps.LatLng(lat, lon),
                radius: 50000, // 50km radius
                type: 'university',
                keyword: keyword
            };

            service.nearbySearch(request, (results, status) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
                    const mapColleges: College[] = results.map(place => {
                        let distance = 0;
                        if (place.geometry?.location) {
                            distance = calculateDistance(lat, lon, place.geometry.location.lat(), place.geometry.location.lng());
                        }
                        return {
                            id: place.place_id || Math.random().toString(),
                            collegeName: place.name || 'Unknown University',
                            distance: distance,
                            rating: place.rating || 4.0,
                            address: place.vicinity || 'Address not available',
                            website: `https://www.google.com/search?q=${encodeURIComponent((place.name || '') + ' ' + (place.vicinity || ''))}`,
                            coursesOffered: [specialization], // Tag with requested specialization
                            city: place.vicinity?.split(',').pop()?.trim() || 'Local Area',
                            location: place.geometry?.location ? {
                                latitude: place.geometry.location.lat(),
                                longitude: place.geometry.location.lng()
                            } : undefined
                        };
                    });
                    resolve(mapColleges);
                } else {
                    resolve([]);
                }
            });
        });
    };

    const fetchColleges = useCallback(async (lat: number, lon: number) => {
        setLoading(true);
        try {
            // 1. Fetch curated colleges from your Firebase Database
            const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const response = await fetch(
                `${baseUrl}/api/colleges/nearby?lat=${lat}&lon=${lon}&specialization=${encodeURIComponent(specialization)}`
            );
            const data = await response.json();
            let backendColleges: College[] = data.success ? data.colleges : [];

            // 2. Fetch real-time global colleges from Google Places API
            let googleColleges: College[] = [];
            if (window.google) {
                // Shorten specialization string for better broad matching on Google Maps
                const searchKeyword = specialization.replace(/ & .*/, '').trim(); 
                googleColleges = await searchGooglePlaces(lat, lon, searchKeyword);
            }

            // 3. Merge & Deduplicate
            const allColleges = [...backendColleges];
            const existingNames = new Set(allColleges.map(c => c.collegeName.toLowerCase()));

            googleColleges.forEach(gc => {
                const isDuplicate = Array.from(existingNames).some(name => 
                    gc.collegeName.toLowerCase().includes(name) || name.includes(gc.collegeName.toLowerCase())
                );
                if (!isDuplicate) {
                    allColleges.push(gc);
                    existingNames.add(gc.collegeName.toLowerCase());
                }
            });

            // 4. Sort all by real-world distance
            allColleges.sort((a, b) => (a.distance || 0) - (b.distance || 0));

            setColleges(allColleges);
            
            if (allColleges.length === 0) {
                toast.info('No colleges found nearby. Try increasing search radius or different field.');
            }
        } catch (error) {
            console.error('Error fetching colleges:', error);
            toast.error('Connection error while fetching colleges');
        } finally {
            setLoading(false);
        }
    }, [specialization, mapsLoaded]);

    const handleGetLocation = useCallback(() => {
        if (!navigator.geolocation) {
            setLocationError('Geolocation is not supported by your browser');
            return;
        }
        setLoading(true);
        setLocationError(null);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation({ lat: latitude, lon: longitude });
                fetchColleges(latitude, longitude);
            },
            (error) => {
                setLoading(false);
                if (error.code === 1) {
                    setLocationError('Enable location to explore nearby colleges');
                } else {
                    setLocationError('Failed to detect location. Use manual city search below.');
                }
            },
            { timeout: 10000, enableHighAccuracy: true }
        );
    }, [fetchColleges]);

    const handleManualSearch = async () => {
        if (!manualCity.trim()) {
            toast.error('Please enter a city name');
            return;
        }
        if (!mapsLoaded || !window.google) {
            toast.error('Maps not loaded yet, please wait...');
            return;
        }
        setLoading(true);
        try {
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ address: manualCity + ', India' }, (results, status) => {
                if (status === 'OK' && results && results[0]) {
                    const loc = results[0].geometry.location;
                    const lat = loc.lat();
                    const lon = loc.lng();
                    setUserLocation({ lat, lon });
                    setLocationError(null);
                    toast.success(`Found: ${results[0].formatted_address}`);
                    fetchColleges(lat, lon);
                } else {
                    setLoading(false);
                    toast.error('City not found. Please try a different name.');
                }
            });
        } catch (error) {
            setLoading(false);
            toast.error('Geocoding failed');
        }
    };

    // Auto-detect location when section is opened
    useEffect(() => {
        if (isOpen && !userLocation && !locationError) {
            handleGetLocation();
        }
    }, [isOpen]);

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`w-3 h-3 ${i < Math.floor(rating) ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground'}`}
            />
        ));
    };

    return (
        <Card className="border-primary/20 overflow-hidden transition-all duration-300 shadow-md">
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <CollapsibleTrigger asChild>
                    <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-primary/5 transition-colors bg-gradient-to-r from-primary/5 via-transparent to-transparent">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shadow-sm">
                                <MapPin className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-bold text-foreground">📍 Nearby Colleges Offering This Specialization</h3>
                                <p className="text-xs text-muted-foreground">
                                    Find physical campuses near you
                                    {colleges.length > 0 && (
                                        <span className="ml-2 text-primary font-medium">• {colleges.length} found</span>
                                    )}
                                </p>
                            </div>
                        </div>
                        <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    </div>
                </CollapsibleTrigger>

                <CollapsibleContent>
                    <div className="p-4 pt-2 space-y-4 border-t border-border/50">

                        {/* Location Error / Manual Search */}
                        {locationError && (
                            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 space-y-3">
                                <div className="flex items-center gap-2 text-destructive">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                    <p className="text-sm font-medium">{locationError}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Enter city name (e.g. Hyderabad)..."
                                        value={manualCity}
                                        onChange={(e) => setManualCity(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleManualSearch()}
                                        className="bg-background"
                                    />
                                    <Button size="sm" onClick={handleManualSearch} disabled={loading}>
                                        <Search className="w-4 h-4 mr-1" /> Search
                                    </Button>
                                </div>
                                <Button variant="link" size="sm" onClick={handleGetLocation} className="text-xs p-0 h-auto text-primary">
                                    Or try GPS again
                                </Button>
                            </div>
                        )}

                        {/* View Toggle */}
                        {colleges.length > 0 && userLocation && (
                            <div className="flex items-center justify-between">
                                <p className="text-xs text-muted-foreground">
                                    📡 Real-time GPS • {colleges.length} college{colleges.length > 1 ? 's' : ''} found nearby
                                </p>
                                <div className="flex rounded-lg border border-border overflow-hidden">
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'bg-background text-muted-foreground hover:bg-muted'}`}
                                    >
                                        <List className="w-3.5 h-3.5" /> List
                                    </button>
                                    <button
                                        onClick={() => setViewMode('map')}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${viewMode === 'map' ? 'bg-primary text-primary-foreground' : 'bg-background text-muted-foreground hover:bg-muted'}`}
                                    >
                                        <Map className="w-3.5 h-3.5" /> Map
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Loading State */}
                        {loading && (
                            <div className="flex flex-col items-center justify-center py-12 gap-3">
                                <div className="relative">
                                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                                    <MapPin className="w-4 h-4 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                </div>
                                <p className="text-sm text-muted-foreground animate-pulse">
                                    Detecting your location & searching colleges...
                                </p>
                            </div>
                        )}

                        {/* MAP VIEW */}
                        {!loading && viewMode === 'map' && colleges.length > 0 && (
                            <div className="space-y-3">
                                <div
                                    ref={mapRef}
                                    className="w-full h-80 rounded-xl overflow-hidden border border-border shadow-inner"
                                    style={{ minHeight: '320px' }}
                                />
                                {selectedCollege && (
                                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 flex items-center justify-between gap-3">
                                        <div>
                                            <p className="font-semibold text-sm text-foreground">{selectedCollege.collegeName}</p>
                                            <p className="text-xs text-muted-foreground">{selectedCollege.distance ? `${selectedCollege.distance} km away` : selectedCollege.city}</p>
                                        </div>
                                        <a href={selectedCollege.website} target="_blank" rel="noopener noreferrer">
                                            <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                                                <ExternalLink className="w-3.5 h-3.5" /> Visit
                                            </Button>
                                        </a>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* LIST VIEW */}
                        {!loading && viewMode === 'list' && colleges.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {colleges.map((college) => (
                                    <Card
                                        key={college.id}
                                        className={`border transition-all duration-200 hover:shadow-lg cursor-pointer group ${selectedCollege?.id === college.id ? 'border-primary shadow-md shadow-primary/10' : 'border-border hover:border-primary/40'}`}
                                        onClick={() => {
                                            setSelectedCollege(college);
                                            if (viewMode === 'list') setViewMode('map');
                                        }}
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex justify-between items-start mb-3">
                                                <h4 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors leading-tight pr-2">
                                                    {college.collegeName}
                                                </h4>
                                                <Badge
                                                    variant="secondary"
                                                    className="flex items-center gap-1 flex-shrink-0 bg-primary/10 text-primary border-primary/20"
                                                >
                                                    <Navigation className="w-3 h-3" />
                                                    {college.distance ? `${college.distance} km` : college.city}
                                                </Badge>
                                            </div>

                                            <div className="space-y-1.5 text-xs text-muted-foreground mb-3">
                                                <div className="flex items-start gap-2">
                                                    <MapPin className="w-3.5 h-3.5 text-primary/60 mt-0.5 flex-shrink-0" />
                                                    <span className="line-clamp-1">{college.address}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex items-center gap-0.5">
                                                        {renderStars(college.rating)}
                                                    </div>
                                                    <span className="font-medium text-foreground">{college.rating}/5.0</span>
                                                </div>
                                                <div className="flex items-start gap-2">
                                                    <Building2 className="w-3.5 h-3.5 text-blue-500/60 mt-0.5 flex-shrink-0" />
                                                    <span className="line-clamp-2">{college.coursesOffered.join(', ')}</span>
                                                </div>
                                            </div>

                                            <div className="flex gap-2 mt-3">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex-1 text-xs h-8 gap-1.5"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        window.open(college.website, '_blank');
                                                    }}
                                                >
                                                    <Globe className="w-3 h-3" /> Website
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    className="flex-1 text-xs h-8 gap-1.5 bg-primary/90"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedCollege(college);
                                                        setViewMode('map');
                                                    }}
                                                >
                                                    <Map className="w-3 h-3" /> View on Map
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}

                        {/* Empty State */}
                        {!loading && colleges.length === 0 && !locationError && (
                            <div className="text-center py-12 bg-muted/20 rounded-xl border border-dashed border-border">
                                <Building2 className="w-14 h-14 text-muted-foreground mx-auto mb-3 opacity-40" />
                                <p className="font-semibold text-foreground mb-1">No nearby colleges found</p>
                                <p className="text-sm text-muted-foreground mb-4">
                                    No colleges are registered for "<span className="font-medium">{specialization}</span>" yet.
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Admin can add colleges via College Manager in the Admin Panel
                                </p>
                                <Button variant="link" onClick={handleGetLocation} className="text-primary mt-2 text-xs">
                                    Try refreshing location
                                </Button>
                            </div>
                        )}

                        {/* Footer note */}
                        {!loading && (
                            <p className="text-[10px] text-center text-muted-foreground italic">
                                🛰️ Real-time GPS + Google Maps • Haversine distance formula • Powered by browser geolocation
                            </p>
                        )}
                    </div>
                </CollapsibleContent>
            </Collapsible>
        </Card>
    );
}
