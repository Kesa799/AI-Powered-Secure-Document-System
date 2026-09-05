# AI-Powered Secure Intelligent Police System - Architecture Specification

## 1. High-Level Architecture Overview

```
+-----------------------------------------------------------------------+
|                         Frontend Client (Vite + React)                |
|  - Role-Based Views: Police, Investigator, Forensic, Legal            |
|  - Cryptographic PKI Hashing (SHA-256)                                |
|  - Interactive Verification & Audit Modals                           |
+-----------------------------------+-+---------------------------------+
                                    |
                             REST API (JSON / Multipart)
                                    |
+-----------------------------------v-+---------------------------------+
|                       Backend Server (Node.js + Express)              |
|  - API Gateway & Authentication Middleware                            |
|  - Storage Engine (Multer / File System)                              |
|  - Blockchain Ledger Engine (Cryptographic Hash Chaining)             |
|  - SQLite Relational Database Engine                                  |
+-----------------------------------------------------------------------+
```

---

## 2. Directory Structure

```
.
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy-pages.yml
├── backend/
│   ├── src/
│   │   ├── middleware/
│   │   │   └── auth.ts
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   ├── blockchain.ts
│   │   │   ├── cases.ts
│   │   │   ├── files.ts
│   │   │   └── logs.ts
│   │   ├── blockchain.ts
│   │   ├── db.ts
│   │   └── server.ts
│   ├── database.sqlite
│   ├── package.json
│   └── tsconfig.json
├── docs/
│   ├── API_DOCUMENTATION.md
│   ├── CHAIN_OF_CUSTODY.md
│   └── USER_GUIDE.md
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   ├── layout/
│   │   │   └── views/
│   │   ├── context/
│   │   ├── services/
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
├── .gitignore
├── AI-Powered-Secure-Intelligent-Police-System-Architecture.md
├── AI-Powered-Secure-Intelligent-Police-System-Functional-Specs.md
├── AI-Powered-Secure-Intelligent-Police-System-Project-Overview.md
├── AI-Powered-Secure-Intelligent-Police-System-Requirements.md
├── README.md
└── docker-compose.yml
```

---

## 3. Cryptographic Security Engine

### Hashing & Chain-of-Custody Validation
- Files uploaded are processed via standard SHA-256 digest computation before being saved to storage.
- Every new evidence file generates a new block in `blockchain.ts`:
```ts
Block Hash = SHA256(index + previousHash + timestamp + fileHash + metadata)
```
- Immutability is maintained through strict hash link checks. Any modification to a file invalidates the stored hash, alerting investigators of evidence tampering.
