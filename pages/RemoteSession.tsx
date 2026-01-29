
import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  X, 
  Camera, 
  Share2,
  Lock,
  Monitor,
  MousePointer2,
  Keyboard,
  MessageSquare,
  Activity,
  Wifi
} from 'lucide-react';
import ChatBox from '../components/ChatBox.tsx';

const RemoteSession: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isControlEnabled, setIsControlEnabled] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [latency, setLatency] = useState(15);

  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(prev => Math.max(8, Math.min(60, prev + (Math.random() * 6 - 3))));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const startScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ 
        video: { cursor: "always" } as any,
        audio: false
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsScreenSharing(true);
      }
    } catch (err) {
      console.error("Erro ao compartilhar:", err);
    }
  };

  const stopScreenShare = () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach(track => track.stop());
    setIsScreenSharing(false);
    navigate('/');
  };

  return (
    <div className="h-full w-full flex flex-col gap-4 animate-in slide-in-from-bottom-8 duration-700 relative">
      
      {/* Container Principal da Tela */}
      <div className="flex-1 bg-black rounded-[40px] border border-slate-900 relative overflow-hidden shadow-2xl group flex items-center justify-center">
        
        {!isScreenSharing ? (
          <div className="flex flex-col items-center justify-center text-center p-12">
            <div className="w-32 h-32 bg-slate-900 rounded-[48px] flex items-center justify-center mb-8 shadow-2xl border border-slate-800 group-hover:scale-105 transition-transform duration-500">
              <Share2 className="text-blue-500" size={56} />
            </div>
            <h3 className="text-4xl font-black text-white mb-4 tracking-tight">Pronto para Conectar</h3>
            <p className="text-slate-500 max-w-sm mb-12 text-lg leading-relaxed">
              Você está acessando a máquina <span className="text-white font-mono">{id}</span>. 
              Clique abaixo para iniciar o espelhamento.
            </p>
            <button 
              onClick={startScreenShare}
              className="bg-blue-600 hover:bg-blue-500 text-white px-12 py-6 rounded-3xl font-black text-xl flex items-center gap-4 transition-all shadow-2xl shadow-blue-600/30 active:scale-95"
            >
              <Camera size={24} />
              Iniciar Visualização
            </button>
          </div>
        ) : (
          <div className="w-full h-full relative flex items-center justify-center">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className={`w-full h-full object-contain ${isControlEnabled ? 'cursor-none' : 'cursor-default'}`}
            />
            
            {/* Overlay de Controle */}
            {isControlEnabled && (
              <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-blue-600 text-[10px] px-4 py-1.5 rounded-full font-black text-white tracking-widest shadow-2xl animate-pulse z-30">
                CONTROLE REMOTO ATIVO
              </div>
            )}
          </div>
        )}

        {/* Toolbar Flutuante */}
        {isScreenSharing && (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 z-40">
            <div className="bg-slate-950/80 backdrop-blur-2xl border border-slate-800 px-8 py-4 rounded-[32px] flex items-center gap-8 shadow-2xl">
              
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 mr-4">
                <Wifi size={14} />
                {latency.toFixed(0)}ms
              </div>

              <button 
                onClick={() => setIsControlEnabled(!isControlEnabled)}
                className={`flex flex-col items-center gap-1.5 transition-all ${isControlEnabled ? 'text-blue-500' : 'text-slate-500 hover:text-white'}`}
              >
                <MousePointer2 size={20} />
                <span className="text-[9px] uppercase font-black tracking-widest">Controle</span>
              </button>

              <button className="text-slate-500 hover:text-white flex flex-col items-center gap-1.5 transition-all">
                <Keyboard size={20} />
                <span className="text-[9px] uppercase font-black tracking-widest">Teclado</span>
              </button>

              <button 
                onClick={() => setShowChat(!showChat)}
                className={`flex flex-col items-center gap-1.5 transition-all ${showChat ? 'text-blue-500' : 'text-slate-500 hover:text-white'}`}
              >
                <MessageSquare size={20} />
                <span className="text-[9px] uppercase font-black tracking-widest">Chat</span>
              </button>

              <div className="h-8 w-[1px] bg-slate-800"></div>

              <button 
                onClick={stopScreenShare}
                className="text-red-500 hover:text-red-400 flex flex-col items-center gap-1.5 transition-all"
              >
                <X size={20} />
                <span className="text-[9px] uppercase font-black tracking-widest">Encerrar</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Chat Flutuante */}
      {showChat && (
        <div className="absolute right-12 bottom-32 w-80 h-96 z-50 animate-in slide-in-from-right-8 duration-300">
          <ChatBox />
        </div>
      )}

    </div>
  );
};

export default RemoteSession;
