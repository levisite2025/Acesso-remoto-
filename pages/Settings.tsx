import React from 'react';
import { Shield, Key, Bell, Globe, Monitor, Palette } from 'lucide-react';

const Settings: React.FC = () => {
  const sections = [
    { title: 'Perfil', Icon: Globe, desc: 'Gerencie seu perfil público de agente' },
    { title: 'Segurança', Icon: Shield, desc: '2FA, Senhas e Chaves de API' },
    { title: 'Remoto', Icon: Monitor, desc: 'Qualidade padrão, portas e codificação' },
    { title: 'Notificações', Icon: Bell, desc: 'Alertas para novas conexões' },
    { title: 'Aparência', Icon: Palette, desc: 'Tema, layout e acessibilidade visual' },
  ];

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-500 p-6 overflow-y-auto h-full">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Configurações do Sistema</h1>
        <p className="text-slate-400 mt-1">Configure seu ambiente de suporte e preferências de segurança.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {sections.map((section, i) => {
          const { Icon } = section;
          return (
            <div key={i} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between hover:border-slate-700 transition-all cursor-pointer group">
              <div className="flex items-center gap-6">
                <div className="p-3 bg-slate-800 rounded-xl text-slate-400 group-hover:text-blue-400 transition-colors">
                  <Icon size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{section.title}</h3>
                  <p className="text-sm text-slate-500">{section.desc}</p>
                </div>
              </div>
              <button className="text-slate-500 group-hover:text-white transition-colors">
                <Key size={20} />
              </button>
            </div>
          );
        })}
      </div>

      <div className="bg-red-500/5 border border-red-500/10 p-8 rounded-3xl mt-12">
        <h3 className="text-red-400 font-bold mb-2">Zona de Perigo</h3>
        <p className="text-sm text-slate-500 mb-6">Encerra todas as sessões ativas e desconecta de todos os dispositivos.</p>
        <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl font-bold transition-all">
          Forçar Logout Global
        </button>
      </div>
    </div>
  );
};

export default Settings;