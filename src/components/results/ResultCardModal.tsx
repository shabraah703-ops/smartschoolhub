import React, { useRef } from 'react';
import { Award, CheckCircle2, Download, Printer, Share2, Shield, X } from 'lucide-react';
import { CalculatedStudentResult, School } from '../../types';

interface ResultCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: CalculatedStudentResult | null;
  school: School | null;
}

export const ResultCardModal: React.FC<ResultCardModalProps> = ({
  isOpen,
  onClose,
  result,
  school,
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !result) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="max-h-[95vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        {/* Top actions bar */}
        <div className="no-print mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-amber-600" />
            <h3 className="text-sm font-bold text-slate-800">
              Kadi Rasmi ya Matokeo (Official Academic Transcript)
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50"
            >
              <Printer className="h-3.5 w-3.5 text-slate-600" />
              Chapa (Print)
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Result Slip Container */}
        <div
          ref={printRef}
          className="rounded-xl border border-slate-300 bg-white p-6 text-slate-900 shadow-xs print:m-0 print:border-none print:p-0 print:shadow-none"
        >
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-4 text-center">
            <div className="flex items-center justify-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 font-extrabold text-white text-lg">
                TZ
              </div>
              <div>
                <h1 className="text-lg font-black tracking-wide uppercase sm:text-xl">
                  {school?.name || 'TANZANIA SECONDARY SCHOOL'}
                </h1>
                <p className="text-xs font-medium text-slate-600">
                  Reg No: <span className="font-semibold text-slate-900">{school?.registrationNumber}</span> | {school?.district}, {school?.region}
                </p>
                <p className="text-[11px] italic text-slate-500">"{school?.motto}"</p>
              </div>
            </div>
            <div className="mt-3 inline-block rounded-md bg-slate-100 px-4 py-1 text-xs font-bold tracking-wider uppercase text-slate-800">
              RIPOTI YA MATOKEO YA MITIHANI (STUDENT EXAMINATION REPORT)
            </div>
          </div>

          {/* Student Bio Grid */}
          <div className="my-4 grid grid-cols-2 gap-2 rounded-lg bg-slate-50 p-3 text-xs sm:grid-cols-4 border border-slate-200">
            <div>
              <span className="text-[10px] text-slate-500 uppercase">Jina la Mwanafunzi</span>
              <p className="font-bold text-slate-900 truncate">{result.studentName}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase">Namba ya Usajili</span>
              <p className="font-mono font-bold text-slate-900">{result.admissionNumber}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase">Darasa / Mkondo</span>
              <p className="font-semibold text-slate-900">{result.streamName || result.formStandard}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase">Mtihani & Muhula</span>
              <p className="font-semibold text-slate-900">{result.term} ({result.academicYear})</p>
            </div>
          </div>

          {/* Subject Marks Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-800 bg-slate-100 text-slate-800">
                  <th className="py-2 px-2 font-bold">#</th>
                  <th className="py-2 px-2 font-bold">Somo (Subject)</th>
                  <th className="py-2 px-2 font-bold text-center">Alama (%)</th>
                  <th className="py-2 px-2 font-bold text-center">Daraja (Grade)</th>
                  <th className="py-2 px-2 font-bold text-center">Points</th>
                  <th className="py-2 px-2 font-bold">Maoni ya Mwalimu (Remark)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {result.subjects.map((subj, idx) => (
                  <tr key={subj.subjectId} className="hover:bg-slate-50">
                    <td className="py-2 px-2 text-slate-500">{idx + 1}</td>
                    <td className="py-2 px-2 font-semibold text-slate-900">
                      {subj.subjectName} <span className="text-[10px] font-mono text-slate-500">({subj.subjectCode})</span>
                    </td>
                    <td className="py-2 px-2 text-center font-bold">
                      {subj.isAbsent ? 'ABS' : subj.isExcused ? 'EXC' : `${subj.score}%`}
                    </td>
                    <td className="py-2 px-2 text-center">
                      <span
                        className={`inline-block rounded px-2 py-0.5 font-bold ${
                          subj.grade === 'A'
                            ? 'bg-emerald-100 text-emerald-800'
                            : subj.grade === 'B'
                            ? 'bg-sky-100 text-sky-800'
                            : subj.grade === 'C'
                            ? 'bg-amber-100 text-amber-800'
                            : subj.grade === 'D'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {subj.grade}
                      </span>
                    </td>
                    <td className="py-2 px-2 text-center font-mono font-medium">{subj.point}</td>
                    <td className="py-2 px-2 text-slate-600 text-[11px]">{subj.remark}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Performance Summary Banner */}
          <div className="mt-4 rounded-xl border border-slate-300 bg-slate-900 p-4 text-white">
            <div className="grid grid-cols-2 gap-3 text-center sm:grid-cols-5">
              <div>
                <span className="text-[10px] text-slate-400 uppercase">Jumla ya Alama</span>
                <p className="text-base font-extrabold text-white">{result.totalScore} / {result.maxTotalScore}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase">Wastani (Average)</span>
                <p className="text-base font-extrabold text-sky-400">{result.averageScore}%</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase">Daraja la Jumla</span>
                <p className="text-base font-extrabold text-amber-400">{result.overallGrade}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase">Daraja la NECTA (Division)</span>
                <p className="text-base font-extrabold text-emerald-400">{result.division}</p>
                <span className="text-[9px] text-slate-400 font-mono">Pointi: {result.pointsTotal}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase">Nafasi (Position/Rank)</span>
                <p className="text-base font-extrabold text-white">
                  {result.position ? `${result.position} / ${result.totalStudentsInClass}` : '—'}
                </p>
              </div>
            </div>
          </div>

          {/* Remarks & Signatures */}
          <div className="mt-5 space-y-3 text-xs">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5">
              <span className="font-bold text-slate-800">Maoni ya Mkuu wa Taaluma (Academic Master/Mistress):</span>
              <p className="mt-0.5 text-slate-600 italic">"{result.academicRemark || 'Matokeo mazuri. Endelea kuweka bidii zaidi.'}"</p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-200">
              <div className="text-center">
                <div className="mx-auto mb-1 h-8 w-32 border-b border-dashed border-slate-400"></div>
                <p className="font-semibold text-slate-800">Mwalimu wa Darasa (Class Teacher)</p>
                <p className="text-[10px] text-slate-500">Tarehe: {new Date().toLocaleDateString()}</p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-1 h-8 w-32 border-b border-dashed border-slate-400"></div>
                <p className="font-semibold text-slate-800">Mkuu wa Shule (Head of School)</p>
                <p className="text-[10px] text-slate-500">Mhuri Rasmi (Official School Stamp)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
