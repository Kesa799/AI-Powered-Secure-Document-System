import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import type { OfficerRole } from '../../types/auth';
import { ROLE_CONFIGS } from '../../data/mockUsers';
import { Shield, ArrowRight, AlertCircle, Eye, EyeOff, UserPlus } from 'lucide-react';

export const LoginForm: React.FC = () => {
  const { login, registerOfficer } = useAuth();
  
  // Active Form Mode: 'LOGIN' or 'REGISTER'
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');

  // Login Form States
  const [officerId, setOfficerId] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  // Register Form States
  const [regName, setRegName] = useState('');
  const [regId, setRegId] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regRole, setRegRole] = useState<OfficerRole>('POLICE_OFFICER');
  const regDept = 'Crime Operations';
  const regStation = 'Central Precinct No. 4';

  // Auto-detect prefix
  const prefixMatch = officerId.trim().match(/^(PO|IN|FO|LW)/i);
  const detectedPrefix = prefixMatch ? (prefixMatch[0].toUpperCase() as keyof typeof ROLE_CONFIGS) : null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!officerId.trim() || !password.trim()) {
      setError('Please enter your Officer ID and password.');
      return;
    }

    const res = login(officerId, password);
    if (res.status === 'NEW_OFFICER_REGISTRATION_REQUIRED') {
      setRegId(officerId.toUpperCase());
      setRegPass(password);
      setMode('REGISTER');
      setNotice(res.message || 'Officer ID not registered. Create your officer account below.');
      setError('');
    } else if (res.status !== 'SUCCESS') {
      setError(res.message || 'Login failed. Please verify credentials.');
    } else {
      setError('');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regId.trim() || !regPass.trim()) {
      setError('Please complete all required fields for officer registration.');
      return;
    }

    registerOfficer(
      {
        id: regId.toUpperCase(),
        password: regPass,
        name: regName,
        rankTitle: ROLE_CONFIGS[regRole === 'POLICE_OFFICER' ? 'PO' : regRole === 'INVESTIGATOR' ? 'IN' : regRole === 'FORENSIC_OFFICER' ? 'FO' : 'LW'].title,
        role: regRole,
        department: regDept,
        station: regStation
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      
      {/* Centered Professional White Login Card */}
      <div className="w-full max-w-lg white-panel rounded-2xl p-8 border border-slate-200 shadow-xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center mx-auto text-white shadow-md">
            <Shield className="w-8 h-8 text-cyan-400" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-wider">SI-PALMS PORTAL</h1>
          <p className="text-xs text-slate-500 font-medium">Police Asset & Evidence Lifecycle Management System</p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200">
          <button
            type="button"
            onClick={() => { setMode('LOGIN'); setError(''); setNotice(''); }}
            className={`flex-1 text-xs font-bold py-2 rounded-lg transition-all cursor-pointer ${
              mode === 'LOGIN'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Officer Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('REGISTER'); setError(''); setNotice(''); }}
            className={`flex-1 text-xs font-bold py-2 rounded-lg transition-all cursor-pointer ${
              mode === 'REGISTER'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Create Account
          </button>
        </div>

        {notice && (
          <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 flex items-center gap-2 text-xs text-blue-900">
            <UserPlus className="w-4 h-4 shrink-0 text-blue-600" />
            <span>{notice}</span>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-xs text-red-900">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {/* LOGIN FORM */}
        {mode === 'LOGIN' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Officer ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={officerId}
                  onChange={(e) => setOfficerId(e.target.value)}
                  placeholder="e.g. PO-1042, FO-4091, IN-8805, LW-9120"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono text-xs focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  required
                />
                {detectedPrefix && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${ROLE_CONFIGS[detectedPrefix].badgeColor}`}>
                      {detectedPrefix}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter officer password..."
                  className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* REGISTER FORM */}
        {mode === 'REGISTER' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Officer Full Name</label>
              <input
                type="text"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="e.g. Inspector Ramesh Shah"
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Officer ID (PO-, IN-, FO-, LW-)</label>
              <input
                type="text"
                value={regId}
                onChange={(e) => setRegId(e.target.value)}
                placeholder="e.g. PO-9901, IN-4020, FO-5011, LW-2010"
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono text-xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
              <input
                type="password"
                value={regPass}
                onChange={(e) => setRegPass(e.target.value)}
                placeholder="Set officer password..."
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Officer Role</label>
              <select
                value={regRole}
                onChange={(e) => setRegRole(e.target.value as OfficerRole)}
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs"
              >
                <option value="POLICE_OFFICER">Police Officer (PO) - Case Details Upload</option>
                <option value="FORENSIC_OFFICER">Forensic Officer (FO) - Lab Report Upload</option>
                <option value="INVESTIGATOR">Investigator (IN) - Open & View Evidence</option>
                <option value="LAWYER">Lawyer / Prosecutor (LW) - Read-Only Court Vault</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" /> Create Portal Account & Log In
            </button>
          </form>
        )}

      </div>

    </div>
  );
};
