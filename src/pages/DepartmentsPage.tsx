import React, { useState } from 'react';
import {
  BookOpen,
  Building,
  CheckCircle2,
  Edit2,
  Plus,
  School,
  UserCheck,
  Users,
  X,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Department } from '../types';

export const DepartmentsPage: React.FC = () => {
  const {
    departments,
    subjects,
    memberships,
    addDepartment,
    updateDepartment,
    changeHod,
  } = useAuth();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);

  // New Department fields
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [hodId, setHodId] = useState('');

  // Registered teachers within the school (Requirement #18)
  const availableTeachers = memberships.filter(
    (m) => m.positions.includes('Teacher') || m.positions.includes('Head of Department')
  );

  const handleCreateDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const teacher = availableTeachers.find((t) => t.userId === hodId);

    addDepartment({
      name: name.trim(),
      code: code.trim() || name.substring(0, 4).toUpperCase(),
      description: description.trim(),
      hodId: hodId || undefined,
      hodName: teacher ? teacher.userName : undefined,
      memberIds: hodId ? [hodId] : [],
    });

    setShowAddModal(false);
    setName('');
    setCode('');
    setDescription('');
    setHodId('');
  };

  const handleSaveHodChange = (deptId: string, newHodUserId: string) => {
    const teacher = availableTeachers.find((t) => t.userId === newHodUserId);
    if (!teacher) return;
    changeHod(deptId, teacher.userId, teacher.userName);
    setEditingDept(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Idara za Shule (School Departments)
          </h2>
          <p className="text-xs text-slate-500">
            Usimamizi wa idara za kitaaluma, wakuu wa idara (HOD), masomo na walimu wa idara
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 rounded-xl bg-sky-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-sky-700/20 hover:bg-sky-700"
        >
          <Plus className="h-4 w-4" />
          Unda Idara Mpya
        </button>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {departments.map((dept) => {
          const deptSubjects = subjects.filter((s) => s.departmentId === dept.id);
          const deptTeachers = memberships.filter((m) => m.departmentId === dept.id || dept.memberIds.includes(m.userId));

          return (
            <div
              key={dept.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-md hover:border-emerald-300"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    {dept.code}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.2 text-[10px] font-bold ${
                      dept.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {dept.status}
                  </span>
                </div>

                <h3 className="mt-2 text-base font-bold text-slate-900">{dept.name}</h3>
                <p className="mt-1 text-xs text-slate-500 line-clamp-2">{dept.description}</p>

                <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs space-y-2 border border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Mkuu wa Idara (HOD):</span>
                    <button
                      onClick={() => setEditingDept(dept)}
                      className="flex items-center gap-1 text-[11px] font-bold text-sky-600 hover:text-sky-800"
                    >
                      <Edit2 className="h-3 w-3" />
                      Badili
                    </button>
                  </div>
                  <p className="font-bold text-slate-900">{dept.hodName || 'Hajateuliwa'}</p>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-slate-600">
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-3.5 w-3.5 text-sky-600" />
                    Masomo: <strong className="text-slate-800">{deptSubjects.length}</strong>
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5 text-emerald-600" />
                    Walimu: <strong className="text-slate-800">{deptTeachers.length}</strong>
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <span className="text-[10px] text-slate-400">
                  Imesajiliwa: {new Date(dept.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Department Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Unda Idara Mpya (Create Department)</h3>
              <button onClick={() => setShowAddModal(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDepartment} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="mb-1 block font-semibold text-slate-700">Jina la Idara (Department Name) *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="mf. Idara ya Sayansi ya Maabara"
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:outline-hidden"
                />
              </div>

              <div>
                <label className="mb-1 block font-semibold text-slate-700">Kifupi cha Idara (Code) *</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="mf. SCI au ARTS au COMM"
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs font-mono uppercase focus:outline-hidden"
                />
              </div>

              <div>
                <label className="mb-1 block font-semibold text-slate-700">
                  Mkuu wa Idara (HOD - Lazima awe mwalimu aliyesajiliwa) *
                </label>
                <select
                  required
                  value={hodId}
                  onChange={(e) => setHodId(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:outline-hidden"
                >
                  <option value="">-- Chagua Mwalimu wa Shule Hii --</option>
                  {availableTeachers.map((t) => (
                    <option key={t.userId} value={t.userId}>
                      {t.userName} ({t.userEmail})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block font-semibold text-slate-700">Maelezo ya Idara (Description)</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Majukumu na maelezo ya idara..."
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
                  Hifadhi Idara
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change HOD Modal (Requirement #18: strict selection from staff & audit) */}
      {editingDept && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Badili HOD: {editingDept.name}</h3>
              <button onClick={() => setEditingDept(null)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-3 space-y-3 text-xs">
              <p className="text-slate-600">
                HOD wa sasa: <strong className="text-slate-900">{editingDept.hodName || 'Hakuna'}</strong>
              </p>

              <div>
                <label className="mb-1 block font-semibold text-slate-700">Chagua HOD Mpya (Registered Teacher)</label>
                <select
                  id="new-hod-select"
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:outline-hidden"
                >
                  {availableTeachers.map((t) => (
                    <option key={t.userId} value={t.userId}>
                      {t.userName} ({t.userEmail})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingDept(null)}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Ghairi
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const sel = (document.getElementById('new-hod-select') as HTMLSelectElement).value;
                    handleSaveHodChange(editingDept.id, sel);
                  }}
                  className="rounded-lg bg-emerald-600 px-4 py-1.5 font-bold text-white hover:bg-emerald-700"
                >
                  Thibitisha & Hifadhi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
