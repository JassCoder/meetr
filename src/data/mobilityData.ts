import { AnonymizedCaseRecord } from '../types';

export interface VisaRequirementStep {
  id: string;
  category: 'Admission' | 'Financial Proof' | 'Accommodation & Insurance' | 'Education Documents' | 'Consular Procedure';
  title: string;
  requirementDetail: string;
  officialSource: string;
  importance: 'Mandatory' | 'Critical Document' | 'Helpful Preparation';
}

export interface EUMobilityCountryRule {
  country: string;
  countryCode: string;
  visaType: string;
  subsistenceMonthlyEur: number;
  subsistenceAnnualEur: number;
  healthInsuranceRule: string;
  postStudyWorkMonths: number;
  postStudyVisaName: string;
  inStudyWorkRights: string;
  euDirectiveMobilityNotes: string;
}

export const EU_COUNTRIES_MOBILITY: EUMobilityCountryRule[] = [
  {
    country: 'Germany',
    countryCode: 'DE',
    visaType: 'National Visa (Type D) / § 16b AufenthG Student Residence Permit',
    subsistenceMonthlyEur: 992,
    subsistenceAnnualEur: 11904,
    healthInsuranceRule: 'Statutory Student Health Insurance (GKV: TK, AOK, Barmer ~€120-€130/month) or approved private equivalent.',
    postStudyWorkMonths: 18,
    postStudyVisaName: '18-month Jobseeker Residence Permit (§ 20 Abs. 3 Nr. 1 AufenthG) leading to EU Blue Card',
    inStudyWorkRights: '140 full days or 280 half days per calendar year without special permit.',
    euDirectiveMobilityNotes: 'EU Directive 2016/801 enables intra-EU mobility for up to 360 days if registered at another EU partner university.',
  },
  {
    country: 'Netherlands',
    countryCode: 'NL',
    visaType: 'Entry Visa (MVV) & Residence Permit (VVR) via Institutional Sponsorship',
    subsistenceMonthlyEur: 1050,
    subsistenceAnnualEur: 12600,
    healthInsuranceRule: 'AON Student Insurance or Dutch Basic Health Insurance (Zorgverzekering) if working part-time.',
    postStudyWorkMonths: 12,
    postStudyVisaName: '1-Year "Zoekjaar" (Orientation Year for Highly Educated Persons)',
    inStudyWorkRights: 'Max 16 hours per week during term time or full-time during June, July, August (TWV work permit required).',
    euDirectiveMobilityNotes: 'Easy transfer to high-skilled migrant scheme with lowered salary criterion (€2,801/mo gross during search year).',
  },
  {
    country: 'France',
    countryCode: 'FR',
    visaType: 'Visa Long Séjour valant Titre de Séjour (VLS-TS Étudiant)',
    subsistenceMonthlyEur: 615,
    subsistenceAnnualEur: 7380,
    healthInsuranceRule: 'Free affiliation to the French Social Security system (Sécurité Sociale étudiante / Ameli).',
    postStudyWorkMonths: 12,
    postStudyVisaName: '12-month RECE (Recherche d’emploi ou création d’entreprise) temporary residence card',
    inStudyWorkRights: 'Up to 60% of annual statutory working time (964 hours per year) with no prior authorization needed.',
    euDirectiveMobilityNotes: 'Path to Passeport Talent / Salarié Qualifié upon obtaining qualifying employment offer.',
  },
  {
    country: 'Sweden',
    countryCode: 'SE',
    visaType: 'Residence Permit for Higher Education (Uppehållstillstånd för högre utbildning)',
    subsistenceMonthlyEur: 850,
    subsistenceAnnualEur: 10200, // ~9,450 SEK/month
    healthInsuranceRule: 'Kammarkollegiet FAS+ state insurance provided by universities for fee-paying international students.',
    postStudyWorkMonths: 12,
    postStudyVisaName: '12-Month Job Search Residence Permit after graduation',
    inStudyWorkRights: 'No statutory hourly cap on part-time employment during valid student permit, provided study progress is maintained.',
    euDirectiveMobilityNotes: 'Eligible for Swedish work permit and subsequent fast-track permanent residence after 4 years.',
  },
  {
    country: 'Finland',
    countryCode: 'FI',
    visaType: 'Continuous Residence Permit (A-permit) for Degree Studies',
    subsistenceMonthlyEur: 800,
    subsistenceAnnualEur: 9600,
    healthInsuranceRule: 'Private comprehensive health insurance (e.g. Swisscare, SIP) covering up to €120,000 for studies over 2 years.',
    postStudyWorkMonths: 24,
    postStudyVisaName: '2-Year Post-Study Jobseeker Permit (can be split or used within 5 years of graduation)',
    inStudyWorkRights: 'Up to 30 hours per week average during terms; unlimited during summer/vacations.',
    euDirectiveMobilityNotes: 'Finnish degree study time counts 100% towards the 4-year permanent residency qualification period.',
  },
  {
    country: 'Ireland',
    countryCode: 'IE',
    visaType: 'Stamp 2 Student Immigration Permission & Irish Residence Permit (IRP)',
    subsistenceMonthlyEur: 1000,
    subsistenceAnnualEur: 10000,
    healthInsuranceRule: 'Private medical insurance covering hospitalization with minimum indemnity of €25,000.',
    postStudyWorkMonths: 24,
    postStudyVisaName: 'Third Level Graduate Scheme (Stamp 1G) — 12 months for Bachelor, 24 months for Master graduates',
    inStudyWorkRights: '20 hours/week during term; 40 hours/week during June-September and mid-December to mid-January.',
    euDirectiveMobilityNotes: 'Direct bridge to Irish Critical Skills Employment Permit (CSEP) in tech, software, and cybersecurity.',
  },
  {
    country: 'Poland',
    countryCode: 'PL',
    visaType: 'National D-11 Student Visa & Temporary Residence Card (Karta Pobytu)',
    subsistenceMonthlyEur: 650,
    subsistenceAnnualEur: 7800,
    healthInsuranceRule: 'NFZ (National Health Fund) Voluntary Student Insurance (~60 PLN / ~€14 per month) or Schengen-wide travel policy.',
    postStudyWorkMonths: 9,
    postStudyVisaName: '9-Month Post-Graduation Search for Work Temporary Residence (Pobyt czasowy dla absolwenta)',
    inStudyWorkRights: 'Full-time stationary university graduates and students are exempt from obtaining a work permit.',
    euDirectiveMobilityNotes: 'Exemption from work permit test for stationary university degree holders across all Polish employers.',
  },
  {
    country: 'Estonia',
    countryCode: 'EE',
    visaType: 'Temporary Residence Permit (TRP) for Study / Long-Stay D Visa',
    subsistenceMonthlyEur: 600,
    subsistenceAnnualEur: 7200,
    healthInsuranceRule: 'Private health insurance policy recognized by Estonian Police and Border Guard Board (PPA).',
    postStudyWorkMonths: 9,
    postStudyVisaName: '9-Month Stay Permission to seek employment / register a startup',
    inStudyWorkRights: 'Unlimited work hours permitted as long as it does not interfere with normative curriculum progress.',
    euDirectiveMobilityNotes: 'Estonian Startup Visa and digital-first e-Residency ecosystem with streamlined EU Blue Card transition.',
  },
];

