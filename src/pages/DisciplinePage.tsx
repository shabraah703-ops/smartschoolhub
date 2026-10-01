import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  FileText,
  Plus,
  ShieldAlert,
  UserX,
  Users,
  X,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { DisciplineCase } from '../types';

export const DisciplinePage: React.FC = () => {
  const {
    disciplineCases,
    students,
    currentUser,
    addDisciplineCase,
  } = useAuth();

  const [showAddCase, setShowAddCase] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<DisciplineCase['severity']>('Minor');
  const [actionTaken, setActionTaken] = useState('Verbal Warning & Counseling');
  const [parentNotified, setParentNotified] = useState(true);

  const handleCreateCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || !title.trim()) return;

    const student = students.find((s) => s.id === selectedStudentId);
    if (!student) return;

    addDisciplineCase({
      studentId: student.id,
      studentName: student.fullName,
      admissionNumber: student.admissionNumber,
      streamName: student.streamName || student.formStandard,
      title: title.trim(),
      description: description.trim(),
      severity,
      actionTaken,
      reportedBy: currentUser?.uid || 'discipline-001',
      reportedByName: currentUser?.fullName || 'Madam Grace Mushi (Discipline Mistress)',
      parentNotified,
      date: new Date().toISOString().split('T')[0],
    });

    setShowAddCase(false);
    setSelectedStudentId('');
    setTitle('');
    setDescription('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Nidhamu na Malezi ya Wanafunzi (Student Discipline & Pastoral Care)
          </h2>
          <p className="text-xs text-slate-500">
            Kurekodi kesi za nidhamu, maonyo, adhabu, mawasiliano na wazazi, na ufuatiliaji wa tabia
          </p>
        </div>

        <button
          onClick={() => setShowAddCase(true)}
          className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-rose-700/20 hover:bg-rose-700"
        >
          <Plus className="h-4 w-4" />
          Fungua Kesi ya Nidhamu (Record Incident)
        </button>
      </div>

      {/* Grid of Incidents */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {disciplineCases.map((c) => (
          <div
            key={c.id}
            className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-md"
          >
            <div>
              <div className="flex items-center justify-between">
                <span
                  className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                    c.severity === 'Minor'
                      ? 'bg-amber-100 text-amber-800'
                      : c.severity === 'Moderate'
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  Ukubwa: {c.severity}
                </span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                  {c.status}
                </span>
              </div>

              <h3 className="mt-2 text-sm font-bold text-slate-900">{c.title}</h3>
              <div className="mt-1 text-xs text-slate-600">
                Mwanafunzi: <strong className="text-slate-900">{c.studentName}</strong> ({c.admissionNumber}) • {c.streamName}
              </div>

              <p className="mt-2 text-xs text-slate-500 line-clamp-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                {c.description}
              </p>

              <div className="mt-3 text-xs">
                <span className="text-slate-500">Hatua Iliyochukuliwa:</span>
                <p className="font-semibold text-slate-800">{c.actionTaken}</p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Tarehe: {c.date}</span>
              <span className="font-semibold text-emerald-600">
                {c.parentNotified ? 'Mzazi Alijulishwa' : 'Mzazi Hajajulishwa'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Incident Modal */}
      {showAddCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Rekodi Kesi ya Nidhamu (Record Incident)</h3>
              <button onClick={() => setShowAddCase(false)} className="rounded-lg p-1 text-slate-400">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCase} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="mb-1 block font-semibold text-slate-700">Chagua Mwanafunzi *</label>
                <select
                  required
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:outline-hidden"
                >
                  <option value="">-- Chagua Mwanafunzi --</option>
                  {students.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.fullName} ({st.admissionNumber}) - {st.streamName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block font-semibold text-slate-700">Kichwa cha Tukio (Incident Title) *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="mf. Kuchelewa mara kwa mara asubuhi"
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-semibold text-slate-700">Uzito wa Tukio (Severity)</label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as any)}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:outline-hidden"
                  >
                    <option value="Minor">Kidogo (Minor)</option>
                    <option value="Moderate">Wastani (Moderate)</option>
                    <option value="Severe">Kikubwa (Severe)</option>
                    <option value="Critical">Dharura (Critical)</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block font-semibold text-slate-700">Arifa kwa Mzazi</label>
                  <select
                    value={parentNotified ? 'yes' : 'no'}
                    onChange={(e) => setParentNotified(e.target.value === 'yes')}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:outline-hidden"
                  >
                    <option value="yes">Ndio, Tuma Arifa</option>
                    <option value="no">Bado, Ya Ndani</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block font-semibold text-slate-700">Maelezo ya Tukio (Description)</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Eleza kile kilichotokea..."
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:outline-hidden"
                />
              </div>

              <div>
                <label className="mb-1 block font-semibold text-slate-700">Hatua Zilizochukuliwa (Action Taken)</label>
                <input
                  type="text"
                  value={actionTaken}
                  onChange={(e) => setActionTaken(e.target.value)}
                  placeholder="mf. Onyo la maandishi, wito kwa mzazi..."
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddCase(false)}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Ghairi
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-rose-600 px-4 py-1.5 font-bold text-white hover:bg-rose-700"
                >
                  Hifadhi Kesi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
