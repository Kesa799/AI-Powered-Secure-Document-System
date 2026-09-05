# API Documentation

## Auth Endpoints
- `POST /api/auth/login`
  - Body: `{ username, password }`
  - Response: `{ token, user: { id, name, role, badgeNumber } }`

## Case Endpoints
- `GET /api/cases`
  - Headers: `Authorization: Bearer <token>`
  - Response: Array of active police case objects.

## File & Evidence Endpoints
- `POST /api/files/upload`
  - Form Data: `file`, `caseId`, `category`, `uploadedBy`
  - Response: File metadata record with computed SHA-256 hash.

## Blockchain Ledger Endpoints
- `GET /api/blockchain/verify/:fileHash`
  - Response: Verification status, Merkle root proof, block details.

## Audit Logs
- `GET /api/logs/:caseId`
  - Response: Immutable audit log entries for specified case ID.
