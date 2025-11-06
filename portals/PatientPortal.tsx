
import React, { useState, useCallback } from 'react';
import { NAV_ITEMS } from '../constants';
import type { Page } from '../types';
import Header from '../components/layout/Header';
import BottomNav from '../components/layout/BottomNav';
import DashboardPage from '../pages/DashboardPage';
import BudgetPlannerPage from '../pages/BudgetPlannerPage';
import SymptomTrackerPage from '../pages/SymptomTrackerPage';
import BedFinderPage from '../pages/BedFinderPage';
import MedicineCheckerPage from '../pages/MedicineCheckerPage';
import MedicalRecordsPage from '../pages/MedicalRecordsPage';
import PlaceholderPage from '../pages/PlaceholderPage';

interface PatientPortalProps {
    onLogout: () => void;
}

const PatientPortal: React.FC<PatientPortalProps> = ({ onLogout }) => {
  const [activePage, setActivePage] = useState<Page>('Dashboard');

  const renderPage = useCallback(() => {
    switch (activePage) {
      case 'Dashboard':
        return <DashboardPage setActivePage={setActivePage} />;
      case 'Budget Planner':
        return <BudgetPlannerPage />;
      case 'Symptom Tracker':
        return <SymptomTrackerPage />;
      case 'Bed Finder':
        return <BedFinderPage />;
      case 'Medicine Checker':
        return <MedicineCheckerPage />;
      case 'Medical Records':
        return <MedicalRecordsPage />;
      case 'Appointments':
        return <PlaceholderPage title="Appointments" />;
      case 'Insurance Validator':
        return <PlaceholderPage title="Insurance Validator" />;
      case 'Follow-up Center':
        return <PlaceholderPage title="Follow-up Center" />;
      case 'Profile':
        return <PlaceholderPage title="Profile Settings" />;
      default:
        return <DashboardPage setActivePage={setActivePage} />;
    }
  }, [activePage]);

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800">
      <Header onLogout={onLogout} userRole="patient" />
      <main className="pb-24 pt-16 md:pt-20">
        <div className="container mx-auto px-4 py-4 md:py-8">
          {renderPage()}
        </div>
      </main>
      <BottomNav activePage={activePage} setActivePage={setActivePage} navItems={NAV_ITEMS.filter(item => item.showInNav)} />
    </div>
  );
};

export default PatientPortal;
