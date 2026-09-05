import React, { useState } from 'react';
import { AGENT_WORKFLOWS_DATA } from '../data/agentWorkflows';
import { AgentWorkflow } from '../types';
import { Cpu, Play, CheckCircle2, AlertCircle, Clock, Zap, Terminal, Activity, RefreshCw, ShieldCheck } from 'lucide-react';

export const AgenticWorkflows: React.FC = () => {
  const [agents, setAgents] = useState<AgentWorkflow[]>(AGENT_WORKFLOWS_DATA);
  const [selectedAgent, setSelectedAgent] = useState<AgentWorkflow>(AGENT_WORKFLOWS_DATA[0]);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // Trigger agent execution via server API
  const handleRunAgent = async (agentId: string) => {
    setIsRunning(true);
    try {
      const response = await fetch('/api/agent-run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId })
      });

      const data = await response.json();
      
      // Update local agent state with new execution timestamp and logs
      setAgents(prev => prev.map(a => {
        if (a.id === agentId) {
          const updatedLogs = [...data.logs, ...a.recentLogs];
          const updatedAgent = {
            ...a,
            lastRun: 'Just now',
            executionsToday: a.executionsToday + 1,
            recentLogs: updatedLogs
          };
          if (selectedAgent.id === agentId) {
            setSelectedAgent(updatedAgent);
          }
          return updatedAgent;
        }
        return a;
      }));

    } catch (err) {
      console.error('Agent trigger failed:', err);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="bg-white text-slate-900 min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Title Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold shadow-xs">
            <Cpu className="w-3.5 h-3.5 text-indigo-600" />
            <span>Globalion Nova™ Agentic Platform Architecture</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Autonomous Agent Workflows & Execution Hub
          </h1>
          <p className="text-slate-600 text-sm max-w-3xl leading-relaxed">
            Configure autonomous Nova AI Agents that self-execute statutory ECR remittances, monitor state minimum wage gazettes, audit daily overtime limits, and verify contractor licensing backgroundly.
          </p>
        </div>

        {/* Platform Architecture Status Bar */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center border border-emerald-200">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Platform Status</div>
              <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Active & Ready
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center border border-indigo-200">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Active Autonomous Agents</div>
              <div className="text-sm font-bold text-slate-900 font-mono">5 Nova Agents</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center border border-blue-200">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Executions Today</div>
              <div className="text-sm font-bold text-slate-900 font-mono">499 Tasks</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center border border-amber-200">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Zero-Day Legal SLA</div>
              <div className="text-sm font-bold text-slate-900 font-mono">&lt; 15 mins</div>
            </div>
          </div>
        </div>

        {/* Main Grid Layout: Agents Selector (4 cols) & Live Inspector (8 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Agent Selection List */}
          <div className="lg:col-span-5 space-y-3">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between px-1">
              <span>Configured Nova Agents</span>
              <span className="text-[10px] text-slate-500">Autonomous</span>
            </div>

            {agents.map((agent) => {
              const isSelected = selectedAgent.id === agent.id;
              return (
                <div
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent)}
                  className={`p-4 rounded-xl border cursor-pointer transition space-y-3 ${
                    isSelected
                      ? 'bg-indigo-50/70 border-indigo-400 ring-1 ring-indigo-300 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 border border-indigo-200 text-[10px] font-mono font-bold uppercase">
                      {agent.agentType}
                    </span>
                    <span className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {agent.lastRun}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{agent.name}</h3>
                    <p className="text-xs text-slate-600 line-clamp-2 mt-0.5">{agent.description}</p>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[11px] border-t border-slate-200">
                    <span className="text-slate-600">
                      Executions: <strong className="text-slate-900 font-mono">{agent.executionsToday}</strong>
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRunAgent(agent.id);
                      }}
                      disabled={isRunning}
                      className="px-2.5 py-1 rounded text-[10px] font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition flex items-center gap-1 cursor-pointer shadow-xs"
                    >
                      <Play className="w-3 h-3" /> Run Agent Now
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Agent Operational Details & Live Execution Log Stream */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-6 sticky top-24 shadow-xs">
              
              {/* Agent Header & Quick Trigger */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-bold uppercase">
                      Status: {selectedAgent.status}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">ID: {selectedAgent.id}</span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mt-1">{selectedAgent.name}</h2>
                </div>

                <button
                  onClick={() => handleRunAgent(selectedAgent.id)}
                  disabled={isRunning}
                  className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 rounded-lg shadow-md transition flex items-center gap-2 shrink-0 cursor-pointer"
                >
                  {isRunning ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Executing Nova Agent...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      <span>Trigger Workflow Execution</span>
                    </>
                  )}
                </button>
              </div>

              {/* Event Triggers & Actions Executed */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2 shadow-xs">
                  <h4 className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-indigo-600" /> Organic Triggers
                  </h4>
                  <ul className="space-y-1 text-xs text-slate-700">
                    {selectedAgent.triggers.map((t, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2 shadow-xs">
                  <h4 className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Actions Automated Today
                  </h4>
                  <ul className="space-y-1 text-xs text-slate-700">
                    {selectedAgent.actionsExecuted.map((a, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1 shrink-0"></span>
                        <span className="leading-tight">{a}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Live Terminal Log Stream */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-indigo-600" /> Live Agent Execution Logs
                  </h4>
                  <span className="text-[10px] text-slate-500 font-mono">Stream: Active</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 font-mono text-xs space-y-2 max-h-60 overflow-y-auto custom-scrollbar shadow-xs">
                  {selectedAgent.recentLogs.map((log, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <span className="text-slate-400 shrink-0 text-[11px]">{log.timestamp}</span>
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase shrink-0 ${
                        log.level === 'success' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                        log.level === 'warn' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                        'bg-blue-100 text-blue-800 border border-blue-300'
                      }`}>
                        {log.level}
                      </span>
                      <span className="text-slate-800 leading-normal">{log.message}</span>
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
