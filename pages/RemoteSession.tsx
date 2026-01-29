import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Wifi, Square, ShieldCheck, MousePointer2, 
  Keyboard, Files, Mic, MicOff, Settings2,
  Terminal, Activity, Lock, Monitor, UserCheck, Radio, ShieldAlert,
  Play, Globe, Cpu, Zap
} from 'lucide-react';

const RemoteSession: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [active, setActive] = useState(false);
  const [role, setRole] = useState<'client' | 'technician' | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [logs, setLogs] = useState<string[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'searching' | 'negotiating' | 'authorized'>('idle');
  const [quality, setQuality] = useState('1080p');
  const [relayRegion, setRelayRegion] = useState('Sao Paulo, BR');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const channelRef = useRef<BroadcastChannel | null>(null);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev.slice(-8), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  useEffect(() => {
    if (!id) return;
    const channel = new BroadcastChannel(`omni_session_${id}`);
    channelRef.current = channel;

    channel.onmessage = (event) => {
      const { type, payload } = event.data;

      if (role === 'technician') {
        if (type === 'CLIENT_IS_READY') {
          addLog("Candidato ICE recebido do Cliente.");
          setConnectionStatus('negotiating');
          setTimeout(() => {
            addLog("Túnel externo estabelecido via Relay.");
            setConnectionStatus('authorized');
            setActive(true);
          }, 1500);
        }
      }

      if (role === 'client') {
        if (type === 'TECH_HANDSHAKE') {
          addLog("Solicitação de túnel de internet externa detectada.");
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
      addLog("Abrindo porta local de captura...");
      const stream = await navigator.mediaDevices.getDisplayMedia({ 
        video: { cursor: "always" } as any,
        audio: true 
      });
      streamRef.current = stream;
      setRole('client');
      setConnectionStatus('idle');
      addLog("Aguardando técnico iniciar handshake externo...");

      stream.getVideoTracks()[0].onended = () => endSession();
    } catch (err: any) {
      addLog("ERRO: Captura negada pelo OS.");
    }
  };

  const startAsTechnician = () => {
    setRole('technician');
    setConnectionStatus('searching');
    addLog(`Iniciando busca global por ID ${id}...`);
    
    const searchInterval = setInterval(() => {
      if (connectionStatus !== 'authorized') {
        addLog(`Pingando Servidor Relay (${relayRegion})...`);
        channelRef.current?.postMessage({ type: 'TECH_HANDSHAKE' });
      } else {
        clearInterval(searchInterval);
      }
    }, 3000);

    return () => clearInterval(searchInterval);
  };

  const endSession = () => {
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    setActive(false);
    navigate('/');
  };

  const Tooltip = ({ text }: { text: string }) => (
    <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-slate-900/90 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none border border-slate-800 backdrop-blur-md shadow-2xl whitespace-nowrap scale-90 group-hover:scale-100">
      {text}
    </div>
  );

  return (
    <div className="h-full w-full bg-[#020617] flex flex-col overflow-hidden font-sans">
      {!role ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-[#020617] to-[#020617]">
          <div className="w-24 h-24 bg-blue-600 rounded-[32px] flex items-center justify-center mb-8 shadow-2xl shadow-blue-600/30 rotate-3">
            <Wifi className="text-white" size={40} />
          </div>
          <h2 className="text-5xl font-black text-white mb-3 tracking-tighter">Gateway Remoto</h2>
          <p className="text-slate-500 mb-14 max-w-sm text-lg">Configurando túnel seguro para suporte via internet.</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-3xl px-4">
            <button onClick={startAsClient} className="group bg-slate-900/50 border border-slate-800 p-10 rounded-[40px] text-left hover:border-blue-500 hover:bg-blue-600/5 transition-all duration-500">
              <div className="w-14 h-14 bg-blue-600/10 text-blue-500 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-xl">
                <Monitor size={28} />
              </div>
              <h3 className="text-2xl font-black text-white">Modo Cliente</h3>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed">Gere o sinal de vídeo para receber ajuda externa de um técnico.</p>
            </button>

            <button onClick={startAsTechnician} className="group bg-slate-900/50 border border-slate-800 p-10 rounded-[40px] text-left hover:border-red-500 hover:bg-red-600/5 transition-all duration-500">
              <div className="w-14 h-14 bg-red-600/10 text-red-500 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-red-600 group-hover:text-white transition-all shadow-xl">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-2xl font-black text-white">Modo Técnico</h3>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed">Conecte via internet externa para controlar o dispositivo remoto.</p>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          {/* Header Superior - Contexto de Rede */}
          <div className="h-16 bg-slate-900/40 backdrop-blur-xl border-b border-slate-800 px-8 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full ${active ? 'bg-emerald-500 status-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-amber-500 animate-pulse'}`}></div>
                <span className="text-[10px] font-black text-white uppercase tracking-widest">
                  {active ? `Link Estável • ${quality}` : 'Negociando NAT...'}
                </span>
              </div>
              <div className="h-4 w-px bg-slate-800"></div>
              <div className="flex items-center gap-3 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                <Globe size={14} className="text-blue-500" />
                Relay: <span className="text-slate-200">{relayRegion}</span>
              </div>
              <div className="hidden md:flex items-center gap-3 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                <Lock size={14} className="text-emerald-500" />
                Criptografia: <span className="text-slate-200">AES-256-GCM</span>
              </div>
            </div>
            
            <button onClick={endSession} className="bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white p-2.5 rounded-xl transition-all border border-red-500/20 shadow-lg">
              <Square size={18} fill="currentColor" />
            </button>
          </div>

          <div className="flex-1 flex overflow-hidden">
            {/* Viewport Principal */}
            <div className="flex-1 bg-black relative flex items-center justify-center group overflow-hidden">
              <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
              
              {!active ? (
                <div className="flex flex-col items-center text-center max-w-md animate-in fade-in duration-700">
                  <div className="relative mb-12">
                    <div className="absolute inset-0 bg-blue-600/20 rounded-full animate-ping"></div>
                    <div className="w-28 h-28 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center relative shadow-2xl">
                      <Zap className="text-blue-500 animate-pulse" size={48} />
                    </div>
                  </div>
                  <h3 className="text-3xl font-black text-white mb-4">Sincronizando Túnel</h3>
                  <div className="w-64 h-1.5 bg-slate-900 rounded-full mb-6 overflow-hidden border border-slate-800">
                    <div className="h-full bg-blue-600 w-1/3 animate-[loading_2s_ease-in-out_infinite]"></div>
                  </div>
                  <style>{`
                    @keyframes loading {
                      0% { transform: translateX(-100%); }
                      100% { transform: translateX(300%); }
                    }
                  `}</style>
                  <p className="text-slate-500 text-sm leading-relaxed px-8">
                    {role === 'technician' 
                      ? 'Atravessando firewalls externos e resolvendo endereços IP via STUN/TURN...' 
                      : 'Sua interface está capturada. Aguardando o túnel do técnico ser estabelecido pela rede externa.'}
                  </p>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center relative bg-slate-950/50">
                  {role === 'client' ? (
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-contain" />
                  ) : (
                    <div className="flex flex-col items-center gap-10">
                      <div className="relative">
                        <Monitor className="text-slate-800" size={180} />
                        <div className="absolute inset-0 flex items-center justify-center">
                           <ShieldCheck size={40} className="text-blue-600/20" />
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-slate-200 font-black text-3xl tracking-tight">Terminal Remoto Ativo</p>
                        <p className="text-[10px] text-slate-500 font-black mt-4 tracking-[0.4em] uppercase">Transferência Encriptada de Alta Performance</p>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                        {[
                          { label: 'Loss', val: '0.01%', icon: Activity },
                          { label: 'Jitter', val: '2ms', icon: Zap },
                          { label: 'Bitrate', val: '12Mbps', icon: Cpu },
                          { label: 'IP', val: '187.64.XX', icon: Globe }
                        ].map((stat, i) => (
                          <div key={i} className="bg-slate-900/80 border border-slate-800 p-4 rounded-3xl w-40">
                            <div className="flex items-center gap-2 mb-2">
                              <stat.icon size={12} className="text-blue-500" />
                              <span className="text-[9px] font-black text-slate-500 uppercase">{stat.label}</span>
                            </div>
                            <p className="text-lg font-mono text-white font-bold">{stat.val}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar de Infraestrutura */}
            <div className="w-80 bg-slate-900/50 border-l border-slate-800 flex flex-col backdrop-blur-xl">
              <div className="p-6 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal size={14} className="text-blue-500" />
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Network Console</span>
                </div>
                <div className="flex gap-1">
                  <div className="w-1 h-3 bg-emerald-500 rounded-full"></div>
                  <div className="w-1 h-3 bg-emerald-500 rounded-full"></div>
                  <div className="w-1 h-3 bg-slate-800 rounded-full"></div>
                </div>
              </div>
              
              <div className="flex-1 p-6 font-mono text-[10px] space-y-4 overflow-y-auto scrollbar-hide">
                {logs.map((log, i) => (
                  <div key={i} className="flex gap-3 group animate-in slide-in-from-left-2">
                    <span className="text-blue-600/40 select-none">$</span>
                    <span className="text-slate-400 group-last:text-blue-300 leading-relaxed">{log}</span>
                  </div>
                ))}
                {!active && role === 'technician' && (
                  <div className="text-amber-500/80 animate-pulse mt-6 flex items-center gap-2">
                    <span className="w-1 h-1 bg-amber-500 rounded-full"></span>
                    Handshake externo pendente...
                  </div>
                )}
              </div>

              <div className="p-6 bg-slate-950 border-t border-slate-800 space-y-6">
                <div>
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-3">Qualidade de Vídeo</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['720p', '1080p', '4K', 'Auto'].map(q => (
                      <button 
                        key={q} 
                        onClick={() => setQuality(q)}
                        className={`py-2 rounded-xl text-[10px] font-black border transition-all ${quality === q ? 'bg-blue-600 border-blue-600 text-white' : 'bg-slate-900 border-slate-800 text-slate-500'}`}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="pt-4 border-t border-slate-900">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[9px] font-black text-slate-500 uppercase">Integridade do Túnel</span>
                    <span className="text-[9px] font-bold text-emerald-500">99.9%</span>
                  </div>
                  <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div className={`h-full transition-all duration-1000 ${active ? 'bg-emerald-500 w-full' : 'bg-amber-500 w-1/3 animate-pulse'}`}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Toolbar Inferior Profissional */}
          <div className="h-24 bg-slate-950 border-t border-slate-800 flex items-center justify-center px-8">
             <div className="flex items-center gap-4 bg-slate-900/60 p-2.5 rounded-[30px] border border-slate-800 shadow-2xl backdrop-blur-md">
                <div className="flex items-center gap-1">
                  <button className="p-4 text-slate-400 hover:text-white hover:bg-blue-600/10 rounded-2xl transition-all relative group">
                    <Tooltip text="Injeção HID" /><Keyboard size={22} />
                  </button>
                  <button className="p-4 text-slate-400 hover:text-white hover:bg-blue-600/10 rounded-2xl transition-all relative group">
                    <Tooltip text="Shell Remoto" /><Terminal size={22} />
                  </button>
                </div>
                
                <div className="w-px h-10 bg-slate-800 mx-1"></div>
                
                <div className="flex items-center gap-1">
                  <button onClick={() => setIsMuted(!isMuted)} className={`p-4 rounded-2xl transition-all relative group ${!isMuted ? 'bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.3)]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                    <Tooltip text={isMuted ? "Habilitar Áudio" : "Silenciar"} />
                    {isMuted ? <MicOff size={22} /> : <Mic size={22} />}
                  </button>
                  <button className="p-4 text-slate-400 hover:text-white hover:bg-blue-600/10 rounded-2xl transition-all relative group">
                    <Tooltip text="Cloud Transfer" /><Files size={22} />
                  </button>
                  <button className="p-4 text-slate-400 hover:text-white hover:bg-blue-600/10 rounded-2xl transition-all relative group">
                    <Tooltip text="Settings" /><Settings2 size={22} />
                  </button>
                </div>

                <div className="w-px h-10 bg-slate-800 mx-1"></div>

                <button 
                  onClick={endSession}
                  className="bg-red-600 hover:bg-red-500 text-white px-10 h-14 rounded-[22px] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-red-600/20 active:scale-95 transition-all flex items-center gap-4"
                >
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  Kill Session
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RemoteSession;