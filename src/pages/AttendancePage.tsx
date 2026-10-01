import React, { useState } from 'react';
import {
  Calendar,
  Check,
  CheckCheck,
  Clock,
  Filter,
  Save,
  UserCheck,
  UserX,
  Users,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { AttendanceStatus } from '../types';

export const AttendancePage: React.FC = () => {
  const {
    streams,
    students,
    attendance,
    currentUser,
    recordAttendanceBatch,
  } = useAuth();

  const [selectedDate, setSelectedDate] = useState<string>('2026-10-01');
  const [selectedStreamId, setSelectedStreamId] = useState<string>(streams[0]?.id || '');
  const [successMsg, setSuccessMsg] = useState(false);

  const activeStream = streams.find((s) => s.id === selectedStreamId) || streams[0];
  const enrolledStudents = students.filter((s) => s.streamId === activeStream?.id);

  // Local attendance status mapping: studentId -> { status: AttendanceStatus, remark: string }
  const [localStatuses, setLocalStatuses] = useState<Record<string, { status: AttendanceStatus; remark: string }>>({});

  // Sync with current date and stream
  React.useEffect(() => {
    const map: Record<string, { status: AttendanceStatus; remark: string }> = {};
    enrolledStudents.forEach((st) => {
      const existing = attendance.find((a) => a.studentId === st.id && a.date === selectedDate);
      if (existing) {
        map[st.id] = { status: existing.status, remark: existing.remark || '' };
      } else {
        map[st.id] = { status: 'Present', remark: '' };
      }
    });
    setLocalStatuses(map);
  }, [selectedDate, selectedStreamId, attendance.length]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setLocalStatuses((prev) => ({
      ...prev,
      [studentId]: { ...(prev[studentId] || { remark: '' }), status },
    }));
  };

  const handleRemarkChange = (studentId: string, remark: string) => {
    setLocalStatuses((prev) => ({
      ...prev,
      [studentId]: { ...(prev[studentId] || { status: 'Present' }), remark },
    }));
  };

  const handleMarkAllPresent = () => {
    const map: Record<string, { status: AttendanceStatus; remark: string }> = {};
    enrolledStudents.forEach((st) => {
      map[st.id] = { status: 'Present', remark: '' };
    });
    setLocalStatuses(map);
  };

  const handleSaveAttendance = () => {
    if (!activeStream) return;

    const batch = enrolledStudents.map((st) => {
      const cur = localStatuses[st.id] || { status: 'Present', remark: '' };
      return {
        studentId: st.id,
        studentName: st.fullName,
        streamId: activeStream.id,
        date: selectedDate,
        status: cur.status,
        remark: cur.remark,
        markedBy: currentUser?.uid || 'teacher-001',
        markedByName: currentUser?.fullName || 'Teacher',
      };
    });

    recordAttendanceBatch(batch);
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 2500);
  };

  // Compute live statistics for current selection
  const presentCount = Object.values(localStatuses).filter(
    (v) => v.status === 'Present' || v.status === 'Late'
  ).length;
  const absentCount = Object.values(localStatuses).filter((v) => v.status === 'Absent').length;
  const lateCount = Object.values(localStatuses).filter((v) => v.status === 'Late').length;
  const excusedCount = Object.values(localStatuses).filter((v) => v.status === 'Excused').length;
  const totalCount = enrolledStudents.length;
  const attendancePercentage = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Mahudhurio ya Wanafunzi (Daily Attendance Roll-Call)
          </h2>
          <p className="text-xs text-slate-500">
            Kurekodi mahudhurio ya kila siku darasani, hesabu ya asilimia, na ripoti za mahudhurio
          </p>
        </div>

        <div className="flex items-center gap-2">
          {successMsg && (
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
              <Check className="h-4 w-4" /> Yamehifadhiwa!
            </span>
          )}
          <button
            onClick={handleSaveAttendance}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-emerald-700/20 hover:bg-emerald-700"
          >
            <Save className="h-4 w-4" />
            Hifadhi Mahudhurio (Save Roll-Call)
          </button>
        </div>
      </div>

      {/* Selectors & Statistics Ribbon */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        {/* Controls */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs lg:col-span-2 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-[10px] font-bold text-slate-500 uppercase">
                Tarehe ya Mahudhurio
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2 text-xs font-semibold text-slate-800 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-bold text-slate-500 uppercase">
                Mkondo / Darasa (Stream)
              </label>
              <select
                value={selectedStreamId}
                onChange={(e) => setSelectedStreamId(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2 text-xs font-semibold text-slate-800 focus:outline-hidden"
              >
                {streams.map((str) => (
                  <option key={str.id} value={str.id}>
                    {str.name} ({str.formStandard})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 pt-2">
            <span className="text-xs text-slate-600">
              Mwalimu wa Darasa: <strong className="text-slate-800">{activeStream?.classTeacherName || 'Hajapangiwa'}</strong>
            </span>
            <button
              onClick={handleMarkAllPresent}
              className="flex items-center gap-1 rounded-lg bg-sky-50 px-3 py-1.5 text-xs font-bold text-sky-700 hover:bg-sky-100"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Wote Wapo (Mark All Present)
            </button>
          </div>
        </div>

        {/* Live Percent Stat */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-500">Asilimia ya Mahudhurio (Rate)</span>
          <div className="my-1 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{attendancePercentage}%</span>
            <span className="text-xs font-semibold text-emerald-600">
              {presentCount} kati ya {totalCount}
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${attendancePercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs grid grid-cols-2 gap-2 text-center text-xs">
          <div className="rounded-xl bg-emerald-50 p-2">
            <span className="text-[10px] font-bold text-emerald-800 uppercase">Wapo (Present)</span>
            <p className="text-lg font-black text-emerald-900">{presentCount}</p>
          </div>
          <div className="rounded-xl bg-rose-50 p-2">
            <span className="text-[10px] font-bold text-rose-800 uppercase">Hawapo (Absent)</span>
            <p className="text-lg font-black text-rose-900">{absentCount}</p>
          </div>
          <div className="rounded-xl bg-amber-50 p-2">
            <span className="text-[10px] font-bold text-amber-800 uppercase">Wamechelewa</span>
            <p className="text-lg font-black text-amber-900">{lateCount}</p>
          </div>
          <div className="rounded-xl bg-sky-50 p-2">
            <span className="text-[10px] font-bold text-sky-800 uppercase">Wamesamehewa</span>
            <p className="text-lg font-black text-sky-900">{excusedCount}</p>
          </div>
        </div>
      </div>

      {/* Attendance Roll-Call Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="border-b border-slate-200 bg-slate-50 p-3.5 flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-800">
            Daftari la Mahudhurio: {activeStream?.name} ({selectedDate})
          </h4>
          <span className="text-[11px] text-slate-500">Bofya hali ya mwanafunzi kubadili mara moja</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-white text-slate-600">
              <tr>
                <th className="py-2.5 px-3 font-semibold">#</th>
                <th className="py-2.5 px-3 font-semibold">Namba ya Usajili</th>
                <th className="py-2.5 px-3 font-semibold">Jina la Mwanafunzi</th>
                <th className="py-2.5 px-3 font-semibold text-center">Hali ya Mahudhurio (Status)</th>
                <th className="py-2.5 px-3 font-semibold">Maelezo / Sababu (Remark)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {enrolledStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    Hakuna wanafunzi waliopangiwa mkondo huu.
                  </td>
                </tr>
              ) : (
                enrolledStudents.map((st, idx) => {
                  const currentStatus = localStatuses[st.id]?.status || 'Present';
                  const currentRemark = localStatuses[st.id]?.remark || '';

                  return (
                    <tr key={st.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 text-slate-400">{idx + 1}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-700">{st.admissionNumber}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">{st.fullName}</td>
                      <td className="py-2.5 px-3 text-center">
                        <div className="inline-flex rounded-xl bg-slate-100 p-1">
                          <button
                            type="button"
                            onClick={() => handleStatusChange(st.id, 'Present')}
                            className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
                              currentStatus === 'Present'
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            Present
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(st.id, 'Absent')}
                            className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
                              currentStatus === 'Absent'
                                ? 'bg-rose-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            Absent
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(st.id, 'Late')}
                            className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
                              currentStatus === 'Late'
                                ? 'bg-amber-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            Late
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(st.id, 'Excused')}
                            className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
                              currentStatus === 'Excused'
                                ? 'bg-sky-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            Excused
                          </button>
                        </div>
                      </td>
                      <td className="py-2.5 px-3">
                        <input
                          type="text"
                          value={currentRemark}
                          onChange={(e) => handleRemarkChange(st.id, e.target.value)}
                          placeholder="mf. Taarifa ya mzazi..."
                          className="w-full rounded-lg border border-slate-200 p-1.5 text-xs focus:border-sky-500 focus:outline-hidden"
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
