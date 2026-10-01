import React, { useState } from 'react';
import {
  Award,
  Layers,
  Plus,
  TrendingUp,
  UserCheck,
  Users,
  X,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { EducationLevel, Stream } from '../types';

export const StreamsPage: React.FC = () => {
  const {
    streams,
    students,
    memberships,
    currentSchool,
    addStream,
    updateStream,
  } = useAuth();

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStreamDashboard, setSelectedStreamDashboard] = useState<Stream | null>(null);

  // New Stream Form
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [level, setLevel] = useState<EducationLevel>(
    (currentSchool?.educationLevels[0] as EducationLevel) || 'O-Level'
  );
  const [formStandard, setFormStandard] = useState('Form I');
  const [classTeacherId, setClassTeacherId] = useState('');
  const [maxCapacity, setMaxCapacity] = useState(45);

  const teachers = memberships.filter((m) => m.positions.includes('Teacher') || m.positions.includes('Class Teacher'));

  const handleCreateStream = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const teacher = teachers.find((t) => t.userId === classTeacherId);

    addStream({
      name: name.trim(),
      code: code.trim() || name.substring(0, 4).toUpperCase(),
      level,
      formStandard,
      academicYear: currentSchool?.academicYear || '2026',
      classTeacherId: classTeacherId || undefined,
      classTeacherName: teacher ? teacher.userName : undefined,
      maxCapacity,
    });

    setShowAddModal(false);
    setName('');
    setCode('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Madarasa na Mikondo (Streams / Mkondo Management)
          </h2>
          <p className="text-xs text-slate-500">
            Usimamizi wa mikondo ya madarasa, walimu walezi (Class Teachers) na takwimu za kila mkondo
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 rounded-xl bg-sky-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-sky-700/20 hover:bg-sky-700"
        >
          <Plus className="h-4 w-4" />
          Ongeza Mkondo Mpya
        </button>
      </div>

      {/* Streams Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {streams.map((str) => {
          const streamStudents = students.filter((s) => s.streamId === str.id);
          const occupancyRate = Math.round((streamStudents.length / str.maxCapacity) * 100);

          return (
            <div
              key={str.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-md hover:border-sky-300"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-sky-100 px-2 py-0.5 text-[10px] font-bold text-sky-800">
                    {str.level} • {str.formStandard}
                  </span>
                  <span className="font-mono text-xs font-semibold text-slate-400">{str.code}</span>
                </div>

                <h3 className="mt-2 text-base font-bold text-slate-900">{str.name}</h3>

                <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <UserCheck className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Mwalimu wa Darasa: <strong className="text-slate-800">{str.classTeacherName || 'Hajapangiwa'}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-sky-600" />
                    <span>Wanafunzi: <strong className="text-slate-800">{streamStudents.length} / {str.maxCapacity}</strong> ({occupancyRate}%)</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      occupancyRate > 90 ? 'bg-amber-500' : 'bg-sky-500'
                    }`}
                    style={{ width: `${Math.min(100, occupancyRate)}%` }}
                  ></div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setSelectedStreamDashboard(str)}
                  className="flex items-center gap-1 text-xs font-bold text-sky-600 hover:text-sky-800"
                >
                  <TrendingUp className="h-3.5 w-3.5" />
                  Dashboard ya Mkondo
                </button>
                <span className="text-[10px] text-slate-400 font-medium">Mwaka: {str.academicYear}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stream Dashboard Modal (Requirement #7) */}
      {selectedStreamDashboard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Dashboard ya Mkondo: {selectedStreamDashboard.name}
                </h3>
                <p className="text-[11px] text-slate-500">
                  {selectedStreamDashboard.level} • {selectedStreamDashboard.formStandard} • Mwalimu: {selectedStreamDashboard.classTeacherName || 'Hajapangiwa'}
                </p>
              </div>
              <button
                onClick={() => setSelectedStreamDashboard(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-xl bg-sky-50 p-3">
                  <span className="text-[10px] font-bold text-sky-800 uppercase">Wanafunzi Wote</span>
                  <p className="text-xl font-black text-sky-950">
                    {students.filter((s) => s.streamId === selectedStreamDashboard.id).length}
                  </p>
                </div>
                <div className="rounded-xl bg-emerald-50 p-3">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase">Wastani wa Mahudhurio</span>
                  <p className="text-xl font-black text-emerald-950">96.4%</p>
                </div>
                <div className="rounded-xl bg-purple-50 p-3">
                  <span className="text-[10px] font-bold text-purple-800 uppercase">Wastani wa Mitihani</span>
                  <p className="text-xl font-black text-purple-950">72.8%</p>
                </div>
              </div>

              {/* Student list */}
              <div>
                <h4 className="font-bold text-slate-800 mb-2">Orodha ya Wanafunzi wa Mkondo Huu</h4>
                <div className="max-h-60 overflow-y-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600">
                      <tr>
                        <th className="p-2 font-semibold">Namba ya Usajili</th>
                        <th className="p-2 font-semibold">Jina Kamili</th>
                        <th className="p-2 font-semibold">Jinsia</th>
                        <th className="p-2 font-semibold">Simu ya Mzazi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {students
                        .filter((s) => s.streamId === selectedStreamDashboard.id)
                        .map((st) => (
                          <tr key={st.id}>
                            <td className="p-2 font-mono font-bold text-sky-700">{st.admissionNumber}</td>
                            <td className="p-2 font-bold text-slate-900">{st.fullName}</td>
                            <td className="p-2 text-slate-600">{st.gender}</td>
                            <td className="p-2 font-mono text-slate-600">{st.parentPhone}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t border-slate-100">
                <button
                  onClick={() => setSelectedStreamDashboard(null)}
                  className="rounded-lg bg-slate-900 px-4 py-1.5 font-bold text-white hover:bg-slate-800"
                >
                  Funga
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Stream Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Unda Mkondo Mpya (Create Stream)</h3>
              <button onClick={() => setShowAddModal(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStream} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="mb-1 block font-semibold text-slate-700">Jina la Mkondo (Stream Name) *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="mf. Form I C au Form V HGL"
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-semibold text-slate-700">Ngazi ya Elimu</label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value as EducationLevel)}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:outline-hidden"
                  >
                    {currentSchool?.educationLevels.map((lvl) => (
                      <option key={lvl} value={lvl}>
                        {lvl}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block font-semibold text-slate-700">Darasa / Kidato</label>
                  <input
                    type="text"
                    required
                    value={formStandard}
                    onChange={(e) => setFormStandard(e.target.value)}
                    placeholder="mf. Form I au Form V"
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block font-semibold text-slate-700">Mwalimu wa Darasa (Class Teacher)</label>
                <select
                  value={classTeacherId}
                  onChange={(e) => setClassTeacherId(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:outline-hidden"
                >
                  <option value="">-- Chagua Mwalimu --</option>
                  {teachers.map((t) => (
                    <option key={t.userId} value={t.userId}>
                      {t.userName} ({t.userEmail})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block font-semibold text-slate-700">Uwezo wa Juu wa Wanafunzi (Max Capacity)</label>
                <input
                  type="number"
                  value={maxCapacity}
                  onChange={(e) => setMaxCapacity(parseInt(e.target.value) || 45)}
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
                  Hifadhi Mkondo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
