
import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, User, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [step, setStep] = useState<'login' | '2fa'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [twoFACode, setTwoFACode] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  const passwordStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length > 3) score++;
    if (pwd.length > 7) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    return score;
  };

  const handleInitialLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;

    // Senha atualizada para '1234' conforme solicitação do usuário
    if (username === 'admin' && password === '1234') {
      setStep('2fa');
      setError('');
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= 3) {
        setIsLocked(true);
        setError('Conta bloqueada por múltiplas tentativas falhas. Contate o administrador.');
      } else {
        setError(`Credenciais inválidas. ${3 - newAttempts} tentativas restantes.`);
      }
    }
  };

  const handle2FA = (e: React.FormEvent) => {
    e.preventDefault();
    if (twoFACode === '123456') {
      onLogin();
    } else {
      setError('Código de verificação inválido.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
      <div className="absolute top-0 -left-20 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px]"></div>

      <div className="w-full max-w-md bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-[32px] shadow-2xl animate-in fade-in zoom-in duration-500">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-600/20">
            <ShieldCheck className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Portal do Agente</h1>
          <p className="text-slate-400 text-sm mt-1">Acesse os sistemas de gerenciamento remoto seguro</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-400 text-sm">
            <AlertCircle size={18} className="shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {step === 'login' ? (
          <form onSubmit={handleInitialLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Usuário</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLocked}
                  placeholder="admin"
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-600 focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:opacity-50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLocked}
                  placeholder="••••"
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-600 focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:opacity-50"
                />
              </div>
              {password && (
                <div className="flex gap-1 mt-2">
                  {[1, 2, 3, 4].map((level) => (
                    <div 
                      key={level} 
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        passwordStrength(password) >= level ? 'bg-blue-500' : 'bg-slate-800'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            <button 
              type="submit" 
              disabled={isLocked}
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 mt-6"
            >
              Entrar
              <ArrowRight size={18} />
            </button>
            <p className="text-center text-xs text-slate-500 mt-4">
              Credenciais Demo: <span className="text-slate-300">admin / 1234</span>
            </p>
          </form>
        ) : (
          <form onSubmit={handle2FA} className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 text-center">
              <p className="text-slate-300 text-sm mb-4">Um código de verificação de 6 dígitos foi enviado para o seu dispositivo autorizado (Simulado: 123456).</p>
              <input 
                type="text" 
                maxLength={6}
                value={twoFACode}
                onChange={(e) => setTwoFACode(e.target.value)}
                placeholder="123456"
                className="w-full text-center text-3xl font-mono tracking-[0.5em] bg-transparent border-b-2 border-blue-500 py-2 text-white outline-none"
                autoFocus
              />
            </div>
            <button 
              type="submit" 
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20"
            >
              Verificar e Continuar
            </button>
            <button 
              type="button"
              onClick={() => setStep('login')}
              className="w-full text-slate-500 hover:text-white text-sm font-medium transition-colors"
            >
              Voltar para o login
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
