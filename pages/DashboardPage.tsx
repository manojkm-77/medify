import React from 'react';
import type { Page } from '../types';
import Card from '../components/ui/Card';
import { ICONS } from '../constants';
import { useLanguage } from '../i18n/LanguageContext';

interface DashboardPageProps {
  setActivePage: (page: Page) => void;
}

const FeatureCard: React.FC<{
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  onClick: () => void;
  getStartedText: string;
}> = ({ title, description, icon: Icon, color, onClick, getStartedText }) => (
  <Card className="p-6 flex flex-col items-start" onClick={onClick}>
    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
      <Icon className="w-7 h-7 text-white" />
    </div>
    <h3 className="text-lg font-bold mt-4 text-slate-800">{title}</h3>
    <p className="text-sm text-slate-600 mt-1 flex-grow">{description}</p>
    <div className="text-sm font-semibold text-primary-blue mt-4">
      {getStartedText} &rarr;
    </div>
  </Card>
);

const DashboardPage: React.FC<DashboardPageProps> = ({ setActivePage }) => {
  const { t } = useLanguage();
  const features = [
    {
      title: t('dashboard.features.budgetPlanner.title'),
      description: t('dashboard.features.budgetPlanner.description'),
      icon: ICONS.WalletIcon,
      color: 'bg-primary-blue',
      page: 'Budget Planner' as Page,
    },
    {
      title: t('dashboard.features.symptomTracker.title'),
      description: t('dashboard.features.symptomTracker.description'),
      icon: ICONS.CameraIcon,
      color: 'bg-primary-green',
      page: 'Symptom Tracker' as Page,
    },
    {
      title: t('dashboard.features.bedFinder.title'),
      description: t('dashboard.features.bedFinder.description'),
      icon: ICONS.BedIcon,
      color: 'bg-accent-red',
      page: 'Bed Finder' as Page,
    },
    {
      title: t('dashboard.features.medicineChecker.title'),
      description: t('dashboard.features.medicineChecker.description'),
      icon: ICONS.PillIcon,
      color: 'bg-accent-orange',
      page: 'Medicine Checker' as Page,
    },
    {
      title: t('dashboard.features.medicalRecords.title'),
      description: t('dashboard.features.medicalRecords.description'),
      icon: ICONS.FileTextIcon,
      color: 'bg-indigo-500',
      page: 'Medical Records' as Page,
    },
     {
      title: t('dashboard.features.appointments.title'),
      description: t('dashboard.features.appointments.description'),
      icon: ICONS.HomeIcon, // Placeholder
      color: 'bg-sky-500',
      page: 'Appointments' as Page,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900">{t('dashboard.welcome')}</h2>
        <p className="text-slate-600 mt-1">{t('dashboard.helpToday')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <FeatureCard
            key={feature.title}
            {...feature}
            onClick={() => setActivePage(feature.page)}
            getStartedText={t('dashboard.getStarted')}
          />
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
