
import React, { useState } from 'react';
import { Send, User, Bot } from 'lucide-react';

const ChatBox: React.FC = () => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'system', text: 'Sessão segura estabelecida.', time: '14:20' },
    { id: 2, sender: 'agent', text: 'Olá! Estou notando um alto uso de CPU do seu lado. Você iniciou alguma atualização recentemente?', time: '14:21' },
    { id: 3, sender: 'client', text: 'Sim, tentei instalar um patch de segurança e o sistema travou.', time: '14:22' },
  ]);
  const [input, setInput] = useState('');

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { 
      id: Date.now(), 
      sender: 'agent', 
      text: input, 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    }]);
    setInput('');
  };

  return (
    <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col min-h-0">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <h3 className="font-bold text-white text-sm">Chat da Sessão</h3>
        <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded uppercase tracking-wider font-bold">Criptografado</span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.sender === 'agent' ? 'items-end' : 'items-start'}`}>
            {msg.sender === 'system' ? (
              <div className="w-full text-center">
                <span className="text-[10px] text-slate-500 bg-slate-800 px-2 py-1 rounded-full">{msg.text}</span>
              </div>
            ) : (
              <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                msg.sender === 'agent' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-slate-800 text-slate-300 rounded-tl-none'
              }`}>
                {msg.text}
                <div className={`text-[10px] mt-1 opacity-60 ${msg.sender === 'agent' ? 'text-right' : 'text-left'}`}>
                  {msg.time}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} className="p-4 border-t border-slate-800">
        <div className="relative">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite uma mensagem..." 
            className="w-full bg-slate-950 border-none rounded-xl py-3 pl-4 pr-12 text-sm text-white placeholder-slate-600 focus:ring-1 focus:ring-blue-500"
          />
          <button 
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-blue-500 hover:text-blue-400 transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatBox;
