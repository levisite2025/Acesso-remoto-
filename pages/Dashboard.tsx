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

  const downloadClient = () => {
    // Simula a criação de um executável para download
    const dummyContent = "OmniRemote Client Binary Stub - Ver 2.4.1";
    const blob = new Blob([dummyContent], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'OmniRemote_Setup_v2.4.exe');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    alert("O instalador foi baixado. Execute o arquivo e forneça o ID gerado para o técnico.");
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
        <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-8 shadow-2xl flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Globe size={120} />
          </div>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-blue-600/10 text-blue-500 rounded-lg">
              <Download size={20} />
            </div>
            <h2 className="font-bold text-white uppercase tracking-widest text-xs">Suporte ao Cliente</h2>
          </div>
          
          <div className="space-y-6 flex-1">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 text-center">
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest block mb-2">Seu ID de Suporte</span>
              <div className="flex items-center justify-center gap-4">
                <span className="text-3xl font-mono font-black text-white tracking-widest">{myId}</span>
                <button onClick={handleCopy} className={`p-2 rounded-lg transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
            </div>
            
            <button 
              onClick={downloadClient}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-600/20 active:scale-95"
            >
              <Download size={18} />
              Baixar Assistente (.EXE)
            </button>

            <div className="p-4 bg-blue-600/5 border border-blue-500/10 rounded-2xl">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase mb-2">
                <span>Ponto de Presença</span>
                <span className="text-blue-400">São Paulo, BR</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Server size={12} />
                IP: {publicIp}
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-800">
            <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
              * Para conexões via internet externa, certifique-se de que o assistente esteja em execução.
            </p>
          </div>
        </div>

        {/* Centro: Monitor de Túnel */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-8 flex-1 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4 border border-emerald-500/20">
              <Activity className="text-emerald-500 status-pulse" size={32} />
            </div>
            <h3 className="text-white font-bold mb-1">Rede OmniMesh</h3>
            <p className="text-[10px] text-slate-500 mb-6 uppercase tracking-widest font-black">Infraestrutura Ativa</p>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 w-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-6 w-full">
               <div className="text-center">
                 <p className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">Latência Global</p>
                 <p className="text-sm font-mono text-emerald-400 font-bold">12ms</p>
               </div>
               <div className="text-center border-l border-slate-800">
                 <p className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">Nós Ativos</p>
                 <p className="text-sm font-mono text-slate-300 font-bold">142</p>
               </div>
            </div>
          </div>
        </div>

        {/* Lado do Técnico */}
        <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-8 shadow-2xl flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-red-500/10 text-red-500 rounded-lg">
              <Laptop size={20} />
            </div>
            <h2 className="font-bold text-white uppercase tracking-widest text-xs">Console do Agente</h2>
          </div>

          <form onSubmit={handleConnect} className="space-y-6 flex-1 flex flex-col">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">ID Remoto do Cliente</label>
              <input 
                type="text" 
                value={remoteId}
                onChange={(e) => setRemoteId(e.target.value)}
                placeholder="000-000-000"
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-5 px-6 text-2xl font-mono text-white placeholder-slate-800 focus:ring-2 focus:ring-red-500/40 outline-none transition-all"
              />
            </div>
            
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
               <div className="flex items-center justify-between text-[10px] font-black text-slate-500 uppercase">
                 <span>Túnel de Dados</span>
                 <span className="text-red-500 flex items-center gap-1">
                   <ShieldCheck size={10} /> UDP/AES
                 </span>
               </div>
            </div>

            <button 
              type="submit"
              disabled={remoteId.length < 6}
              className="mt-auto w-full bg-red-600 hover:bg-red-500 disabled:opacity-20 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all shadow-xl shadow-red-600/20 active:scale-95 group"
            >
              Iniciar Suporte
              <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>

      </div>

      <div className="mt-12 flex items-center gap-8 px-10 py-5 bg-slate-900/40 rounded-full border border-white/5 backdrop-blur-md">
        <div className="flex items-center gap-3 text-slate-400 text-[10px] font-black uppercase tracking-widest">
          <ShieldCheck size={18} className="text-emerald-500" />
          Certificado FIPS 140-2
        </div>
        <div className="h-4 w-px bg-slate-800"></div>
        <div className="flex items-center gap-3 text-slate-400 text-[10px] font-black uppercase tracking-widest">
          <Globe size={18} className="text-blue-500" />
          Protocolo P2P Externo
        </div>
      </div>
    </div>
  );
};

export default Dashboard;