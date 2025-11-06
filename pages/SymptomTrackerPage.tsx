import React, { useState, useRef } from 'react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { analyzeSymptomImage } from '../services/geminiService';
import type { PhotoEntry, SymptomAIAnalysis } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import Skeleton from '../components/ui/Skeleton';

const AnalysisSkeleton: React.FC = () => (
    <div className="space-y-3">
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="pt-2">
            <Skeleton className="h-5 w-1/4" />
            <Skeleton className="h-4 w-full mt-2" />
            <Skeleton className="h-4 w-full mt-1" />
        </div>
    </div>
);

const RiskBadge: React.FC<{ risk: 'low' | 'medium' | 'high' }> = ({ risk }) => {
    const { t } = useLanguage();
    const styles = {
        low: 'bg-green-100 text-green-800',
        medium: 'bg-yellow-100 text-yellow-800',
        high: 'bg-red-100 text-red-800',
    };
    return <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${styles[risk]}`}>{t(`symptomTracker.riskLevels.${risk}`)}</span>
}


const SymptomCard: React.FC<{ entry: PhotoEntry }> = ({ entry }) => {
    const { t } = useLanguage();
    return (
        <div className="relative">
            <div className="absolute -left-10 top-1 w-4 h-4 bg-primary-blue rounded-full border-4 border-white"></div>
            <p className="font-semibold text-slate-700">{entry.date.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p className="text-sm text-slate-500">{entry.date.toLocaleTimeString('en-IN')}</p>
            <Card className="p-4 mt-2">
                <div className="grid md:grid-cols-2 gap-4">
                    <img src={entry.imageUrl} alt={`Symptom on ${entry.date.toLocaleDateString()}`} className="rounded-lg w-full h-auto object-cover" />
                    <div>
                        <h4 className="font-semibold text-slate-800">{t('symptomTracker.aiAnalysisTitle')}</h4>
                        {entry.isLoading ? <AnalysisSkeleton /> : (
                            entry.aiAnalysis ? (
                                <div className="text-sm mt-2 space-y-3 text-slate-600">
                                    <div>
                                        <strong className="text-slate-700">{t('symptomTracker.labels.notes')}:</strong>
                                        <p>{entry.aiAnalysis.notes}</p>
                                    </div>
                                    <div>
                                        <strong className="text-slate-700">{t('symptomTracker.labels.infectionRisk')}:</strong> <RiskBadge risk={entry.aiAnalysis.infection_risk} />
                                    </div>
                                    <div>
                                        <strong className="text-slate-700">{t('symptomTracker.labels.advice')}:</strong>
                                        <ul className="list-disc list-inside">
                                            {entry.aiAnalysis.advice.map((item, i) => <li key={i}>{item}</li>)}
                                        </ul>
                                    </div>
                                </div>
                            ) : <p className="text-sm mt-2 text-red-600">{t('symptomTracker.analysisFailed')}</p>
                        )}
                        <h4 className="font-semibold text-slate-800 mt-4">{t('symptomTracker.yourNotesTitle')}</h4>
                        <p className="text-sm mt-1 text-slate-600 italic">"{entry.patientNotes || t('symptomTracker.notesPlaceholderEmpty')}"</p>
                    </div>
                </div>
            </Card>
        </div>
    );
};

const SymptomTrackerPage: React.FC = () => {
    const { t } = useLanguage();
    const [entries, setEntries] = useState<PhotoEntry[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [notes, setNotes] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setSelectedFile(file);
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleAddEntry = async () => {
        if (!selectedFile || !previewUrl) return;
        setIsAnalyzing(true);
        
        const newEntry: PhotoEntry = {
            id: Date.now(),
            date: new Date(),
            imageUrl: previewUrl,
            patientNotes: notes,
            isLoading: true,
        };
        
        setEntries(prev => [newEntry, ...prev]);
        const currentFile = selectedFile;
        const currentNotes = notes;

        setSelectedFile(null);
        setPreviewUrl(null); 
        setNotes('');
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        
        const analysis = await analyzeSymptomImage(currentFile, currentNotes);
        
        setEntries(prev => prev.map(entry => 
            entry.id === newEntry.id 
            ? { ...entry, isLoading: false, aiAnalysis: analysis || undefined }
            : entry
        ));
        setIsAnalyzing(false);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">{t('symptomTracker.title')}</h2>
            <p className="text-slate-600 mt-1">{t('symptomTracker.subtitle')}</p>
            
            <Card className="mt-6 p-4 bg-amber-50 border-l-4 border-amber-400">
                <h4 className="font-bold text-amber-800">{t('symptomTracker.disclaimerTitle')}</h4>
                <p className="text-sm text-amber-700">{t('symptomTracker.disclaimerText')}</p>
            </Card>

            <Card className="p-6 mt-8">
                <h3 className="text-lg font-bold text-slate-800 mb-4">{t('symptomTracker.addEntryTitle')}</h3>
                <div className="grid md:grid-cols-2 gap-6 items-center">
                    <div>
                        <input type="file" accept="image/*" capture="environment" onChange={handleFileChange} className="hidden" ref={fileInputRef}/>
                        <Button onClick={() => fileInputRef.current?.click()} disabled={isAnalyzing}>
                            <svg xmlns="http://www.w.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
                            {t('symptomTracker.takePhotoButton')}
                        </Button>
                        {previewUrl && (
                            <div className="mt-4">
                                <img src={previewUrl} alt="Symptom preview" className="rounded-lg max-h-48 w-auto" />
                            </div>
                        )}
                    </div>
                    <div>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={3}
                            className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-blue"
                            placeholder={t('symptomTracker.notesPlaceholder')}
                            disabled={isAnalyzing}
                        />
                         <Button onClick={handleAddEntry} disabled={!selectedFile || isAnalyzing} className="mt-2 w-full">
                            {isAnalyzing ? t('symptomTracker.analyzingButton') : t('symptomTracker.addToTimelineButton')}
                        </Button>
                    </div>
                </div>
            </Card>

            <div className="mt-12">
                <h3 className="text-xl font-bold text-slate-800 mb-4">{t('symptomTracker.timelineTitle')}</h3>
                {entries.length > 0 ? (
                     <div className="space-y-8 relative border-l-2 border-slate-200 pl-8 ml-4">
                        {entries.map(entry => <SymptomCard key={entry.id} entry={entry} />)}
                    </div>
                ) : (
                    <Card className="p-6 text-center text-slate-500">
                        {t('symptomTracker.timelineEmpty')}
                    </Card>
                )}
            </div>
        </div>
    );
};

export default SymptomTrackerPage;