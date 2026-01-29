
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
    const cleanId = remoteId.replace(/[^0-9]/g, '');
    if (cleanId.length >= 6) {
      navigate(`/session/${cleanId}`);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 animate-in fade-in duration-700">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Card: Este Computador (AnyDesk style) */}
        <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-8 flex flex-col shadow-2xl hover:border-blue-500/30 transition-all group">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-blue-600/10 text-blue-500 rounded-2xl">
              <Monitor size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Este Computador</h2>
              <p className="text-xs text-slate-500">ID para receber suporte</p>
            </div>
          </div>

          <div className="mt-auto">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex items-center justify-between group-hover:bg-slate-900 transition-colors">
              <span className="text-2xl font-mono font-black text-white tracking-widest">{myId}</span>
              <button 
                onClick={handleCopy}
                className={`p-2.5 rounded-xl transition-all ${copied ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'}`}
              >
                {copied ? <Check size={20} /> : <Copy size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Card: Controle Remoto */}
        <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-8 flex flex-col shadow-2xl hover:border-purple-500/30 transition-all group">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-purple-600/10 text-purple-500 rounded-2xl">
              <RefreshCw size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Controle Remoto</h2>
              <p className="text-xs text-slate-500">Acessar outro computador</p>
            </div>
          </div>

          <form onSubmit={handleConnect} className="mt-auto space-y-4">
            <input 
              type="text" 
              value={remoteId}
              onChange={(e) => setRemoteId(e.target.value)}
              placeholder="Digite o ID remoto..."
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 px-6 text-xl font-mono text-white placeholder-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
            <button 
              type="submit"
              disabled={remoteId.length < 6}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]"
            >
              Conectar
              <ArrowRight size={20} />
            </button>
          </form>
        </div>

      </div>

      {/* Atalhos rápidos */}
      <div className="w-full max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
        {[
          { icon: <History size={18} />, label: 'Recentes' },
          { icon: <Shield size={18} />, label: 'Seguro' },
          { icon: <Download size={18} />, label: 'Instalar' },
          { icon: <Monitor size={18} />, label: 'Monitor' },
        ].map((item, i) => (
          <div key={i} className="bg-slate-900/40 border border-slate-800/60 p-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-800 transition-colors cursor-pointer group">
            <span className="text-slate-500 group-hover:text-blue-400 transition-colors">{item.icon}</span>
            <span className="text-sm font-medium text-slate-400 group-hover:text-white">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
