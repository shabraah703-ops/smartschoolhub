import React, { useState } from 'react';
import {
  Award,
  Check,
  CheckCircle2,
  Clock,
  Edit3,
  FileSpreadsheet,
  Lock,
  Plus,
  Send,
  ShieldAlert,
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { calculateSubjectGrade } from '../utils/gradeCalculator';
import { Examination, ExamMark, ExamStatus, ExamType } from '../types';
import confetti from 'canvas-confetti';

export const ExaminationsPage: React.FC = () => {
  const {
    examinations,
    students,
    streams,
    subjects,
    marks,
    currentSchool,
    currentUser,
    activePosition,
    addExamination,
    updateExaminationStatus,
    saveMarksBatch,
    approveExaminationResults,
    releaseExaminationResults,
    lockExaminationResults,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'schedule' | 'mark-entry' | 'academic-release'>('schedule');

  // New Exam Form State
  const [showAddExam, setShowAddExam] = useState(false);
  const [examName, setExamName] = useState('');
  const [examType, setExamType] = useState<ExamType>('Mid-Term');
  const [examFormStandard, setExamFormStandard] = useState('Form IV');
  const [examLevel, setExamLevel] = useState('O-Level');
  const [examTerm, setExamTerm] = useState('Term 1');
  const [examStartDate, setExamStartDate] = useState('2026-03-15');
  const [examEndDate, setExamEndDate] = useState('2026-03-20');
  const [examMaxScore, setExamMaxScore] = useState(100);

  // Mark Entry Sheet State
  const [selectedExamId, setSelectedExamId] = useState<string>(examinations[0]?.id || '');
  const [selectedStreamId, setSelectedStreamId] = useState<string>(streams[0]?.id || '');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || '');

  // Local Mark Inputs map: studentId -> { score: number, isAbsent: boolean, isExcused: boolean }
  const [localScores, setLocalScores] = useState<Record<string, { score: number; isAbsent: boolean; isExcused: boolean }>>({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Active Exam
  const activeExam = examinations.find((e) => e.id === selectedExamId) || examinations[0];
  const activeStream = streams.find((s) => s.id === selectedStreamId) || streams[0];
  const activeSubject = subjects.find((s) => s.id === selectedSubjectId) || subjects[0];

  // Enrolled students in active stream
  const enrolledStudents = students.filter((st) => st.streamId === activeStream?.id);

  // Initialize or fetch marks for selected exam & subject
  const loadStreamMarks = () => {
    const map: Record<string, { score: number; isAbsent: boolean; isExcused: boolean }> = {};
    enrolledStudents.forEach((st) => {
      const existing = marks.find(
        (m) => m.examId === activeExam?.id && m.subjectId === activeSubject?.id && m.studentId === st.id
      );
      if (existing) {
        map[st.id] = {
          score: existing.score,
          isAbsent: existing.isAbsent,
          isExcused: existing.isExcused,
        };
      } else {
        map[st.id] = { score: 70, isAbsent: false, isExcused: false };
      }
    });
    setLocalScores(map);
  };

  const handleScoreChange = (studentId: string, val: number) => {
    setLocalScores((prev) => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || { isAbsent: false, isExcused: false }),
        score: Math.min(100, Math.max(0, val)),
      },
    }));
  };

  const toggleAbsent = (studentId: string) => {
    setLocalScores((prev) => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || { score: 0, isExcused: false }),
        isAbsent: !prev[studentId]?.isAbsent,
      },
    }));
  };

  const toggleExcused = (studentId: string) => {
    setLocalScores((prev) => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || { score: 0, isAbsent: false }),
        isExcused: !prev[studentId]?.isExcused,
      },
    }));
  };

  const handleSaveMarks = () => {
    if (!activeExam || !activeSubject) return;

    const batch = enrolledStudents.map((st) => {
      const current = localScores[st.id] || { score: 0, isAbsent: false, isExcused: false };
      return {
        examId: activeExam.id,
        studentId: st.id,
        subjectId: activeSubject.id,
        score: current.score,
        maxScore: activeExam.maxScore || 100,
        isAbsent: current.isAbsent,
        isExcused: current.isExcused,
        teacherId: currentUser?.uid || 'teacher-001',
        teacherName: currentUser?.fullName || 'Teacher',
        submittedAt: new Date().toISOString(),
      };
    });

    saveMarksBatch(batch);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examName.trim()) return;

    addExamination({
      name: examName.trim(),
      type: examType,
      academicYear: currentSchool?.academicYear || '2026',
      term: examTerm,
      level: examLevel as any,
      formStandard: examFormStandard,
      subjectIds: subjects.map((s) => s.id),
      startDate: examStartDate,
      endDate: examEndDate,
      maxScore: examMaxScore,
    });

    setShowAddExam(false);
    setExamName('');
  };

  const handleRelease = (examId: string) => {
    releaseExaminationResults(examId);
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // safe fallback
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner and Tabs */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Usimamizi wa Mitihani na Matokeo (Examinations & Marks)
          </h2>
          <p className="text-xs text-slate-500">
            Ratiba ya mitihani, uingizaji wa alama, uhakiki wa Ofisi ya Taaluma, na kutoa matokeo
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddExam(true)}
            className="flex items-center gap-1.5 rounded-xl bg-sky-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-sky-700/20 hover:bg-sky-700"
          >
            <Plus className="h-4 w-4" />
            Tengeneza Mtihani Mpya
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('schedule')}
          className={`flex items-center gap-2 border-b-2 py-3 px-4 text-xs font-bold transition ${
            activeTab === 'schedule'
              ? 'border-sky-600 text-sky-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Clock className="h-4 w-4" />
          Ratiba ya Mitihani (Exam Schedule)
        </button>
        <button
          onClick={() => {
            setActiveTab('mark-entry');
            loadStreamMarks();
          }}
          className={`flex items-center gap-2 border-b-2 py-3 px-4 text-xs font-bold transition ${
            activeTab === 'mark-entry'
              ? 'border-sky-600 text-sky-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileSpreadsheet className="h-4 w-4" />
          Jedwali la Kuingiza Alama (Mark Entry Grid)
        </button>
        <button
          onClick={() => setActiveTab('academic-release')}
          className={`flex items-center gap-2 border-b-2 py-3 px-4 text-xs font-bold transition ${
            activeTab === 'academic-release'
              ? 'border-sky-600 text-sky-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Award className="h-4 w-4" />
          Uhakiki & Kutoa Matokeo (Approval & Release)
        </button>
      </div>

      {/* TAB 1: SCHEDULE */}
      {activeTab === 'schedule' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {examinations.map((exam) => (
              <div
                key={exam.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700 uppercase">
                      {exam.type}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        exam.status === 'RELEASED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : exam.status === 'APPROVED'
                          ? 'bg-sky-100 text-sky-800'
                          : exam.status === 'VERIFIED'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {exam.status}
                    </span>
                  </div>

                  <h3 className="mt-2 text-sm font-bold text-slate-900">{exam.name}</h3>
                  <p className="mt-1 text-xs text-slate-500">
                    {exam.formStandard} • {exam.term} ({exam.academicYear})
                  </p>

                  <div className="mt-3 space-y-1 text-[11px] text-slate-600">
                    <p>Tarehe: {exam.startDate} hadi {exam.endDate}</p>
                    <p>Alama za Juu (Max Score): <strong className="font-mono">{exam.maxScore}</strong></p>
                    <p>Masomo: {exam.subjectIds.length} yanatathminiwa</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => {
                      setSelectedExamId(exam.id);
                      setActiveTab('mark-entry');
                      loadStreamMarks();
                    }}
                    className="text-xs font-bold text-sky-600 hover:text-sky-800"
                  >
                    Ingiza Alama →
                  </button>
                  {exam.status === 'RELEASED' && (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Yapo Hewani
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: MARK ENTRY GRID */}
      {activeTab === 'mark-entry' && (
        <div className="space-y-4">
          {/* Selectors Bar */}
          <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
            <div>
              <label className="mb-1 block text-[10px] font-bold text-slate-500 uppercase">Mtihani</label>
              <select
                value={selectedExamId}
                onChange={(e) => {
                  setSelectedExamId(e.target.value);
                  setTimeout(loadStreamMarks, 50);
                }}
                className="rounded-xl border border-slate-300 p-2 text-xs font-semibold text-slate-800 focus:outline-hidden"
              >
                {examinations.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.name} ({ex.status})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-[10px] font-bold text-slate-500 uppercase">Mkondo / Darasa</label>
              <select
                value={selectedStreamId}
                onChange={(e) => {
                  setSelectedStreamId(e.target.value);
                  setTimeout(loadStreamMarks, 50);
                }}
                className="rounded-xl border border-slate-300 p-2 text-xs font-semibold text-slate-800 focus:outline-hidden"
              >
                {streams.map((str) => (
                  <option key={str.id} value={str.id}>
                    {str.name} ({str.formStandard})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-[10px] font-bold text-slate-500 uppercase">Somo (Subject)</label>
              <select
                value={selectedSubjectId}
                onChange={(e) => {
                  setSelectedSubjectId(e.target.value);
                  setTimeout(loadStreamMarks, 50);
                }}
                className="rounded-xl border border-slate-300 p-2 text-xs font-semibold text-slate-800 focus:outline-hidden"
              >
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name} ({sub.code})
                  </option>
                ))}
              </select>
            </div>

            <div className="ml-auto flex items-center gap-2 self-end">
              {saveSuccess && (
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                  <Check className="h-4 w-4" /> Alama zimehifadhiwa kikamilifu!
                </span>
              )}
              <button
                onClick={handleSaveMarks}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-emerald-700/20 hover:bg-emerald-700"
              >
                <Send className="h-4 w-4" />
                Wasilisha Alama (Submit Marks)
              </button>
            </div>
          </div>

          {/* Marks Input Table */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
            <div className="border-b border-slate-200 bg-slate-50 p-3 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-800">
                  {activeSubject?.name} • {activeStream?.name}
                </h4>
                <p className="text-[11px] text-slate-500">
                  Wanafunzi {enrolledStudents.length} • Max Score: {activeExam?.maxScore || 100}
                </p>
              </div>
              <span className="text-[11px] text-slate-500 italic">
                Alama zinajikokotoa moja kwa moja kulingana na viwango vya NECTA
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-200 bg-white text-slate-600">
                  <tr>
                    <th className="py-2.5 px-3 font-semibold">#</th>
                    <th className="py-2.5 px-3 font-semibold">Namba ya Usajili</th>
                    <th className="py-2.5 px-3 font-semibold">Jina la Mwanafunzi</th>
                    <th className="py-2.5 px-3 font-semibold text-center w-28">Alama (%)</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Daraja</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Point</th>
                    <th className="py-2.5 px-3 font-semibold">Maoni ya Moja kwa Moja</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Hajahudhuria / Samehewa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {enrolledStudents.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-500">
                        Hakuna wanafunzi waliopangiwa mkondo huu kwa sasa.
                      </td>
                    </tr>
                  ) : (
                    enrolledStudents.map((st, idx) => {
                      const cur = localScores[st.id] || { score: 70, isAbsent: false, isExcused: false };
                      const calc = calculateSubjectGrade(cur.score, activeExam?.maxScore || 100, currentSchool?.gradingScale);

                      return (
                        <tr key={st.id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 text-slate-400">{idx + 1}</td>
                          <td className="py-2.5 px-3 font-mono font-bold text-slate-700">{st.admissionNumber}</td>
                          <td className="py-2.5 px-3 font-bold text-slate-900">{st.fullName}</td>
                          <td className="py-2.5 px-3 text-center">
                            <input
                              type="number"
                              disabled={cur.isAbsent || cur.isExcused}
                              min={0}
                              max={activeExam?.maxScore || 100}
                              value={cur.isAbsent || cur.isExcused ? '' : cur.score}
                              onChange={(e) => handleScoreChange(st.id, parseInt(e.target.value) || 0)}
                              className="w-20 rounded-lg border border-slate-300 p-1.5 text-center font-bold text-slate-900 focus:border-sky-500 focus:outline-hidden disabled:bg-slate-100"
                            />
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            {cur.isAbsent ? (
                              <span className="rounded bg-rose-100 px-2 py-0.5 font-bold text-rose-800">ABS</span>
                            ) : cur.isExcused ? (
                              <span className="rounded bg-amber-100 px-2 py-0.5 font-bold text-amber-800">EXC</span>
                            ) : (
                              <span
                                className={`inline-block rounded px-2.5 py-0.5 font-bold ${
                                  calc.grade === 'A'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : calc.grade === 'B'
                                    ? 'bg-sky-100 text-sky-800'
                                    : calc.grade === 'C'
                                    ? 'bg-amber-100 text-amber-800'
                                    : calc.grade === 'D'
                                    ? 'bg-orange-100 text-orange-800'
                                    : 'bg-rose-100 text-rose-800'
                                }`}
                              >
                                {calc.grade}
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-700">
                            {cur.isAbsent ? '5' : cur.isExcused ? '0' : calc.point}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600 text-[11px]">
                            {cur.isAbsent ? 'Mwanafunzi hakufanya mtihani' : cur.isExcused ? 'Amesamehewa' : calc.remark}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => toggleAbsent(st.id)}
                                className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                                  cur.isAbsent ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                Absent
                              </button>
                              <button
                                type="button"
                                onClick={() => toggleExcused(st.id)}
                                className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                                  cur.isExcused ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                Excused
                              </button>
                            </div>
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
      )}

      {/* TAB 3: ACADEMIC RELEASE & APPROVAL WORKFLOW */}
      {activeTab === 'academic-release' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-sky-100 bg-sky-50/70 p-4 text-xs text-sky-950">
            <h4 className="font-bold flex items-center gap-1.5 text-sm">
              <ShieldAlert className="h-4 w-4 text-sky-700" />
              Mchakato wa Uhakiki wa Ofisi ya Taaluma (Result Governance Workflow)
            </h4>
            <p className="mt-1 text-slate-600">
              Kulingana na sera ya SMART SCHOOL HUB, matokeo hupitia hatua 6: 
              <strong className="text-slate-800"> DRAFT → SUBMITTED → VERIFIED → APPROVED → RELEASED → LOCKED</strong>.
              Wazazi na wanafunzi wanaweza kutazama matokeo tu yaliyofikia hali ya <span className="text-emerald-700 font-bold">RELEASED</span>.
            </p>
          </div>

          <div className="space-y-4">
            {examinations.map((exam) => (
              <div
                key={exam.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs"
              >
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">{exam.name}</h3>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          exam.status === 'RELEASED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : exam.status === 'APPROVED'
                            ? 'bg-sky-100 text-sky-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {exam.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {exam.formStandard} • Muhula: {exam.term} • Mwaka: {exam.academicYear}
                    </p>
                  </div>

                  {/* Actions for Academic Master / Owner */}
                  <div className="flex flex-wrap items-center gap-2">
                    {exam.status === 'DRAFT' && (
                      <button
                        onClick={() => updateExaminationStatus(exam.id, 'SUBMITTED')}
                        className="rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-sky-700"
                      >
                        Wasilisha kwa Uhakiki (Submit)
                      </button>
                    )}

                    {exam.status === 'SUBMITTED' && (
                      <button
                        onClick={() => updateExaminationStatus(exam.id, 'VERIFIED')}
                        className="rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-purple-700"
                      >
                        Hakiki Alama (Verify Marks)
                      </button>
                    )}

                    {exam.status === 'VERIFIED' && (
                      <button
                        onClick={() => approveExaminationResults(exam.id)}
                        className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700"
                      >
                        Thibitisha Matokeo (Approve Results)
                      </button>
                    )}

                    {exam.status === 'APPROVED' && (
                      <button
                        onClick={() => handleRelease(exam.id)}
                        className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white shadow-md shadow-emerald-700/20 hover:bg-emerald-700"
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        Toa Matokeo Rasmi (Release Results)
                      </button>
                    )}

                    {exam.status === 'RELEASED' && (
                      <button
                        onClick={() => lockExaminationResults(exam.id)}
                        className="flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-900"
                      >
                        <Lock className="h-3.5 w-3.5" />
                        Funga Matokeo (Lock Records)
                      </button>
                    )}

                    {exam.status === 'LOCKED' && (
                      <span className="flex items-center gap-1 text-xs font-bold text-slate-500">
                        <Lock className="h-3.5 w-3.5" /> Matokeo Yamefungwa (Locked)
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4 text-slate-600">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase">Imeidhinishwa Na:</span>
                    <p className="font-semibold text-slate-800">{exam.approvedBy || 'Hajathibitishwa'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase">Iliotolewa Na:</span>
                    <p className="font-semibold text-slate-800">{exam.releasedBy || 'Hajajaachiliwa'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase">Mwisho wa Kuingiza:</span>
                    <p className="font-semibold text-slate-800">{exam.endDate}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase">Arifa ya SMS/Wazazi:</span>
                    <p className="font-semibold text-emerald-600">
                      {exam.status === 'RELEASED' ? 'Imetumwa Moja kwa Moja' : 'Itatumwa baada ya Kutoa'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Exam Modal */}
      {showAddExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Panga Mtihani Mpya (Create Examination)</h3>
              <button onClick={() => setShowAddExam(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateExam} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="mb-1 block font-semibold text-slate-700">Jina la Mtihani (Exam Name) *</label>
                <input
                  type="text"
                  required
                  value={examName}
                  onChange={(e) => setExamName(e.target.value)}
                  placeholder="mf. Form II Terminal Examination 2026"
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-sky-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-semibold text-slate-700">Aina ya Mtihani (Exam Type)</label>
                  <select
                    value={examType}
                    onChange={(e) => setExamType(e.target.value as ExamType)}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:outline-hidden"
                  >
                    <option value="Weekly Test">Weekly Test</option>
                    <option value="Monthly Test">Monthly Test</option>
                    <option value="Series">Series Exam</option>
                    <option value="Mid-Term">Mid-Term</option>
                    <option value="Terminal">Terminal Exam</option>
                    <option value="Annual">Annual Exam</option>
                    <option value="Mock">Mock / Pre-NECTA</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block font-semibold text-slate-700">Darasa / Kidato</label>
                  <input
                    type="text"
                    required
                    value={examFormStandard}
                    onChange={(e) => setExamFormStandard(e.target.value)}
                    placeholder="mf. Form IV au Standard 7"
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-semibold text-slate-700">Muhula (Term)</label>
                  <select
                    value={examTerm}
                    onChange={(e) => setExamTerm(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:outline-hidden"
                  >
                    <option value="Term 1">Muhula wa 1 (Term 1)</option>
                    <option value="Term 2">Muhula wa 2 (Term 2)</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block font-semibold text-slate-700">Alama za Juu (Max Score)</label>
                  <input
                    type="number"
                    value={examMaxScore}
                    onChange={(e) => setExamMaxScore(parseInt(e.target.value) || 100)}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-semibold text-slate-700">Tarehe ya Kuanza</label>
                  <input
                    type="date"
                    value={examStartDate}
                    onChange={(e) => setExamStartDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-semibold text-slate-700">Tarehe ya Kumaliza</label>
                  <input
                    type="date"
                    value={examEndDate}
                    onChange={(e) => setExamEndDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddExam(false)}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Ghairi
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-sky-600 px-4 py-1.5 font-bold text-white hover:bg-sky-700"
                >
                  Hifadhi Mtihani
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
