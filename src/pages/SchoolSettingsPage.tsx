import React, { useState } from 'react';
import {
  Building2,
  Check,
  GraduationCap,
  Save,
  Sliders,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { DEFAULT_NECTA_GRADING_RULES } from '../constants/tanzania';
import { GradingGradeRule } from '../types';

export const SchoolSettingsPage: React.FC = () => {
  const { currentSchool, updateSchoolSettings, hasPermission } = useAuth();

  const [name, setName] = useState(currentSchool?.name || '');
  const [motto, setMotto] = useState(currentSchool?.motto || '');
  const [phone, setPhone] = useState(currentSchool?.phone || '');
  const [email, setEmail] = useState(currentSchool?.email || '');
  const [academicYear, setAcademicYear] = useState(currentSchool?.academicYear || '2026');
  const [currentTerm, setCurrentTerm] = useState(currentSchool?.currentTerm || 'Term 1');

  // Configurable grading scale
  const [gradingRules, setGradingRules] = useState<GradingGradeRule[]>(
    currentSchool?.gradingScale || DEFAULT_NECTA_GRADING_RULES
  );
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSchoolSettings({
      name,
      motto,
      phone,
      email,
      academicYear,
      currentTerm,
      gradingScale: gradingRules,
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const handleRuleChange = (idx: number, field: keyof GradingGradeRule, value: any) => {
    const updated = [...gradingRules];
    updated[idx] = { ...updated[idx], [field]: value };
    setGradingRules(updated);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Mipangilio ya Shule (School Configuration & Grading Scale)
          </h2>
          <p className="text-xs text-slate-500">
            Mmiliki wa Shule anaweza kubadili taarifa za msingi, mfumo wa madaraja (Grading Engine) na mwaka wa masomo
          </p>
        </div>

        {savedNotice && (
          <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
            <Check className="h-4 w-4" /> Mipangilio imehifadhiwa!
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* School Profile Section */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="h-4 w-4 text-sky-600" />
            Taarifa za Shule (Profile)
          </h3>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block font-semibold text-slate-700">Jina la Shule</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:outline-hidden"
              />
            </div>
            <div>
              <label className="mb-1 block font-semibold text-slate-700">Kauli Mbiu (Motto)</label>
              <input
                type="text"
                value={motto}
                onChange={(e) => setMotto(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block font-semibold text-slate-700">Simu ya Ofisi</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:outline-hidden"
              />
            </div>
            <div>
              <label className="mb-1 block font-semibold text-slate-700">Barua Pepe Rasmi</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block font-semibold text-slate-700">Mwaka wa Masomo</label>
              <input
                type="text"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:outline-hidden"
              />
            </div>
            <div>
              <label className="mb-1 block font-semibold text-slate-700">Muhula wa Sasa</label>
              <select
                value={currentTerm}
                onChange={(e) => setCurrentTerm(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:outline-hidden"
              >
                <option value="Term 1">Muhula wa 1 (Term 1)</option>
                <option value="Term 2">Muhula wa 2 (Term 2)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Configurable Grading Engine Section (Requirement #27) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sliders className="h-4 w-4 text-emerald-600" />
                Mfumo wa Madaraja na Alama (Configurable Grading Engine)
              </h3>
              <p className="text-xs text-slate-500">
                Weka vigezo vya alama za chini na juu, grade point, na maelezo rasmi ya NECTA
              </p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="p-2.5 font-bold">Daraja (Grade)</th>
                  <th className="p-2.5 font-bold">Alama ya Chini (Min %)</th>
                  <th className="p-2.5 font-bold">Alama ya Juu (Max %)</th>
                  <th className="p-2.5 font-bold">Pointi (Points)</th>
                  <th className="p-2.5 font-bold">Tafsiri / Maoni (Description)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {gradingRules.map((rule, idx) => (
                  <tr key={rule.grade}>
                    <td className="p-2.5 font-black text-slate-900 text-sm">{rule.grade}</td>
                    <td className="p-2.5">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={rule.minScore}
                        onChange={(e) => handleRuleChange(idx, 'minScore', parseInt(e.target.value) || 0)}
                        className="w-20 rounded border border-slate-300 p-1 text-center font-bold"
                      />
                    </td>
                    <td className="p-2.5">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={rule.maxScore}
                        onChange={(e) => handleRuleChange(idx, 'maxScore', parseInt(e.target.value) || 100)}
                        className="w-20 rounded border border-slate-300 p-1 text-center font-bold"
                      />
                    </td>
                    <td className="p-2.5">
                      <input
                        type="number"
                        min={1}
                        max={10}
                        value={rule.point}
                        onChange={(e) => handleRuleChange(idx, 'point', parseInt(e.target.value) || 1)}
                        className="w-16 rounded border border-slate-300 p-1 text-center font-bold font-mono"
                      />
                    </td>
                    <td className="p-2.5">
                      <input
                        type="text"
                        value={rule.description}
                        onChange={(e) => handleRuleChange(idx, 'description', e.target.value)}
                        className="w-full rounded border border-slate-300 p-1"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700"
          >
            <Save className="h-4 w-4" />
            Hifadhi Mipangilio Yote (Save Settings)
          </button>
        </div>
      </form>
    </div>
  );
};
