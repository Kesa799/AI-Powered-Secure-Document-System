# AI-Powered Secure Intelligent Police System - Functional Specifications

## 1. System Overview
The **AI-Powered Secure Intelligent Police System & Evidence Management Portal** is a cryptographic, role-based law enforcement platform engineered for legal compliance, tamper-evident case document handling, and chain-of-custody tracking.

---

## 2. User Roles & Access Control Matrix

| Role | Symbol | View Access | Upload Capabilities | Audit & Verification |
| :--- | :---: | :--- | :--- | :--- |
| **Police Officer** | 👮 | Case details, Category View, Incident Reports | Incident Reports, First-Responder Evidence | Views own upload audit log |
| **Investigator** | 🕵️ | Full Case File, Witness Statements, Interrogations | Witness Logs, Suspect Profiles, Field Notes | Full case audit trail access |
| **Forensic Specialist** | 🔬 | Technical Evidence, Ballistics, DNA, Digital Media | Forensic Lab Reports, Chain-of-Custody Proof | Submits cryptographic proofs |
| **Lawyer / Prosecutor** | ⚖️ | Verified Evidence Court Package | Read-only court package | Verifies SHA-256 / Blockchain proof |

---

## 3. Key Functional Modules

### 3.1 Role-Based Authentication (`AuthContext`)
- User session state managed with persistent JWT authentication.
- Access checks (`canAccess(tab)`) dynamically render permissions per view tab.

### 3.2 Case Management & Selection (`CaseSelection`)
- Case selection dropdown allowing officers to switch between active criminal investigations.
- Filter evidence, audit logs, and category uploads per active case ID.

### 3.3 Evidence Category Uploads (`PoliceCategoryUploadView`, `InvestigatorCategoryUploadView`)
- Multi-category uploading supporting PDFs, DOCX, JPEGs, and media files.
- Automated SHA-256 hashing generated on file select prior to submission (`pki.ts`).

### 3.4 Cryptographic Blockchain Verification (`BlockchainProofModal`)
- Modal window rendering complete block details:
  - Block Index, Block Hash, Previous Block Hash
  - Timestamp, Merkle Root, and Verification Signature.

### 3.5 Tamper-Proof Audit Trail (`AuditTrailView`)
- Immutable log table tracking every file access, upload, modification, and verification attempt.
- Includes timestamp, user ID, user role, action, and verified cryptographic hash.

### 3.6 Forensic & Legal Court Views (`ForensicView`, `LawyerView`)
- Forensic portal for uploading lab certificates and evidence hashes.
- Prosecutor view formatted for court admissibility and legal disclosure.
