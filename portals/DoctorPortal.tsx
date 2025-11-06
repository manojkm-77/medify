
import React, { useState, useCallback } from 'react';
import { DOCTOR_NAV_ITEMS } from '../constants';
import type { Page } from '../types';
import Header from '../components/layout/Header';
import BottomNav from '../components/layout/BottomNav';
import DoctorDashboardPage from '../pages/doctor/DoctorDashboardPage';
import AIPrescriptionPage from '../pages/doctor/AIPrescriptionPage';
import FollowUpTrackerPage from '../pages/doctor/FollowUpTrackerPage';
import PlaceholderPage from '../pages/PlaceholderPage';

interface DoctorPortalProps {
    onLogout: () => void;
}

const DoctorPortal: React.FC<DoctorPortalProps> = ({ onLogout }) => {
  const [activePage, setActivePage] = useState<Page>('Doctor Dashboard');

  const renderPage = useCallback(() => {
    switch (activePage) {
      case 'Doctor Dashboard':
        return <DoctorDashboardPage setActivePage={setActivePage} />;
      case 'AI Prescription':
        return <AIPrescriptionPage />;
      case 'Follow-ups':
        return <FollowUpTrackerPage />;
      case 'Profile':
        return <PlaceholderPage title="Profile Settings" />;
      default:
        return <DoctorDashboardPage setActivePage={setActivePage} />;
    }
  }, [activePage]);

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800">
      <Header onLogout={onLogout} userRole="doctor" />
      <main className="pb-24 pt-16 md:pt-20">
        <div className="container mx-auto px-4 py-4 md:py-8">
          {renderPage()}
        </div>
      </main>
      <BottomNav activePage={activePage} setActivePage={setActivePage} navItems={DOCTOR_NAV_ITEMS.filter(item => item.showInNav)} />
    </div>
  );
};

export default DoctorPortal;
