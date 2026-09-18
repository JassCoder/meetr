import React, { useState } from 'react';
import { 
  Search, 
  ShieldCheck, 
  DollarSign, 
  ExternalLink, 
  Bookmark, 
  BookmarkCheck, 
  Scale, 
  CheckCircle2, 
  AlertTriangle,
  Info,
  X,
  FileText
} from 'lucide-react';
import { ProgramItem, UserProfileState } from '../types';
import { PROGRAMS_DATA, INSTITUTIONS_DATA } from '../data/euEducationData';
import { calculateProgramMatch } from '../utils/matchingEngine';

interface EducationProgramsViewProps {
  profile: UserProfileState;
  savedProgramIds: string[];
  onToggleSaveProgram: (programId: string) => void;
  comparedProgramIds: string[];
  onToggleCompareProgram: (programId: string) => void;
  onNavigateToCompare: () => void;
  onNavigateToFunding: (programId: string) => void;
  filterByCareerId?: string | null;
}

export const EducationProgramsView: React.FC<EducationProgramsViewProps> = ({
  profile,
  savedProgramIds,
  onToggleSaveProgram,
  comparedProgramIds,
  onToggleCompareProgram,
  onNavigateToCompare,
  onNavigateToFunding,
  filterByCareerId,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [countryFilter, setCountryFilter] = useState('All');
  const [degreeFilter, setDegreeFilter] = useState('All');
  const [maxBudget, setMaxBudget] = useState(profile.annualBudgetEur || 16000);
  const [selectedProgramModal, setSelectedProgramModal] = useState<ProgramItem | null>(null);

  const countries = ['All', 'Germany', 'Netherlands', 'Sweden', 'Finland', 'Ireland', 'France', 'Estonia', 'Poland'];
  const degrees = ['All', 'Bachelor', 'Engineering (Inżynier)'];

  const filteredPrograms = PROGRAMS_DATA.filter((prog) => {
    const matchesCountry = countryFilter === 'All' || prog.country === countryFilter;
    const matchesDegree = degreeFilter === 'All' || prog.degreeLevel === degreeFilter;
    const tuition =
      profile.passportOrigin === 'EU / EEA'
        ? prog.euTuitionEurAnnual
        : prog.nonEuTuitionEurAnnual;
    const matchesBudget = tuition <= maxBudget * 1.15;
    const matchesSearch =
      prog.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prog.institutionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prog.curriculumSummary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prog.institutionCity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prog.country.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCareer =
      !filterByCareerId ||
      (prog.careerRelevanceScore && (prog.careerRelevanceScore[filterByCareerId] || 0) >= 65);

    return matchesCountry && matchesDegree && matchesBudget && matchesSearch && matchesCareer;
  });

  // Calculate scores for sorting
  const scoredPrograms = filteredPrograms.map((prog) => {
    const breakdown = calculateProgramMatch(prog, profile);
    return {
      program: prog,
      breakdown,
    };
  });

  // Sort by total score descending
  scoredPrograms.sort((a, b) => b.breakdown.totalScore - a.breakdown.totalScore);

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
            <ShieldCheck className="h-4 w-4" />
            <span>European Tertiary Education Open Datasets (ETER / National Registers)</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Accredited Degree Programs across EU Countries
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-300">
            Accredited English-taught Bachelor & Engineering degrees with transparent statutory fees, ECTS credits, and deterministic match scores.
          </p>
        </div>

        {/* Compared programs sticky bar trigger */}
        {comparedProgramIds.length > 0 && (
          <button
            onClick={onNavigateToCompare}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-500 transition-all"
          >
            <Scale className="h-4 w-4" />
            <span>Compare ({comparedProgramIds.length}/3) Selected</span>
          </button>
        )}
      </div>

      {/* Filters Bar */}
      <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search program, country, university..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2 pl-9 pr-3 text-xs text-slate-200 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Country */}
          <div>
            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2 px-3 text-xs text-slate-200 focus:border-blue-500 focus:outline-none"
            >
              {countries.map((c) => (
                <option key={c} value={c}>
                  Country: {c}
                </option>
              ))}
            </select>
          </div>

          {/* Degree Level */}
          <div>
            <select
              value={degreeFilter}
              onChange={(e) => setDegreeFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2 px-3 text-xs text-slate-200 focus:border-blue-500 focus:outline-none"
            >
              {degrees.map((deg) => (
                <option key={deg} value={deg}>
                  Degree: {deg}
                </option>
              ))}
            </select>
          </div>

          {/* Max Budget Slider */}
          <div className="flex flex-col justify-center">
            <div className="flex justify-between text-[11px] text-slate-400 mb-1">
              <span>Max Tuition:</span>
              <span className="font-semibold text-emerald-400">€{maxBudget.toLocaleString()}/yr</span>
            </div>
            <input
              type="range"
              min="1000"
              max="28000"
              step="500"
              value={maxBudget}
              onChange={(e) => setMaxBudget(parseInt(e.target.value, 10))}
              className="accent-emerald-500"
            />
          </div>
        </div>

        {/* Filter status note */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2.5">
          <div>
            Showing <strong>{scoredPrograms.length}</strong> accredited EU programs matching your criteria
            {filterByCareerId && (
              <span className="ml-1 text-blue-400 font-medium">
                (filtered for career: {filterByCareerId})
              </span>
            )}
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-slate-500">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Open Data verified across European Tertiary Education Register (ETER)</span>
          </div>
        </div>
      </div>

      {/* Program Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
        {scoredPrograms.map(({ program, breakdown }) => {
          const isSaved = savedProgramIds.includes(program.id);
          const isCompared = comparedProgramIds.includes(program.id);
          const tuitionEur =
            profile.passportOrigin === 'EU / EEA'
              ? program.euTuitionEurAnnual
              : program.nonEuTuitionEurAnnual;

          const institution = INSTITUTIONS_DATA.find((i) => i.id === program.institutionId);

          return (
            <div
              key={program.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/70 p-5 hover:border-slate-700 transition-all shadow-md"
            >
              <div>
                {/* Top Row: Country + Institution + Match Score Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded bg-blue-500/20 px-2 py-0.5 text-[10px] font-bold text-blue-300 border border-blue-500/30">
                        {program.country} ({program.countryCode})
                      </span>
                      <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-300">
                        {program.institutionCity}
                      </span>
                      <span className="rounded bg-indigo-500/10 px-2 py-0.5 text-[10px] font-medium text-indigo-300 border border-indigo-500/20">
                        {program.degreeLevel}
                      </span>
                      <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400 border border-emerald-500/20">
                        {program.language}
                      </span>
                    </div>

                    <h3 className="mt-2 text-base sm:text-lg font-bold text-white tracking-tight leading-snug">
                      {program.name}
                    </h3>
                    <div className="text-xs text-slate-400 mt-0.5 font-medium">
                      {program.institutionName} {institution?.nativeName ? `• ${institution.nativeName}` : ''}
                    </div>
                  </div>

                  {/* Match Score Badge (Deterministic) */}
                  <div className="flex flex-col items-end shrink-0">
                    <div
                      className={`flex items-center gap-1 rounded-xl px-2.5 py-1 text-xs font-bold ${
                        breakdown.totalScore >= 85
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : breakdown.totalScore >= 70
                          ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                          : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      <span>{breakdown.totalScore}%</span>
                      <span className="text-[10px] opacity-75 font-normal">Match</span>
                    </div>
                    <span className="text-[9px] text-slate-500 mt-1">Weighted Engine</span>
                  </div>
                </div>

                {/* Key Numbers Grid */}
                <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-slate-950/70 p-3 border border-slate-800/60 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Annual Tuition</span>
                    <div className="font-bold text-white mt-0.5">
                      €{tuitionEur.toLocaleString()}
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {profile.passportOrigin === 'EU / EEA' ? 'EU/EEA rate' : 'International rate'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Credits & Duration</span>
                    <div className="font-bold text-white mt-0.5">
                      {program.durationYears} Years
                    </div>
                    <span className="text-[10px] text-slate-400">{program.ectsCredits} ECTS</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Application Deadline</span>
                    <div className="font-bold text-amber-400 mt-0.5">
                      {program.applicationDeadline}
                    </div>
                    <span className="text-[10px] text-slate-400">{program.intakeStarts}</span>
                  </div>
                </div>

                {/* Match Reasons snippet */}
                <div className="mt-3.5 space-y-1 text-[11px]">
                  {breakdown.reasons.slice(0, 2).map((reason, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-slate-300">
                      <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" />
                      <span className="truncate">{reason}</span>
                    </div>
                  ))}
                  {breakdown.warnings.length > 0 && (
                    <div className="flex items-center gap-1.5 text-amber-400">
                      <AlertTriangle className="h-3 w-3 shrink-0" />
                      <span className="truncate">{breakdown.warnings[0]}</span>
                    </div>
                  )}
                </div>

                {/* Verification ID Badge */}
                <div className="mt-3 flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-800/60 pt-2">
                  <div className="flex items-center gap-1 truncate max-w-[70%]">
                    <ShieldCheck className="h-3 w-3 text-emerald-400 shrink-0" />
                    <span className="truncate">Open Dataset ID: {program.openDatasetRegisterId}</span>
                  </div>
                  <span>Verified: {program.lastVerified}</span>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
                <button
                  onClick={() => setSelectedProgramModal(program)}
                  className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/90 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
                >
                  <Info className="h-3.5 w-3.5" />
                  <span>View Syllabus, Documents & Score Breakdown</span>
                </button>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => onToggleCompareProgram(program.id)}
                    className={`flex items-center justify-center gap-1 rounded-xl py-1.5 text-xs font-semibold transition-all ${
                      isCompared
                        ? 'bg-purple-600 text-white'
                        : 'border border-slate-800 bg-slate-950 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Scale className="h-3.5 w-3.5" />
                    <span>{isCompared ? 'Comparing' : 'Compare'}</span>
                  </button>

                  <button
                    onClick={() => onNavigateToFunding(program.id)}
                    className="flex items-center justify-center gap-1 rounded-xl border border-slate-800 bg-slate-950 py-1.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-950/30 transition-all"
                  >
                    <DollarSign className="h-3.5 w-3.5" />
                    <span>Budget & Aid</span>
                  </button>

                  <button
                    onClick={() => onToggleSaveProgram(program.id)}
                    className={`flex items-center justify-center gap-1 rounded-xl py-1.5 text-xs font-semibold transition-all ${
                      isSaved
                        ? 'bg-blue-600 text-white'
                        : 'border border-slate-800 bg-slate-950 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {isSaved ? (
                      <>
                        <BookmarkCheck className="h-3.5 w-3.5" />
                        <span>Saved</span>
                      </>
                    ) : (
                      <>
                        <Bookmark className="h-3.5 w-3.5" />
                        <span>Save</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Program Detail Modal */}
      {selectedProgramModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-blue-500/20 px-2 py-0.5 text-xs font-bold text-blue-300">
                    {selectedProgramModal.country}
                  </span>
                  <span className="rounded bg-slate-800 px-2 py-0.5 text-xs font-semibold text-slate-300">
                    {selectedProgramModal.institutionCity}
                  </span>
                  <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-400">
                    {selectedProgramModal.degreeLevel}
                  </span>
                </div>
                <h3 className="mt-2 text-xl font-bold text-white">
                  {selectedProgramModal.name}
                </h3>
                <div className="text-xs text-slate-400 font-medium">
                  {selectedProgramModal.institutionName} • {selectedProgramModal.institutionCity}, {selectedProgramModal.country}
                </div>
              </div>

              <button
                onClick={() => setSelectedProgramModal(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-5 text-xs text-slate-300 max-h-[70vh] overflow-y-auto pr-2">
              {/* Score Breakdown */}
              <div className="rounded-xl border border-blue-500/30 bg-blue-950/20 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    <Scale className="h-4 w-4 text-blue-400" />
                    <span>Deterministic Match Breakdown (100-Point Weighted Scale)</span>
                  </h4>
                  {(() => {
                    const b = calculateProgramMatch(selectedProgramModal, profile);
                    return (
                      <span className="text-sm font-bold text-blue-400">
                        Total Score: {b.totalScore}/100
                      </span>
                    );
                  })()}
                </div>

                {(() => {
                  const b = calculateProgramMatch(selectedProgramModal, profile);
                  return (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-1">
                      <div className="rounded-lg bg-slate-900 p-2">
                        <span className="text-slate-400 block">Career Relevance</span>
                        <span className="font-bold text-white">{b.careerRelevanceScore} / 30</span>
                      </div>
                      <div className="rounded-lg bg-slate-900 p-2">
                        <span className="text-slate-400 block">Skill Coverage</span>
                        <span className="font-bold text-white">{b.skillCoverageScore} / 20</span>
                      </div>
                      <div className="rounded-lg bg-slate-900 p-2">
                        <span className="text-slate-400 block">Budget Fit</span>
                        <span className="font-bold text-white">{b.budgetScore} / 15</span>
                      </div>
                      <div className="rounded-lg bg-slate-900 p-2">
                        <span className="text-slate-400 block">Eligibility & Lang</span>
                        <span className="font-bold text-white">{b.eligibilityScore + b.languageScore} / 20</span>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Curriculum Summary */}
              <div>
                <h4 className="font-bold text-white text-sm mb-1.5">Curriculum & Course Content</h4>
                <p className="text-slate-300 leading-relaxed text-xs">
                  {selectedProgramModal.curriculumSummary}
                </p>
              </div>

              {/* Skills Taught */}
              <div>
                <h4 className="font-bold text-white text-sm mb-1.5">Skills & Competences Taught</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProgramModal.skillsTaught.map((s, i) => (
                    <span
                      key={i}
                      className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-slate-200 text-xs font-mono"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* International Admission Documents Required */}
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-emerald-400" />
                  <span>Official Admission Documents for International Applicants</span>
                </h4>
                <div className="space-y-1.5 text-xs text-slate-300">
                  {selectedProgramModal.requiredDocuments.map((doc, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{doc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Academic & Language Criteria */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                  <span className="text-slate-500 uppercase font-bold text-[10px]">Academic Requirement</span>
                  <div className="font-bold text-white mt-1">
                    Minimum {selectedProgramModal.academicMinPercentage}% in High School / Secondary Diploma
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {selectedProgramModal.mathRequired ? 'Advanced Mathematics Required' : 'General subjects evaluated'}
                  </span>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                  <span className="text-slate-500 uppercase font-bold text-[10px]">English Requirement</span>
                  <div className="font-bold text-white mt-1">
                    {selectedProgramModal.englishRequirement}
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Or secondary school medium of instruction certificate
                  </span>
                </div>
              </div>

              {/* Provenance and Open Dataset Verification */}
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-3 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1 text-emerald-400 font-bold text-xs">
                    <ShieldCheck className="h-4 w-4" />
                    <span>European Open Register ID: {selectedProgramModal.openDatasetRegisterId}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Data source licensed under European Public Sector Open Data Directives (ETER)
                  </div>
                </div>
                <a
                  href={selectedProgramModal.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 underline"
                >
                  <span>Open Registry</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-slate-800 pt-4">
              <button
                onClick={() => setSelectedProgramModal(null)}
                className="rounded-xl border border-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800"
              >
                Close
              </button>

              <button
                onClick={() => {
                  onToggleSaveProgram(selectedProgramModal.id);
                }}
                className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-semibold text-white hover:bg-blue-500"
              >
                {savedProgramIds.includes(selectedProgramModal.id) ? 'Saved in My Pathway' : 'Save to My Pathway'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
