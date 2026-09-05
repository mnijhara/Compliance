import { LaborLawItem } from '../types';

export const LABOR_LAWS_DATA: LaborLawItem[] = [
  // -------------------------------------------------------------
  // THE 4 NEW INDIAN LABOUR CODES (2019 - 2020)
  // -------------------------------------------------------------
  {
    id: 'law-code-wages',
    title: 'Code on Wages, 2019',
    jurisdiction: 'India - National',
    country: 'India',
    category: 'Wages & Hours',
    shortSummary: 'Consolidates Payment of Wages Act 1936, Minimum Wages Act 1948, Payment of Bonus Act 1965, and Equal Remuneration Act 1976. Introduces National Floor Wage and 50% basic salary capping.',
    keyMandates: [
      'Statutory definition of "Wages": Allowances cannot exceed 50% of total salary package (Basic + DA must be >= 50%)',
      'Timely wage payment before 7th of the following month across all sectors and establishments',
      'Universal coverage of minimum wages for all employees (organized and unorganized sectors)',
      'Statutory prohibition of gender discrimination in wages and recruitment'
    ],
    penaltyDetails: 'Fines up to ₹50,000 for first offense; repeat offenses within 5 years carry imprisonment up to 3 months or fine up to ₹1,00,000.',
    applicability: 'All establishments, factories, and commercial units employing 1 or more workers in India.',
    lastUpdated: 'Updated Feb 2026',
    statutoryForm: 'Form I - Register of Wages & Overtime'
  },
  {
    id: 'law-code-soc-sec',
    title: 'Code on Social Security, 2020',
    jurisdiction: 'India - National',
    country: 'India',
    category: 'Social Security & PF',
    shortSummary: 'Unifies EPF Act, ESI Act, Maternity Benefit Act, Gratuity Act, and extends social security coverage to gig, platform, and fixed-term workers.',
    keyMandates: [
      'Pro-rata gratuity eligibility for fixed-term contract employees (without 5-year minimum service threshold)',
      'Mandatory registration of gig workers and platform aggregators with 1-2% turnover contribution to Social Security Fund',
      'Centralized portal for UAN registration, ECR filing, and automated compliance tracking',
      'Statutory maternity benefits (26 weeks paid leave) integrated into social security network'
    ],
    penaltyDetails: 'Fines up to ₹1,00,000 and imprisonment from 1 to 3 years for non-deduction or non-remittance of employee contributions.',
    applicability: 'Factories with 10+ workers (ESI), establishments with 20+ workers (EPF), and all digital aggregators/platform companies.',
    lastUpdated: 'Updated Feb 2026',
    statutoryForm: 'Unified Social Security Return Form SS-1'
  },
  {
    id: 'law-code-ir',
    title: 'Industrial Relations Code, 2020',
    jurisdiction: 'India - National',
    country: 'India',
    category: 'Contract Labor',
    shortSummary: 'Amalgamates Trade Unions Act 1926, Industrial Employment (Standing Orders) Act 1946, and Industrial Disputes Act 1947.',
    keyMandates: [
      'Threshold for standing orders certification raised to establishments with 300 or more workers',
      '14 days mandatory advance notice required prior to strikes or lockouts in all industrial establishments',
      'Establishment of Worker Re-skilling Fund with 15 days wages contribution per retrenched worker',
      'Recognition of Negotiating Union or Negotiating Council for collective bargaining'
    ],
    penaltyDetails: 'Civil monetary penalties up to ₹10,00,000 for illegal retrenchment, closure, or standing orders breach.',
    applicability: 'Industrial establishments, factories, and commercial undertakings in India.',
    lastUpdated: 'Updated Jan 2026',
    statutoryForm: 'Form IR-1 Notice of Industrial Change'
  },
  {
    id: 'law-code-osh',
    title: 'Occupational Safety, Health & Working Conditions Code, 2020',
    jurisdiction: 'India - National',
    country: 'India',
    category: 'Workplace Safety & POSH',
    shortSummary: 'Replaces Factories Act 1948, Contract Labour Act 1970, Inter-State Migrant Workmen Act 1979, and 10 other safety laws into one unified code.',
    keyMandates: [
      'Mandatory free annual health examination for all workers above 40 years of age',
      'Employment of female workers permitted across all establishments during night shifts (7 PM to 6 AM) subject to mandatory consent and safety transport',
      'Single license for contract labor hiring, factory operation, and hazardous work across multiple states',
      'Annual journey allowance disburser for inter-state migrant workers'
    ],
    penaltyDetails: 'Penalties up to ₹2,00,000 to ₹20,00,000 for safety violations causing grievous hurt or fatal accidents.',
    applicability: 'Factories with 20+ workers (with power) or 40+ workers (without power), and establishments with 50+ contract workers.',
    lastUpdated: 'Updated Feb 2026',
    statutoryForm: 'Unified OSH Inspection Register & Form OSH-A'
  },

  // -------------------------------------------------------------
  // CORE CENTRAL INDIAN STATUTES
  // -------------------------------------------------------------
  {
    id: 'law-posh-2013',
    title: 'Sexual Harassment of Women at Workplace (POSH) Act, 2013',
    jurisdiction: 'India - National',
    country: 'India',
    category: 'Workplace Safety & POSH',
    shortSummary: 'Mandates preventive policies, Internal Committees (IC), prompt inquiry procedures, and mandatory annual reporting against workplace sexual harassment.',
    keyMandates: [
      'Establishment of Internal Committee (IC) chaired by a senior female employee at every branch/office',
      'Inclusion of an independent external member (NGO or legal background) in every IC',
      'Statutory 90-day inquiry completion deadline for written complaints',
      'Submission of Annual POSH Return to District Officer by January 31st every calendar year'
    ],
    penaltyDetails: 'Fine up to ₹50,000 for non-constitution of IC; cancellation of business license/registration on repeated offense under Section 26.',
    applicability: 'Every organization, office, branch, or factory with 10 or more employees.',
    lastUpdated: 'Updated Feb 2026',
    statutoryForm: 'Form Annual POSH Compliance Return'
  },
  {
    id: 'law-epf-1952',
    title: 'Employees Provident Funds & Misc Provisions Act, 1952',
    jurisdiction: 'India - National',
    country: 'India',
    category: 'Social Security & PF',
    shortSummary: 'Regulates statutory retirement benefits, provident fund contribution rates, pension scheme (EPS), and EDLI life insurance for eligible employees.',
    keyMandates: [
      '12% statutory employer & employee contribution on basic pay + DA (statutory wage ceiling cap at ₹15,000/month)',
      'Monthly Electronic Challan cum Return (ECR) filing by the 15th of following month',
      'Mandatory Universal Account Number (UAN) seeding and Aadhaar KYC verification',
      '0.5% EDLI insurance contribution and administrative charges'
    ],
    penaltyDetails: 'Damages ranging from 5% to 25% per annum for delayed remittances under Section 14B; criminal prosecution under IPC 406/409.',
    applicability: 'Establishments employing 20 or more workers.',
    lastUpdated: 'Updated Jan 2026',
    statutoryForm: 'Form 5, Form 10, Form 3A/12A & ECR Return'
  },
  {
    id: 'law-esi-1948',
    title: 'Employees State Insurance (ESI) Act, 1948',
    jurisdiction: 'India - National',
    country: 'India',
    category: 'Social Security & PF',
    shortSummary: 'Integrated social security scheme providing full medical care, sickness benefit, maternity benefit, and disability compensation for covered wage earners.',
    keyMandates: [
      'Employer contribution of 3.25% and Employee contribution of 0.75% of gross wages',
      'Applicable to employees drawing gross salary up to ₹21,000 per month (₹25,000 for employees with disability)',
      'Monthly filing of ESIC contribution by the 15th of every month',
      'Issuance of ESI Pehchan Identity cards to all covered workers and dependents'
    ],
    penaltyDetails: 'Interest at 12% per annum and imprisonment up to 2 years for non-payment or fraudulent recovery under Section 85.',
    applicability: 'Non-seasonal factories and notified commercial establishments with 10 or more employees.',
    lastUpdated: 'Updated Jan 2026',
    statutoryForm: 'Form 5 Monthly Return & Form 6 Register'
  },
  {
    id: 'law-gratuity-1972',
    title: 'Payment of Gratuity Act, 1972',
    jurisdiction: 'India - National',
    country: 'India',
    category: 'Social Security & PF',
    shortSummary: 'Statutory lump-sum retirement benefit payable to employees upon superannuation, retirement, resignation, or death after 5 years continuous service.',
    keyMandates: [
      'Calculation formula: (15 / 26) × Last Drawn Basic Salary + DA × Completed Years of Service',
      'Statutory capping ceiling of ₹20,000,000 (₹20 Lakhs) tax-exempt gratuity payout',
      'Mandatory submission of Form F nomination by employee within 30 days of joining',
      'Payment must be disbursed within 30 days from date of termination/resignation'
    ],
    penaltyDetails: 'Imprisonment from 6 months up to 2 years and fine up to ₹20,000 for failure to pay statutory gratuity under Section 9.',
    applicability: 'Factories, mines, oilfields, plantations, ports, shops, and establishments employing 10 or more workers.',
    lastUpdated: 'Updated Feb 2026',
    statutoryForm: 'Form F Nomination & Form L Notice of Gratutity'
  },
  {
    id: 'law-maternity-1961',
    title: 'Maternity Benefit Act, 1961 (Amended 2017)',
    jurisdiction: 'India - National',
    country: 'India',
    category: 'Leave & Holidays',
    shortSummary: 'Provides fully paid maternity leave, crèche access, nursing breaks, and protection against dismissal during pregnancy.',
    keyMandates: [
      '26 weeks fully paid maternity leave for up to 2 surviving children (12 weeks for 3rd child or commissioning/adoptive mothers)',
      'Mandatory crèche facility within 500 meters for establishments with 50 or more employees, allowing 4 daily visits',
      'Work-from-home option permitted post maternity leave upon mutual agreement with employer',
      'Prohibition of dismissal, termination, or notice during maternity leave period'
    ],
    penaltyDetails: 'Imprisonment up to 1 year and fine up to ₹5,000 for withholding maternity benefits under Section 21.',
    applicability: 'Factories, mines, plantations, and shops/establishments employing 10 or more workers.',
    lastUpdated: 'Updated Feb 2026',
    statutoryForm: 'Form K Muster Roll & Form A Annual Return'
  },
  {
    id: 'law-contract-labor-1970',
    title: 'Contract Labour (Regulation & Abolition) Act, 1970',
    jurisdiction: 'India - National',
    country: 'India',
    category: 'Contract Labor',
    shortSummary: 'Regulates engagement of contract labor in establishments, mandates contractor licensing, welfare facilities, and principal employer liability.',
    keyMandates: [
      'Principal Employer registration required if engaging 20 or more contract workers',
      'Ensuring contractor possesses valid license under Section 12 from Labour Department',
      'Direct statutory responsibility of Principal Employer to disburse unpaid wages if contractor defaults',
      'Provision of mandatory welfare amenities: canteen, restrooms, drinking water, and first-aid kits'
    ],
    penaltyDetails: 'Imprisonment up to 3 months or fine up to ₹1,000 per day for continuing contravention.',
    applicability: 'Establishments and contractors employing 20 or more contract workers.',
    lastUpdated: 'Updated Dec 2025',
    statutoryForm: 'Form V Principal Employer Certificate & Form VI-A'
  },
  {
    id: 'law-bonus-1965',
    title: 'Payment of Bonus Act, 1965',
    jurisdiction: 'India - National',
    country: 'India',
    category: 'Wages & Hours',
    shortSummary: 'Mandates annual profit-sharing bonus disburser to eligible employees based on profits or statutory minimum floor.',
    keyMandates: [
      'Statutory minimum bonus of 8.33% (or ₹100, whichever is higher) and maximum bonus of 20% of annual earned wages',
      'Applicable to employees drawing basic + DA up to ₹21,000 per month (calculation capped at ₹7,000/month or minimum wage rate)',
      'Payment must be disbursed in cash within 8 months from closing of accounting year (by November 30th)',
      'Maintenance of Register of Allocable Surplus (Form A), Set-on/Set-off (Form B), and Bonus Register (Form C)'
    ],
    penaltyDetails: 'Imprisonment up to 6 months or fine up to ₹1,000 for non-payment or filing false returns.',
    applicability: 'Factories and all commercial establishments employing 20 or more workers.',
    lastUpdated: 'Updated Jan 2026',
    statutoryForm: 'Form A, Form B, Form C Registers & Form D Annual Return'
  },
  {
    id: 'law-min-wages-1948',
    title: 'Minimum Wages Act, 1948',
    jurisdiction: 'India - National',
    country: 'India',
    category: 'Wages & Hours',
    shortSummary: 'Fixes and revises minimum wage rates across scheduled employments comprising Basic Wage and Variable Dearness Allowance (VDA).',
    keyMandates: [
      'Payment of minimum wage rates prescribed by relevant State/Central Govt based on skill category (Unskilled, Semi-skilled, Skilled, Highly Skilled)',
      'Variable Dearness Allowance (VDA) revised semi-annually (April 1st & October 1st) linked to CPI consumer price index',
      'Mandatory double wage rate for hours worked beyond 9 hours in a day or 48 hours in a week',
      'Display of minimum wage notice in English and local language at prominent workplace entry points'
    ],
    penaltyDetails: 'Imprisonment up to 6 months or fine up to ₹500 for paying less than statutory minimum wages.',
    applicability: 'All scheduled employments listed under Central and State lists in India.',
    lastUpdated: 'Updated Jan 2026',
    statutoryForm: 'Form I Wage Register & Form IV Annual Return'
  },
  {
    id: 'law-payment-wages-1936',
    title: 'Payment of Wages Act, 1936',
    jurisdiction: 'India - National',
    country: 'India',
    category: 'Wages & Hours',
    shortSummary: 'Regulates timely payment of wages and prohibits unauthorized fines or unlawful deductions from employee salaries.',
    keyMandates: [
      'Wages must be disbursed before expiry of the 7th day (for <1000 workers) or 10th day (for >1000 workers) after wage period',
      'Payment must be made in legal tender, bank transfer, or cheque without mandatory cash discounts',
      'Total permissible deductions (absence, amenities, statutory PF/tax) capped at maximum 50% of total wages',
      'Prohibition of unauthorized fines; fine register must be maintained'
    ],
    penaltyDetails: 'Fine up to ₹3,750 for delayed disbursement; compensation up to 10x deducted amount recoverable via Labour Court.',
    applicability: 'Persons employed in factories, railways, and commercial establishments drawing wages up to ₹24,000/month.',
    lastUpdated: 'Updated Jan 2026',
    statutoryForm: 'Form I Register of Fines & Form III Annual Return'
  },
  {
    id: 'law-factories-1948',
    title: 'Factories Act, 1948',
    jurisdiction: 'India - National',
    country: 'India',
    category: 'Workplace Safety & POSH',
    shortSummary: 'Comprehensive statute governing health, safety, welfare measures, working hours, and leave for manufacturing factory workers.',
    keyMandates: [
      'Maximum 48 working hours per week and 9 hours per day; rest interval of 30 minutes after 5 continuous hours',
      'Overtime wages calculated at 2.0x double regular rate for extra hours worked',
      'Appointment of qualified Safety Officer for factories employing 1,000 or more workers',
      'Mandatory canteen facility for 250+ workers, lunchroom for 150+ workers, and crèche for 30+ female workers'
    ],
    penaltyDetails: 'Imprisonment up to 2 years or fine up to ₹1,00,000 for general contravention; up to ₹2,00,000 for fatal accident.',
    applicability: 'Premises employing 10+ workers (with power) or 20+ workers (without power) engaged in manufacturing.',
    lastUpdated: 'Updated Dec 2025',
    statutoryForm: 'Form 2 Factory License Renewal & Form 21 Annual Return'
  },
  {
    id: 'law-industrial-disputes-1947',
    title: 'Industrial Disputes Act, 1947',
    jurisdiction: 'India - National',
    country: 'India',
    category: 'Contract Labor',
    shortSummary: 'Provides mechanism for investigation and settlement of industrial disputes, lay-off, retrenchment compensation, and closure notice.',
    keyMandates: [
      'Statutory retrenchment compensation equal to 15 days average pay for every completed year of continuous service',
      '30 days advance notice (or pay in lieu) required for retrenchment of workmen with 1 year service',
      'Prior government permission required for layoff or closure in industrial units with 100+ workmen',
      'Prohibition of unfair labor practices listed under Schedule V'
    ],
    penaltyDetails: 'Imprisonment up to 6 months or fine up to ₹1,000 for illegal strike, lockout, or unfair labor practice.',
    applicability: 'All industrial establishments and workmen defined under Section 2(s).',
    lastUpdated: 'Updated Jan 2026',
    statutoryForm: 'Form N Retrenchment Notice & Form O Closure Notice'
  },
  {
    id: 'law-standing-orders-1946',
    title: 'Industrial Employment (Standing Orders) Act, 1946',
    jurisdiction: 'India - National',
    country: 'India',
    category: 'Wages & Hours',
    shortSummary: 'Requires employers in industrial establishments to formally define and certify conditions of employment and service rules.',
    keyMandates: [
      'Drafting and statutory submission of Standing Orders defining working shift timings, attendance, leave, misconduct, and suspension',
      'Payment of subsistence allowance (50% for first 90 days, 75% thereafter) to suspended employees during inquiry',
      'Mandatory display of approved standing orders in English and local language on notice boards',
      'No modification permitted within 6 months of certification without agreement'
    ],
    penaltyDetails: 'Fine up to ₹5,000 for failure to submit draft standing orders and ₹200 per day for continuing breach.',
    applicability: 'Industrial establishments employing 100 or more workmen (50 in Maharashtra, Karnataka, and UP).',
    lastUpdated: 'Updated Feb 2026',
    statutoryForm: 'Form I Draft Standing Orders Certification'
  },
  {
    id: 'law-equal-remuneration-1976',
    title: 'Equal Remuneration Act, 1976',
    jurisdiction: 'India - National',
    country: 'India',
    category: 'Wages & Hours',
    shortSummary: 'Mandates payment of equal remuneration to men and women workers and prevents gender discrimination in employment.',
    keyMandates: [
      'Duty of employer to pay equal remuneration to men and women for same work or work of a similar nature',
      'Strict prohibition of gender discrimination while recruiting, training, promoting, or transferring staff',
      'Maintenance of Form D register showing headcount, designation, and remuneration broken down by gender'
    ],
    penaltyDetails: 'Fine up to ₹10,000 to ₹20,000 for first offense; imprisonment up to 1 year for subsequent offenses.',
    applicability: 'All establishments and employments across India.',
    lastUpdated: 'Updated Jan 2026',
    statutoryForm: 'Form D Register of Equal Remuneration'
  },
  {
    id: 'law-apprentices-1961',
    title: 'Apprentices Act, 1961',
    jurisdiction: 'India - National',
    country: 'India',
    category: 'Wages & Hours',
    shortSummary: 'Regulates training programs for trade, graduate, technician, and vocational apprentices in commercial establishments.',
    keyMandates: [
      'Mandatory engagement of apprentices ranging from 2.5% to 15% of total employee strength (including contract workers)',
      'Disbursement of statutory monthly stipend (linked to minimum wages and educational qualification)',
      'Registration of apprenticeship contracts on the National Apprenticeship Promotion Scheme (NAPS) portal',
      'Maximum 42 to 48 working hours per week; prohibition of OT for apprentices'
    ],
    penaltyDetails: 'Fine of ₹500 per apprentice per month for failure to engage mandatory quota of apprentices under Section 30.',
    applicability: 'All establishments employing 30 or more workers (optional for 4 to 29 workers).',
    lastUpdated: 'Updated Feb 2026',
    statutoryForm: 'NAPS Online Apprenticeship Contract & Form App-1'
  },
  {
    id: 'law-rpwd-2016',
    title: 'Rights of Persons with Disabilities (RPwD) Act, 2016',
    jurisdiction: 'India - National',
    country: 'India',
    category: 'Workplace Safety & POSH',
    shortSummary: 'Mandates equal opportunity policies, non-discrimination in recruitment/promotion, and accessibility for persons with disabilities.',
    keyMandates: [
      'Notification and publication of Equal Opportunity Policy on corporate website and registration with State Commissioner',
      'Appointment of a Liaison Officer to oversee recruitment and accommodation for persons with benchmark disabilities',
      'Strict prohibition of discrimination in employment, promotion, or training on grounds of disability',
      'Compliance with physical and digital workplace accessibility standards (WCAG / IS 16333)'
    ],
    penaltyDetails: 'Fine up to ₹10,000 for first violation; fine up to ₹50,000 to ₹5,000,000 for subsequent contraventions.',
    applicability: 'All private and public establishments employing 20 or more persons in India.',
    lastUpdated: 'Updated Jan 2026',
    statutoryForm: 'Equal Opportunity Policy Registration Form'
  },
  {
    id: 'law-emp-exchanges-1959',
    title: 'Employment Exchanges (Compulsory Notification of Vacancies) Act, 1959',
    jurisdiction: 'India - National',
    country: 'India',
    category: 'Wages & Hours',
    shortSummary: 'Mandates advance notification of job vacancies to local employment exchanges and quarterly statistical reporting.',
    keyMandates: [
      'Notification of all job vacancies (except executive roles exempt by law) to local Employment Exchange at least 15 days before filling',
      'Submission of Quarterly Return in Form ER-1 ending March, June, September, and December',
      'Submission of Occupational Return in Form ER-2 biennially'
    ],
    penaltyDetails: 'Fine up to ₹500 for first offense and ₹1,000 for subsequent offenses for non-notification of vacancies.',
    applicability: 'All private sector establishments employing 25 or more workers.',
    lastUpdated: 'Updated Dec 2025',
    statutoryForm: 'Form ER-1 Quarterly Return & Form ER-2 Biennial Return'
  },
  {
    id: 'law-interstate-migrant-1979',
    title: 'Inter-State Migrant Workmen (RE&CS) Act, 1979',
    jurisdiction: 'India - National',
    country: 'India',
    category: 'Contract Labor',
    shortSummary: 'Protects inter-state migrant workmen recruited by contractors, mandating displacement allowance and residential facilities.',
    keyMandates: [
      'Registration of principal employer and licensing of contractors employing 5 or more inter-state migrant workers',
      'Payment of Displacement Allowance equal to 50% of monthly wages (non-refundable)',
      'Payment of Journey Allowance including rail/bus fare during travel to and from home state',
      'Provision of suitable, hygienic residential accommodation and medical facilities'
    ],
    penaltyDetails: 'Imprisonment up to 1 year or fine up to ₹1,000 for non-provision of migrant worker allowances.',
    applicability: 'Establishments and contractors employing 5 or more inter-state migrant workers.',
    lastUpdated: 'Updated Jan 2026',
    statutoryForm: 'Form I Registration & Form X Migrant Muster Roll'
  },

  // -------------------------------------------------------------
  // INDIAN STATE-SPECIFIC SHOPS & ESTABLISHMENTS AND STATE ACTS
  // -------------------------------------------------------------
  {
    id: 'law-mh-shops-2017',
    title: 'Maharashtra Shops and Establishments Act, 2017',
    jurisdiction: 'India - Maharashtra',
    country: 'India',
    category: 'Wages & Hours',
    shortSummary: 'Governs working hours, overtime, weekly rest, leave, and working conditions for commercial establishments in Maharashtra.',
    keyMandates: [
      'Maximum 9 working hours per day and 48 hours per week; maximum 6 hours continuous work without 30-min rest',
      'Double wage rate (2.0x) for overtime exceeding 9 hours/day or 48 hours/week',
      'Mandatory 24 consecutive hours of weekly rest',
      'Online Intimation (Form F) for establishments with <10 workers; Registration (Form A) for 10+ workers',
      'Night shift for female employees permitted between 9.30 PM and 6.00 AM subject to transport and security measures'
    ],
    penaltyDetails: 'Fines up to ₹1,00,000 for non-compliance and potential suspension of establishment registration.',
    applicability: 'All commercial establishments, IT/ITeS companies, and retail shops in Maharashtra.',
    lastUpdated: 'Updated Jan 2026',
    statutoryForm: 'Form L Register of Overtime & Form N Annual Return'
  },
  {
    id: 'law-ka-shops-1961',
    title: 'Karnataka Shops and Commercial Establishments Act, 1961',
    jurisdiction: 'India - Karnataka',
    country: 'India',
    category: 'Wages & Hours',
    shortSummary: 'Regulates terms of service, working hours, leave, and night transport mandates for commercial and IT firms in Karnataka.',
    keyMandates: [
      'Maximum 9 working hours per day and 48 hours per week; OT capped at 50 hours per quarter',
      'Mandatory free security transport for female employees working on night shifts between 8:00 PM and 6:00 AM',
      '1 day earned leave for every 20 days worked; 12 days sickness leave per calendar year',
      'Submission of Form F Annual Return by January 31st every year'
    ],
    penaltyDetails: 'Fine up to ₹25,000 for initial breach; prosecution and daily fine up to ₹250 per day for continuing default.',
    applicability: 'All commercial establishments, software companies, and retail outlets in Karnataka.',
    lastUpdated: 'Updated Jan 2026',
    statutoryForm: 'Form F Annual Return & Form P Attendance Register'
  },
  {
    id: 'law-ka-holidays-1963',
    title: 'Karnataka Industrial Establishments (National & Festival Holidays) Act',
    jurisdiction: 'India - Karnataka',
    country: 'India',
    category: 'Leave & Holidays',
    shortSummary: 'Mandates paid national and festival holidays for workers in Karnataka establishments including IT/ITeS sector.',
    keyMandates: [
      'Mandatory 10 paid statutory holidays per calendar year (including Jan 26, Aug 15, Oct 2, Nov 1 Rajyotsava mandatory)',
      'Double wage rate or compensatory day off with full wages if an employee works on a notified statutory holiday',
      'Submission of Form V Notice of Holidays to local Labour Officer and display on notice board by January 31st'
    ],
    penaltyDetails: 'Fine up to ₹25,000 per violation and prosecution by District Labour Inspector.',
    applicability: 'All industrial, commercial, and IT/ITeS establishments in Karnataka.',
    lastUpdated: 'Updated Jan 2026',
    statutoryForm: 'Form V Notice of Statutory Holidays'
  },
  {
    id: 'law-dl-shops-1954',
    title: 'Delhi Shops and Establishments Act, 1954',
    jurisdiction: 'India - Delhi',
    country: 'India',
    category: 'Wages & Hours',
    shortSummary: 'Governs registration, opening/closing hours, leave entitlements, and termination notice rules in the National Capital Territory of Delhi.',
    keyMandates: [
      'Maximum 9 hours work per day and 48 hours per week; total OT hours capped at 150 hours per year',
      'Mandatory 1 month written notice or 1 month wages in lieu prior to employee termination after 3 months service',
      '15 days privilege leave, 12 days casual leave, and 12 days sickness leave per annum',
      'Mandatory payment of unavailed accumulated privilege leave encashment at termination'
    ],
    penaltyDetails: 'Fine up to ₹2,500 for non-registration or non-maintenance of registers; repeat fines up to ₹5,000.',
    applicability: 'All shops and commercial establishments operating within NCT of Delhi.',
    lastUpdated: 'Updated Feb 2026',
    statutoryForm: 'Form C Registration & Form G Wage Register'
  },
  {
    id: 'law-ts-shops-1988',
    title: 'Telangana & Andhra Pradesh Shops and Establishments Act, 1988',
    jurisdiction: 'India - Telangana',
    country: 'India',
    category: 'Wages & Hours',
    shortSummary: 'Regulates terms of employment, mandatory appointment letters, leave encashment, and safety rules in Telangana & Andhra Pradesh.',
    keyMandates: [
      'Mandatory issuance of written Appointment Letter in Form XXIV to every newly hired employee within 30 days',
      'Maximum 8 hours per day / 48 hours per week; double wage rate for overtime work',
      '15 days earned leave, 12 days casual leave, and 12 days sick leave per year',
      'Exemption for 24x7 operations for IT/ITeS companies subject to security & transport for female staff'
    ],
    penaltyDetails: 'Fines up to ₹10,000 for failure to issue Form XXIV appointment letter or maintain registers.',
    applicability: 'All commercial establishments, IT firms, and retail shops in Telangana and Andhra Pradesh.',
    lastUpdated: 'Updated Jan 2026',
    statutoryForm: 'Form XXIV Appointment Letter & Form XII Register'
  },
  {
    id: 'law-tn-shops-1947',
    title: 'Tamil Nadu Shops and Establishments Act, 1947',
    jurisdiction: 'India - Tamil Nadu',
    country: 'India',
    category: 'Wages & Hours',
    shortSummary: 'Regulates employment conditions, right to sit for retail workers, notice periods, and leave rules in Tamil Nadu.',
    keyMandates: [
      'Statutory "Right to Sit" provision requiring suitable seating facilities for all shop floor and retail employees',
      'Maximum 8 hours per day / 48 hours per week; overtime capped at 50 hours per quarter at 2.0x wage rate',
      '12 days earned leave, 12 days casual leave, and 12 days sick leave with full wages per year',
      'Display of notices in Tamil and English languages at establishment premises'
    ],
    penaltyDetails: 'Fine up to ₹5,000 for non-compliance with Right to Sit or working hour restrictions.',
    applicability: 'Shops, commercial establishments, theatres, and IT parks in Tamil Nadu.',
    lastUpdated: 'Updated Jan 2026',
    statutoryForm: 'Form O Attendance Register & Form C Notice'
  },
  {
    id: 'law-gj-shops-2019',
    title: 'Gujarat Shops and Establishments Act, 2019',
    jurisdiction: 'India - Gujarat',
    country: 'India',
    category: 'Wages & Hours',
    shortSummary: 'Eases registration compliance, allows 24/7 business operations, and regulates working conditions in Gujarat.',
    keyMandates: [
      'Establishments employing less than 10 workers need only submit one-time Intimation (Form B) with zero renewal fees',
      'Establishments employing 10 or more workers obtain online Registration Certificate valid for up to 10 years',
      '24x7 operational freedom for commercial establishments and IT units subject to safety & overtime double pay',
      'Mandatory weekly off and 30-min rest interval after 5 hours of work'
    ],
    penaltyDetails: 'Fines up to ₹50,000 for major non-compliance or failure to pay double overtime rates.',
    applicability: 'All commercial establishments and shops operating in Gujarat.',
    lastUpdated: 'Updated Feb 2026',
    statutoryForm: 'Form B Intimation & Form G Overtime Register'
  },
  {
    id: 'law-wb-shops-1963',
    title: 'West Bengal Shops and Establishments Act, 1963',
    jurisdiction: 'India - West Bengal',
    country: 'India',
    category: 'Wages & Hours',
    shortSummary: 'Regulates working hours, 1.5 days mandatory weekly closure, leave encashment, and registration in West Bengal.',
    keyMandates: [
      'Mandatory 1.5 days weekly closure for commercial establishments (1 full day and 1 half day)',
      'Maximum 8.5 working hours per day and 48 hours per week; daily overtime capped at 1.5 hours',
      '14 days privilege leave, 10 days casual leave, and 14 days sick leave per annum',
      'Notification of any structural change in establishment within 7 days to Labour Inspector'
    ],
    penaltyDetails: 'Fine up to ₹1,000 for first violation and imprisonment up to 3 months for repeat offenses.',
    applicability: 'Shops, offices, and commercial establishments in West Bengal.',
    lastUpdated: 'Updated Dec 2025',
    statutoryForm: 'Form B Certificate & Form G Wage Register'
  },
  {
    id: 'law-mh-pt-1975',
    title: 'Maharashtra Professional Tax (PT) Act, 1975',
    jurisdiction: 'India - Maharashtra',
    country: 'India',
    category: 'Social Security & PF',
    shortSummary: 'Mandates employer registration (PTRC) and enrollment (PTEC), monthly salary deductions, and statutory returns in Maharashtra.',
    keyMandates: [
      'Monthly Professional Tax deduction from employee gross salary based on statutory slabs (e.g. ₹200/month, ₹300 in Feb for salary > ₹10,000)',
      'Monthly e-filing of Form 5 return by the last day of following month for employers with tax liability > ₹1,00,000',
      'Mandatory PTRC (tax deduction) and PTEC (corporate enrollment tax of ₹2,500/year) registration',
      'Interest at 1.25% per month for delayed tax remittance'
    ],
    penaltyDetails: 'Penalty up to 10% of tax amount for delayed payment plus ₹1,000 penalty for late return filing.',
    applicability: 'All employers and self-employed professionals operating in Maharashtra.',
    lastUpdated: 'Updated Jan 2026',
    statutoryForm: 'Form 5 Monthly PT Return & PTRC/PTEC Certificate'
  },
  {
    id: 'law-ka-pt-lwf',
    title: 'Karnataka Professional Tax & State Labour Welfare Fund (LWF) Rules',
    jurisdiction: 'India - Karnataka',
    country: 'India',
    category: 'Social Security & PF',
    shortSummary: 'Regulates monthly Karnataka Professional Tax slab deductions and bi-annual Labour Welfare Fund contributions.',
    keyMandates: [
      'Professional Tax deduction of ₹200 per month for employees earning gross salary ₹15,000 or higher',
      'Bi-annual Labour Welfare Fund (LWF) contribution: ₹20 employer contribution + ₹10 employee contribution per worker in December',
      'Annual PT Return Form 5 filing by April 30th for the preceding financial year',
      'Online e-payment through e-Prerana portal'
    ],
    penaltyDetails: 'Interest at 1.25% per month on unpaid PT and 20% penalty on overdue LWF contributions.',
    applicability: 'All employers operating in Karnataka with salaried employees.',
    lastUpdated: 'Updated Jan 2026',
    statutoryForm: 'Form 5 Annual PT Return & LWF Form A'
  },
  {
    id: 'law-multi-lwf',
    title: 'State Labour Welfare Fund (LWF) Acts (Maharashtra, Gujarat, TN, WB, Punjab)',
    jurisdiction: 'India - Multi-State',
    country: 'India',
    category: 'Social Security & PF',
    shortSummary: 'Statutory bi-annual welfare fund contribution managed by State Welfare Boards for employee medical, educational, and recreational aid.',
    keyMandates: [
      'Statutory deduction from employee salary and matching employer contribution twice a year (June 30th and December 31st)',
      'Maharashtra LWF rate: ₹25 employee + ₹75 employer (for salary > ₹3,000); Gujarat LWF rate: ₹6 employee + ₹12 employer',
      'Remittance to State Labour Welfare Commissioner within 15 days of deduction period',
      'Unclaimed wages and accumulated fines must be deposited into the State LWF account'
    ],
    penaltyDetails: 'Interest at 18% per annum for delayed remittance and recovery through Revenue Recovery Certificate.',
    applicability: 'Factories and commercial establishments employing 5 or more workers in participating states.',
    lastUpdated: 'Updated Feb 2026',
    statutoryForm: 'Form A LWF Remittance Statement'
  },

  // -------------------------------------------------------------
  // INTERNATIONAL COMPARATIVE BENCHMARK STATUTES
  // -------------------------------------------------------------
  {
    id: 'law-ca-ab5',
    title: 'California Labor Code & Overtime Regulations (AB 5 / FLSA)',
    jurisdiction: 'US - California',
    country: 'US',
    category: 'Wages & Hours',
    shortSummary: 'Strict daily and weekly overtime calculations, mandatory meal and rest break rules, and ABC test for worker classification.',
    keyMandates: [
      'Overtime pay (1.5x) for hours worked over 8 in a workday or 40 in a workweek',
      'Double time pay (2.0x) for hours worked over 12 in a workday or over 8 on the 7th consecutive day',
      '30-minute off-duty meal break for work periods exceeding 5 hours',
      '10-minute paid rest break for every 4 hours worked'
    ],
    penaltyDetails: '1 hour of extra pay at regular rate for each missed break; civil penalties under PAGA.',
    applicability: 'All California non-exempt employees and contractors.',
    lastUpdated: 'Updated Jan 2026',
    statutoryForm: 'CA Paystub Itemization Statement'
  },
  {
    id: 'law-ny-wage-transparency',
    title: 'New York Pay Transparency & Wage Theft Prevention Act',
    jurisdiction: 'US - New York',
    country: 'US',
    category: 'Wages & Hours',
    shortSummary: 'Requires mandatory wage ranges on job postings and detailed written wage notices at hire.',
    keyMandates: [
      'Disclosure of minimum and maximum salary ranges for all advertised jobs',
      'Written wage rate notice provided at hire and upon pay rate change',
      'Itemized paystubs listing regular rate, overtime rate, hours, and deductions'
    ],
    penaltyDetails: 'Civil penalties up to $5,000 per employee under NY Wage Theft Prevention Act.',
    applicability: 'All employers with 4 or more employees operating in NY State.',
    lastUpdated: 'Updated Feb 2026',
    statutoryForm: 'NY DOL LS54 Form'
  },
  {
    id: 'law-uk-era-1996',
    title: 'UK Employment Rights Act 1996 & Working Time Regulations',
    jurisdiction: 'UK - National',
    country: 'UK',
    category: 'Wages & Hours',
    shortSummary: 'Statutory rights regarding written particulars, maximum 48-hour working week opt-out, statutory redundancy pay, and unfair dismissal protection.',
    keyMandates: [
      'Written statement of employment particulars provided on or before Day 1 of employment',
      '48-hour average weekly limit on working time (unless employee explicitly opts out in writing)',
      '5.6 weeks (28 days) paid annual leave entitlement per year for full-time workers',
      'Statutory redundancy pay for employees with 2+ years continuous service'
    ],
    penaltyDetails: 'Unlimited compensation awards for automatic unfair dismissal or discrimination at Employment Tribunal.',
    applicability: 'All workers and employees in England, Scotland, and Wales.',
    lastUpdated: 'Updated Jan 2026',
    statutoryForm: 'UK Section 1 Written Statement of Employment'
  }
];
