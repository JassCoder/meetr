import React from 'react';
import { 
  Compass, 
  Sparkles, 
  GraduationCap, 
  Scale, 
  Calculator, 
  Plane, 
  Bookmark, 
  ShieldCheck,
  User,
  ExternalLink
} from 'lucide-react';
import { UserProfileState } from '../types';

export type ActiveTab = 'advisor' | 'careers' | 'programs' | 'compare' | 'funding' | 'mobility' | 'saved';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  profile: UserProfileState;
  onOpenProfileModal: () => void;
  savedProgramsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  profile,
  onOpenProfileModal,
  savedProgramsCount,
}) => {
  const navItems = [
    { id: 'advisor' as ActiveTab, label: 'AI Advisor', icon: Sparkles, badge: 'Smart' },
    { id: 'careers' as ActiveTab, label: 'Career Discovery', icon: Compass },
    { id: 'programs' as ActiveTab, label: 'EU Degree Programs', icon: GraduationCap, badge: 'Open Data' },
    { id: 'compare' as ActiveTab, label: 'Match & Compare', icon: Scale },
    { id: 'funding' as ActiveTab, label: 'Eligibility & Funding', icon: Calculator },
    { id: 'mobility' as ActiveTab, label: 'EU Mobility & Visas', icon: Plane },
    { id: 'saved' as ActiveTab, label: 'My Saved Pathway', icon: Bookmark, count: savedProgramsCount },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      {/* Top Banner: Market & Open EU Provenance Indicator */}
      <div className="flex items-center justify-between border-b border-slate-800/60 bg-slate-900/60 px-4 py-1.5 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 font-medium text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live EU Open Datasets: Germany • Netherlands • Sweden • France • Finland • Ireland • Poland • Estonia
          </span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="hidden lg:inline text-slate-400">Grounding across European Tertiary Education Register (ETER) & national open catalogs</span>
        </div>
        <div className="flex items-center gap-3">
          <a 
            href="https://data.europa.eu" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-1 hover:text-blue-400 transition-colors"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-blue-400" />
            <span>EU Open Data Verified</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActiveTab('advisor')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Compass className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-white">MEETR</span>
                <span className="rounded bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-blue-400 border border-blue-500/20">
                  EU OPEN DATA
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium tracking-wide">
                Career, European Higher Education & Mobility Engine
              </p>
            </div>
          </button>
        </div>

        {/* Profile Pill Summary */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenProfileModal}
            className="hidden md:flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/80 px-3.5 py-1.5 text-xs text-slate-300 hover:border-slate-700 hover:bg-slate-800/80 transition-all shadow-sm"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
              <User className="h-3.5 w-3.5" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2 font-medium text-white">
                <span>{profile.educationLevel}</span>
                <span className="text-slate-500">•</span>
                <span className="text-blue-400 font-semibold">{profile.highSchoolPercentage}%</span>
              </div>
              <div className="text-[11px] text-slate-400">
                Budget: €{profile.annualBudgetEur.toLocaleString()}/yr • {profile.preferredCity || 'Poland'}
              </div>
            </div>
            <span className="ml-1 rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400">
              Edit
            </span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-t border-slate-800/80 bg-slate-950/70 px-4 sm:px-6">
        <div className="mx-auto flex max-w-7xl space-x-1 overflow-x-auto py-2 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`rounded px-1.5 py-0.2 text-[9px] font-bold ${
                    item.badge === 'Smart' 
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {item.badge}
                  </span>
                )}
                {typeof item.count === 'number' && item.count > 0 && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
