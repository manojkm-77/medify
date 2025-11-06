
import React from 'react';
import type { Page } from '../../types';
import Card from '../../components/ui/Card';
import { ICONS } from '../../constants';

interface DashboardPageProps {
  setActivePage: (page: Page) => void;
}

const StatCard: React.FC<{ title: string; value: string; icon: React.ElementType; color: string; }> = ({ title, value, icon: Icon, color }) => (
    <Card className="p-4">
        <div className="flex items-center">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
                <p className="text-sm text-slate-500">{title}</p>
                <p className="text-xl font-bold text-slate-800">{value}</p>
            </div>
        </div>
    </Card>
);

const AppointmentItem: React.FC<{ time: string; patient: string; reason: string; status: 'upcoming' | 'ongoing' }> = ({ time, patient, reason, status }) => (
    <div className="flex items-center space-x-4 py-3 border-b border-slate-100 last:border-b-0">
        <div className="w-16 text-center">
            <p className="font-bold text-primary-blue">{time}</p>
            {status === 'ongoing' && <span className="text-xs font-semibold bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Ongoing</span>}
        </div>
        <div>
            <p className="font-semibold text-slate-800">{patient}</p>
            <p className="text-sm text-slate-500">{reason}</p>
        </div>
        <div className="flex-grow text-right">
            <button className="p-2 rounded-full hover:bg-slate-100">
                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
            </button>
        </div>
    </div>
);


const DoctorDashboardPage: React.FC<DashboardPageProps> = ({ setActivePage }) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Welcome, Dr. Sharma!</h2>
        <p className="text-slate-600 mt-1">Here's your summary for today.</p>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Appointments" value="12" icon={ICONS.UsersIcon} color="bg-primary-blue" />
        <StatCard title="Pending Follow-ups" value="4" icon={ICONS.FileTextIcon} color="bg-accent-orange" />
        <StatCard title="Urgent Alerts" value="1" icon={ICONS.HomeIcon} color="bg-accent-red" />
        <StatCard title="New Messages" value="8" icon={ICONS.PillIcon} color="bg-primary-green" />
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-2">Today's Appointments</h3>
        <div className="divide-y divide-slate-100">
            <AppointmentItem time="10:00 AM" patient="Ravi Kumar" reason="Fever, Consultation" status="ongoing" />
            <AppointmentItem time="10:30 AM" patient="Sunita Devi" reason="Follow-up, Diabetes" status="upcoming" />
            <AppointmentItem time="11:00 AM" patient="Amit Singh" reason="Annual Checkup" status="upcoming" />
        </div>
         <button className="mt-4 text-sm font-semibold text-primary-blue w-full text-center">
            View All Appointments &rarr;
        </button>
      </Card>
      
       <Card className="p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-2">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button onClick={() => setActivePage('AI Prescription')} className="flex flex-col items-center p-4 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
                <ICONS.ClipboardIcon className="w-8 h-8 text-primary-blue mb-2" />
                <span className="text-sm font-semibold text-slate-700">New Prescription</span>
            </button>
             <button onClick={() => setActivePage('Follow-ups')} className="flex flex-col items-center p-4 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
                <ICONS.UsersIcon className="w-8 h-8 text-primary-blue mb-2" />
                <span className="text-sm font-semibold text-slate-700">Patient Follow-ups</span>
            </button>
        </div>
      </Card>
    </div>
  );
};

export default DoctorDashboardPage;
