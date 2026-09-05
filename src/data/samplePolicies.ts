import { PolicyTemplate } from '../types';

export const SAMPLE_POLICIES: PolicyTemplate[] = [
  {
    id: 'sample-1',
    title: 'Outdated Employment Offer Letter (High Risk - India)',
    category: 'Employment Contract',
    description: 'Sample Indian offer letter containing illegal non-compete clauses (Section 27 Contract Act), missing daily overtime definitions, and unlawful salary deduction terms.',
    recommendedJurisdictions: ['India - Maharashtra', 'India - Karnataka', 'India - National', 'US - California'],
    sampleText: `EMPLOYMENT OFFER LETTER & AGREEMENT

Dear Candidate,

We are pleased to offer you employment at Global Tech Corp India Pvt Ltd as Senior Operations Associate. 

1. HOURS OF WORK: You agree to work 50 hours per week from Monday through Saturday (9:00 AM to 7:30 PM). Overtime will only be compensated if pre-approved by the Vice President in writing, at flat hourly regular rates.

2. NON-COMPETE RESTRICTION: For a period of two (2) years following termination of employment for any reason, Employee shall not engage in, perform services for, or be employed by any competitor operating anywhere in India or South Asia.

3. DEDUCTIONS & PENALTIES: The Company reserves the right to deduct unreturned equipment costs, administrative fines, or notice period shortfalls directly from Employee's final salary/paycheck without prior written consent or statutory cap.

4. PROBATION & STATUTORY SEVERANCE: The company may terminate employment immediately without notice or cause during the 12-month probation period without paying accrued statutory severance or gratuity.

5. GRATUITY & PF CAPPING: Provident fund contribution will be restricted to ₹500 flat per month regardless of basic salary structure.`
  },
  {
    id: 'sample-2',
    title: 'Non-Compliant POSH Policy (Missing External IC Member - India)',
    category: 'Workplace Safety & POSH',
    description: 'Internal Prevention of Sexual Harassment Policy lacking statutory external NGO member, missing local district officer annual submission guidelines, and violating 90-day inquiry SLAs.',
    recommendedJurisdictions: ['India - National', 'India - Maharashtra', 'India - Karnataka', 'India - Telangana'],
    sampleText: `PREVENTION OF SEXUAL HARASSMENT (POSH) POLICY

Company: Innovate Solutions Pvt Ltd

1. OBJECTIVE: Innovate Solutions is committed to maintaining a safe work environment free of harassment.

2. COMPLAINT REDRESSAL COMMITTEE: All complaints shall be reviewed by an internal committee consisting of 2 internal male HR managers. The committee will decide whether an investigation is warranted within 120 days.

3. DISCIPLINARY ACTIONS: If a complaint is substantiated, management may issue a verbal warning or suspend the respondent for up to 3 days.

4. CONFIDENTIALITY: Complaints should be kept confidential where possible, but management reserves the right to share details with department heads for operational review.

5. ANNUAL REPORTING: Reports will be archived internally by HR. No filing will be made to the District Complaints Officer.`
  },
  {
    id: 'sample-3',
    title: 'Indian Contract Labour & Vendor Engagement Agreement (Licensing Gap)',
    category: 'Contract Labor',
    description: 'Contractor agreement lacking Form V Principal Employer registration certificate, missing ESIC Pehchan card mandates, and shifting Principal Employer wage liability.',
    recommendedJurisdictions: ['India - National', 'India - Maharashtra', 'India - Tamil Nadu'],
    sampleText: `CONTRACT LABOUR MANPOWER SUPPLY AGREEMENT

1. SCOPE: Facility Services Vendor agrees to provide 35 contract security guards and housekeeping staff to Enterprise Plant.

2. WAGES & LIABILITY: Vendor shall be solely responsible for paying wages. If Vendor defaults on wage disbursements or ESIC/EPF remittances, Principal Employer shall bear zero liability and shall not make good any unpaid wages to contract workers.

3. LICENSING: Vendor agrees to operate under its general business registration. No separate license under Section 12 of Contract Labour (Regulation & Abolition) Act 1970 shall be required.

4. WELFARE FACILITIES: Contract workers must bring their own drinking water and protective gear. Enterprise shall not provide restroom or canteen access.`
  },
  {
    id: 'sample-4',
    title: 'California Remote & Hybrid Work Policy (Break Compliance Gap)',
    category: 'Remote Work',
    description: 'Hybrid work policy failing to mandate California 10-minute rest breaks, cell phone/internet expense reimbursements, and paystub itemization.',
    recommendedJurisdictions: ['US - California'],
    sampleText: `REMOTE WORK & HOME OFFICE POLICY

1. ELIGIBILITY: Full-time employees may work remotely up to 3 days per week with manager consent.

2. EQUIPMENT & EXPENSES: Employees must use their own personal home internet, mobile phones, and computers. The company will not reimburse home utility or Wi-Fi expenses.

3. WORKING HOURS: Remote employees must remain logged into Slack between 8:00 AM and 7:00 PM PST. Lunch breaks are informal and should be taken when workload permits.

4. TIME TRACKING: Employees need only submit total weekly hours worked (e.g. 40 hours) every Friday afternoon.`
  }
];
