import React, { useState } from 'react';
import { Building, KeyRound, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface JoinSchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const JoinSchoolModal: React.FC<JoinSchoolModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { joinSchoolByCode } = useAuth();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  if (!isOpen) return null;

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setMessage(null);

    const res = await joinSchoolByCode(code.trim());
    setLoading(false);

    if (res.success) {
      setMessage({ text: res.message, type: 'success' });
      setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess();
      }, 1000);
    } else {
      setMessage({ text: res.message, type: 'error' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-600 text-white">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Jiunge na Shule (Join School)</h3>
              <p className="text-[11px] text-slate-500">Ingiza Namba ya Shule (School Code)</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        {message && (
          <div
            className={`mt-3 rounded-lg p-2.5 text-xs font-medium ${
              message.type === 'success'
                ? 'bg-emerald-50 text-emerald-800'
                : 'bg-rose-50 text-rose-800'
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleJoin} className="mt-4 space-y-4 text-xs">
          <div>
            <label className="mb-1 block font-semibold text-slate-700">
              Namba ya Shule (School Code)
            </label>
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="mf. TZS-MWZ-891"
              className="w-full rounded-lg border border-slate-300 p-2.5 font-mono text-xs uppercase tracking-wider focus:border-sky-500 focus:outline-hidden"
            />
            <p className="mt-1 text-[11px] text-slate-500">
              Mfano wa code ya shule ya majaribio: <strong className="font-mono text-sky-700">TZS-MWZ-891</strong>
            </p>
          </div>

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
              disabled={loading}
              className="rounded-lg bg-sky-600 px-4 py-1.5 font-bold text-white shadow-xs hover:bg-sky-700 disabled:opacity-50"
            >
              {loading ? 'Inaunganisha...' : 'Tuma Ombi / Jiunge'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
