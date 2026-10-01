import React, { useState } from 'react';
import { UserPlus, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { EducationLevel } from '../../types';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddStudentModal: React.FC<AddStudentModalProps> = ({ isOpen, onClose }) => {
  const { currentSchool, streams, combinations, addStudent } = useAuth();

  const [fullName, setFullName] = useState('');
  const [admissionNumber, setAdmissionNumber] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [dateOfBirth, setDateOfBirth] = useState('2009-05-15');
  const [level, setLevel] = useState<EducationLevel>(
    (currentSchool?.educationLevels[0] as EducationLevel) || 'O-Level'
  );
  const [formStandard, setFormStandard] = useState('Form I');
  const [streamId, setStreamId] = useState('');
  const [combinationId, setCombinationId] = useState('');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('+255 7');
  const [parentEmail, setParentEmail] = useState('');
  const [address, setAddress] = useState('');
  const [previousSchool, setPreviousSchool] = useState('');

  if (!isOpen) return null;

  // Filter streams by selected level
  const availableStreams = streams.filter((s) => s.level === level);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !admissionNumber.trim() || !parentName.trim()) {
      alert('Tafadhali jaza taarifa zote muhimu.');
      return;
    }

    const selectedStr = streams.find((s) => s.id === streamId);
    const selectedComb = combinations.find((c) => c.id === combinationId);

    addStudent({
      admissionNumber: admissionNumber.trim(),
      fullName: fullName.trim(),
      gender,
      dateOfBirth,
      level,
      formStandard,
      streamId: streamId || availableStreams[0]?.id || 'default-stream',
      streamName: selectedStr ? selectedStr.name : availableStreams[0]?.name || formStandard,
      combinationId: level === 'A-Level' ? combinationId : undefined,
      combinationCode: level === 'A-Level' && selectedComb ? selectedComb.code : undefined,
      parentName: parentName.trim(),
      parentPhone: parentPhone.trim(),
      parentEmail: parentEmail.trim() || undefined,
      address: address.trim(),
      previousSchool: previousSchool.trim() || undefined,
      admissionDate: new Date().toISOString().split('T')[0],
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Sajili Mwanafunzi Mpya (New Student)</h3>
              <p className="text-[11px] text-slate-500">{currentSchool?.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          {/* Names & Admission */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block font-semibold text-slate-700">Jina Kamili la Mwanafunzi *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="mf. Daudi Juma Msangi"
                className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-sky-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="mb-1 block font-semibold text-slate-700">Namba ya Usajili (Admission No.) *</label>
              <input
                type="text"
                required
                value={admissionNumber}
                onChange={(e) => setAdmissionNumber(e.target.value)}
                placeholder="mf. MWS/2026/055"
                className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-sky-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Gender & DOB */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block font-semibold text-slate-700">Jinsia (Gender)</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as 'Male' | 'Female')}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-sky-500 focus:outline-hidden"
              >
                <option value="Male">Mvulana (Male)</option>
                <option value="Female">Msichana (Female)</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block font-semibold text-slate-700">Tarehe ya Kuzaliwa</label>
              <input
                type="date"
                required
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-sky-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Level, Form, Stream */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <label className="mb-1 block font-semibold text-slate-700">Ngazi ya Elimu</label>
              <select
                value={level}
                onChange={(e) => {
                  const newLvl = e.target.value as EducationLevel;
                  setLevel(newLvl);
                  if (newLvl === 'Primary') setFormStandard('Standard 1');
                  else if (newLvl === 'O-Level') setFormStandard('Form I');
                  else setFormStandard('Form V');
                }}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-sky-500 focus:outline-hidden"
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
                className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-sky-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="mb-1 block font-semibold text-slate-700">Mkondo (Stream)</label>
              <select
                value={streamId}
                onChange={(e) => setStreamId(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-sky-500 focus:outline-hidden"
              >
                <option value="">-- Chagua Mkondo --</option>
                {availableStreams.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* If A-Level: Combination Selection */}
          {level === 'A-Level' && (
            <div className="rounded-xl bg-purple-50 p-3 border border-purple-200">
              <label className="mb-1 block font-semibold text-purple-900">
                Mchepuo wa Masomo ya A-Level (Combination) *
              </label>
              <select
                required
                value={combinationId}
                onChange={(e) => setCombinationId(e.target.value)}
                className="w-full rounded-lg border border-purple-300 bg-white p-2 text-xs focus:outline-hidden"
              >
                <option value="">-- Chagua Combination --</option>
                {combinations.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code} - {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Parent Details */}
          <div className="border-t border-slate-100 pt-3">
            <h4 className="font-bold text-slate-800 mb-2">Taarifa za Mzazi au Mlezi (Parent/Guardian)</h4>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block font-semibold text-slate-700">Jina Kamili la Mzazi *</label>
                <input
                  type="text"
                  required
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  placeholder="mf. Juma Bakari Msangi"
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-sky-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="mb-1 block font-semibold text-slate-700">Namba ya Simu ya Mzazi *</label>
                <input
                  type="text"
                  required
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value)}
                  placeholder="+255 7..."
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-sky-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block font-semibold text-slate-700">Makazi (Address)</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="mf. Nyamagana, Mwanza"
                className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-sky-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="mb-1 block font-semibold text-slate-700">Shule Aliyotoka (Previous School)</label>
              <input
                type="text"
                value={previousSchool}
                onChange={(e) => setPreviousSchool(e.target.value)}
                placeholder="mf. Capripoint Primary School"
                className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-sky-500 focus:outline-hidden"
              />
            </div>
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
              className="rounded-lg bg-emerald-600 px-4 py-1.5 font-bold text-white shadow-xs hover:bg-emerald-700"
            >
              Hifadhi Mwanafunzi (Save)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
