import React, { useState } from 'react';
import {
  Award,
  CalendarCheck,
  CheckCircle2,
  Coins,
  FileSpreadsheet,
  GraduationCap,
  Megaphone,
  Printer,
  Shield,
  User,
  Users,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { ResultCardModal } from '../components/results/ResultCardModal';
import { computeStudentExamResult, rankStudentResults } from '../utils/gradeCalculator';
import { CalculatedStudentResult, Student } from '../types';

export const ParentPortalPage: React.FC = () => {
  const {
    students,
    examinations,
    subjects,
    marks,
    attendance,
    feePayments,
    announcements,
    currentSchool,
  } = useAuth();

  // For demo/real user: identify parent's children
  // E.g. Eng. Bakari H. Mwinyi's child Juma Bakari, or allow selecting any child in testing
  const [selectedChildId, setSelectedChildId] = useState<string>(students[0]?.id || '');
  const [selectedCardResult, setSelectedCardResult] = useState<CalculatedStudentResult | null>(null);

  const selectedChild = students.find((s) => s.id === selectedChildId) || students[0];

  // ONLY RELEASED exams can be seen by parents (Requirement #29)
  const releasedExams = examinations.filter((e) => e.status === 'RELEASED');

  // Compute results for selected child across released exams
  const childResults: CalculatedStudentResult[] = releasedExams.map((exam) => {
    const studentMarks = marks.filter((m) => m.studentId === selectedChild?.id && m.examId === exam.id);
    return computeStudentExamResult(
      { id: selectedChild.id, fullName: selectedChild.fullName, admissionNumber: selectedChild.admissionNumber },
      { id: exam.id, name: exam.name, academicYear: exam.academicYear, term: exam.term, formStandard: exam.formStandard, level: exam.level },
      selectedChild.streamName || selectedChild.formStandard,
      studentMarks,
      subjects,
      currentSchool?.gradingScale,
      selectedChild.combinationCode
    );
  });

  // Child attendance
  const childAttendance = attendance.filter((a) => a.studentId === selectedChild?.id);
  const presentCount = childAttendance.filter((a) => a.status === 'Present' || a.status === 'Late').length;
  const attendanceRate = childAttendance.length > 0 ? Math.round((presentCount / childAttendance.length) * 100) : 98;

  // Child fees
  const childFees = feePayments.filter((f) => f.studentId === selectedChild?.id);
  const totalPaid = childFees.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl bg-linear-to-r from-sky-900 to-slate-900 p-6 text-white shadow-xl">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <span className="rounded-full bg-sky-500/20 px-3 py-1 text-xs font-semibold text-sky-300">
              Tovuti Rasmi ya Wazazi na Walezi (Parent & Guardian Portal)
            </span>
            <h1 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
              Karibu, {selectedChild?.parentName || 'Mzazi / Mlezi'}
            </h1>
            <p className="mt-1 text-xs text-slate-300">
              Ufuatiliaji wa maendeleo ya kitaaluma, mahudhurio, matokeo yaliyotolewa na ada za wanafunzi wako
            </p>
          </div>
        </div>

        {/* Children Selector Cards (Requirement #31: My Children) */}
        <div className="mt-6 border-t border-slate-700/60 pt-4">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Watoto Wangu Shuleni (My Children):
          </span>
          <div className="mt-2 flex flex-wrap gap-2.5">
            {students.slice(0, 3).map((st) => (
              <button
                key={st.id}
                onClick={() => setSelectedChildId(st.id)}
                className={`flex items-center gap-2.5 rounded-xl px-4 py-2 text-xs font-bold transition ${
                  selectedChild?.id === st.id
                    ? 'bg-white text-slate-900 shadow-md ring-2 ring-sky-400'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-600 text-white text-[10px]">
                  {st.fullName.charAt(0)}
                </div>
                <span>{st.fullName}</span>
                <span className="text-[10px] text-slate-400 font-normal">({st.formStandard})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Child Summary Stats */}
      {selectedChild && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Academic Overview */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Matokeo ya Hivi Karibuni</span>
              <Award className="h-5 w-5 text-amber-600" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">
                {childResults[0] ? `${childResults[0].averageScore}%` : '—'}
              </span>
              <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">
                {childResults[0] ? childResults[0].division : 'Hakuna Mtihani'}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              Nafasi: <strong className="text-slate-800">{childResults[0]?.position ? `#${childResults[0].position}` : '—'}</strong> darasani
            </p>
          </div>

          {/* Attendance Overview */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Mahudhurio Darasani</span>
              <CalendarCheck className="h-5 w-5 text-purple-600" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">{attendanceRate}%</span>
              <span className="text-xs font-semibold text-emerald-600">Mahudhurio Mazuri</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">Mkondo: {selectedChild.streamName || selectedChild.formStandard}</p>
          </div>

          {/* Fees Overview */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Ada Iliyolipwa (Mwaka Huu)</span>
              <Coins className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-xs font-bold text-slate-500">TZS</span>
              <span className="text-xl font-black text-slate-900">{totalPaid.toLocaleString()}</span>
            </div>
            <p className="mt-1 text-[11px] text-emerald-600 font-semibold">Stakabadhi {childFees.length} zimethibitishwa</p>
          </div>
        </div>
      )}

      {/* Released Examination Results (Requirement #29: ONLY RELEASED) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Matokeo Rasmi Yaliyotolewa (Official Released Results)
            </h3>
            <p className="text-xs text-slate-500">
              Matokeo haya yamethibitishwa na Mkuu wa Taaluma na Mkuu wa Shule
            </p>
          </div>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
            {releasedExams.length} Mitihani Imetolewa
          </span>
        </div>

        {childResults.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            Bado hakuna matokeo yaliyotolewa rasmi kwa sasa. Ofisi ya Taaluma inashughulikia uhakiki.
          </div>
        ) : (
          <div className="space-y-4">
            {childResults.map((res) => (
              <div
                key={res.examId}
                className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 transition hover:bg-slate-50"
              >
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{res.examName}</h4>
                    <p className="text-xs text-slate-500">
                      Wastani: <strong className="text-sky-700 font-black">{res.averageScore}%</strong> • Daraja la NECTA: <strong className="text-emerald-700 font-black">{res.division}</strong> ({res.pointsTotal} Points)
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedCardResult(res)}
                    className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-amber-600"
                  >
                    <Printer className="h-4 w-4" />
                    Tazama & Chapa Kadi ya Matokeo
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Announcements */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-1.5">
          <Megaphone className="h-4 w-4 text-emerald-600" />
          Matangazo ya Shule kwa Wazazi
        </h3>
        <div className="space-y-2.5">
          {announcements.map((anc) => (
            <div key={anc.id} className="rounded-xl bg-slate-50 p-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-900">{anc.title}</span>
                <span className="text-[10px] text-slate-400">{new Date(anc.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="mt-1 text-slate-600">{anc.content}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Result Card Modal */}
      <ResultCardModal
        isOpen={!!selectedCardResult}
        result={selectedCardResult}
        school={currentSchool}
        onClose={() => setSelectedCardResult(null)}
      />
    </div>
  );
};
