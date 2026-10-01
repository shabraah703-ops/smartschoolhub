import React, { useState } from 'react';
import {
  Award,
  ChevronRight,
  Download,
  Edit,
  Eye,
  FileSpreadsheet,
  Filter,
  Lock,
  Printer,
  Search,
  Sparkles,
  Users,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { ResultCardModal } from '../components/results/ResultCardModal';
import { computeStudentExamResult, rankStudentResults } from '../utils/gradeCalculator';
import { CalculatedStudentResult } from '../types';

export const ResultsPage: React.FC = () => {
  const {
    currentSchool,
    examinations,
    students,
    streams,
    subjects,
    marks,
    activePosition,
    addAuditLog,
  } = useAuth();

  const [selectedExamId, setSelectedExamId] = useState<string>(examinations[0]?.id || '');
  const [selectedStreamId, setSelectedStreamId] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCardResult, setSelectedCardResult] = useState<CalculatedStudentResult | null>(null);

  // Correction request modal
  const [correctionStudent, setCorrectionStudent] = useState<CalculatedStudentResult | null>(null);
  const [correctionSubjectId, setCorrectionSubjectId] = useState('');
  const [newScoreVal, setNewScoreVal] = useState(85);
  const [correctionReason, setCorrectionReason] = useState('');
  const [correctionSuccess, setCorrectionSuccess] = useState(false);

  const activeExam = examinations.find((e) => e.id === selectedExamId) || examinations[0];

  // Calculate results for all students in active exam
  const calculatedResults: CalculatedStudentResult[] = students
    .filter((st) => {
      if (selectedStreamId !== 'All' && st.streamId !== selectedStreamId) return false;
      return true;
    })
    .map((st) => {
      const studentMarks = marks.filter((m) => m.studentId === st.id && m.examId === activeExam?.id);
      return computeStudentExamResult(
        { id: st.id, fullName: st.fullName, admissionNumber: st.admissionNumber },
        {
          id: activeExam?.id || 'exam',
          name: activeExam?.name || 'Exam',
          academicYear: activeExam?.academicYear || '2026',
          term: activeExam?.term || 'Term 1',
          formStandard: activeExam?.formStandard || st.formStandard,
          level: activeExam?.level || st.level,
        },
        st.streamName || st.formStandard,
        studentMarks,
        subjects,
        currentSchool?.gradingScale,
        st.combinationCode
      );
    });

  // Rank results
  const rankedResults = rankStudentResults(calculatedResults);

  // Search filter
  const filtered = rankedResults.filter((r) => {
    return (
      r.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.admissionNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleOpenCorrection = (res: CalculatedStudentResult) => {
    setCorrectionStudent(res);
    setCorrectionSubjectId(res.subjects[0]?.subjectId || '');
    setNewScoreVal(res.subjects[0]?.score || 80);
    setCorrectionReason('');
    setCorrectionSuccess(false);
  };

  const handleSaveCorrection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!correctionStudent || !correctionSubjectId) return;

    const subj = subjects.find((s) => s.id === correctionSubjectId);
    addAuditLog(
      'RESULT_CORRECTION_REQUEST',
      'Examinations',
      `Requested score adjustment for ${correctionStudent.studentName} in ${subj?.name || 'Subject'} to ${newScoreVal}%. Reason: ${correctionReason}`
    );

    setCorrectionSuccess(true);
    setTimeout(() => {
      setCorrectionStudent(null);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Matokeo Rasmi ya Mitihani (Academic Results & Transcripts)
          </h2>
          <p className="text-xs text-slate-500">
            Hesabu ya madaraja ya NECTA (Division I–IV, 0), wastani, nafasi, na kadi za matokeo
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50"
        >
          <Printer className="h-4 w-4 text-slate-600" />
          Chapa Jedwali (Print Broad-sheet)
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div>
          <label className="mb-1 block text-[10px] font-bold text-slate-500 uppercase">Mtihani</label>
          <select
            value={selectedExamId}
            onChange={(e) => setSelectedExamId(e.target.value)}
            className="rounded-xl border border-slate-300 p-2 text-xs font-bold text-slate-900 focus:outline-hidden"
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
            onChange={(e) => setSelectedStreamId(e.target.value)}
            className="rounded-xl border border-slate-300 p-2 text-xs font-semibold text-slate-800 focus:outline-hidden"
          >
            <option value="All">Mikondo Yote</option>
            {streams.map((str) => (
              <option key={str.id} value={str.id}>
                {str.name} ({str.formStandard})
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label className="mb-1 block text-[10px] font-bold text-slate-500 uppercase">Tafuta Mwanafunzi</label>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tafuta kwa jina au namba..."
              className="w-full rounded-xl border border-slate-300 py-1.5 pr-3 pl-8 text-xs focus:outline-hidden"
            />
          </div>
        </div>

        <div className="self-end">
          <span
            className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold ${
              activeExam?.status === 'RELEASED'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            {activeExam?.status === 'RELEASED' ? (
              <>
                <Sparkles className="h-4 w-4" /> YAMETOLEWA (RELEASED TO PARENTS)
              </>
            ) : (
              <>
                <Lock className="h-4 w-4" /> Bado Hayajatolewa ({activeExam?.status})
              </>
            )}
          </span>
        </div>
      </div>

      {/* Results Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="border-b border-slate-200 bg-slate-50 p-3.5 flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-slate-800">
              {activeExam?.name} • Jedwali Rasmi la Ufaulu (Class Performance Sheet)
            </h4>
            <p className="text-[11px] text-slate-500">
              Watahiniwa {filtered.length} • NECTA Standard Grading Engine Active
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-white text-slate-600">
              <tr>
                <th className="py-2.5 px-3 font-semibold text-center w-12">Nafasi</th>
                <th className="py-2.5 px-3 font-semibold">Namba ya Usajili</th>
                <th className="py-2.5 px-3 font-semibold">Jina Kamili</th>
                <th className="py-2.5 px-3 font-semibold">Mkondo</th>
                <th className="py-2.5 px-3 font-semibold text-center">Jumla ya Alama</th>
                <th className="py-2.5 px-3 font-semibold text-center">Wastani (%)</th>
                <th className="py-2.5 px-3 font-semibold text-center">Daraja</th>
                <th className="py-2.5 px-3 font-semibold text-center">NECTA Division</th>
                <th className="py-2.5 px-3 font-semibold text-center">Pointi</th>
                <th className="py-2.5 px-3 font-semibold text-right">Vitendo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-500">
                    Hakuna matokeo yaliyopatikana kwa vigezo hivi.
                  </td>
                </tr>
              ) : (
                filtered.map((res) => (
                  <tr key={res.studentId} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-extrabold ${
                          res.position === 1
                            ? 'bg-amber-100 text-amber-800 ring-2 ring-amber-400'
                            : res.position === 2
                            ? 'bg-slate-200 text-slate-800'
                            : res.position === 3
                            ? 'bg-amber-50 text-amber-700'
                            : 'text-slate-600'
                        }`}
                      >
                        {res.position}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-sky-700">{res.admissionNumber}</td>
                    <td className="py-2.5 px-3">
                      <p className="font-bold text-slate-900">{res.studentName}</p>
                      {res.combinationCode && (
                        <span className="font-mono text-[10px] text-purple-700 font-semibold">
                          {res.combinationCode}
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-600">{res.streamName}</td>
                    <td className="py-2.5 px-3 text-center font-bold text-slate-800">
                      {res.totalScore} / {res.maxTotalScore}
                    </td>
                    <td className="py-2.5 px-3 text-center font-black text-sky-700">
                      {res.averageScore}%
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`inline-block rounded px-2.5 py-0.5 font-bold ${
                          res.overallGrade === 'A'
                            ? 'bg-emerald-100 text-emerald-800'
                            : res.overallGrade === 'B'
                            ? 'bg-sky-100 text-sky-800'
                            : res.overallGrade === 'C'
                            ? 'bg-amber-100 text-amber-800'
                            : res.overallGrade === 'D'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {res.overallGrade}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold text-emerald-700">
                      {res.division}
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-700">
                      {res.pointsTotal}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedCardResult(res)}
                          className="flex items-center gap-1 rounded-lg bg-amber-500 px-2.5 py-1 text-[11px] font-bold text-white shadow-xs hover:bg-amber-600"
                        >
                          <Award className="h-3 w-3" />
                          Kadi ya Matokeo
                        </button>
                        <button
                          onClick={() => handleOpenCorrection(res)}
                          className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-100"
                          title="Ombi la Marekebisho ya Alama"
                        >
                          <Edit className="h-3 w-3" />
                          Marekebisho
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Result Card Modal */}
      <ResultCardModal
        isOpen={!!selectedCardResult}
        result={selectedCardResult}
        school={currentSchool}
        onClose={() => setSelectedCardResult(null)}
      />

      {/* Result Correction Request Modal */}
      {correctionStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                Ombi la Marekebisho ya Alama (Mark Correction)
              </h3>
              <p className="text-[11px] text-slate-500">
                {correctionStudent.studentName} ({correctionStudent.admissionNumber})
              </p>
            </div>

            {correctionSuccess ? (
              <div className="my-4 rounded-xl bg-emerald-50 p-4 text-center text-xs font-bold text-emerald-800">
                Ombi limewasilishwa kwa Ofisi ya Taaluma na kurekodiwa kwenye Audit Log!
              </div>
            ) : (
              <form onSubmit={handleSaveCorrection} className="mt-3 space-y-3 text-xs">
                <div>
                  <label className="mb-1 block font-semibold text-slate-700">Chagua Somo Lililo na Marekebisho</label>
                  <select
                    value={correctionSubjectId}
                    onChange={(e) => setCorrectionSubjectId(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:outline-hidden"
                  >
                    {correctionStudent.subjects.map((s) => (
                      <option key={s.subjectId} value={s.subjectId}>
                        {s.subjectName} (Sasa: {s.score}%)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block font-semibold text-slate-700">Alama Mpya Sahihi (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={newScoreVal}
                    onChange={(e) => setNewScoreVal(parseInt(e.target.value) || 0)}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs font-bold text-slate-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="mb-1 block font-semibold text-slate-700">Sababu ya Marekebisho (Reason)</label>
                  <textarea
                    required
                    rows={2}
                    value={correctionReason}
                    onChange={(e) => setCorrectionReason(e.target.value)}
                    placeholder="mf. Hitilafu ya kuingiza alama kwenye swali la 4..."
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:outline-hidden"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
                  <button
                    type="button"
                    onClick={() => setCorrectionStudent(null)}
                    className="rounded-lg border border-slate-300 px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Ghairi
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-sky-600 px-4 py-1.5 font-bold text-white hover:bg-sky-700"
                  >
                    Tuma Ombi
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
