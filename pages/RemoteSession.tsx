import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Wifi, Square, AlertTriangle, ShieldCheck, MousePointer2, 
  Keyboard, Files, Mic, MicOff, MessageSquare, Settings2, Maximize2,
  Terminal, Activity, Lock, Monitor, UserCheck, Radio, ShieldAlert,
  Play
} from 'lucide-react';

const RemoteSession: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [active, setActive] = useState(false);
  const [role, setRole] = useState<'client' | 'technician' | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [logs, setLogs] = useState<string[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'searching' | 'waiting_release' | 'authorized'>('idle');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const channelRef = useRef<BroadcastChannel | null>(null);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev.slice(-6), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  // Setup do canal de comunicação e Handshake robusto
  useEffect(() => {
    if (!id) return;
    
    const channel = new BroadcastChannel(`omni_session_${id}`);
    channelRef.current = channel;

    channel.onmessage = (event) => {
      const { type, payload } = event.data;

      // Se eu sou TÉCNICO
      if (role === 'technician') {
        if (type === 'CLIENT_IS_READY') {
          addLog("Cliente liberou acesso!");
          setConnectionStatus('authorized');
          setActive(true);
        }
        if (type === 'CLIENT_STOPPED') {
          addLog("Cliente encerrou a transmissão.");
          setActive(false);
          setConnectionStatus('searching');
        }
      }

      // Se eu sou CLIENTE
      if (role === 'client') {
        if (type === 'TECH_LOOKING_FOR_ID') {
          addLog("Técnico detectado tentando conectar...");
          // Se o cliente já estiver com a tela capturada, ele responde
          if (streamRef.current) {
            channel.postMessage({ type: 'CLIENT_IS_READY' });
          }
        }
      }
    };

    return () => channel.close();
  }, [id, role]);

  const startAsClient = async () => {
    try {
      addLog("Iniciando módulo de captura...");
      const stream = await navigator.mediaDevices.getDisplayMedia({ 
        video: { cursor: "always" } as any,
        audio: true 
      });
      
      streamRef.current = stream;
      setRole('client');
      setConnectionStatus('waiting_release'); // Esperando o clique final de liberação
      addLog("Captura de tela iniciada. Aguardando liberação final...");

      stream.getVideoTracks()[0].onended = () => {
        channelRef.current?.postMessage({ type: 'CLIENT_STOPPED' });
        endSession();
      };
    } catch (err: any) {
      addLog("ERRO: Captura de tela não autorizada pelo navegador.");
    }
  };

  const releaseToTechnician = () => {
    if (role === 'client' && streamRef.current) {
      setActive(true);
      setConnectionStatus('authorized');
      addLog("Sinal de liberação enviado ao canal seguro.");
      channelRef.current?.postMessage({ type: 'CLIENT_IS_READY' });
      
      if (videoRef.current) {
        videoRef.current.srcObject = streamRef.current;
        videoRef.current.play().catch(console.error);
      }
    }
  };

  const startAsTechnician = () => {
    setRole('technician');
    setConnectionStatus('searching');
    addLog(`Procurando por sinal do cliente no ID ${id}...`);
    
    // Broadcast contínuo de "Estou procurando" para acordar o cliente
    const searchInterval = setInterval(() => {
      if (connectionStatus !== 'authorized') {
        channelRef.current?.postMessage({ type: 'TECH_LOOKING_FOR_ID' });
      } else {
        clearInterval(searchInterval);
      }
    }, 2000);

    return () => clearInterval(searchInterval);
  };

  const endSession = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
    }
    setActive(false);
    navigate('/');
  };

  const Tooltip = ({ text }: { text: string }) => (
    <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-slate-900/90 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none border border-slate-800 backdrop-blur-md shadow-2xl whitespace-nowrap scale-90 group-hover:scale-100">
      {text}
    </div>
  );

  return (
    <div className="h-full w-full bg-slate-950 flex flex-col overflow-hidden font-sans">
      {!role ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
          <div className="w-20 h-20 bg-blue-600 rounded-[28px] flex items-center justify-center mb-8 shadow-2xl animate-bounce">
            <Wifi className="text-white" size={32} />
          </div>
          <h2 className="text-4xl font-black text-white mb-2 tracking-tight">Sala de Suporte {id}</h2>
          <p className="text-slate-500 mb-12 max-w-sm">Escolha sua função para estabelecer a conexão.</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl px-4">
            <button 
              onClick={startAsClient}
              className="group bg-slate-900 border border-slate-800 p-8 rounded-[32px] text-left hover:border-blue-500 hover:bg-blue-500/5 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-blue-600/10 text-blue-500 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <Monitor size={24} />
              </div>
              <h3 className="text-xl font-bold text-white">Preciso de Ajuda</h3>
              <p className="text-sm text-slate-500 mt-2">Vou compartilhar minha tela para que o técnico possa resolver meu problema.</p>
            </button>

            <button 
              onClick={startAsTechnician}
              className="group bg-slate-900 border border-slate-800 p-8 rounded-[32px] text-left hover:border-emerald-500 hover:bg-emerald-500/5 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-emerald-600/10 text-emerald-500 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-bold text-white">Sou o Técnico</h3>
              <p className="text-sm text-slate-500 mt-2">Vou conectar ao ID informado pelo cliente para prestar suporte remoto.</p>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          {/* Header Superior */}
          <div className="h-16 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 px-8 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full ${active ? 'bg-emerald-500 status-pulse' : 'bg-amber-500 animate-pulse'}`}></div>
                <span className="text-xs font-black text-white uppercase tracking-[0.2em]">
                  {active ? 'Conexão Ativa' : 'Aguardando Handshake'}
                </span>
              </div>
              <div className="h-6 w-px bg-slate-800"></div>
              <div className="flex items-center gap-3 text-slate-500 font-mono text-xs">
                <Lock size={14} className="text-blue-500" />
                SESSÃO: <span className="text-slate-300">{id}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={endSession}
                className="bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white p-2.5 rounded-xl transition-all border border-red-500/20"
              >
                <Square size={18} fill="currentColor" />
              </button>
            </div>
          </div>

          <div className="flex-1 flex overflow-hidden">
            {/* Área de Vídeo / Radar */}
            <div className="flex-1 bg-black relative flex items-center justify-center">
              {!active ? (
                <div className="flex flex-col items-center text-center p-12">
                  <div className="relative mb-8">
                    <div className="absolute inset-0 bg-blue-600/20 rounded-full animate-ping"></div>
                    <div className="w-24 h-24 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center relative">
                      <Radio className="text-blue-500 animate-pulse" size={40} />
                    </div>
                  </div>
                  
                  {role === 'client' && connectionStatus === 'waiting_release' ? (
                    <div className="space-y-6 animate-in fade-in zoom-in duration-500">
                      <h3 className="text-2xl font-bold text-white">Tela Capturada!</h3>
                      <p className="text-slate-500 max-w-xs text-sm">
                        Clique no botão abaixo para liberar o sinal para o técnico entrar na sessão.
                      </p>
                      <button 
                        onClick={releaseToTechnician}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-[0.2em] flex items-center gap-3 mx-auto shadow-2xl shadow-blue-600/20 active:scale-95 transition-all"
                      >
                        <Play size={18} fill="currentColor" />
                        Liberar para o Técnico
                      </button>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {role === 'technician' ? 'Buscando sinal do cliente...' : 'Aguardando Técnico...'}
                      </h3>
                      <p className="text-slate-500 max-w-xs text-sm">
                        {role === 'technician' 
                          ? 'O cliente precisa liberar o acesso no portal dele para o sinal aparecer.' 
                          : 'Inicie a captura de tela e clique em liberar para o técnico visualizar.'}
                      </p>
                    </>
                  )}
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900/40">
                  {role === 'client' ? (
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-contain" />
                  ) : (
                    <div className="flex flex-col items-center gap-6">
                      <Monitor className="text-blue-600/20" size={160} />
                      <div className="text-center">
                        <p className="text-slate-200 font-bold text-2xl">Visualização Remota Estabelecida</p>
                        <p className="text-xs text-slate-500 font-mono mt-3 tracking-[0.3em] uppercase">Transferência P2P via Canal de Dados Ativo</p>
                      </div>
                      
                      <div className="mt-12 grid grid-cols-2 gap-4">
                        <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-3xl w-56">
                          <div className="flex items-center gap-2 mb-3">
                            <Activity size={12} className="text-emerald-500" />
                            <span className="text-[10px] font-black text-slate-500 uppercase">Saúde do Link</span>
                          </div>
                          <div className="flex justify-between items-end">
                            <span className="text-lg font-mono text-white">98%</span>
                            <div className="flex gap-0.5 mb-1">
                              {[1,2,3,4,5].map(i => <div key={i} className="w-1 h-3 bg-emerald-500 rounded-full"></div>)}
                            </div>
                          </div>
                        </div>
                        <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-3xl w-56">
                          <div className="flex items-center gap-2 mb-3">
                            <Radio size={12} className="text-blue-500" />
                            <span className="text-[10px] font-black text-slate-500 uppercase">Criptografia</span>
                          </div>
                          <p className="text-sm font-mono text-blue-400">CHACHA20-POLY1305</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar de Console */}
            <div className="w-80 bg-slate-900/30 border-l border-slate-800 flex flex-col">
              <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
                <div className="flex items-center gap-2">
                  <Terminal size={14} className="text-slate-500" />
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Logs de Sincronia</span>
                </div>
                <div className="w-2 h-2 rounded-full bg-emerald-500 status-pulse"></div>
              </div>
              
              <div className="flex-1 p-6 font-mono text-[10px] space-y-3 overflow-y-auto scrollbar-hide">
                {logs.map((log, i) => (
                  <div key={i} className="flex gap-2 group border-b border-slate-800/20 pb-2">
                    <span className="text-blue-600/50 shrink-0">#</span>
                    <span className="text-slate-400 group-last:text-blue-300 transition-colors">{log}</span>
                  </div>
                ))}
                {!active && role === 'technician' && (
                  <div className="text-amber-500 animate-pulse mt-4">_ Verificando disponibilidade do ID...</div>
                )}
              </div>

              <div className="p-6 bg-slate-950 border-t border-slate-800">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-500 uppercase">Status do Barramento</span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded ${active ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                      {active ? 'ATIVO' : 'BUSCANDO'}
                    </span>
                  </div>
                  <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-1000 ${active ? 'bg-emerald-500 w-full' : 'bg-amber-500 w-1/3 animate-pulse'}`}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Barra de Ferramentas */}
          <div className="h-24 bg-slate-950 border-t border-slate-800 flex items-center justify-center relative">
             <div className="flex items-center gap-4 bg-slate-900/50 p-2 rounded-[28px] border border-slate-800 shadow-2xl">
                <div className="flex items-center gap-1">
                  <button className="p-4 text-slate-400 hover:text-white hover:bg-white/5 rounded-2xl transition-all relative group">
                    <Tooltip text="Capturar Teclado" /><Keyboard size={22} />
                  </button>
                  <button className="p-4 text-slate-400 hover:text-white hover:bg-white/5 rounded-2xl transition-all relative group">
                    <Tooltip text="Injetar Scripts" /><Terminal size={22} />
                  </button>
                </div>
                
                <div className="w-px h-10 bg-slate-800"></div>
                
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => setIsMuted(!isMuted)}
                    className={`p-4 rounded-2xl transition-all relative group ${!isMuted ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                  >
                    <Tooltip text={isMuted ? "Ouvir Remoto" : "Silenciar"} />
                    {isMuted ? <MicOff size={22} /> : <Mic size={22} />}
                  </button>
                  <button className="p-4 text-slate-400 hover:text-white hover:bg-white/5 rounded-2xl transition-all relative group">
                    <Tooltip text="Arquivos" /><Files size={22} />
                  </button>
                </div>

                <div className="w-px h-10 bg-slate-800"></div>

                <button 
                  onClick={endSession}
                  className="bg-red-600 hover:bg-red-500 text-white px-10 h-14 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-red-600/20 active:scale-95 transition-all flex items-center gap-3"
                >
                  <Square size={16} fill="currentColor" />
                  Encerrar Sessão
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RemoteSession;