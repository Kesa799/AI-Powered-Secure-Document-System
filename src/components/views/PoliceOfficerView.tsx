import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import type { UploadedCaseFile } from '../../types/auth';
import { DocumentViewerModal } from './DocumentViewerModal';
import { PlusCircle, ShieldCheck, FileText, Folder, Upload, CheckCircle2, Eye } from 'lucide-react';

export const PoliceOfficerView: React.FC = () => {
  const { user, activeCaseId, activeCase, uploadFileToActiveCase } = useAuth();
  
  // File Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileCategory, setFileCategory] = useState<'POLICE_INCIDENT' | 'SEIZURE_MEMO'>('POLICE_INCIDENT');
  const [fileDescription, setFileDescription] = useState('First responder report: Suspect intercepted at scene. Attached physical seizure memo and bodycam log.');
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [viewingFile, setViewingFile] = useState<UploadedCaseFile | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fileName = selectedFile ? selectedFile.name : 'Police_Seizure_Incident_Report.pdf';
    
    const success = await uploadFileToActiveCase(selectedFile, fileName, fileCategory, fileDescription);

    if (success) {
      setUploadSuccess(`File "${fileName}" successfully uploaded to Case ${activeCaseId}! SHA-256 fingerprint generated and saved.`);
      setSelectedFile(null);
      setFileDescription('');
      setTimeout(() => setUploadSuccess(null), 6000);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Modal Document Reader */}
      <DocumentViewerModal
        file={viewingFile}
        caseId={activeCaseId || 'CASE-102'}
        onClose={() => setViewingFile(null)}
      />

      {/* Banner */}
      <div className="white-panel rounded-2xl p-6 border border-slate-200 bg-gradient-to-r from-blue-900 to-slate-900 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-800 text-blue-200 border border-blue-700">
              PO PORTAL • ID: {user?.id}
            </span>
            <span className="text-xs font-mono text-cyan-300 font-bold">CASE NO: {activeCaseId}</span>
          </div>
          <h1 className="text-2xl font-black tracking-wide">{activeCase?.title || `Case ${activeCaseId}`}</h1>
          <p className="text-sm text-slate-300">Upload case file details, seizure reports, and incident logs anytime for {activeCaseId}.</p>
        </div>

        <div className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-right font-mono">
          <div className="text-[10px] text-slate-400 uppercase">Clearance</div>
          <div className="text-xs font-bold text-cyan-300">PO UPLOAD AUTHORIZED</div>
        </div>
      </div>

      {uploadSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center gap-3 shadow-sm">
          <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
          <span className="text-sm font-medium">{uploadSuccess}</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Upload Case Details & Evidence Form (Working Real Upload) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="white-panel rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-blue-600" /> Upload Case File Details ({activeCaseId})
                </h2>
                <p className="text-xs text-slate-500">Police Officers can upload new case files & evidence documents anytime</p>
              </div>
              <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200">
                UPLOAD ACTIVE
              </span>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Target Case Number
                  </label>
                  <input
                    type="text"
                    value={activeCaseId || ''}
                    disabled
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-200 text-blue-900 font-mono text-xs font-bold opacity-90"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Document Category
                  </label>
                  <select
                    value={fileCategory}
                    onChange={(e) => setFileCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs"
                  >
                    <option value="POLICE_INCIDENT">Police Incident & First Responder Report</option>
                    <option value="SEIZURE_MEMO">Seizure Memo & Physical Gear Record</option>
                  </select>
                </div>
              </div>

              {/* REAL FILE CHOOSER INPUT */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Select Evidence / Case File
                </label>
                <div className="p-4 rounded-xl bg-slate-50 border border-dashed border-blue-400 text-center space-y-2 hover:bg-blue-50/50 transition-colors">
                  <Upload className="w-6 h-6 text-blue-600 mx-auto" />
                  <div className="text-xs text-slate-700">
                    {selectedFile ? (
                      <span className="font-bold text-blue-900 flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                      </span>
                    ) : (
                      <span>Choose PDF, Image, or Document file to upload</span>
                    )}
                  </div>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Incident Summary & Findings Description
                </label>
                <textarea
                  rows={3}
                  value={fileDescription}
                  onChange={(e) => setFileDescription(e.target.value)}
                  placeholder="Enter details of evidence seized, incident location, and officer observations..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-blue-600"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" /> Upload & Publish Case Details to {activeCaseId}
              </button>
            </form>

          </div>
        </div>

        {/* Right Column: Uploaded Files for Active Case (With Open Document Action) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="white-panel rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Folder className="w-4 h-4 text-blue-600" /> Uploaded Files ({activeCaseId})
              </h2>
              <span className="text-xs font-mono text-blue-700 font-bold">{activeCase?.uploadedFiles.length || 0} Files</span>
            </div>

            <div className="space-y-3">
              {activeCase && activeCase.uploadedFiles.length > 0 ? (
                activeCase.uploadedFiles.map((f) => (
                  <div key={f.fileId} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-blue-600" /> {f.fileName}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-300">
                          {f.category}
                        </span>
                        <button
                          onClick={() => setViewingFile(f)}
                          className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[11px] flex items-center gap-1 cursor-pointer transition-all shadow-xs"
                        >
                          <Eye className="w-3.5 h-3.5" /> Open / View
                        </button>
                      </div>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed bg-white p-2.5 rounded border border-slate-200 font-mono">
                      {f.description}
                    </p>
                    <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-200">
                      <span>By: <strong className="text-blue-900">{f.uploadedByOfficerName} ({f.uploadedByOfficerId})</strong></span>
                      <span className="font-mono">{f.uploadTime}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 text-center space-y-1">
                  <Folder className="w-8 h-8 text-slate-400 mx-auto opacity-60" />
                  <div className="font-bold text-slate-700">No documents uploaded yet for Case {activeCaseId}</div>
                  <p className="text-[11px]">Use the form on the left to upload your initial case file details.</p>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
