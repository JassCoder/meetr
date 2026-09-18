import React, { useState } from 'react';
import { 
  Plane, 
  ShieldCheck, 
  Clock, 
  Info, 
  Users,
  Building,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { POLAND_STUDENT_VISA_STEPS, ANONYMIZED_CASES } from '../data/mobilityData';
import { UserProfileState, AnonymizedCaseRecord } from '../types';

interface MobilityIntelligenceViewProps {
  profile: UserProfileState;
}

export const MobilityIntelligenceView: React.FC<MobilityIntelligenceViewProps> = () => {
  const [selectedVoivodeship, setSelectedVoivodeship] = useState<string>('All');
  const [filterOutcome, setFilterOutcome] = useState<string>('All');

  const voivodeships = [
    'All',
    'Mazowieckie (Warsaw)',
    'Małopolskie (Kraków)',
    'Dolnośląskie (Wrocław)',
    'Wielkopolskie (Poznań)',
    'Pomorskie (Gdańsk)',
  ];

  const filteredCases: AnonymizedCaseRecord[] = ANONYMIZED_CASES.filter((c) => {
    const matchesVoiv =
      selectedVoivodeship === 'All' || c.voivodeship.includes(selectedVoivodeship.split(' ')[0]);
    const matchesOutcome =
      filterOutcome === 'All' ||
      (filterOutcome === 'Positive' && c.outcome.includes('Positive')) ||
      (filterOutcome === 'Documents' && c.outcome.includes('Additional Documents'));
    return matchesVoiv && matchesOutcome;
  });

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-400">
          <Plane className="h-4 w-4" />
          <span>Mobility & Immigration Intelligence (Sections 18, 19 & 20)</span>
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Poland Student Visa & Residence Permit Intelligence
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-300">
          Statutory National D-Type visa thresholds and anonymized historical Karta Pobytu case durations across Polish Voivodeship offices.
        </p>
      </div>

      {/* Top Grid: D-Type Visa Requirements (Section 19) */}
      <div className="mb-8 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-4 gap-2">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
              <h2 className="text-lg font-bold text-white">
                Poland National D-Type Student Visa (Wiza Krajowa D-11)
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Governed by the Polish Foreigners Act (Ustawa o cudzoziemcach) & MSZ Consular Guidelines
            </p>
          </div>
          <span className="rounded bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-300 border border-sky-500/20">
            Non-EU International Students
          </span>
        </div>

        {/* 3 Pillars of Financial Calculation */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
            <span className="text-[10px] uppercase font-bold text-slate-400">
              1. Monthly Subsistence Minimum
            </span>
            <div className="text-lg font-bold text-white mt-1">
              ~800 PLN / month
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Must show balance for total months of planned stay (typically 12 months = ~9,600 - 10,500 PLN).
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
            <span className="text-[10px] uppercase font-bold text-slate-400">
              2. Return Travel Reserve Allowance
            </span>
            <div className="text-lg font-bold text-emerald-400 mt-1">
              2,500 PLN (~€580)
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Statutory reserve for non-EU ticket return costs (~500 PLN for EU neighboring countries).
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
            <span className="text-[10px] uppercase font-bold text-slate-400">
              3. Accommodation Proof
            </span>
            <div className="text-lg font-bold text-sky-400 mt-1">
              Dorm / Lease Agreement
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Official university dormitory allotment certificate or stamped residential lease agreement.
            </p>
          </div>
        </div>

        {/* Mandatory Steps Checklist */}
        <div className="mt-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Official Statutory Visa Requirements (Consular MSZ Standard):
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {POLAND_STUDENT_VISA_STEPS.map((step, idx) => (
              <div
                key={step.id}
                className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2 text-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                      {idx + 1}
                    </span>
                    <span className="text-[9px] font-bold text-blue-400 rounded bg-blue-500/10 px-2 py-0.5 border border-blue-500/20">
                      {step.category}
                    </span>
                  </div>
                  <h4 className="font-bold text-white mt-2 leading-snug">{step.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{step.requirementDetail}</p>
                </div>
                <div className="text-[10px] text-slate-500 border-t border-slate-850 pt-2 font-mono">
                  Source: {step.officialSource}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section: Anonymized Historical Case Intelligence (Section 20) */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-800 pb-4 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-400" />
              <h2 className="text-lg font-bold text-white">
                Anonymized Karta Pobytu (Temporary Residence) Intelligence
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Empirical historical timelines and common "Wezwanie do braków" from Voivodeship Immigration Offices
            </p>
          </div>

          {/* Voivodeship & Outcome Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedVoivodeship}
              onChange={(e) => setSelectedVoivodeship(e.target.value)}
              className="rounded-xl border border-slate-800 bg-slate-950 py-1.5 px-3 text-xs text-slate-200 focus:border-blue-500 focus:outline-none"
            >
              {voivodeships.map((v) => (
                <option key={v} value={v}>
                  Office: {v}
                </option>
              ))}
            </select>

            <select
              value={filterOutcome}
              onChange={(e) => setFilterOutcome(e.target.value)}
              className="rounded-xl border border-slate-800 bg-slate-950 py-1.5 px-3 text-xs text-slate-200 focus:border-blue-500 focus:outline-none"
            >
              <option value="All">All Outcomes</option>
              <option value="Positive">Positive (Granted)</option>
              <option value="Documents">Additional Documents Needed</option>
            </select>
          </div>
        </div>

        {/* Cases Grid */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCases.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3 text-xs"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-slate-400 font-bold">
                      {item.id}
                    </span>
                    <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
                      {item.voivodeship}
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-sm mt-1">
                    {item.permitType}
                  </h4>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <Building className="h-3 w-3 text-slate-500" />
                    <span>{item.authority}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`rounded-lg px-2 py-0.5 text-[10px] font-bold ${
                      item.outcome.includes('Positive')
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {item.outcome}
                  </span>
                  <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1 justify-end">
                    <Clock className="h-3 w-3 text-slate-500" />
                    <span>{item.processingMonths} months</span>
                  </div>
                </div>
              </div>

              {/* Wezwanie / Deficiency Notice Note */}
              {item.additionalDocumentsNeeded.length > 0 && (
                <div className="rounded-lg bg-slate-900 p-2.5 border border-slate-800/80">
                  <span className="font-semibold text-amber-300 block text-[11px] mb-1 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3 text-amber-400" />
                    <span>Formal Wezwanie (Deficiency Notice) Items:</span>
                  </span>
                  <ul className="text-[11px] text-slate-400 list-disc list-inside space-y-0.5">
                    {item.additionalDocumentsNeeded.map((doc, i) => (
                      <li key={i}>{doc}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Key Practical Takeaway */}
              <div className="text-[11px] text-slate-300 flex items-start gap-1.5 pt-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-blue-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Case Notes:</strong> {item.notes}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950 p-3.5 text-[11px] text-slate-400 flex items-start gap-2">
          <Info className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
          <span>
            <strong>Informational Notice:</strong> These anonymized case records reflect past timelines and procedural deficiency notices from official voivodeship offices in Poland. Processing durations vary significantly depending on caseload and individual documentation completeness.
          </span>
        </div>
      </div>
    </div>
  );
};
