import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Monitor, ArrowRight, Copy, Check, RefreshCw, Download, ShieldCheck, Laptop } from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [remoteId, setRemoteId] = useState('');
  const [myId] = useState('842-193-057');
  const [copied, setCopied] = useState(false);

  const downloadClientApp = () => {
    const content = `
=========================================
      OmniRemote Support Agent v2.4
=========================================

Para iniciar o suporte remoto:
1. Extraia o conteúdo deste arquivo.
2. Execute 'OmniRemote_Client.exe'.
3. Copie o ID abaixo e informe ao seu técnico.

SEU ID DE ACESSO: ${myId}

LINK DE CONEXÃO DIRETA:
${window.location.origin}/#/session/${myId}

-----------------------------------------
Segurança: Conexão criptografada ponta-a-ponta.
-----------------------------------------
    `.trim();

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'OmniRemote_Suporte.txt');
    document.body.appendChild(link);
    link.click();
    
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 100);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(myId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (remoteId.trim().length >= 6) {
      navigate(`/session/${remoteId.trim().replace(/\s/g, '')}`);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-slate-950">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-[32px] p-8 shadow-2xl flex flex-col text-white transform hover:scale-[1.02] transition-transform duration-300">
          <div className="mb-6">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
              <Download size={24} />
            </div>
            <h2 className="text-2xl font-black mb-2">Receber Suporte</h2>
            <p className="text-blue-100 text-sm leading-relaxed">
              Baixe o agente de acesso para permitir que um técnico ajude você remotamente agora.
            </p>
          </div>
          
          <button 
            onClick={downloadClientApp}
            className="mt-auto w-full bg-white text-blue-700 py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-blue-50 transition-all active:scale-95 shadow-lg"
          >
            Baixar Extensão
            <Download size={20} />
          </button>
          
          <p className="text-[10px] mt-4 text-blue-200 font-bold uppercase tracking-wider text-center">
            Instalador Seguro Verificado
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-8 shadow-2xl flex flex-col transform hover:scale-[1.02] transition-transform duration-300">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-red-500/10 text-red-500 rounded-lg">
              <Monitor size={20} />
            </div>
            <h2 className="font-bold text-white">Este Computador</h2>
          </div>
          
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center mb-8">
            <span className="text-sm text-slate-500 mb-2 font-bold uppercase tracking-widest">Seu ID de Acesso</span>
            <div className="flex items-center gap-4">
              <span className="text-3xl font-mono font-black text-white tracking-widest">{myId}</span>
              <button 
                onClick={handleCopy}
                className={`p-3 rounded-xl transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
              >
                {copied ? <Check size={20} /> : <Copy size={20} />}
              </button>
            </div>
          </div>
          
          <div className="mt-auto flex items-center justify-center gap-3 p-4 bg-slate-950/50 rounded-2xl border border-dashed border-slate-800">
            <div className="w-2 h-2 rounded-full bg-emerald-500 status-pulse"></div>
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Serviço Online</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-8 shadow-2xl flex flex-col transform hover:scale-[1.02] transition-transform duration-300">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-purple-500/10 text-purple-500 rounded-lg">
              <Laptop size={20} />
            </div>
            <h2 className="font-bold text-white">Controlar Remoto</h2>
          </div>

          <form onSubmit={handleConnect} className="space-y-4 h-full flex flex-col">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">ID do Cliente</label>
              <input 
                type="text" 
                value={remoteId}
                onChange={(e) => setRemoteId(e.target.value)}
                placeholder="000 000 000"
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-5 px-6 text-2xl font-mono text-white placeholder-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            
            <button 
              type="submit"
              disabled={remoteId.length < 6}
              className="mt-auto w-full bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all shadow-xl shadow-red-600/20 active:scale-95"
            >
              Conectar
              <ArrowRight size={22} />
            </button>
          </form>
        </div>

      </div>

      <div className="mt-12 flex items-center gap-8 px-8 py-4 bg-slate-900/40 rounded-full border border-slate-800/50">
        <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
          <ShieldCheck size={16} className="text-emerald-500" />
          SSL / AES-256 Protegido
        </div>
        <div className="h-4 w-px bg-slate-800"></div>
        <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
          <RefreshCw size={14} className="animate-spin" style={{ animationDuration: '4s' }} />
          Rede OmniRemote Ativa
        </div>
      </div>
    </div>
  );
};

export default Dashboard;