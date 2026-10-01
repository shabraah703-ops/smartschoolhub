import React, { useState } from 'react';
import {
  ArrowRightLeft,
  Award,
  ChevronDown,
  Download,
  Filter,
  GraduationCap,
  Plus,
  Search,
  UserCheck,
  UserPlus,
  Users,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { StudentMovementModal } from '../components/students/StudentMovementModal';
import { ResultCardModal } from '../components/results/ResultCardModal';
import { computeStudentExamResult, rankStudentResults } from '../utils/gradeCalculator';
import { CalculatedStudentResult, EducationLevel, Student, StudentStatus } from '../types';

interface StudentsPageProps {
  onOpenAddStudent: () => void;
}

export const StudentsPage: React.FC<StudentsPageProps> = ({ onOpenAddStudent }) => {
  const {
    students,
    streams,
    combinations,
    subjects,
    examinations,
    marks,
    currentSchool,
  } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [selectedStream, setSelectedStream] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  const [movementStudent, setMovementStudent] = useState<Student | null>(null);
  const [viewResultStudent, setViewResultStudent] = useState<CalculatedStudentResult | null>(null);

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.admissionNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.parentName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLevel = selectedLevel === 'All' || s.level === selectedLevel;
    const matchesStream = selectedStream === 'All' || s.streamId === selectedStream || s.streamName === selectedStream;
    const matchesStatus = selectedStatus === 'All' || s.status === selectedStatus;

    return matchesSearch && matchesLevel && matchesStream && matchesStatus;
  });

  // Helper to open student report card
  const handleOpenResultCard = (student: Student) => {
    // Look for latest released exam
    const releasedExams = examinations.filter((e) => e.status === 'RELEASED');
    const targetExam = releasedExams[0] || examinations[0];
    if (!targetExam) {
      alert('Hakuna mtihani uliotolewa matokeo kwa sasa.');
      return;
    }

    const studentMarks = marks.filter((m) => m.studentId === student.id && m.examId === targetExam.id);
    const calculated = computeStudentExamResult(
      { id: student.id, fullName: student.fullName, admissionNumber: student.admissionNumber },
      { id: targetExam.id, name: targetExam.name, academicYear: targetExam.academicYear, term: targetExam.term, formStandard: targetExam.formStandard, level: targetExam.level },
      student.streamName || student.formStandard,
      studentMarks,
      subjects,
      currentSchool?.gradingScale,
      student.combinationCode
    );

    // Compute ranking
    const allCalculatedInClass = students
      .filter((st) => st.streamId === student.streamId)
      .map((st) => {
        const sMarks = marks.filter((m) => m.studentId === st.id && m.examId === targetExam.id);
        return computeStudentExamResult(
          { id: st.id, fullName: st.fullName, admissionNumber: st.admissionNumber },
          { id: targetExam.id, name: targetExam.name, academicYear: targetExam.academicYear, term: targetExam.term, formStandard: targetExam.formStandard, level: targetExam.level },
          st.streamName || st.formStandard,
          sMarks,
          subjects,
          currentSchool?.gradingScale,
          st.combinationCode
        );
      });

    const ranked = rankStudentResults(allCalculatedInClass);
    const selfRanked = ranked.find((r) => r.studentId === student.id) || calculated;
    setViewResultStudent(selfRanked);
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Daftari la Wanafunzi (Student Registry)
          </h2>
          <p className="text-xs text-slate-500">
            Jumla ya wanafunzi {students.length} wamesajiliwa katika {currentSchool?.name}
          </p>
        </div>

        <button
          onClick={onOpenAddStudent}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-emerald-700/20 hover:bg-emerald-700"
        >
          <UserPlus className="h-4 w-4" />
          Sajili Mwanafunzi Mpya
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tafuta kwa Jina, Namba ya Usajili, au Mzazi..."
            className="w-full rounded-xl border border-slate-300 py-2 pr-3 pl-9 text-xs focus:border-sky-500 focus:outline-hidden"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Level Filter */}
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 focus:outline-hidden"
          >
            <option value="All">Ngazi Zote (All Levels)</option>
            {currentSchool?.educationLevels.map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl}
              </option>
            ))}
          </select>

          {/* Stream Filter */}
          <select
            value={selectedStream}
            onChange={(e) => setSelectedStream(e.target.value)}
            className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 focus:outline-hidden"
          >
            <option value="All">Mikondo Yote (All Streams)</option>
            {streams.map((str) => (
              <option key={str.id} value={str.id}>
                {str.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 focus:outline-hidden"
          >
            <option value="All">Hali Zote (All Status)</option>
            <option value="Active">Active (Hai)</option>
            <option value="Transferred">Transferred (Aliyehamia)</option>
            <option value="Graduated">Graduated (Aliyehitimu)</option>
            <option value="Suspended">Suspended (Aliesimamishwa)</option>
          </select>
        </div>
      </div>

      {/* Students Data Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
              <tr>
                <th className="py-3 px-3 font-semibold">Namba ya Mwanafunzi</th>
                <th className="py-3 px-3 font-semibold">Jina Kamili</th>
                <th className="py-3 px-3 font-semibold">Jinsia</th>
                <th className="py-3 px-3 font-semibold">Ngazi & Darasa</th>
                <th className="py-3 px-3 font-semibold">Mkondo / Combination</th>
                <th className="py-3 px-3 font-semibold">Mzazi / Mlezi</th>
                <th className="py-3 px-3 font-semibold text-center">Hali</th>
                <th className="py-3 px-3 font-semibold text-right">Vitendo (Actions)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    Hakuna mwanafunzi aliyepatikana kwa vigezo hivi.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((st) => (
                  <tr key={st.id} className="transition hover:bg-slate-50">
                    <td className="py-3 px-3 font-mono font-bold text-sky-700">
                      {st.admissionNumber}
                      <span className="block text-[10px] text-slate-400 font-normal">{st.studentId}</span>
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-bold text-slate-900">{st.fullName}</p>
                      <p className="text-[10px] text-slate-500">Kuzaliwa: {st.dateOfBirth}</p>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-600">{st.gender}</td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-slate-800">{st.formStandard}</span>
                      <span className="block text-[10px] text-slate-400">{st.level}</span>
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-medium text-slate-800">{st.streamName || '—'}</p>
                      {st.combinationCode && (
                        <span className="rounded bg-emerald-100 px-1.5 py-0.2 font-mono text-[9px] font-bold text-emerald-800">
                          {st.combinationCode}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-medium text-slate-800">{st.parentName}</p>
                      <p className="font-mono text-[10px] text-slate-500">{st.parentPhone}</p>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          st.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : st.status === 'Graduated'
                            ? 'bg-sky-100 text-sky-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {st.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenResultCard(st)}
                          className="flex items-center gap-1 rounded-lg border border-amber-200 bg-amber-50 px-2 py-1 text-[11px] font-bold text-amber-800 hover:bg-amber-100"
                          title="Tazama Kadi ya Matokeo"
                        >
                          <Award className="h-3 w-3 text-amber-600" />
                          Kadi
                        </button>
                        <button
                          onClick={() => setMovementStudent(st)}
                          className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100"
                          title="Hamisha Mkondo / Combination / Pandisha"
                        >
                          <ArrowRightLeft className="h-3 w-3 text-slate-500" />
                          Hamisha
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

      {/* Student Movement Modal */}
      <StudentMovementModal
        isOpen={!!movementStudent}
        student={movementStudent}
        onClose={() => setMovementStudent(null)}
      />

      {/* Printable Result Card Modal */}
      <ResultCardModal
        isOpen={!!viewResultStudent}
        result={viewResultStudent}
        school={currentSchool}
        onClose={() => setViewResultStudent(null)}
      />
    </div>
  );
};
