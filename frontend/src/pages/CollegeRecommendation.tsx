import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, MapPin, Navigation, GraduationCap, Star, Info } from 'lucide-react';
import { getMyLocation, openExternalLink } from '@/services/webApiService';
import { toast } from 'sonner';

interface College {
  id: string;
  name: string;
  location: string;
  distance: string;
  rating: number;
  specialization: string;
  website: string;
}

const MOCK_COLLEGES: College[] = [
  { id: '1', name: 'Jawaharlal Nehru Technological University', location: 'Hyderabad, TS', distance: '1.2 km', rating: 4.5, specialization: 'Engineering', website: 'https://jntuh.ac.in' },
  { id: '2', name: 'Osmania University College of Engineering', location: 'Hyderabad, TS', distance: '4.8 km', rating: 4.6, specialization: 'Engineering & Technology', website: 'https://www.uceou.edu' },
  { id: '3', name: 'IIT Hyderabad', location: 'Sangareddy, TS', distance: '25 km', rating: 4.9, specialization: 'Research & Technology', website: 'https://iith.ac.in' },
  { id: '4', name: 'Chaitanya Bharathi Institute of Technology', location: 'Gandipet, TS', distance: '12 km', rating: 4.3, specialization: 'Engineering', website: 'https://cbit.ac.in' },
];

export default function CollegeRecommendation() {
  const [loading, setLoading] = useState(false);
  const [colleges, setColleges] = useState<College[]>([]);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  const detectLocation = async () => {
    setLoading(true);
    try {
      if (navigator.geolocation) {
        const position = await getMyLocation();
        setCoords({
          // @ts-ignore - position from webApiService has coordinates
          lat: position.coords.latitude,
          // @ts-ignore
          lng: position.coords.longitude
        });
        toast.success("Location detected successfully!");
        // In a real app, we would fetch colleges based on these coordinates
        // For now, we simulate a delay and show mock data
        setTimeout(() => {
          setColleges(MOCK_COLLEGES);
          setLoading(false);
        }, 1500);
      } else {
        toast.error("Geolocation is not supported on this device.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error detecting location:", error);
      toast.error("Failed to detect location. Please enable GPS.");
      setLoading(false);
    }
  };

  const handleVisitWebsite = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <GraduationCap className="w-8 h-8 text-primary" />
              College Recommendations
            </h1>
            <p className="text-muted-foreground mt-1">
              Discover top colleges near you based on your GPS location
            </p>
          </div>
          <Button 
            onClick={detectLocation} 
            disabled={loading}
            className="gap-2"
            variant="hero"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
            {coords ? "Refresh Location" : "Detect My Location"}
          </Button>
        </div>

        {coords && (
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center gap-3 animate-slide-up">
            <MapPin className="w-5 h-5 text-primary" />
            <p className="text-sm font-medium">
              Location detected: <span className="text-primary">{coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}</span>
            </p>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="h-24 bg-muted/20"></CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div className="h-4 bg-muted/40 rounded w-3/4"></div>
                  <div className="h-4 bg-muted/40 rounded w-1/2"></div>
                  <div className="h-10 bg-muted/40 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : colleges.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up">
            {colleges.map((college) => (
              <Card key={college.id} className="group hover:shadow-xl transition-all duration-300 border-border hover:border-primary/50">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <GraduationCap className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-bold">
                      <Star className="w-3 h-3 fill-yellow-700" />
                      {college.rating}
                    </div>
                  </div>
                  <CardTitle className="mt-4 text-xl">{college.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {college.location} • {college.distance}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Info className="w-4 h-4" />
                    Focus: <span className="font-medium text-foreground">{college.specialization}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    onClick={() => handleVisitWebsite(college.website)}
                  >
                    Visit Website
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : !loading && !coords && (
          <div className="text-center py-20 bg-card rounded-2xl border border-dashed flex flex-col items-center gap-4">
            <div className="p-4 bg-secondary rounded-full">
              <MapPin className="w-12 h-12 text-muted-foreground opacity-50" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Ready to find colleges?</h3>
              <p className="text-muted-foreground max-w-sm mx-auto mt-1">
                Click the button above to detect your location and see top-rated colleges in your area.
              </p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
