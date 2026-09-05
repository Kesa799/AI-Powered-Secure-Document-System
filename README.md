# 🛡️ AI-Powered Secure Intelligent Police System & Digital Evidence Management

[![CI Build Pipeline](https://github.com/Kesa799/AI-Powered-Secure-Document-System/actions/workflows/ci.yml/badge.svg)](https://github.com/Kesa799/AI-Powered-Secure-Document-System/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/Frontend-React%2019%20%7C%20Vite%206-61dafb?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%2020%20%7C%20Express-339933?logo=nodedotjs)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/Docker-Supported-2496ed?logo=docker)](https://www.docker.com/)
[![Security: CJIS Compliant](https://img.shields.io/badge/Security-CJIS%20%26%20SHA--256%20Merkle-red?logo=shield)](docs/CHAIN_OF_CUSTODY.md)

An enterprise-grade, cryptographic law enforcement platform engineered for **tamper-evident evidence collection**, **blockchain-backed chain-of-custody verification**, **role-based access control (RBAC)**, and **court-admissible legal audit trails**.

---

## 📋 Table of Contents
- [Executive Overview](#-executive-overview)
- [Key Platform Features](#-key-platform-features)
- [System Architecture](#-system-architecture)
- [Cryptographic Chain of Custody](#-cryptographic-chain-of-custody)
- [Role-Based Access Matrix](#-role-based-access-matrix)
- [Repository Structure](#-repository-structure)
- [Quick Start & Installation](#-quick-start--installation)
  - [Prerequisites](#prerequisites)
  - [Option A: Local Development (npm)](#option-a-local-development-npm)
  - [Option B: Containerized Deployment (Docker Compose)](#option-b-containerized-deployment-docker-compose)
- [REST API Specifications](#-rest-api-specifications)
- [System Documentation](#-system-documentation)
- [Security & Compliance](#-security--compliance)
- [License](#-license)

---

## 📑 Executive Overview

Law enforcement agencies and judicial systems face critical challenges regarding digital evidence integrity, chain-of-custody logging, and unauthorized evidence tampering.

The **AI-Powered Secure Intelligent Police System** provides a tamper-evident digital vault where every uploaded evidence asset—incident photos, witness voice recordings, forensic reports, ballistics metrics, and legal filings—is processed via **SHA-256 pre-transmission digest computation** and indexed into an **immutable cryptographic blockchain ledger**.

```
  [ Evidence Upload ] ➔ [ SHA-256 Hashing Engine ] ➔ [ Immutable Blockchain Block ] ➔ [ Court Verification ]
```

---

## ⭐ Key Platform Features

* 🔒 **Pre-Transmission Cryptographic Hashing**: Hashes files on the client side using SHA-256 (`frontend/src/services/pki.ts`) before network transfer.
* ⛓️ **Immutable Blockchain Ledger**: Implements SHA-256 block hash chaining and Merkle tree root verification (`backend/src/blockchain.ts`).
* 👥 **Role-Based Access Control (RBAC)**: Fine-grained permissions tailored for Police Officers, Investigators, Forensic Analysts, and Prosecutors.
* 🔍 **Interactive Verification Modal**: Enables defense attorneys and judges to inspect cryptographic block proofs, timestamps, and previous block hashes in real-time.
* 📊 **Real-Time Audit Trail**: Complete activity logging tracking uploads, file accesses, role actions, and hash validation attempts.
* 📁 **Categorized Evidence Uploads**: Structured folders for Incident Reports, Field Evidence, Witness Statements, Interrogations, Forensic Reports, and Court Packages.
* 🐳 **Production-Ready Docker Orchestration**: Seamless containerization for frontend and backend services using Docker Compose.

---

## 🏗️ System Architecture

```
+-----------------------------------------------------------------------------------+
|                            FRONTEND LAYER (React 19 + Vite)                       |
|  - Role Views: PoliceOfficerView, InvestigatorView, ForensicView, LawyerView       |
|  - Audit & Verification Modals: BlockchainProofModal, DocumentViewerModal         |
|  - Cryptographic Client Hashing: SHA-256 Web Crypto API                           |
+------------------------------------------+----------------------------------------+
                                           | HTTP / REST (JSON + Multipart)
                                           v
+-----------------------------------------------------------------------------------+
|                            BACKEND LAYER (Node.js + Express)                      |
|  - Middleware: JWT Authentication & Access Control Scoping                        |
|  - Services: File Upload Service (Multer) & Blockchain Engine                     |
|  - Controllers: Auth, Case Management, File Handling, Audit Logs                 |
+------------------------------------------+----------------------------------------+
                                           | Hashing & Persistence
                                           v
+-----------------------------------------------------------------------------------+
|                            STORAGE & LEDGER LAYER                                 |
|  - SQLite Database: User Credentials, Case Metadata, File Records, Audit Logs    |
|  - Cryptographic Ledger: Linked Hashed Blocks & Merkle Proofs                     |
|  - File System: Encrypted Evidence Media Storage                                 |
+-----------------------------------------------------------------------------------+
```

---

## ⛓️ Cryptographic Chain of Custody

Maintaining an unbreakable Chain of Custody is essential for evidence admissibility in court:

1. **Client SHA-256 Computation**: File bytes are hashed locally in the browser upon file selection (`pki.ts`).
2. **Server Verification Hash**: Backend computes an independent digest upon receipt to prevent man-in-the-middle tampering.
3. **Block Minter**: The digest, file metadata, uploader ID, role, and prior block hash are combined into a new block:
   $$\text{Block Hash} = \text{SHA256}(\text{Index} \parallel \text{PrevHash} \parallel \text{Timestamp} \parallel \text{FileHash} \parallel \text{UploaderID})$$
4. **Court Room Verification**: Legal representatives click **"Verify Blockchain Proof"** to re-compute and check block integrity against stored hashes.

---

## 👥 Role-Based Access Matrix

| Role | Badge / ID | View Scope | Upload Capabilities | Audit & Verification Access |
| :--- | :---: | :--- | :--- | :--- |
| **Police Officer** | `OFF-4092` | Case Summary, Incident Uploads | Incident Reports, First-Responder Photos | Personal Upload History |
| **Investigator** | `DET-8821` | Full Case File, Interrogations | Witness Logs, Suspect Profiles, Field Notes | Case Audit Logs & Timeline |
| **Forensic Specialist** | `FOR-1044` | Lab Metrics, Ballistics, DNA | Forensic Analysis Reports, Lab Proofs | Cryptographic Chain Verification |
| **Prosecutor / Lawyer** | `LAW-9012` | Verified Evidence Court Package | Legal Filings & Court Briefs | Full Legal Verification Modal |

---

## 📂 Repository Structure

```
AI-Powered-Secure-Document-System/
├── .github/
│   └── workflows/
│       ├── ci.yml                     # Continuous Integration workflow
│       └── deploy-pages.yml           # Automated GitHub Pages deployment
├── backend/                           # Node.js + Express Backend API
│   ├── src/
│   │   ├── middleware/
│   │   │   └── auth.ts                # JWT & RBAC Auth middleware
│   │   ├── routes/
│   │   │   ├── auth.ts                # Login & Token routes
│   │   │   ├── blockchain.ts          # Block verification endpoints
│   │   │   ├── cases.ts               # Case selection & management
│   │   │   ├── files.ts               # File upload & retrieval endpoints
│   │   │   └── logs.ts                # Audit trail logging endpoints
│   │   ├── blockchain.ts              # Blockchain engine & SHA-256 ledger
│   │   ├── db.ts                      # SQLite database connection & schema
│   │   └── server.ts                  # Express API server entrypoint
│   ├── Dockerfile                     # Backend containerization file
│   └── package.json                   # Backend dependencies & scripts
├── docs/                              # Technical Platform Documentation
│   ├── API_DOCUMENTATION.md           # Comprehensive API endpoint reference
│   ├── CHAIN_OF_CUSTODY.md            # Cryptographic verification workflow
│   └── USER_GUIDE.md                  # Detailed user guide by role
├── frontend/                          # React + Vite Frontend Application
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/                  # LoginForm component
│   │   │   ├── layout/                # AppHeader, Sidebar components
│   │   │   └── views/                 # Role-based dashboard views
│   │   ├── context/                   # AuthContext state manager
│   │   ├── services/                  # PKI hashing & API service client
│   │   ├── types/                     # TypeScript interfaces & types
│   │   ├── App.tsx                    # Main app container & router
│   │   └── main.tsx                   # React DOM render root
│   ├── Dockerfile                     # Frontend production Docker build
│   ├── index.html                     # Vite HTML entry point
│   ├── vite.config.ts                 # Vite bundler configuration
│   └── package.json                   # Frontend dependencies & scripts
├── .gitignore                         # Git exclusion configuration
├── AI-Powered-Secure-Intelligent-Police-System-Architecture.md
├── AI-Powered-Secure-Intelligent-Police-System-Functional-Specs.md
├── AI-Powered-Secure-Intelligent-Police-System-Project-Overview.md
├── AI-Powered-Secure-Intelligent-Police-System-Requirements.md
├── README.md                          # Main repository documentation
└── docker-compose.yml                 # Multi-container service orchestration
```

---

## ⚡ Quick Start & Installation

### Prerequisites
- **Node.js**: Version `20.x` or higher
- **npm**: Version `9.x` or higher
- **Docker & Docker Compose** *(optional for container deployment)*

---

### Option A: Local Development (npm)

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Kesa799/AI-Powered-Secure-Document-System.git
   cd AI-Powered-Secure-Document-System
   ```

2. **Start the Backend API Server**:
   ```bash
   cd backend
   npm install
   npm run dev
   ```
   *Backend server starts at:* `http://localhost:5000`

3. **Start the Frontend Client** *(in a new terminal)*:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   *Frontend application available at:* `http://localhost:5173`

---

### Option B: Containerized Deployment (Docker Compose)

Launch the entire stack (Frontend + Backend + SQLite Database) in isolated containers:

```bash
docker-compose up --build
```

- **Frontend Application**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`

---

## 🌐 REST API Specifications

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/login` | Authenticate user & return JWT token | ❌ |
| `GET` | `/api/cases` | Retrieve active police case files | 🔐 |
| `POST` | `/api/files/upload` | Upload evidence file with computed SHA-256 hash | 🔐 |
| `GET` | `/api/files/case/:caseId` | List evidence files for a case | 🔐 |
| `GET` | `/api/blockchain/verify/:fileHash` | Verify cryptographic block proof & Merkle root | 🔐 |
| `GET` | `/api/logs/:caseId` | Retrieve audit log trail for a case | 🔐 |

---

## 📚 System Documentation

Detailed technical documents are stored in the `/docs` folder and root specifications:
* 📄 [API Documentation](docs/API_DOCUMENTATION.md)
* 📄 [Chain of Custody Protocol](docs/CHAIN_OF_CUSTODY.md)
* 📄 [User Guide](docs/USER_GUIDE.md)
* 📄 [Architecture Specifications](AI-Powered-Secure-Intelligent-Police-System-Architecture.md)
* 📄 [Functional Specifications](AI-Powered-Secure-Intelligent-Police-System-Functional-Specs.md)
* 📄 [Project Overview](AI-Powered-Secure-Intelligent-Police-System-Project-Overview.md)
* 📄 [System Requirements](AI-Powered-Secure-Intelligent-Police-System-Requirements.md)

---

## 🛡️ Security & Compliance

- **CJIS Standards Compliance**: Designed following Criminal Justice Information Services standards for digital evidence handling.
- **Tamper Alert Mechanism**: Real-time hash mismatch detection alerts system administrators if any stored file is modified out-of-band.
- **JWT & RBAC Security**: Stateless JSON Web Token authentication with strict middleware role validation.

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for details.
