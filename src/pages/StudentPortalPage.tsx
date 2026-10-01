import React, { useState } from 'react';
import {
  Award,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  GraduationCap,
  Printer,
  Sparkles,
  User,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { ResultCardModal } from '../components/results/ResultCardModal';
import { computeStudentExamResult } from '../utils/gradeCalculator';
import { CalculatedStudentResult } from '../types';

export const StudentPortalPage: React.FC = () => {
  const {
    students,
    examinations,
    subjects,
    marks,
    attendance,
    currentSchool,
  } = useAuth();

  // Active student context (e.g. Juma Bakari or first student)
  const currentStudent = students[0];
  const [selectedCardResult, setSelectedCardResult] = useState<CalculatedStudentResult | null>(null);

  // ONLY RELEASED exams
  const releasedExams = examinations.filter((e) => e.status === 'RELEASED');

  const studentResults: CalculatedStudentResult[] = releasedExams.map((exam) => {
    const sMarks = marks.filter((m) => m.studentId === currentStudent?.id && m.examId === exam.id);
    return computeStudentExamResult(
      { id: currentStudent.id, fullName: currentStudent.fullName, admissionNumber: currentStudent.admissionNumber },
      { id: exam.id, name: exam.name, academicYear: exam.academicYear, term: exam.term, formStandard: exam.formStandard, level: exam.level },
      currentStudent.streamName || currentStudent.formStandard,
      sMarks,
      subjects,
      currentSchool?.gradingScale,
      currentStudent.combinationCode
    );
  });

  const studentAttendance = attendance.filter((a) => a.studentId === currentStudent?.id);
  const presentCount = studentAttendance.filter((a) => a.status === 'Present' || a.status === 'Late').length;
  const attendanceRate = studentAttendance.length > 0 ? Math.round((presentCount / studentAttendance.length) * 100) : 98;

  return (
    <div className="space-y-6">
      {/* Top Profile Card */}
      <div className="rounded-2xl bg-linear-to-r from-emerald-950 via-slate-900 to-sky-950 p-6 text-white shadow-xl">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600 text-2xl font-black text-white shadow-lg shadow-emerald-700/30">
              {currentStudent?.fullName.charAt(0) || 'S'}
            </div>
            <div>
              <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300">
                Tovuti ya Mwanafunzi (Student Portal)
              </span>
              <h1 className="mt-1 text-2xl font-black tracking-tight">{currentStudent?.fullName}</h1>
              <p className="text-xs text-slate-300">
                Namba ya Usajili: <span className="font-mono font-bold text-white">{currentStudent?.admissionNumber}</span> • {currentStudent?.streamName || currentStudent?.formStandard}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-white/10 p-3 text-right backdrop-blur-md">
              <span className="text-[10px] text-slate-300 uppercase">Shule:</span>
              <p className="font-bold text-white text-xs">{currentSchool?.name}</p>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Wastani wa Mitihani Yaliyotolewa</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-sky-700">
              {studentResults[0] ? `${studentResults[0].averageScore}%` : '—'}
            </span>
            <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">
              {studentResults[0] ? studentResults[0].division : 'Bado'}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">Daraja: {studentResults[0]?.overallGrade || '—'}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Mahudhurio Yangu</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{attendanceRate}%</span>
            <span className="text-xs font-semibold text-emerald-600">Vizuri Sana</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">Darasa: {currentStudent?.formStandard}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Masomo Yaliyosajiliwa</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{subjects.length}</span>
            <span className="text-xs font-semibold text-slate-500">Masomo ya Mtaala</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">NECTA Curriculum Compliant</p>
        </div>
      </div>

      {/* Official Released Examination Results */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Matokeo Rasmi ya Mitihani (My Official Results)
            </h3>
            <p className="text-xs text-slate-500">
              Matokeo yaliyothibitishwa na kutolewa na Ofisi ya Taaluma
            </p>
          </div>
          <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
            <Sparkles className="h-3.5 w-3.5" />
            Rasmi (Verified & Released)
          </span>
        </div>

        {studentResults.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            Bado hakuna matokeo yaliyotolewa rasmi kwa sasa.
          </div>
        ) : (
          <div className="space-y-4">
            {studentResults.map((res) => (
              <div
                key={res.examId}
                className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 transition hover:bg-slate-50"
              >
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{res.examName}</h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Wastani: <strong className="text-sky-700 font-bold">{res.averageScore}%</strong> • Daraja la NECTA: <strong className="text-emerald-700 font-bold">{res.division}</strong> ({res.pointsTotal} Points) • Nafasi: <strong className="text-slate-800 font-bold">#{res.position || '—'}</strong>
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedCardResult(res)}
                    className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-amber-600"
                  >
                    <Printer className="h-4 w-4" />
                    Tazama Kadi ya Matokeo (Report Card)
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
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
