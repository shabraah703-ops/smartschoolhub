import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  Mail,
  Megaphone,
  MessageSquare,
  Plus,
  Send,
  Smartphone,
  Users,
  X,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const CommunicationPage: React.FC = () => {
  const {
    announcements,
    currentSchool,
    currentUser,
    addAnnouncement,
  } = useAuth();

  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [targetAudience, setTargetAudience] = useState<'All' | 'Teachers' | 'Parents' | 'Students'>('All');
  const [priority, setPriority] = useState<'Normal' | 'Important' | 'Urgent'>('Important');

  const [smsPreviewPhone, setSmsPreviewPhone] = useState('+255 754 990 112');
  const [smsSentNotice, setSmsSentNotice] = useState(false);

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    addAnnouncement({
      title: title.trim(),
      content: content.trim(),
      authorId: currentUser?.uid || 'user-001',
      authorName: currentUser?.fullName || 'School Authority',
      targetAudience,
      priority,
    });

    setShowAddModal(false);
    setTitle('');
    setContent('');
  };

  const handleTestSms = () => {
    setSmsSentNotice(true);
    setTimeout(() => setSmsSentNotice(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Mawasiliano na Arifa za SMS (School Communication & SMS Gateway)
          </h2>
          <p className="text-xs text-slate-500">
            Matangazo ya shule, vikundi vya walimu na wazazi, na mfumo wa arifa za matokeo kupitia SMS
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-emerald-700/20 hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" />
          Tunga Tangazo Jipya
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: School Announcements */}
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Megaphone className="h-4 w-4 text-emerald-600" />
              Matangazo Yote ya Shule (Official Bulletin Board)
            </h3>

            <div className="space-y-3">
              {announcements.map((anc) => (
                <div
                  key={anc.id}
                  className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-4 transition hover:bg-slate-50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">{anc.title}</h4>
                      <span
                        className={`rounded-full px-2 py-0.2 text-[9px] font-bold ${
                          anc.priority === 'Urgent'
                            ? 'bg-rose-100 text-rose-800'
                            : anc.priority === 'Important'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-sky-100 text-sky-800'
                        }`}
                      >
                        {anc.priority}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {new Date(anc.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">{anc.content}</p>

                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-200/60 pt-2">
                    <span>Mwandishi: <strong className="text-slate-700">{anc.authorName}</strong></span>
                    <span className="rounded bg-slate-200/70 px-2 py-0.5 font-medium text-slate-700">
                      Walengwa: {anc.targetAudience}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Automated SMS Notification Engine (Requirement #33) */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-3">
              <Smartphone className="h-5 w-5 text-sky-600" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Mlango wa SMS (SMS Gateway Abstraction)
                </h3>
                <p className="text-[11px] text-slate-500">Arifa za matokeo kwa wazazi</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 mb-3">
              Matokeo ya mtihani yanapotolewa na Mkuu wa Taaluma, mfumo hutuma arifa salama mara moja kwa wazazi:
            </p>

            {/* Live SMS Mockup */}
            <div className="rounded-2xl bg-slate-900 p-4 text-white shadow-inner space-y-2">
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span className="font-mono">Sender: {currentSchool?.code || 'SMARTHUB'}</span>
                <span>Sasa Hivi</span>
              </div>
              <div className="rounded-xl bg-slate-800 p-3 text-xs text-slate-200 border border-slate-700/60 font-mono">
                Habari Mzazi, matokeo ya mtihani ya mwanafunzi wako yametolewa rasmi na {currentSchool?.name}. Tafadhali ingia SMART SCHOOL HUB kutazama kadi ya matokeo: https://smartschool.tz
              </div>
              <p className="text-[10px] text-emerald-400">
                ✓ Taarifa za alama za siri hazitangazwi wazi kwenye SMS bali kupitia tovuti salama.
              </p>
            </div>

            <div className="mt-4 space-y-2">
              <label className="block text-[11px] font-bold text-slate-700">Jaribu Kutuma SMS ya Majaribio (Test SMS):</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={smsPreviewPhone}
                  onChange={(e) => setSmsPreviewPhone(e.target.value)}
                  className="flex-1 rounded-lg border border-slate-300 p-2 text-xs font-mono focus:outline-hidden"
                />
                <button
                  onClick={handleTestSms}
                  className="rounded-lg bg-sky-600 px-3 py-2 text-xs font-bold text-white hover:bg-sky-700"
                >
                  Tuma
                </button>
              </div>
              {smsSentNotice && (
                <div className="rounded-lg bg-emerald-50 p-2 text-[11px] font-bold text-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> SMS ya majaribio imetumwa kwa {smsPreviewPhone}!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Announcement Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Tunga Tangazo Jipya (Create Announcement)</h3>
              <button onClick={() => setShowAddModal(false)} className="rounded-lg p-1 text-slate-400">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAnnouncement} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="mb-1 block font-semibold text-slate-700">Kichwa cha Tangazo (Title) *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="mf. Tarehe ya Mkutano Mkuu wa Wazazi"
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-semibold text-slate-700">Walengwa (Target Audience)</label>
                  <select
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value as any)}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:outline-hidden"
                  >
                    <option value="All">Wote (All)</option>
                    <option value="Parents">Wazazi Tu (Parents)</option>
                    <option value="Teachers">Walimu Tu (Teachers)</option>
                    <option value="Students">Wanafunzi Tu (Students)</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block font-semibold text-slate-700">Kipaumbele (Priority)</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:outline-hidden"
                  >
                    <option value="Normal">Kawaida (Normal)</option>
                    <option value="Important">Muhimu (Important)</option>
                    <option value="Urgent">Dharura (Urgent)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block font-semibold text-slate-700">Ujumbe wa Tangazo (Content) *</label>
                <textarea
                  required
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Andika maelezo ya kina ya tangazo..."
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
                  className="rounded-lg bg-emerald-600 px-4 py-1.5 font-bold text-white hover:bg-emerald-700"
                >
                  Chapisha Tangazo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
