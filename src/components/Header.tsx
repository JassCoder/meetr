import React from 'react';
import { 
  Menu, 
  Sparkles, 
  ShieldCheck, 
  ExternalLink,
  Compass,
  GraduationCap,
  Scale,
  Calculator,
  Plane,
  Bookmark,
  LogOut
} from 'lucide-react';
import { UserProfileState, AuthUserState } from '../types';

export type ActiveTab = 'advisor' | 'careers' | 'programs' | 'compare' | 'funding' | 'mobility' | 'saved';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  profile: UserProfileState;
  authUser: AuthUserState | null;
  onOpenProfileModal: () => void;
  onToggleMobileNav: () => void;
  onLogOut: () => void;
  savedProgramsCount: number;
}

const TAB_INFO: Record<ActiveTab, { title: string; icon: React.ComponentType<{ className?: string }> }> = {
  advisor: { title: 'AI Advisor & Pathway Engine', icon: Sparkles },
  careers: { title: 'European Career Discovery', icon: Compass },
  programs: { title: 'Verified EU Degree Programs', icon: GraduationCap },
  compare: { title: 'Program Matching & Comparison', icon: Scale },
  funding: { title: 'Eligibility & Living Cost Calculator', icon: Calculator },
  mobility: { title: 'EU Mobility, Visas & Work Rights', icon: Plane },
  saved: { title: 'My Saved European Pathway', icon: Bookmark },
};

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  profile,
  authUser,
  onOpenProfileModal,
  onToggleMobileNav,
  onLogOut,
}) => {
  const CurrentIcon = TAB_INFO[activeTab].icon;
  const currentTitle = TAB_INFO[activeTab].title;
  const displayName = authUser?.name || profile.name || 'Student';
  const displayCountry = authUser?.preferredCountry || profile.preferredCountry || 'Germany';

  return (
    <header className="sticky top-0 z-20 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      {/* Top Banner: Market & Open EU Provenance Indicator */}
      <div className="hidden sm:flex items-center justify-between border-b border-slate-800/60 bg-slate-900/60 px-4 py-1.5 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 font-medium text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live EU Open Datasets: Germany • Netherlands • Sweden • France • Finland • Ireland • Poland • Estonia
          </span>
          <span className="text-slate-600 hidden md:inline">•</span>
          <span className="hidden xl:inline text-slate-400">Grounding across European Tertiary Education Register (ETER) & national open catalogs</span>
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

      {/* Main Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 sm:px-6">
        {/* Left: Mobile hamburger & Active View Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileNav}
            className="lg:hidden flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title="Open navigation bar"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/20">
              <CurrentIcon className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-tight leading-tight">
                {currentTitle}
              </h1>
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <span>Destination focus:</span>
                <span className="text-blue-400 font-semibold">{displayCountry}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right: Quick User Summary & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* User badge pill */}
          <button
            onClick={onOpenProfileModal}
            className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs text-slate-300 hover:border-slate-700 hover:bg-slate-800 transition-all shadow-sm"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 font-bold text-[11px]">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block text-left">
              <div className="font-semibold text-white truncate max-w-[120px]">
                {displayName}
              </div>
              <div className="text-[10px] text-slate-400">
                {profile.highSchoolPercentage}% • €{profile.annualBudgetEur.toLocaleString()}/yr
              </div>
            </div>
          </button>

          {/* Switch Account / Reopen Questionnaire Button */}
          <button
            onClick={onLogOut}
            title="Log out or switch questionnaire profile"
            className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/60 px-2.5 py-1.5 text-xs text-slate-400 hover:text-rose-300 hover:border-rose-900/40 hover:bg-rose-950/20 transition-all"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden md:inline text-[11px]">Log Out</span>
          </button>
        </div>
      </div>
    </header>
  );
};
