import React, { useState } from 'react';
import { X, Check, Sliders, Globe, GraduationCap, DollarSign, MapPin } from 'lucide-react';
import { UserProfileState } from '../types';
import { CAREERS_DATA } from '../data/careersData';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfileState;
  onSave: (updated: UserProfileState) => void;
}

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

  const cities = ['Any', 'Warsaw', 'Kraków', 'Wrocław', 'Poznań', 'Gdańsk'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Sliders className="h-5 w-5 text-blue-400" />
            <h2 className="text-lg font-bold text-white">Student Profile & Preferences</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          {/* Education Level & Percentage */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block font-medium text-slate-300">
                Education Level
              </label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <select
                  value={formData.educationLevel}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      educationLevel: e.target.value as UserProfileState['educationLevel'],
                    })
                  }
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 pl-9 pr-3 text-slate-200 focus:border-blue-500 focus:outline-none"
                >
                  <option value="High School / Grade XII">High School / Grade XII / Matura</option>
                  <option value="Undergraduate / Bachelor">Undergraduate / Bachelor</option>
                  <option value="Graduate / Master">Graduate / Master</option>
                  <option value="Self-Taught">Self-Taught / Industry Transition</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1 block font-medium text-slate-300">
                Academic Score / Average (%)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={formData.highSchoolPercentage}
                  onChange={(e) =>
                    setFormData({ ...formData, highSchoolPercentage: parseInt(e.target.value, 10) })
                  }
                  className="w-full accent-blue-500"
                />
                <span className="w-12 rounded bg-slate-800 py-1 text-center font-bold text-blue-400">
                  {formData.highSchoolPercentage}%
                </span>
              </div>
            </div>
          </div>

          {/* Annual Tuition Budget (EUR) */}
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="font-medium text-slate-300">
                Annual University Tuition Budget (EUR)
              </label>
              <span className="text-xs font-semibold text-emerald-400">
                €{formData.annualBudgetEur.toLocaleString()} / year
              </span>
            </div>
            <div className="relative flex items-center">
              <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="number"
                step="500"
                min="1000"
                max="15000"
                value={formData.annualBudgetEur}
                onChange={(e) =>
                  setFormData({ ...formData, annualBudgetEur: parseInt(e.target.value, 10) || 0 })
                }
                className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 pl-9 pr-3 text-slate-200 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              Polish public universities for non-EU international students typically range from €3,400 to €4,800/year.
            </p>
          </div>

          {/* Target Career Preference */}
          <div>
            <label className="mb-1 block font-medium text-slate-300">
              Target Career Ambition
            </label>
            <select
              value={formData.targetCareerId || ''}
              onChange={(e) =>
                setFormData({ ...formData, targetCareerId: e.target.value || null })
              }
              className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 px-3 text-slate-200 focus:border-blue-500 focus:outline-none"
            >
              <option value="">Not decided yet (General Computer Science / Tech)</option>
              {CAREERS_DATA.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title} ({c.category})
                </option>
              ))}
            </select>
          </div>

          {/* Preferred City in Poland & Passport Origin */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block font-medium text-slate-300">
                Preferred Study City
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <select
                  value={formData.preferredCity}
                  onChange={(e) => setFormData({ ...formData, preferredCity: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 pl-9 pr-3 text-slate-200 focus:border-blue-500 focus:outline-none"
                >
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1 block font-medium text-slate-300">
                Passport / Nationality Category
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <select
                  value={formData.passportOrigin}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      passportOrigin: e.target.value as 'Non-EU' | 'EU / EEA',
                    })
                  }
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 pl-9 pr-3 text-slate-200 focus:border-blue-500 focus:outline-none"
                >
                  <option value="Non-EU">Non-EU Citizen (Student Visa & Karta Pobytu required)</option>
                  <option value="EU / EEA">EU / EEA Citizen (Free movement, domestic fee rights)</option>
                </select>
              </div>
            </div>
          </div>

          {/* English Proficiency */}
          <div>
            <label className="mb-1 block font-medium text-slate-300">
              English Proficiency
            </label>
            <input
              type="text"
              placeholder="e.g. IELTS 6.5, TOEFL iBT 80, Medium of Instruction Certificate"
              value={formData.englishProficiency}
              onChange={(e) => setFormData({ ...formData, englishProficiency: e.target.value })}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 px-3 text-slate-200 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="mt-6 flex justify-end gap-3 border-t border-slate-800 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-800 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2 text-xs font-semibold text-white hover:bg-blue-500 shadow-md shadow-blue-500/20"
            >
              <Check className="h-4 w-4" />
              Save Profile & Re-calculate Matches
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
