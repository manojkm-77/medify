
import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import Logo from '../ui/Logo';

interface HeaderProps {
  onLogout?: () => void;
  userRole?: 'patient' | 'doctor';
}

const LanguageSwitcher: React.FC = () => {
    const { locale, setLocale } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);

    const handleLanguageChange = (lang: 'en' | 'hi') => {
        setLocale(lang);
        setIsOpen(false);
    }

    return (
        <div className="relative">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-full hover:bg-slate-100 transition-colors" aria-label="Change language">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg py-1 z-10">
                    <button onClick={() => handleLanguageChange('en')} className={`block w-full text-left px-4 py-2 text-sm ${locale === 'en' ? 'bg-blue-50 text-primary-blue' : 'text-slate-700'} hover:bg-slate-100`}>English</button>
                    <button onClick={() => handleLanguageChange('hi')} className={`block w-full text-left px-4 py-2 text-sm ${locale === 'hi' ? 'bg-blue-50 text-primary-blue' : 'text-slate-700'} hover:bg-slate-100`}>हिन्दी</button>
                </div>
            )}
        </div>
    );
}


const Header: React.FC<HeaderProps> = ({ onLogout, userRole }) => {
  const { t } = useLanguage();
  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Logo textClassName="text-xl md:text-2xl" iconClassName="w-8 h-8" />
          {userRole && <span className="text-sm font-semibold text-slate-500 capitalize pt-1">{t(`header.${userRole}Portal`)}</span>}
        </div>
        <div className="flex items-center space-x-2">
            <LanguageSwitcher />
            <button className="p-2 rounded-full hover:bg-slate-100 transition-colors" aria-label={t('header.notifications')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
            </button>
            {onLogout && (
                 <button onClick={onLogout} className="p-2 rounded-full hover:bg-slate-100 transition-colors" aria-label={t('header.logout')}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                 </button>
            )}
        </div>
      </div>
    </header>
  );
};

export default Header;