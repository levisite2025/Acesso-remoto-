import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Monitor, ArrowRight, Copy, Check, RefreshCw, Download, ShieldCheck, Laptop, Globe, Server, Activity } from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [remoteId, setRemoteId] = useState('');
  const [myId, setMyId] = useState('');
  const [copied, setCopied] = useState(false);
  const [publicIp, setPublicIp] = useState('187.64.12.XXX');

  useEffect(() => {
    const generateId = () => {
      const parts = [];
      for(let i = 0; i < 3; i++) {
        parts.push(Math.floor(100 + Math.random() * 900).toString());
      }
      return parts.join('-');
    };
    setMyId(generateId());
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(myId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    const sanitized = remoteId.replace(/[^0-9-]/g, '');
    if (sanitized.length >= 6) {
      navigate(`/session/${sanitized}`);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-[#020617]">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in zoom-in duration-700">
        
        {/* Lado do Cliente (Receber Suporte) */}
        <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-8 shadow-2xl flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Globe size={120} />
          </div>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-blue-600/10 text-blue-500 rounded-lg">
              <Download size={20} />
            </div>
            <h2 className="font-bold text-white uppercase tracking-widest text-xs">Acesso Externo</h2>
          </div>
          
          <div className="space-y-6">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 text-center">
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest block mb-2">Seu ID de Suporte</span>
              <div className="flex items-center justify-center gap-4">
                <span className="text-3xl font-mono font-black text-white tracking-widest">{myId}</span>
                <button onClick={handleCopy} className={`p-2 rounded-lg transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
            </div>
            
            <div className="p-4 bg-blue-600/5 border border-blue-500/10 rounded-2xl">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase mb-2">
                <span>Ponto de Presença (PoP)</span>
                <span className="text-blue-400">São Paulo, BR</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Server size={12} />
                IP Público: {publicIp}
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-800">
            <p className="text-xs text-slate-500 leading-relaxed italic">
              * Mantenha esta janela aberta. O técnico usará este ID para cruzar os firewalls e estabelecer o túnel seguro.
            </p>
          </div>
        </div>

        {/* Centro: Status de Rede Global */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-8 flex-1 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4 border border-emerald-500/20">
              <Activity className="text-emerald-500 status-pulse" size={32} />
            </div>
            <h3 className="text-white font-bold mb-1">Rede OmniMesh</h3>
            <p className="text-xs text-slate-500 mb-6 uppercase tracking-widest">Servidor de Túnel Ativo</p>
            <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 w-full"></div>
            </div>
            <div className="mt-4 flex gap-4">
               <div className="text-center">
                 <p className="text-[10px] font-black text-slate-500 uppercase">Latência</p>
                 <p className="text-sm font-mono text-emerald-400">12ms</p>
               </div>
               <div className="text-center border-l border-slate-800 pl-4">
                 <p className="text-[10px] font-black text-slate-500 uppercase">Uptime</p>
                 <p className="text-sm font-mono text-slate-300">99.9%</p>
               </div>
            </div>
          </div>
        </div>

        {/* Lado do Técnico (Conectar ao Cliente) */}
        <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-8 shadow-2xl flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-red-500/10 text-red-500 rounded-lg">
              <Laptop size={20} />
            </div>
            <h2 className="font-bold text-white uppercase tracking-widest text-xs">Console de Controle</h2>
          </div>

          <form onSubmit={handleConnect} className="space-y-6 flex-1 flex flex-col">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">ID Remoto Externo</label>
              <input 
                type="text" 
                value={remoteId}
                onChange={(e) => setRemoteId(e.target.value)}
                placeholder="000-000-000"
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-5 px-6 text-2xl font-mono text-white placeholder-slate-800 focus:ring-2 focus:ring-red-500/50 outline-none transition-all shadow-inner"
              />
            </div>
            
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
               <div className="flex items-center justify-between text-[10px] font-black text-slate-500 uppercase">
                 <span>Protocolo de Túnel</span>
                 <span className="text-red-500">UDP/Encapsulado</span>
               </div>
            </div>

            <button 
              type="submit"
              disabled={remoteId.length < 6}
              className="mt-auto w-full bg-red-600 hover:bg-red-500 disabled:opacity-20 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all shadow-xl shadow-red-600/20 active:scale-95 group"
            >
              Estabelecer Conexão
              <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>

      </div>

      <div className="mt-12 flex items-center gap-8 px-10 py-5 bg-slate-900/30 rounded-full border border-white/5 backdrop-blur-md">
        <div className="flex items-center gap-3 text-slate-500 text-[10px] font-black uppercase tracking-widest">
          <ShieldCheck size={18} className="text-emerald-500" />
          End-to-End Encryption (AES-GCM)
        </div>
        <div className="h-4 w-px bg-slate-800"></div>
        <div className="flex items-center gap-3 text-slate-500 text-[10px] font-black uppercase tracking-widest">
          <Globe size={18} className="text-blue-500" />
          Relay Global Ativo
        </div>
      </div>
    </div>
  );
};

export default Dashboard;