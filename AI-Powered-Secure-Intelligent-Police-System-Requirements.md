# AI-Powered Secure Intelligent Police System - System Requirements

## 1. Environment & Prerequisites
- **Node.js**: Version `18.x` or higher (`20.x+` recommended)
- **Package Manager**: `npm` (v9+) or `yarn` / `pnpm`
- **Database**: SQLite3 (included via Node `sqlite3` driver)
- **Containerization (Optional)**: Docker & Docker Compose v2.0+

---

## 2. Dependencies & Stack Specifications

### Frontend (`/frontend`)
- **Framework**: React 19 + TypeScript 5.x
- **Build Tool**: Vite 6.x
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Linter**: Oxlint

### Backend (`/backend`)
- **Runtime**: Node.js + Express
- **TypeScript Runner**: `tsx`
- **Database Access**: SQLite3 with Promise wrappers
- **File Processing**: Multer middleware
- **Authentication**: JSON Web Tokens (`jsonwebtoken`) + `bcryptjs`

---

## 3. Deployment Instructions

### Standard Local Setup
```bash
# Install & Run Backend
cd backend
npm install
npm run dev

# Install & Run Frontend (in a new terminal)
cd frontend
npm install
npm run dev
```

### Docker Compose Setup
```bash
docker-compose up --build
```
- Frontend available at: `http://localhost:5173`
- Backend API available at: `http://localhost:5000`
