
import React, { useState } from 'react';
import { Download, Shield, Key, ArrowRight, Monitor, Laptop, Server } from 'lucide-react';

const ClientPortal: React.FC = () => {
  const [step, setStep] = useState(1);
  const [code, setCode] = useState('');

  const generateCode = () => {
    const newCode = Math.random().toString().slice(2, 11);
    const formatted = newCode.match(/.{1,3}/g)?.join('-') || '';
    setCode(formatted);
    setStep(3);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-white tracking-tight">Receber Suporte</h1>
        <p className="text-slate-400 text-lg">Baixe o assistente seguro do OmniRemote para permitir que um especialista ajude você.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        {[
          { icon: <Monitor />, title: 'Windows', desc: 'v2.4.1 Build 2024' },
          { icon: <Laptop />, title: 'macOS', desc: 'Binário Universal' },
          { icon: <Server />, title: 'Linux', desc: 'AppImage / Deb' },
        ].map((platform, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 p-8 rounded-3xl text-center hover:border-blue-500 transition-all group cursor-pointer">
            <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6 text-slate-400 group-hover:text-blue-400 group-hover:bg-blue-600/10 transition-all">
              {React.cloneElement(platform.icon as React.ReactElement, { size: 32 })}
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{platform.title}</h3>
            <p className="text-slate-500 text-sm mb-6">{platform.desc}</p>
            <button 
              onClick={() => setStep(2)}
              className="w-full py-3 bg-slate-800 group-hover:bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
            >
              <Download size={18} />
              Baixar
            </button>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 border border-slate-800 p-12 rounded-[40px] mt-12 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <Shield size={120} />
        </div>

        {step === 1 && (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Conexão Rápida</h2>
            <p className="text-slate-400 mb-8">Já tem o assistente instalado? Gere um código de conexão abaixo.</p>
            <button 
              onClick={() => setStep(2)}
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-blue-600/20"
            >
              Iniciar Sessão
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="max-w-md mx-auto space-y-8">
            <div className="bg-blue-500/10 border border-blue-500/20 p-6 rounded-2xl flex items-start gap-4">
              <Shield className="text-blue-500 shrink-0" size={24} />
              <p className="text-sm text-blue-400 leading-relaxed">
                Você está prestes a gerar um código de acesso temporário. Compartilhe-o apenas com um agente verificado do Suporte OmniRemote.
              </p>
            </div>
            <button 
              onClick={generateCode}
              className="w-full py-4 bg-white text-slate-950 rounded-2xl font-black text-xl hover:bg-slate-200 transition-all"
            >
              Gerar Código de Acesso
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="text-center space-y-6">
            <h2 className="text-xl font-bold text-slate-400">Forneça este código ao seu agente:</h2>
            <div className="text-6xl md:text-7xl font-mono font-black text-white tracking-widest bg-slate-800/50 py-8 px-12 rounded-[32px] border border-slate-700 inline-block select-all">
              {code}
            </div>
            <div className="flex items-center justify-center gap-2 text-emerald-400 font-medium animate-pulse">
              <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
              Aguardando conexão do agente...
            </div>
            <button 
              onClick={() => setStep(1)}
              className="text-slate-500 hover:text-white transition-colors text-sm font-medium underline"
            >
              Cancelar Solicitação
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientPortal;
