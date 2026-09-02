import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ROLE_CONFIGS } from '../../data/mockUsers';
import { AlertCircle, ArrowRight, FolderKanban, PlusCircle, Search, X } from 'lucide-react';

export const CaseSelection: React.FC = () => {
  const { user, cases, openAssignedCase, addCaseToPortal } = useAuth();
  const [caseNumber, setCaseNumber] = useState('');
  const [error, setError] = useState('');
  const [showCaseForm, setShowCaseForm] = useState(false);

  if (!user) return null;

  const assignedCases = Object.values(cases).filter((caseRecord) =>
    user.assignedCaseIds.includes(caseRecord.caseId) || caseRecord.assignedOfficerIds.includes(user.id)
  );
  const isForensicOfficer = user.prefix === 'FO';

  const openCase = (targetCaseId: string) => {
    const result = openAssignedCase(targetCaseId);
    setError(result.message || '');
  };

  const handleForensicSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!caseNumber.trim()) {
      setError('Enter the assigned case number for the forensic report.');
      return;
    }
    const result = addCaseToPortal(caseNumber);
    setError(result.message || '');
  };

  const handleAddCase = (event: React.FormEvent) => {
    event.preventDefault();
    const result = addCaseToPortal(caseNumber);
    setError(result.message || '');
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] max-w-5xl mx-auto p-6 flex items-center">
      <section className="w-full white-panel rounded-2xl p-8 border border-slate-200 shadow-sm">
        <div className="mb-7 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="text-xs font-mono font-bold text-blue-700 mb-1">OFFICER: {user.id}</div>
            <h1 className="text-2xl font-black text-slate-900">{isForensicOfficer ? 'Enter a Case Number' : 'Select a Case Workspace'}</h1>
            <p className="text-sm text-slate-500 mt-1">
              {isForensicOfficer
                ? 'Enter a case assigned to you to upload its forensic laboratory report.'
              : 'Choose any linked case below, or add a case to your portal.'}
            </p>
          </div>
          {!isForensicOfficer && (
            <div className="shrink-0 rounded-2xl bg-blue-50 border border-blue-200 px-5 py-3 text-center">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-700">Cases assigned to you</div>
              <div className="text-3xl leading-none mt-1 font-black text-blue-900">{assignedCases.length}</div>
              <div className="text-[11px] text-blue-700 mt-1">Select a case to open</div>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-900 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" /> {error}
          </div>
        )}

        {isForensicOfficer ? (
          <form onSubmit={handleForensicSubmit} className="max-w-xl space-y-4">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Assigned Case Number</label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  value={caseNumber}
                  onChange={(event) => setCaseNumber(event.target.value)}
                  placeholder="e.g. CASE-102"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 font-mono text-sm focus:outline-none focus:border-emerald-600"
                  required
                />
              </div>
              <button type="submit" className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 cursor-pointer">
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-500">The case must already have been created by a Police Officer. It will then be added to your forensic portal for report upload.</p>
          </form>
        ) : (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs font-bold text-slate-700">Your case workspaces</div>
              <button onClick={() => { setShowCaseForm(!showCaseForm); setError(''); setCaseNumber(''); }} className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer">
                {showCaseForm ? <X className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
                {showCaseForm ? 'Cancel' : user.prefix === 'PO' ? 'New Case' : 'Add Existing Case'}
              </button>
            </div>

            {showCaseForm && (
              <form onSubmit={handleAddCase} className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-blue-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input value={caseNumber} onChange={(event) => setCaseNumber(event.target.value)} placeholder="Enter case number, e.g. CASE-105" className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-blue-200 font-mono text-sm focus:outline-none focus:border-blue-600" required />
                </div>
                <button type="submit" className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer">
                  {user.prefix === 'PO' ? 'Create & Open' : 'Add & Open'}
                </button>
              </form>
            )}

            {assignedCases.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {assignedCases.map((caseRecord) => (
                <button key={caseRecord.caseId} onClick={() => openCase(caseRecord.caseId)} className="text-left p-5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between gap-3">
                    <FolderKanban className="w-6 h-6 text-blue-600 shrink-0" />
                    <span className="text-[10px] font-mono font-bold px-2 py-1 rounded bg-white border border-slate-200 text-slate-600">{caseRecord.status.replace('_', ' ')}</span>
                  </div>
                  <div className="mt-4 text-xs font-mono font-bold text-blue-700">{caseRecord.caseId}</div>
                  <h2 className="mt-1 text-sm font-bold text-slate-900">{caseRecord.title}</h2>
                  <p className="mt-2 text-xs text-slate-500">{caseRecord.incidentLocation}</p>
                  <div className="mt-4 text-xs font-bold text-blue-700 flex items-center gap-1">Open this case <ArrowRight className="w-3.5 h-3.5" /></div>
                </button>
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-center text-sm text-slate-600">
                No cases are linked to this officer account yet. Use <strong>{user.prefix === 'PO' ? 'New Case' : 'Add Existing Case'}</strong> to continue.
              </div>
            )}
          </div>
        )}

        <div className="mt-7 text-xs text-slate-500 border-t border-slate-200 pt-4">{ROLE_CONFIGS[user.prefix].title} access is limited to assigned case records.</div>
      </section>
    </main>
  );
};
