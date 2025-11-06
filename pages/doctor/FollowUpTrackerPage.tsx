
import React from 'react';
import Card from '../../components/ui/Card';

interface FollowUp {
    patientName: string;
    condition: string;
    lastResponse: string;
    symptomTrend: 'improving' | 'stable' | 'worsening';
    adherence: 'good' | 'average' | 'poor';
}

const mockFollowUps: FollowUp[] = [
    { patientName: 'Anjali Sharma', condition: 'Post-Op Knee Recovery', lastResponse: '2 hours ago', symptomTrend: 'improving', adherence: 'good' },
    { patientName: 'Vikram Singh', condition: 'Type 2 Diabetes', lastResponse: '6 hours ago', symptomTrend: 'stable', adherence: 'average' },
    { patientName: 'Priya Mehta', condition: 'Viral Fever', lastResponse: '18 hours ago', symptomTrend: 'worsening', adherence: 'poor' },
    { patientName: 'Rohan Joshi', condition: 'Hypertension', lastResponse: '1 hour ago', symptomTrend: 'stable', adherence: 'good' },
];

const StatusBadge: React.FC<{ status: 'improving' | 'stable' | 'worsening' | 'good' | 'average' | 'poor' }> = ({ status }) => {
    const styles = {
        improving: 'bg-green-100 text-green-800',
        stable: 'bg-blue-100 text-blue-800',
        worsening: 'bg-red-100 text-red-800',
        good: 'bg-green-100 text-green-800',
        average: 'bg-yellow-100 text-yellow-800',
        poor: 'bg-red-100 text-red-800',
    };
    return <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${styles[status]}`}>{status}</span>
}

const FollowUpItem: React.FC<{ item: FollowUp }> = ({ item }) => {
    const getStatusColor = () => {
        if (item.symptomTrend === 'worsening' || item.adherence === 'poor') return 'border-red-500';
        if (item.adherence === 'average') return 'border-yellow-500';
        return 'border-slate-200';
    }

    return (
        <Card className={`p-4 border-l-4 ${getStatusColor()}`}>
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="font-bold text-slate-800">{item.patientName}</h4>
                    <p className="text-sm text-slate-600">{item.condition}</p>
                </div>
                <p className="text-xs text-slate-500">{item.lastResponse}</p>
            </div>
            <div className="flex items-center space-x-4 mt-3 text-sm">
                <div>
                    <span className="text-slate-500">Trend: </span>
                    <StatusBadge status={item.symptomTrend} />
                </div>
                <div>
                    <span className="text-slate-500">Adherence: </span>
                    <StatusBadge status={item.adherence} />
                </div>
            </div>
        </Card>
    );
};


const FollowUpTrackerPage: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Automated Follow-up Tracker</h2>
            <p className="text-slate-600 mt-1">Monitor patient progress and adherence in near real-time.</p>

            <div className="mt-8 space-y-4">
                {mockFollowUps.map((item, index) => (
                    <FollowUpItem key={index} item={item} />
                ))}
            </div>
        </div>
    );
};

export default FollowUpTrackerPage;
