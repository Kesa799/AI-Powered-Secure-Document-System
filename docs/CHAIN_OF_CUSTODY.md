# Cryptographic Chain of Custody Protocol

## Overview
In law enforcement, maintaining an unalterable **Chain of Custody** is critical to ensure evidence admissibility in court.

## Verification Pipeline
1. **Ingress Hashing**: Upon document selection in the frontend, `pki.ts` computes an initial SHA-256 digest before network transmission.
2. **Server Hashing**: `backend/src/blockchain.ts` computes a secondary validation digest.
3. **Block Creation**: The file hash, along with timestamp, user ID, role, and prior block hash, forms a new immutable block.
4. **Verification Modal**: Prosecutors or investigators can trigger the verification modal anytime to check if the current stored document matches the block's immutable hash.
