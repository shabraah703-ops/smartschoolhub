import React, { useState } from 'react';
import { ArrowRightLeft, History, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Student } from '../../types';

interface StudentMovementModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
}

export const StudentMovementModal: React.FC<StudentMovementModalProps> = ({
  isOpen,
  onClose,
  student,
}) => {
  const { streams, combinations, moveStudent } = useAuth();

  const [movementType, setMovementType] = useState<
    'Stream Change' | 'Combination Change' | 'Class Promotion' | 'Transfer' | 'Graduation' | 'Status Change'
  >('Stream Change');
  const [targetValue, setTargetValue] = useState('');
  const [reason, setReason] = useState('');

  if (!isOpen || !student) return null;

  const handleExecute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetValue.trim()) return;

    moveStudent(student.id, movementType, targetValue.trim(), reason.trim() || 'Official school administrative decision');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-600 text-white">
              <ArrowRightLeft className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Uhamisho wa Mwanafunzi (Student Movement)</h3>
              <p className="text-[11px] text-slate-500">{student.fullName} ({student.admissionNumber})</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Current status */}
        <div className="my-3 rounded-lg bg-slate-50 p-2.5 text-xs text-slate-700 border border-slate-200">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[10px] text-slate-500 uppercase">Darasa la Sasa:</span>
              <p className="font-semibold">{student.formStandard}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase">Mkondo wa Sasa:</span>
              <p className="font-semibold">{student.streamName || 'Hajapangiwa'}</p>
            </div>
            {student.level === 'A-Level' && (
              <div>
                <span className="text-[10px] text-slate-500 uppercase">Mchepuo (Combination):</span>
                <p className="font-semibold font-mono">{student.combinationCode || 'None'}</p>
              </div>
            )}
            <div>
              <span className="text-[10px] text-slate-500 uppercase">Hali (Status):</span>
              <p className="font-semibold">{student.status}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleExecute} className="space-y-3 text-xs">
          <div>
            <label className="mb-1 block font-semibold text-slate-700">Aina ya Uhamisho (Movement Type)</label>
            <select
              value={movementType}
              onChange={(e) => {
                setMovementType(e.target.value as any);
                setTargetValue('');
              }}
              className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-sky-500 focus:outline-hidden"
            >
              <option value="Stream Change">Badili Mkondo (Change Stream)</option>
              {student.level === 'A-Level' && (
                <option value="Combination Change">Badili Mchepuo wa Masomo (Change Combination)</option>
              )}
              <option value="Class Promotion">Pandisha Darasa (Promote Class)</option>
              <option value="Graduation">Mhitimu (Graduate Student)</option>
              <option value="Transfer">Hamisha Shule Nyingine (Transfer Student)</option>
              <option value="Status Change">Badili Hali (Status Change - e.g. Suspended)</option>
            </select>
          </div>

          {/* Conditional target input */}
          {movementType === 'Stream Change' && (
            <div>
              <label className="mb-1 block font-semibold text-slate-700">Mkondo Mpya (New Stream)</label>
              <select
                required
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-sky-500 focus:outline-hidden"
              >
                <option value="">-- Chagua Mkondo --</option>
                {streams.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name} ({s.formStandard})
                  </option>
                ))}
              </select>
            </div>
          )}

          {movementType === 'Combination Change' && (
            <div>
              <label className="mb-1 block font-semibold text-slate-700">Mchepuo Mpya (New Combination)</label>
              <select
                required
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-sky-500 focus:outline-hidden"
              >
                <option value="">-- Chagua Combination --</option>
                {combinations.map((c) => (
                  <option key={c.id} value={c.code}>
                    {c.code} - {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {movementType === 'Class Promotion' && (
            <div>
              <label className="mb-1 block font-semibold text-slate-700">Darasa Jipya (Promoted Class)</label>
              <input
                type="text"
                required
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
                placeholder="mf. Form II, Form III, Form IV, Form VI"
                className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-sky-500 focus:outline-hidden"
              />
            </div>
          )}

          {movementType === 'Graduation' && (
            <div>
              <label className="mb-1 block font-semibold text-slate-700">Thibitisha Kuhitimu (Confirm Graduation)</label>
              <input
                type="text"
                required
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
                placeholder="Andika 'Graduated' au Mwaka mf. Class of 2026"
                className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-sky-500 focus:outline-hidden"
              />
            </div>
          )}

          {movementType === 'Transfer' && (
            <div>
              <label className="mb-1 block font-semibold text-slate-700">Shule Anakohamia (Destination School)</label>
              <input
                type="text"
                required
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
                placeholder="mf. Kibaha Secondary School (Pwani)"
                className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-sky-500 focus:outline-hidden"
              />
            </div>
          )}

          {movementType === 'Status Change' && (
            <div>
              <label className="mb-1 block font-semibold text-slate-700">Hali Mpya (New Status)</label>
              <select
                required
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-sky-500 focus:outline-hidden"
              >
                <option value="">-- Chagua Hali --</option>
                <option value="Active">Active</option>
                <option value="Suspended">Suspended</option>
                <option value="Withdrawn">Withdrawn</option>
              </select>
            </div>
          )}

          <div>
            <label className="mb-1 block font-semibold text-slate-700">Sababu ya Uamuzi (Reason / Justification)</label>
            <textarea
              required
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="mf. Maombi ya mzazi, matokeo ya mtihani, au uamuzi wa bodi ya taaluma..."
              className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-sky-500 focus:outline-hidden"
            />
          </div>

          {/* Historical Movement Log */}
          {student.movementHistory && student.movementHistory.length > 0 && (
            <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-2 text-[11px]">
              <div className="mb-1 flex items-center gap-1 font-bold text-slate-700">
                <History className="h-3 w-3 text-slate-500" />
                Historia ya Mwanafunzi (Movement Trail)
              </div>
              <div className="space-y-1">
                {student.movementHistory.map((h) => (
                  <div key={h.id} className="text-slate-600">
                    <span className="font-semibold text-slate-800">{h.type}:</span> {h.fromValue} → {h.toValue} ({new Date(h.timestamp).toLocaleDateString()}) - <span className="italic">{h.reason}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-50"
            >
              Ghairi
            </button>
            <button
              type="submit"
              className="rounded-lg bg-sky-600 px-4 py-1.5 font-bold text-white shadow-xs hover:bg-sky-700"
            >
              Tekeleza Uhamisho (Execute)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
