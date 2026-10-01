import React, { useState } from 'react';
import {
  Bell,
  Building2,
  ChevronDown,
  Globe,
  GraduationCap,
  LogOut,
  PlusCircle,
  Search,
  Shield,
  UserCheck,
  Users,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { POSITION_OPTIONS } from '../../constants/tanzania';
import { PositionTitle } from '../../types';

interface NavbarProps {
  onOpenRegisterSchool: () => void;
  onOpenJoinSchool: () => void;
  onNavigate: (page: string) => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenRegisterSchool,
  onOpenJoinSchool,
  onNavigate,
  onOpenSearch,
}) => {
  const {
    currentUser,
    currentSchool,
    userSchools,
    switchSchool,
    activePosition,
    setActivePosition,
    announcements,
  } = useAuth();

  const [showSchoolDropdown, setShowSchoolDropdown] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const currentRoleInfo = POSITION_OPTIONS.find((p) => p.title === activePosition);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 shadow-xs backdrop-blur-md">
      {/* Left: Brand & School Switcher */}
      <div className="flex items-center gap-3">
        <div
          onClick={() => onNavigate('dashboard')}
          className="flex cursor-pointer items-center gap-2.5 font-bold tracking-tight text-slate-900"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-emerald-600 to-sky-700 text-white shadow-md shadow-emerald-700/20">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-1.5 text-base font-extrabold text-slate-900">
              SMART SCHOOL HUB
              <span className="rounded-md bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-800">
                TZ
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-500">Mfumo wa Usimamizi wa Shule</p>
          </div>
        </div>

        {/* School Selector Dropdown */}
        <div className="relative ml-2">
          <button
            onClick={() => {
              setShowSchoolDropdown(!showSchoolDropdown);
              setShowRoleDropdown(false);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 focus:outline-hidden"
          >
            <Building2 className="h-3.5 w-3.5 text-sky-600" />
            <span className="max-w-[140px] truncate sm:max-w-[200px]">
              {currentSchool?.name || 'Chagua Shule'}
            </span>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>

          {showSchoolDropdown && (
            <div className="absolute left-0 mt-1.5 w-72 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
              <div className="px-2 py-1 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                Shule Zangu (My Schools)
              </div>
              <div className="max-h-56 space-y-1 overflow-y-auto py-1">
                {userSchools.map((sch) => (
                  <button
                    key={sch.id}
                    onClick={() => {
                      switchSchool(sch.id);
                      setShowSchoolDropdown(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs transition ${
                      currentSchool?.id === sch.id
                        ? 'bg-sky-50 font-bold text-sky-900'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="truncate">
                      <p className="truncate">{sch.name}</p>
                      <p className="text-[10px] font-normal text-slate-500">
                        Code: <span className="font-mono font-medium text-slate-700">{sch.code}</span>
                      </p>
                    </div>
                    {currentSchool?.id === sch.id && (
                      <span className="h-2 w-2 rounded-full bg-sky-600"></span>
                    )}
                  </button>
                ))}
              </div>

              <div className="mt-1 border-t border-slate-100 pt-1.5">
                <button
                  onClick={() => {
                    setShowSchoolDropdown(false);
                    onOpenRegisterSchool();
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
                >
                  <PlusCircle className="h-4 w-4" />
                  Sajili Shule Mpya (Register School)
                </button>
                <button
                  onClick={() => {
                    setShowSchoolDropdown(false);
                    onOpenJoinSchool();
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-sky-700 hover:bg-sky-50"
                >
                  <Users className="h-4 w-4" />
                  Jiunge na Shule kwa Code (Join School)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Center: Search Button */}
      <div className="hidden md:flex">
        <button
          onClick={onOpenSearch}
          className="flex w-64 items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-500 transition hover:border-slate-300 hover:bg-slate-100"
        >
          <span className="flex items-center gap-2">
            <Search className="h-3.5 w-3.5 text-slate-400" />
            Tafuta mwanafunzi, mwalimu...
          </span>
          <kbd className="rounded border border-slate-300 bg-white px-1.5 py-0.5 text-[10px] text-slate-400">
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Right: Position/Role Switcher & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Active Role Switcher Badge */}
        <div className="relative">
          <button
            onClick={() => {
              setShowRoleDropdown(!showRoleDropdown);
              setShowSchoolDropdown(false);
              setShowNotifications(false);
            }}
            className="flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50/80 px-2.5 py-1.5 text-xs font-semibold text-amber-900 transition hover:bg-amber-100"
            title="Switch View Position / Role for Testing"
          >
            <Shield className="h-3.5 w-3.5 text-amber-600" />
            <span className="hidden sm:inline">{activePosition}</span>
            <span className="text-[10px] text-amber-700 sm:hidden">Role</span>
            <ChevronDown className="h-3 w-3 text-amber-500" />
          </button>

          {showRoleDropdown && (
            <div className="absolute right-0 mt-1.5 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
              <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase">
                Badili Nafasi / Wadhifa (Switch Role)
              </div>
              <p className="px-2 pb-1.5 text-[10px] text-slate-500">
                Pitia majukumu mbalimbali kama vile Mkuu wa Shule, Taaluma, Mwalimu, n.k.
              </p>
              <div className="max-h-64 space-y-0.5 overflow-y-auto">
                {POSITION_OPTIONS.map((pos) => (
                  <button
                    key={pos.title}
                    onClick={() => {
                      setActivePosition(pos.title as PositionTitle);
                      setShowRoleDropdown(false);
                    }}
                    className={`flex w-full items-start justify-between rounded-lg px-2 py-1.5 text-left text-xs transition ${
                      activePosition === pos.title
                        ? 'bg-amber-50 font-bold text-amber-900'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <p className="font-semibold">{pos.title}</p>
                      <p className="text-[10px] text-slate-500">{pos.swahili}</p>
                    </div>
                    {activePosition === pos.title && (
                      <UserCheck className="mt-0.5 h-3.5 w-3.5 text-amber-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowSchoolDropdown(false);
              setShowRoleDropdown(false);
            }}
            className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
          >
            <Bell className="h-4 w-4" />
            {announcements.length > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-1.5 w-80 rounded-xl border border-slate-200 bg-white p-3 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h4 className="text-xs font-bold text-slate-800">Matangazo na Arifa (Notifications)</h4>
                <span className="rounded bg-sky-100 px-1.5 py-0.5 text-[10px] font-semibold text-sky-800">
                  {announcements.length}
                </span>
              </div>
              <div className="max-h-64 space-y-2 overflow-y-auto py-2">
                {announcements.slice(0, 4).map((anc) => (
                  <div key={anc.id} className="rounded-lg bg-slate-50 p-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800">{anc.title}</span>
                      <span className="text-[9px] text-slate-400">
                        {new Date(anc.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-[11px] text-slate-600">{anc.content}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  setShowNotifications(false);
                  onNavigate('communication');
                }}
                className="w-full rounded-lg bg-slate-100 py-1.5 text-center text-xs font-semibold text-slate-700 hover:bg-slate-200"
              >
                Tazama Yote (View All)
              </button>
            </div>
          )}
        </div>

        {/* User Avatar */}
        <div className="flex items-center gap-2 border-l border-slate-200 pl-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
            {currentUser?.fullName.charAt(0) || 'U'}
          </div>
          <div className="hidden text-left xl:block">
            <p className="text-xs font-bold text-slate-800 truncate max-w-[120px]">{currentUser?.fullName}</p>
            <p className="text-[10px] font-medium text-slate-500">{activePosition}</p>
          </div>
        </div>
      </div>
    </header>
  );
};
