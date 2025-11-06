import React from 'react';
import type { Page, NavItem } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';

interface BottomNavProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
  navItems: NavItem[];
}

const BottomNav: React.FC<BottomNavProps> = ({ activePage, setActivePage, navItems }) => {
  const { t } = useLanguage();
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-50">
      <div className="flex justify-around items-center h-20">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`flex flex-col items-center justify-center space-y-1 w-full h-full transition-colors ${
              activePage === item.id ? 'text-primary-blue' : 'text-slate-500'
            }`}
            aria-label={t(item.labelKey)}
          >
            <item.icon className="w-7 h-7" />
            <span className="text-xs font-medium">{t(item.labelKey)}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
