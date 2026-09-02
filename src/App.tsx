import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginForm } from './components/auth/LoginForm';
import { AppHeader } from './components/layout/AppHeader';
import { Sidebar } from './components/layout/Sidebar';
import { PoliceOfficerView } from './components/views/PoliceOfficerView';
import { InvestigatorView } from './components/views/InvestigatorView';
import { ForensicView } from './components/views/ForensicView';
import { LawyerView } from './components/views/LawyerView';
import { AccessRestricted } from './components/views/AccessRestricted';
import { CaseSelection } from './components/views/CaseSelection';

const DashboardContent: React.FC = () => {
  const { user, activeCaseId, activeTab, canAccess } = useAuth();

  if (!user) {
    return <LoginForm />;
  }

  if (!activeCaseId) {
    return (
      <div className="min-h-screen flex flex-col">
        <AppHeader />
        <CaseSelection />
      </div>
    );
  }

  const renderActiveView = () => {
    if (!canAccess(activeTab)) {
      return <AccessRestricted />;
    }

    if (activeTab.startsWith('police_')) {
      return <PoliceOfficerView />;
    }
    if (activeTab.startsWith('investigator_')) {
      return <InvestigatorView />;
    }
    if (activeTab.startsWith('forensic_')) {
      return <ForensicView />;
    }
    if (activeTab.startsWith('lawyer_')) {
      return <LawyerView />;
    }

    return <PoliceOfficerView />;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      
      <div className="flex-1 max-w-7xl w-full mx-auto p-6 flex gap-6">
        <Sidebar />
        
        <main className="flex-1 min-w-0">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <DashboardContent />
    </AuthProvider>
  );
}
