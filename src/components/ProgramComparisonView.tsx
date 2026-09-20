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
          <div className="inline-flex items-center gap-2 rounded-lg border-2 border-black bg-[#DDD6FE] px-3 py-1 text-xs font-mono font-black text-black shadow-[2px_2px_0px_0px_#000]">
            <Scale className="h-4 w-4 stroke-[2.5]" />
            <span>DEGREE COMPARISON ENGINE</span>
          </div>
          <h1 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-black font-display">
            Side-by-Side Degree Comparison
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-zinc-700 font-medium">
            Compare tuition, living expenses, academic requirements, ECTS credits, and weighted fit scores across European universities.
          </p>
        </div>

        {comparedPrograms.length > 0 && (
          <button
            onClick={onClearCompare}
            className="flex items-center gap-1.5 rounded-xl border-2 border-black bg-white hover:bg-[#FECDD3] px-4 py-2.5 text-xs font-black text-black shadow-[3px_3px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
          >
            <Trash2 className="h-4 w-4 stroke-[2.5]" />
            <span>Clear Comparison</span>
          </button>
        )}
      </div>

      {comparedPrograms.length === 0 ? (
        /* Empty State */
        <div className="rounded-2xl border-2 border-black bg-white p-12 text-center shadow-[6px_6px_0px_0px_#000]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-black bg-[#FFE600] text-black mb-4 shadow-[3px_3px_0px_0px_#000]">
            <Scale className="h-8 w-8 stroke-[2.5]" />
          </div>
          <h3 className="text-xl font-black text-black font-display">No Programs Selected for Comparison</h3>
          <p className="mt-2 text-xs sm:text-sm text-zinc-700 max-w-md mx-auto font-medium">
            Select up to 3 verified degrees from the EU Degree Programs catalogue to evaluate tuition, curriculum, and city living expenses side-by-side.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={onNavigateToPrograms}
              className="flex items-center gap-2 rounded-xl border-2 border-black bg-[#FFE600] px-5 py-2.5 text-xs font-black text-black shadow-[3px_3px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
            >
              <Plus className="h-4 w-4 stroke-[3]" />
              <span>Browse EU Degree Programs</span>
            </button>
          </div>
        </div>
      ) : (
        /* Comparison Table Matrix */
        <div className="space-y-6">
          {/* Quick Slot Adders if fewer than 3 */}
          {comparedPrograms.length < 3 && (
            <div className="rounded-xl border-2 border-black bg-[#FAF7F0] p-3.5 flex items-center justify-between text-xs text-black shadow-[2px_2px_0px_0px_#000]">
              <span className="text-[11px] font-bold text-zinc-700">
                You can compare up to 3 programs ({comparedPrograms.length}/3 currently selected).
              </span>
              <button
                onClick={onNavigateToPrograms}
                className="font-black text-black underline hover:bg-[#FFE600] px-2 py-0.5 rounded border border-black text-xs"
              >
                + Add another program from catalogue
              </button>
            </div>
          )}

          {/* Matrix Container */}
          <div className="overflow-x-auto rounded-2xl border-2 border-black bg-white shadow-[6px_6px_0px_0px_#000]">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-black bg-[#FAF7F0]">
                  <th className="p-4 w-52 text-zinc-700 font-mono font-black text-xs uppercase tracking-wider border-r-2 border-black">
                    Degree Metric
                  </th>
                  {comparedPrograms.map((prog) => {
                    const breakdown = calculateProgramMatch(prog, profile);
                    return (
                      <th key={prog.id} className="p-4 min-w-[280px] align-top border-r-2 border-black last:border-r-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="rounded-md border-2 border-black bg-[#BAE6FD] px-2 py-0.5 text-[10px] font-mono font-black text-black shadow-[1px_1px_0px_0px_#000]">
                                {prog.degreeLevel}
                              </span>
                              <span className="rounded-md border-2 border-black bg-[#FEF08A] px-2 py-0.5 text-[10px] font-mono font-black text-black shadow-[1px_1px_0px_0px_#000]">
                                {prog.country}
                              </span>
                            </div>
                            <h4 className="mt-2 font-black text-black text-sm leading-snug font-display">
                              {prog.name}
                            </h4>
                            <div className="text-[11px] text-zinc-700 font-bold mt-0.5">
                              {prog.institutionName} ({prog.institutionCity})
                            </div>
                          </div>

                          <button
                            onClick={() => onToggleCompareProgram(prog.id)}
                            className="rounded-xl border-2 border-black bg-white p-1.5 text-black shadow-[2px_2px_0px_0px_#000] hover:bg-[#FECDD3] transition-all"
                            title="Remove from comparison"
                          >
                            <Trash2 className="h-4 w-4 stroke-[2.5]" />
                          </button>
                        </div>

                        {/* Match score pill */}
                        <div className="mt-3 flex items-center gap-2 font-mono">
                          <span className="rounded-lg border-2 border-black bg-[#A7F3D0] px-2.5 py-1 text-xs font-black text-black shadow-[1.5px_1.5px_0px_0px_#000]">
                            {breakdown.totalScore}% Fit Score
                          </span>
                          <span className="text-[10px] text-zinc-700 font-bold font-sans">Weighted Match</span>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody className="divide-y-2 divide-black text-black font-sans">
                {/* Annual Tuition */}
                <tr className="hover:bg-[#FEF08A]/20 transition-colors">
                  <td className="p-4 font-black font-mono text-zinc-800 bg-[#FAF7F0] border-r-2 border-black">
                    Annual Tuition
                  </td>
                  {comparedPrograms.map((prog) => (
                    <td key={prog.id} className="p-4 border-r-2 border-black last:border-r-0 font-mono">
                      <div className="font-black text-black text-base">
                        €{prog.nonEuTuitionEurAnnual.toLocaleString()} / year
                      </div>
                      <div className="text-[11px] font-bold text-zinc-700">
                        EU: €{prog.euTuitionEurAnnual.toLocaleString()}/yr {prog.tuitionPlnAnnual ? `(~${prog.tuitionPlnAnnual.toLocaleString()} PLN)` : ''}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* City Living Costs */}
                <tr className="hover:bg-[#FEF08A]/20 transition-colors">
                  <td className="p-4 font-black font-mono text-zinc-800 bg-[#FAF7F0] border-r-2 border-black">
                    Monthly Living Cost (Est.)
                  </td>
                  {comparedPrograms.map((prog) => {
                    const inst = INSTITUTIONS_DATA.find((i) => i.id === prog.institutionId);
                    const monthlyPln = inst?.livingCostEstimatePlnMonthly || 2600;
                    return (
                      <td key={prog.id} className="p-4 border-r-2 border-black last:border-r-0 font-mono">
                        <div className="font-black text-black">
                          ~{monthlyPln.toLocaleString()} PLN / month
                        </div>
                        <div className="text-[11px] text-zinc-700 font-bold font-sans">
                          ~€{Math.round(monthlyPln / 4.3)}/mo (Rent, food, transport, insurance)
                        </div>
                      </td>
                    );
                  })}
                </tr>

                {/* Total Estimated 1st Year Cost */}
                <tr className="hover:bg-[#FEF08A]/20 transition-colors">
                  <td className="p-4 font-black font-mono text-zinc-800 bg-[#FAF7F0] border-r-2 border-black">
                    Total Estimated 1st Year
                  </td>
                  {comparedPrograms.map((prog) => {
                    const inst = INSTITUTIONS_DATA.find((i) => i.id === prog.institutionId);
                    const annualLivingEur = Math.round(((inst?.livingCostEstimatePlnMonthly || 2600) * 10) / 4.3);
                    const totalEur = prog.nonEuTuitionEurAnnual + annualLivingEur;
                    return (
                      <td key={prog.id} className="p-4 border-r-2 border-black last:border-r-0">
                        <div className="font-mono font-black text-black text-base bg-[#A7F3D0] inline-block px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_0px_#000]">
                          ~€{totalEur.toLocaleString()}
                        </div>
                        <button
                          onClick={() => onNavigateToFunding(prog.id)}
                          className="mt-2 text-[11px] font-black text-black underline block hover:bg-[#FFE600]"
                        >
                          Calculate exact funding gap →
                        </button>
                      </td>
                    );
                  })}
                </tr>

                {/* Duration & ECTS */}
                <tr className="hover:bg-[#FEF08A]/20 transition-colors">
                  <td className="p-4 font-black font-mono text-zinc-800 bg-[#FAF7F0] border-r-2 border-black">
                    Duration & ECTS
                  </td>
                  {comparedPrograms.map((prog) => (
                    <td key={prog.id} className="p-4 border-r-2 border-black last:border-r-0 font-mono font-bold">
                      <div className="text-black">
                        {prog.durationYears} Years ({prog.durationSemesters} Semesters)
                      </div>
                      <div className="text-[11px] text-zinc-700">
                        {prog.ectsCredits} ECTS Credits
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Application Deadline */}
                <tr className="hover:bg-[#FEF08A]/20 transition-colors">
                  <td className="p-4 font-black font-mono text-zinc-800 bg-[#FAF7F0] border-r-2 border-black">
                    Application Deadline
                  </td>
                  {comparedPrograms.map((prog) => (
                    <td key={prog.id} className="p-4 border-r-2 border-black last:border-r-0">
                      <div className="font-bold text-black bg-[#FEF08A] inline-block px-2 py-0.5 rounded border border-black font-mono">
                        {prog.applicationDeadline}
                      </div>
                      <div className="text-[11px] text-zinc-700 font-bold mt-1">
                        App Fee: {prog.applicationFeePln} PLN
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Academic & Language Baseline */}
                <tr className="hover:bg-[#FEF08A]/20 transition-colors">
                  <td className="p-4 font-black font-mono text-zinc-800 bg-[#FAF7F0] border-r-2 border-black">
                    Admission Baseline
                  </td>
                  {comparedPrograms.map((prog) => (
                    <td key={prog.id} className="p-4 space-y-1 border-r-2 border-black last:border-r-0 font-medium">
                      <div>
                        <strong>Academic:</strong> Min {prog.academicMinPercentage}% in High School
                      </div>
                      <div className="text-[11px] text-zinc-800 font-bold">
                        <strong>English:</strong> {prog.englishRequirement}
                      </div>
                      <div className="text-[11px] text-zinc-800">
                        <strong>Math:</strong> {prog.mathRequired ? 'Mandatory' : 'Optional'}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Key Skills Taught */}
                <tr className="hover:bg-[#FEF08A]/20 transition-colors">
                  <td className="p-4 font-black font-mono text-zinc-800 bg-[#FAF7F0] border-r-2 border-black">
                    Core Skills Taught
                  </td>
                  {comparedPrograms.map((prog) => (
                    <td key={prog.id} className="p-4 border-r-2 border-black last:border-r-0">
                      <div className="flex flex-wrap gap-1.5">
                        {prog.skillsTaught.map((skill, i) => (
                          <span
                            key={i}
                            className="rounded-md border-2 border-black bg-[#FAF7F0] px-2 py-0.5 text-[10px] text-black font-mono font-bold shadow-[1px_1px_0px_0px_#000]"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Official Accreditation */}
                <tr className="hover:bg-[#FEF08A]/20 transition-colors">
                  <td className="p-4 font-black font-mono text-zinc-800 bg-[#FAF7F0] border-r-2 border-black">
                    Official Accreditation
                  </td>
                  {comparedPrograms.map((prog) => (
                    <td key={prog.id} className="p-4 border-r-2 border-black last:border-r-0">
                      <div className="flex items-center gap-1.5 text-black text-xs font-black">
                        <ShieldCheck className="h-4 w-4 stroke-[2.5]" />
                        <span>EU Verified Register</span>
                      </div>
                      <div className="text-[10px] text-zinc-700 font-mono font-bold mt-1">
                        {prog.openDatasetRegisterId}
                      </div>
                      <a
                        href={prog.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-black text-black underline hover:bg-[#FFE600] mt-1.5"
                      >
                        <span>Official Source Link</span>
                        <ExternalLink className="h-3.5 w-3.5 stroke-[2.5]" />
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
