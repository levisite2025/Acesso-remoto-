
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard.tsx';
import RemoteSession from './pages/RemoteSession.tsx';
import LoginPage from './pages/LoginPage.tsx';
import Header from './components/Header.tsx';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('omni_auth') === 'true';
    } catch (e) {
      return false;
    }
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

  // Redirecionamento automático para login se não autenticado
  if (!isAuthenticated && location.pathname !== '/login') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-200 font-sans overflow-hidden">
      {isAuthenticated && <Header onLogout={handleLogout} />}
      <main className="flex-1 w-full h-full relative overflow-hidden">
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
