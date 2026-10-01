import React from 'react';
import {
  ArrowRight,
  Award,
  BarChart3,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  Coins,
  Globe,
  GraduationCap,
  Layers,
  Lock,
  MessageSquare,
  Shield,
  Sparkles,
  Users,
} from 'lucide-react';

interface LandingPageProps {
  onEnterApp: () => void;
  onOpenRegisterSchool: () => void;
  onOpenJoinSchool: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterApp,
  onOpenRegisterSchool,
  onOpenJoinSchool,
}) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white">
      {/* Navigation */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-emerald-500 to-sky-600 text-white shadow-lg shadow-emerald-500/20">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-white flex items-center gap-1.5">
                SMART SCHOOL HUB
                <span className="rounded-md bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                  TANZANIA
                </span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onOpenJoinSchool}
              className="rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-800"
            >
              Jiunge kwa Code
            </button>
            <button
              onClick={onOpenRegisterSchool}
              className="rounded-xl bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-500"
            >
              Sajili Shule Yako
            </button>
            <button
              onClick={onEnterApp}
              className="flex items-center gap-1.5 rounded-xl bg-sky-600 px-4 py-1.5 text-xs font-bold text-white shadow-lg shadow-sky-600/30 hover:bg-sky-500"
            >
              Fungua Mfumo (Enter System)
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 lg:pt-28 lg:pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-300 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            Multi-Tenant SaaS Education Management for Tanzanian Schools
          </div>

          <h1 className="mt-6 text-4xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
            Simamia Shule Yako. <br />
            <span className="bg-linear-to-r from-emerald-400 via-sky-400 to-indigo-400 bg-clip-text text-transparent">
              Elewa Wanafunzi Wako.
            </span> <br />
            Okoa Muda wa Walimu.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base text-slate-400 sm:text-lg">
            Mfumo wa kisasa wa kidijitali unaounganisha Wamiliki wa Shule, Wakuu wa Shule, Wakuu wa Taaluma, Walimu, Wanafunzi na Wazazi katika mfumo mmoja salama na thabiti wenye utangamano kamili na mitaala ya NECTA.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3 sm:gap-4">
            <button
              onClick={onOpenRegisterSchool}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-xl shadow-emerald-600/30 hover:bg-emerald-500"
            >
              Sajili Shule Yako Sasa
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={onEnterApp}
              className="rounded-xl border border-slate-700 bg-slate-900 px-6 py-3 text-sm font-bold text-slate-200 hover:bg-slate-800"
            >
              Tazama Shule ya Mfano (Live Demo)
            </button>
          </div>

          {/* Highlights tags */}
          <div className="mt-12 flex flex-wrap justify-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Primary (Std 1–7)
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" /> O-Level (Form I–IV)
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" /> A-Level Combinations (PCM, PCB, HGL)
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" /> NECTA Division Engine
            </span>
          </div>
        </div>

        {/* Gradient blur glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[800px] bg-linear-to-tr from-sky-600/20 via-emerald-600/20 to-purple-600/20 blur-[120px] pointer-events-none"></div>
      </section>

      {/* Feature Grid Section */}
      <section className="border-t border-slate-900 bg-slate-900/50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-black text-white sm:text-3xl">
              Moduli Kamilifu Zilizoundwa Mahususi kwa Tanzania
            </h2>
            <p className="mt-2 text-xs text-slate-400 sm:text-sm">
              Kila moduli imeundwa kwa viwango vya juu vya usalama, wepesi na matumizi ya data ndogo (Low-Bandwidth Friendly)
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-slate-700">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400 mb-4">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">Multi-School / Multi-Tenant</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Kila shule ina mfumo wake uliotenganishwa kabisa kwa usalama. Walimu wanaweza kujiunga na shule nyingi kupitia Namba ya Shule (School Code).
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-slate-700">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 mb-4">
                <Award className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">Hesabu ya Matokeo & NECTA Division</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Mfumo unakokotoa alama, wastani, madaraja (Grade A-F), pointi na NECTA Division I hadi 0 moja kwa moja mara tu mwalimu anapoingiza alama.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-slate-700">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 mb-4">
                <Lock className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">Mchakato wa Uhakiki (Result Release)</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Mwalimu anawasilisha alama, Mkuu wa Taaluma anahakiki na kuidhinisha, kisha kutoa matokeo hewani kwa wanafunzi na wazazi.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-slate-700">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 mb-4">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">Madarasa na Mikondo (Streams)</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Uundaji wa mikondo huria (mf. Form I A, Form V PCM, au Science), mgawo wa walimu walezi na ufuatiliaji wa maendeleo ya darasa.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-slate-700">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-500/10 text-pink-400 mb-4">
                <Coins className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">Ada na Fedha za Shule (TZS)</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Usimamizi wa ada za masomo na bweni, kurekodi malipo ya Benki (NMB, CRDB) na M-Pesa, na utoaji wa stakabadhi rasmi zenye namba za kipekee.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-slate-700">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 mb-4">
                <MessageSquare className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">Tovuti ya Wazazi & Arifa za SMS</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Wazazi wanaweza kuona watoto wao, kutazama kadi rasmi za matokeo yaliyotolewa na kupokea ujumbe mfupi wa SMS matokeo yakitoka.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-8 text-center text-xs text-slate-500">
        <p>© 2026 SMART SCHOOL HUB – TANZANIA. Mfumo Shirikishi wa Taarifa za Shule.</p>
        <p className="mt-1 text-[11px] text-slate-600">
          Umebuniwa kwa Mfumo wa NECTA, Wizara ya Elimu, Sayansi na Teknolojia (MoEST) & TAMISEMI
        </p>
      </footer>
    </div>
  );
};
