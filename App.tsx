
import React, { useState } from 'react';
import type { UserRole } from './types';
import LoginPage from './pages/LoginPage';
import PatientPortal from './portals/PatientPortal';
import DoctorPortal from './portals/DoctorPortal';

const App: React.FC = () => {
  const [user, setUser] = useState<{ role: UserRole | null }>({ role: null });

  const handleLogin = (role: UserRole) => {
    setUser({ role });
  };

  const handleLogout = () => {
    setUser({ role: null });
  };

  if (!user.role) {
    return <LoginPage onLogin={handleLogin} />;
  }

  if (user.role === 'patient') {
    return <PatientPortal onLogout={handleLogout} />;
  }

  if (user.role === 'doctor') {
    return <DoctorPortal onLogout={handleLogout} />;
  }

  return null;
};

export default App;
