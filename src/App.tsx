/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ScreenId, ToastMessage, GearReport } from './types';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Toast } from './components/Toast';
import { QuickNavigatorModal } from './components/QuickNavigatorModal';
import { NotificationsModal } from './components/NotificationsModal';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthModal } from './components/AuthModal';

// Screens
import { WelcomeScreen } from './screens/WelcomeScreen';
import { HomeScreen } from './screens/HomeScreen';
import { ExploreScreen } from './screens/ExploreScreen';
import { ActionsScreen } from './screens/ActionsScreen';
import { ProjectDetailsScreen } from './screens/ProjectDetailsScreen';
import { ShoreScanScreen } from './screens/ShoreScanScreen';
import { ReportGearScreen } from './screens/ReportGearScreen';
import { DossiersScreen } from './screens/DossiersScreen';
import { CommunityFeedScreen } from './screens/CommunityFeedScreen';
import { RecyclingScreen } from './screens/RecyclingScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { AuthScreen } from './screens/AuthScreen';
import { NavigatorScreen } from './screens/NavigatorScreen';
import { api } from './services/api';

function AppContent() {
  const { user, reports, addReport, isRealtimeConnected, setAuthModalOpen } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('home');
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [isQuickNavigatorOpen, setIsQuickNavigatorOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isFramed, setIsFramed] = useState(false);

  // Shared persistent state across screens
  const [isRegisteredKuta, setIsRegisteredKuta] = useState(false);

  const showToast = (message: string, icon: string = 'check_circle', type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = Date.now().toString();
    setToast({ id, message, icon, type });
    setTimeout(() => {
      setToast((prev) => (prev?.id === id ? null : prev));
    }, 2800);
  };

  const handleDispatchShoreScanToReports = async (sampleKey: string, notes: string, category: string) => {
    try {
      const newReportData: Partial<GearReport> = {
        gearType:
          category === 'net_hdpe'
            ? 'Polypropylene Netting'
            : category === 'rope_reef'
            ? 'Tangled Synthetic Rope'
            : category === 'buoy_rig'
            ? 'Drifting Buoy Line'
            : 'Marine Debris Segment',
        condition: 'Submerged & Snagged',
        locationName: 'Sanur Outer Reef • Sector 3',
        coords: '8.7052° S, 115.2625° E',
        date: 'Today',
        notes,
        threatLevel: 'Moderate Dragging Risk',
        hasWildlifeEntanglement: false,
        status: 'Under Review',
        confidence: '91.4% Edge Conf',
        assignedTeam: 'ShoreScan Automated Quorum (2 of 3 signed)',
      };

      await addReport(newReportData);
      await api.submitShoreScan({
        sampleKey,
        category,
        confidence: '91.4%',
        risk: 'Moderate Dragging Risk',
        notes,
        coordinates: '8.7052° S, 115.2625° E',
      });

      showToast('ShoreScan hazard dispatched to live shared dossiers!', 'rocket_launch');
      setCurrentScreen('dossiers');
    } catch (err: any) {
      showToast(err.message || 'Failed dispatching report', 'error');
    }
  };

  const handleAddManualReport = async (report: GearReport) => {
    try {
      await addReport(report);
      showToast('Incident filed into shared dossiers!', 'task_alt');
      setCurrentScreen('dossiers');
    } catch (err: any) {
      showToast(err.message || 'Failed saving report', 'error');
    }
  };

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return <WelcomeScreen onNavigate={setCurrentScreen} showToast={showToast} />;
      case 'home':
        return (
          <HomeScreen
            onNavigate={setCurrentScreen}
            showToast={showToast}
            isRegisteredKuta={isRegisteredKuta}
            onToggleRegisterKuta={() => setIsRegisteredKuta(!isRegisteredKuta)}
          />
        );
      case 'explore':
        return <ExploreScreen onNavigate={setCurrentScreen} showToast={showToast} />;
      case 'actions':
        return <ActionsScreen onNavigate={setCurrentScreen} showToast={showToast} />;
      case 'project-details':
        return (
          <ProjectDetailsScreen
            onNavigate={setCurrentScreen}
            showToast={showToast}
            isRegistered={isRegisteredKuta}
            onToggleRegister={() => setIsRegisteredKuta(!isRegisteredKuta)}
          />
        );
      case 'shorescan':
        return (
          <ShoreScanScreen
            onNavigate={setCurrentScreen}
            showToast={showToast}
            onDispatchToReports={handleDispatchShoreScanToReports}
          />
        );
      case 'report-gear':
        return (
          <ReportGearScreen
            onNavigate={setCurrentScreen}
            showToast={showToast}
            onAddReport={handleAddManualReport}
          />
        );
      case 'dossiers':
        return (
          <DossiersScreen
            onNavigate={setCurrentScreen}
            showToast={showToast}
            reportsList={reports}
          />
        );
      case 'community-feed':
        return <CommunityFeedScreen onNavigate={setCurrentScreen} showToast={showToast} />;
      case 'recycling':
        return <RecyclingScreen onNavigate={setCurrentScreen} showToast={showToast} />;
      case 'profile':
        return <ProfileScreen onNavigate={setCurrentScreen} showToast={showToast} />;
      case 'auth':
        return <AuthScreen onNavigate={setCurrentScreen} showToast={showToast} />;
      case 'navigator':
        return <NavigatorScreen onNavigate={setCurrentScreen} showToast={showToast} />;
      default:
        return (
          <HomeScreen
            onNavigate={setCurrentScreen}
            showToast={showToast}
            isRegisteredKuta={isRegisteredKuta}
            onToggleRegisterKuta={() => setIsRegisteredKuta(!isRegisteredKuta)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#f6faff] text-[#151c22] flex flex-col font-sans">
      {/* Toast Notification Banner */}
      <Toast toast={toast} onDismiss={() => setToast(null)} />

      {/* Notifications Drawer */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onNavigate={setCurrentScreen}
      />

      {/* Frame wrapper if toggled, or fluid full-width container */}
      <div
        className={`flex-1 flex flex-col mx-auto w-full transition-all ${
          isFramed
            ? 'max-w-md my-4 rounded-[40px] shadow-2xl border-[10px] border-[#002531] overflow-hidden bg-[#f6faff]'
            : 'max-w-full'
        }`}
      >
        {/* App Header */}
        <Header
          currentScreen={currentScreen}
          onNavigate={setCurrentScreen}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          isFramed={isFramed}
          onToggleFrame={() => setIsFramed(!isFramed)}
        />

        {/* Main Content Area */}
        <main className="flex-1 w-full flex flex-col">{renderActiveScreen()}</main>

        {/* Bottom Tab Navigation */}
        <BottomNav
          currentScreen={currentScreen}
          onNavigate={setCurrentScreen}
          onOpenQuickMenu={() => setIsQuickNavigatorOpen(true)}
        />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
