import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import type { UploadedCaseFile } from '../../types/auth';
import { DocumentViewerModal } from './DocumentViewerModal';
import { Network, AlertCircle, FileText, Folder, Eye } from 'lucide-react';

export const InvestigatorView: React.FC = () => {
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
      <div className="white-panel rounded-2xl p-6 border border-slate-200 bg-gradient-to-r from-amber-900 to-slate-900 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-800 text-amber-200 border border-amber-700">
              IN PORTAL • ID: {user?.id}
            </span>
            <span className="text-xs font-mono text-amber-300 font-bold">CASE NO: {activeCaseId}</span>
          </div>
          <h1 className="text-2xl font-black tracking-wide">{activeCase?.title || `Case ${activeCaseId}`}</h1>
          <p className="text-sm text-slate-300">Open & inspect uploaded evidence files and custody graphs for assigned case {activeCaseId}.</p>
        </div>

        <div className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-right font-mono">
          <div className="text-[10px] text-slate-400 uppercase">Clearance</div>
          <div className="text-xs font-bold text-amber-400">IN CASE INTELLIGENCE</div>
        </div>
      </div>

      {/* Main Grid */}
      {activeCase ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: All Uploaded Files for Active Case with Open Document Action */}
          <div className="lg:col-span-7 space-y-4">
            <div className="white-panel rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <span className="text-xs font-mono text-amber-700 font-bold">{activeCase.caseId}</span>
                  <h2 className="text-lg font-bold text-slate-900">{activeCase.title}</h2>
                </div>
                <span className="text-[10px] font-mono px-2 py-1 rounded bg-amber-50 text-amber-800 border border-amber-200">
                  {activeCase.status.replace('_', ' ')}
                </span>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <Folder className="w-4 h-4 text-amber-600" /> Case Files ({activeCase.uploadedFiles.length})
                </h3>

                {activeCase.uploadedFiles.length > 0 ? (
                  activeCase.uploadedFiles.map((file) => (
                    <div key={file.fileId} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 flex items-center gap-1.5">
                          <FileText className="w-4 h-4 text-amber-600" /> {file.fileName}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-300">
                            {file.category}
                          </span>
                          <button
                            onClick={() => setViewingFile(file)}
                            className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-[11px] flex items-center gap-1 cursor-pointer transition-all shadow-xs"
                          >
                            <Eye className="w-3.5 h-3.5" /> Open File
                          </button>
                        </div>
                      </div>
                      <p className="text-slate-600 text-[11px] leading-relaxed bg-white p-2.5 rounded border border-slate-200 font-mono">
                        {file.description}
                      </p>
                      <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-200">
                        <span>Uploaded by: <strong className="text-slate-900">{file.uploadedByOfficerName} ({file.uploadedByOfficerId})</strong></span>
                        <span className="font-mono">{file.uploadTime}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 text-center space-y-1">
                    <Folder className="w-8 h-8 text-slate-400 mx-auto opacity-60" />
                    <div className="font-bold text-slate-700">No documents uploaded yet for Case {activeCaseId}</div>
                    <p className="text-[11px]">When a Police Officer or Forensic Officer uploads a case document, it will appear here for inspection.</p>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Right Column: Case Timeline & Link Tree */}
          <div className="lg:col-span-5 space-y-4">
            <div className="white-panel rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
                <Network className="w-4 h-4 text-amber-600" /> Evidence Link Graph ({activeCaseId})
              </h2>

              <div className="p-4 rounded-xl bg-slate-900 text-white text-xs space-y-3 font-mono">
                <div className="text-amber-400 font-bold">CASE FILE: {activeCaseId}</div>
                
                {activeCase.uploadedFiles.length > 0 ? (
                  activeCase.uploadedFiles.map((f, i) => (
                    <div key={i} className="pl-3 border-l-2 border-amber-500/40 space-y-1">
                      <div className="text-cyan-300 text-[11px]">├─ {f.fileName}</div>
                      <div className="text-slate-400 text-[10px]">│  By: {f.uploadedByOfficerName} ({f.uploadedByOfficerId})</div>
                    </div>
                  ))
                ) : (
                  <div className="text-slate-400 text-[11px] italic">No active evidence links yet.</div>
                )}
              </div>
            </div>
          </div>

        </div>
      ) : (
        <div className="white-panel rounded-2xl p-12 text-center space-y-4 border border-slate-200">
          <AlertCircle className="w-12 h-12 text-amber-600 mx-auto opacity-70" />
          <h2 className="text-lg font-bold text-slate-900">No Case Record Found for "{activeCaseId}"</h2>
        </div>
      )}

    </div>
  );
};
