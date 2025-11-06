import React, { useState } from 'react';
import type { TreatmentPlan } from '../types';
import { generateTreatmentPlan } from '../services/geminiService';
import useVoiceRecognition from '../hooks/useVoiceRecognition';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Skeleton from '../components/ui/Skeleton';
import { useLanguage } from '../i18n/LanguageContext';

const TreatmentPlanDisplay: React.FC<{ plan: TreatmentPlan }> = ({ plan }) => (
    <Card className="p-6 mt-8 space-y-6">
        <div>
            <h3 className="text-lg font-bold text-slate-800">AI-Generated Suggestion</h3>
            <p className="text-sm text-slate-600 mt-1">{plan.diagnosis_suggestion}</p>
            <p className="text-xs text-amber-700 bg-amber-100 p-2 rounded-md mt-2">
                <strong>Disclaimer:</strong> This is an AI-generated suggestion, not a medical diagnosis. Please consult a qualified doctor.
            </p>
        </div>

        <div className="border-t border-slate-200 pt-4">
            <h4 className="font-semibold">Recommended Tests</h4>
            {plan.tests.length > 0 ? (
                <ul className="mt-2 space-y-2">
                    {plan.tests.map((test, i) => (
                        <li key={i} className="text-sm p-3 bg-slate-50 rounded-lg">
                            <div className="flex justify-between font-medium">
                                <span>{test.name} ({test.lab})</span>
                                <span className="font-bold">₹{test.cost}</span>
                            </div>
                            <p className="text-slate-600 text-xs mt-1">{test.why_needed}</p>
                        </li>
                    ))}
                </ul>
            ) : <p className="text-sm text-slate-500 mt-2">No specific tests recommended at this budget.</p>}
        </div>

        <div className="border-t border-slate-200 pt-4">
            <h4 className="font-semibold">Suggested Medicines</h4>
            <ul className="mt-2 space-y-2">
                {plan.medicines.map((med, i) => (
                    <li key={i} className="text-sm p-3 bg-slate-50 rounded-lg">
                        <p className="font-medium">{med.generic_name} {med.dosage}</p>
                        <p className="text-slate-600 text-xs mt-1">{med.frequency} for {med.duration}</p>
                        <div className="text-xs mt-2">
                            Options: {med.brand_options.map(b => `${b.name} (₹${b.price})`).join(', ')}
                        </div>
                    </li>
                ))}
            </ul>
        </div>

        <div className="border-t border-slate-200 pt-4">
            <h4 className="font-semibold">Consultation</h4>
            <div className="flex justify-between text-sm mt-2 p-3 bg-slate-50 rounded-lg">
                <span className="font-medium">{plan.consultation.type}</span>
                <span className="font-bold">₹{plan.consultation.cost}</span>
            </div>
        </div>

        <div className="border-t border-slate-200 pt-4 bg-blue-50 p-4 rounded-lg">
            <div className="flex justify-between items-center text-lg font-bold text-primary-blue">
                <span>Estimated Total</span>
                <span>₹{plan.total_cost}</span>
            </div>
            <div className="flex justify-between items-center text-sm font-semibold text-slate-700 mt-1">
                <span>Remaining Budget</span>
                <span>₹{plan.remaining_budget}</span>
            </div>
        </div>
        
        <div className="border-t border-slate-200 pt-4">
             <h4 className="font-semibold text-accent-red">Important Follow-up</h4>
             <p className="text-sm text-slate-700 mt-2 p-3 bg-red-50 border-l-4 border-accent-red rounded-r-lg">{plan.follow_up_recommendation}</p>
        </div>
    </Card>
);

const LoadingSkeleton = () => (
    <Card className="p-6 mt-8 space-y-6">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="border-t border-slate-200 pt-4">
             <Skeleton className="h-6 w-1/3 mb-4" />
             <Skeleton className="h-16 w-full" />
        </div>
        <div className="border-t border-slate-200 pt-4">
             <Skeleton className="h-6 w-1/3 mb-4" />
             <Skeleton className="h-16 w-full" />
        </div>
    </Card>
);


const BudgetPlannerPage: React.FC = () => {
  const { t, locale } = useLanguage();
  const [budget, setBudget] = useState(5000);
  const [treatmentPlan, setTreatmentPlan] = useState<TreatmentPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const langCode = locale === 'hi' ? 'hi-IN' : 'en-IN';
  const { text, setText, isListening, startListening, stopListening, hasRecognitionSupport } = useVoiceRecognition(langCode);
  
  const budgetOptions = [1000, 5000, 10000, 50000];

  const handleSubmit = async () => {
    if (!text.trim()) {
        setError(t('budgetPlanner.errorSymptom'));
        return;
    }
    setError(null);
    setIsLoading(true);
    setTreatmentPlan(null);
    const plan = await generateTreatmentPlan(text, budget);
    if(plan) {
        setTreatmentPlan(plan);
    } else {
        setError(t('budgetPlanner.errorGenerate'));
    }
    setIsLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-bold text-slate-900">{t('budgetPlanner.title')}</h2>
      <p className="text-slate-600 mt-1">{t('budgetPlanner.subtitle')}</p>

      <Card className="p-6 mt-8">
        <div className="space-y-6">
          <div>
            <label className="block text-lg font-semibold text-slate-700 mb-2">{t('budgetPlanner.budgetLabel')}</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {budgetOptions.map(option => (
                <button key={option} onClick={() => setBudget(option)} className={`p-3 rounded-lg border-2 transition-colors ${budget === option ? 'bg-primary-blue border-primary-blue text-white font-bold' : 'bg-white border-slate-300 hover:border-primary-blue'}`}>
                  ₹{option.toLocaleString('en-IN')}
                </button>
              ))}
            </div>
            <div className="mt-4">
                <input type="range" min="500" max="100000" step="500" value={budget} onChange={(e) => setBudget(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-blue" />
                <div className="text-center font-bold text-primary-blue text-lg mt-2">{t('budgetPlanner.selectedBudget', { budget: budget.toLocaleString('en-IN') })}</div>
            </div>
          </div>

          <div>
            <label htmlFor="symptoms" className="block text-lg font-semibold text-slate-700 mb-2">{t('budgetPlanner.symptomsLabel')}</label>
            <div className="relative">
              <textarea
                id="symptoms"
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={4}
                className="w-full p-4 pr-16 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-blue focus:border-primary-blue transition-colors"
                placeholder={t('budgetPlanner.symptomsPlaceholder')}
              />
              {hasRecognitionSupport && (
                <button
                  onClick={isListening ? stopListening : startListening}
                  className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-primary-blue text-white hover:bg-blue-700'}`}
                  aria-label={isListening ? t('budgetPlanner.voiceListenStop') : t('budgetPlanner.voiceListenStart')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="23"/><line x1="8" x2="16" y1="23" y2="23"/></svg>
                </button>
              )}
            </div>
          </div>
          
          <Button onClick={handleSubmit} disabled={isLoading} size="lg" className="w-full">
            {isLoading ? t('budgetPlanner.generatingButton') : t('budgetPlanner.generateButton')}
          </Button>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </div>
      </Card>

      {isLoading && <LoadingSkeleton />}
      {treatmentPlan && <TreatmentPlanDisplay plan={treatmentPlan} />}
    </div>
  );
};

export default BudgetPlannerPage;