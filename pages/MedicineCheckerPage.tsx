
import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';

interface Medicine {
  id: number;
  name: string;
  manufacturer: string;
  trustScore: number;
  price: number;
  tablets: number;
  details: {
    isWHOGMP: boolean;
    isCDSCOApproved: boolean;
    userRating: number;
    reviewCount: number;
    adverseReports: number;
    location: string;
    isJanAushadhi: boolean;
  };
}

const mockMedicineData: Medicine[] = [
  {
    id: 1,
    name: 'Amlong 5mg',
    manufacturer: 'Micro Labs',
    trustScore: 94,
    price: 85,
    tablets: 30,
    details: {
      isWHOGMP: true,
      isCDSCOApproved: true,
      userRating: 4.7,
      reviewCount: 2341,
      adverseReports: 2,
      location: 'Bangalore',
      isJanAushadhi: false,
    },
  },
  {
    id: 2,
    name: 'Generic Amlodipine 5mg',
    manufacturer: 'Jan Aushadhi',
    trustScore: 88,
    price: 25,
    tablets: 30,
    details: {
      isWHOGMP: true,
      isCDSCOApproved: true,
      userRating: 4.5,
      reviewCount: 1023,
      adverseReports: 0,
      location: 'Govt. Verified',
      isJanAushadhi: true,
    },
  },
  {
    id: 3,
    name: 'Amlo-X 5mg',
    manufacturer: 'Unknown Pharma',
    trustScore: 62,
    price: 35,
    tablets: 30,
    details: {
      isWHOGMP: false,
      isCDSCOApproved: true,
      userRating: 3.2,
      reviewCount: 89,
      adverseReports: 45,
      location: 'Location unclear',
      isJanAushadhi: false,
    },
  },
];

const TrustScoreBadge: React.FC<{ score: number }> = ({ score }) => {
  const getColor = () => {
    if (score >= 85) return 'bg-green-500 text-green-50';
    if (score >= 60) return 'bg-yellow-500 text-yellow-50';
    return 'bg-red-500 text-red-50';
  };
  return (
    <div className={`w-16 h-16 rounded-full flex flex-col items-center justify-center font-bold text-lg ${getColor()}`}>
      {score}
      <span className="text-xs font-normal">/100</span>
    </div>
  );
};

const MedicineCard: React.FC<{ medicine: Medicine }> = ({ medicine }) => {
    const pricePerTablet = (medicine.price / medicine.tablets).toFixed(2);
    
    return (
        <Card className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-shrink-0 flex items-center justify-center">
                    <TrustScoreBadge score={medicine.trustScore} />
                </div>
                <div className="flex-grow">
                    <h3 className="text-lg font-bold text-slate-800">{medicine.name}</h3>
                    <p className="text-sm text-slate-500">by {medicine.manufacturer}</p>
                    <div className="mt-2 text-xl font-bold text-primary-blue">
                        ₹{medicine.price} <span className="text-sm font-normal text-slate-600">for {medicine.tablets} tablets (₹{pricePerTablet}/tab)</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 mt-4 text-sm">
                        {medicine.details.isWHOGMP ? (
                           <div className="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-green-500"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> WHO-GMP Certified</div>
                        ) : (
                            <div className="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-red-500"><circle cx="12" cy="12" r="10"/><line x1="15" x2="9" y1="9" y2="15"/><line x1="9" x2="15" y1="9" y2="15"/></svg> No WHO-GMP Certification</div>
                        )}
                        <div className="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-green-500"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> CDSCO Approved</div>
                        <div className="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-yellow-500"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> {medicine.details.userRating}/5 ({medicine.details.reviewCount} reviews)</div>
                        {medicine.details.adverseReports > 10 ? (
                             <div className="flex items-center text-red-600"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg> {medicine.details.adverseReports} adverse reports</div>
                        ) : (
                             <div className="flex items-center text-green-600"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Low adverse reports</div>
                        )}
                    </div>
                </div>
            </div>
             {medicine.details.isJanAushadhi && (
                <div className="mt-4 p-3 bg-green-50 border-l-4 border-green-500 rounded-r-md text-green-800">
                    <p className="font-bold">Government Verified Quality</p>
                    <p className="text-sm">This is a Jan Aushadhi product, ensuring quality at an affordable price.</p>
                </div>
            )}
             {medicine.trustScore < 70 && (
                 <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded-r-md text-yellow-800">
                    <p className="font-bold">Consider Alternatives</p>
                    <p className="text-sm">This option has a lower trust score. You may want to consider higher-rated alternatives if available.</p>
                </div>
            )}
            <div className="mt-4 flex gap-2">
                {medicine.details.isJanAushadhi ? (
                    <Button className="w-full" variant="secondary">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                        Find Nearest Store
                    </Button>
                ) : (
                    <Button className="w-full">Buy Now</Button>
                )}
            </div>
        </Card>
    );
}

const LoadingState = () => (
    <div className="mt-8 space-y-4">
        {[...Array(3)].map((_, i) => (
            <Card key={i} className="p-4 md:p-6">
                 <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-shrink-0 flex items-center justify-center">
                        <Skeleton className="w-16 h-16 rounded-full" />
                    </div>
                    <div className="flex-grow space-y-2">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-5 w-1/3" />
                    </div>
                </div>
            </Card>
        ))}
    </div>
)


const MedicineCheckerPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState<Medicine[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = () => {
        if (!searchQuery.trim()) return;
        setIsLoading(true);
        setHasSearched(true);
        // Simulate API call
        setTimeout(() => {
            setResults(mockMedicineData);
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Medicine Quality Checker</h2>
            <p className="text-slate-600 mt-1">Search for a medicine to see its Trust Score, find alternatives, and compare prices.</p>

            <div className="mt-8">
                <div className="flex gap-2">
                    <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder="e.g., Amlodipine 5mg"
                        className="flex-grow"
                        icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/></svg>}
                    />
                    <Button onClick={handleSearch} disabled={isLoading}>
                        {isLoading ? '...' : 'Search'}
                    </Button>
                </div>
            </div>

            {isLoading && <LoadingState />}
            
            {!isLoading && hasSearched && (
                 <div className="mt-8 space-y-4">
                     {results.length > 0 ? (
                         <>
                            {results.sort((a,b) => b.trustScore - a.trustScore).map(med => (
                                <MedicineCard key={med.id} medicine={med} />
                            ))}
                            <Card className="p-6 bg-green-50 text-green-900">
                                <h3 className="text-lg font-bold">💰 Potential Savings!</h3>
                                <p className="mt-1">By choosing the Jan Aushadhi generic (₹25) over the leading brand (₹85), you could save <span className="font-bold">₹60 per month!</span></p>
                            </Card>
                        </>
                     ) : (
                        <Card className="p-6 text-center">
                            <h3 className="font-bold text-slate-700">No results found</h3>
                            <p className="text-sm text-slate-500">Please check the spelling or try another medicine name.</p>
                        </Card>
                     )}
                 </div>
            )}
             {!hasSearched && (
                 <Card className="p-8 text-center mt-8 border-2 border-dashed border-slate-300">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                         <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>
                    </div>
                    <h3 className="font-bold text-slate-700 mt-4">Start by searching for a medicine</h3>
                    <p className="text-sm text-slate-500 mt-1">Verify quality, compare prices, and make informed choices.</p>
                 </Card>
            )}

        </div>
    );
};

export default MedicineCheckerPage;
