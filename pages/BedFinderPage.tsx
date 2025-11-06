import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { findHospitals } from '../services/geminiService';
import type { GenerateContentResponse } from '@google/genai';
import Skeleton from '../components/ui/Skeleton';

interface Hospital {
    name: string;
    bedStatusText: string;
    mapsUri?: string;
    mapsTitle?: string;
}

const BedFinderPage: React.FC = () => {
    const [hospitals, setHospitals] = useState<Hospital[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [location, setLocation] = useState<{lat: number, lon: number} | null>(null);

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude
                    });
                },
                () => {
                    setError("Could not get your location. Please enable location services in your browser.");
                }
            );
        } else {
            setError("Geolocation is not supported by your browser.");
        }
    }, []);
    
    const handleSearch = async () => {
        if (!location) {
            setError("Location not available. Cannot search for hospitals.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setHospitals([]);

        const response = await findHospitals(location.lat, location.lon);

        if (response) {
            parseGeminiResponse(response);
        } else {
            setError("Failed to fetch hospital data. Please try again later.");
        }

        setIsLoading(false);
    };

    const parseGeminiResponse = (response: GenerateContentResponse) => {
        const fullText = response.text;
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        
        // Simple parser based on markdown list format assumption
        const hospitalBlocks = fullText.split(/\n\s*(?=\*|\-)/).filter(block => block.trim().startsWith('*') || block.trim().startsWith('-'));
        
        const parsedHospitals: Hospital[] = hospitalBlocks.map((block, index) => {
            const nameMatch = block.match(/\*\*(.*?)\*\*/);
            const name = nameMatch ? nameMatch[1] : `Hospital ${index + 1}`;
            
            const correspondingChunk = groundingChunks.find(chunk => chunk.maps && chunk.maps.title.includes(name.split(',')[0]));

            return {
                name: name,
                bedStatusText: block.replace(`**${name}**`, '').replace(/[*-]/g, '').trim(),
                mapsUri: correspondingChunk?.maps?.uri,
                mapsTitle: correspondingChunk?.maps?.title,
            };
        });

        setHospitals(parsedHospitals);
    };
    
    const LoadingSkeleton = () => (
        <div className="mt-8 space-y-4">
            {[...Array(3)].map((_, i) => (
                <Card key={i} className="p-4 md:p-6">
                    <div className="flex gap-4">
                        <div className="flex-grow space-y-2">
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                        </div>
                        <div className="w-24">
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Real-Time Bed Finder</h2>
            <p className="text-slate-600 mt-1">Find available hospital beds near your location.</p>
            
            <Card className="p-4 mt-8">
                 <Button onClick={handleSearch} disabled={isLoading || !location} className="w-full" size="lg">
                    {isLoading ? "Searching..." : "Find Beds Nearby"}
                </Button>
                {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
            </Card>

            {isLoading && <LoadingSkeleton />}

            {!isLoading && hospitals.length > 0 && (
                <div className="mt-8 space-y-4">
                     <div className="p-3 bg-amber-50 border-l-4 border-amber-400 text-amber-800 rounded-r-md">
                        <p className="text-sm font-semibold">Disclaimer: Bed availability is illustrative for demo purposes and not real-time data. Please call hospitals to confirm.</p>
                    </div>
                    {hospitals.map((hospital, index) => (
                        <Card key={index} className="p-4 md:p-6">
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="md:col-span-2">
                                    <h3 className="text-lg font-bold text-slate-800">{hospital.name}</h3>
                                    <p className="text-sm text-slate-600 whitespace-pre-wrap">{hospital.bedStatusText}</p>
                                </div>
                                <div className="flex flex-col items-start md:items-end justify-center">
                                    {hospital.mapsUri && (
                                        <a 
                                            href={hospital.mapsUri} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="inline-block"
                                        >
                                            <Button size="sm">
                                                View on Map
                                            </Button>
                                        </a>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
             {!isLoading && hospitals.length === 0 && !error && (
                 <Card className="p-8 text-center mt-8 border-2 border-dashed border-slate-300">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                         <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                    </div>
                    <h3 className="font-bold text-slate-700 mt-4">Ready to find a hospital?</h3>
                    <p className="text-sm text-slate-500 mt-1">Click the "Find Beds Nearby" button to search.</p>
                 </Card>
             )}
        </div>
    );
};

export default BedFinderPage;