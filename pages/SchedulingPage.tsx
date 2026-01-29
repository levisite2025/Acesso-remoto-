
import React, { useState } from 'react';
import { Calendar, Clock, User, Mail, MessageSquare, CheckCircle, ChevronRight, AlertCircle } from 'lucide-react';

const SchedulingPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    problemType: '',
    description: '',
    date: '',
    time: '',
    name: '',
    email: '',
  });

  const problemTypes = [
    'Instalação de Software',
    'Remoção de Vírus / Malware',
    'Desempenho do Sistema',
    'Problemas de Rede / Internet',
    'Diagnóstico de Hardware',
    'Consultoria Geral'
  ];

  const timeSlots = ['09:00', '10:30', '13:00', '14:30', '16:00'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(4); // Passo de sucesso
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-8 animate-in fade-in duration-700">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold text-white tracking-tight">Agendar Suporte</h1>
        <p className="text-slate-400">Assistência profissional na sua conveniência.</p>
      </div>

      {/* Indicador de Progresso */}
      <div className="flex items-center justify-center gap-4 mb-12">
        {[1, 2, 3].map((s) => (
          <React.Fragment key={s}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-all ${
              step >= s ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20' : 'border-slate-800 text-slate-600'
            }`}>
              {step > s ? <CheckCircle size={20} /> : s}
            </div>
            {s < 3 && <div className={`h-1 w-12 rounded-full transition-colors ${step > s ? 'bg-blue-600' : 'bg-slate-800'}`} />}
          </React.Fragment>
        ))}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-[32px] overflow-hidden shadow-2xl">
        {step === 1 && (
          <div className="p-8 md:p-12 space-y-8 animate-in slide-in-from-right-4 duration-300">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <MessageSquare className="text-blue-500" size={24} />
              Sobre o Problema
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Categoria do Problema</label>
                <select 
                  value={formData.problemType}
                  onChange={(e) => setFormData({...formData, problemType: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer"
                >
                  <option value="">Selecione uma categoria...</option>
                  {problemTypes.map(pt => <option key={pt} value={pt}>{pt}</option>)}
                </select>
              </div>
              <div className="space-y-2 col-span-1 md:col-span-2">
                <label className="text-sm font-medium text-slate-400">Descrição Breve</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={4}
                  placeholder="Descreva o que está acontecendo..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button 
                onClick={() => setStep(2)}
                disabled={!formData.problemType || !formData.description}
                className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all disabled:opacity-50"
              >
                Próximo Passo
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="p-8 md:p-12 space-y-8 animate-in slide-in-from-right-4 duration-300">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Calendar className="text-blue-500" size={24} />
              Selecione Data e Hora
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-sm font-medium text-slate-400">Escolha o Dia</label>
                <input 
                  type="date" 
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="space-y-4">
                <label className="text-sm font-medium text-slate-400">Horários Disponíveis</label>
                <div className="grid grid-cols-2 gap-3">
                  {timeSlots.map(time => (
                    <button
                      key={time}
                      onClick={() => setFormData({...formData, time})}
                      className={`py-3 rounded-xl text-sm font-bold border transition-all ${
                        formData.time === time 
                        ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20' 
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center pt-8 border-t border-slate-800">
              <button onClick={() => setStep(1)} className="text-slate-400 hover:text-white font-bold">Voltar</button>
              <button 
                onClick={() => setStep(3)}
                disabled={!formData.date || !formData.time}
                className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all disabled:opacity-50"
              >
                Continuar
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8 animate-in slide-in-from-right-4 duration-300">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <User className="text-blue-500" size={24} />
              Informações de Contato
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Nome Completo</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Seu Nome"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">E-mail</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 p-6 rounded-2xl">
              <h3 className="text-blue-400 font-bold mb-2 flex items-center gap-2">
                <AlertCircle size={18} />
                Confirmar Agendamento
              </h3>
              <p className="text-sm text-blue-300/80 leading-relaxed">
                Uma sessão será reservada para <span className="text-white font-bold">{formData.problemType}</span> em <span className="text-white font-bold">{formData.date}</span> às <span className="text-white font-bold">{formData.time}</span>. 
                Você receberá um e-mail de confirmação com os detalhes.
              </p>
            </div>

            <div className="flex justify-between items-center pt-8 border-t border-slate-800">
              <button type="button" onClick={() => setStep(2)} className="text-slate-400 hover:text-white font-bold">Voltar</button>
              <button 
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-600/20"
              >
                Confirmar Agendamento
              </button>
            </div>
          </form>
        )}

        {step === 4 && (
          <div className="p-16 text-center space-y-6 animate-in zoom-in duration-500">
            <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-emerald-500/30">
              <CheckCircle size={48} />
            </div>
            <h2 className="text-3xl font-bold text-white">Agendamento Confirmado!</h2>
            <p className="text-slate-400 max-w-sm mx-auto">
              Enviamos um e-mail de confirmação para <span className="text-white font-medium">{formData.email}</span>. Por favor, guarde-o para o momento da sessão.
            </p>
            <div className="pt-8">
              <button 
                onClick={() => setStep(1)}
                className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 rounded-xl font-bold transition-all"
              >
                Fazer Outro Agendamento
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchedulingPage;
