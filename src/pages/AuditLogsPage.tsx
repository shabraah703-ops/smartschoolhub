import React, { useState } from 'react';
import {
  Calendar,
  ClipboardList,
  Filter,
  Lock,
  Search,
  Shield,
  User,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const AuditLogsPage: React.FC = () => {
  const { auditLogs, currentSchool } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState('All');

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesModule = selectedModule === 'All' || log.module === selectedModule;
    return matchesSearch && matchesModule;
  });

  const modules = Array.from(new Set(auditLogs.map((l) => l.module)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Kumbukumbu za Usalama na Matukio (Immutable Audit Trail)
          </h2>
          <p className="text-xs text-slate-500">
            Kumbukumbu zote za mabadiliko ya alama, usajili, uhamisho, na uidhinishaji zimehifadhiwa bila uwezekano wa kufutwa
          </p>
        </div>

        <div className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-bold text-white shadow-xs">
          <Lock className="h-3.5 w-3.5 text-emerald-400" />
          <span>Matukio {auditLogs.length} Yamerekodiwa</span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tafuta kitendo, mtumiaji, au maelezo ya ukaguzi..."
            className="w-full rounded-xl border border-slate-300 py-1.5 pr-3 pl-9 text-xs focus:outline-hidden"
          />
        </div>

        <div>
          <select
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            className="rounded-xl border border-slate-300 p-2 text-xs font-semibold text-slate-700 focus:outline-hidden"
          >
            <option value="All">Moduli Zote (All Modules)</option>
            {modules.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
              <tr>
                <th className="py-3 px-3 font-semibold">Muda & Tarehe</th>
                <th className="py-3 px-3 font-semibold">Mtumiaji (User)</th>
                <th className="py-3 px-3 font-semibold">Moduli</th>
                <th className="py-3 px-3 font-semibold">Kitendo (Action)</th>
                <th className="py-3 px-3 font-semibold">Maelezo Kamili ya Ukaguzi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleDateString()} {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-800 whitespace-nowrap">
                    {log.userName}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="rounded bg-sky-50 px-2 py-0.5 text-[10px] font-bold text-sky-800">
                      {log.module}
                    </span>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="font-mono text-[11px] font-bold text-slate-900">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600 leading-relaxed">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
