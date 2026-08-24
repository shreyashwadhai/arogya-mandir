import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from './redux/store';
import { Header } from './components/Header';
import { Step01QRScan } from './components/steps/Step01QRScan';
import { Step01_5MobileCheck } from './components/steps/Step01_5MobileCheck';
import { Step03OTPVerification } from './components/steps/Step03OTPVerification';
import { Step05FeedbackInterview } from './components/steps/Step05FeedbackInterview';
import { Step06Confirmation } from './components/steps/Step06Confirmation';
import { FacilityModal } from './components/FacilityModal';
import { AdminLoginPage } from './components/admin/AdminLoginPage';
import { AdminDashboardPage } from './components/admin/AdminDashboardPage';
import { openAdminModal, closeAdminModal } from './redux/features/adminSlice';
import { AnimatePresence } from 'framer-motion';

export const App: React.FC = () => {
  const dispatch = useDispatch();
  const currentStep = useSelector((state: RootState) => state.journey.currentStep);
  const showAdminModal = useSelector((state: RootState) => state.admin.showAdminModal);
  const isAuthenticated = useSelector((state: RootState) => state.admin.isAuthenticated);

  const [viewMode, setViewMode] = useState<'single' | 'all'>('single');
  const [isAdminPath, setIsAdminPath] = useState(false);

  // Route listener for /admin URL
  useEffect(() => {
    const checkAdminRoute = () => {
      const path = window.location.pathname.toLowerCase();
      const isAdmin = path === '/admin' || path === '/admin/' || path.endsWith('/admin');
      setIsAdminPath(isAdmin);
      if (isAdmin) {
        dispatch(openAdminModal());
      }
    };

    checkAdminRoute();
    window.addEventListener('popstate', checkAdminRoute);
    return () => window.removeEventListener('popstate', checkAdminRoute);
  }, [dispatch]);

  const handleBackToPatientForm = () => {
    dispatch(closeAdminModal());
    setIsAdminPath(false);
    if (window.location.pathname.toLowerCase().includes('/admin')) {
      window.history.pushState({}, '', '/');
    }
  };

  // If user navigated to /admin or opened admin mode, render full-screen Admin Pages!
  if (showAdminModal || isAdminPath) {
    if (!isAuthenticated) {
      return <AdminLoginPage onBackToPatientForm={handleBackToPatientForm} />;
    }
    return <AdminDashboardPage onBackToPatientForm={handleBackToPatientForm} />;
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step01QRScan key="step1" />;
      case 2:
        return <Step01_5MobileCheck key="step2" />;
      case 3:
        return <Step03OTPVerification key="step3" />;
      case 4:
        return <Step05FeedbackInterview key="step4" />;
      case 5:
        return <Step06Confirmation key="step5" />;
      default:
        return <Step01QRScan key="step1" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0A101D] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Header */}
      <Header viewMode={viewMode} setViewMode={setViewMode} />

      {/* Main Flow Container */}
      <main className="flex-1 flex flex-col items-center justify-center p-3 sm:p-6 my-2 sm:my-6 relative z-10 w-full">
        {viewMode === 'single' ? (
          <div className="w-full max-w-sm sm:max-w-md mx-auto">
            <AnimatePresence mode="wait">
              {renderStep()}
            </AnimatePresence>
          </div>
        ) : (
          /* ALL SCREENS PREVIEW */
          <div className="w-full max-w-7xl mx-auto py-4 overflow-x-auto">
            <div className="text-center mb-6">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-black uppercase tracking-wider border border-amber-500/30">
                Official Patient Journey Steps
              </span>
              <h2 className="text-2xl font-black text-white mt-2">Patient Feedback & Grievance Workflow</h2>
              <p className="text-xs text-slate-400">Complete end-to-end patient workflow matching the official specification.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 items-start min-w-[1200px] xl:min-w-0">
              <div className="transform hover:scale-[1.02] transition"><Step01QRScan /></div>
              <div className="transform hover:scale-[1.02] transition"><Step01_5MobileCheck /></div>
              <div className="transform hover:scale-[1.02] transition"><Step03OTPVerification /></div>
              <div className="transform hover:scale-[1.02] transition"><Step05FeedbackInterview /></div>
              <div className="transform hover:scale-[1.02] transition"><Step06Confirmation /></div>
            </div>
          </div>
        )}
      </main>

      {/* Facility Selector Modal */}
      <FacilityModal />
    </div>
  );
};

export default App;
