import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { PrescriptionForm } from '../../components/doctor/PrescriptionForm';
import type { Prescription } from '../../types/prescription';

const AIPrescriptionPage: React.FC = () => {
    const { t } = useLanguage();

    const handleFinalizePrescription = (prescription: Prescription) => {
        console.log("--- FINALIZED PRESCRIPTION ---");
        console.log(JSON.stringify(prescription, null, 2));
        // In a real app, you would post this JSON to your backend API
        // For example:
        // fetch('/api/prescriptions', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(prescription),
        // });
        alert(t('doctorPrescription.finalizeButton') + " clicked. See console for output.");
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">{t('doctorPrescription.title')}</h2>
            <p className="text-slate-600 mt-1">{t('doctorPrescription.subtitle')}</p>
            <div className="mt-8">
              <PrescriptionForm onSubmit={handleFinalizePrescription} />
            </div>
        </div>
    );
};

export default AIPrescriptionPage;
