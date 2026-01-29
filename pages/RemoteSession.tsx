
import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Wifi, Square, AlertTriangle, ShieldCheck, MousePointer2, 
  Keyboard, Files, Mic, MicOff, MessageSquare, Settings2, Maximize2,
  Terminal, Activity, Lock, Monitor
} from 'lucide-react';

const RemoteSession: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [active, setActive] = useState(false);
  const [role, setRole] = useState<'client' | 'technician' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [logs, setLogs] = useState<string[]>([]);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const channelRef = useRef<BroadcastChannel | null>(null);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev.slice(-4), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  // Setup do canal de comunicação
  useEffect(() => {
    if (!id) return;
    
    const channel = new BroadcastChannel(`omni_session_${id}`);
    channelRef.current = channel;

    channel.onmessage = (event) => {
      const { type, payload } = event.data;
      if (type === 'PING_CLIENT') {
        if (role === 'client' && active) {
          channel.postMessage({ type: 'PONG_CLIENT', payload: { status: 'streaming' } });
        }
      }
      if (type === 'PONG_CLIENT' && role === 'technician') {
        addLog("Sinal do cliente detectado. Iniciando recepção...");
        setActive(true);
      }
      if (type === 'CHAT_MESSAGE') {
        addLog(`Mensagem: ${payload}`);
      }
    };

    return () => channel.close();
  }, [id, role, active]);

  const startAsClient = async () => {
    try {
      setError(null);
      addLog("Solicitando acesso à interface de vídeo...");
      const stream = await navigator.mediaDevices.getDisplayMedia({ 
        video: { cursor: "always" } as any,
        audio: true 
      });
      
      streamRef.current = stream;
      setRole('client');
      setActive(true);
      addLog("Transmissão iniciada. Aguardando técnico...");

      stream.getVideoTracks()[0].onended = () => endSession();
    } catch (err: any) {
      setError("Permissão de captura de tela negada.");
      addLog("ERRO: Captura cancelada.");
    }
  };

  const startAsTechnician = () => {
    setRole('technician');
    addLog(`Buscando sessão ${id}...`);
    channelRef.current?.postMessage({ type: 'PING_CLIENT' });
    
    // Timeout para simular busca
    setTimeout(() => {
      if (!active) {
        addLog("Aguardando o cliente aceitar a conexão...");
      }
    }, 1500);
  };

  const endSession = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
    }
    setActive(false);
    navigate('/');
  };

  useEffect(() => {
    if (active && videoRef.current && streamRef.current && role === 'client') {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(console.error);
    }
  }, [active, role]);

  const Tooltip = ({ text }: { text: string }) => (
    <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-slate-900/90 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none border border-slate-800 backdrop-blur-md shadow-2xl whitespace-nowrap scale-90 group-hover:scale-100">
      {text}
    </div>
  );

  return (
    <div className="h-full w-full bg-slate-950 flex flex-col overflow-hidden font-sans">
      {!role ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-slate-950 to-slate-950">
          <div className="w-20 h-20 bg-blue-600 rounded-[24px] flex items-center justify-center mb-8 shadow-2xl rotate-3">
            <Wifi className="text-white" size={32} />
          </div>
          <h2 className="text-3xl font-black text-white mb-2">Conexão Remota {id}</h2>
          <p className="text-slate-500 mb-10 max-w-sm">Como você deseja ingressar nesta sessão de suporte?</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
            <button 
              onClick={startAsClient}
              className="group bg-slate-900 border border-slate-800 p-6 rounded-3xl text-left hover:border-blue-500 transition-all"
            >
              <div className="w-10 h-10 bg-blue-600/10 text-blue-500 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <Activity size={20} />
              </div>
              <h3 className="font-bold text-white">Sou o Cliente</h3>
              <p className="text-xs text-slate-500 mt-1">Vou compartilhar minha tela para receber ajuda.</p>
            </button>

            <button 
              onClick={startAsTechnician}
              className="group bg-slate-900 border border-slate-800 p-6 rounded-3xl text-left hover:border-red-500 transition-all"
            >
              <div className="w-10 h-10 bg-red-600/10 text-red-500 rounded-xl flex items-center justify-center mb-4 group-hover:bg-red-600 group-hover:text-white transition-all">
                <ShieldCheck size={20} />
              </div>
              <h3 className="font-bold text-white">Sou o Técnico</h3>
              <p className="text-xs text-slate-500 mt-1">Vou visualizar e controlar o computador remoto.</p>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          {/* Header da Sessão */}
          <div className="h-14 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-blue-400">
                <Lock size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">AES-256 P2P</span>
              </div>
              <div className="h-4 w-px bg-slate-800"></div>
              <span className="text-xs font-bold text-slate-400">ID: {id}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 status-pulse"></div>
                <span className="text-[10px] font-black text-emerald-500 uppercase">Estável</span>
              </div>
              <button onClick={endSession} className="text-slate-500 hover:text-red-500 transition-colors">
                <Square size={16} fill="currentColor" />
              </button>
            </div>
          </div>

          <div className="flex-1 flex overflow-hidden">
            {/* Área Principal (Vídeo) */}
            <div className="flex-1 bg-black relative flex items-center justify-center group">
              {!active ? (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 border-4 border-slate-800 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
                  <p className="text-slate-500 font-mono text-xs">{role === 'technician' ? 'Aguardando handshake do cliente...' : 'Iniciando captura...'}</p>
                </div>
              ) : (
                <>
                  {role === 'client' ? (
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-contain" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900/50">
                      {/* Fixed: Monitor icon used on line 178 now correctly imported */}
                      <Monitor className="text-slate-800 mb-4" size={80} />
                      <p className="text-slate-500 font-bold">Visualização Remota Ativa</p>
                      <p className="text-[10px] text-slate-600 mt-2 font-mono italic">Simulação de recebimento de frames via WebRTC...</p>
                    </div>
                  )}
                </>
              )}

              {/* Console de Diagnóstico (Flutuante para o Técnico) */}
              {role === 'technician' && active && (
                <div className="absolute top-6 right-6 w-64 bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-2xl p-4 shadow-2xl space-y-4">
                  <div className="flex items-center gap-2 text-white font-bold text-[10px] uppercase tracking-widest border-b border-slate-800 pb-2">
                    <Terminal size={14} className="text-blue-500" /> Diagnóstico
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-[9px] text-slate-500 font-black mb-1 uppercase">CPU Usage <span className="text-blue-400">24%</span></div>
                      <div className="h-1 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-blue-500 w-[24%]"></div></div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[9px] text-slate-500 font-black mb-1 uppercase">Memory <span className="text-emerald-400">4.2 GB</span></div>
                      <div className="h-1 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 w-[60%]"></div></div>
                    </div>
                  </div>
                  <div className="pt-2">
                    <button className="w-full bg-blue-600/10 hover:bg-blue-600 text-blue-500 hover:text-white py-2 rounded-xl text-[10px] font-black uppercase transition-all">Ver Processos</button>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar de Logs/Eventos */}
            <div className="w-80 bg-slate-900/50 border-l border-slate-800 flex flex-col">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Eventos da Sessão</span>
                <Activity size={14} className="text-slate-600" />
              </div>
              <div className="flex-1 p-4 font-mono text-[10px] space-y-2 overflow-y-auto">
                {logs.map((log, i) => (
                  <div key={i} className="text-slate-400 border-l border-slate-800 pl-3 py-1">
                    {log}
                  </div>
                ))}
                {!active && <div className="text-blue-500 animate-pulse">_ Aguardando pacotes...</div>}
              </div>
              
              <div className="p-4 border-t border-slate-800 bg-slate-950/50">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span className="text-[10px] font-black text-slate-300 uppercase">Status: {active ? 'Online' : 'Conectando'}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                   <button className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-all relative group">
                    <Tooltip text="Injetar Script" /><Terminal size={16} />
                   </button>
                   <button className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-all relative group">
                    <Tooltip text="Transferência" /><Files size={16} />
                   </button>
                </div>
              </div>
            </div>
          </div>

          {/* Toolbar Inferior */}
          <div className="h-20 bg-slate-900 border-t border-slate-800 flex items-center justify-center px-8 relative">
             <div className="flex items-center gap-6">
                <button className="p-4 text-slate-400 hover:text-white hover:bg-white/5 rounded-2xl transition-all relative group">
                  <Tooltip text="Controle do Mouse" /><MousePointer2 size={24} />
                </button>
                <button className="p-4 text-slate-400 hover:text-white hover:bg-white/5 rounded-2xl transition-all relative group">
                  <Tooltip text="Sincronizar Teclado" /><Keyboard size={24} />
                </button>
                
                <div className="w-px h-10 bg-slate-800"></div>
                
                <button 
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-4 rounded-2xl transition-all relative group ${!isMuted ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                >
                  <Tooltip text={isMuted ? "Ativar Microfone" : "Mutar"} />
                  {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                </button>
                
                <button className="p-4 text-slate-400 hover:text-white hover:bg-white/5 rounded-2xl transition-all relative group">
                  <Tooltip text="Configurações" /><Settings2 size={24} />
                </button>

                <div className="w-px h-10 bg-slate-800"></div>

                <button 
                  onClick={endSession}
                  className="bg-red-600 hover:bg-red-500 text-white px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-red-600/20 active:scale-95 transition-all"
                >
                  Encerrar
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RemoteSession;
