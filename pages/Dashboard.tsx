import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Monitor, ArrowRight, Copy, Check, RefreshCw, Download, ShieldCheck, Laptop } from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [remoteId, setRemoteId] = useState('');
  const [myId, setMyId] = useState('');
  const [copied, setCopied] = useState(false);

  // Gera um ID aleatório formatado XXX-XXX-XXX ao carregar
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

  const downloadClientApp = () => {
    const content = `
=========================================
      OmniRemote Support Agent v2.5
=========================================

SESSÃO GERADA EM: ${new Date().toLocaleString()}
ID DE ACESSO: ${myId}

INSTRUÇÕES:
1. Informe o ID acima ao técnico de suporte.
2. Mantenha esta página aberta durante o atendimento.
3. Clique em 'Autorizar' quando solicitado.

URL DE CONEXÃO DIRETA:
${window.location.origin}/#/session/${myId}

-----------------------------------------
Segurança: Conexão criptografada ponta-a-ponta (SSL/AES).
-----------------------------------------
    `.trim();

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Suporte_OmniRemote_${myId.replace(/-/g, '')}.txt`);
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
    const sanitized = remoteId.replace(/[^0-9-]/g, '');
    if (sanitized.length >= 6) {
      navigate(`/session/${sanitized}`);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-slate-950">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in zoom-in duration-700">
        
        {/* Card: Receber Suporte */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-[32px] p-8 shadow-2xl flex flex-col text-white transform hover:translate-y-[-4px] transition-all duration-300">
          <div className="mb-6">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
              <Download size={24} />
            </div>
            <h2 className="text-2xl font-black mb-2">Receber Suporte</h2>
            <p className="text-blue-100 text-sm leading-relaxed">
              Gere seu código exclusivo e baixe o agente para que um técnico possa ajudar você.
            </p>
          </div>
          
          <button 
            onClick={downloadClientApp}
            className="mt-auto w-full bg-white text-blue-700 py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-blue-50 transition-all active:scale-95 shadow-lg"
          >
            Baixar Instruções
            <Download size={20} />
          </button>
          
          <p className="text-[10px] mt-4 text-blue-200 font-bold uppercase tracking-wider text-center">
            Código Gerado dinamicamente
          </p>
        </div>

        {/* Card: Identidade Local */}
        <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-8 shadow-2xl flex flex-col transform hover:translate-y-[-4px] transition-all duration-300">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
              <Monitor size={20} />
            </div>
            <h2 className="font-bold text-white">Este Dispositivo</h2>
          </div>
          
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center mb-8">
            <span className="text-xs text-slate-500 mb-2 font-bold uppercase tracking-widest">ID de Acesso Único</span>
            <div className="flex items-center gap-4">
              {myId ? (
                <span className="text-3xl font-mono font-black text-white tracking-widest">{myId}</span>
              ) : (
                <div className="h-9 w-48 bg-slate-800 animate-pulse rounded-lg"></div>
              )}
              <button 
                onClick={handleCopy}
                disabled={!myId}
                className={`p-3 rounded-xl transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-white active:scale-90'}`}
              >
                {copied ? <Check size={20} /> : <Copy size={20} />}
              </button>
            </div>
          </div>
          
          <div className="mt-auto flex items-center justify-center gap-3 p-4 bg-slate-950/50 rounded-2xl border border-dashed border-slate-800">
            <div className="w-2 h-2 rounded-full bg-emerald-500 status-pulse"></div>
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Pronto para Conexão</span>
          </div>
        </div>

        {/* Card: Iniciar Controle */}
        <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-8 shadow-2xl flex flex-col transform hover:translate-y-[-4px] transition-all duration-300">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-red-500/10 text-red-500 rounded-lg">
              <Laptop size={20} />
            </div>
            <h2 className="font-bold text-white">Acesso de Técnico</h2>
          </div>

          <form onSubmit={handleConnect} className="space-y-4 h-full flex flex-col">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">ID do Cliente Remoto</label>
              <input 
                type="text" 
                value={remoteId}
                onChange={(e) => setRemoteId(e.target.value)}
                placeholder="000-000-000"
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-5 px-6 text-2xl font-mono text-white placeholder-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            
            <button 
              type="submit"
              disabled={remoteId.length < 6}
              className="mt-auto w-full bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all shadow-xl shadow-red-600/20 active:scale-95"
            >
              Conectar Agora
              <ArrowRight size={22} />
            </button>
          </form>
        </div>

      </div>

      <div className="mt-12 flex items-center gap-8 px-8 py-4 bg-slate-900/40 rounded-full border border-slate-800/50">
        <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
          <ShieldCheck size={16} className="text-emerald-500" />
          Proteção SSL Ativa
        </div>
        <div className="h-4 w-px bg-slate-800"></div>
        <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
          <RefreshCw size={14} className="animate-spin" style={{ animationDuration: '4s' }} />
          Sincronizado com o Servidor
        </div>
      </div>
    </div>
  );
};

export default Dashboard;