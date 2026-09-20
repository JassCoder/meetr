import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ExternalLink, 
  Bookmark, 
  BookmarkCheck, 
  Scale, 
  CheckCircle2, 
  AlertTriangle,
  Info,
  X,
  LayoutGrid,
  List,
  ArrowUpDown,
  Building2
} from 'lucide-react';
import { ProgramItem, UserProfileState } from '../types';
import { PROGRAMS_DATA } from '../data/euEducationData';
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
  onClearGoal?: () => void;
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
  onClearGoal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [countryFilter, setCountryFilter] = useState('All');
  const [degreeFilter, setDegreeFilter] = useState('All');
  const [fieldFilter, setFieldFilter] = useState('All');
  const [feeTierFilter, setFeeTierFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'match' | 'tuition-asc' | 'tuition-desc' | 'duration'>('match');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedProgramModal, setSelectedProgramModal] = useState<ProgramItem | null>(null);

  // Dynamic distinct lists from dataset
  const availableCountries = useMemo(() => {
    const set = new Set<string>();
    PROGRAMS_DATA.forEach((p) => set.add(p.country));
    return ['All', ...Array.from(set).sort()];
  }, []);

  const availableDegrees = useMemo(() => {
    const set = new Set<string>();
    PROGRAMS_DATA.forEach((p) => set.add(p.degreeLevel));
    return ['All', ...Array.from(set).sort()];
  }, []);

  const availableFields = useMemo(() => {
    const set = new Set<string>();
    PROGRAMS_DATA.forEach((p) => set.add(p.field));
    return ['All', ...Array.from(set).sort()];
  }, []);

  // Filter logic
  const filteredAndScoredPrograms = useMemo(() => {
    const isEuCitizen = profile.passportOrigin === 'EU / EEA';

    const list = PROGRAMS_DATA.filter((prog) => {
      // Country
      if (countryFilter !== 'All' && prog.country !== countryFilter) {
        return false;
      }

      // Degree
      if (degreeFilter !== 'All' && prog.degreeLevel !== degreeFilter) {
        return false;
      }

      // Field
      if (fieldFilter !== 'All' && prog.field !== fieldFilter) {
        return false;
      }

      // Fee tier
      const tuition = isEuCitizen ? prog.euTuitionEurAnnual : prog.nonEuTuitionEurAnnual;
      if (feeTierFilter === 'free' && tuition > 650) return false;
      if (feeTierFilter === 'under-3500' && tuition > 3500) return false;
      if (feeTierFilter === 'under-7000' && tuition > 7000) return false;
      if (feeTierFilter === 'under-15000' && tuition > 15000) return false;

      // Career filter (if forwarded)
      if (filterByCareerId) {
        const score = prog.careerRelevanceScore?.[filterByCareerId] || 0;
        if (score < 65) return false;
      }

      // Text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inName = prog.name.toLowerCase().includes(q);
        const inInst = prog.institutionName.toLowerCase().includes(q);
        const inCity = prog.institutionCity.toLowerCase().includes(q);
        const inCountry = prog.country.toLowerCase().includes(q);
        const inField = prog.field.toLowerCase().includes(q);
        const inCurriculum = prog.curriculumSummary.toLowerCase().includes(q);
        const inSkills = prog.skillsTaught.some((s) => s.toLowerCase().includes(q));

        if (!inName && !inInst && !inCity && !inCountry && !inField && !inCurriculum && !inSkills) {
          return false;
        }
      }

      return true;
    });

    // Score with matching engine
    const scored = list.map((prog) => {
      const breakdown = calculateProgramMatch(prog, profile);
      const tuition = isEuCitizen ? prog.euTuitionEurAnnual : prog.nonEuTuitionEurAnnual;
      return {
        program: prog,
        breakdown,
        tuition,
      };
    });

    // Sort
    scored.sort((a, b) => {
      if (sortBy === 'match') {
        return b.breakdown.totalScore - a.breakdown.totalScore;
      }
      if (sortBy === 'tuition-asc') {
        return a.tuition - b.tuition;
      }
      if (sortBy === 'tuition-desc') {
        return b.tuition - a.tuition;
      }
      if (sortBy === 'duration') {
        return a.program.durationYears - b.program.durationYears;
      }
      return 0;
    });

    return scored;
  }, [
    countryFilter,
    degreeFilter,
    fieldFilter,
    feeTierFilter,
    filterByCareerId,
    searchQuery,
    profile,
    sortBy,
  ]);

  const isEuCitizen = profile.passportOrigin === 'EU / EEA';

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Editorial Header */}
      <div className="border-b-2 border-black pb-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-[11px] font-black tracking-widest text-black uppercase bg-[#FFE600] px-2.5 py-0.5 rounded border border-black shadow-[1.5px_1.5px_0px_0px_#000]">
              <span className="inline-block h-2 w-2 rounded-full bg-black" />
              <span>ETER & National Open Register Catalog</span>
            </div>
            <h1 className="mt-2.5 text-2xl sm:text-4xl font-black tracking-tight text-black font-display">
              European Higher Education Opportunities
            </h1>
            <p className="mt-1.5 max-w-2xl text-xs sm:text-sm text-zinc-700 font-medium">
              Accredited Bachelor, Master, Engineering (Inżynier), and Erasmus Mundus joint degree opportunities across 15+ European nations with statutory tuition and Bologna ECTS credits.
            </p>
          </div>

          {/* Compare Trigger */}
          {comparedProgramIds.length > 0 && (
            <button
              onClick={onNavigateToCompare}
              className="inline-flex items-center gap-2 rounded-xl border-2 border-black bg-[#FFE600] px-4 py-2.5 text-xs font-black text-black shadow-[3px_3px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all shrink-0"
            >
              <Scale className="h-4 w-4 stroke-[2.5]" />
              <span>Compare ({comparedProgramIds.length}/3) Selected</span>
            </button>
          )}
        </div>
      </div>

      {/* Target Goal Status Banner */}
      {profile.targetCareerId && (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-2.5 rounded-xl border-2 border-black bg-[#FEF08A] px-4 py-3 text-xs text-black shadow-[3.5px_3.5px_0px_0px_#000]">
          <div className="flex items-center gap-2 font-bold">
            <span className="h-2.5 w-2.5 rounded-full bg-black animate-ping" />
            <span>
              Target Goal Active: <strong className="font-black bg-white px-1.5 py-0.5 rounded border border-black ml-1">{profile.targetCareerId}</strong> (Programs scored for alignment)
            </span>
          </div>
          {onClearGoal && (
            <button
              onClick={onClearGoal}
              className="rounded-lg border-2 border-black bg-[#FECDD3] hover:bg-rose-300 text-black px-3 py-1 text-xs font-black shadow-[2px_2px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
            >
              ✕ Set No Goal (Explore All Disciplines)
            </button>
          )}
        </div>
      )}

      {/* Search & Filter Matrix */}
      <div className="mt-6 space-y-3.5">
        {/* Search Bar & View Mode Toggle */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-black stroke-[2.5]" />
            <input
              type="text"
              placeholder="Search by degree title, university, city, technology (e.g. AI, C++, Cloud, Munich, Delft)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border-2 border-black bg-white py-2.5 pl-10 pr-10 text-xs font-bold text-black placeholder:text-zinc-500 shadow-[3px_3px_0px_0px_#000] focus:shadow-[4.5px_4.5px_0px_0px_#000] focus:outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-3 text-black hover:text-rose-600"
              >
                <X className="h-4 w-4 stroke-[2.5]" />
              </button>
            )}
          </div>

          {/* View Mode & Sort Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Sort Dropdown */}
            <div className="relative flex items-center">
              <ArrowUpDown className="absolute left-3 h-3.5 w-3.5 text-black pointer-events-none stroke-[2.5]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="rounded-xl border-2 border-black bg-white py-2.5 pl-8 pr-4 text-xs font-black text-black shadow-[3px_3px_0px_0px_#000] focus:outline-none appearance-none"
              >
                <option value="match">Sort: Highest Match</option>
                <option value="tuition-asc">Tuition: Low to High</option>
                <option value="tuition-desc">Tuition: High to Low</option>
                <option value="duration">Duration: Shortest</option>
              </select>
            </div>

            {/* View Switcher: Grid vs Table */}
            <div className="flex items-center rounded-xl border-2 border-black bg-white p-0.5 shadow-[3px_3px_0px_0px_#000]">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg text-xs font-black transition-all ${
                  viewMode === 'grid' ? 'bg-[#FFE600] text-black border border-black shadow-[1.5px_1.5px_0px_0px_#000]' : 'text-zinc-600 hover:text-black'
                }`}
                title="Grid Card View"
              >
                <LayoutGrid className="h-4 w-4 stroke-[2.5]" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-lg text-xs font-black transition-all ${
                  viewMode === 'table' ? 'bg-[#FFE600] text-black border border-black shadow-[1.5px_1.5px_0px_0px_#000]' : 'text-zinc-600 hover:text-black'
                }`}
                title="Compact Directory Table"
              >
                <List className="h-4 w-4 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>

        {/* Minimal Filters Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          {/* Country */}
          <div>
            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="w-full rounded-xl border-2 border-black bg-white py-2 px-3 text-black font-bold shadow-[2.5px_2.5px_0px_0px_#000] focus:outline-none"
            >
              {availableCountries.map((c) => (
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
              className="w-full rounded-xl border-2 border-black bg-white py-2 px-3 text-black font-bold shadow-[2.5px_2.5px_0px_0px_#000] focus:outline-none"
            >
              {availableDegrees.map((deg) => (
                <option key={deg} value={deg}>
                  Degree: {deg}
                </option>
              ))}
            </select>
          </div>

          {/* Discipline / Field */}
          <div>
            <select
              value={fieldFilter}
              onChange={(e) => setFieldFilter(e.target.value)}
              className="w-full rounded-xl border-2 border-black bg-white py-2 px-3 text-black font-bold shadow-[2.5px_2.5px_0px_0px_#000] focus:outline-none"
            >
              {availableFields.map((f) => (
                <option key={f} value={f}>
                  {f === 'All' ? 'Field: All Disciplines' : f}
                </option>
              ))}
            </select>
          </div>

          {/* Fee Tier */}
          <div>
            <select
              value={feeTierFilter}
              onChange={(e) => setFeeTierFilter(e.target.value)}
              className="w-full rounded-xl border-2 border-black bg-white py-2 px-3 text-black font-bold shadow-[2.5px_2.5px_0px_0px_#000] focus:outline-none"
            >
              <option value="All">Tuition: Any Budget</option>
              <option value="free">Tuition-Free / &lt; €650/yr</option>
              <option value="under-3500">Under €3,500/yr</option>
              <option value="under-7000">Under €7,000/yr</option>
              <option value="under-15000">Under €15,000/yr</option>
            </select>
          </div>
        </div>

        {/* Status Count & Active Filters Indicator */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-zinc-700 font-bold">
          <div className="flex items-center gap-2">
            <span>
              Showing <strong className="text-black font-mono font-black">{filteredAndScoredPrograms.length}</strong> accredited programs
            </span>
            {(countryFilter !== 'All' || degreeFilter !== 'All' || fieldFilter !== 'All' || feeTierFilter !== 'All' || searchQuery) && (
              <button
                onClick={() => {
                  setCountryFilter('All');
                  setDegreeFilter('All');
                  setFieldFilter('All');
                  setFeeTierFilter('All');
                  setSearchQuery('');
                }}
                className="underline text-black font-black hover:text-rose-600 ml-1"
              >
                Reset filters
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 font-mono text-[10px]">
            <span>Viewing rates for:</span>
            <span className="rounded-md border border-black bg-[#BAE6FD] px-2 py-0.5 text-black font-extrabold shadow-[1px_1px_0px_0px_#000]">
              {isEuCitizen ? 'EU/EEA Citizen' : 'Non-EU International'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Results Presentation */}
      {filteredAndScoredPrograms.length === 0 ? (
        <div className="mt-12 rounded-xl border-2 border-black bg-white p-12 text-center shadow-[4px_4px_0px_0px_#000]">
          <Building2 className="mx-auto h-10 w-10 text-black stroke-[2.5]" />
          <h3 className="mt-3 text-base font-black text-black font-display">No exact program matches found</h3>
          <p className="mt-1 text-xs text-zinc-600 max-w-md mx-auto font-medium">
            Try adjusting your tuition ceiling or resetting filters to browse opportunities across Germany, Netherlands, Sweden, France, Poland, and more.
          </p>
          <button
            onClick={() => {
              setCountryFilter('All');
              setDegreeFilter('All');
              setFieldFilter('All');
              setFeeTierFilter('All');
              setSearchQuery('');
            }}
            className="mt-4 rounded-xl border-2 border-black bg-[#FFE600] px-5 py-2.5 text-xs font-black text-black shadow-[3px_3px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
          >
            Show All European Programs
          </button>
        </div>
      ) : viewMode === 'table' ? (
        /* COMPACT TABLE VIEW */
        <div className="mt-6 overflow-x-auto rounded-xl border-2 border-black bg-white shadow-[4px_4px_0px_0px_#000]">
          <table className="w-full text-left text-xs text-black">
            <thead className="border-b-2 border-black bg-[#FAF7F0] text-[11px] font-mono font-black uppercase tracking-wider text-black">
              <tr>
                <th className="py-3 px-4">Program & University</th>
                <th className="py-3 px-3">Country</th>
                <th className="py-3 px-3">Degree</th>
                <th className="py-3 px-3">Duration / ECTS</th>
                <th className="py-3 px-3">Annual Tuition</th>
                <th className="py-3 px-3">Deadline</th>
                <th className="py-3 px-3">Match</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-black font-sans">
              {filteredAndScoredPrograms.map(({ program, breakdown, tuition }) => {
                const isSaved = savedProgramIds.includes(program.id);
                const isCompared = comparedProgramIds.includes(program.id);

                return (
                  <tr key={program.id} className="hover:bg-[#FEF08A]/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-extrabold text-black font-display text-sm">{program.name}</div>
                      <div className="text-[11px] text-zinc-700 font-medium">
                        {program.institutionName} • <span className="text-zinc-600">{program.institutionCity}</span>
                      </div>
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="font-mono text-[11px] font-bold text-black">{program.country}</span>
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="rounded border border-black bg-[#BAE6FD] px-2 py-0.5 text-[10px] font-mono font-black text-black shadow-[1px_1px_0px_0px_#000]">
                        {program.degreeLevel}
                      </span>
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap font-mono text-[11px] font-bold text-black">
                      {program.durationYears}y • {program.ectsCredits} ECTS
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="font-mono font-black text-black">
                        €{tuition.toLocaleString()}/yr
                      </div>
                      <div className="text-[10px] font-bold text-zinc-600">
                        {tuition <= 650 ? 'Tuition-Free' : 'Statutory fee'}
                      </div>
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap text-black font-bold text-[11px]">
                      {program.applicationDeadline}
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      <span
                        className={`inline-block font-mono text-[11px] font-black px-2.5 py-0.5 rounded border-2 border-black shadow-[1.5px_1.5px_0px_0px_#000] ${
                          breakdown.totalScore >= 80
                            ? 'text-black bg-[#A7F3D0]'
                            : breakdown.totalScore >= 65
                            ? 'text-black bg-[#FEF08A]'
                            : 'text-black bg-[#E2E8F0]'
                        }`}
                      >
                        {breakdown.totalScore}%
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap space-x-2">
                      <button
                        onClick={() => setSelectedProgramModal(program)}
                        className="rounded-lg border-2 border-black bg-white px-2.5 py-1 text-[11px] font-black text-black hover:bg-[#FFE600] shadow-[2px_2px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                      >
                        Syllabus
                      </button>

                      <button
                        onClick={() => onToggleCompareProgram(program.id)}
                        className={`rounded-lg px-2.5 py-1 text-[11px] font-black transition-all border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 ${
                          isCompared
                            ? 'bg-[#FFE600] text-black'
                            : 'bg-white text-black hover:bg-[#DDD6FE]'
                        }`}
                      >
                        {isCompared ? 'Compared' : 'Compare'}
                      </button>

                      <button
                        onClick={() => onToggleSaveProgram(program.id)}
                        className={`rounded-lg p-1.5 text-[11px] transition-all inline-flex items-center border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 ${
                          isSaved
                            ? 'text-black bg-[#FECDD3]'
                            : 'text-black bg-white hover:bg-[#FED7AA]'
                        }`}
                        title={isSaved ? 'Remove from saved' : 'Save program'}
                      >
                        {isSaved ? <BookmarkCheck className="h-3.5 w-3.5 stroke-[2.5]" /> : <Bookmark className="h-3.5 w-3.5 stroke-[2.5]" />}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* MINIMAL EDITORIAL GRID VIEW */
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {filteredAndScoredPrograms.map(({ program, breakdown, tuition }) => {
            const isSaved = savedProgramIds.includes(program.id);
            const isCompared = comparedProgramIds.includes(program.id);

            return (
              <div
                key={program.id}
                className="flex flex-col justify-between rounded-xl border-2 border-black bg-white p-5 shadow-[4px_4px_0px_0px_#000] hover:shadow-[7px_7px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
              >
                <div>
                  {/* Top Metadata Bar */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono font-black">
                        <span className="rounded border-2 border-black bg-[#BAE6FD] px-2 py-0.5 text-black shadow-[1px_1px_0px_0px_#000]">
                          {program.country}
                        </span>
                        <span className="rounded border-2 border-black bg-[#FEF08A] px-2 py-0.5 text-black shadow-[1px_1px_0px_0px_#000]">
                          {program.institutionCity}
                        </span>
                        <span className="rounded border-2 border-black bg-[#FBCFE8] px-2 py-0.5 text-black shadow-[1px_1px_0px_0px_#000]">
                          {program.degreeLevel}
                        </span>
                        <span className="rounded border-2 border-black bg-[#E2E8F0] px-2 py-0.5 text-black shadow-[1px_1px_0px_0px_#000]">
                          {program.language}
                        </span>
                      </div>

                      <h3 className="mt-2.5 text-base sm:text-lg font-black tracking-tight text-black leading-snug font-display">
                        {program.name}
                      </h3>
                      <div className="mt-0.5 text-xs text-zinc-700 font-bold">
                        {program.institutionName}
                      </div>
                    </div>

                    {/* Match Indicator */}
                    <div className="shrink-0 text-right">
                      <div
                        className={`inline-flex items-center gap-1 rounded-xl px-2.5 py-1 text-xs font-mono font-black border-2 border-black shadow-[2px_2px_0px_0px_#000] ${
                          breakdown.totalScore >= 80
                            ? 'bg-[#A7F3D0] text-black'
                            : breakdown.totalScore >= 65
                            ? 'bg-[#FEF08A] text-black'
                            : 'bg-[#E2E8F0] text-black'
                        }`}
                      >
                        <span>{breakdown.totalScore}%</span>
                        <span className="text-[10px] font-black font-sans">Match</span>
                      </div>
                    </div>
                  </div>

                  {/* Clean Specification Grid */}
                  <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl border-2 border-black bg-[#FAF7F0] p-3 text-xs font-mono shadow-[2px_2px_0px_0px_#000]">
                    <div>
                      <div className="text-[10px] font-black uppercase text-zinc-600">Tuition</div>
                      <div className="mt-0.5 font-black text-black text-sm">
                        €{tuition.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-zinc-700 font-bold font-sans">
                        {tuition <= 650 ? 'Tuition-Free' : isEuCitizen ? 'EU Rate' : 'Non-EU Rate'}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] font-black uppercase text-zinc-600">Duration & ECTS</div>
                      <div className="mt-0.5 font-black text-black text-sm">
                        {program.durationYears} Years
                      </div>
                      <div className="text-[10px] text-zinc-700 font-bold">
                        {program.ectsCredits} ECTS
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] font-black uppercase text-zinc-600">Deadline</div>
                      <div className="mt-0.5 font-black text-black">
                        {program.applicationDeadline}
                      </div>
                      <div className="text-[10px] text-zinc-700 font-bold font-sans">
                        {program.intakeStarts}
                      </div>
                    </div>
                  </div>

                  {/* Match Evaluation Snippet */}
                  <div className="mt-3.5 space-y-1 text-[11px]">
                    {breakdown.reasons.slice(0, 2).map((reason, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-zinc-800 font-medium">
                        <CheckCircle2 className="h-3.5 w-3.5 text-black stroke-[2.5] shrink-0" />
                        <span className="truncate">{reason}</span>
                      </div>
                    ))}
                    {breakdown.warnings.length > 0 && (
                      <div className="flex items-center gap-1.5 text-amber-900 font-bold bg-[#FEF3C7] px-1.5 py-0.5 rounded border border-black">
                        <AlertTriangle className="h-3.5 w-3.5 text-black stroke-[2.5] shrink-0" />
                        <span className="truncate">{breakdown.warnings[0]}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Action Strip */}
                <div className="mt-5 pt-3.5 border-t-2 border-black flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedProgramModal(program)}
                    className="flex-1 inline-flex items-center justify-center gap-1 rounded-xl border-2 border-black bg-white py-2 text-xs font-black text-black shadow-[2.5px_2.5px_0px_0px_#000] hover:bg-[#FFE600] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                  >
                    <Info className="h-3.5 w-3.5 stroke-[2.5]" />
                    <span>Syllabus & Details</span>
                  </button>

                  <button
                    onClick={() => onToggleCompareProgram(program.id)}
                    className={`inline-flex items-center justify-center gap-1 rounded-xl px-3.5 py-2 text-xs font-black transition-all border-2 border-black shadow-[2.5px_2.5px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 ${
                      isCompared
                        ? 'bg-[#FFE600] text-black'
                        : 'bg-[#DDD6FE] text-black hover:bg-violet-300'
                    }`}
                  >
                    <Scale className="h-3.5 w-3.5 stroke-[2.5]" />
                    <span>{isCompared ? 'Comparing' : 'Compare'}</span>
                  </button>

                  <button
                    onClick={() => onToggleSaveProgram(program.id)}
                    className={`inline-flex items-center justify-center rounded-xl p-2 text-xs transition-all border-2 border-black shadow-[2.5px_2.5px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 ${
                      isSaved
                        ? 'bg-[#FECDD3] text-black'
                        : 'bg-white hover:bg-[#FED7AA] text-black'
                    }`}
                    title={isSaved ? 'Remove from saved' : 'Save to My Pathway'}
                  >
                    {isSaved ? <BookmarkCheck className="h-4 w-4 stroke-[2.5]" /> : <Bookmark className="h-4 w-4 stroke-[2.5]" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Program Detail Modal */}
      {selectedProgramModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border-2 border-black bg-white p-6 shadow-[8px_8px_0px_0px_#000] text-black">
            {/* Header */}
            <div className="flex items-start justify-between border-b-2 border-black pb-4">
              <div>
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-black">
                  <span className="rounded-md border-2 border-black bg-[#BAE6FD] px-2 py-0.5 shadow-[1px_1px_0px_0px_#000]">
                    {selectedProgramModal.country}
                  </span>
                  <span>{selectedProgramModal.institutionCity}</span>
                  <span>•</span>
                  <span className="rounded-md border-2 border-black bg-[#FBCFE8] px-2 py-0.5 shadow-[1px_1px_0px_0px_#000]">{selectedProgramModal.degreeLevel}</span>
                </div>
                <h2 className="mt-2.5 text-xl sm:text-2xl font-black text-black font-display">
                  {selectedProgramModal.name}
                </h2>
                <div className="text-xs text-zinc-700 font-bold mt-1">
                  {selectedProgramModal.institutionName}
                </div>
              </div>

              <button
                onClick={() => setSelectedProgramModal(null)}
                className="rounded-xl border-2 border-black bg-white p-1.5 text-black shadow-[2px_2px_0px_0px_#000] hover:bg-[#FECDD3] transition-all"
              >
                <X className="h-5 w-5 stroke-[2.5]" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="mt-4 space-y-5 text-xs text-zinc-900">
              {/* Stat Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 rounded-xl border-2 border-black bg-[#FAF7F0] p-3.5 font-mono shadow-[2px_2px_0px_0px_#000]">
                <div>
                  <span className="text-[10px] text-zinc-600 uppercase font-black">EU/EEA Tuition</span>
                  <div className="font-black text-black text-sm">€{selectedProgramModal.euTuitionEurAnnual.toLocaleString()}/yr</div>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-600 uppercase font-black">Non-EU Tuition</span>
                  <div className="font-black text-black text-sm">€{selectedProgramModal.nonEuTuitionEurAnnual.toLocaleString()}/yr</div>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-600 uppercase font-black">Credits</span>
                  <div className="font-black text-black text-sm">{selectedProgramModal.ectsCredits} ECTS</div>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-600 uppercase font-black">Language</span>
                  <div className="font-black text-black text-sm">{selectedProgramModal.language}</div>
                </div>
              </div>

              {/* Curriculum Overview */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-black font-mono">
                  Curriculum & Technical Syllabus
                </h4>
                <p className="mt-1.5 text-zinc-800 leading-relaxed font-medium">
                  {selectedProgramModal.curriculumSummary}
                </p>
              </div>

              {/* Skills & Competencies */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-black font-mono">
                  Core Engineering Competencies
                </h4>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {selectedProgramModal.skillsTaught.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-md border-2 border-black bg-[#FEF08A] px-2.5 py-1 font-mono text-[11px] font-black text-black shadow-[1.5px_1.5px_0px_0px_#000]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Admission Requirements & Required Documents */}
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-black font-mono">
                  Application Requirements & Checklist
                </h4>
                <div className="rounded-xl border-2 border-black bg-[#FAF7F0] p-3.5 space-y-2 shadow-[2px_2px_0px_0px_#000]">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-zinc-600">English Standard:</span>
                    <span className="font-mono text-black font-black">{selectedProgramModal.englishRequirement}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-zinc-600">Minimum Academic Benchmark:</span>
                    <span className="font-mono text-black font-black">{selectedProgramModal.academicMinPercentage}%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-zinc-600">Application Deadline:</span>
                    <span className="font-mono text-black font-black">{selectedProgramModal.applicationDeadline}</span>
                  </div>
                </div>

                <div className="mt-2.5">
                  <span className="text-[11px] font-black text-black uppercase">Required Dossier Documents:</span>
                  <ul className="mt-1 space-y-1 text-[11px] text-zinc-800 list-disc list-inside font-medium">
                    {selectedProgramModal.requiredDocuments.map((doc, i) => (
                      <li key={i}>{doc}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Verified Provenance */}
              <div className="rounded-xl border-2 border-black bg-[#CCFBF1] p-3 text-[11px] font-mono text-black flex items-center justify-between shadow-[2px_2px_0px_0px_#000]">
                <div>
                  <div className="font-black">Register Identifier: {selectedProgramModal.openDatasetRegisterId}</div>
                  <div className="text-zinc-700 font-bold">Verified under: {selectedProgramModal.sourceLicense}</div>
                </div>
                <div className="text-black font-black uppercase bg-white px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_0px_#000]">Status: Verified</div>
              </div>

              {/* Modal Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t-2 border-black">
                <a
                  href={selectedProgramModal.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl border-2 border-black bg-[#FFE600] px-4 py-2.5 text-xs font-black text-black shadow-[3px_3px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                >
                  <span>Official University Portal</span>
                  <ExternalLink className="h-4 w-4 stroke-[2.5]" />
                </a>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onToggleSaveProgram(selectedProgramModal.id);
                    }}
                    className="rounded-xl border-2 border-black bg-white px-4 py-2.5 text-xs font-black text-black shadow-[3px_3px_0px_0px_#000] hover:bg-[#FED7AA] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                  >
                    {savedProgramIds.includes(selectedProgramModal.id) ? '✓ Saved in Pathway' : 'Bookmark Program'}
                  </button>

                  <button
                    onClick={() => {
                      onNavigateToFunding(selectedProgramModal.id);
                      setSelectedProgramModal(null);
                    }}
                    className="rounded-xl border-2 border-black bg-[#DDD6FE] hover:bg-violet-300 px-4 py-2.5 text-xs font-black text-black shadow-[3px_3px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                  >
                    Cost & Funding Audit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
