import React, { useState } from 'react';
import { FileText, Download, Copy, Check, Search, ShieldCheck, Building2, Eye, ExternalLink } from 'lucide-react';

interface FormTemplate {
  id: string;
  formName: string;
  statute: string;
  governingSection: string;
  jurisdiction: string;
  purpose: string;
  frequency: string;
  templateContent: string;
}

const STATUTORY_FORMS_DATA: FormTemplate[] = [
  {
    id: 'form-1-wage',
    formName: 'Form I - Register of Wages & Overtime',
    statute: 'Code on Wages, 2019 / Factories Act 1948',
    governingSection: 'Section 50 & Rule 19',
    jurisdiction: 'India - National / All States',
    purpose: 'Mandatory statutory register for tracking employee attendance, basic pay, DA, OT hours, double OT rate calculations, and net disbursement.',
    frequency: 'Maintained Monthly',
    templateContent: `FORM I - REGISTER OF WAGES, OVERTIME & DEDUCTIONS
[Prescribed under Rule 19 of the Code on Wages Rules, 2020]

Name of Establishment: _____________________________________
Address of Establishment: ___________________________________
Month & Year: _______________ 2026

-------------------------------------------------------------------------------------------------------------------------
Sr | Emp ID | Employee Name | Designation | Days Worked | OT Hours | Basic+DA (₹) | HRA (₹) | OT Pay (2x) | Gross (₹) | PF (12%) | ESIC (0.75%) | PT (₹) | Net Paid (₹) | Signature
-------------------------------------------------------------------------------------------------------------------------
1  | EMP001 | Rajesh Sharma | Sr Engineer  | 26.0        | 4.0      | 45,000       | 18,000  | 2,163       | 65,163    | 1,800    | 0            | 200    | 63,163       | [Signed]
2  | EMP002 | Priya Verma   | HR Associate | 25.0        | 0.0      | 22,000       | 8,800   | 0           | 30,800    | 1,800    | 0            | 200    | 28,800       | [Signed]
-------------------------------------------------------------------------------------------------------------------------
Employer Certification: Certified that all statutory deductions have been remitted to EPFO & ESIC accounts by 15th.
Signature of Authorized Officer: __________________________  Date: ______________`
  },
  {
    id: 'form-v-clra',
    formName: 'Form V - Principal Employer Certificate',
    statute: 'Contract Labour (Regulation & Abolition) Act, 1970',
    governingSection: 'Section 21(2) & Rule 21(2)',
    jurisdiction: 'India - National',
    purpose: 'Certificate issued by Principal Employer to manpower vendor/contractor to enable contractor licensing with the Labour Commissioner.',
    frequency: 'Per Contractor Onboarding',
    templateContent: `FORM V
[See Rule 21(2) of Contract Labour (Regulation & Abolition) Central Rules]
FORM OF CERTIFICATE BY PRINCIPAL EMPLOYER

1. Certified that I have engaged M/s _________________________________________ (Name of Contractor) as a contractor in my establishment.

2. Details of work: ___________________________________________________________ (Facility Security / IT Infrastructure / Housekeeping)

3. Maximum number of contract workmen to be employed on any day: _____________ (e.g., 50 workers)

4. Contract duration: From _______________ 2026 to _______________ 2027.

5. I undertake to be bound by all the provisions of the Contract Labour (Regulation and Abolition) Act, 1970 and rules in so far as they apply to me as Principal Employer.

Place: ___________________________
Date: ___________________________ 
Signature of Principal Employer: _______________________________
Name & Designation: __________________________________________`
  },
  {
    id: 'form-f-gratuity',
    formName: 'Form F - Gratuity Nomination Form',
    statute: 'Payment of Gratuity Act, 1972',
    governingSection: 'Section 6 & Rule 6(1)',
    jurisdiction: 'India - National',
    purpose: 'Mandatory employee nomination form detailing beneficiaries entitled to receive statutory gratuity upon employee superannuation or death.',
    frequency: 'On Employee Joining (Within 30 Days)',
    templateContent: `FORM 'F'
[See Sub-rule (1) of Rule 6 of Payment of Gratuity (Central) Rules, 1972]
NOMINATION FORM FOR STATUTORY GRATUITY

To,
[Company Name & Registered Address]

I, _________________________________________________ (Employee Name), whose particulars are given below, hereby nominate the person(s) mentioned below to receive statutory gratuity payable in the event of my death.

1. Name of Employee: ________________________________________
2. Employee ID & UAN: _______________________________________
3. Date of Joining: __________________________________________

NOMINEE DETAILS:
----------------------------------------------------------------------------------------------------
Name of Nominee(s) | Full Address | Relationship with Employee | Age | Proportion (%) of Gratuity
----------------------------------------------------------------------------------------------------
1.                 |              |                            |     | 100%
----------------------------------------------------------------------------------------------------

Date: ________________________
Signature / Thumb Impression of Employee: ___________________________________

WITNESS STATEMENT:
Nominated in our presence:
Witness 1 Name & Signature: ___________________________
Witness 2 Name & Signature: ___________________________`
  },
  {
    id: 'form-posh-annual',
    formName: 'Form POSH Annual Return (Section 21)',
    statute: 'Sexual Harassment of Women at Workplace (POSH) Act, 2013',
    governingSection: 'Section 21 & Rule 14',
    jurisdiction: 'India - National (District Officer Submission)',
    purpose: 'Mandatory annual compliance report submitted to District Complaints Officer detailing complaints received, IC inquiries, and training workshops.',
    frequency: 'Annual (Due January 31st)',
    templateContent: `ANNUAL POSH COMPLIANCE RETURN
[Under Section 21 of the Sexual Harassment of Women at Workplace Act, 2013]

Calendar Year: 2026
To, The District Officer / Collector, District Complaints Committee,
Branch Office Location: ______________________________________________________

1. Name of Establishment: ____________________________________________________
2. Total Number of Employees: __________ (Female: ______ | Male: ______)
3. Details of Internal Committee (IC):
   - Presiding Officer (Senior Female): ________________________________________
   - External NGO Member: ___________________________________________________
   - Committee Female Ratio: ______% (Statutory Minimum: ≥ 50%)

STATUTORY RETURN DATA FOR CALENDAR YEAR 2026:
a) Number of complaints of sexual harassment received during the year: ________
b) Number of complaints disposed of during the year (within 90-day SLA): ______
c) Number of cases pending for more than 90 days: ___________________________
d) Number of workshops & awareness programs conducted for staff: _____________
e) Action taken by employer against respondent: _______________________________

I hereby certify that the information provided above is true and correct as per IC records.

Signature of Presiding Officer: __________________________  Date: ______________
Signature of Employer / CHRO: ___________________________  Date: ______________`
  },
  {
    id: 'form-5-epf',
    formName: 'Form 5 & Form 10 - EPF Joinee / Exit Return',
    statute: 'Employees Provident Funds Scheme, 1952',
    governingSection: 'Paragraph 36(2) & 36(3)',
    jurisdiction: 'India - National',
    purpose: 'Statutory monthly return filed with EPFO detailing new employees who joined during the month (Form 5) and employees who left service (Form 10).',
    frequency: 'Monthly (By 15th of Following Month)',
    templateContent: `EMPLOYEES' PROVIDENT FUND SCHEME, 1952
FORM 5 (New Joinees) & FORM 10 (Exits)

Establishment Code: ____________________  Month/Year: _______________ 2026

FORM 5 - NEW JOINEES REGISTERED FOR UAN SEEDING:
-------------------------------------------------------------------------------------------------------------
Sr | Member Name | Father/Spouse Name | Date of Birth | Date of Joining | Basic Wage (₹) | UAN Allotted
-------------------------------------------------------------------------------------------------------------
1  | Ananya Roy  | Subhash Roy        | 14/08/1996    | 02/02/2026      | 35,000         | 101988273645
-------------------------------------------------------------------------------------------------------------

FORM 10 - EMPLOYEES LEAVING SERVICE:
-------------------------------------------------------------------------------------------------------------
Sr | Member Name | UAN Number | Date of Leaving | Reason for Leaving | Remarks
-------------------------------------------------------------------------------------------------------------
1  | Vikas Nair  | 100827361928 | 31/01/2026     | Resignation        | Service Transfer Annexure K
-------------------------------------------------------------------------------------------------------------

Signature of Employer / Authorized Signatory: ________________________`
  }
];

