import React from 'react';
import {
  Award,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  Coins,
  FileSpreadsheet,
  GraduationCap,
  Layers,
  Megaphone,
  PlusCircle,
  Shield,
  TrendingUp,
  UserCheck,
  Users,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { rankStudentResults } from '../utils/gradeCalculator';

interface DashboardOverviewProps {
  onNavigate: (page: string) => void;
  onOpenRegisterSchool: () => void;
  onOpenStudentModal: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  onNavigate,
  onOpenRegisterSchool,
  onOpenStudentModal,
}) => {
  const {
    currentSchool,
    activePosition,
    students,
    streams,
    departments,
    examinations,
    feePayments,
    attendance,
    announcements,
    auditLogs,
    memberships,
  } = useAuth();

  // Calculate live statistics
  const totalStudents = students.length;
  const activeStudents = students.filter((s) => s.status === 'Active').length;
  const maleCount = students.filter((s) => s.gender === 'Male').length;
  const femaleCount = students.filter((s) => s.gender === 'Female').length;
  const totalTeachers = memberships.filter((m) => m.positions.includes('Teacher')).length;

  const todayStr = '2026-10-01';
  const todayAttendance = attendance.filter((a) => a.date === todayStr);
  const presentCount = todayAttendance.filter((a) => a.status === 'Present' || a.status === 'Late').length;
  const attendanceRate = todayAttendance.length > 0 ? Math.round((presentCount / todayAttendance.length) * 100) : 96;

  const totalFeesCollected = feePayments.reduce((acc, curr) => acc + curr.amount, 0);

  const releasedExams = examinations.filter((e) => e.status === 'RELEASED');

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-slate-900 via-sky-950 to-emerald-950 p-6 text-white shadow-xl">
        <div className="relative z-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
              {currentSchool?.name} (Namba: {currentSchool?.code})
            </div>
            <h1 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
              Karibu, SMART SCHOOL HUB
            </h1>
            <p className="mt-1 text-xs text-slate-300 sm:text-sm">
              Mfumo kamili wa kidijitali kwa shule za Tanzania • Wadhifa wako: <strong className="text-amber-400 font-bold">{activePosition}</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onOpenStudentModal}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-700/30 transition hover:bg-emerald-500"
            >
              <PlusCircle className="h-4 w-4" />
              Sajili Mwanafunzi
            </button>
            <button
              onClick={() => onNavigate('examinations')}
              className="flex items-center gap-1.5 rounded-xl bg-white/15 px-4 py-2 text-xs font-bold text-white backdrop-blur-md transition hover:bg-white/25"
            >
              <FileSpreadsheet className="h-4 w-4" />
              Ingiza Alama za Mitihani
            </button>
          </div>
        </div>

        {/* Background glow circle */}
        <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl"></div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
        {/* Total Students */}
        <div
          onClick={() => onNavigate('students')}
          className="cursor-pointer rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs transition hover:shadow-md hover:border-sky-300"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Wanafunzi Wote (Students)</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-2xl font-black text-slate-900">{totalStudents}</p>
            <span className="text-[11px] font-medium text-emerald-600">Wanafunzi {activeStudents} hai</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            Wavulana {maleCount} • Wasichana {femaleCount}
          </p>
        </div>

        {/* Teachers & Staff */}
        <div
          onClick={() => onNavigate('teachers')}
          className="cursor-pointer rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs transition hover:shadow-md hover:border-emerald-300"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Walimu na Wafanyakazi</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <UserCheck className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-2xl font-black text-slate-900">{memberships.length}</p>
            <span className="text-[11px] font-medium text-slate-500">{totalTeachers} Walimu wa Masomo</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Idara {departments.length} za Kitaaluma</p>
        </div>

        {/* Attendance Rate */}
        <div
          onClick={() => onNavigate('attendance')}
          className="cursor-pointer rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs transition hover:shadow-md hover:border-purple-300"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Mahudhurio ya Leo</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <CalendarCheck className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-2xl font-black text-slate-900">{attendanceRate}%</p>
            <span className="text-[11px] font-medium text-emerald-600">Wastani Mzuri</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Roll-call ya madarasa yote {streams.length}</p>
        </div>

        {/* Fees Collected */}
        <div
          onClick={() => onNavigate('finance')}
          className="cursor-pointer rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs transition hover:shadow-md hover:border-amber-300"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Ada Zilizokusanywa (TZS)</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Coins className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-xs font-bold text-slate-500">TZS</span>
            <p className="text-xl font-black text-slate-900 truncate">
              {(totalFeesCollected / 1000000).toFixed(1)}M
            </p>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Stakabadhi {feePayments.length} zimethibitishwa</p>
        </div>
      </div>

      {/* Middle Grid: Academic Hierarchy & Quick Workflows */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: Academic Streams & Examinations */}
        <div className="space-y-6 lg:col-span-2">
          {/* Streams (Mikondo) Summary */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Madarasa na Mikondo (Active Streams)</h3>
                <p className="text-xs text-slate-500">Usimamizi wa walimu wa darasa na uwezo wa mikondo</p>
              </div>
              <button
                onClick={() => onNavigate('streams')}
                className="text-xs font-semibold text-sky-600 hover:text-sky-800"
              >
                Tazama Yote ({streams.length}) →
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {streams.slice(0, 4).map((str) => {
                const streamStudents = students.filter((s) => s.streamId === str.id).length;
                return (
                  <div
                    key={str.id}
                    onClick={() => onNavigate('streams')}
                    className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50/60 p-3 transition hover:border-sky-300 hover:bg-sky-50/40"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 text-xs">{str.name}</span>
                        <span className="rounded bg-sky-100 px-1.5 py-0.2 text-[9px] font-semibold text-sky-800">
                          {str.level}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Mwalimu: <strong className="text-slate-700">{str.classTeacherName || 'Hajapangiwa'}</strong>
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-900">{streamStudents} / {str.maxCapacity}</span>
                      <p className="text-[10px] text-slate-400">Wanafunzi</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Examinations & Results Status */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Mitihani na Matokeo (Examinations & Results)</h3>
                <p className="text-xs text-slate-500">Mchakato wa kuingiza alama, uhakiki na kutoa matokeo rasmi</p>
              </div>
              <button
                onClick={() => onNavigate('examinations')}
                className="text-xs font-semibold text-sky-600 hover:text-sky-800"
              >
                Ratiba ya Mitihani →
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {examinations.map((exam) => (
                <div
                  key={exam.id}
                  className="flex flex-col justify-between gap-2 rounded-xl border border-slate-200/80 p-3.5 transition sm:flex-row sm:items-center hover:bg-slate-50/80"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900">{exam.name}</h4>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          exam.status === 'RELEASED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : exam.status === 'APPROVED'
                            ? 'bg-sky-100 text-sky-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {exam.status === 'RELEASED' ? 'YAMETOLEWA (RELEASED)' : exam.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {exam.formStandard} • {exam.term} ({exam.academicYear}) • Masomo {exam.subjectIds.length}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {exam.status === 'RELEASED' ? (
                      <button
                        onClick={() => onNavigate('results')}
                        className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100"
                      >
                        Tazama Matokeo & Kadi
                      </button>
                    ) : (
                      <button
                        onClick={() => onNavigate('examinations')}
                        className="rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-sky-700"
                      >
                        Kagua & Thibitisha
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Announcements, Quick Portal Links & Audit Stream */}
        <div className="space-y-6">
          {/* Quick Portals Navigation */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Tovuti Maalumu (Dedicated Portals)</h3>
            <div className="space-y-2">
              <button
                onClick={() => onNavigate('parent-portal')}
                className="flex w-full items-center justify-between rounded-xl border border-sky-100 bg-sky-50/60 p-3 text-left transition hover:bg-sky-100/80"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-600 text-white">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Tovuti ya Wazazi (Parent Portal)</p>
                    <p className="text-[10px] text-slate-500">Angalia matokeo, mahudhurio na ada</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-sky-700">Fungua →</span>
              </button>

              <button
                onClick={() => onNavigate('student-portal')}
                className="flex w-full items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50/60 p-3 text-left transition hover:bg-emerald-100/80"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
                    <GraduationCap className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Tovuti ya Mwanafunzi (Student Portal)</p>
                    <p className="text-[10px] text-slate-500">Tazama kadi za matokeo & masomo</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-700">Fungua →</span>
              </button>

              <button
                onClick={() => onNavigate('analytics')}
                className="flex w-full items-center justify-between rounded-xl border border-purple-100 bg-purple-50/60 p-3 text-left transition hover:bg-purple-100/80"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600 text-white">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Takwimu za Kitaaluma (Analytics)</p>
                    <p className="text-[10px] text-slate-500">Mchanganuo wa madaraja na ufaulu</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-purple-700">Fungua →</span>
              </button>
            </div>
          </div>

          {/* Latest Announcements */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Megaphone className="h-4 w-4 text-emerald-600" />
                Matangazo ya Shule
              </h3>
              <button
                onClick={() => onNavigate('communication')}
                className="text-[11px] font-semibold text-sky-600 hover:text-sky-800"
              >
                Mawasiliano →
              </button>
            </div>

            <div className="space-y-3">
              {announcements.slice(0, 3).map((anc) => (
                <div key={anc.id} className="rounded-xl bg-slate-50 p-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{anc.title}</span>
                    <span className="rounded bg-slate-200 px-1.5 py-0.2 text-[9px] font-semibold text-slate-700">
                      {anc.priority}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-[11px] text-slate-600">{anc.content}</p>
                  <p className="mt-1.5 text-[10px] text-slate-400">Mwandishi: {anc.authorName}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Audit Log Feed */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-sky-600" />
                Kumbukumbu za Mfumo (Audit Trail)
              </h3>
              <button
                onClick={() => onNavigate('audit-logs')}
                className="text-[11px] font-semibold text-sky-600 hover:text-sky-800"
              >
                Tazama Zote →
              </button>
            </div>

            <div className="space-y-2">
              {auditLogs.slice(0, 4).map((log) => (
                <div key={log.id} className="border-l-2 border-sky-500 pl-2 text-[11px]">
                  <p className="font-bold text-slate-800">{log.action.replace('_', ' ')}</p>
                  <p className="text-[10px] text-slate-500 line-clamp-1">{log.details}</p>
                  <span className="text-[9px] text-slate-400 font-mono">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {log.userName}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
