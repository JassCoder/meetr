// MEETR — Data Types and Interfaces

export type DegreeLevel = 'Bachelor' | 'Engineering (Inżynier)' | 'Master' | 'Integrated Master';
export type StudyLanguage = 'English' | 'Polish' | 'German' | 'Dutch' | 'French' | 'Swedish' | 'Bilingual';
export type DemandLevel = 'Very High' | 'High' | 'Moderate';
export type VerificationStatus = 
  | 'VERIFIED_EU_OPEN_REGISTER' 
  | 'OFFICIAL_UNIVERSITY_PORTAL' 
  | 'VERIFIED_NATIONAL_REGISTER' 
  | 'VERIFIED_RAD_ON_OFFICIAL' 
  | 'PENDING_AUDIT';

export interface SalaryData {
  entryPln?: number;
  midPln?: number;
  seniorPln?: number;
  entryEur: number;
  midEur: number;
  seniorEur: number;
  source: string;
  lastUpdated: string;
}

export interface EducationRoute {
  type: 'University Degree' | 'Self-Study & Portfolio' | 'Coding Bootcamp' | 'Vocational / Apprenticeship' | 'Industry Certifications';
  duration: string;
  estimatedCostEur: string;
  pros: string[];
  cons: string[];
  suitabilityScore: number; // 0 - 100
  description: string;
}

export interface CareerItem {
  id: string;
  title: string;
  category: 'Software & Systems' | 'Gaming & Graphics' | 'Data & AI' | 'Cybersecurity' | 'Product & Strategy' | 'Engineering & Healthcare';
  description: string;
  summaryQuote: string;
  requiredSkills: { skillId: string; name: string; importance: 'Critical' | 'High' | 'Medium' }[];
  helpfulSkills: string[];
  educationRequirements: string;
  alternativeRoutes: EducationRoute[];
  typicalEntryRoutes: string[];
  salaryData: SalaryData;
  demandLevel: DemandLevel;
  competitionLevel: 'High' | 'Moderate' | 'Low';
  relevantCountries: string[];
  relatedCareerIds: string[];
  careerProgression: { level: string; typicalYears: string; role: string; salaryRangeEur?: string; salaryRangePln?: string }[];
  verifiedSource: string;
}

export interface SkillItem {
  id: string;
  name: string;
  category: 'Core Programming' | 'Game Tech' | 'Systems & Security' | 'Data & AI' | 'Math & Foundations' | 'Product & Process';
  description: string;
  relatedCareers: string[];
  learningResources: { title: string; type: 'Free Course' | 'Documentation' | 'Book' | 'Interactive'; url: string }[];
  transferableTo: string[];
}

export interface Institution {
  id: string;
  name: string;
  nativeName?: string;
  polishName?: string;
  city: string;
  country: string;
  countryCode: string;
  type: string;
  openDatasetRegisterId: string;
  radonInstitutionId?: string;
  website: string;
  livingCostEstimateEurMonthly: number;
  livingCostEstimatePlnMonthly?: number;
  internationalStudentsCount: number;
  description: string;
}

export interface ProgramItem {
  id: string;
  name: string;
  nativeName?: string;
  polishName?: string;
  institutionId: string;
  institutionName: string;
  institutionCity: string;
  country: string;
  countryCode: string;
  institutionType: string;
  degreeLevel: DegreeLevel;
  field: string;
  language: StudyLanguage;
  durationSemesters: number;
  durationYears: number;
  ectsCredits: number;
  studyMode: 'Full-time' | 'Part-time';
  
  // Tuition & Fees
  euTuitionEurAnnual: number;
  nonEuTuitionEurAnnual: number;
  tuitionPlnAnnual?: number;
  applicationFeeEur?: number;
  applicationFeePln?: number;
  
  // Intakes & Dates
  intakeSeason: string;
  applicationDeadline: string;
  intakeStarts: string;
  
  // Requirements
  academicMinPercentage: number;
  mathRequired: boolean;
  englishRequirement: string; // e.g. "IELTS 6.0 / TOEFL iBT 75 / Duolingo 100"
  requiredDocuments: string[];
  
  // Curriculum & Skills
  curriculumSummary: string;
  skillsTaught: string[];
  careerRelevanceScore: Record<string, number>; // careerId -> score 0-100
  scholarshipsAvailable: string[];
  
  // Provenance / EU Open Data
  openDatasetRegisterId: string;
  radonCode?: string;
  sourceUrl: string;
  sourceLicense: string;
  lastVerified: string;
  verificationStatus: VerificationStatus;
}

export interface UserProfileState {
  id?: string;
  name?: string;
  educationLevel: 'High School / Grade XII' | 'Undergraduate / Bachelor' | 'Graduate / Master' | 'Self-Taught';
  highSchoolPercentage: number;
  englishProficiency: string; // e.g. "IELTS 6.5"
  annualBudgetEur: number;
  preferredCity: string;
  targetCareerId: string | null;
  currentSkills?: string[];
  skillsOwned?: string[];
  interests?: string[];
  passportOrigin: 'Non-EU' | 'EU / EEA';
  savedPrograms?: string[];
}

export interface MatchBreakdown {
  programId: string;
  totalScore: number;
  careerRelevanceScore: number; // Max 30
  skillCoverageScore: number; // Max 20
  budgetScore: number; // Max 15
  languageScore: number; // Max 10
  locationScore: number; // Max 10
  eligibilityScore: number; // Max 10
  preferencesScore: number; // Max 5
  reasons: string[];
  warnings: string[];
}

export interface EligibilityResult {
  programId: string;
  status: 'Likely Match' | 'Potential Match' | 'Requirement Missing' | 'Requires Verification';
  academicMet: boolean;
  englishMet: boolean;
  budgetMet: boolean;
  documentsChecklist: { item: string; status: 'Required' | 'Recommended' | 'Mandatory Apostille'; note: string }[];
  summaryNote: string;
}

export interface AnonymizedCaseRecord {
  id: string;
  voivodeship: string; // Region / City / Voivodeship
  authority: string; // Immigration office
  permitType: string;
  submissionYear: number;
  processingMonths: number;
  outcome: 'Positive (Granted)' | 'Additional Documents Requested & Granted' | 'Appealed & Won' | 'Pending';
  additionalDocumentsNeeded: string[];
  notes: string;
}
