import React from 'react';
import {
  Award,
  BarChart3,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Coins,
  FileSpreadsheet,
  GraduationCap,
  Layers,
  LayoutDashboard,
  MessageSquare,
  School as SchoolIcon,
  Settings,
  ShieldAlert,
  UserCheck,
  Users,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate }) => {
  const { currentSchool, activePosition, hasPermission } = useAuth();

  const navGroups = [
    {
      group: 'Kuu (Core)',
      items: [
        { id: 'dashboard', label: 'Dashboard', swahili: 'Muhtasari', icon: LayoutDashboard },
        { id: 'students', label: 'Students', swahili: 'Wanafunzi', icon: Users, perm: 'students.view' },
        { id: 'teachers', label: 'Teachers & Staff', swahili: 'Wafanyakazi', icon: UserCheck, perm: 'teachers.view' },
      ],
    },
    {
      group: 'Taaluma (Academic)',
      items: [
        { id: 'streams', label: 'Streams (Mikondo)', swahili: 'Madarasa', icon: Layers, perm: 'streams.manage' },
        { id: 'departments', label: 'Departments', swahili: 'Idara', icon: SchoolIcon, perm: 'departments.manage' },
        { id: 'combinations', label: 'Combinations', swahili: 'Mchepuo (A-Level)', icon: BookOpen, perm: 'combinations.manage' },
        { id: 'subjects', label: 'Subjects', swahili: 'Masomo', icon: BookOpen, perm: 'subjects.manage' },
      ],
    },
    {
      group: 'Mitihani na Mahudhurio',
      items: [
        { id: 'examinations', label: 'Examinations', swahili: 'Mitihani', icon: FileSpreadsheet, perm: 'marks.enter' },
        { id: 'results', label: 'Results & Reports', swahili: 'Matokeo', icon: Award, perm: 'results.view' },
        { id: 'attendance', label: 'Attendance', swahili: 'Mahudhurio', icon: CalendarCheck, perm: 'attendance.view' },
      ],
    },
    {
      group: 'Utawala na Huduma',
      items: [
        { id: 'finance', label: 'School Fees & Finance', swahili: 'Ada na Fedha', icon: Coins, perm: 'finance.view' },
        { id: 'discipline', label: 'Discipline', swahili: 'Nidhamu', icon: ShieldAlert, perm: 'discipline.view' },
        { id: 'qa', label: 'Quality Assurance', swahili: 'Udhibiti Ubora', icon: CheckCircle2, perm: 'qa.view' },
      ],
    },
    {
      group: 'Tovuti za Watumiaji (Portals)',
      items: [
        { id: 'parent-portal', label: 'Parent Portal', swahili: 'Wazazi', icon: Users },
        { id: 'student-portal', label: 'Student Portal', swahili: 'Mwanafunzi', icon: GraduationCap },
        { id: 'communication', label: 'Communication & SMS', swahili: 'Mawasiliano', icon: MessageSquare },
      ],
    },
    {
      group: 'Mfumo (System)',
      items: [
        { id: 'analytics', label: 'Analytics & Reports', swahili: 'Takwimu', icon: BarChart3, perm: 'reports.view' },
        { id: 'audit-logs', label: 'Audit Trail', swahili: 'Kumbukumbu', icon: ClipboardList, perm: 'audit.view' },
        { id: 'settings', label: 'School Settings', swahili: 'Mipangilio', icon: Settings, perm: 'school.configure' },
      ],
    },
  ];

  return (
    <aside className="flex h-[calc(100vh-4rem)] w-64 flex-col justify-between border-r border-slate-200 bg-slate-900 text-slate-300">
      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        {/* School Summary Banner */}
        <div className="mb-4 rounded-xl bg-slate-800/80 p-3 text-xs border border-slate-700/50">
          <p className="font-bold text-white truncate">{currentSchool?.name || 'Smart School Hub'}</p>
          <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
            <span>Code: <strong className="font-mono text-emerald-400">{currentSchool?.code}</strong></span>
            <span className="rounded bg-sky-900/60 px-1.5 py-0.2 text-[10px] text-sky-300">
              {currentSchool?.academicYear}
            </span>
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            {currentSchool?.educationLevels.map((lvl) => (
              <span key={lvl} className="rounded-md bg-slate-700 px-1.5 py-0.5 text-[9px] font-semibold text-slate-200">
                {lvl}
              </span>
            ))}
          </div>
        </div>

        {/* Groups */}
        <div className="space-y-4">
          {navGroups.map((group) => {
            const visibleItems = group.items.filter((item) => {
              if (activePosition === 'School Owner') return true;
              if (item.perm) return hasPermission(item.perm as any);
              return true;
            });

            if (visibleItems.length === 0) return null;

            return (
              <div key={group.group}>
                <h5 className="mb-1.5 px-2 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                  {group.group}
                </h5>
                <div className="space-y-0.5">
                  {visibleItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentPage === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => onNavigate(item.id)}
                        className={`group flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs font-medium transition ${
                          isActive
                            ? 'bg-sky-600 text-white shadow-xs font-semibold'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-sky-400'}`} />
                          <span className="truncate">{item.label}</span>
                        </div>
                        {isActive && <ChevronRight className="h-3 w-3 text-sky-200" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div className="border-t border-slate-800 p-3 text-[11px] text-slate-500">
        <div className="flex items-center justify-between">
          <span>Toleo v2.4 (NECTA Ready)</span>
          <span className="flex h-2 w-2 rounded-full bg-emerald-500" title="Online & Synced"></span>
        </div>
        <p className="mt-0.5 text-[10px] text-slate-600">SMART SCHOOL HUB TANZANIA</p>
      </div>
    </aside>
  );
};
