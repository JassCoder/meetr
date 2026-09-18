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
  LogOut, 
  ExternalLink,
  Settings,
  X,
  ChevronRight,
  Globe
} from 'lucide-react';
import { UserProfileState, AuthUserState } from '../types';

export type ActiveTab = 'advisor' | 'careers' | 'programs' | 'compare' | 'funding' | 'mobility' | 'saved';

interface SideNavBarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  profile: UserProfileState;
  authUser: AuthUserState | null;
  onOpenProfileModal: () => void;
  onLogOut: () => void;
  savedProgramsCount: number;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onSelectCountry?: (country: string) => void;
}

const EU_DESTINATIONS = [
  { name: 'Germany', flag: '🇩🇪' },
  { name: 'Netherlands', flag: '🇳🇱' },
  { name: 'Sweden', flag: '🇸🇪' },
  { name: 'Finland', flag: '🇫🇮' },
  { name: 'France', flag: '🇫🇷' },
  { name: 'Ireland', flag: '🇮🇪' },
  { name: 'Poland', flag: '🇵🇱' },
  { name: 'Estonia', flag: '🇪🇪' },
];

export const SideNavBar: React.FC<SideNavBarProps> = ({
  activeTab,
  setActiveTab,
  profile,
  authUser,
  onOpenProfileModal,
  onLogOut,
  savedProgramsCount,
  isOpenMobile,
  onCloseMobile,
  onSelectCountry,
}) => {
  const navItems = [
    { id: 'advisor' as ActiveTab, label: 'AI Advisor', icon: Sparkles, badge: 'Smart', description: 'Interactive pathway reasoning' },
    { id: 'careers' as ActiveTab, label: 'Career Discovery', icon: Compass, description: 'European tech roles & salaries' },
    { id: 'programs' as ActiveTab, label: 'EU Degree Programs', icon: GraduationCap, badge: 'Open Data', description: 'Bologna ECTS degree catalog' },
    { id: 'compare' as ActiveTab, label: 'Match & Compare', icon: Scale, description: 'Side-by-side curriculum matrix' },
    { id: 'funding' as ActiveTab, label: 'Eligibility & Funding', icon: Calculator, description: 'Tuition & living expenses audit' },
    { id: 'mobility' as ActiveTab, label: 'EU Mobility & Visas', icon: Plane, description: 'Directive 2016/801 work rights' },
    { id: 'saved' as ActiveTab, label: 'My Saved Pathway', icon: Bookmark, count: savedProgramsCount, description: 'Bookmarked programs' },
  ];

  const displayName = authUser?.name || profile.name || 'Student Explorer';
  const displayEmail = authUser?.email || profile.email || 'student@meetr.eu';
  const displayCountry = authUser?.preferredCountry || profile.preferredCountry || 'Germany';

  const getCountryFlag = (countryName: string) => {
    const found = EU_DESTINATIONS.find(
      (c) => c.name.toLowerCase() === countryName.toLowerCase()
    );
    return found ? found.flag : '🇪🇺';
  };

  const navContent = (
    <div className="flex h-full flex-col justify-between p-4 text-slate-100">
      {/* Top Brand & User Card */}
      <div className="space-y-4">
        {/* Brand Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-md shadow-blue-500/20">
              <Compass className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-tight text-white">MEETR</span>
                <span className="rounded bg-blue-500/10 px-1.5 py-0.2 text-[9px] font-bold text-blue-400 border border-blue-500/20">
                  EU OPEN DATA
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">
                European Mobility Engine
              </p>
            </div>
          </div>

          {/* Close button for mobile */}
          <button
            onClick={onCloseMobile}
            className="lg:hidden rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Profile Card */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-blue-500 to-teal-400 font-bold text-slate-950 text-xs shadow-inner">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate">
                  {displayName}
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  {displayEmail}
                </div>
              </div>
            </div>

            <button
              onClick={onOpenProfileModal}
              title="Tune profile parameters"
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-blue-400 transition-colors"
            >
              <Settings className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-2.5 flex items-center justify-between border-t border-slate-800/80 pt-2 text-[11px]">
            <div className="flex items-center gap-1 text-slate-300">
              <span>{getCountryFlag(displayCountry)}</span>
              <span className="font-semibold">{displayCountry}</span>
            </div>
            <span className="rounded bg-blue-500/15 px-1.5 py-0.5 text-[10px] font-medium text-blue-300">
              Budget: €{profile.annualBudgetEur.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Navigation Section */}
        <div>
          <div className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Navigation Menu
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    onCloseMobile();
                  }}
                  className={`group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/20'
                      : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`h-4 w-4 transition-colors ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {item.badge && (
                      <span
                        className={`rounded px-1.5 py-0.2 text-[9px] font-bold ${
                          isActive
                            ? 'bg-blue-700/80 text-white'
                            : item.badge === 'Smart'
                            ? 'bg-purple-500/20 text-purple-300'
                            : 'bg-emerald-500/20 text-emerald-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}

                    {typeof item.count === 'number' && item.count > 0 && (
                      <span
                        className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold ${
                          isActive
                            ? 'bg-white text-blue-700'
                            : 'bg-blue-600 text-white'
                        }`}
                      >
                        {item.count}
                      </span>
                    )}

                    <ChevronRight
                      className={`h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity ${
                        isActive ? 'opacity-100 text-white' : 'text-slate-400'
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Quick Country Switcher */}
        {onSelectCountry && (
          <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-2.5">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              <Globe className="h-3 w-3 text-blue-400" />
              <span>Switch Country Focus</span>
            </div>
            <div className="grid grid-cols-2 gap-1 text-[11px]">
              {EU_DESTINATIONS.slice(0, 6).map((dest) => (
                <button
                  key={dest.name}
                  onClick={() => onSelectCountry(dest.name)}
                  className={`flex items-center gap-1 rounded-lg px-2 py-1 transition-colors ${
                    displayCountry.toLowerCase() === dest.name.toLowerCase()
                      ? 'bg-blue-600/20 text-blue-300 font-semibold border border-blue-500/30'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <span>{dest.flag}</span>
                  <span className="truncate">{dest.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Footer & Log Out */}
      <div className="space-y-3 pt-4 border-t border-slate-800/80">
        {/* Open Data Provenance Status */}
        <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-2.5 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>ETER & EU Open Data Live</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500">
            <span>Directive 2016/801</span>
            <a
              href="https://data.europa.eu"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-0.5 text-blue-400 hover:underline"
            >
              <ShieldCheck className="h-3 w-3" />
              <span>Official</span>
              <ExternalLink className="h-2.5 w-2.5" />
            </a>
          </div>
        </div>

        {/* Log Out / Switch User Action */}
        <button
          onClick={onLogOut}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-rose-950/30 hover:border-rose-800/50 hover:text-rose-300 py-2 text-xs font-semibold text-slate-400 transition-colors"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Switch Account / Questionnaire</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex w-64 xl:w-72 shrink-0 border-r border-slate-800 bg-slate-950 sticky top-0 h-screen overflow-y-auto no-scrollbar z-30">
        {navContent}
      </aside>

      {/* Mobile Slide-in Drawer */}
      {isOpenMobile && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop blur */}
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          {/* Drawer content */}
          <div className="relative w-72 max-w-[80vw] bg-slate-950 border-r border-slate-800 h-full overflow-y-auto shadow-2xl z-10 animate-fade-in">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};
