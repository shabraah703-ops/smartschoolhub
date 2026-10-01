import React, { useState } from 'react';
import {
  Briefcase,
  Check,
  CheckCircle2,
  Clock,
  Mail,
  Phone,
  Plus,
  Shield,
  UserCheck,
  UserPlus,
  Users,
  X,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { POSITION_OPTIONS } from '../constants/tanzania';
import { PositionTitle, SchoolMembership } from '../types';

export const TeachersStaffPage: React.FC = () => {
  const {
    memberships,
    departments,
    streams,
    subjects,
    currentSchool,
    addAuditLog,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'staff' | 'join-requests'>('staff');
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [selectedStaffForPosition, setSelectedStaffForPosition] = useState<SchoolMembership | null>(null);

  // Filter staff vs requests
  const activeStaff = memberships.filter((m) => m.status === 'active');
  const pendingRequests = memberships.filter((m) => m.status === 'pending');

  const handleApproveRequest = (mem: SchoolMembership) => {
    addAuditLog('APPROVED_TEACHER_REQUEST', 'Membership', `Approved joining request for ${mem.userName} (${mem.userEmail})`);
    alert(`Ombi la ${mem.userName} limeidhinishwa rasmi!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Muundo wa Uongozi na Watumishi (Staff & Leadership Directory)
          </h2>
          <p className="text-xs text-slate-500">
            Wafanyakazi {activeStaff.length} • Nafasi za kiutawala, idara na madarasa wanayofundisha
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddStaffModal(true)}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-emerald-700/20 hover:bg-emerald-700"
          >
            <UserPlus className="h-4 w-4" />
            Sajili Mfanyakazi / Mwalimu
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('staff')}
          className={`flex items-center gap-2 border-b-2 py-3 px-4 text-xs font-bold transition ${
            activeTab === 'staff'
              ? 'border-sky-600 text-sky-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <UserCheck className="h-4 w-4" />
          Wafanyakazi Waliopo ({activeStaff.length})
        </button>
        <button
          onClick={() => setActiveTab('join-requests')}
          className={`flex items-center gap-2 border-b-2 py-3 px-4 text-xs font-bold transition ${
            activeTab === 'join-requests'
              ? 'border-sky-600 text-sky-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Clock className="h-4 w-4" />
          Maombi ya Kujiunga kwa Code (Join Requests)
          {pendingRequests.length > 0 && (
            <span className="rounded-full bg-amber-100 px-1.5 py-0.2 text-[10px] text-amber-800 font-bold">
              {pendingRequests.length}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: ACTIVE STAFF DIRECTORY */}
      {activeTab === 'staff' && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {activeStaff.map((staff) => {
            const dept = departments.find((d) => d.id === staff.departmentId);

            return (
              <div
                key={staff.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-md hover:border-sky-300"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 font-bold text-white text-sm">
                        {staff.userName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">{staff.userName}</h3>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Mail className="h-3 w-3 text-slate-400" />
                          {staff.userEmail}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Positions tags */}
                  <div className="mt-3.5 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Nafasi & Majukumu:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {staff.positions.map((pos) => (
                        <span
                          key={pos}
                          className="rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-900 border border-amber-200/60"
                        >
                          {pos}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Department & Stream Info */}
                  <div className="mt-3 rounded-xl bg-slate-50 p-2.5 text-xs text-slate-600 space-y-1">
                    <p>
                      Idara: <strong className="text-slate-800">{dept ? dept.name : '—'}</strong>
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Imejiunga: {new Date(staff.joinedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    onClick={() => setSelectedStaffForPosition(staff)}
                    className="font-bold text-sky-600 hover:text-sky-800"
                  >
                    Gawa Nafasi / Mamlaka →
                  </button>
                  <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">
                    Hai (Active)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: JOIN REQUESTS (Requirement #20) */}
      {activeTab === 'join-requests' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-sky-100 bg-sky-50/70 p-4 text-xs text-sky-950">
            <h4 className="font-bold">Kuhusu Maombi ya Walimu (Teacher Join Requests)</h4>
            <p className="mt-1 text-slate-600">
              Walimu wanaweza kuingiza Namba ya Shule (<strong className="font-mono text-sky-800">{currentSchool?.code}</strong>) kwenye akaunti zao. Ombi lao likifika hapa, Mmiliki au Utawala anaweza kulikubali na kumkabidhi majukumu rasmi.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-semibold">Jina la Mwalimu</th>
                  <th className="py-3 px-4 font-semibold">Barua Pepe</th>
                  <th className="py-3 px-4 font-semibold">Tarehe ya Ombi</th>
                  <th className="py-3 px-4 font-semibold">Hali</th>
                  <th className="py-3 px-4 font-semibold text-right">Kitendo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pendingRequests.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500">
                      Hakuna maombi mapya ya kujiunga yaliyosubiri kwa sasa.
                    </td>
                  </tr>
                ) : (
                  pendingRequests.map((req) => (
                    <tr key={req.id}>
                      <td className="py-3 px-4 font-bold text-slate-900">{req.userName}</td>
                      <td className="py-3 px-4 text-slate-600">{req.userEmail}</td>
                      <td className="py-3 px-4 text-slate-500">{new Date(req.joinedAt).toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                          Pending Approval
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleApproveRequest(req)}
                          className="rounded-lg bg-emerald-600 px-3 py-1 font-bold text-white hover:bg-emerald-700"
                        >
                          Kubali Ombi (Approve)
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Assign Positions Modal */}
      {selectedStaffForPosition && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Gawa Nafasi: {selectedStaffForPosition.userName}
                </h3>
                <p className="text-[11px] text-slate-500">{selectedStaffForPosition.userEmail}</p>
              </div>
              <button onClick={() => setSelectedStaffForPosition(null)} className="rounded-lg p-1 text-slate-400">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-3 space-y-3 text-xs">
              <p className="text-slate-600">
                Chagua nafasi za mfanyakazi huyu (Mtu mmoja anaweza kuwa na nafasi zaidi ya moja, mfano: Mwalimu + HOD):
              </p>

              <div className="space-y-1.5 max-h-60 overflow-y-auto rounded-xl border border-slate-200 p-2">
                {POSITION_OPTIONS.slice(1, 13).map((p) => {
                  const hasPos = selectedStaffForPosition.positions.includes(p.title as PositionTitle);
                  return (
                    <div
                      key={p.title}
                      className={`flex cursor-pointer items-center justify-between rounded-lg p-2 transition ${
                        hasPos ? 'bg-amber-100 text-amber-950 font-bold' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div>
                        <p>{p.title}</p>
                        <p className="text-[10px] text-slate-500 font-normal">{p.swahili}</p>
                      </div>
                      {hasPos && <Check className="h-4 w-4 text-amber-700" />}
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end pt-3 border-t border-slate-100">
                <button
                  onClick={() => {
                    addAuditLog(
                      'UPDATED_STAFF_POSITIONS',
                      'Management Structure',
                      `Updated executive portfolios and assigned responsibilities for ${selectedStaffForPosition.userName}`
                    );
                    setSelectedStaffForPosition(null);
                  }}
                  className="rounded-lg bg-emerald-600 px-4 py-1.5 font-bold text-white hover:bg-emerald-700"
                >
                  Hifadhi Mabadiliko
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
