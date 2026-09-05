import { AgentWorkflow } from '../types';

export const AGENT_WORKFLOWS_DATA: AgentWorkflow[] = [
  {
    id: 'agent-1',
    name: 'Statutory Filing & ECR Remittance Agent',
    agentType: 'Statutory Filing Agent',
    status: 'active',
    lastRun: '12 minutes ago',
    executionsToday: 24,
    description: 'Autonomous Nova Agent that checks monthly PF/ESI deadlines, reconciles ECR registers, and pre-validates statutory returns.',
    triggers: ['Monthly ECR Generation', '15th Statutory Remittance Deadline', 'New Employee UAN Seeding'],
    actionsExecuted: [
      'Validated 1,420 employee UAN seeding records against Aadhaar database',
      'Calculated 12% PF contribution cap for gross salaries > ₹15,000',
      'Generated compliant Form 5 & Form 10 filings for state labor board'
    ],
    recentLogs: [
      { timestamp: '18:32:10', level: 'success', message: 'Reconciled 1,420 ECR records with 0 discrepancies detected.' },
      { timestamp: '18:30:04', level: 'info', message: 'Checking PF contribution wage ceiling capping for 48 new joinees.' },
      { timestamp: '17:45:12', level: 'info', message: 'Automated ECR pre-audit complete for Maharashtra & Karnataka payroll branches.' }
    ]
  },
  {
    id: 'agent-2',
    name: 'Multi-State Payroll Compliance Auditor',
    agentType: 'Payroll Auditor',
    status: 'active',
    lastRun: '4 minutes ago',
    executionsToday: 112,
    description: 'Performs micro-audits on daily overtime, state minimum wage updates, LWF deductions, and exempt status classifications.',
    triggers: ['Payroll Run Cycle', 'State Minimum Wage Notification', 'Overtime Exceeding 9 hrs/day'],
    actionsExecuted: [
      'Audited California daily overtime (1.5x > 8 hrs, 2.0x > 12 hrs)',
      'Verified Karnataka LWF deduction (₹20 employer / ₹10 employee)',
      'Flagged 3 non-exempt employees misclassified under administrative exemption'
    ],
    recentLogs: [
      { timestamp: '18:35:02', level: 'warn', message: 'Flagged 2 workers in Pune office with daily hours exceeding 9 hrs without 2x OT rate.' },
      { timestamp: '18:22:15', level: 'success', message: 'Verified minimum wage compliance across 14 Indian states for Feb 2026.' },
      { timestamp: '18:01:40', level: 'info', message: 'Triggered FLSA salary threshold verification for US remote staff.' }
    ]
  },
  {
    id: 'agent-3',
    name: 'POSH Committee & Annual Return Guardian',
    agentType: 'POSH Guardian',
    status: 'active',
    lastRun: '1 hour ago',
    executionsToday: 8,
    description: 'Ensures statutory compliance of POSH Internal Committees, tracks IC member tenure, and automates annual report filings.',
    triggers: ['Quarterly POSH Audit', 'IC Member Resignation', 'Annual Return Due Date'],
    actionsExecuted: [
      'Validated external NGO member credential verification for 6 regional ICs',
      'Monitored 90-day inquiry completion SLAs for pending complaints',
      'Drafted Annual POSH Report for District Complaints Committee'
    ],
    recentLogs: [
      { timestamp: '17:30:11', level: 'success', message: 'Verified all 6 Regional IC Committees have valid senior woman presiding officer and external NGO member.' },
      { timestamp: '16:15:00', level: 'info', message: 'Scheduled mandatory POSH employee refresher workshop for Q1 2026.' }
    ]
  },
  {
    id: 'agent-4',
    name: 'Contract Labour License & Wage Verifier',
    agentType: 'Contract Verifier',
    status: 'idle',
    lastRun: '3 hours ago',
    executionsToday: 15,
    description: 'Verifies contractor licenses, Form V principal employer registrations, statutory wage payments, and site safety compliance.',
    triggers: ['Contractor Onboarding', 'License Expiry within 30 days', 'Monthly Wage Disbursement'],
    actionsExecuted: [
      'Scanned 14 contractor licenses under Contract Labour Act 1970',
      'Cross-checked contractor wage register with bank disbursement receipts',
      'Sent automated renewal alert for expiring license of Vendor X'
    ],
    recentLogs: [
      { timestamp: '15:20:44', level: 'info', message: 'Issued automated compliance notice to facility management vendor regarding Form VI-A filing.' },
      { timestamp: '14:10:02', level: 'success', message: 'Verified 340 contract workers received mandatory ESIC Pehchan cards.' }
    ]
  },
  {
    id: 'agent-5',
    name: 'Real-Time Regulatory Change Watchdog',
    agentType: 'Regulatory Change Watchdog',
    status: 'active',
    lastRun: 'Just now',
    executionsToday: 340,
    description: 'Monitors gazette notifications, labor ministry bulletins, and judicial precedents across 40+ labor jurisdictions.',
    triggers: ['Government Gazette Stream', 'Labor Ministry Circular', 'State Minimum Wage Ordinance'],
    actionsExecuted: [
      'Ingested Maharashtra Govt Gazette Notification on revised VDA rates',
      'Mapped statutory impact to 4 internal HR policies',
      'Notified CHRO dashboard of zero-day labor rule update'
    ],
    recentLogs: [
      { timestamp: '18:38:50', level: 'info', message: 'Monitoring 42 official state & federal labor department RSS feeds.' },
      { timestamp: '18:10:05', level: 'success', message: 'Zero high-risk regulatory shifts detected in past 6 hours.' }
    ]
  }
];
