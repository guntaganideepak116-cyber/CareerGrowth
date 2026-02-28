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
    ExternalLink,
    Bookmark,
    SlidersHorizontal,
    Percent,
    GraduationCap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
    coursesOffered?: string[];
    city?: string;
    type?: string;
    rankingTier?: string;
    accreditation?: string;
    location?: {
        latitude: number;
        longitude: number;
    };
    matchScore?: number;
    entranceExam?: string;
    cutoffRange?: string;
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

    // Filters & Sections
    const [filterGovtOnly, setFilterGovtOnly] = useState(false);
    const [filterDistance, setFilterDistance] = useState('all');
    const [filterTier, setFilterTier] = useState('all');
    const [activeTab, setActiveTab] = useState<'all' | 'nearest' | 'topRated'>('all');
    const [savedColleges, setSavedColleges] = useState<string[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem('user_saved_colleges');
        if (saved) setSavedColleges(JSON.parse(saved));
    }, []);

    const toggleSaveCollege = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        const updated = savedColleges.includes(id) ? savedColleges.filter(cid => cid !== id) : [...savedColleges, id];
        setSavedColleges(updated);
        localStorage.setItem('user_saved_colleges', JSON.stringify(updated));
        toast.success(savedColleges.includes(id) ? 'College removed from saved' : 'College saved successfully!');
    };

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
                            type: 'Global University',
                            rankingTier: 'Unranked',
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

            // Merge & Deduplicate
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

            // The backend already ranks by matchScore and limits to 50.
            // If we have any google colleges, we append them but keep backend prioritized
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

    const getAccreditationRank = (acc: string = "") => {
        const a = acc.toLowerCase();
        if (a.includes("a++")) return 6;
        if (a.includes("a+")) return 5;
        if (a.includes("a")) return 4;
        if (a.includes("b++")) return 3;
        if (a.includes("b")) return 2;
        return 1;
    };

    const filteredColleges = colleges.filter(c => {
        if (filterGovtOnly && !["Government", "Central University", "State University"].includes(c.type || "")) return false;
        if (filterDistance !== 'all' && (c.distance || 0) > parseInt(filterDistance)) return false;
        if (filterTier !== 'all' && c.rankingTier !== filterTier) return false;
        return true;
    }).sort((a, b) => {
        if (activeTab === 'nearest') return (a.distance || 0) - (b.distance || 0);
        if (activeTab === 'topRated') {
            const accA = getAccreditationRank(a.accreditation);
            const accB = getAccreditationRank(b.accreditation);
            if (accB !== accA) return accB - accA;
            return (b.rating || 0) - (a.rating || 0);
        }
        return (b.matchScore || 0) - (a.matchScore || 0);
    });

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

                        {/* Filters & Tabs */}
                        {colleges.length > 0 && userLocation && !loading && (
                            <div className="space-y-4">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-3 rounded-lg border bg-card/40">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <div className="flex items-center space-x-2">
                                            <Switch id="govt-mode" checked={filterGovtOnly} onCheckedChange={setFilterGovtOnly} />
                                            <label htmlFor="govt-mode" className="text-xs font-medium cursor-pointer">Govt Only</label>
                                        </div>

                                        <div className="flex items-center gap-2 border-l pl-3 ml-1">
                                            <SlidersHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
                                            <Select value={filterDistance} onValueChange={setFilterDistance}>
                                                <SelectTrigger className="h-7 w-[110px] text-xs">
                                                    <SelectValue placeholder="Distance" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">Any Distance</SelectItem>
                                                    <SelectItem value="10">&lt; 10 km</SelectItem>
                                                    <SelectItem value="50">&lt; 50 km</SelectItem>
                                                    <SelectItem value="200">&lt; 200 km</SelectItem>
                                                </SelectContent>
                                            </Select>

                                            <Select value={filterTier} onValueChange={setFilterTier}>
                                                <SelectTrigger className="h-7 w-[110px] text-xs">
                                                    <SelectValue placeholder="Ranking" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">All Tiers</SelectItem>
                                                    <SelectItem value="Top">Top Tier</SelectItem>
                                                    <SelectItem value="Tier 1">Tier 1</SelectItem>
                                                    <SelectItem value="Tier 2">Tier 2</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    {/* View Toggle */}
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

                                {/* Recommendation Tabs */}
                                <div className="flex bg-muted/30 p-1 rounded-lg w-full max-w-md mx-auto mb-2 border">
                                    <button
                                        onClick={() => setActiveTab('all')}
                                        className={`flex-1 flex items-center justify-center gap-1.5 text-xs py-1.5 rounded-md font-medium transition-colors ${activeTab === 'all' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                    >
                                        <Star className="w-3.5 h-3.5" /> Smart Match
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('nearest')}
                                        className={`flex-1 flex items-center justify-center gap-1.5 text-xs py-1.5 rounded-md font-medium transition-colors ${activeTab === 'nearest' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                    >
                                        <Navigation className="w-3.5 h-3.5" /> Best Near You
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('topRated')}
                                        className={`flex-1 flex items-center justify-center gap-1.5 text-xs py-1.5 rounded-md font-medium transition-colors ${activeTab === 'topRated' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                    >
                                        <Award className="w-3.5 h-3.5" /> Top Rated
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
                        {!loading && viewMode === 'map' && filteredColleges.length > 0 && (
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
                        {!loading && viewMode === 'list' && filteredColleges.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {filteredColleges.map((college) => {
                                    const isSaved = savedColleges.includes(college.id);
                                    return (
                                        <Card
                                            key={college.id}
                                            className={`border transition-all duration-200 hover:shadow-lg cursor-pointer group ${selectedCollege?.id === college.id ? 'border-primary shadow-md shadow-primary/10' : 'border-border hover:border-primary/40'}`}
                                            onClick={() => {
                                                setSelectedCollege(college);
                                                if (viewMode === 'list') setViewMode('map');
                                            }}
                                        >
                                            <CardContent className="p-4 relative">
                                                <button
                                                    onClick={(e) => toggleSaveCollege(e, college.id)}
                                                    className={`absolute top-3 right-3 p-1.5 rounded-full z-10 hover:bg-muted ${isSaved ? 'text-primary' : 'text-muted-foreground'}`}
                                                >
                                                    <Bookmark className="w-4 h-4" fill={isSaved ? "currentColor" : "none"} />
                                                </button>
                                                <div className="flex justify-between items-start mb-3">
                                                    <div className="flex flex-col gap-1.5 pr-2 w-11/12">
                                                        <h4 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors leading-tight pr-6">
                                                            {college.collegeName}
                                                        </h4>
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {college.type && (
                                                                <Badge variant="outline" className="text-[9px] h-4 px-1.5 py-0">
                                                                    {college.type}
                                                                </Badge>
                                                            )}
                                                            {college.rankingTier && college.rankingTier !== "Unranked" && (
                                                                <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[9px] h-4 px-1.5 py-0">
                                                                    {college.rankingTier}
                                                                </Badge>
                                                            )}
                                                            {college.matchScore && (
                                                                <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20 text-[9px] h-4 px-1.5 py-0">
                                                                    <Percent className="w-2.5 h-2.5 mr-0.5" />
                                                                    {college.matchScore.toFixed(0)} Score
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
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
                                                        <span className="line-clamp-2">{college.coursesOffered ? college.coursesOffered.join(', ') : specialization}</span>
                                                    </div>
                                                    {college.entranceExam && (
                                                        <div className="flex items-start gap-2 mt-2 pt-2 border-t border-border/50">
                                                            <GraduationCap className="w-3.5 h-3.5 text-indigo-500/60 mt-0.5 flex-shrink-0" />
                                                            <span className="line-clamp-1 font-medium text-indigo-600/90 dark:text-indigo-400">
                                                                Accepts: {college.entranceExam} {college.cutoffRange ? `(Cutoff: ${college.cutoffRange})` : ''}
                                                            </span>
                                                        </div>
                                                    )}
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
                                                        className="flex-1 text-xs h-8 gap-1.5 text-primary"
                                                        variant="secondary"
                                                    >
                                                        <Navigation className="w-3 h-3" /> {college.distance ? `${college.distance} km` : 'Near'}
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )
                                })}
                            </div>
                        )}

                        {/* Empty State Output Adjustments */}
                        {!loading && filteredColleges.length === 0 && !locationError && colleges.length > 0 && (
                            <div className="text-center py-8 bg-muted/20 rounded-xl border border-dashed border-border">
                                <SlidersHorizontal className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40" />
                                <p className="font-semibold text-foreground mb-1">No colleges match your filters</p>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Try adjusting distance, ranking, or ownership filters.
                                </p>
                                <Button variant="outline" size="sm" onClick={() => {
                                    setFilterDistance('all'); setFilterGovtOnly(false); setFilterTier('all');
                                }}>Clear Filters</Button>
                            </div>
                        )}

                        {/* Empty State */}
                        {!loading && colleges.length === 0 && !locationError && (
                            <div className="text-center py-12 bg-muted/20 rounded-xl border border-dashed border-border">
                                <Building2 className="w-14 h-14 text-muted-foreground mx-auto mb-3 opacity-40" />
                                <p className="font-semibold text-foreground mb-1">No nearby colleges found for your specialization</p>
                                <p className="text-sm text-muted-foreground mb-4 px-6">
                                    We couldn't find any institutions immediately matching "<span className="font-medium text-primary/80">{specialization}</span>" in your radius. Try expanding search radius.
                                </p>
                                <Button variant="outline" onClick={handleGetLocation} className="text-xs">
                                    <Navigation className="w-4 h-4 mr-1.5" /> Re-detect Location
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
