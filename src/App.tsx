import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardOverview } from './pages/DashboardOverview';
import { StudentsPage } from './pages/StudentsPage';
import { TeachersStaffPage } from './pages/TeachersStaffPage';
import { StreamsPage } from './pages/StreamsPage';
import { DepartmentsPage } from './pages/DepartmentsPage';
import { CombinationsPage } from './pages/CombinationsPage';
import { SubjectsPage } from './pages/SubjectsPage';
import { ExaminationsPage } from './pages/ExaminationsPage';
import { ResultsPage } from './pages/ResultsPage';
import { AttendancePage } from './pages/AttendancePage';
import { FinancePage } from './pages/FinancePage';
import { DisciplinePage } from './pages/DisciplinePage';
import { QualityAssurancePage } from './pages/QualityAssurancePage';
import { ParentPortalPage } from './pages/ParentPortalPage';
import { StudentPortalPage } from './pages/StudentPortalPage';
import { CommunicationPage } from './pages/CommunicationPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AuditLogsPage } from './pages/AuditLogsPage';
import { SchoolSettingsPage } from './pages/SchoolSettingsPage';
import { LandingPage } from './pages/LandingPage';
import { SchoolRegistrationModal } from './components/school/SchoolRegistrationModal';
import { JoinSchoolModal } from './components/school/JoinSchoolModal';
import { AddStudentModal } from './components/students/AddStudentModal';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';

const MainAppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('dashboard');
  const [isLandingView, setIsLandingView] = useState<boolean>(false);

  // Modals
  const [isRegisterSchoolOpen, setIsRegisterSchoolOpen] = useState(false);
  const [isJoinSchoolOpen, setIsJoinSchoolOpen] = useState(false);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  if (isLandingView) {
    return (
      <>
        <LandingPage
          onEnterApp={() => setIsLandingView(false)}
          onOpenRegisterSchool={() => {
            setIsLandingView(false);
            setIsRegisterSchoolOpen(true);
          }}
          onOpenJoinSchool={() => {
            setIsLandingView(false);
            setIsJoinSchoolOpen(true);
          }}
        />
        {/* Modals in landing view */}
        <SchoolRegistrationModal
          isOpen={isRegisterSchoolOpen}
          onClose={() => setIsRegisterSchoolOpen(false)}
          onSuccess={() => setIsLandingView(false)}
        />
        <JoinSchoolModal
          isOpen={isJoinSchoolOpen}
          onClose={() => setIsJoinSchoolOpen(false)}
          onSuccess={() => setIsLandingView(false)}
        />
      </>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-slate-100 font-sans text-slate-800 antialiased selection:bg-sky-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        onOpenRegisterSchool={() => setIsRegisterSchoolOpen(true)}
        onOpenJoinSchool={() => setIsJoinSchoolOpen(true)}
        onNavigate={(p) => setCurrentPage(p)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          currentPage={currentPage}
          onNavigate={(p) => setCurrentPage(p)}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {currentPage === 'dashboard' && (
              <DashboardOverview
                onNavigate={(p) => setCurrentPage(p)}
                onOpenRegisterSchool={() => setIsRegisterSchoolOpen(true)}
                onOpenStudentModal={() => setIsAddStudentOpen(true)}
              />
            )}

            {currentPage === 'students' && (
              <StudentsPage onOpenAddStudent={() => setIsAddStudentOpen(true)} />
            )}

            {currentPage === 'teachers' && <TeachersStaffPage />}
            {currentPage === 'streams' && <StreamsPage />}
            {currentPage === 'departments' && <DepartmentsPage />}
            {currentPage === 'combinations' && <CombinationsPage />}
            {currentPage === 'subjects' && <SubjectsPage />}
            {currentPage === 'examinations' && <ExaminationsPage />}
            {currentPage === 'results' && <ResultsPage />}
            {currentPage === 'attendance' && <AttendancePage />}
            {currentPage === 'finance' && <FinancePage />}
            {currentPage === 'discipline' && <DisciplinePage />}
            {currentPage === 'qa' && <QualityAssurancePage />}
            {currentPage === 'parent-portal' && <ParentPortalPage />}
            {currentPage === 'student-portal' && <StudentPortalPage />}
            {currentPage === 'communication' && <CommunicationPage />}
            {currentPage === 'analytics' && <AnalyticsPage />}
            {currentPage === 'audit-logs' && <AuditLogsPage />}
            {currentPage === 'settings' && <SchoolSettingsPage />}
          </div>
        </main>
      </div>

      {/* Global Modals */}
      <SchoolRegistrationModal
        isOpen={isRegisterSchoolOpen}
        onClose={() => setIsRegisterSchoolOpen(false)}
      />

      <JoinSchoolModal
        isOpen={isJoinSchoolOpen}
        onClose={() => setIsJoinSchoolOpen(false)}
      />

      <AddStudentModal
        isOpen={isAddStudentOpen}
        onClose={() => setIsAddStudentOpen(false)}
      />

      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={(p) => setCurrentPage(p)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
