import React, { useState } from 'react';
import { AGENT_WORKFLOWS_DATA } from '../data/agentWorkflows';
import { AgentWorkflow } from '../types';
import { Cpu, Play, CheckCircle2, AlertTriangle, RefreshCw, Terminal, Clock, ShieldCheck, Zap } from 'lucide-react';

export const AgenticWorkflowsView: React.FC = () => {
  const [agents, setAgents] = useState<AgentWorkflow[]>(AGENT_WORKFLOWS_DATA);
  const [selectedAgentId, setSelectedAgentId] = useState<string>('agent-1');
  const [runningAgentId, setRunningAgentId] = useState<string | null>(null);

  const selectedAgent = agents.find(a => a.id === selectedAgentId) || agents[0];

  const handleRunAgent = async (agentId: string) => {
    setRunningAgentId(agentId);

    try {
      const res = await fetch('/api/agent-run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId })
      });
      const data = await res.json();

      setAgents(prev => prev.map(agent => {
        if (agent.id === agentId) {
          return {
            ...agent,
            lastRun: 'Just now',
            executionsToday: agent.executionsToday + 1,
            recentLogs: [...data.logs, ...agent.recentLogs]
          };
        }
        return agent;
      }));
    } catch (err) {
      console.error('Agent execution error:', err);
    } finally {
      setRunningAgentId(null);
    }
  };

  return (
    <div className="bg-white text-slate-900 min-h-screen py-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
            <Cpu className="w-3.5 h-3.5 text-indigo-600" /> Nova Agentic Architecture v3.0
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Autonomous HR Compliance Agents
          </h1>
          <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
            Globalion’s Nova platform deploys autonomous AI agents to constantly monitor payroll calculations, verify statutory filings, enforce POSH IC guidelines, and track zero-day regulatory changes.
          </p>
        </div>

        {/* Agents Grid & Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Agent Selection List */}
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block font-mono">
              Active Nova Autonomous Agents:
            </span>

            <div className="space-y-3">
              {agents.map((agent) => {
                const isSelected = agent.id === selectedAgentId;
                const isRunning = runningAgentId === agent.id;

                return (
                  <div
                    key={agent.id}
                    onClick={() => setSelectedAgentId(agent.id)}
                    className={`p-4 rounded-2xl border transition cursor-pointer space-y-2 ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-300 shadow-sm'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Cpu className={`w-4 h-4 ${isSelected ? 'text-indigo-600' : 'text-slate-500'}`} />
                        <span className="text-sm font-bold text-slate-900">{agent.name}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                        agent.status === 'active' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                        'bg-slate-200 text-slate-600'
                      }`}>
                        {agent.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2">{agent.description}</p>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                      <span>Last run: <strong className="text-slate-800 font-mono">{agent.lastRun}</strong></span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRunAgent(agent.id);
                        }}
                        disabled={isRunning}
                        className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-1 transition disabled:opacity-50 cursor-pointer shadow-xs"
                      >
                        {isRunning ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
                        <span>Trigger</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Agent Inspector & Live Logs */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
              
              {/* Agent Overview */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <span className="text-xs text-indigo-700 font-bold uppercase tracking-wider font-mono">
                    {selectedAgent.agentType}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900">{selectedAgent.name}</h3>
                </div>
                <button
                  onClick={() => handleRunAgent(selectedAgent.id)}
                  disabled={runningAgentId === selectedAgent.id}
                  className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 rounded-xl transition flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
                >
                  {runningAgentId === selectedAgent.id ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                  <span>Run Agent Now</span>
                </button>
              </div>

              {/* Triggers */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block font-mono">
                  Autonomous Event Triggers:
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedAgent.triggers.map((trigger, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-white text-slate-800 text-xs border border-slate-200 flex items-center gap-1 shadow-xs"
                    >
                      <Zap className="w-3 h-3 text-indigo-600" />
                      {trigger}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions Executed */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block font-mono">
                  Automated Actions Executed:
                </span>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {selectedAgent.actionsExecuted.map((action, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Terminal Log Output */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                    <Terminal className="w-4 h-4 text-indigo-600" />
                    Real-Time Execution Terminal Logs
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    Today: {selectedAgent.executionsToday} runs
                  </span>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-4 font-mono text-xs space-y-2 max-h-[250px] overflow-y-auto shadow-xs">
                  {selectedAgent.recentLogs.map((log, idx) => (
                    <div key={idx} className="flex items-start gap-2 leading-relaxed">
                      <span className="text-slate-400 shrink-0">{log.timestamp}</span>
                      <span className={
                        log.level === 'success' ? 'text-emerald-700 font-semibold' :
                        log.level === 'warn' ? 'text-amber-700 font-semibold' :
                        log.level === 'error' ? 'text-red-700 font-semibold' : 'text-slate-800'
                      }>
                        [{log.level.toUpperCase()}] {log.message}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