export const EU_STUDENT_VISA_STEPS: VisaRequirementStep[] = [
  {
    id: 'step-acceptance',
    category: 'Admission',
    title: 'Official European University Acceptance Letter',
    requirementDetail: 'Unconditional admission letter issued by an accredited higher education institution registered in the EU Tertiary Education Register, confirming full-time stationary study mode.',
    officialSource: 'EU Directive 2016/801 on conditions of entry and residence for students',
    importance: 'Mandatory',
  },
  {
    id: 'step-tuition-proof',
    category: 'Financial Proof',
    title: 'Tuition Fee Payment or Full-Waiver Confirmation',
    requirementDetail: 'Bank wire SWIFT confirmation or official university fee voucher showing first semester/annual tuition has been settled, or official scholarship waiver declaration.',
    officialSource: 'National Consular Visa Guidelines across EU Member States',
    importance: 'Mandatory',
  },
  {
    id: 'step-living-funds',
    category: 'Financial Proof',
    title: 'Statutory Subsistence Proof (Blocked Account or Liquid Funds)',
    requirementDetail: 'Varies by destination: Germany requires a Sperrkonto (€11,904/yr), Netherlands IND requires ~€12,600/yr, Poland requires ~€7,800/yr + travel reserve, France requires ~€7,380/yr, Finland requires ~€9,600/yr.',
    officialSource: 'EU Immigration Regulations & National Statutory Minimums',
    importance: 'Mandatory',
  },
  {
    id: 'step-accommodation',
    category: 'Accommodation & Insurance',
    title: 'Proof of Accommodation (Campus Housing or Registered Lease)',
    requirementDetail: 'University student hall allotment letter or stamped rental agreement covering the minimum initial period required by national immigration authorities.',
    officialSource: 'National Residence and Foreigners Acts',
    importance: 'Mandatory',
  },
  {
    id: 'step-insurance',
    category: 'Accommodation & Insurance',
    title: 'Comprehensive Health Insurance (€30,000+ Schengen Minimum)',
    requirementDetail: 'Valid health policy covering hospital repatriation and emergency medical treatment across all Schengen territory, or proof of enrolment in the host state’s public student healthcare system.',
    officialSource: 'Schengen Visa Code & National Health Authorities',
    importance: 'Mandatory',
  },
  {
    id: 'step-apostille',
    category: 'Education Documents',
    title: 'Diploma Apostille / Legalization & Certified Translation',
    requirementDetail: 'Official secondary school leaving certificate bearing the Hague Apostille stamp or consular legalization, accompanied by certified translation into English or host country language.',
    officialSource: 'Hague Apostille Convention & ENIC-NARIC European Recognition Network',
    importance: 'Critical Document',
  },
  {
    id: 'step-consular-interview',
    category: 'Consular Procedure',
    title: 'Consular Visa Appointment & Biometric Registration',
    requirementDetail: 'Submit biometrics (digital fingerprinting and biometric photo) at the relevant Embassy, Consulate, or authorized visa partner (VFS Global / TLScontact). Typical processing takes 15 to 45 calendar days.',
    officialSource: 'European Commission Visa Information System (VIS)',
    importance: 'Mandatory',
  },
];

