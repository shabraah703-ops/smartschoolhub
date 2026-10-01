import React, { useState } from 'react';
import { BookOpen, Check, Layers, Plus, Users, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { DEFAULT_A_LEVEL_COMBINATIONS } from '../constants/tanzania';

export const CombinationsPage: React.FC = () => {
  const {
    combinations,
    subjects,
    students,
    addCombination,
    updateCombination,
  } = useAuth();

  const [showAddModal, setShowAddModal] = useState(false);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<string[]>([]);
  const [description, setDescription] = useState('');

  const toggleSubject = (subId: string) => {
    if (selectedSubjectIds.includes(subId)) {
      setSelectedSubjectIds(selectedSubjectIds.filter((id) => id !== subId));
    } else {
      setSelectedSubjectIds([...selectedSubjectIds, subId]);
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !name.trim()) return;

    addCombination({
      code: code.trim().toUpperCase(),
      name: name.trim(),
      subjectIds: selectedSubjectIds,
      description: description.trim(),
    });

    setShowAddModal(false);
    setCode('');
    setName('');
    setSelectedSubjectIds([]);
    setDescription('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Michepuo ya Kidato cha V & VI (A-Level Combinations)
          </h2>
          <p className="text-xs text-slate-500">
            Usimamizi wa michepuo ya masomo ya A-Level (PCM, PCB, HGL, n.k.) na wanafunzi waliopangiwa
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-purple-700/20 hover:bg-purple-700"
        >
          <Plus className="h-4 w-4" />
          Ongeza Combination Mpya
        </button>
      </div>

      {/* Combinations Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {combinations.map((comb) => {
          const enrolledStudents = students.filter(
            (s) => s.combinationId === comb.id || s.combinationCode === comb.code
          );
          const combSubjects = subjects.filter((s) => comb.subjectIds.includes(s.id));

          return (
            <div
              key={comb.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-md hover:border-purple-300"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-black text-purple-800 bg-purple-50 px-2.5 py-1 rounded-lg">
                    {comb.code}
                  </span>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                    Active
                  </span>
                </div>

                <h3 className="mt-3 text-sm font-bold text-slate-900">{comb.name}</h3>
                <p className="mt-1 text-xs text-slate-500">{comb.description || 'A-Level core specialization combination.'}</p>

                {/* Subjects Pill List */}
                <div className="mt-3">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase">Masomo ya Mchepuo:</span>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {combSubjects.map((s) => (
                      <span
                        key={s.id}
                        className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700"
                      >
                        {s.name} ({s.code})
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5 text-purple-600" />
                  Wanafunzi: <strong className="text-slate-900">{enrolledStudents.length}</strong>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Kidato cha V & VI</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Combination Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Unda Mchepuo Mpya (New Combination)</h3>
              <button onClick={() => setShowAddModal(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="mt-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-semibold text-slate-700">Kifupi cha Combination (Code) *</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="mf. PCM, PCB, HGL"
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs font-mono uppercase focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-semibold text-slate-700">Jina Kamili la Mchepuo *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="mf. Physics, Chemistry, Mathematics"
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block font-semibold text-slate-700">Chagua Masomo ya Combination Hii *</label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto rounded-xl border border-slate-200 p-2">
                  {subjects.map((s) => {
                    const isSelected = selectedSubjectIds.includes(s.id);
                    return (
                      <div
                        key={s.id}
                        onClick={() => toggleSubject(s.id)}
                        className={`flex cursor-pointer items-center justify-between rounded-lg p-2 transition ${
                          isSelected ? 'bg-purple-100 text-purple-950 font-bold' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span className="truncate">{s.name} ({s.code})</span>
                        {isSelected && <Check className="h-3.5 w-3.5 text-purple-700 shrink-0" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="mb-1 block font-semibold text-slate-700">Maelezo (Description)</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Maelezo ya fani..."
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
                  className="rounded-lg bg-purple-600 px-4 py-1.5 font-bold text-white hover:bg-purple-700"
                >
                  Hifadhi Combination
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
