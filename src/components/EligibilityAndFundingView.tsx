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
        <div className="inline-flex items-center gap-2 rounded-lg border-2 border-black bg-[#A7F3D0] px-3 py-1 text-xs font-mono font-black text-black shadow-[2px_2px_0px_0px_#000]">
          <Calculator className="h-4 w-4 stroke-[2.5]" />
          <span>TRANSPARENCY & REALITY ENGINE</span>
        </div>
        <h1 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-black font-display">
          Eligibility Audit & Annual Funding Calculator
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-zinc-700 font-medium">
          Audit statutory admission baselines and calculate exact living + tuition costs across European study destinations without hidden surprises.
        </p>
      </div>

      {/* Program Selector Banner */}
      <div className="mb-6 rounded-2xl border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_#000]">
        <label className="block text-xs font-black uppercase text-zinc-700 font-mono mb-2">
          Select Degree Program to Evaluate:
        </label>
        <select
          value={selectedProgramId}
          onChange={(e) => setSelectedProgramId(e.target.value)}
          className="w-full rounded-xl border-2 border-black bg-[#FAF7F0] py-2.5 px-3 text-xs sm:text-sm font-black text-black shadow-[2px_2px_0px_0px_#000] focus:bg-[#FEF9C3] focus:outline-none"
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
        <div className="rounded-2xl border-2 border-black bg-white p-5 space-y-5 lg:col-span-6 shadow-[5px_5px_0px_0px_#000]">
          <div className="flex items-center justify-between border-b-2 border-black pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-black stroke-[2.5]" />
              <h2 className="text-base font-black text-black font-display">Admission Eligibility Audit</h2>
            </div>
            <span
              className={`rounded-xl border-2 border-black px-3 py-1 text-xs font-mono font-black shadow-[1.5px_1.5px_0px_0px_#000] ${
                eligibility.status === 'Likely Match'
                  ? 'bg-[#A7F3D0] text-black'
                  : eligibility.status === 'Potential Match'
                  ? 'bg-[#FEF08A] text-black'
                  : 'bg-[#FECDD3] text-black'
              }`}
            >
              {eligibility.status}
            </span>
          </div>

          {/* Core Criteria Checkboxes */}
          <div className="space-y-3 text-xs font-sans">
            <div className="flex items-center justify-between rounded-xl bg-[#FAF7F0] p-3.5 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
              <div className="flex items-center gap-2.5">
                {eligibility.academicMet ? (
                  <CheckCircle2 className="h-4 w-4 text-black stroke-[2.5]" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-amber-900 stroke-[2.5]" />
                )}
                <div>
                  <div className="font-black text-black font-display">Academic Minimum Baseline</div>
                  <div className="text-[11px] text-zinc-700 font-medium">
                    Your Score: {profile.highSchoolPercentage}% vs Program Minimum: {selectedProgram.academicMinPercentage}%
                  </div>
                </div>
              </div>
              <span className={`font-mono font-black text-xs px-2 py-0.5 rounded border border-black ${eligibility.academicMet ? 'bg-[#A7F3D0] text-black' : 'bg-[#FEF08A] text-black'}`}>
                {eligibility.academicMet ? 'Satisfied' : 'Borderline'}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-[#FAF7F0] p-3.5 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
              <div className="flex items-center gap-2.5">
                {eligibility.englishMet ? (
                  <CheckCircle2 className="h-4 w-4 text-black stroke-[2.5]" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-amber-900 stroke-[2.5]" />
                )}
                <div>
                  <div className="font-black text-black font-display">English Language Competence</div>
                  <div className="text-[11px] text-zinc-700 font-medium">
                    Required: {selectedProgram.englishRequirement}
                  </div>
                </div>
              </div>
              <span className={`font-mono font-black text-xs px-2 py-0.5 rounded border border-black ${eligibility.englishMet ? 'bg-[#A7F3D0] text-black' : 'bg-[#FEF08A] text-black'}`}>
                {eligibility.englishMet ? 'Eligible' : 'Needs Test'}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-[#FAF7F0] p-3.5 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
              <div className="flex items-center gap-2.5">
                {eligibility.budgetMet ? (
                  <CheckCircle2 className="h-4 w-4 text-black stroke-[2.5]" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-amber-900 stroke-[2.5]" />
                )}
                <div>
                  <div className="font-black text-black font-display">Tuition Affordability</div>
                  <div className="text-[11px] text-zinc-700 font-medium">
                    Tuition €{tuitionEur.toLocaleString()} vs Budget €{profile.annualBudgetEur.toLocaleString()}
                  </div>
                </div>
              </div>
              <span className={`font-mono font-black text-xs px-2 py-0.5 rounded border border-black ${eligibility.budgetMet ? 'bg-[#A7F3D0] text-black' : 'bg-[#FECDD3] text-black'}`}>
                {eligibility.budgetMet ? 'Within Range' : 'Exceeds'}
              </span>
            </div>
          </div>

          {/* Summary Note */}
          <div className="rounded-xl border-2 border-black bg-[#FEF08A]/40 p-4 text-xs text-zinc-900 leading-relaxed shadow-[2px_2px_0px_0px_#000]">
            <span className="font-black text-black block mb-1 font-mono uppercase">Advisory Evaluation:</span>
            <p className="font-medium text-zinc-800">{eligibility.summaryNote}</p>
          </div>

          {/* Statutory Polish Document Checklist */}
          <div>
            <h4 className="font-black text-xs uppercase tracking-wider text-black mb-2.5 flex items-center gap-1.5 font-mono">
              <FileText className="h-4 w-4 stroke-[2.5]" />
              <span>Mandatory Polish Verification Checklist</span>
            </h4>
            <div className="space-y-2">
              {eligibility.documentsChecklist.map((doc, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border-2 border-black bg-[#FAF7F0] p-3 text-xs space-y-1 shadow-[2px_2px_0px_0px_#000]"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-black">{doc.item}</span>
                    <span
                      className={`text-[9px] font-mono font-black rounded border border-black px-1.5 py-0.5 shadow-[1px_1px_0px_0px_#000] ${
                        doc.status === 'Mandatory Apostille'
                          ? 'bg-[#FECDD3] text-black'
                          : 'bg-[#BAE6FD] text-black'
                      }`}
                    >
                      {doc.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-700 font-medium">{doc.note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Important Trust Rule Notice */}
          <div className="rounded-xl border-2 border-black bg-[#FEF08A] p-3 text-[11px] text-black flex items-start gap-2 shadow-[2px_2px_0px_0px_#000]">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-black stroke-[2.5]" />
            <span className="font-medium">
              <strong>Integrity Mandate:</strong> Meetr provides objective baseline evaluations grounded in official open registers. We never claim or promise guaranteed admission; final decisions are governed solely by university admissions boards.
            </span>
          </div>
        </div>

        {/* Right Column: Funding Calculator (6 cols) */}
        <div className="rounded-2xl border-2 border-black bg-white p-5 space-y-5 lg:col-span-6 shadow-[5px_5px_0px_0px_#000]">
          <div className="flex items-center justify-between border-b-2 border-black pb-3">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-black stroke-[2.5]" />
              <h2 className="text-base font-black text-black font-display">Annual Student Funding Calculator</h2>
            </div>
            <span className="text-xs font-mono font-bold text-black bg-[#FFE600] px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_0px_#000]">
              {selectedProgram.institutionCity} ({selectedProgram.country})
            </span>
          </div>

          {/* Expense Breakdown */}
          <div className="rounded-xl border-2 border-black bg-[#FAF7F0] p-4 space-y-3 text-xs shadow-[3px_3px_0px_0px_#000]">
            <div className="flex items-center justify-between">
              <h4 className="font-black text-black text-xs uppercase tracking-wider font-mono">
                Estimated 1st-Year Financial Outflow:
              </h4>
              <div className="flex items-center gap-1 rounded-lg border-2 border-black bg-white p-0.5 shadow-[1.5px_1.5px_0px_0px_#000] text-[10px]">
                <button
                  type="button"
                  onClick={() => setMonthsOfStay(10)}
                  className={`px-2.5 py-1 rounded font-black transition-all ${monthsOfStay === 10 ? 'bg-[#FFE600] text-black border border-black' : 'text-zinc-600'}`}
                >
                  10 Mos (Academic)
                </button>
                <button
                  type="button"
                  onClick={() => setMonthsOfStay(12)}
                  className={`px-2.5 py-1 rounded font-black transition-all ${monthsOfStay === 12 ? 'bg-[#FFE600] text-black border border-black' : 'text-zinc-600'}`}
                >
                  12 Mos (Calendar)
                </button>
              </div>
            </div>

            <div className="space-y-2 font-mono">
              <div className="flex justify-between items-center text-zinc-800">
                <span className="font-bold">Annual University Tuition:</span>
                <span className="font-black text-black text-sm">€{tuitionEur.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center text-zinc-800">
                <span className="font-bold">
                  Estimated Living Costs ({monthsOfStay} mos @ ~€{totalMonthlyLivingEur}/mo):
                </span>
                <span className="font-black text-black text-sm">€{annualLivingEur.toLocaleString()}</span>
              </div>

              {/* Monthly breakdown mini-pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 py-1 text-[10px] text-zinc-700 border-t-2 border-black font-bold">
                <div>Rent/Dorm: ~€{monthlyRentEur}</div>
                <div>Food: ~€{monthlyFoodEur}</div>
                <div>Transport: ~€{monthlyTransportEur}</div>
                <div>Health: ~€{monthlyInsuranceEur}</div>
              </div>

              <div className="flex justify-between items-center pt-2.5 border-t-2 border-black text-sm font-black text-black">
                <span>Total 1st Year Estimated Requirement:</span>
                <span className="text-base bg-[#A7F3D0] px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_0px_#000]">€{totalAnnualCostEur.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Financial Resources Inputs */}
          <div className="space-y-3.5 text-xs font-sans">
            <h4 className="font-black text-black text-xs uppercase tracking-wider font-mono">
              Your Available Funding Resources:
            </h4>

            <div>
              <div className="flex justify-between mb-1.5 font-bold">
                <span className="text-zinc-800">Personal / Family Annual Budget (EUR):</span>
                <span className="font-mono font-black text-black bg-[#BAE6FD] px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_0px_#000]">€{familySavingsEur.toLocaleString()}</span>
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
                className="w-full accent-black cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1.5 font-bold">
                <span className="text-zinc-800">Expected Scholarship / External Grant (EUR):</span>
                <span className="font-mono font-black text-black bg-[#A7F3D0] px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_0px_#000]">€{scholarshipEur.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="0"
                max="4000"
                step="200"
                value={scholarshipEur}
                onChange={(e) => setScholarshipEur(parseInt(e.target.value, 10))}
                className="w-full accent-black cursor-pointer"
              />
            </div>
          </div>

          {/* Funding Outcome Card (Gap vs Surplus) */}
          <div
            className={`rounded-2xl border-2 border-black p-4 text-xs shadow-[4px_4px_0px_0px_#000] ${
              hasFundingGap
                ? 'bg-[#FECDD3] text-black'
                : 'bg-[#A7F3D0] text-black'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-black text-sm uppercase font-display">
                {hasFundingGap ? 'Identified Funding Gap:' : 'Financial Surplus / Buffer:'}
              </span>
              <span className="text-xl font-black font-mono">
                {hasFundingGap
                  ? `-€${Math.abs(fundingDifferenceEur).toLocaleString()}`
                  : `+€${fundingDifferenceEur.toLocaleString()}`}
              </span>
            </div>

            <p className="mt-2 text-[11px] leading-relaxed font-medium">
              {hasFundingGap
                ? `You have an estimated annual shortfall of €${Math.abs(fundingDifferenceEur).toLocaleString()}. To bridge this, full-time students in the EU frequently utilize legal part-time student work rights under EU Directive 2016/801 or apply for institutional scholarships.`
                : `Your planned funding (€${totalAvailableFundsEur.toLocaleString()}) fully covers estimated tuition and living requirements for ${selectedProgram.institutionCity}, ${selectedProgram.country}.`}
            </p>
          </div>

          {/* Student Work Rights in EU */}
          <div className="rounded-xl border-2 border-black bg-[#FAF7F0] p-4 space-y-2 text-xs shadow-[3px_3px_0px_0px_#000]">
            <h4 className="font-black text-black flex items-center gap-1.5 font-display text-sm">
              <Briefcase className="h-4 w-4 stroke-[2.5]" />
              <span>Official Student Work Rights in EU (Directive 2016/801)</span>
            </h4>
            <div className="space-y-1.5 text-zinc-800 text-[11px] font-medium">
              <div className="flex items-start gap-2">
                <span className="font-black text-black">•</span>
                <span>
                  <strong>Legal Status:</strong> Full-time university students on European national student visas or residence permits are legally entitled to work at least 15-20 hours/week during term-time and full-time during breaks without separate employer sponsorship.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-black text-black">•</span>
                <span>
                  <strong>Post-Study Search:</strong> EU member states grant 9 to 18 months post-graduation residence authorization (Job Search Visa) to secure graduate-level technical employment.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-black text-black">•</span>
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
