import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Wifi, Square, AlertTriangle, ShieldCheck, MousePointer2, 
  Keyboard, Files, Mic, MicOff, MessageSquare, Settings2, Maximize2 
} from 'lucide-react';

const RemoteSession: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [active, setActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true); 
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Sincroniza o stream com o elemento de vídeo de forma resiliente
  useEffect(() => {
    if (active && videoRef.current && streamRef.current) {
      const video = videoRef.current;
      video.srcObject = streamRef.current;
      
      const playVideo = async () => {
        try {
          await video.play();
        } catch (e) {
          console.warn("Autoplay bloqueado pelo navegador. O vídeo iniciará após interação ou mutado.");
        }
      };

      video.onloadedmetadata = playVideo;
      playVideo();
    }
  }, [active]);

  const startSession = async () => {
    try {
      setError(null);
      // Solicita a captura de tela com configurações otimizadas
      const stream = await navigator.mediaDevices.getDisplayMedia({ 
        video: { 
          cursor: "always",
          frameRate: { ideal: 30 }
        } as any,
        audio: true 
      });
      
      streamRef.current = stream;
      setActive(true);

      // Detecta quando o compartilhamento é interrompido externamente
      stream.getVideoTracks()[0].onended = () => {
        endSession();
      };
    } catch (err: any) {
      console.error("Erro na captura de tela:", err);
      setError("Permissão negada. É necessário autorizar o compartilhamento de tela para que o suporte remoto funcione.");
    }
  };

  const endSession = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setActive(false);
    navigate('/');
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  const Tooltip = ({ text }: { text: string }) => (
    <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-slate-900/90 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none border border-slate-800 backdrop-blur-md shadow-2xl whitespace-nowrap scale-90 group-hover:scale-100">
      {text}
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 border-b border-r border-slate-800 rotate-45"></div>
    </div>
  );

  return (
    <div className="h-full w-full bg-slate-950 flex flex-col overflow-hidden">
      {!active ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
          <div className="w-24 h-24 bg-blue-600 rounded-[32px] flex items-center justify-center mb-8 shadow-2xl shadow-blue-600/30">
            <Wifi className="text-white" size={40} />
          </div>
          
          <h2 className="text-4xl font-black text-white mb-4 tracking-tight">Portal de Conexão: {id}</h2>
          <p className="text-slate-500 mb-12 max-w-sm text-lg">
            Você está prestes a iniciar uma transmissão segura. Clique no botão abaixo para autorizar o técnico.
          </p>

          {error && (
            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-sm max-w-md">
              <AlertTriangle size={20} className="shrink-0" />
              <p className="font-medium text-left">{error}</p>
            </div>
          )}

          <div className="flex flex-col gap-4 w-full max-w-xs">
            <button 
              onClick={startSession}
              className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-black text-xl hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20 active:scale-95"
            >
              Liberar Acesso
            </button>
            <button 
              onClick={() => navigate('/')}
              className="bg-slate-900 text-slate-400 px-10 py-4 rounded-2xl font-bold hover:text-white transition-all"
            >
              Cancelar
            </button>
          </div>
          
          <div className="mt-16 flex items-center gap-2 text-xs font-bold text-slate-600 uppercase tracking-widest">
            <ShieldCheck size={14} />
            Identidade de Sessão Verificada
          </div>
        </div>
      ) : (
        <div className="relative flex-1 bg-black overflow-hidden flex items-center justify-center animate-in fade-in duration-1000">
          {/* Muted e playsInline garantem que o vídeo apareça sem ser bloqueado pelo navegador */}
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted={isMuted}
            className="w-full h-full object-contain pointer-events-none"
          />
          
          {/* HUD de Status */}
          <div className="absolute top-6 left-6 right-6 flex items-center justify-between pointer-events-none">
            <div className="bg-red-600/90 backdrop-blur-md px-5 py-2.5 rounded-2xl flex items-center gap-3 border border-red-500 shadow-2xl">
              <div className="w-2 h-2 rounded-full bg-white status-pulse"></div>
              <span className="text-[11px] font-black text-white uppercase tracking-widest">EM ATENDIMENTO • {id}</span>
            </div>
          </div>

          {/* Ferramentas do Técnico */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-fit">
            <div className="bg-slate-950/80 backdrop-blur-2xl border border-white/5 px-6 py-3 rounded-3xl flex items-center gap-4 shadow-2xl">
              <div className="flex items-center gap-1">
                <button className="relative group p-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-2xl transition-all">
                  <Tooltip text="Controle Remoto" /><MousePointer2 size={22} />
                </button>
                <button className="relative group p-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-2xl transition-all">
                  <Tooltip text="Enviar Comandos" /><Keyboard size={22} />
                </button>
              </div>

              <div className="w-px h-8 bg-white/10 mx-1"></div>

              <div className="flex items-center gap-1">
                <button className="relative group p-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-2xl transition-all">
                  <Tooltip text="Transferir Arquivo" /><Files size={22} />
                </button>
                <button 
                  onClick={() => setIsMuted(!isMuted)}
                  className={`relative group p-3 rounded-2xl transition-all ${isMuted ? 'text-red-400 bg-red-400/10' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                >
                  <Tooltip text={isMuted ? "Ouvir Remoto" : "Silenciar"} />
                  {isMuted ? <MicOff size={22} /> : <Mic size={22} />}
                </button>
                <button className="relative group p-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-2xl transition-all">
                  <Tooltip text="Mensagem de Texto" /><MessageSquare size={22} />
                </button>
              </div>

              <div className="w-px h-8 bg-white/10 mx-1"></div>

              <div className="flex items-center gap-1">
                <button className="relative group p-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-2xl transition-all">
                  <Tooltip text="Configurações de Fluxo" /><Settings2 size={22} />
                </button>
                <button className="relative group p-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-2xl transition-all">
                  <Tooltip text="Maximizar" /><Maximize2 size={22} />
                </button>
              </div>

              <div className="w-px h-8 bg-white/10 mx-1"></div>
              
              <button 
                onClick={endSession}
                className="bg-red-600 hover:bg-red-500 text-white p-3.5 rounded-2xl shadow-lg transition-all active:scale-90"
              >
                <Tooltip text="Desconectar" />
                <Square size={20} fill="currentColor" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RemoteSession;