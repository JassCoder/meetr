import { useState, useEffect } from 'react';
import { Header, ActiveTab } from './components/Header';
import { AIAssistantView } from './components/AIAssistantView';
import { CareerDiscoveryView } from './components/CareerDiscoveryView';
import { EducationProgramsView } from './components/EducationProgramsView';
import { ProgramComparisonView } from './components/ProgramComparisonView';
import { EligibilityAndFundingView } from './components/EligibilityAndFundingView';
import { MobilityIntelligenceView } from './components/MobilityIntelligenceView';
import { SavedPathwayView } from './components/SavedPathwayView';
import { ProfileModal } from './components/ProfileModal';
import { UserProfileState, ProgramItem, CareerItem } from './types';
import { CAREERS_DATA } from './data/careersData';

const INITIAL_PROFILE: UserProfileState = {
  id: 'student-profile-1',
  name: 'Prospective International Student',
  educationLevel: 'High School / Grade XII',
  highSchoolPercentage: 78,
  annualBudgetEur: 4200,
  targetCareerId: 'gameplay-programmer',
  preferredCity: 'Warsaw',
  passportOrigin: 'Non-EU',
  englishProficiency: 'B2 / IELTS 6.5',
  skillsOwned: ['cpp', 'python', 'git'],
  savedPrograms: ['pw-cs-inż', 'pjatk-gamedev-it'],
};

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('advisor');
  const [profile, setProfile] = useState<UserProfileState>(() => {
    const saved = localStorage.getItem('meetr_student_profile') || localStorage.getItem('pathway_student_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_PROFILE;
      }
    }
    return INITIAL_PROFILE;
  });

  const [savedProgramIds, setSavedProgramIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('meetr_saved_programs') || localStorage.getItem('pathway_saved_programs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return ['pw-cs-inż', 'tum-info-eng-bsc'];
      }
    }
    return ['pw-cs-inż', 'tum-info-eng-bsc'];
  });

  const [comparedProgramIds, setComparedProgramIds] = useState<string[]>([
    'pw-cs-inż',
    'tum-info-eng-bsc',
  ]);

  const [careerFilterForPrograms, setCareerFilterForPrograms] = useState<string | null>(null);
  const [fundingProgramId, setFundingProgramId] = useState<string | null>(null);
  const [selectedCareerModal, setSelectedCareerModal] = useState<CareerItem | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('meetr_student_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('meetr_saved_programs', JSON.stringify(savedProgramIds));
  }, [savedProgramIds]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleUpdateProfile = (updates: Partial<UserProfileState>) => {
    setProfile((prev) => ({
      ...prev,
      ...updates,
    }));
    showToast('Student profile updated & matches recalculated');
  };

  const handleToggleSaveProgram = (programId: string) => {
    setSavedProgramIds((prev) => {
      const exists = prev.includes(programId);
      const updated = exists ? prev.filter((id) => id !== programId) : [...prev, programId];
      showToast(exists ? 'Program removed from saved' : 'Program saved to My Meetr Pathway');
      return updated;
    });
  };

  const handleToggleCompareProgram = (programId: string) => {
    setComparedProgramIds((prev) => {
      if (prev.includes(programId)) {
        return prev.filter((id) => id !== programId);
      }
      if (prev.length >= 3) {
        showToast('You can compare a maximum of 3 programs at once');
        return prev;
      }
      showToast('Program added to comparison matrix');
      return [...prev, programId];
    });
  };

  const handleSetTargetCareer = (careerId: string) => {
    handleUpdateProfile({ targetCareerId: careerId });
    const career = CAREERS_DATA.find((c) => c.id === careerId);
    showToast(`Target goal set to ${career ? career.title : careerId}`);
  };

  const handleViewMatchingProgramsForCareer = (careerId: string) => {
    setCareerFilterForPrograms(careerId);
    setActiveTab('programs');
  };

  const handleNavigateToFunding = (programId: string) => {
    setFundingProgramId(programId);
    setActiveTab('funding');
  };

  const handleSelectProgramFromChat = (prog: ProgramItem) => {
    setFundingProgramId(prog.id);
    setActiveTab('programs');
  };

  const handleSelectCareerFromChat = (career: CareerItem) => {
    setSelectedCareerModal(career);
    setActiveTab('careers');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 rounded-xl border border-slate-700 bg-slate-900/95 px-4 py-2.5 text-xs font-semibold text-white shadow-2xl backdrop-blur-md animate-fade-in flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-blue-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'programs') setCareerFilterForPrograms(null);
          setActiveTab(tab);
        }}
        profile={profile}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        savedProgramsCount={savedProgramIds.length}
      />

      {/* Main Tab Content */}
      <main className="flex-1 pb-16">
        {activeTab === 'advisor' && (
          <AIAssistantView
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
            onSelectCareer={handleSelectCareerFromChat}
            onSelectProgram={handleSelectProgramFromChat}
            onOpenProfileModal={() => setIsProfileModalOpen(true)}
          />
        )}

        {activeTab === 'careers' && (
          <CareerDiscoveryView
            profile={profile}
            onSetTargetCareer={handleSetTargetCareer}
            onViewMatchingPrograms={handleViewMatchingProgramsForCareer}
            selectedCareerModal={selectedCareerModal}
            setSelectedCareerModal={setSelectedCareerModal}
          />
        )}

        {activeTab === 'programs' && (
          <EducationProgramsView
            profile={profile}
            savedProgramIds={savedProgramIds}
            onToggleSaveProgram={handleToggleSaveProgram}
            comparedProgramIds={comparedProgramIds}
            onToggleCompareProgram={handleToggleCompareProgram}
            onNavigateToCompare={() => setActiveTab('compare')}
            onNavigateToFunding={handleNavigateToFunding}
            filterByCareerId={careerFilterForPrograms}
          />
        )}

        {activeTab === 'compare' && (
          <ProgramComparisonView
            profile={profile}
            comparedProgramIds={comparedProgramIds}
            onToggleCompareProgram={handleToggleCompareProgram}
            onClearCompare={() => setComparedProgramIds([])}
            onNavigateToPrograms={() => setActiveTab('programs')}
            onNavigateToFunding={handleNavigateToFunding}
          />
        )}

        {activeTab === 'funding' && (
          <EligibilityAndFundingView
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
            preselectedProgramId={fundingProgramId}
          />
        )}

        {activeTab === 'mobility' && (
          <MobilityIntelligenceView profile={profile} />
        )}

        {activeTab === 'saved' && (
          <SavedPathwayView
            profile={profile}
            savedProgramIds={savedProgramIds}
            onToggleSaveProgram={handleToggleSaveProgram}
            onNavigateToPrograms={() => setActiveTab('programs')}
            onNavigateToCareers={() => setActiveTab('careers')}
            onSelectProgram={(prog) => {
              setFundingProgramId(prog.id);
              setActiveTab('programs');
            }}
          />
        )}
      </main>

      {/* Profile Tune Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={profile}
        onSave={handleUpdateProfile}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-xs text-slate-500">
        <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white tracking-wider">MEETR</span>
            <span>• European Higher Education & Career Mobility Intelligence v0.1.0</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span>Data grounded in European Open Tertiary Education Datasets (ETER & National Open Registers)</span>
            <span>•</span>
            <span>EU Directive 2016/801 & Bologna Framework</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
