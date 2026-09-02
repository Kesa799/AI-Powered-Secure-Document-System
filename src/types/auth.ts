export type OfficerRole = 'POLICE_OFFICER' | 'INVESTIGATOR' | 'FORENSIC_OFFICER' | 'LAWYER';

export type RolePrefix = 'PO' | 'IN' | 'FO' | 'LW';

export interface RoleConfig {
  role: OfficerRole;
  title: string;
  prefix: RolePrefix;
  clearanceLevel: string;
  badgeColor: string;
  accentBorder: string;
  iconName: string;
  description: string;
  allowedWorkspaces: WorkspaceTab[];
  primaryActions: string[];
}

export type WorkspaceTab = 
  | 'police_case_upload'
  | 'police_checkout'
  | 'investigator_case_search'
  | 'investigator_graph'
  | 'forensic_lab_upload'
  | 'lawyer_read_vault'
  | 'lawyer_audit_trail';

export interface UserProfile {
  id: string; // e.g. PO-1042
  password: string;
  name: string;
  rankTitle: string;
  role: OfficerRole;
  prefix: RolePrefix;
  department: string;
  station: string;
  badgeNumber: string;
  clearance: string;
  assignedCaseIds: string[]; // List of authorized Case Numbers, e.g. ['CASE-102', 'CASE-104']
}

export interface UploadedCaseFile {
  fileId: string;
  fileName: string;
  fileSize?: string;
  fileType?: string; // e.g. 'application/pdf', 'image/png', 'text/plain'
  fileDataUrl?: string; // Base64 Data URL for real PDF / Image rendering
  uploadedByOfficerId: string;
  uploadedByOfficerName: string;
  uploadedByRole: OfficerRole;
  uploadTime: string;
  category: 'POLICE_INCIDENT' | 'FORENSIC_LAB' | 'SEIZURE_MEMO';
  sha256Hash: string;
  description: string;
}

export interface CaseRecord {
  caseId: string; // e.g. CASE-102
  title: string;
  incidentLocation: string;
  status: 'OPEN_INVESTIGATION' | 'FORENSIC_REVIEW' | 'COURT_READY';
  assignedOfficerIds: string[]; // List of authorized officer IDs
  uploadedFiles: UploadedCaseFile[];
}

export interface SecurityLog {
  id: string;
  timestamp: string;
  officerId: string;
  caseId: string;
  action: string;
  status: 'SUCCESS' | 'RESTRICTED' | 'WARNING';
  details: string;
}
