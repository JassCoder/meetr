import React from 'react';
import { 
  Compass, 
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
import { CAREERS_DATA } from '../data/careersData';

export type ActiveTab = 'programs' | 'careers' | 'compare' | 'funding' | 'mobility' | 'saved';

interface SideNavBarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  profile: UserProfileState;
  authUser: AuthUserState | null;
  onOpenProfileModal: () => void;
  onLogOut: () => void;
  onClearGoal?: () => void;
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
  onClearGoal,
  savedProgramsCount,
  isOpenMobile,
  onCloseMobile,
  onSelectCountry,
}) => {
  const navItems = [
    { id: 'programs' as ActiveTab, label: 'EU Degree Programs', icon: GraduationCap, badge: 'Verified', description: 'Bologna ECTS degree catalog' },
    { id: 'careers' as ActiveTab, label: 'Career Discovery', icon: Compass, description: 'Tech, creative & engineering roles' },
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
    <div className="flex h-full flex-col justify-between p-4 text-black bg-[#FAF7F0]">
      {/* Top Brand & User Card */}
      <div className="space-y-4">
        {/* Brand Header */}
        <div className="flex items-center justify-between border-b-2 border-black pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFE600] border-2 border-black shadow-[3px_3px_0px_0px_#000]">
              <Compass className="h-5 w-5 text-black stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-black font-display">MEETR</span>
                <span className="rounded bg-[#BAE6FD] px-1.5 py-0.2 text-[9px] font-black text-black border border-black shadow-[1px_1px_0px_0px_#000]">
                  EU OPEN DATA
                </span>
              </div>
              <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-wide">
                European Mobility Engine
              </p>
            </div>
          </div>

          {/* Close button for mobile */}
          <button
            onClick={onCloseMobile}
            className="lg:hidden rounded-lg p-1.5 text-black border-2 border-black bg-white shadow-[2px_2px_0px_0px_#000] hover:bg-black hover:text-white transition-all"
          >
            <X className="h-5 w-5 stroke-[2.5]" />
          </button>
        </div>

        {/* User Profile Card */}
        <div className="rounded-xl border-2 border-black bg-white p-3.5 shadow-[4px_4px_0px_0px_#000]">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#A7F3D0] font-black text-black text-sm border-2 border-black shadow-[1.5px_1.5px_0px_0px_#000]">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-black text-black truncate font-display">
                  {displayName}
                </div>
                <div className="text-[11px] text-zinc-600 truncate font-medium">
                  {displayEmail}
                </div>
              </div>
            </div>

            <button
              onClick={onOpenProfileModal}
              title="Tune profile parameters"
              className="rounded-lg p-1.5 text-black bg-[#F5F2EB] border-2 border-black shadow-[1.5px_1.5px_0px_0px_#000] hover:bg-[#FFE600] transition-all"
            >
              <Settings className="h-4 w-4 stroke-[2.5]" />
            </button>
          </div>

          <div className="mt-3 flex items-center justify-between border-t-2 border-black pt-2 text-[11px]">
            <div className="flex items-center gap-1.5 font-bold text-black">
              <span>{getCountryFlag(displayCountry)}</span>
              <span>{displayCountry}</span>
            </div>
            <span className="rounded bg-[#FEF08A] px-2 py-0.5 text-[10px] font-extrabold text-black border border-black shadow-[1px_1px_0px_0px_#000]">
              Budget: €{profile.annualBudgetEur.toLocaleString()}/yr
            </span>
          </div>

          {/* Target Career Goal & Clear Goal Action */}
          <div className="mt-2.5 pt-2 border-t-2 border-black">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-zinc-600 font-bold">Target Goal:</span>
              {profile.targetCareerId ? (
                <div className="flex items-center gap-1 max-w-[150px]">
                  <span className="font-extrabold text-black bg-[#FED7AA] px-1.5 py-0.5 rounded border border-black text-[10px] truncate" title={profile.targetCareerId}>
                    {CAREERS_DATA.find((c) => c.id === profile.targetCareerId)?.title || profile.targetCareerId}
                  </span>
                  {onClearGoal && (
                    <button
                      onClick={onClearGoal}
                      title="Set No Goal (Clear target goal)"
                      className="rounded bg-rose-200 border border-black p-0.5 hover:bg-rose-400 transition-colors"
                    >
                      <X className="h-3 w-3 stroke-[2.5]" />
                    </button>
                  )}
                </div>
              ) : (
                <span className="bg-[#E2E8F0] px-1.5 py-0.5 rounded border border-black text-[10px] font-bold text-zinc-700">No Goal (Open)</span>
              )}
            </div>
            {profile.targetCareerId && onClearGoal && (
              <button
                onClick={onClearGoal}
                className="mt-2 w-full text-[10px] text-black bg-[#FECDD3] hover:bg-rose-300 border-2 border-black rounded-lg py-1 shadow-[2px_2px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all text-center font-black uppercase tracking-tight"
              >
                ✕ Set No Goal (Explore All)
              </button>
            )}
          </div>
        </div>

        {/* Navigation Section */}
        <div>
          <div className="px-2 pb-1.5 text-[10px] font-black uppercase tracking-wider text-black">
            Navigation Menu
          </div>
          <nav className="space-y-1.5">
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
                  className={`group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-extrabold transition-all ${
                    isActive
                      ? 'bg-[#FFE600] text-black border-2 border-black shadow-[4px_4px_0px_0px_#000] translate-x-1'
                      : 'bg-white text-zinc-800 border-2 border-black shadow-[2.5px_2.5px_0px_0px_#000] hover:bg-[#FAF7F0] hover:shadow-[3.5px_3.5px_0px_0px_#000] hover:translate-x-0.5'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`h-4 w-4 stroke-[2.5] ${
                        isActive ? 'text-black' : 'text-zinc-800 group-hover:text-black'
                      }`}
                    />
                    <span className="font-display">{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {item.badge && (
                      <span
                        className={`rounded px-1.5 py-0.2 text-[9px] font-black border border-black shadow-[1px_1px_0px_0px_#000] ${
                          isActive
                            ? 'bg-white text-black'
                            : 'bg-[#A7F3D0] text-black'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}

                    {typeof item.count === 'number' && item.count > 0 && (
                      <span
                        className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black bg-[#F43F5E] text-white border border-black shadow-[1px_1px_0px_0px_#000]"
                      >
                        {item.count}
                      </span>
                    )}

                    <ChevronRight
                      className={`h-3.5 w-3.5 stroke-[2.5] transition-transform ${
                        isActive ? 'text-black translate-x-0.5' : 'text-zinc-400 group-hover:text-black'
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
          <div className="rounded-xl border-2 border-black bg-white p-2.5 shadow-[3px_3px_0px_0px_#000]">
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-black mb-2">
              <Globe className="h-3.5 w-3.5 text-black stroke-[2.5]" />
              <span>Switch Country Focus</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              {EU_DESTINATIONS.slice(0, 6).map((dest) => {
                const isSelected = displayCountry.toLowerCase() === dest.name.toLowerCase();
                return (
                  <button
                    key={dest.name}
                    onClick={() => onSelectCountry(dest.name)}
                    className={`flex items-center gap-1.5 rounded-lg px-2 py-1.5 border-2 border-black font-bold transition-all ${
                      isSelected
                        ? 'bg-[#FFE600] text-black shadow-[2px_2px_0px_0px_#000]'
                        : 'bg-[#FAF7F0] text-zinc-800 shadow-[1.5px_1.5px_0px_0px_#000] hover:bg-[#FEF08A]'
                    }`}
                  >
                    <span>{dest.flag}</span>
                    <span className="truncate">{dest.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Footer & Log Out */}
      <div className="space-y-3 pt-4 border-t-2 border-black">
        {/* Open Data Provenance Status */}
        <div className="rounded-xl border-2 border-black bg-[#CCFBF1] p-3 text-[11px] text-black shadow-[3px_3px_0px_0px_#000]">
          <div className="flex items-center gap-1.5 font-black uppercase text-[10px]">
            <span className="h-2 w-2 rounded-full bg-black animate-ping" />
            <span>ETER & EU Open Data Live</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-[10px] text-zinc-700 font-bold">
            <span>Directive 2016/801</span>
            <a
              href="https://data.europa.eu"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-0.5 text-black underline font-black"
            >
              <ShieldCheck className="h-3 w-3 stroke-[2.5]" />
              <span>Official</span>
              <ExternalLink className="h-2.5 w-2.5" />
            </a>
          </div>
        </div>

        {/* Log Out / Switch User Action */}
        <button
          onClick={onLogOut}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-black bg-white hover:bg-[#FECDD3] py-2 text-xs font-black text-black shadow-[3px_3px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1.5px_1.5px_0px_0px_#000] transition-all"
        >
          <LogOut className="h-3.5 w-3.5 stroke-[2.5]" />
          <span>Switch Account / Questionnaire</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex w-64 xl:w-72 shrink-0 border-r-2 border-black bg-[#FAF7F0] sticky top-0 h-screen overflow-y-auto no-scrollbar z-30">
        {navContent}
      </aside>

      {/* Mobile Slide-in Drawer */}
      {isOpenMobile && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop blur */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          {/* Drawer content */}
          <div className="relative w-72 max-w-[80vw] bg-[#FAF7F0] border-r-2 border-black h-full overflow-y-auto shadow-[6px_0px_0px_0px_#000] z-10 animate-fade-in">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};
