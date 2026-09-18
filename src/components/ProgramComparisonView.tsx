import React from 'react';
import { 
  Scale, 
  Trash2, 
  Plus, 
  ShieldCheck, 
  ExternalLink
} from 'lucide-react';
import { UserProfileState } from '../types';
import { PROGRAMS_DATA, INSTITUTIONS_DATA } from '../data/euEducationData';
import { calculateProgramMatch } from '../utils/matchingEngine';

interface ProgramComparisonViewProps {
  profile: UserProfileState;
  comparedProgramIds: string[];
  onToggleCompareProgram: (programId: string) => void;
  onClearCompare: () => void;
  onNavigateToPrograms: () => void;
  onNavigateToFunding: (programId: string) => void;
}

export const ProgramComparisonView: React.FC<ProgramComparisonViewProps> = ({
  profile,
  comparedProgramIds,
  onToggleCompareProgram,
  onClearCompare,
  onNavigateToPrograms,
  onNavigateToFunding,
}) => {
  const comparedPrograms = PROGRAMS_DATA.filter((p) =>
    comparedProgramIds.includes(p.id)
  );

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-400">
            <Scale className="h-4 w-4" />
            <span>European Degree Comparison Engine</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Side-by-Side Degree Comparison
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-300">
            Compare tuition, living expenses, academic requirements, ECTS credits, and weighted fit scores across European universities.
          </p>
        </div>

        {comparedPrograms.length > 0 && (
          <button
            onClick={onClearCompare}
            className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            <span>Clear Comparison</span>
          </button>
        )}
      </div>

      {comparedPrograms.length === 0 ? (
        /* Empty State */
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 text-slate-400 mb-4">
            <Scale className="h-7 w-7" />
          </div>
          <h3 className="text-lg font-bold text-white">No Programs Selected for Comparison</h3>
          <p className="mt-1.5 text-xs text-slate-400 max-w-md mx-auto">
            Select up to 3 verified degrees from the EU Degree Programs catalogue to evaluate tuition, curriculum, and city living expenses side-by-side.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={onNavigateToPrograms}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-blue-500 shadow-md shadow-blue-500/20"
            >
              <Plus className="h-4 w-4" />
              <span>Browse EU Degree Programs</span>
            </button>
          </div>
        </div>
      ) : (
        /* Comparison Table Matrix */
        <div className="space-y-6">
          {/* Quick Slot Adders if fewer than 3 */}
          {comparedPrograms.length < 3 && (
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3 flex items-center justify-between text-xs text-slate-300">
              <span className="text-[11px] text-slate-400">
                You can compare up to 3 programs ({comparedPrograms.length}/3 currently selected).
              </span>
              <button
                onClick={onNavigateToPrograms}
                className="text-blue-400 hover:underline font-semibold text-xs"
              >
                + Add another program from catalogue
              </button>
            </div>
          )}

          {/* Matrix Container */}
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/80">
                  <th className="p-4 w-52 text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
                    Degree Metric
                  </th>
                  {comparedPrograms.map((prog) => {
                    const breakdown = calculateProgramMatch(prog, profile);
                    return (
                      <th key={prog.id} className="p-4 min-w-[280px] align-top">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="rounded bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-300 border border-blue-500/20">
                              {prog.degreeLevel}
                            </span>
                            <h4 className="mt-1.5 font-bold text-white text-sm leading-snug">
                              {prog.name}
                            </h4>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              {prog.institutionName} ({prog.institutionCity})
                            </div>
                          </div>

                          <button
                            onClick={() => onToggleCompareProgram(prog.id)}
                            className="rounded-lg p-1 text-slate-500 hover:bg-slate-800 hover:text-rose-400"
                            title="Remove from comparison"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Match score pill */}
                        <div className="mt-3 flex items-center gap-2">
                          <span className="rounded-lg bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 text-xs font-bold text-emerald-400">
                            {breakdown.totalScore}% Fit Score
                          </span>
                          <span className="text-[10px] text-slate-400">Weighted Match</span>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {/* Annual Tuition */}
                <tr>
                  <td className="p-4 font-semibold text-slate-400 bg-slate-950/40">
                    Annual Tuition (Non-EU / EU)
                  </td>
                  {comparedPrograms.map((prog) => (
                    <td key={prog.id} className="p-4">
                      <div className="font-bold text-white text-sm">
                        €{prog.nonEuTuitionEurAnnual.toLocaleString()} / year
                      </div>
                      <div className="text-[11px] text-slate-400">
                        EU: €{prog.euTuitionEurAnnual.toLocaleString()}/yr {prog.tuitionPlnAnnual ? `(~${prog.tuitionPlnAnnual.toLocaleString()} PLN)` : ''}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* City Living Costs (Estimated) */}
                <tr>
                  <td className="p-4 font-semibold text-slate-400 bg-slate-950/40">
                    Monthly City Living Cost (Est.)
                  </td>
                  {comparedPrograms.map((prog) => {
                    const inst = INSTITUTIONS_DATA.find((i) => i.id === prog.institutionId);
                    const monthlyPln = inst?.livingCostEstimatePlnMonthly || 2600;
                    return (
                      <td key={prog.id} className="p-4">
                        <div className="font-semibold text-white">
                          ~{monthlyPln.toLocaleString()} PLN / month
                        </div>
                        <div className="text-[11px] text-slate-400">
                          ~€{Math.round(monthlyPln / 4.3)}/mo (Rent, food, transport, insurance)
                        </div>
                      </td>
                    );
                  })}
                </tr>

                {/* Total Estimated 1st Year Cost */}
                <tr>
                  <td className="p-4 font-semibold text-slate-400 bg-slate-950/40">
                    Total Estimated 1st Year (Tuition + Living)
                  </td>
                  {comparedPrograms.map((prog) => {
                    const inst = INSTITUTIONS_DATA.find((i) => i.id === prog.institutionId);
                    const annualLivingEur = Math.round(((inst?.livingCostEstimatePlnMonthly || 2600) * 10) / 4.3);
                    const totalEur = prog.nonEuTuitionEurAnnual + annualLivingEur;
                    return (
                      <td key={prog.id} className="p-4">
                        <div className="font-bold text-emerald-400 text-sm">
                          ~€{totalEur.toLocaleString()}
                        </div>
                        <button
                          onClick={() => onNavigateToFunding(prog.id)}
                          className="mt-1 text-[11px] text-blue-400 hover:underline block"
                        >
                          Calculate exact funding gap →
                        </button>
                      </td>
                    );
                  })}
                </tr>

                {/* Duration & ECTS */}
                <tr>
                  <td className="p-4 font-semibold text-slate-400 bg-slate-950/40">
                    Degree Duration & ECTS
                  </td>
                  {comparedPrograms.map((prog) => (
                    <td key={prog.id} className="p-4">
                      <div className="font-semibold text-white">
                        {prog.durationYears} Years ({prog.durationSemesters} Semesters)
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {prog.ectsCredits} ECTS Credits
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Application Deadline */}
                <tr>
                  <td className="p-4 font-semibold text-slate-400 bg-slate-950/40">
                    Application Deadline
                  </td>
                  {comparedPrograms.map((prog) => (
                    <td key={prog.id} className="p-4">
                      <div className="font-semibold text-amber-400">
                        {prog.applicationDeadline}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        App Fee: {prog.applicationFeePln} PLN
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Academic & Language Baseline */}
                <tr>
                  <td className="p-4 font-semibold text-slate-400 bg-slate-950/40">
                    Admission Baseline
                  </td>
                  {comparedPrograms.map((prog) => (
                    <td key={prog.id} className="p-4 space-y-1">
                      <div>
                        <strong>Academic:</strong> Min {prog.academicMinPercentage}% in Matura/High School
                      </div>
                      <div className="text-[11px] text-slate-400">
                        <strong>English:</strong> {prog.englishRequirement}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        <strong>Math:</strong> {prog.mathRequired ? 'Mandatory' : 'Optional'}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Key Skills Taught */}
                <tr>
                  <td className="p-4 font-semibold text-slate-400 bg-slate-950/40">
                    Core Skills Taught
                  </td>
                  {comparedPrograms.map((prog) => (
                    <td key={prog.id} className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {prog.skillsTaught.map((skill, i) => (
                          <span
                            key={i}
                            className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300 font-mono"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* European Open Dataset Provenance ID */}
                <tr>
                  <td className="p-4 font-semibold text-slate-400 bg-slate-950/40">
                    Official Accreditation
                  </td>
                  {comparedPrograms.map((prog) => (
                    <td key={prog.id} className="p-4">
                      <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
                        <ShieldCheck className="h-4 w-4" />
                        <span>EU Verified Register</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                        {prog.openDatasetRegisterId}
                      </div>
                      <a
                        href={prog.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-blue-400 hover:underline mt-1"
                      >
                        <span>Official Source Link</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
