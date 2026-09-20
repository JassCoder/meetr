import React, { useState } from 'react';
import { X, Check, Sliders, Globe, GraduationCap, DollarSign, MapPin, User, Mail } from 'lucide-react';
import { UserProfileState } from '../types';
import { CAREERS_DATA } from '../data/careersData';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfileState;
  onSave: (updated: UserProfileState) => void;
}

const EU_COUNTRIES = [
  'Germany',
  'Netherlands',
  'Sweden',
  'Finland',
  'France',
  'Ireland',
  'Poland',
  'Estonia',
  'All European Union',
];

const EU_CITIES = [
  'Any',
  'Munich',
  'Delft',
  'Amsterdam',
  'Stockholm',
  'Helsinki',
  'Paris',
  'Dublin',
  'Warsaw',
  'Kraków',
  'Tallinn',
];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave,
}) => {
  const [formData, setFormData] = useState<UserProfileState>({ ...profile });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border-2 border-black bg-white p-6 shadow-[8px_8px_0px_0px_#000] text-black">
        <div className="flex items-center justify-between border-b-2 border-black pb-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg border-2 border-black bg-[#FFE600] p-1.5 shadow-[2px_2px_0px_0px_#000]">
              <Sliders className="h-5 w-5 text-black stroke-[2.5]" />
            </div>
            <h2 className="text-xl font-black text-black font-display">Student Profile & Preferences</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl border-2 border-black bg-white p-1.5 text-black shadow-[2px_2px_0px_0px_#000] hover:bg-[#FECDD3] transition-all"
          >
            <X className="h-5 w-5 stroke-[2.5]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs font-sans">
          {/* Personal Info: Name & Email */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block font-black uppercase text-zinc-700 font-mono text-[11px]">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-black stroke-[2.5]" />
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Jaspreet Saini"
                  className="w-full rounded-xl border-2 border-black bg-[#FAF7F0] py-2.5 pl-9 pr-3 text-black font-bold focus:bg-[#FEF9C3] shadow-[2px_2px_0px_0px_#000] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block font-black uppercase text-zinc-700 font-mono text-[11px]">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-black stroke-[2.5]" />
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. student@meetr.eu"
                  className="w-full rounded-xl border-2 border-black bg-[#FAF7F0] py-2.5 pl-9 pr-3 text-black font-bold focus:bg-[#FEF9C3] shadow-[2px_2px_0px_0px_#000] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Destination Focus & City */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block font-black uppercase text-zinc-700 font-mono text-[11px]">
                Preferred European Country
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-3 h-4 w-4 text-black stroke-[2.5]" />
                <select
                  value={formData.preferredCountry || 'Germany'}
                  onChange={(e) => setFormData({ ...formData, preferredCountry: e.target.value })}
                  className="w-full rounded-xl border-2 border-black bg-[#FAF7F0] py-2.5 pl-9 pr-3 text-black font-bold focus:bg-[#FEF9C3] shadow-[2px_2px_0px_0px_#000] focus:outline-none"
                >
                  {EU_COUNTRIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1 block font-black uppercase text-zinc-700 font-mono text-[11px]">
                Preferred Study City
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-black stroke-[2.5]" />
                <select
                  value={formData.preferredCity}
                  onChange={(e) => setFormData({ ...formData, preferredCity: e.target.value })}
                  className="w-full rounded-xl border-2 border-black bg-[#FAF7F0] py-2.5 pl-9 pr-3 text-black font-bold focus:bg-[#FEF9C3] shadow-[2px_2px_0px_0px_#000] focus:outline-none"
                >
                  {EU_CITIES.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Education Level & Percentage */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block font-black uppercase text-zinc-700 font-mono text-[11px]">
                Education Level
              </label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-3 h-4 w-4 text-black stroke-[2.5]" />
                <select
                  value={formData.educationLevel}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      educationLevel: e.target.value as UserProfileState['educationLevel'],
                    })
                  }
                  className="w-full rounded-xl border-2 border-black bg-[#FAF7F0] py-2.5 pl-9 pr-3 text-black font-bold focus:bg-[#FEF9C3] shadow-[2px_2px_0px_0px_#000] focus:outline-none"
                >
                  <option value="High School / Grade XII">High School / Grade XII / Matura / Abitur</option>
                  <option value="Undergraduate / Bachelor">Undergraduate / Bachelor</option>
                  <option value="Graduate / Master">Graduate / Master</option>
                  <option value="Self-Taught">Self-Taught / Industry Transition</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1 block font-black uppercase text-zinc-700 font-mono text-[11px]">
                Academic Score / Average (%)
              </label>
              <div className="flex items-center gap-3 mt-1.5">
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={formData.highSchoolPercentage}
                  onChange={(e) =>
                    setFormData({ ...formData, highSchoolPercentage: parseInt(e.target.value, 10) })
                  }
                  className="w-full accent-black cursor-pointer"
                />
                <span className="w-14 rounded-lg border-2 border-black bg-[#FFE600] py-1 text-center font-mono font-black text-black shadow-[1.5px_1.5px_0px_0px_#000]">
                  {formData.highSchoolPercentage}%
                </span>
              </div>
            </div>
          </div>

          {/* Annual Tuition Budget (EUR) */}
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="font-black uppercase text-zinc-700 font-mono text-[11px]">
                Annual University Tuition Budget (EUR)
              </label>
              <span className="text-xs font-mono font-black text-black bg-[#A7F3D0] px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_0px_#000]">
                €{formData.annualBudgetEur.toLocaleString()} / year
              </span>
            </div>
            <div className="relative flex items-center">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-black stroke-[2.5]" />
              <input
                type="number"
                step="500"
                min="0"
                max="25000"
                value={formData.annualBudgetEur}
                onChange={(e) =>
                  setFormData({ ...formData, annualBudgetEur: parseInt(e.target.value, 10) || 0 })
                }
                className="w-full rounded-xl border-2 border-black bg-[#FAF7F0] py-2.5 pl-9 pr-3 text-black font-mono font-bold focus:bg-[#FEF9C3] shadow-[2px_2px_0px_0px_#000] focus:outline-none"
              />
            </div>
            <p className="mt-1 text-[11px] text-zinc-600 font-medium">
              German public universities are mostly tuition-free. Other EU destinations range from €2,000 to €15,000/year for non-EU students.
            </p>
          </div>

          {/* Target Career Preference */}
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="font-black uppercase text-zinc-700 font-mono text-[11px]">
                Target Career Ambition
              </label>
              {formData.targetCareerId ? (
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, targetCareerId: null })}
                  className="text-[11px] font-black text-black bg-[#FECDD3] px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_0px_#000] hover:bg-rose-300 transition-colors"
                >
                  ✕ Set No Goal (Explore All)
                </button>
              ) : (
                <span className="text-[11px] font-black text-black bg-[#A7F3D0] px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_0px_#000]">
                  ✓ Open Exploration Active
                </span>
              )}
            </div>
            <select
              value={formData.targetCareerId || ''}
              onChange={(e) =>
                setFormData({ ...formData, targetCareerId: e.target.value || null })
              }
              className="w-full rounded-xl border-2 border-black bg-[#FAF7F0] py-2.5 px-3 text-black font-bold focus:bg-[#FEF9C3] shadow-[2px_2px_0px_0px_#000] focus:outline-none"
            >
              <option value="">No Target Goal (Open Exploration across Tech, Arts & Engineering)</option>
              {CAREERS_DATA.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title} — {c.category}
                </option>
              ))}
            </select>
            <p className="mt-1 text-[11px] text-zinc-600 font-medium">
              Select a role to score programs by career alignment, or keep &quot;No Target Goal&quot; to discover all European disciplines equally.
            </p>
          </div>

          {/* Passport / Nationality Category */}
          <div>
            <label className="mb-1 block font-black uppercase text-zinc-700 font-mono text-[11px]">
              Passport / Nationality Category
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-3 h-4 w-4 text-black stroke-[2.5]" />
              <select
                value={formData.passportOrigin}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    passportOrigin: e.target.value as 'Non-EU' | 'EU / EEA',
                  })
                }
                className="w-full rounded-xl border-2 border-black bg-[#FAF7F0] py-2.5 pl-9 pr-3 text-black font-bold focus:bg-[#FEF9C3] shadow-[2px_2px_0px_0px_#000] focus:outline-none"
              >
                <option value="Non-EU">Non-EU Citizen (Directive 2016/801 National Student Visa required)</option>
                <option value="EU / EEA">EU / EEA Citizen (Free movement, domestic fee rights)</option>
              </select>
            </div>
          </div>

          {/* English Proficiency */}
          <div>
            <label className="mb-1 block font-black uppercase text-zinc-700 font-mono text-[11px]">
              English Proficiency
            </label>
            <input
              type="text"
              placeholder="e.g. IELTS 6.5, TOEFL iBT 85, Duolingo 115, Medium of Instruction (MOI)"
              value={formData.englishProficiency}
              onChange={(e) => setFormData({ ...formData, englishProficiency: e.target.value })}
              className="w-full rounded-xl border-2 border-black bg-[#FAF7F0] py-2.5 px-3 text-black font-bold focus:bg-[#FEF9C3] shadow-[2px_2px_0px_0px_#000] focus:outline-none"
            />
          </div>

          <div className="mt-6 flex justify-end gap-3 border-t-2 border-black pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border-2 border-black bg-white px-4 py-2.5 text-xs font-black text-black shadow-[2px_2px_0px_0px_#000] hover:bg-[#FAF7F0] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-xl border-2 border-black bg-[#FFE600] px-5 py-2.5 text-xs font-black text-black shadow-[3px_3px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
            >
              <Check className="h-4 w-4 stroke-[3]" />
              <span>Save Profile & Re-calculate Matches</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
