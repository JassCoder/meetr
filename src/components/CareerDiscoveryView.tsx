import React, { useState } from 'react';
import { 
  Compass, 
  Search, 
  TrendingUp, 
  Layers, 
  Check, 
  X, 
  GraduationCap, 
  Code
} from 'lucide-react';
import { CareerItem, UserProfileState } from '../types';
import { CAREERS_DATA } from '../data/careersData';
import { SKILLS_DATA } from '../data/skillsData';

interface CareerDiscoveryViewProps {
  profile: UserProfileState;
  onSetTargetCareer: (careerId: string) => void;
  onViewMatchingPrograms: (careerId: string) => void;
  selectedCareerModal: CareerItem | null;
  setSelectedCareerModal: (career: CareerItem | null) => void;
}

export const CareerDiscoveryView: React.FC<CareerDiscoveryViewProps> = ({
  profile,
  onSetTargetCareer,
  onViewMatchingPrograms,
  selectedCareerModal,
  setSelectedCareerModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  const categories = [
    'All',
    'Gaming & Graphics',
    'Software & Systems',
    'Data & AI',
    'Cybersecurity',
    'Product & Strategy',
  ];

  const filteredCareers = CAREERS_DATA.filter((career) => {
    const matchesCategory = categoryFilter === 'All' || career.category === categoryFilter;
    const matchesSearch =
      career.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      career.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      career.requiredSkills.some((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
      {/* Header section */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-lg border-2 border-black bg-[#FFE600] px-3 py-1 text-xs font-mono font-black text-black shadow-[2px_2px_0px_0px_#000]">
            <Compass className="h-4 w-4 stroke-[2.5]" />
            <span>CAREER DISCOVERY & SKILL PATHWAYS</span>
          </div>
          <h1 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-black font-display">
            Explore Realistic Career Paths
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-zinc-700 font-medium">
            Verified market salary data in Poland/EU, verified skill graphs, and side-by-side alternative learning routes.
          </p>
        </div>

        {/* Target career status badge */}
        {profile.targetCareerId ? (
          <div className="flex items-center gap-2.5 rounded-xl border-2 border-black bg-[#BAE6FD] px-4 py-2.5 text-xs text-black shadow-[3px_3px_0px_0px_#000]">
            <Check className="h-4 w-4 text-black stroke-[3] shrink-0" />
            <span className="font-bold">
              Target Goal: <strong className="font-black underline">{CAREERS_DATA.find((c) => c.id === profile.targetCareerId)?.title}</strong>
            </span>
            <button
              onClick={() => onSetTargetCareer('')}
              className="ml-2 rounded-lg border-2 border-black bg-white hover:bg-[#FECDD3] px-2.5 py-1 text-[11px] font-black text-black shadow-[1.5px_1.5px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
              title="Clear Target Goal"
            >
              ✕ Set No Goal
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-xl border-2 border-black bg-[#FAF7F0] px-4 py-2.5 text-xs font-bold text-black shadow-[3px_3px_0px_0px_#000]">
            <span>Exploration Mode: <strong className="font-black bg-[#FFE600] px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_0px_#000]">No Target Goal</strong></span>
          </div>
        )}
      </div>

      {/* Filters & Search */}
      <div className="mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-black stroke-[2.5]" />
          <input
            type="text"
            placeholder="Search by career, skill (C++, Unreal, Python, Cloud)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border-2 border-black bg-white py-2.5 pl-10 pr-4 text-xs sm:text-sm font-bold text-black placeholder:text-zinc-500 shadow-[3px_3px_0px_0px_#000] focus:outline-none focus:bg-[#FEF9C3]"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`rounded-xl px-3 py-1.5 text-xs font-black transition-all border-2 border-black ${
                categoryFilter === cat
                  ? 'bg-[#FFE600] text-black shadow-[3px_3px_0px_0px_#000] -translate-x-0.5 -translate-y-0.5'
                  : 'bg-white text-black hover:bg-[#FAF7F0] shadow-[2px_2px_0px_0px_#000]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Career Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCareers.map((career) => {
          const isTarget = profile.targetCareerId === career.id;
          return (
            <div
              key={career.id}
              className={`flex flex-col justify-between rounded-xl border-2 border-black p-5 transition-all ${
                isTarget
                  ? 'bg-[#FEF08A]/40 shadow-[6px_6px_0px_0px_#000] ring-2 ring-black'
                  : 'bg-white shadow-[4px_4px_0px_0px_#000] hover:shadow-[7px_7px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="rounded-md border-2 border-black bg-[#BAE6FD] px-2 py-0.5 text-[10px] font-mono font-black text-black shadow-[1px_1px_0px_0px_#000]">
                    {career.category}
                  </span>
                  <span
                    className={`rounded-md border-2 border-black px-2 py-0.5 text-[10px] font-mono font-black shadow-[1px_1px_0px_0px_#000] ${
                      career.demandLevel === 'Very High'
                        ? 'bg-[#A7F3D0] text-black'
                        : 'bg-[#FED7AA] text-black'
                    }`}
                  >
                    {career.demandLevel} Demand
                  </span>
                </div>

                <h3 className="mt-3 text-lg font-black text-black tracking-tight font-display">
                  {career.title}
                </h3>
                <p className="mt-1 text-xs text-zinc-700 font-medium line-clamp-2 leading-relaxed">
                  {career.description}
                </p>

                {/* Salary benchmark snippet */}
                <div className="mt-4 rounded-xl bg-[#FAF7F0] p-3 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                  <div className="text-[10px] uppercase font-black text-zinc-600 tracking-wider font-mono">
                    European Compensation Benchmark
                  </div>
                  <div className="mt-1 flex items-baseline justify-between">
                    <div>
                      <span className="text-base font-black text-black font-mono">
                        €{career.salaryData.midEur.toLocaleString()}
                      </span>
                      <span className="text-[11px] text-zinc-600 ml-1 font-bold">/ yr (Mid)</span>
                    </div>
                    {career.salaryData.midPln ? (
                      <span className="text-xs font-black text-black font-mono bg-[#A7F3D0] px-1.5 py-0.5 rounded border border-black shadow-[1px_1px_0px_0px_#000]">
                        ~{career.salaryData.midPln.toLocaleString()} PLN/mo
                      </span>
                    ) : (
                      <span className="text-xs font-black text-black font-mono bg-[#A7F3D0] px-1.5 py-0.5 rounded border border-black shadow-[1px_1px_0px_0px_#000]">
                        Accredited EU
                      </span>
                    )}
                  </div>
                  <div className="mt-1 text-[10px] text-zinc-700 font-bold flex justify-between font-mono">
                    <span>Junior: €{career.salaryData.entryEur.toLocaleString()}</span>
                    <span>Senior: €{career.salaryData.seniorEur.toLocaleString()}+</span>
                  </div>
                </div>

                {/* Required Skills Chips */}
                <div className="mt-4">
                  <div className="text-[11px] font-black text-black mb-1.5 uppercase font-mono">
                    Essential Core Skills:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {career.requiredSkills.map((sk) => (
                      <span
                        key={sk.skillId}
                        className={`rounded-md border-2 border-black px-2 py-0.5 text-[10px] font-mono font-black shadow-[1px_1px_0px_0px_#000] ${
                          sk.importance === 'Critical'
                            ? 'bg-[#FECDD3] text-black'
                            : 'bg-[#FEF08A] text-black'
                        }`}
                      >
                        {sk.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-5 pt-4 border-t-2 border-black space-y-2">
                <button
                  onClick={() => setSelectedCareerModal(career)}
                  className="w-full flex items-center justify-center gap-1.5 rounded-xl border-2 border-black bg-white hover:bg-[#FFE600] py-2 text-xs font-black text-black shadow-[2.5px_2.5px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                >
                  <Layers className="h-3.5 w-3.5 stroke-[2.5]" />
                  <span>Compare Learning Routes & Progression</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onSetTargetCareer(isTarget ? '' : career.id)}
                    className={`flex items-center justify-center gap-1 rounded-xl py-2 text-xs font-black transition-all border-2 border-black shadow-[2.5px_2.5px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 ${
                      isTarget
                        ? 'bg-[#FECDD3] text-black hover:bg-rose-300'
                        : 'bg-[#A7F3D0] text-black hover:bg-emerald-300'
                    }`}
                    title={isTarget ? 'Click to remove goal' : 'Set as target goal'}
                  >
                    <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                    <span>{isTarget ? 'Target Active' : 'Set as Goal'}</span>
                  </button>

                  <button
                    onClick={() => onViewMatchingPrograms(career.id)}
                    className="flex items-center justify-center gap-1 rounded-xl bg-[#DDD6FE] hover:bg-violet-300 border-2 border-black py-2 text-xs font-black text-black shadow-[2.5px_2.5px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                  >
                    <GraduationCap className="h-3.5 w-3.5 stroke-[2.5]" />
                    <span>Match Degrees</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comprehensive Career Detail Modal */}
      {selectedCareerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-3xl rounded-2xl border-2 border-black bg-white p-6 shadow-[8px_8px_0px_0px_#000] my-8 text-black">
            {/* Header */}
            <div className="flex items-start justify-between border-b-2 border-black pb-4">
              <div>
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="rounded-md border-2 border-black bg-[#BAE6FD] px-2 py-0.5 font-black text-black shadow-[1px_1px_0px_0px_#000]">
                    {selectedCareerModal.category}
                  </span>
                  <span className="rounded-md border-2 border-black bg-[#A7F3D0] px-2 py-0.5 font-black text-black shadow-[1px_1px_0px_0px_#000]">
                    {selectedCareerModal.demandLevel} Demand
                  </span>
                </div>
                <h2 className="mt-2 text-xl sm:text-2xl font-black text-black font-display">
                  {selectedCareerModal.title}
                </h2>
                <p className="mt-1 text-xs text-zinc-700 italic font-medium">
                  "{selectedCareerModal.summaryQuote}"
                </p>
              </div>

              <button
                onClick={() => setSelectedCareerModal(null)}
                className="rounded-xl border-2 border-black bg-white p-1.5 text-black shadow-[2px_2px_0px_0px_#000] hover:bg-[#FECDD3] transition-all"
              >
                <X className="h-5 w-5 stroke-[2.5]" />
              </button>
            </div>

            <div className="mt-4 space-y-6 text-xs text-zinc-900 max-h-[70vh] overflow-y-auto pr-2 font-sans">
              {/* Overview & Salary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-xl border-2 border-black bg-[#FAF7F0] p-3 shadow-[2px_2px_0px_0px_#000]">
                  <span className="text-zinc-600 text-[10px] uppercase font-black font-mono">Entry / Junior</span>
                  <div className="text-base font-black text-black font-mono mt-1">
                    €{selectedCareerModal.salaryData.entryEur.toLocaleString()}
                  </div>
                  <span className="text-[11px] text-zinc-700 font-bold">
                    {selectedCareerModal.salaryData.entryPln ? `~${selectedCareerModal.salaryData.entryPln.toLocaleString()} PLN/mo` : 'Annual benchmark'}
                  </span>
                </div>

                <div className="rounded-xl border-2 border-black bg-[#FEF08A] p-3 shadow-[2px_2px_0px_0px_#000]">
                  <span className="text-black text-[10px] uppercase font-black font-mono">Mid-Level (2-5 yrs)</span>
                  <div className="text-base font-black text-black font-mono mt-1">
                    €{selectedCareerModal.salaryData.midEur.toLocaleString()}
                  </div>
                  <span className="text-[11px] text-black font-bold">
                    {selectedCareerModal.salaryData.midPln ? `~${selectedCareerModal.salaryData.midPln.toLocaleString()} PLN/mo` : 'Annual benchmark'}
                  </span>
                </div>

                <div className="rounded-xl border-2 border-black bg-[#FAF7F0] p-3 shadow-[2px_2px_0px_0px_#000]">
                  <span className="text-zinc-600 text-[10px] uppercase font-black font-mono">Senior / Lead (5+ yrs)</span>
                  <div className="text-base font-black text-black font-mono mt-1">
                    €{selectedCareerModal.salaryData.seniorEur.toLocaleString()}+
                  </div>
                  <span className="text-[11px] text-zinc-700 font-bold">
                    {selectedCareerModal.salaryData.seniorPln ? `~${selectedCareerModal.salaryData.seniorPln.toLocaleString()} PLN/mo` : 'Annual benchmark'}
                  </span>
                </div>
              </div>

              {/* Provenance note */}
              <div className="text-[10px] text-zinc-600 font-mono font-bold">
                Source: {selectedCareerModal.salaryData.source} (Updated {selectedCareerModal.salaryData.lastUpdated})
              </div>

              {/* Section: Alternative Learning Routes */}
              <div>
                <h3 className="text-sm font-black text-black flex items-center gap-2 mb-2 font-display">
                  <Layers className="h-4 w-4 text-black stroke-[2.5]" />
                  <span>Education & Alternative Learning Routes</span>
                </h3>
                <p className="text-[11px] text-zinc-700 font-medium mb-3">
                  Meetr evaluates all paths objectively. You do not always need a 4-year degree if your portfolio and verifiable output are undeniable.
                </p>

                <div className="space-y-3">
                  {selectedCareerModal.alternativeRoutes.map((route, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border-2 border-black bg-[#FAF7F0] p-4 space-y-2 shadow-[2.5px_2.5px_0px_0px_#000]"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2 font-bold">
                          <span className="font-black text-sm text-black font-display">{route.type}</span>
                          <span className="text-zinc-400">•</span>
                          <span className="text-zinc-700 font-mono">{route.duration}</span>
                          <span className="text-zinc-400">•</span>
                          <span className="text-black font-mono font-black bg-[#BAE6FD] px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_0px_#000]">{route.estimatedCostEur}</span>
                        </div>
                        <div className="flex items-center gap-1 rounded-md border-2 border-black bg-[#FFE600] px-2 py-0.5 text-[10px] font-black text-black shadow-[1px_1px_0px_0px_#000] font-mono">
                          Suitability: {route.suitabilityScore}/100
                        </div>
                      </div>

                      <p className="text-zinc-800 text-xs font-medium leading-relaxed">{route.description}</p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-[11px]">
                        <div className="rounded-lg border border-black bg-[#A7F3D0]/40 p-2.5 space-y-1">
                          <span className="font-black text-black uppercase font-mono">Key Advantages:</span>
                          {route.pros.map((p, i) => (
                            <div key={i} className="flex items-start gap-1 text-zinc-900 font-medium">
                              <span className="font-black text-black">+</span>
                              <span>{p}</span>
                            </div>
                          ))}
                        </div>

                        <div className="rounded-lg border border-black bg-[#FECDD3]/40 p-2.5 space-y-1">
                          <span className="font-black text-black uppercase font-mono">Trade-offs & Constraints:</span>
                          {route.cons.map((c, i) => (
                            <div key={i} className="flex items-start gap-1 text-zinc-900 font-medium">
                              <span className="font-black text-black">-</span>
                              <span>{c}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Career Progression Ladder */}
              <div>
                <h3 className="text-sm font-black text-black flex items-center gap-2 mb-2 font-display">
                  <TrendingUp className="h-4 w-4 text-black stroke-[2.5]" />
                  <span>Typical Career Progression & Seniority</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedCareerModal.careerProgression.map((stage, i) => (
                    <div
                      key={i}
                      className="rounded-xl border-2 border-black bg-[#FAF7F0] p-3 space-y-1 shadow-[2px_2px_0px_0px_#000]"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-black text-black">{stage.level} ({stage.typicalYears})</span>
                        <span className="text-black font-mono font-black text-[10px] bg-white px-1.5 py-0.5 rounded border border-black shadow-[1px_1px_0px_0px_#000]">{stage.salaryRangePln}</span>
                      </div>
                      <div className="font-bold text-zinc-800 text-xs">{stage.role}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills Tree */}
              <div>
                <h3 className="text-sm font-black text-black flex items-center gap-2 mb-2 font-display">
                  <Code className="h-4 w-4 text-black stroke-[2.5]" />
                  <span>Required & Helpful Skills</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedCareerModal.requiredSkills.map((sk) => {
                    const skillObj = SKILLS_DATA.find((s) => s.id === sk.skillId);
                    return (
                      <div
                        key={sk.skillId}
                        className="rounded-xl border-2 border-black bg-[#FAF7F0] p-2.5 shadow-[2px_2px_0px_0px_#000]"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-black text-black">{sk.name}</span>
                          <span className="text-[9px] font-mono font-black rounded border border-black bg-[#FEF08A] px-1.5 py-0.5 text-black shadow-[1px_1px_0px_0px_#000]">
                            {sk.importance}
                          </span>
                        </div>
                        {skillObj && (
                          <p className="mt-1 text-[11px] text-zinc-700 font-medium line-clamp-2">
                            {skillObj.description}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="mt-6 flex flex-wrap items-center justify-end gap-3 border-t-2 border-black pt-4">
              {profile.targetCareerId === selectedCareerModal.id ? (
                <button
                  onClick={() => {
                    onSetTargetCareer('');
                    setSelectedCareerModal(null);
                  }}
                  className="flex items-center justify-center gap-1.5 rounded-xl border-2 border-black bg-[#FECDD3] px-4 py-2.5 text-xs font-black text-black shadow-[3px_3px_0px_0px_#000] hover:bg-rose-300 hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                >
                  <X className="h-4 w-4 stroke-[2.5]" />
                  <span>Clear Goal (Set No Goal)</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    onSetTargetCareer(selectedCareerModal.id);
                    setSelectedCareerModal(null);
                  }}
                  className="flex items-center justify-center gap-1.5 rounded-xl border-2 border-black bg-[#A7F3D0] px-4 py-2.5 text-xs font-black text-black shadow-[3px_3px_0px_0px_#000] hover:bg-emerald-300 hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                >
                  <Check className="h-4 w-4 stroke-[2.5]" />
                  <span>Set as My Target Goal</span>
                </button>
              )}

              <button
                onClick={() => {
                  onViewMatchingPrograms(selectedCareerModal.id);
                  setSelectedCareerModal(null);
                }}
                className="flex items-center justify-center gap-1.5 rounded-xl border-2 border-black bg-[#FFE600] px-5 py-2.5 text-xs font-black text-black shadow-[3px_3px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
              >
                <GraduationCap className="h-4 w-4 stroke-[2.5]" />
                <span>Explore Matched EU Degrees</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