// Backwards-compatible alias
export const POLAND_STUDENT_VISA_STEPS = EU_STUDENT_VISA_STEPS;

export const ANONYMIZED_CASES: AnonymizedCaseRecord[] = [
  {
    id: 'CASE-DE-BER-2024-19',
    voivodeship: 'Germany (Berlin)',
    authority: 'Landesamt für Einwanderung (LEA Berlin - Keplerstraße)',
    permitType: 'Aufenthaltserlaubnis (§ 16b AufenthG - Studies)',
    submissionYear: 2024,
    processingMonths: 3.5,
    outcome: 'Positive (Granted)',
    additionalDocumentsNeeded: ['Updated Blocked Account (Sperrkonto) statement with Fintiba/Expatrio', 'Confirmation of valid TK statutory health insurance'],
    notes: 'TU Berlin student; booked online appointment 8 weeks in advance; electronic residence title (eAT) issued for 2 years.',
  },
  {
    id: 'CASE-DE-MUC-2024-55',
    voivodeship: 'Germany (Munich)',
    authority: 'Kreisverwaltungsreferat (KVR München)',
    permitType: 'Aufenthaltserlaubnis (§ 16b AufenthG - Studies)',
    submissionYear: 2024,
    processingMonths: 4.1,
    outcome: 'Positive (Granted)',
    additionalDocumentsNeeded: ['Wohnungsgeberbestätigung (Landlord city registration confirmation)', 'Certificate of enrollment (Immatrikulationsbescheinigung) for current semester'],
    notes: 'TUM student; residence card granted with automatic authorization for 140 full days of part-time student employment.',
  },
  {
    id: 'CASE-NL-AMS-2024-12',
    voivodeship: 'Netherlands (Amsterdam)',
    authority: 'Immigratie- en Naturalisatiedienst (IND Amsterdam Desk)',
    permitType: 'Verblijfsvergunning Regulier (VVR - Study)',
    submissionYear: 2024,
    processingMonths: 1.8,
    outcome: 'Positive (Granted)',
    additionalDocumentsNeeded: ['Annual study progress monitoring confirmation (MoMi criterion: 50% ECTS achieved)'],
    notes: 'UvA student; fast university-sponsored fast-track application; biometric appointment completed within 10 days of arrival.',
  },
  {
    id: 'CASE-SE-STO-2024-88',
    voivodeship: 'Sweden (Stockholm)',
    authority: 'Migrationsverket (Stockholm / Sundbyberg)',
    permitType: 'Residence Permit for Higher Education',
    submissionYear: 2024,
    processingMonths: 2.9,
    outcome: 'Positive (Granted)',
    additionalDocumentsNeeded: ['Proof of comprehensive health coverage under Kammarkollegiet FAS+ agreement'],
    notes: 'KTH student; digital online portal submission; decision granted for full initial study year before entry to Sweden.',
  },
  {
    id: 'CASE-FR-PAR-2024-41',
    voivodeship: 'France (Paris)',
    authority: 'Préfecture de Police de Paris (Plateforme ANEF)',
    permitType: 'Titre de séjour étudiant (VLS-TS Validation)',
    submissionYear: 2024,
    processingMonths: 2.2,
    outcome: 'Positive (Granted)',
    additionalDocumentsNeeded: ['Validation of fiscal stamp (€50 taxe de séjour)', 'French bank statement showing monthly deposit guarantee'],
    notes: 'École Polytechnique bachelor student; 100% digital submission via ANEF portal; attestation de prolongation issued seamlessly.',
  },
  {
    id: 'CASE-PL-WAW-2024-81',
    voivodeship: 'Poland (Warsaw)',
    authority: 'Mazowiecki Urząd Wojewódzki (Wydział Spraw Cudzoziemców)',
    permitType: 'Temporary Residence — Full-time Studies (Karta Pobytu)',
    submissionYear: 2024,
    processingMonths: 6.8,
    outcome: 'Positive (Granted)',
    additionalDocumentsNeeded: ['Bank statement showing required PLN subsistence and return travel reserve', 'Dean’s progress certificate from Warsaw Tech'],
    notes: 'Fingerprint appointment after 3.5 months; red stamp placed in passport allowing legal residency; card valid for 15 months.',
  },
  {
    id: 'CASE-PL-KRK-2024-42',
    voivodeship: 'Poland (Kraków)',
    authority: 'Małopolski Urząd Wojewódzki (Wydział Spraw Cudzoziemców)',
    permitType: 'Temporary Residence — Full-time Studies (Karta Pobytu)',
    submissionYear: 2024,
    processingMonths: 5.2,
    outcome: 'Positive (Granted)',
    additionalDocumentsNeeded: ['Residential lease agreement with landlord tax identification number'],
    notes: 'AGH Computer Science student; online submission through inPOL; card issued 3 weeks after final positive decision.',
  },
  {
    id: 'CASE-EE-TAL-2024-07',
    voivodeship: 'Estonia (Tallinn)',
    authority: 'Police and Border Guard Board (Politsei- ja Piirivalveamet - PPA)',
    permitType: 'Temporary Residence Permit for Study (Tähtajaline elamisluba)',
    submissionYear: 2024,
    processingMonths: 1.5,
    outcome: 'Positive (Granted)',
    additionalDocumentsNeeded: ['DreamApply admission verification code', 'Proof of funds in euro-denominated account'],
    notes: 'TalTech Cybersecurity student; fully digitized e-ID card issued within 4 weeks; permit granted for full duration of Bachelor degree.',
  },
];
