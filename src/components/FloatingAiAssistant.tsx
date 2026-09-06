import React, { useEffect, useState } from 'react';
import { Bot, X, Send, Sparkles, RefreshCw } from 'lucide-react';

export const FloatingAiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: 'user' | 'nova'; text: string }[]>([
    { sender: 'nova', text: 'Hi — I’m Nova. Ask me a compliance question in plain English, or upload your HR documents and I’ll help you review them.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const open = () => setIsOpen(true);
    window.addEventListener('complyos:open-chat', open);
    return () => window.removeEventListener('complyos:open-chat', open);
  }, []);

  const handleSend = async (preset?: string) => {
    const userText = (preset ?? input).trim();
    if (!userText || loading) return;
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: userText }) });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || 'Chat request failed');
      setMessages(prev => [...prev, { sender: 'nova', text: data.reply || 'I could not produce an answer.' }]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'nova', text: err instanceof Error ? err.message : 'Chat is temporarily unavailable.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 font-sans">
      {!isOpen ? (
        <button onClick={() => setIsOpen(true)} className="flex items-center gap-2 rounded-full border border-indigo-400/40 bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-3 text-xs font-bold text-white shadow-2xl transition hover:scale-105">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20"><Bot className="h-4 w-4" /></div><span>Chat with Nova</span><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-300" />
        </button>
      ) : (
        <div className="w-[calc(100vw-2.5rem)] max-w-sm rounded-2xl border border-indigo-200 bg-white p-4 text-slate-900 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white"><Bot className="h-4 w-4" /></div><div><div className="text-xs font-black">Nova</div><div className="text-[10px] text-slate-500">HR compliance assistant</div></div></div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-700"><X className="h-4 w-4" /></button>
          </div>
          <div className="mt-3 h-64 space-y-2 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs">
            {messages.map((m, i) => <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[88%] rounded-xl p-2.5 ${m.sender === 'user' ? 'bg-indigo-600 text-white' : 'border border-slate-200 bg-white text-slate-800'}`}>{m.text}</div></div>)}
            {messages.length === 1 && <div className="flex flex-wrap gap-2 pt-1"><button onClick={() => void handleSend('What should an HR team check in employment contracts?')} className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[10px] font-semibold text-slate-700">Review contracts</button><button onClick={() => void handleSend('What evidence should we keep for POSH compliance?')} className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[10px] font-semibold text-slate-700">POSH evidence</button><button onClick={() => void handleSend('What changed under the Labour Codes?')} className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[10px] font-semibold text-slate-700">Labour Codes</button></div>}
            {loading && <div className="flex items-center gap-1 text-[11px] text-indigo-600"><RefreshCw className="h-3 w-3 animate-spin" /> Nova is thinking…</div>}
          </div>
          <div className="mt-3 flex items-center gap-1.5"><input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && void handleSend()} placeholder="Ask anything about HR compliance…" className="flex-1 rounded-xl border border-slate-300 bg-white p-2.5 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none" /><button onClick={() => void handleSend()} disabled={loading} className="rounded-xl bg-indigo-600 p-2.5 text-white disabled:opacity-50"><Send className="h-3.5 w-3.5" /></button></div>
          <div className="mt-2 flex items-center gap-1 text-[9px] text-slate-400"><Sparkles className="h-3 w-3" /> AI-assisted answers require verification for material legal decisions.</div>
        </div>
      )}
    </div>
  );
};
