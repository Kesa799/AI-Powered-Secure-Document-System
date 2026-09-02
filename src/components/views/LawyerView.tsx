import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import type { UploadedCaseFile } from '../../types/auth';
import { DocumentViewerModal } from './DocumentViewerModal';
import { FolderLock, FileText, Lock, Folder, AlertCircle, Eye } from 'lucide-react';

export const LawyerView: React.FC = () => {
  const { user, activeCaseId, activeCase } = useAuth();
  const [viewingFile, setViewingFile] = useState<UploadedCaseFile | null>(null);

  return (
    <div className="space-y-6">
      
      {/* Modal Document Reader */}
      <DocumentViewerModal
        file={viewingFile}
        caseId={activeCaseId || 'CASE-102'}
        onClose={() => setViewingFile(null)}
      />

      {/* Banner */}
      <div className="white-panel rounded-2xl p-6 border border-slate-200 bg-gradient-to-r from-purple-950 via-slate-900 to-slate-900 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-900 text-purple-200 border border-purple-800">
              LW PORTAL • ID: {user?.id}
            </span>
            <span className="text-xs font-mono text-purple-300 font-bold">CASE NO: {activeCaseId}</span>
          </div>
          <h1 className="text-2xl font-black tracking-wide">{activeCase?.title || `Case ${activeCaseId}`}</h1>
          <p className="text-sm text-slate-300">Strictly Read-Only access for assigned case {activeCaseId}. Open & inspect uploaded case files on screen.</p>
        </div>

        <div className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-right font-mono">
          <div className="text-[10px] text-slate-400 uppercase">Clearance</div>
          <div className="text-xs font-bold text-purple-300">READ-ONLY COURT VAULT</div>
        </div>
      </div>

      {activeCase ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Read-Only Evidence Inspector */}
          <div className="lg:col-span-8 space-y-4">
            <div className="white-panel rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <span className="text-xs font-mono text-purple-700 font-bold">{activeCase.caseId}</span>
                  <h2 className="text-lg font-bold text-slate-900">{activeCase.title}</h2>
                </div>
                <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded bg-purple-50 text-purple-800 border border-purple-200 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> READ-ONLY VAULT
                </span>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <Folder className="w-4 h-4 text-purple-600" /> Uploaded Case Records ({activeCase.uploadedFiles.length})
                </h3>

                {activeCase.uploadedFiles.length > 0 ? (
                  activeCase.uploadedFiles.map((file) => (
                    <div key={file.fileId} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 flex items-center gap-1.5">
                          <FileText className="w-4 h-4 text-purple-600" /> {file.fileName}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-300">
                            {file.category}
                          </span>
                          <button
                            onClick={() => setViewingFile(file)}
                            className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold text-[11px] flex items-center gap-1 cursor-pointer transition-all shadow-xs"
                          >
                            <Eye className="w-3.5 h-3.5" /> Open / View Document
                          </button>
                        </div>
                      </div>
                      <p className="text-slate-600 text-[11px] leading-relaxed bg-white p-2.5 rounded border border-slate-200 font-mono">
                        {file.description}
                      </p>
                      <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-200">
                        <span>Uploaded by: <strong className="text-purple-900">{file.uploadedByOfficerName} ({file.uploadedByOfficerId})</strong></span>
                        <span className="font-mono">{file.uploadTime}</span>
                      </div>
                      <div className="font-mono text-[9px] text-emerald-700 truncate">SHA-256 Seal: {file.sha256Hash}</div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 text-center space-y-1">
                    <Folder className="w-8 h-8 text-slate-400 mx-auto opacity-60" />
                    <div className="font-bold text-slate-700">No uploaded files for Case {activeCaseId} yet</div>
                    <p className="text-[11px]">When a Police Officer or Forensic Officer uploads a file for this case, it will appear here for court review.</p>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Right Column: Court Vault Information */}
          <div className="lg:col-span-4 space-y-4">
            <div className="white-panel rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
                <FolderLock className="w-4 h-4 text-purple-600" /> Court Disclosure Controls
              </h2>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-purple-600 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-slate-900">On-Screen Court Viewer</div>
                    <div className="text-[11px] text-slate-500">Electronic Evidence Legal Inspection</div>
                  </div>
                </div>

                <div className="text-xs text-slate-600 space-y-1 pt-2 border-t border-slate-200 font-mono">
                  <div className="flex justify-between"><span>Case ID:</span> <strong className="text-blue-900">{activeCaseId}</strong></div>
                  <div className="flex justify-between"><span>Prosecutor ID:</span> <strong className="text-purple-800">{user?.id}</strong></div>
                  <div className="flex justify-between"><span>Integrity Seal:</span> <strong className="text-emerald-700">VERIFIED IMMUTABLE</strong></div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 text-[11px] text-purple-900 leading-relaxed flex items-start gap-2">
                <Lock className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                <span>As a Lawyer/Prosecutor, your access to Case {activeCaseId} is strictly read-only on screen. File downloads and edits are restricted by security policy.</span>
              </div>
            </div>
          </div>

        </div>
      ) : (
        <div className="white-panel rounded-2xl p-12 text-center space-y-4 border border-slate-200">
          <AlertCircle className="w-12 h-12 text-purple-600 mx-auto opacity-70" />
          <h2 className="text-lg font-bold text-slate-900">No Case Record Found for "{activeCaseId}"</h2>
        </div>
      )}

    </div>
  );
};
