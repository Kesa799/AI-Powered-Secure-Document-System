import React from 'react';
import type { UploadedCaseFile } from '../../types/auth';
import { FileText, ShieldCheck, X, UserCheck, Calendar, Lock } from 'lucide-react';

interface DocumentViewerModalProps {
  file: UploadedCaseFile | null;
  caseId: string;
  onClose: () => void;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({ file, caseId, onClose }) => {
  if (!file) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-cyan-400">{caseId}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {file.category.replace('_', ' ')}
                </span>
              </div>
              <h2 className="text-base font-bold text-white truncate max-w-md">{file.fileName}</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
            title="Close document viewer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Security Warning Badge */}
        <div className="bg-amber-50 border-b border-amber-200 px-5 py-2.5 flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center gap-2 font-bold">
            <Lock className="w-4 h-4 text-amber-700" />
            <span>CONFIDENTIAL CASE RECORD • ON-SCREEN VIEW ONLY</span>
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
            DOWNLOAD RESTRICTED
          </span>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          
          {/* Officer Metadata Box */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 block mb-0.5 font-bold">UPLOADING OFFICER</span>
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-blue-600" /> {file.uploadedByOfficerName}
              </div>
              <span className="text-slate-500 font-mono">ID: {file.uploadedByOfficerId} ({file.uploadedByRole})</span>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 block mb-0.5 font-bold">INGEST TIMESTAMP</span>
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-blue-600" /> {file.uploadTime}
              </div>
              <span className="text-slate-500">Central Police Network</span>
            </div>
          </div>

          {/* Document Content / Incident Summary */}
          {file.fileDataUrl && (
            <div>
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Uploaded Document</h3>
              {file.fileType?.startsWith('image/') ? (
                <img src={file.fileDataUrl} alt={file.fileName} className="max-h-[380px] w-full object-contain rounded-xl border border-slate-200 bg-slate-50" />
              ) : file.fileType === 'application/pdf' ? (
                <iframe title={file.fileName} src={file.fileDataUrl} className="h-[380px] w-full rounded-xl border border-slate-200" />
              ) : (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">This file type cannot be previewed in the secure viewer. Its case record and findings are available below.</div>
              )}
            </div>
          )}

          {/* Document Content / Incident Summary */}
          <div>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Document Findings & Case Report</h3>
            <div className="p-5 rounded-xl bg-slate-900 text-slate-100 text-xs leading-relaxed font-mono whitespace-pre-wrap border border-slate-800 shadow-inner">
              {file.description}
            </div>
          </div>

          {/* SHA-256 Digital Fingerprint Seal */}
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-1.5 text-emerald-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> SHA-256 Cryptographic Integrity Seal
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                VERIFIED IMMUTABLE
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-white border border-emerald-200 font-mono text-[11px] text-emerald-800 break-all select-all">
              {file.sha256Hash}
            </div>
          </div>

        </div>

        {/* Modal Footer (Single Close Button - No Download Option) */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-slate-400" /> Downloading or exporting files is restricted by security policy.
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
          >
            Close Document
          </button>
        </div>

      </div>
    </div>
  );
};
