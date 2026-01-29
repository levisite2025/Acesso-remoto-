
import React from 'react';
import { ShieldCheck, LogOut, UserCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  const navigate = useNavigate();

  return (
    <header className="h-20 bg-slate-950 border-b border-slate-900 px-8 flex items-center justify-between sticky top-0 z-10">
      <div 
        className="flex items-center gap-3 cursor-pointer group"
        onClick={() => navigate('/')}
      >
        <div className="bg-blue-600 p-2 rounded-xl group-hover:scale-110 transition-transform">
          <ShieldCheck className="text-white" size={24} />
        </div>
        <span className="font-bold text-xl tracking-tight text-white">OmniRemote</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 px-4 py-2 bg-slate-900 rounded-2xl border border-slate-800">
          <UserCircle size={24} className="text-slate-500" />
          <div className="text-left hidden sm:block">
            <p className="text-xs font-bold text-white leading-none">Agente Smith</p>
            <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-bold">Nível 3</p>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="p-3 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-2xl transition-all"
          title="Sair"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};

export default Header;
