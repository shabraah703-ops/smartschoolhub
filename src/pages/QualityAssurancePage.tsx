import React from 'react';
import {
  Award,
  BarChart3,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  FileCheck,
  LineChart,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const QualityAssurancePage: React.FC = () => {
  const {
    students,
    streams,
    subjects,
    departments,
    examinations,
    currentSchool,
  } = useAuth();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          Udhibiti Ubora wa Elimu (Quality Assurance & Academic Standards)
        </h2>
        <p className="text-xs text-slate-500">
          Tathmini ya utoaji wa mtaala, uwiano wa walimu na wanafunzi, viwango vya ufaulu, na mikakati ya kuboresha shule
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Uwiano wa Wanafunzi kwa Darasa</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900">1 : 35</p>
          <p className="mt-1 text-[11px] text-emerald-600 font-semibold">Kiwango cha juu cha kitaifa (Good)</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Utoaji wa Mtaala (Syllabus Coverage)</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
              <BookOpen className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900">84%</p>
          <p className="mt-1 text-[11px] text-sky-600 font-semibold">Kwenye mstari wa mpango kazi</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Mahudhurio ya Walimu</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <CalendarCheck className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900">98.2%</p>
          <p className="mt-1 text-[11px] text-purple-600 font-semibold">Vipindi vyote vinafuatiliwa</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Kiwango cha Ufaulu wa NECTA</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Award className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900">Daraja I - III: 92%</p>
          <p className="mt-1 text-[11px] text-amber-600 font-semibold">Lengo la ubora limetimizwa</p>
        </div>
      </div>

      {/* Evaluation Rubrics */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900">
          Viashiria Vikuu vya Udhibiti Ubora (QA Quality Indicators)
        </h3>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-800 mb-1">
              <span>Upatikanaji wa Vitabu na Vifaa vya Maabara</span>
              <span>88%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full rounded-full bg-emerald-500" style={{ width: '88%' }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-800 mb-1">
              <span>Ukaguzi wa Masomo na Madarasa (Classroom Observations)</span>
              <span>94%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full rounded-full bg-sky-500" style={{ width: '94%' }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-800 mb-1">
              <span>Uthabiti wa Ratiba na Kazi za Nyumbani (Homework & Assessment Integrity)</span>
              <span>91%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full rounded-full bg-purple-500" style={{ width: '91%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
