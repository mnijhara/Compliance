import React, { useState } from 'react';
import { Bot, X, Send, RefreshCw } from 'lucide-react';

export const FloatingAiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: 'user' | 'nova'; text: string }[]>([
    { sender: 'nova', text: 'Hi — I’m Nova. Ask me a compliance question, or tell me what document you are reviewing.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userText = input.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: userText }) });
      const data = await res.json().catch(() => null);
      setMessages(prev => [...prev, { sender: 'nova', text: data?.reply || data?.error || 'Nova could not answer that right now.' }]);
    } catch {
      setMessages(prev => [...prev, { sender: 'nova', text: 'Nova is temporarily unavailable. You can still review an existing document with Upload & Review.' }]);
    } finally {
      setLoading(false);
    }
  };

  const quickQuestions = ['What should I check in an employment contract?', 'What evidence should HR keep?', 'Explain the Labour Codes simply'];

  return (
    <div className="fixed bottom-5 right-5 z-50 font-sans">
      {!isOpen ? (
        <button id="nova-chat-trigger" aria-label="Open Nova compliance chat" onClick={() => setIsOpen(true)} className="flex items-center gap-2 rounded-full border border-indigo-400/40 bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-3 text-xs font-bold text-white shadow-2xl transition hover:scale-105">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20"><Bot className="h-4 w-4" /></span><span>Ask Nova</span><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-300" />
        </button>
      ) : (
        <div className="w-[min(92vw,400px)] overflow-hidden rounded-2xl border border-indigo-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between bg-slate-900 px-4 py-3 text-white"><div className="flex items-center gap-2"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600"><Bot className="h-4 w-4" /></span><div><div className="text-xs font-bold">Nova · Compliance Chat</div><div className="text-[10px] text-slate-300">Ask first. Upload when you’re ready.</div></div></div><button aria-label="Close Nova chat" onClick={() => setIsOpen(false)} className="text-slate-300 hover:text-white"><X className="h-4 w-4" /></button></div>
          <div className="max-h-80 space-y-2 overflow-y-auto bg-slate-50 p-3 text-xs">
            {messages.map((m, i) => <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[88%] rounded-xl px-3 py-2.5 ${m.sender === 'user' ? 'bg-indigo-600 text-white' : 'border border-slate-200 bg-white text-slate-800'}`}>{m.text}</div></div>)}
            {messages.length === 1 && <div className="grid gap-2 pt-1">{quickQuestions.map(question => <button key={question} onClick={() => setInput(question)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-left text-[11px] font-semibold text-slate-600 hover:border-indigo-200 hover:text-indigo-700">{question}</button>)}</div>}
            {loading && <div className="flex items-center gap-1 text-[11px] text-indigo-600"><RefreshCw className="h-3 w-3 animate-spin" /> Nova is thinking…</div>}
          </div>
          <div className="border-t border-slate-200 bg-white p-3"><div className="flex items-center gap-2"><input aria-label="Ask Nova" type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="Ask anything about HR compliance…" className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none" /><button aria-label="Send message" onClick={handleSend} disabled={loading || !input.trim()} className="rounded-xl bg-indigo-600 p-2.5 text-white disabled:opacity-40"><Send className="h-3.5 w-3.5" /></button></div><div className="mt-2 text-[9px] text-slate-400">Nova assists with research and document review; material legal conclusions still require source verification.</div></div>
        </div>
      )}
    </div>
  );
};
