
import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard.tsx';
import RemoteSession from './pages/RemoteSession.tsx';
import LoginPage from './pages/LoginPage.tsx';
import Header from './components/Header.tsx';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('omni_auth') === 'true';
  });
  
  const location = useLocation();

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('omni_auth', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('omni_auth');
  };

  if (!isAuthenticated && location.pathname !== '/login') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-200 overflow-hidden">
      {isAuthenticated && <Header onLogout={handleLogout} />}
      <main className="flex-1 w-full h-full relative">
        <Routes>
          <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <LoginPage onLogin={handleLogin} />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/session/:id" element={<RemoteSession />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
