import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ROLE_CONFIGS } from '../../data/mockUsers';
import { Shield, LogOut, FolderKanban } from 'lucide-react';

export const AppHeader: React.FC = () => {
  const { user, activeCaseId, setActiveCaseId, logout } = useAuth();

  if (!user) return null;

  const roleCfg = ROLE_CONFIGS[user.prefix];

  return (
    <header className="bg-slate-900 text-white sticky top-0 z-30 border-b border-slate-800 px-6 py-3 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand & Active Case Identifier */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-white tracking-wider">SI-PALMS</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                  CASE PORTAL
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Police Asset & Evidence Lifecycle System</p>
            </div>
          </div>

          {/* Case workspace selector */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-800 border border-slate-700">
              <FolderKanban className="w-4 h-4 text-cyan-400" />
              <div>
                <div className="text-[10px] font-mono uppercase text-slate-400">CASES IN YOUR PORTAL: {user.assignedCaseIds.length}</div>
                <div className="text-xs font-bold text-cyan-300 font-mono flex items-center gap-2">
                  <span>{activeCaseId || 'No case selected'}</span>
                  {user.prefix !== 'FO' && (
                    <select
                      value={activeCaseId || ''}
                      onChange={(e) => e.target.value && setActiveCaseId(e.target.value)}
                      disabled={user.assignedCaseIds.length === 0}
                      className="bg-slate-950 text-xs font-mono text-cyan-200 px-1.5 py-0.5 rounded border border-slate-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">Choose case</option>
                      {user.assignedCaseIds.map(cId => (
                        <option key={cId} value={cId}>{cId}</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            </div>
        </div>

        {/* Authenticated Officer Badge & Logout */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="flex items-center justify-end gap-2">
                <span className="text-xs font-bold text-white">{user.name}</span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${roleCfg.badgeColor}`}>
                  ID: {user.id}
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                {user.rankTitle} • <span className="text-cyan-400">{user.station}</span>
              </div>
            </div>

            <button
              onClick={logout}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-red-900/40 text-slate-300 hover:text-red-300 border border-slate-700 hover:border-red-700 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
              title="Logout session to switch officers or cases"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout Session
            </button>
          </div>
        </div>

      </div>
    </header>
  );
};
