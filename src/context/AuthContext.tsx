import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserProfile, WorkspaceTab, CaseRecord, UploadedCaseFile, RolePrefix, OfficerRole } from '../types/auth';
import { INITIAL_USERS, INITIAL_CASES, ROLE_CONFIGS } from '../data/mockUsers';

export type LoginResultStatus = 
  | 'SUCCESS' 
  | 'NEW_OFFICER_REGISTRATION_REQUIRED' 
  | 'INVALID_PASSWORD';

interface AuthContextType {
  user: UserProfile | null;
  activeCaseId: string | null;
  setActiveCaseId: (caseId: string) => void;
  activeTab: WorkspaceTab;
  setActiveTab: (tab: WorkspaceTab) => void;
  
  login: (officerId: string, pass: string) => { status: LoginResultStatus; message?: string };
  openAssignedCase: (caseNumber: string) => { success: boolean; message?: string };
  registerOfficer: (newOfficer: Omit<UserProfile, 'prefix' | 'badgeNumber' | 'clearance' | 'assignedCaseIds'>) => void;
  addCaseToPortal: (caseNumber: string) => { success: boolean; message?: string };
  logout: () => void;
  canAccess: (tab: WorkspaceTab) => boolean;

  // Case Repository API
  cases: Record<string, CaseRecord>;
  activeCase: CaseRecord | null;
  uploadFileToActiveCase: (file: File | null, fallbackFileName: string, category: 'POLICE_INCIDENT' | 'FORENSIC_LAB' | 'SEIZURE_MEMO', description: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Users Store
  const [users, setUsers] = useState<Record<string, UserProfile>>(() => {
    const savedUsers = localStorage.getItem('sipalms_users_v3');
    return savedUsers ? JSON.parse(savedUsers) : INITIAL_USERS;
  });

  // Cases Store
  const [cases, setCases] = useState<Record<string, CaseRecord>>(() => {
    const savedCases = localStorage.getItem('sipalms_cases_v3');
    return savedCases ? JSON.parse(savedCases) : INITIAL_CASES;
  });

  // Active Session State
  const [user, setUser] = useState<UserProfile | null>(() => {
    const savedSession = localStorage.getItem('sipalms_user_v3');
    return savedSession ? JSON.parse(savedSession) : null;
  });

  const [activeCaseId, setActiveCaseId] = useState<string | null>(() => {
    const savedCaseId = localStorage.getItem('sipalms_case_id_v3');
    return savedCaseId || null;
  });

  const [activeTab, setActiveTab] = useState<WorkspaceTab>('police_case_upload');

  // Persistence Sync
  useEffect(() => {
    localStorage.setItem('sipalms_users_v3', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('sipalms_cases_v3', JSON.stringify(cases));
  }, [cases]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('sipalms_user_v3', JSON.stringify(user));
    } else {
      localStorage.removeItem('sipalms_user_v3');
    }
  }, [user]);

  useEffect(() => {
    if (activeCaseId) {
      localStorage.setItem('sipalms_case_id_v3', activeCaseId);
    } else {
      localStorage.removeItem('sipalms_case_id_v3');
    }
  }, [activeCaseId]);

  // LOGIN ENGINE: Officer ID + Password
  const login = (officerId: string, pass: string) => {
    const cleanId = officerId.trim().toUpperCase();
    const cleanPass = pass.trim();

    const existingOfficer = users[cleanId];

    // 1. If Officer ID does NOT exist in system, require registration
    if (!existingOfficer) {
      return {
        status: 'NEW_OFFICER_REGISTRATION_REQUIRED' as LoginResultStatus,
        message: `Officer ID "${cleanId}" is not registered in SI-PALMS. Please create an officer account below.`
      };
    }

    // 2. Password Check
    if (existingOfficer.password !== cleanPass) {
      return {
        status: 'INVALID_PASSWORD' as LoginResultStatus,
        message: `Incorrect password for Officer ID "${cleanId}".`
      };
    }

    // SUCCESS LOGIN
    setUser(existingOfficer);
    setActiveCaseId(null);
    setActiveTab(ROLE_CONFIGS[existingOfficer.prefix].allowedWorkspaces[0]);
    return { status: 'SUCCESS' as LoginResultStatus };
  };

  const openAssignedCase = (caseNumber: string) => {
    if (!user) return { success: false, message: 'Please sign in first.' };
    const cleanCaseId = caseNumber.trim().toUpperCase();
    const targetCase = cases[cleanCaseId];

    if (!targetCase) {
      return { success: false, message: `Case Number "${cleanCaseId}" was not found.` };
    }

    const isOfficerAssignedToCase =
      user.assignedCaseIds.includes(cleanCaseId) || targetCase.assignedOfficerIds.includes(user.id);
    if (!isOfficerAssignedToCase) {
      return { success: false, message: `You are not authorized to access Case ${cleanCaseId}.` };
    }

    setActiveCaseId(cleanCaseId);
    return { success: true };
  };

