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
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400">
            <Compass className="h-4 w-4" />
            <span>Career Discovery & Skill Pathways</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Explore Realistic Career Paths
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-300">
            Real market salary data in Poland/EU, verified skill graphs, and side-by-side alternative learning routes.
          </p>
        </div>

        {/* Target career status */}
        {profile.targetCareerId && (
          <div className="flex items-center gap-2 rounded-xl border border-blue-500/30 bg-blue-500/10 px-3.5 py-2 text-xs text-blue-300">
            <Check className="h-4 w-4 text-blue-400" />
            <span>
              Target Set: <strong>{CAREERS_DATA.find((c) => c.id === profile.targetCareerId)?.title}</strong>
            </span>
          </div>
        )}
      </div>

      {/* Filters & Search */}
      <div className="mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by career, skill (C++, Unreal, Python, Cloud)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 pl-10 pr-4 text-xs sm:text-sm text-slate-200 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                categoryFilter === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
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
              className={`flex flex-col justify-between rounded-2xl border p-5 transition-all shadow-md ${
                isTarget
                  ? 'border-blue-500/60 bg-slate-900/90 ring-1 ring-blue-500/40'
                  : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900/90'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-300">
                    {career.category}
                  </span>
                  <span
                    className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                      career.demandLevel === 'Very High'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                        : 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                    }`}
                  >
                    {career.demandLevel} Demand
                  </span>
                </div>

                <h3 className="mt-2.5 text-lg font-bold text-white tracking-tight">
                  {career.title}
                </h3>
                <p className="mt-1 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {career.description}
                </p>

                {/* Salary benchmark snippet */}
                <div className="mt-4 rounded-xl bg-slate-950/70 p-3 border border-slate-800/60">
                  <div className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
                    European Compensation Benchmark
                  </div>
                  <div className="mt-1 flex items-baseline justify-between">
                    <div>
                      <span className="text-sm font-bold text-white">
                        €{career.salaryData.midEur.toLocaleString()}
                      </span>
                      <span className="text-[11px] text-slate-400 ml-1">/ year (Mid)</span>
                    </div>
                    {career.salaryData.midPln ? (
                      <span className="text-xs font-semibold text-emerald-400">
                        ~{career.salaryData.midPln.toLocaleString()} PLN/mo
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-emerald-400">
                        Accredited EU
                      </span>
                    )}
                  </div>
                  <div className="mt-1 text-[10px] text-slate-500 flex justify-between">
                    <span>Junior: €{career.salaryData.entryEur.toLocaleString()}</span>
                    <span>Senior: €{career.salaryData.seniorEur.toLocaleString()}+</span>
                  </div>
                </div>

                {/* Required Skills Chips */}
                <div className="mt-4">
                  <div className="text-[11px] font-semibold text-slate-400 mb-1.5">
                    Essential Core Skills:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {career.requiredSkills.map((sk) => (
                      <span
                        key={sk.skillId}
                        className={`rounded px-2 py-0.5 text-[10px] font-medium ${
                          sk.importance === 'Critical'
                            ? 'bg-red-500/10 text-red-300 border border-red-500/20'
                            : 'bg-blue-500/10 text-blue-300 border border-blue-500/20'
                        }`}
                      >
                        {sk.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-5 pt-4 border-t border-slate-800/80 space-y-2">
                <button
                  onClick={() => setSelectedCareerModal(career)}
                  className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/90 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
                >
                  <Layers className="h-3.5 w-3.5" />
                  <span>Compare Learning Routes & Progression</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onSetTargetCareer(career.id)}
                    className={`flex items-center justify-center gap-1 rounded-xl py-1.5 text-xs font-semibold transition-all ${
                      isTarget
                        ? 'bg-blue-600 text-white'
                        : 'border border-slate-800 bg-slate-950 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Check className="h-3.5 w-3.5" />
                    <span>{isTarget ? 'Target Selected' : 'Set as Goal'}</span>
                  </button>

                  <button
                    onClick={() => onViewMatchingPrograms(career.id)}
                    className="flex items-center justify-center gap-1 rounded-xl bg-blue-600/15 border border-blue-500/30 py-1.5 text-xs font-semibold text-blue-300 hover:bg-blue-600/25 transition-all"
                  >
                    <GraduationCap className="h-3.5 w-3.5" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-3xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl my-8">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-blue-500/15 px-2 py-0.5 text-xs font-semibold text-blue-400">
                    {selectedCareerModal.category}
                  </span>
                  <span className="rounded bg-emerald-500/15 px-2 py-0.5 text-xs font-bold text-emerald-400">
                    {selectedCareerModal.demandLevel} Demand
                  </span>
                </div>
                <h2 className="mt-1 text-2xl font-bold text-white">
                  {selectedCareerModal.title}
                </h2>
                <p className="mt-1 text-xs text-slate-400 italic">
                  "{selectedCareerModal.summaryQuote}"
                </p>
              </div>

              <button
                onClick={() => setSelectedCareerModal(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-6 text-xs text-slate-300 max-h-[70vh] overflow-y-auto pr-2">
              {/* Overview & Salary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                  <span className="text-slate-500 text-[10px] uppercase font-bold">Entry / Junior</span>
                  <div className="text-base font-bold text-white mt-1">
                    €{selectedCareerModal.salaryData.entryEur.toLocaleString()}
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {selectedCareerModal.salaryData.entryPln ? `~${selectedCareerModal.salaryData.entryPln.toLocaleString()} PLN/mo` : 'Annual benchmark'}
                  </span>
                </div>

                <div className="rounded-xl border border-blue-500/30 bg-blue-950/20 p-3">
                  <span className="text-blue-400 text-[10px] uppercase font-bold">Mid-Level (2-5 yrs)</span>
                  <div className="text-base font-bold text-white mt-1">
                    €{selectedCareerModal.salaryData.midEur.toLocaleString()}
                  </div>
                  <span className="text-[11px] text-blue-300">
                    {selectedCareerModal.salaryData.midPln ? `~${selectedCareerModal.salaryData.midPln.toLocaleString()} PLN/mo` : 'Annual benchmark'}
                  </span>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                  <span className="text-slate-500 text-[10px] uppercase font-bold">Senior / Lead (5+ yrs)</span>
                  <div className="text-base font-bold text-white mt-1">
                    €{selectedCareerModal.salaryData.seniorEur.toLocaleString()}+
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {selectedCareerModal.salaryData.seniorPln ? `~${selectedCareerModal.salaryData.seniorPln.toLocaleString()} PLN/mo` : 'Annual benchmark'}
                  </span>
                </div>
              </div>

              {/* Provenance note */}
              <div className="text-[10px] text-slate-500">
                Source: {selectedCareerModal.salaryData.source} (Updated {selectedCareerModal.salaryData.lastUpdated})
              </div>

              {/* Section: Alternative Learning Routes (Blueprint Section 6 & 8) */}
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
                  <Layers className="h-4 w-4 text-blue-400" />
                  <span>Education & Alternative Learning Routes</span>
                </h3>
                <p className="text-[11px] text-slate-400 mb-3">
                  Pathway evaluates all paths objectively. You do not always need a 4-year degree if your portfolio and verifiable output are undeniable.
                </p>

                <div className="space-y-3">
                  {selectedCareerModal.alternativeRoutes.map((route, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white">{route.type}</span>
                          <span className="text-slate-500">•</span>
                          <span className="text-slate-400">{route.duration}</span>
                          <span className="text-slate-500">•</span>
                          <span className="text-emerald-400 font-semibold">{route.estimatedCostEur}</span>
                        </div>
                        <div className="flex items-center gap-1 rounded bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-blue-400">
                          Suitability: {route.suitabilityScore}/100
                        </div>
                      </div>

                      <p className="text-slate-300 text-xs">{route.description}</p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
                        <div className="space-y-1">
                          <span className="font-semibold text-emerald-400">Key Advantages:</span>
                          {route.pros.map((p, i) => (
                            <div key={i} className="flex items-start gap-1 text-slate-300">
                              <span className="text-emerald-400">+</span>
                              <span>{p}</span>
                            </div>
                          ))}
                        </div>

                        <div className="space-y-1">
                          <span className="font-semibold text-rose-400">Trade-offs & Constraints:</span>
                          {route.cons.map((c, i) => (
                            <div key={i} className="flex items-start gap-1 text-slate-300">
                              <span className="text-rose-400">-</span>
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
                <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
                  <TrendingUp className="h-4 w-4 text-emerald-400" />
                  <span>Typical Career Progression & Seniority</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedCareerModal.careerProgression.map((stage, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-slate-800 bg-slate-950 p-3 space-y-1"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-blue-400">{stage.level} ({stage.typicalYears})</span>
                        <span className="text-slate-400 font-mono text-[10px]">{stage.salaryRangePln}</span>
                      </div>
                      <div className="font-semibold text-white text-xs">{stage.role}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills Tree */}
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
                  <Code className="h-4 w-4 text-purple-400" />
                  <span>Required & Helpful Skills</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedCareerModal.requiredSkills.map((sk) => {
                    const skillObj = SKILLS_DATA.find((s) => s.id === sk.skillId);
                    return (
                      <div
                        key={sk.skillId}
                        className="rounded-xl border border-slate-800 bg-slate-950 p-2.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white">{sk.name}</span>
                          <span className="text-[9px] rounded bg-blue-500/20 px-1.5 py-0.2 text-blue-400">
                            {sk.importance}
                          </span>
                        </div>
                        {skillObj && (
                          <p className="mt-1 text-[11px] text-slate-400 line-clamp-2">
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
            <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3 border-t border-slate-800 pt-4">
              <button
                onClick={() => {
                  onSetTargetCareer(selectedCareerModal.id);
                  setSelectedCareerModal(null);
                }}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-blue-500/40 bg-blue-600/20 px-4 py-2 text-xs font-semibold text-blue-300 hover:bg-blue-600/30"
              >
                <Check className="h-4 w-4" />
                <span>Set as My Target Goal</span>
              </button>

              <button
                onClick={() => {
                  onViewMatchingPrograms(selectedCareerModal.id);
                  setSelectedCareerModal(null);
                }}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2 text-xs font-semibold text-white hover:bg-blue-500 shadow-md shadow-blue-500/20"
              >
                <GraduationCap className="h-4 w-4" />
                <span>Explore Matched Polish Degrees</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
