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
        <div className="inline-flex items-center gap-2 rounded-lg border-2 border-black bg-[#BAE6FD] px-3 py-1 text-xs font-mono font-black text-black shadow-[2px_2px_0px_0px_#000]">
          <Plane className="h-4 w-4 stroke-[2.5]" />
          <span>MOBILITY & IMMIGRATION INTELLIGENCE</span>
        </div>
        <h1 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-black font-display">
          European Student Visa & Residence Permit Intelligence
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-zinc-700 font-medium">
          Statutory National D-Type visa thresholds and anonymized historical Karta Pobytu case durations across Polish Voivodeship offices.
        </p>
      </div>

      {/* Top Grid: D-Type Visa Requirements */}
      <div className="mb-8 rounded-2xl border-2 border-black bg-white p-6 shadow-[6px_6px_0px_0px_#000]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b-2 border-black pb-4 gap-2">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-black stroke-[2.5]" />
              <h2 className="text-xl font-black text-black font-display">
                National D-Type Student Visa (Wiza Krajowa D-11)
              </h2>
            </div>
            <p className="text-xs text-zinc-700 font-bold mt-0.5">
              Governed by the Foreigners Act (Ustawa o cudzoziemcach) & MSZ Consular Guidelines
            </p>
          </div>
          <span className="rounded-md border-2 border-black bg-[#FFE600] px-3 py-1 text-xs font-mono font-black text-black shadow-[1.5px_1.5px_0px_0px_#000]">
            Non-EU International Students
          </span>
        </div>

        {/* 3 Pillars of Financial Calculation */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border-2 border-black bg-[#FAF7F0] p-4 shadow-[3px_3px_0px_0px_#000]">
            <span className="text-[10px] uppercase font-black text-zinc-600 font-mono">
              1. Monthly Subsistence Minimum
            </span>
            <div className="text-xl font-black font-mono text-black mt-1">
              ~800 PLN / month
            </div>
            <p className="text-[11px] text-zinc-700 font-medium mt-1">
              Must show balance for total months of planned stay (typically 12 months = ~9,600 - 10,500 PLN).
            </p>
          </div>

          <div className="rounded-xl border-2 border-black bg-[#A7F3D0] p-4 shadow-[3px_3px_0px_0px_#000]">
            <span className="text-[10px] uppercase font-black text-zinc-800 font-mono">
              2. Return Travel Reserve Allowance
            </span>
            <div className="text-xl font-black font-mono text-black mt-1">
              2,500 PLN (~€580)
            </div>
            <p className="text-[11px] text-zinc-800 font-medium mt-1">
              Statutory reserve for non-EU ticket return costs (~500 PLN for EU neighboring countries).
            </p>
          </div>

          <div className="rounded-xl border-2 border-black bg-[#BAE6FD] p-4 shadow-[3px_3px_0px_0px_#000]">
            <span className="text-[10px] uppercase font-black text-zinc-800 font-mono">
              3. Accommodation Proof
            </span>
            <div className="text-xl font-black text-black font-display mt-1">
              Dorm / Lease Contract
            </div>
            <p className="text-[11px] text-zinc-800 font-medium mt-1">
              Official university dormitory allotment certificate or stamped residential lease agreement.
            </p>
          </div>
        </div>

        {/* Mandatory Steps Checklist */}
        <div className="mt-6">
          <h3 className="text-xs font-black uppercase tracking-wider text-black mb-3 font-mono">
            Official Statutory Visa Requirements (Consular MSZ Standard):
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {POLAND_STUDENT_VISA_STEPS.map((step, idx) => (
              <div
                key={step.id}
                className="rounded-xl border-2 border-black bg-[#FAF7F0] p-4 space-y-2 text-xs flex flex-col justify-between shadow-[3px_3px_0px_0px_#000]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md border-2 border-black bg-[#FFE600] text-xs font-black text-black shadow-[1px_1px_0px_0px_#000]">
                      {idx + 1}
                    </span>
                    <span className="text-[9px] font-mono font-black text-black rounded border border-black bg-white px-2 py-0.5 shadow-[1px_1px_0px_0px_#000]">
                      {step.category}
                    </span>
                  </div>
                  <h4 className="font-black text-black mt-2 leading-snug font-display text-sm">{step.title}</h4>
                  <p className="text-[11px] text-zinc-700 mt-1 leading-relaxed font-medium">{step.requirementDetail}</p>
                </div>
                <div className="text-[10px] text-zinc-600 border-t-2 border-black pt-2 font-mono font-bold">
                  Source: {step.officialSource}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section: Anonymized Historical Case Intelligence */}
      <div className="rounded-2xl border-2 border-black bg-white p-6 shadow-[6px_6px_0px_0px_#000]">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b-2 border-black pb-4 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Users className="h-6 w-6 text-black stroke-[2.5]" />
              <h2 className="text-xl font-black text-black font-display">
                Anonymized Karta Pobytu (Temporary Residence) Intelligence
              </h2>
            </div>
            <p className="text-xs text-zinc-700 font-bold mt-0.5">
              Empirical historical timelines and common &quot;Wezwanie do braków&quot; from Voivodeship Immigration Offices
            </p>
          </div>

          {/* Voivodeship & Outcome Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedVoivodeship}
              onChange={(e) => setSelectedVoivodeship(e.target.value)}
              className="rounded-xl border-2 border-black bg-[#FAF7F0] py-2 px-3 text-xs font-black text-black shadow-[2px_2px_0px_0px_#000] focus:bg-[#FEF9C3] focus:outline-none"
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
              className="rounded-xl border-2 border-black bg-[#FAF7F0] py-2 px-3 text-xs font-black text-black shadow-[2px_2px_0px_0px_#000] focus:bg-[#FEF9C3] focus:outline-none"
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
              className="rounded-xl border-2 border-black bg-[#FAF7F0] p-4 space-y-3 text-xs shadow-[3px_3px_0px_0px_#000]"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-black font-black bg-white px-1.5 py-0.5 rounded border border-black">
                      {item.id}
                    </span>
                    <span className="rounded-md border border-black bg-[#FEF08A] px-2 py-0.5 text-[10px] font-mono font-black text-black">
                      {item.voivodeship}
                    </span>
                  </div>
                  <h4 className="font-black text-black text-sm mt-1.5 font-display">
                    {item.permitType}
                  </h4>
                  <div className="text-[11px] text-zinc-700 flex items-center gap-1 mt-0.5 font-bold">
                    <Building className="h-3.5 w-3.5 text-black stroke-[2]" />
                    <span>{item.authority}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`rounded-md border-2 border-black px-2 py-0.5 text-[10px] font-mono font-black shadow-[1px_1px_0px_0px_#000] ${
                      item.outcome.includes('Positive')
                        ? 'bg-[#A7F3D0] text-black'
                        : 'bg-[#FECDD3] text-black'
                    }`}
                  >
                    {item.outcome}
                  </span>
                  <div className="text-[11px] font-mono font-bold text-zinc-800 mt-1.5 flex items-center gap-1 justify-end">
                    <Clock className="h-3.5 w-3.5 text-black stroke-[2]" />
                    <span>{item.processingMonths} months</span>
                  </div>
                </div>
              </div>

              {/* Wezwanie / Deficiency Notice Note */}
              {item.additionalDocumentsNeeded.length > 0 && (
                <div className="rounded-lg bg-[#FECDD3]/30 p-2.5 border-2 border-black">
                  <span className="font-black text-black block text-[11px] mb-1 flex items-center gap-1 font-mono uppercase">
                    <AlertTriangle className="h-3.5 w-3.5 stroke-[2.5]" />
                    <span>Formal Wezwanie (Deficiency Notice) Items:</span>
                  </span>
                  <ul className="text-[11px] text-zinc-900 list-disc list-inside space-y-0.5 font-medium">
                    {item.additionalDocumentsNeeded.map((doc, i) => (
                      <li key={i}>{doc}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Key Practical Takeaway */}
              <div className="text-[11px] text-zinc-800 flex items-start gap-1.5 pt-1 font-medium">
                <CheckCircle2 className="h-4 w-4 text-black stroke-[2.5] shrink-0 mt-0.5" />
                <span>
                  <strong>Case Notes:</strong> {item.notes}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="mt-6 rounded-xl border-2 border-black bg-[#FAF7F0] p-3.5 text-[11px] text-zinc-800 flex items-start gap-2 shadow-[2px_2px_0px_0px_#000]">
          <Info className="h-4 w-4 text-black stroke-[2.5] shrink-0 mt-0.5" />
          <span className="font-medium">
            <strong>Informational Notice:</strong> These anonymized case records reflect past timelines and procedural deficiency notices from official voivodeship offices in Poland. Processing durations vary significantly depending on caseload and individual documentation completeness.
          </span>
        </div>
      </div>
    </div>
  );
};
