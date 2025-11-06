
import React from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const MedicalRecordsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Medical Records</h2>
      <p className="text-slate-600 mt-1">Upload and manage all your health documents in one secure place.</p>
      
      <Card className="p-8 text-center mt-8 border-2 border-dashed border-slate-300">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="12" y1="18" x2="12" y2="12"/>
            <line x1="9" y1="15" x2="15" y2="15"/>
          </svg>
        </div>
        <h3 className="font-bold text-slate-700 mt-4">Upload Your First Document</h3>
        <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">Scan prescriptions, lab reports, and hospital bills to create a unified health timeline. Our AI will extract the key information for you.</p>
        <Button className="mt-6">
            Upload Document
        </Button>
      </Card>

      <div className="mt-12">
        <h3 className="text-xl font-bold text-slate-800 mb-4">Your Documents</h3>
        <Card className="p-6">
            <p className="text-slate-500 text-center">You have no documents uploaded yet.</p>
        </Card>
      </div>

    </div>
  );
};

export default MedicalRecordsPage;
