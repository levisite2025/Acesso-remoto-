
import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import RemoteSession from './pages/RemoteSession';
import LoginPage from './pages/LoginPage';
import Header from './components/Header';

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
    <div className="flex h-screen bg-slate-950 overflow-hidden text-slate-200 font-sans">
      <div className="flex-1 flex flex-col min-w-0">
        {isAuthenticated && <Header onLogout={handleLogout} />}
        <main className={`flex-1 overflow-y-auto ${isAuthenticated ? 'p-4 md:p-8' : ''}`}>
          <Routes>
            <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <LoginPage onLogin={handleLogin} />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/session/:id" element={<RemoteSession />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;
