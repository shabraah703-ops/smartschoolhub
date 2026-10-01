import React, { useState } from 'react';
import { BookOpen, Layers, Plus, School, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { EducationLevel, Subject } from '../types';

export const SubjectsPage: React.FC = () => {
  const {
    subjects,
    departments,
    currentSchool,
    addSubject,
    updateSubject,
  } = useAuth();

  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [level, setLevel] = useState<EducationLevel | 'All'>('O-Level');
  const [departmentId, setDepartmentId] = useState('');
  const [periodsPerWeek, setPeriodsPerWeek] = useState(5);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) return;

    addSubject({
      name: name.trim(),
      code: code.trim().toUpperCase(),
      level,
      departmentId: departmentId || undefined,
      periodsPerWeek,
    });

    setShowAddModal(false);
    setName('');
    setCode('');
    setDepartmentId('');
    setPeriodsPerWeek(5);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Masomo ya Mtaala (School Curriculum Subjects)
          </h2>
          <p className="text-xs text-slate-500">
            Orodha ya masomo, vipindi kwa wiki (periods per week), na idara husika
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 rounded-xl bg-sky-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-sky-700/20 hover:bg-sky-700"
        >
          <Plus className="h-4 w-4" />
          Ongeza Somo Jipya
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
              <tr>
                <th className="py-3 px-3 font-semibold">Kifupi (Code)</th>
                <th className="py-3 px-3 font-semibold">Jina la Somo (Subject Name)</th>
                <th className="py-3 px-3 font-semibold">Ngazi (Level)</th>
                <th className="py-3 px-3 font-semibold">Idara (Department)</th>
                <th className="py-3 px-3 font-semibold text-center">Vipindi / Wiki</th>
                <th className="py-3 px-3 font-semibold text-center">Hali</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {subjects.map((sub) => {
                const dept = departments.find((d) => d.id === sub.departmentId);
                return (
                  <tr key={sub.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-mono font-bold text-sky-700">{sub.code}</td>
                    <td className="py-3 px-3 font-bold text-slate-900">{sub.name}</td>
                    <td className="py-3 px-3">
                      <span className="rounded bg-slate-100 px-2 py-0.5 font-semibold text-slate-700">
                        {sub.level}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-600">
                      {dept ? dept.name : 'Haijapangwa'}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-slate-800">
                      {sub.periodsPerWeek} vipindi
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                        Active
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Subject Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Ongeza Somo Jipya (Add Subject)</h3>
              <button onClick={() => setShowAddModal(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="mb-1 block font-semibold text-slate-700">Jina la Somo (Subject Name) *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="mf. General Mathematics au Kiswahili Sanifu"
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-semibold text-slate-700">Kifupi (Code) *</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="mf. MATH, PHY, KISW"
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs font-mono uppercase focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-semibold text-slate-700">Ngazi ya Elimu</label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value as any)}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:outline-hidden"
                  >
                    <option value="All">Ngazi Zote (All)</option>
                    <option value="Primary">Primary</option>
                    <option value="O-Level">O-Level</option>
                    <option value="A-Level">A-Level</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block font-semibold text-slate-700">Idara Inayomiliki Somo Hili</label>
                <select
                  value={departmentId}
                  onChange={(e) => setDepartmentId(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:outline-hidden"
                >
                  <option value="">-- Chagua Idara --</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block font-semibold text-slate-700">Idadi ya Vipindi kwa Wiki (Periods/Week)</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={periodsPerWeek}
                  onChange={(e) => setPeriodsPerWeek(parseInt(e.target.value) || 5)}
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Ghairi
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-sky-600 px-4 py-1.5 font-bold text-white hover:bg-sky-700"
                >
                  Hifadhi Somo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
