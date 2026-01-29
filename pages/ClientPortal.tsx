import React, { useState } from 'react';
import { Download, Shield, Monitor, Laptop, Server, CheckCircle } from 'lucide-react';

const ClientPortal: React.FC = () => {
  const [step, setStep] = useState(1);
  const [code, setCode] = useState('');

  const downloadFile = (os: string) => {
    const filename = os === 'Windows' ? 'OmniRemote_Client_Setup.exe' : `OmniRemote_Client_${os}.zip`;
    const dummyContent = `OmniRemote Client Installer for ${os} - Professional Edition`;
    const blob = new Blob([dummyContent], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setStep(2);
  };

  const generateCode = () => {
    const newCode = Math.random().toString().slice(2, 11);
    const formatted = newCode.match(/.{1,3}/g)?.join('-') || '';
    setCode(formatted);
    setStep(3);
  };

  const platforms = [
    { Icon: Monitor, title: 'Windows', desc: 'v2.4.1 (.EXE)' },
    { Icon: Laptop, title: 'macOS', desc: 'Apple Silicon/Intel' },
    { Icon: Server, title: 'Linux', desc: 'AppImage / Deb' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-top-4 duration-700 p-6 overflow-y-auto h-full">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-white tracking-tight">Portal de Download</h1>
        <p className="text-slate-400 text-lg">Baixe o assistente oficial para permitir o acesso do técnico via internet externa.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        {platforms.map((platform, i) => {
          const { Icon } = platform;
          return (
            <div key={i} className="bg-slate-900 border border-slate-800 p-8 rounded-3xl text-center hover:border-blue-500 transition-all group cursor-pointer shadow-xl">
              <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6 text-slate-400 group-hover:text-blue-400 group-hover:bg-blue-600/10 transition-all">
                <Icon size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{platform.title}</h3>
              <p className="text-slate-500 text-sm mb-6 font-mono">{platform.desc}</p>
              <button 
                onClick={() => downloadFile(platform.title)}
                className="w-full py-4 bg-slate-800 group-hover:bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Download size={18} />
                Baixar Agora
              </button>
            </div>
          );
        })}
      </div>

      <div className="bg-slate-900 border border-slate-800 p-12 rounded-[40px] mt-12 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <Shield size={120} />
        </div>

        {step === 1 && (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Já baixou o instalador?</h2>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">Após instalar e executar o aplicativo, clique abaixo para gerar o seu código de autorização.</p>
            <button 
              onClick={() => setStep(2)}
              className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20"
            >
              Eu já tenho o Assistente
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="max-w-md mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="bg-blue-500/10 border border-blue-500/20 p-6 rounded-2xl flex items-start gap-4">
              <CheckCircle className="text-blue-500 shrink-0" size={24} />
              <div className="space-y-2">
                <p className="font-bold text-white text-sm">Download Concluído!</p>
                <p className="text-xs text-blue-400 leading-relaxed">
                  1. Localize o arquivo baixado em sua pasta de Downloads.<br/>
                  2. Execute o arquivo e aceite as permissões do sistema.<br/>
                  3. Clique no botão abaixo para gerar seu ID exclusivo.
                </p>
              </div>
            </div>
            <button 
              onClick={generateCode}
              className="w-full py-5 bg-white text-slate-950 rounded-2xl font-black text-lg hover:bg-slate-200 transition-all uppercase tracking-widest"
            >
              Gerar ID de Suporte
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="text-center space-y-8 animate-in zoom-in duration-300">
            <h2 className="text-xl font-bold text-slate-400 uppercase tracking-widest">Código de Acesso Externo:</h2>
            <div className="text-6xl md:text-7xl font-mono font-black text-white tracking-widest bg-slate-950 py-10 px-12 rounded-[32px] border border-slate-800 inline-block shadow-inner">
              {code}
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-2 text-emerald-400 font-black text-xs uppercase tracking-widest animate-pulse">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                Aguardando Agente Externo...
              </div>
              <button 
                onClick={() => setStep(1)}
                className="text-slate-500 hover:text-red-400 transition-colors text-xs font-black uppercase tracking-widest"
              >
                Cancelar Conexão
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientPortal;