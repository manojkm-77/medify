
import React, { useState } from 'react';
import type { UserRole } from '../types';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { useLanguage } from '../i18n/LanguageContext';
import Logo from '../components/ui/Logo';

interface LoginPageProps {
  onLogin: (role: UserRole) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const { t } = useLanguage();
  const [role, setRole] = useState<UserRole>('patient');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const patientCreds = { email: 'patient@demo.com', pass: 'patient123' };
    const doctorCreds = { email: 'doctor@demo.com', pass: 'doctor123' };

    let success = false;
    if (role === 'patient' && email === patientCreds.email && password === patientCreds.pass) {
        success = true;
    } else if (role === 'doctor' && email === doctorCreds.email && password === doctorCreds.pass) {
        success = true;
    }

    if (success) {
      onLogin(role);
    } else {
      setError(t('login.error'));
    }
  };
  
  const handleHintClick = () => {
      if (role === 'patient') {
          setEmail('patient@demo.com');
          setPassword('patient123');
      } else {
          setEmail('doctor@demo.com');
          setPassword('doctor123');
      }
  }

  return (
    <div className="bg-slate-50 min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="flex items-center justify-center mb-8">
          <Logo textClassName="text-4xl text-slate-800" iconClassName="w-12 h-12" />
        </div>
        
        <Card className="p-8">
            <div className="flex border-b border-slate-200 mb-6">
                <button 
                    onClick={() => { setRole('patient'); setError(''); }}
                    className={`flex-1 py-3 font-semibold text-center transition-colors ${role === 'patient' ? 'text-primary-blue border-b-2 border-primary-blue' : 'text-slate-500'}`}
                >
                    {t('login.patientLogin')}
                </button>
                <button 
                    onClick={() => { setRole('doctor'); setError(''); }}
                    className={`flex-1 py-3 font-semibold text-center transition-colors ${role === 'doctor' ? 'text-primary-blue border-b-2 border-primary-blue' : 'text-slate-500'}`}
                >
                    {t('login.doctorLogin')}
                </button>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-4">
                <Input 
                    label={t('login.emailLabel')}
                    type="email" 
                    placeholder={t('login.emailPlaceholder')}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />
                <Input 
                    label={t('login.passwordLabel')}
                    type="password" 
                    placeholder={t('login.passwordPlaceholder')}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />
                 {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                <Button type="submit" size="lg" className="w-full">
                    {t('login.loginButton')}
                </Button>
                <p className="text-xs text-slate-500 text-center">
                    {t('login.demoHint')}
                    <button type="button" onClick={handleHintClick} className="text-blue-600 underline ml-1">{t('login.useDemoCreds')}</button>
                </p>
            </form>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;