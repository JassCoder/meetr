import React from 'react';
import { 
  Menu, 
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

export type ActiveTab = 'programs' | 'careers' | 'compare' | 'funding' | 'mobility' | 'saved';

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
  programs: { title: 'Verified EU Degree Programs', icon: GraduationCap },
  careers: { title: 'European Career Discovery', icon: Compass },
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
    <header className="sticky top-0 z-20 w-full border-b-2 border-black bg-[#FBF9F4]/95 backdrop-blur-md">
      {/* Top Banner: Market & Open EU Provenance Indicator */}
      <div className="hidden sm:flex items-center justify-between border-b-2 border-black bg-[#FFE600] px-4 py-1.5 text-xs text-black font-bold">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 font-black uppercase text-[11px] tracking-wide">
            <span className="h-2 w-2 rounded-full bg-black animate-ping" />
            Live EU Open Datasets Verified
          </span>
          <span className="text-black font-black">•</span>
          <span className="text-black font-medium">Germany • Netherlands • Sweden • France • Finland • Ireland • Poland • Estonia</span>
        </div>
        <div className="flex items-center gap-3">
          <a 
            href="https://data.europa.eu" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-black shadow-[1.5px_1.5px_0px_0px_#000] hover:bg-black hover:text-white transition-all text-[11px] font-bold"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Official EU Open Data</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

      {/* Main Bar */}
      <div className="flex items-center justify-between px-4 py-3 sm:px-6 bg-[#FAF7F0]">
        {/* Left: Mobile hamburger & Active View Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileNav}
            className="lg:hidden flex h-10 w-10 items-center justify-center rounded-xl border-2 border-black bg-white text-black shadow-[3px_3px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1.5px_1.5px_0px_0px_#000] transition-all"
            title="Open navigation bar"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFE600] text-black border-2 border-black shadow-[2.5px_2.5px_0px_0px_#000]">
              <CurrentIcon className="h-5 w-5 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-base font-black text-black tracking-tight leading-tight uppercase font-display">
                {currentTitle}
              </h1>
              <div className="flex items-center gap-1.5 text-xs text-zinc-700 font-semibold mt-0.5">
                <span>Destination Focus:</span>
                <span className="bg-[#BAE6FD] text-black px-1.5 py-0.2 rounded border border-black shadow-[1px_1px_0px_0px_#000] font-bold text-[11px]">
                  {displayCountry}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Quick User Summary & Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* User badge pill */}
          <button
            onClick={onOpenProfileModal}
            className="flex items-center gap-2 rounded-xl border-2 border-black bg-white px-3.5 py-1.5 text-xs text-black font-bold shadow-[3px_3px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1.5px_1.5px_0px_0px_#000] transition-all"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#A7F3D0] text-black font-black border border-black text-xs shadow-[1px_1px_0px_0px_#000]">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block text-left">
              <div className="font-extrabold text-black truncate max-w-[120px]">
                {displayName}
              </div>
              <div className="text-[10px] text-zinc-600 font-mono font-semibold">
                {profile.highSchoolPercentage}% • €{profile.annualBudgetEur.toLocaleString()}/yr
              </div>
            </div>
          </button>

          {/* Switch Account / Reopen Questionnaire Button */}
          <button
            onClick={onLogOut}
            title="Log out or switch questionnaire profile"
            className="flex items-center gap-1.5 rounded-xl border-2 border-black bg-[#FECDD3] px-3 py-1.5 text-xs font-bold text-black shadow-[2.5px_2.5px_0px_0px_#000] hover:bg-rose-300 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_#000] transition-all"
          >
            <LogOut className="h-3.5 w-3.5 stroke-[2.5]" />
            <span className="hidden md:inline text-[11px] uppercase font-black">Switch Profile</span>
          </button>
        </div>
      </div>
    </header>
  );
};
