
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Monitor, 
  ArrowRight, 
  Copy, 
  Check, 
  RefreshCw,
  History,
  Shield,
  Download
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [remoteId, setRemoteId] = useState('');
  const [myId] = useState('842-193-057');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(myId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (remoteId.length >= 6) {
      navigate(`/session/${remoteId}`);
    }
  };

  return (
    <div className="max-w-5xl mx-auto h-full flex flex-col justify-center gap-12 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Card: Este Computador */}
        <div className="bg-slate-900 border border-slate-800 rounded-[40px] p-10 flex flex-col shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-700">
            <Monitor size={160} />
          </div>
          
          <div className="mb-8">
            <div className="w-14 h-14 bg-blue-600/10 text-blue-500 rounded-2xl flex items-center justify-center mb-6">
              <Monitor size={28} />
            </div>
            <h2 className="text-2xl font-bold text-white">Este Computador</h2>
            <p className="text-slate-400 mt-2">Compartilhe este código para receber suporte.</p>
          </div>

          <div className="mt-auto space-y-4">
            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 flex items-center justify-between">
              <span className="text-3xl font-mono font-black text-white tracking-widest">{myId}</span>
              <button 
                onClick={handleCopy}
                className={`p-3 rounded-2xl transition-all ${copied ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'}`}
              >
                {copied ? <Check size={20} /> : <Copy size={20} />}
              </button>
            </div>
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-[0.2em] text-center">Código de Acesso Seguro</p>
          </div>
        </div>

        {/* Card: Conexão Remota */}
        <div className="bg-slate-900 border border-slate-800 rounded-[40px] p-10 flex flex-col shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-700">
            <RefreshCw size={160} />
          </div>

          <div className="mb-8">
            <div className="w-14 h-14 bg-purple-600/10 text-purple-500 rounded-2xl flex items-center justify-center mb-6">
              <RefreshCw size={28} />
            </div>
            <h2 className="text-2xl font-bold text-white">Conectar Remoto</h2>
            <p className="text-slate-400 mt-2">Insira o código do computador que deseja acessar.</p>
          </div>

          <form onSubmit={handleConnect} className="mt-auto space-y-6">
            <div className="relative">
              <input 
                type="text" 
                value={remoteId}
                onChange={(e) => setRemoteId(e.target.value)}
                placeholder="ID de 9 dígitos"
                className="w-full bg-slate-950 border border-slate-800 rounded-3xl py-6 px-8 text-2xl font-mono text-white placeholder-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <button 
              type="submit"
              disabled={remoteId.length < 6}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-6 rounded-3xl font-black text-xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-600/20 active:scale-95"
            >
              Conectar
              <ArrowRight size={24} />
            </button>
          </form>
        </div>

      </div>

      {/* Seção Inferior: Ações Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: <History size={20} />, label: 'Recentes', sub: 'Últimas conexões' },
          { icon: <Shield size={20} />, label: 'Segurança', sub: 'Logs e acessos' },
          { icon: <Download size={20} />, label: 'Instaladores', sub: 'Baixar app cliente' },
        ].map((item, i) => (
          <div key={i} className="bg-slate-900/50 border border-slate-800 p-6 rounded-[32px] flex items-center gap-4 hover:bg-slate-800/50 transition-all cursor-pointer group">
            <div className="p-3 bg-slate-800 rounded-2xl text-slate-500 group-hover:text-blue-400 transition-colors">
              {item.icon}
            </div>
            <div>
              <p className="font-bold text-white text-sm">{item.label}</p>
              <p className="text-xs text-slate-500">{item.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
