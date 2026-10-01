import React, { useState } from 'react';
import {
  Award,
  BookOpen,
  GraduationCap,
  Layers,
  School,
  Search,
  UserCheck,
  Users,
  X,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const {
    students,
    memberships,
    subjects,
    streams,
    departments,
    combinations,
  } = useAuth();

  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  const matchedStudents = q
    ? students.filter(
        (s) =>
          s.fullName.toLowerCase().includes(q) ||
          s.studentId.toLowerCase().includes(q) ||
          s.admissionNumber.toLowerCase().includes(q)
      )
    : [];

  const matchedTeachers = q
    ? memberships.filter(
        (m) =>
          m.userName.toLowerCase().includes(q) ||
          m.userEmail.toLowerCase().includes(q)
      )
    : [];

  const matchedSubjects = q
    ? subjects.filter(
        (s) => s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q)
      )
    : [];

  const matchedStreams = q
    ? streams.filter(
        (s) => s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q)
      )
    : [];

  const matchedDepartments = q
    ? departments.filter(
        (d) => d.name.toLowerCase().includes(q) || d.code.toLowerCase().includes(q)
      )
    : [];

  const matchedCombinations = q
    ? combinations.filter(
        (c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
      )
    : [];

  const totalMatches =
    matchedStudents.length +
    matchedTeachers.length +
    matchedSubjects.length +
    matchedStreams.length +
    matchedDepartments.length +
    matchedCombinations.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/60 p-4 pt-16 backdrop-blur-xs">
      <div className="w-full max-w-xl rounded-2xl bg-white p-4 shadow-2xl">
        <div className="relative flex items-center border-b border-slate-200 pb-3">
          <Search className="absolute left-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tafuta mwanafunzi, mwalimu, somo, mkondo, au idara..."
            className="w-full py-1 pr-8 pl-9 text-xs font-semibold text-slate-800 focus:outline-hidden placeholder:text-slate-400"
          />
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto py-2 space-y-3 text-xs">
          {!q && (
            <p className="py-6 text-center text-slate-400 text-xs">
              Andika jina, namba ya usajili au kifupi cha somo kuanza kutafuta.
            </p>
          )}

          {q && totalMatches === 0 && (
            <p className="py-6 text-center text-slate-400 text-xs">
              Hakuna matokeo yaliyopatikana kwa "{query}".
            </p>
          )}

          {/* Students */}
          {matchedStudents.length > 0 && (
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">
                Wanafunzi ({matchedStudents.length})
              </span>
              <div className="mt-1 space-y-1">
                {matchedStudents.map((st) => (
                  <button
                    key={st.id}
                    onClick={() => {
                      onClose();
                      onNavigate('students');
                    }}
                    className="flex w-full items-center justify-between rounded-lg p-2 text-left hover:bg-sky-50 transition"
                  >
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-sky-600" />
                      <div>
                        <p className="font-bold text-slate-900">{st.fullName}</p>
                        <p className="text-[10px] text-slate-500 font-mono">
                          {st.admissionNumber} • {st.streamName || st.formStandard}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] text-sky-600 font-semibold">Tazama →</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Teachers */}
          {matchedTeachers.length > 0 && (
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">
                Walimu na Watumishi ({matchedTeachers.length})
              </span>
              <div className="mt-1 space-y-1">
                {matchedTeachers.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      onClose();
                      onNavigate('teachers');
                    }}
                    className="flex w-full items-center justify-between rounded-lg p-2 text-left hover:bg-emerald-50 transition"
                  >
                    <div className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4 text-emerald-600" />
                      <div>
                        <p className="font-bold text-slate-900">{t.userName}</p>
                        <p className="text-[10px] text-slate-500">{t.positions.join(', ')}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-emerald-600 font-semibold">Tazama →</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Subjects */}
          {matchedSubjects.length > 0 && (
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">
                Masomo ({matchedSubjects.length})
              </span>
              <div className="mt-1 space-y-1">
                {matchedSubjects.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      onClose();
                      onNavigate('subjects');
                    }}
                    className="flex w-full items-center justify-between rounded-lg p-2 text-left hover:bg-purple-50 transition"
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-purple-600" />
                      <div>
                        <p className="font-bold text-slate-900">{s.name}</p>
                        <p className="text-[10px] font-mono text-slate-500">{s.code} • {s.level}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-purple-600 font-semibold">Tazama →</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