  // NEW OFFICER ACCOUNT CREATION REGISTRATION
  const registerOfficer = (
    newOfficerData: Omit<UserProfile, 'prefix' | 'badgeNumber' | 'clearance' | 'assignedCaseIds'>
  ) => {
    const cleanId = newOfficerData.id.trim().toUpperCase();

    // Determine prefix based on role
    const rolePrefixMap: Record<OfficerRole, RolePrefix> = {
      POLICE_OFFICER: 'PO',
      INVESTIGATOR: 'IN',
      FORENSIC_OFFICER: 'FO',
      LAWYER: 'LW'
    };

    const prefix = rolePrefixMap[newOfficerData.role];
    const existingOfficer = users[cleanId];
    const fullOfficerProfile: UserProfile = existingOfficer
      ? {
          ...existingOfficer
        }
      : {
          ...newOfficerData,
          id: cleanId,
          prefix,
          badgeNumber: `${prefix}-REG-${Math.floor(1000 + Math.random() * 9000)}`,
          clearance: ROLE_CONFIGS[prefix].clearanceLevel,
          assignedCaseIds: []
        };

    // Register a new officer or add this case to an existing officer's assignments.
    setUsers(prev => ({ ...prev, [cleanId]: fullOfficerProfile }));

    // Auto Login
    setUser(fullOfficerProfile);
    setActiveCaseId(null);
    setActiveTab(ROLE_CONFIGS[prefix].allowedWorkspaces[0]);
  };

  const addCaseToPortal = (caseNumber: string) => {
    if (!user) return { success: false, message: 'Please sign in first.' };
    const cleanCaseId = caseNumber.trim().toUpperCase();
    if (!cleanCaseId) return { success: false, message: 'Enter a case number.' };

    const existingCase = cases[cleanCaseId];
    if (!existingCase && user.prefix !== 'PO') {
      return { success: false, message: `Case ${cleanCaseId} has not been created by a Police Officer yet.` };
    }

    const caseRecord: CaseRecord = existingCase || {
      caseId: cleanCaseId,
      title: `Case Investigation File ${cleanCaseId}`,
      incidentLocation: 'Metro Division Precinct',
      status: 'OPEN_INVESTIGATION',
      assignedOfficerIds: [],
      uploadedFiles: []
    };

    setCases(prev => ({
      ...prev,
      [cleanCaseId]: {
        ...caseRecord,
        assignedOfficerIds: Array.from(new Set([...caseRecord.assignedOfficerIds, user.id]))
      }
    }));

    const updatedUser = {
      ...user,
      assignedCaseIds: Array.from(new Set([...user.assignedCaseIds, cleanCaseId]))
    };
    setUsers(prev => ({ ...prev, [user.id]: updatedUser }));
    setUser(updatedUser);
    setActiveCaseId(cleanCaseId);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setActiveCaseId(null);
  };

  const canAccess = (tab: WorkspaceTab): boolean => {
    if (!user) return false;
    const allowed = ROLE_CONFIGS[user.prefix].allowedWorkspaces;
    return allowed.includes(tab);
  };

  const activeCase = activeCaseId && cases[activeCaseId] ? cases[activeCaseId] : null;

  // UPLOAD FILE TO ACTIVE CASE
  const uploadFileToActiveCase = async (
    file: File | null,
    fallbackFileName: string,
    category: 'POLICE_INCIDENT' | 'FORENSIC_LAB' | 'SEIZURE_MEMO',
    description: string
  ): Promise<boolean> => {
    if (!user || !activeCaseId || !cases[activeCaseId]) return false;

    // Only police officers can add case records and forensic officers can add lab reports.
    if (user.prefix === 'LW' || user.prefix === 'IN') return false;
    if (user.prefix === 'FO' && category !== 'FORENSIC_LAB') return false;
    if (user.prefix === 'PO' && category === 'FORENSIC_LAB') return false;

    const fileDataUrl = file ? await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Unable to read the selected file.'));
      reader.readAsDataURL(file);
    }) : undefined;

    const fileName = file?.name || fallbackFileName;

    const newFile: UploadedCaseFile = {
      fileId: `FILE-${user.prefix}-${Math.floor(1000 + Math.random() * 9000)}`,
      fileName,
      fileSize: file ? `${(file.size / 1024).toFixed(1)} KB` : undefined,
      fileType: file?.type,
      fileDataUrl,
      uploadedByOfficerId: user.id,
      uploadedByOfficerName: user.name,
      uploadedByRole: user.role,
      uploadTime: new Date().toLocaleString() + ' IST',
      category,
      sha256Hash: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      description
    };

    setCases(prev => ({
      ...prev,
      [activeCaseId]: {
        ...prev[activeCaseId],
        uploadedFiles: [newFile, ...prev[activeCaseId].uploadedFiles]
      }
    }));

    return true;
  };

  return (
    <AuthContext.Provider value={{
      user,
      activeCaseId,
      setActiveCaseId,
      activeTab,
      setActiveTab,
      login,
      openAssignedCase,
      registerOfficer,
      addCaseToPortal,
      logout,
      canAccess,
      cases,
      activeCase,
      uploadFileToActiveCase
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