export const StatutoryFormVault: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedForm, setSelectedForm] = useState<FormTemplate>(STATUTORY_FORMS_DATA[0]);
  const [copiedForm, setCopiedForm] = useState(false);

  const filteredForms = STATUTORY_FORMS_DATA.filter(f =>
    f.formName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.statute.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.purpose.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopyForm = () => {
    navigator.clipboard.writeText(selectedForm.templateContent);
    setCopiedForm(true);
    setTimeout(() => setCopiedForm(false), 2000);
  };

  return (
    <div className="bg-white text-slate-900 min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
            <FileText className="w-3.5 h-3.5 text-indigo-600" />
            <span>Statutory Compliance Vault</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Indian Statutory Registers & Official Form Generator
          </h1>
          <p className="text-slate-600 text-sm max-w-3xl leading-relaxed">
            Pre-formatted statutory registers and returns for EPF Form 5/10, Contract Labour Form V, Payment of Gratuity Form F, POSH Section 21 Annual Report, and Code on Wages Form I. Ready to populate, copy, or export.
          </p>
        </div>

        {/* Search & Selection Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Forms List (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search statutory form or act..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 text-xs pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 shadow-xs"
              />
            </div>

            <div className="space-y-3.5 max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
              {filteredForms.map((form) => {
                const isSelected = selectedForm.id === form.id;
                return (
                  <div
                    key={form.id}
                    onClick={() => setSelectedForm(form)}
                    className={`p-4 rounded-xl border cursor-pointer transition space-y-2 ${
                      isSelected
                        ? 'bg-indigo-50/70 border-indigo-400 ring-1 ring-indigo-300 shadow-xs'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 border border-indigo-200 font-mono font-bold text-[10px]">
                        {form.statute.split('/')[0]}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">{form.frequency}</span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900">{form.formName}</h3>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{form.purpose}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Form Inspector & Text Generator (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200 space-y-5 shadow-xs">
              
              {/* Form Info Header */}
              <div className="space-y-2 border-b border-slate-200 pb-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md bg-indigo-100 text-indigo-800 border border-indigo-200 text-xs font-mono font-bold">
                    {selectedForm.governingSection}
                  </span>
                  <button
                    onClick={handleCopyForm}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-lg border border-slate-300 transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    {copiedForm ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copied Form!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                        <span>Copy Statutory Template</span>
                      </>
                    )}
                  </button>
                </div>

                <h2 className="text-xl font-bold text-slate-900">{selectedForm.formName}</h2>
                <p className="text-xs text-slate-600">Governing Statute: <strong className="text-indigo-700">{selectedForm.statute}</strong></p>
              </div>

              {/* Template Text Area */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-600 font-mono font-bold uppercase">
                  <span>Prescribed Format Preview</span>
                  <span>Ready for Submission</span>
                </div>
                <textarea
                  readOnly
                  rows={14}
                  value={selectedForm.templateContent}
                  className="w-full bg-white text-slate-800 text-xs p-4 rounded-xl border border-slate-200 font-mono leading-relaxed shadow-xs"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-500">
                  Compliant with Labour Department standards
                </span>
                <button
                  onClick={() => alert(`Downloading statutory form template: ${selectedForm.formName}`)}
                  className="px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Form Document</span>
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
