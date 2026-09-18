import React, { useState } from 'react';
import { 
  Calculator, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  DollarSign, 
  Briefcase
} from 'lucide-react';
import { UserProfileState } from '../types';
import { PROGRAMS_DATA, INSTITUTIONS_DATA } from '../data/euEducationData';
import { evaluateEligibility } from '../utils/matchingEngine';

interface EligibilityAndFundingViewProps {
  profile: UserProfileState;
  onUpdateProfile: (updates: Partial<UserProfileState>) => void;
  preselectedProgramId?: string | null;
}

export const EligibilityAndFundingView: React.FC<EligibilityAndFundingViewProps> = ({
  profile,
  onUpdateProfile,
  preselectedProgramId,
}) => {
  const [selectedProgramId, setSelectedProgramId] = useState<string>(
    preselectedProgramId || PROGRAMS_DATA[0].id
  );

  const selectedProgram =
    PROGRAMS_DATA.find((p) => p.id === selectedProgramId) || PROGRAMS_DATA[0];

  const selectedInstitution =
    INSTITUTIONS_DATA.find((i) => i.id === selectedProgram.institutionId) ||
    INSTITUTIONS_DATA[0];

  // Eligibility evaluation
  const eligibility = evaluateEligibility(selectedProgram, profile);

  // Funding inputs
  const [familySavingsEur, setFamilySavingsEur] = useState<number>(profile.annualBudgetEur || 4500);
  const [scholarshipEur, setScholarshipEur] = useState<number>(0);
  const [monthsOfStay, setMonthsOfStay] = useState<number>(10); // Standard academic year

  // Tuition
  const tuitionEur =
    profile.passportOrigin === 'EU / EEA'
      ? selectedProgram.euTuitionEurAnnual
      : selectedProgram.nonEuTuitionEurAnnual;

  // Monthly living breakdown in EUR based on city dataset
  const totalMonthlyLivingEur = selectedInstitution.livingCostEstimateEurMonthly || 850;
  const monthlyRentEur = Math.round(totalMonthlyLivingEur * 0.55);
  const monthlyFoodEur = Math.round(totalMonthlyLivingEur * 0.25);
  const monthlyTransportEur = Math.round(totalMonthlyLivingEur * 0.08);
  const monthlyInsuranceEur = Math.round(totalMonthlyLivingEur * 0.07);

  // Annual living expenses
  const annualLivingEur = totalMonthlyLivingEur * monthsOfStay;
  const totalAnnualCostEur = tuitionEur + annualLivingEur;

  // Available resources & gap calculation
  const totalAvailableFundsEur = familySavingsEur + scholarshipEur;
  const fundingDifferenceEur = totalAvailableFundsEur - totalAnnualCostEur;
  const hasFundingGap = fundingDifferenceEur < 0;

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
          <Calculator className="h-4 w-4" />
          <span>Transparency & Reality Engine</span>
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Eligibility Audit & Annual Funding Calculator
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-300">
          Audit statutory admission baselines and calculate exact living + tuition costs across European study destinations without hidden surprises.
        </p>
      </div>

      {/* Program Selector Banner */}
      <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
        <label className="block text-xs font-semibold text-slate-400 mb-1.5">
          Select Degree Program to Evaluate:
        </label>
        <select
          value={selectedProgramId}
          onChange={(e) => setSelectedProgramId(e.target.value)}
          className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 px-3 text-xs sm:text-sm font-semibold text-white focus:border-blue-500 focus:outline-none"
        >
          {PROGRAMS_DATA.map((prog) => (
            <option key={prog.id} value={prog.id}>
              {prog.name} — {prog.institutionName} ({prog.institutionCity}, {prog.country}) • €{prog.nonEuTuitionEurAnnual}/yr
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Eligibility Audit (6 cols) */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-5 lg:col-span-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-blue-400" />
              <h2 className="text-base font-bold text-white">Admission Eligibility Audit</h2>
            </div>
            <span
              className={`rounded-xl px-2.5 py-1 text-xs font-bold ${
                eligibility.status === 'Likely Match'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : eligibility.status === 'Potential Match'
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
              }`}
            >
              {eligibility.status}
            </span>
          </div>

          {/* Core Criteria Checkboxes */}
          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between rounded-xl bg-slate-950/70 p-3 border border-slate-800">
              <div className="flex items-center gap-2.5">
                {eligibility.academicMet ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                )}
                <div>
                  <div className="font-semibold text-white">Academic Minimum Baseline</div>
                  <div className="text-[11px] text-slate-400">
                    Your Score: {profile.highSchoolPercentage}% vs Program Minimum: {selectedProgram.academicMinPercentage}%
                  </div>
                </div>
              </div>
              <span className={`font-bold ${eligibility.academicMet ? 'text-emerald-400' : 'text-amber-400'}`}>
                {eligibility.academicMet ? 'Satisfied' : 'Borderline'}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-slate-950/70 p-3 border border-slate-800">
              <div className="flex items-center gap-2.5">
                {eligibility.englishMet ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                )}
                <div>
                  <div className="font-semibold text-white">English Language Competence</div>
                  <div className="text-[11px] text-slate-400">
                    Required: {selectedProgram.englishRequirement}
                  </div>
                </div>
              </div>
              <span className={`font-bold ${eligibility.englishMet ? 'text-emerald-400' : 'text-amber-400'}`}>
                {eligibility.englishMet ? 'Eligible' : 'Needs Test'}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-slate-950/70 p-3 border border-slate-800">
              <div className="flex items-center gap-2.5">
                {eligibility.budgetMet ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                )}
                <div>
                  <div className="font-semibold text-white">Tuition Affordability</div>
                  <div className="text-[11px] text-slate-400">
                    Tuition €{tuitionEur.toLocaleString()} vs Budget €{profile.annualBudgetEur.toLocaleString()}
                  </div>
                </div>
              </div>
              <span className={`font-bold ${eligibility.budgetMet ? 'text-emerald-400' : 'text-amber-400'}`}>
                {eligibility.budgetMet ? 'Within Range' : 'Exceeds'}
              </span>
            </div>
          </div>

          {/* Summary Note */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/90 p-3.5 text-xs text-slate-300 leading-relaxed">
            <span className="font-semibold text-white block mb-1">Advisory Evaluation:</span>
            {eligibility.summaryNote}
          </div>

          {/* Statutory Polish Document Checklist */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-blue-400" />
              <span>Mandatory Polish Verification Checklist</span>
            </h4>
            <div className="space-y-2">
              {eligibility.documentsChecklist.map((doc, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">{doc.item}</span>
                    <span
                      className={`text-[9px] font-bold rounded px-1.5 py-0.5 ${
                        doc.status === 'Mandatory Apostille'
                          ? 'bg-red-500/15 text-red-400 border border-red-500/20'
                          : 'bg-blue-500/15 text-blue-300 border border-blue-500/20'
                      }`}
                    >
                      {doc.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">{doc.note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Important Trust Rule Notice */}
          <div className="rounded-xl border border-amber-500/20 bg-amber-950/20 p-3 text-[11px] text-amber-300 flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-amber-400" />
            <span>
              <strong>Integrity Mandate:</strong> Meetr provides objective baseline evaluations grounded in official open registers. We never claim or promise guaranteed admission; final decisions are governed solely by university admissions boards.
            </span>
          </div>
        </div>

        {/* Right Column: Funding Calculator (6 cols) */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-5 lg:col-span-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-emerald-400" />
              <h2 className="text-base font-bold text-white">Annual Student Funding Calculator</h2>
            </div>
            <span className="text-xs text-slate-400">
              City: <strong>{selectedProgram.institutionCity}</strong> ({selectedProgram.country})
            </span>
          </div>

          {/* Expense Breakdown */}
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider text-slate-400">
                Estimated 1st-Year Financial Outflow:
              </h4>
              <div className="flex items-center gap-1 rounded-lg bg-slate-900 p-0.5 border border-slate-800 text-[10px]">
                <button
                  type="button"
                  onClick={() => setMonthsOfStay(10)}
                  className={`px-2 py-0.5 rounded ${monthsOfStay === 10 ? 'bg-blue-600 text-white font-bold' : 'text-slate-400'}`}
                >
                  10 Mos (Academic)
                </button>
                <button
                  type="button"
                  onClick={() => setMonthsOfStay(12)}
                  className={`px-2 py-0.5 rounded ${monthsOfStay === 12 ? 'bg-blue-600 text-white font-bold' : 'text-slate-400'}`}
                >
                  12 Mos (Calendar)
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-slate-300">
                <span>Annual University Tuition:</span>
                <span className="font-bold text-white">€{tuitionEur.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center text-slate-300">
                <span>
                  Estimated Living Costs ({monthsOfStay} mos @ ~€{totalMonthlyLivingEur}/mo):
                </span>
                <span className="font-bold text-white">€{annualLivingEur.toLocaleString()}</span>
              </div>

              {/* Monthly breakdown mini-pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 py-1 text-[10px] text-slate-400 border-t border-slate-800">
                <div>Rent/Dorm: ~€{monthlyRentEur}</div>
                <div>Food: ~€{monthlyFoodEur}</div>
                <div>Transport: ~€{monthlyTransportEur}</div>
                <div>Health Cover: ~€{monthlyInsuranceEur}</div>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-slate-800 text-sm font-bold text-white">
                <span>Total 1st Year Estimated Requirement:</span>
                <span className="text-emerald-400">€{totalAnnualCostEur.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Financial Resources Inputs */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider text-slate-400">
              Your Available Funding Resources:
            </h4>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300">Personal / Family Annual Budget (EUR):</span>
                <span className="font-bold text-blue-400">€{familySavingsEur.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="2000"
                max="14000"
                step="250"
                value={familySavingsEur}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setFamilySavingsEur(val);
                  onUpdateProfile({ annualBudgetEur: val });
                }}
                className="w-full accent-blue-500"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300">Expected Scholarship / External Grant (EUR):</span>
                <span className="font-bold text-emerald-400">€{scholarshipEur.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="0"
                max="4000"
                step="200"
                value={scholarshipEur}
                onChange={(e) => setScholarshipEur(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-500"
              />
            </div>
          </div>

          {/* Funding Outcome Card (Gap vs Surplus) */}
          <div
            className={`rounded-2xl border p-4 text-xs ${
              hasFundingGap
                ? 'border-rose-500/30 bg-rose-950/20 text-rose-200'
                : 'border-emerald-500/30 bg-emerald-950/20 text-emerald-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm">
                {hasFundingGap ? 'Identified Funding Gap:' : 'Financial Surplus / Buffer:'}
              </span>
              <span className="text-lg font-extrabold font-mono">
                {hasFundingGap
                  ? `-€${Math.abs(fundingDifferenceEur).toLocaleString()}`
                  : `+€${fundingDifferenceEur.toLocaleString()}`}
              </span>
            </div>

            <p className="mt-2 text-[11px] leading-relaxed opacity-90">
              {hasFundingGap
                ? `You have an estimated annual shortfall of €${Math.abs(fundingDifferenceEur).toLocaleString()}. To bridge this, full-time students in the EU frequently utilize legal part-time student work rights under EU Directive 2016/801 or apply for institutional scholarships.`
                : `Your planned funding (€${totalAvailableFundsEur.toLocaleString()}) fully covers estimated tuition and living requirements for ${selectedProgram.institutionCity}, ${selectedProgram.country}.`}
            </p>
          </div>

          {/* Student Work Rights in EU */}
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2 text-xs">
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <Briefcase className="h-4 w-4 text-blue-400" />
              <span>Official Student Work Rights in EU (Directive 2016/801)</span>
            </h4>
            <div className="space-y-1.5 text-slate-300 text-[11px]">
              <div className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>
                  <strong>Legal Status:</strong> Full-time university students on European national student visas or residence permits are legally entitled to work at least 15-20 hours/week during term-time and full-time during breaks without separate employer sponsorship.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>
                  <strong>Post-Study Search:</strong> EU member states grant 9 to 18 months post-graduation residence authorization (Job Search Visa) to secure graduate-level technical employment.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>
                  <strong>EU Blue Card:</strong> Graduating with an accredited Bachelor's degree satisfies the education requirement for fast-track permanent residency under the Revised EU Blue Card Directive.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
