import React, { useState } from 'react';
import { ComplianceAuditLog } from '../types';
import { LayoutDashboard, ShieldCheck, AlertCircle, FileCheck, Users, Download, ArrowUpRight, CheckCircle2, Clock, Filter } from 'lucide-react';

export const WorkspaceView: React.FC = () => {
  const [logs, setLogs] = useState<ComplianceAuditLog[]>([
    {
      id: 'log-101',
      timestamp: '2026-08-25 18:20:12',
      action: 'PF ECR Pre-Audit Reconciliation',
      performedBy: 'Statutory Filing Agent',
      jurisdiction: 'India - National',
      riskScoreAfter: 98,
      status: 'Verified',
      details: 'Reconciled 1,420 ECR wage records against 12% statutory cap. 0 discrepancies.'
    },
    {
      id: 'log-102',
      timestamp: '2026-08-25 17:45:00',
      action: 'POSH Committee Annual Audit',
      performedBy: 'POSH Guardian Agent',
      jurisdiction: 'India - Maharashtra',
      riskScoreAfter: 96,
      status: 'Verified',
      details: 'Verified senior woman presiding officer and NGO member credentials for 6 regional ICs.'
    },
    {
      id: 'log-103',
      timestamp: '2026-08-25 15:10:44',
      action: 'California Daily Overtime Scan',
      performedBy: 'Multi-State Payroll Auditor',
      jurisdiction: 'US - California',
      riskScoreAfter: 94,
      status: 'Flagged',
      details: 'Flagged 2 non-exempt employee paystubs requiring 2.0x overtime adjustment.'
    },
    {
      id: 'log-104',
      timestamp: '2026-08-25 12:00:15',
      action: 'Contract Labour License Renewal',
      performedBy: 'Contract Verifier Agent',
      jurisdiction: 'India - Karnataka',
      riskScoreAfter: 95,
      status: 'Pending Signoff',
      details: 'Form VI-A contractor renewal submitted to District Officer.'
    }
  ]);

  const [filterStatus, setFilterStatus] = useState<string>('All');

  const filteredLogs = logs.filter(log => filterStatus === 'All' || log.status === filterStatus);

  return (
    <div className="bg-white text-slate-900 min-h-screen py-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold shadow-xs">
              <LayoutDashboard className="w-3.5 h-3.5 text-indigo-600" /> Executive CHRO Workspace
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900">
              Enterprise Compliance Command Center
            </h1>
          </div>
          <button
            onClick={() => alert('Exporting CHRO Audit Readiness Report (PDF)...')}
            className="px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition flex items-center gap-2 shadow-md cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Audit Readiness Report</span>
          </button>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-2 shadow-xs">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block font-mono">
              Enterprise Health Score
            </span>
            <span className="text-3xl font-extrabold text-emerald-600 font-mono">96.8 / 100</span>
            <span className="text-[11px] text-slate-500 block">+1.2% from last quarter</span>
          </div>

          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-2 shadow-xs">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block font-mono">
              Active Statutory Filings
            </span>
            <span className="text-3xl font-extrabold text-slate-900 font-mono">14 / 14</span>
            <span className="text-[11px] text-emerald-600 block font-semibold">100% Filings On Track</span>
          </div>

          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-2 shadow-xs">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block font-mono">
              Employees Covered
            </span>
            <span className="text-3xl font-extrabold text-indigo-700 font-mono">2,850</span>
            <span className="text-[11px] text-slate-500 block">Across 28 States & 3 Countries</span>
          </div>

          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-2 shadow-xs">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block font-mono">
              Audit Readiness Level
            </span>
            <span className="text-3xl font-extrabold text-emerald-600 font-mono">Guaranteed</span>
            <span className="text-[11px] text-slate-500 block">Digital Timestamps Active</span>
          </div>

        </div>

        {/* Active Deadlines & Alert Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Active Deadlines */}
          <div className="lg:col-span-6 bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">
              Upcoming Statutory Deadlines
            </h3>
            
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between shadow-xs">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-900">Monthly PF / ESI ECR Remittance</span>
                  <span className="text-slate-500 block text-[11px]">National EPFO Portal</span>
                </div>
                <span className="px-2.5 py-1 rounded bg-indigo-100 text-indigo-800 font-mono font-bold border border-indigo-200">Due Sept 15</span>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between shadow-xs">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-900">Karnataka LWF Half-Yearly Return</span>
                  <span className="text-slate-500 block text-[11px]">Form A Submission</span>
                </div>
                <span className="px-2.5 py-1 rounded bg-indigo-100 text-indigo-800 font-mono font-bold border border-indigo-200">Due Sept 20</span>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between shadow-xs">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-900">California Annual Pay Data Report</span>
                  <span className="text-slate-500 block text-[11px]">CRD Portal Submission</span>
                </div>
                <span className="px-2.5 py-1 rounded bg-indigo-100 text-indigo-800 font-mono font-bold border border-indigo-200">Due Oct 1</span>
              </div>
            </div>
          </div>

          {/* Regional Distribution */}
          <div className="lg:col-span-6 bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">
              Multi-State Compliance Status
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 shadow-xs">
                <span className="font-bold text-slate-900">Maharashtra (Pune & Mumbai Hubs)</span>
                <span className="text-emerald-600 font-bold font-mono">100% Compliant</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 shadow-xs">
                <span className="font-bold text-slate-900">Karnataka (Bengaluru Tech Park)</span>
                <span className="text-emerald-600 font-bold font-mono">100% Compliant</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 shadow-xs">
                <span className="font-bold text-slate-900">California (SF & LA Teams)</span>
                <span className="text-amber-600 font-bold font-mono">94% Compliant (1 Flag)</span>
              </div>
            </div>
          </div>

        </div>

        {/* Audit Trail Log Table */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">
              Legally Defensible Audit Trail
            </h3>

            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 shadow-xs"
              >
                <option value="All">All Statuses</option>
                <option value="Verified">Verified Only</option>
                <option value="Flagged">Flagged Only</option>
                <option value="Pending Signoff">Pending Signoff</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto bg-white rounded-xl border border-slate-200 shadow-xs">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-100 text-slate-600 uppercase font-mono text-[10px] border-b border-slate-200">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Action Performed</th>
                  <th className="p-3">Agent / User</th>
                  <th className="p-3">Jurisdiction</th>
                  <th className="p-3">Score Impact</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition">
                    <td className="p-3 font-mono text-slate-500 whitespace-nowrap">{log.timestamp}</td>
                    <td className="p-3 font-bold text-slate-900 whitespace-nowrap">{log.action}</td>
                    <td className="p-3 text-indigo-700 font-medium whitespace-nowrap">{log.performedBy}</td>
                    <td className="p-3 text-slate-700 whitespace-nowrap">{log.jurisdiction}</td>
                    <td className="p-3 font-mono text-emerald-600 font-bold whitespace-nowrap">{log.riskScoreAfter} / 100</td>
                    <td className="p-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                        log.status === 'Verified' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                        log.status === 'Flagged' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                        'bg-indigo-100 text-indigo-800 border border-indigo-300'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="p-3 text-slate-500 max-w-xs truncate">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};
