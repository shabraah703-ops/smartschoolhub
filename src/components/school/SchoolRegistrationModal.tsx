import React, { useState } from 'react';
import { Building2, Check, Globe, GraduationCap, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { EDUCATION_LEVEL_OPTIONS, TANZANIA_REGIONS } from '../../constants/tanzania';
import { EducationLevel, SchoolOwnershipType } from '../../types';

interface SchoolRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const SchoolRegistrationModal: React.FC<SchoolRegistrationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { registerSchool } = useAuth();

  const [name, setName] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [ownershipType, setOwnershipType] = useState<SchoolOwnershipType>('Private');
  const [educationLevels, setEducationLevels] = useState<EducationLevel[]>(['O-Level', 'A-Level']);
  const [region, setRegion] = useState('Dar es Salaam');
  const [district, setDistrict] = useState('Ilala');
  const [ward, setWard] = useState('Kariakoo');
  const [address, setAddress] = useState('Plot 15, Uhuru Street');
  const [phone, setPhone] = useState('+255 700 000 000');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [motto, setMotto] = useState('Strive for Excellence and Integrity');
  const [academicYear, setAcademicYear] = useState('2026');
  const [currentTerm, setCurrentTerm] = useState('Term 1');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const toggleLevel = (lvl: EducationLevel) => {
    if (educationLevels.includes(lvl)) {
      if (educationLevels.length > 1) {
        setEducationLevels(educationLevels.filter((l) => l !== lvl));
      }
    } else {
      setEducationLevels([...educationLevels, lvl]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Tafadhali ingiza jina la shule (Please enter school name).');
      return;
    }
    if (educationLevels.length === 0) {
      setError('Chagua angalau ngazi moja ya elimu (Select at least one education level).');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await registerSchool({
        name: name.trim(),
        registrationNumber: registrationNumber.trim() || `S.${Math.floor(1000 + Math.random() * 9000)}/2026`,
        ownershipType,
        educationLevels,
        region,
        district: district.trim(),
        ward: ward.trim(),
        address: address.trim(),
        phone: phone.trim(),
        email: email.trim() || `admin@${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.ac.tz`,
        website: website.trim(),
        motto: motto.trim(),
        academicYear,
        currentTerm,
      });

      onClose();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err?.message || 'Hitilafu wakati wa kusajili shule.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Sajili Shule Mpya (Register New School)</h3>
              <p className="text-xs text-slate-500">
                Utakuwa Mmiliki wa Shule (School Owner) na Mamlaka Kuu ya Mfumo
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-lg bg-rose-50 p-3 text-xs font-medium text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          {/* Section 1: Basic Profile */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block font-semibold text-slate-700">
                Jina la Shule (School Name) *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="mf. St. Matthew Secondary School"
                className="w-full rounded-lg border border-slate-300 p-2.5 text-xs focus:border-sky-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="mb-1 block font-semibold text-slate-700">
                Namba ya Usajili (Registration No.)
              </label>
              <input
                type="text"
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value)}
                placeholder="mf. S.5420/2021"
                className="w-full rounded-lg border border-slate-300 p-2.5 text-xs focus:border-sky-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Section 2: Ownership & Education Levels */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block font-semibold text-slate-700">
                Aina ya Umiliki (Ownership Type)
              </label>
              <select
                value={ownershipType}
                onChange={(e) => setOwnershipType(e.target.value as SchoolOwnershipType)}
                className="w-full rounded-lg border border-slate-300 p-2.5 text-xs focus:border-sky-500 focus:outline-hidden"
              >
                <option value="Private">Binafsi (Private)</option>
                <option value="Government">Serikali (Government)</option>
                <option value="Faith-based">Taasisi ya Kidini (Faith-based)</option>
                <option value="Community">Jumuiya (Community)</option>
                <option value="International">Kimataifa (International)</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block font-semibold text-slate-700">
                Mwaka wa Masomo & Muhula
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-1/2 rounded-lg border border-slate-300 p-2.5 text-xs focus:border-sky-500 focus:outline-hidden"
                  placeholder="Mwaka 2026"
                />
                <select
                  value={currentTerm}
                  onChange={(e) => setCurrentTerm(e.target.value)}
                  className="w-1/2 rounded-lg border border-slate-300 p-2.5 text-xs focus:border-sky-500 focus:outline-hidden"
                >
                  <option value="Term 1">Muhula wa 1 (Term 1)</option>
                  <option value="Term 2">Muhula wa 2 (Term 2)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Education Levels Checklist */}
          <div>
            <label className="mb-1.5 block font-semibold text-slate-700">
              Ngazi za Elimu Zinazotolewa (Offered Education Levels) *
            </label>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {EDUCATION_LEVEL_OPTIONS.map((opt) => {
                const isSelected = educationLevels.includes(opt.level);
                return (
                  <div
                    key={opt.level}
                    onClick={() => toggleLevel(opt.level)}
                    className={`flex cursor-pointer items-start gap-2 rounded-xl border p-3 transition ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/60 text-emerald-950 font-semibold'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div
                      className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                        isSelected ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="h-3 w-3" />}
                    </div>
                    <div>
                      <p className="text-xs font-bold">{opt.level}</p>
                      <p className="text-[10px] text-slate-500">{opt.subtext}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Location Details */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <label className="mb-1 block font-semibold text-slate-700">Mkoa (Region)</label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2.5 text-xs focus:border-sky-500 focus:outline-hidden"
              >
                {TANZANIA_REGIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block font-semibold text-slate-700">Wilaya (District)</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2.5 text-xs focus:border-sky-500 focus:outline-hidden"
                placeholder="mf. Nyamagana"
              />
            </div>
            <div>
              <label className="mb-1 block font-semibold text-slate-700">Kata (Ward)</label>
              <input
                type="text"
                value={ward}
                onChange={(e) => setWard(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2.5 text-xs focus:border-sky-500 focus:outline-hidden"
                placeholder="mf. Mirongo"
              />
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <label className="mb-1 block font-semibold text-slate-700">Simu (Phone)</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2.5 text-xs focus:border-sky-500 focus:outline-hidden"
                placeholder="+255 7..."
              />
            </div>
            <div>
              <label className="mb-1 block font-semibold text-slate-700">Barua Pepe (Email)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2.5 text-xs focus:border-sky-500 focus:outline-hidden"
                placeholder="info@shule.ac.tz"
              />
            </div>
            <div>
              <label className="mb-1 block font-semibold text-slate-700">Tovuti (Website)</label>
              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2.5 text-xs focus:border-sky-500 focus:outline-hidden"
                placeholder="https://..."
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block font-semibold text-slate-700">Kauli Mbiu (School Motto)</label>
            <input
              type="text"
              value={motto}
              onChange={(e) => setMotto(e.target.value)}
              className="w-full rounded-lg border border-slate-300 p-2.5 text-xs focus:border-sky-500 focus:outline-hidden"
              placeholder="mf. Elimu ni Nguvu na Maarifa"
            />
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50"
            >
              Ghairi (Cancel)
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2 font-bold text-white shadow-md hover:bg-emerald-700 disabled:opacity-50"
            >
              {loading ? 'Inasajili...' : 'Kamilisha Usajili (Register School)'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
