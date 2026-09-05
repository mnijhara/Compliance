import React, { useState } from 'react';
import { Bot, X, Send, Sparkles, RefreshCw } from 'lucide-react';

export const FloatingAiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: 'user' | 'nova'; text: string }[]>([
    { sender: 'nova', text: 'Hi! I am Nova AI Compliance Assistant. Ask me any labor law or statutory return question!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userText = input;
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { sender: 'nova', text: data.reply || 'No response.' }]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold text-xs shadow-2xl hover:scale-105 transition flex items-center gap-2 cursor-pointer border border-indigo-400/40"
        >
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <span>Ask Nova AI</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        </button>
      ) : (
        <div className="bg-white border border-indigo-200 rounded-2xl shadow-2xl w-80 sm:w-96 p-4 text-slate-900 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-900">Nova AI Compliance Chat</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-700">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2 h-64 overflow-y-auto text-xs custom-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-2.5 rounded-xl max-w-[85%] ${m.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-800 border border-slate-200 shadow-xs'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="text-indigo-600 text-[11px] flex items-center gap-1 font-mono">
                <RefreshCw className="w-3 h-3 animate-spin" /> Nova AI is processing...
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask a statutory law question..."
              className="flex-1 bg-white text-slate-900 text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500 shadow-xs"
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold cursor-pointer shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
