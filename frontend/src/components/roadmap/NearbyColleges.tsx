import { useState, useEffect, useCallback } from 'react';
import {
    MapPin,
    Navigation,
    Globe,
    Award,
    Building2,
    Loader2,
    AlertCircle,
    ChevronDown,
    Search
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
}

interface NearbyCollegesProps {
    specialization: string;
}

export function NearbyColleges({ specialization }: NearbyCollegesProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [colleges, setColleges] = useState<College[]>([]);
    const [locationError, setLocationError] = useState<string | null>(null);
    const [manualCity, setManualCity] = useState('');
    const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);

    const fetchColleges = useCallback(async (lat: number, lon: number) => {
        setLoading(true);
        try {
            const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const response = await fetch(`${baseUrl}/api/colleges/nearby?lat=${lat}&lon=${lon}&specialization=${encodeURIComponent(specialization)}`);
            const data = await response.json();

            if (data.success) {
                setColleges(data.colleges);
            } else {
                toast.error('Failed to fetch nearby colleges');
            }
        } catch (error) {
            console.error('Error fetching colleges:', error);
            toast.error('Connection error while fetching colleges');
        } finally {
            setLoading(false);
        }
    }, [specialization]);

    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            setLocationError('Geolocation is not supported by your browser');
            return;
        }

        setLoading(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setLocation({ lat: latitude, lon: longitude });
                setLocationError(null);
                fetchColleges(latitude, longitude);
            },
            (error) => {
                console.error('Geolocation error:', error);
                setLoading(false);
                if (error.code === 1) {
                    setLocationError('Enable location to explore nearby colleges');
                } else {
                    setLocationError('Failed to detect location. Please try manual input.');
                }
            }
        );
    };

    const handleManualSearch = async () => {
        if (!manualCity.trim()) {
            toast.error('Please enter a city name');
            return;
        }

        setLoading(true);
        try {
            // In a real app, we'd geocode the city name. 
            // For now, we'll assume a fallback behavior or just show a message.
            // Since geocoding requires an API key (like Google/Mapbox), 
            // we'll simulate finding the city or just inform the user.
            toast.info(`Searching for colleges in ${manualCity}...`);

            // Placeholder: Ideally call a geocoding API here or search colleges by city
            // For this implementation, we'll try to fetch using dummy coordinates 
            // or just inform that we need GPS for accurate distance.

            // Fallback: search by city directly from backend if implemented
            const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const response = await fetch(`${baseUrl}/api/colleges?city=${encodeURIComponent(manualCity)}`);
            const data = await response.json();

            if (data.success) {
                // If we don't have user coordinates, distance will be 0 or null
                setColleges(data.colleges.filter((c: any) => c.coursesOffered.includes(specialization)));
                setLocationError(null);
            }
        } catch (error) {
            toast.error('Manual search failed');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen && !location && !manualCity) {
            handleGetLocation();
        }
    }, [isOpen]);

    return (
        <Card className="border-primary/20 bg-primary/5 overflow-hidden transition-all duration-300">
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <CollapsibleTrigger asChild>
                    <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-primary/10 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                <MapPin className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-bold text-foreground">📍 Nearby Colleges Offering This Specialization</h3>
                                <p className="text-xs text-muted-foreground">Find physical campuses near you for {specialization}</p>
                            </div>
                        </div>
                        <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    </div>
                </CollapsibleTrigger>

                <CollapsibleContent>
                    <div className="p-4 pt-0 space-y-4">
                        <hr className="border-primary/10 mb-4" />

                        {locationError && (
                            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex flex-col gap-3">
                                <div className="flex items-center gap-2 text-destructive">
                                    <AlertCircle className="w-4 h-4" />
                                    <p className="text-sm font-medium">{locationError}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Or enter city name manually..."
                                        value={manualCity}
                                        onChange={(e) => setManualCity(e.target.value)}
                                        className="bg-background"
                                    />
                                    <Button size="sm" onClick={handleManualSearch}>
                                        <Search className="w-4 h-4 mr-2" /> Search
                                    </Button>
                                </div>
                            </div>
                        )}

                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-10">
                                <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
                                <p className="text-sm text-muted-foreground">Searching for colleges near you...</p>
                            </div>
                        ) : colleges.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {colleges.map((college) => (
                                    <Card key={college.id} className="border-border bg-background hover:shadow-md transition-shadow group">
                                        <CardContent className="p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">
                                                    {college.collegeName}
                                                </h4>
                                                <Badge variant="secondary" className="flex items-center gap-1">
                                                    <Navigation className="w-3 h-3" />
                                                    {college.distance ? `${college.distance} km` : college.city}
                                                </Badge>
                                            </div>

                                            <div className="space-y-2 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-4 h-4 text-primary/60" />
                                                    {college.address}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Award className="w-4 h-4 text-amber-500/60" />
                                                    Rating: {college.rating}/5.0
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Building2 className="w-4 h-4 text-blue-500/60" />
                                                    {college.coursesOffered.join(', ')}
                                                </div>
                                            </div>

                                            <div className="mt-4 flex gap-2">
                                                <Button variant="outline" size="sm" className="w-full text-xs" asChild>
                                                    <a href={college.website} target="_blank" rel="noopener noreferrer">
                                                        <Globe className="w-3 h-3 mr-2" /> Website
                                                    </a>
                                                </Button>
                                                <Button size="sm" className="w-full text-xs">
                                                    View Details
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : !loading && (
                            <div className="text-center py-10 bg-muted/30 rounded-lg">
                                <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-2 opacity-50" />
                                <p className="text-muted-foreground">No nearby colleges found for this specialization.</p>
                                <Button variant="link" onClick={handleGetLocation} className="text-primary mt-2">
                                    Try Refreshing Location
                                </Button>
                            </div>
                        )}

                        <p className="text-[10px] text-center text-muted-foreground italic">
                            Distance is calculated via Haversine formula based on your current GPS coordinates.
                        </p>
                    </div>
                </CollapsibleContent>
            </Collapsible>
        </Card>
    );
}
