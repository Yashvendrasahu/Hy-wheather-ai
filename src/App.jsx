// src/App.jsx
import React from 'react';
import { WeatherProvider, useWeather } from './context/WeatherContext.jsx';
import { MeteorologistProvider, useMeteorologist } from './context/MeteorologistContext.jsx';
import { DisasterManagementProvider, useDisasterManagement } from './context/DisasterManagementContext.jsx';
import { AdminProvider, useAdmin } from './context/AdminContext.jsx';

// Citizen Common Components
import Header from './components/common/Header.jsx';
import Footer from './components/common/Footer.jsx';
import Toast from './components/common/Toast.jsx';
import SafetyGuidanceModal from './components/common/SafetyGuidanceModal.jsx';
import AlertDetailsModal from './components/common/AlertDetailsModal.jsx';
import AddLocationModal from './components/common/AddLocationModal.jsx';

// Citizen Screens
import HomeScreen from './components/screens/HomeScreen.jsx';
import ForecastScreen from './components/screens/ForecastScreen.jsx';
import WeatherMapScreen from './components/screens/WeatherMapScreen.jsx';
import AlertsScreen from './components/screens/AlertsScreen.jsx';
import LocationSearchScreen from './components/screens/LocationSearchScreen.jsx';
import AboutScreen from './components/screens/AboutScreen.jsx';

// Meteorologist Components & Screens
import MeteorologistNavbar from './components/meteorologist/MeteorologistNavbar.jsx';
import MeteorologistFooter from './components/meteorologist/MeteorologistFooter.jsx';
import LoginScreen from './components/meteorologist/LoginScreen.jsx';
import SignupScreen from './components/meteorologist/SignupScreen.jsx';
import MeteorologistDashboard from './components/meteorologist/MeteorologistDashboard.jsx';
import ForecastAnalysisScreen from './components/meteorologist/ForecastAnalysisScreen.jsx';
import WeatherEventsScreen from './components/meteorologist/WeatherEventsScreen.jsx';
import AnalyticsScreen from './components/meteorologist/AnalyticsScreen.jsx';
import ProfileSettingsScreen from './components/meteorologist/ProfileSettingsScreen.jsx';

// Meteorologist Modals & Toast
import BulletinModal from './components/meteorologist/modals/BulletinModal.jsx';
import SoundingModal from './components/meteorologist/modals/SoundingModal.jsx';
import DisasterLiaisonModal from './components/meteorologist/modals/DisasterLiaisonModal.jsx';
import AddRegionModal from './components/meteorologist/modals/AddRegionModal.jsx';
import MeteorologistToast from './components/meteorologist/MeteorologistToast.jsx';

// Disaster Management Authority (DMA) Components & Screens
import DMANavbar from './components/dma/DMANavbar.jsx';
import DMAFooter from './components/dma/DMAFooter.jsx';
import DMADashboard from './components/dma/DMADashboard.jsx';
import DMARiskMapScreen from './components/dma/DMARiskMapScreen.jsx';
import DMAAlertsActionsScreen from './components/dma/DMAAlertsActionsScreen.jsx';
import DMAIncidentHistoryScreen from './components/dma/DMAIncidentHistoryScreen.jsx';
import DMAProfileSettingsScreen from './components/dma/DMAProfileSettingsScreen.jsx';

// DMA Modals & Toast
import EmergencyBroadcastModal from './components/dma/modals/EmergencyBroadcastModal.jsx';
import OfficialAlertModal from './components/dma/modals/OfficialAlertModal.jsx';
import PublicAdvisoryModal from './components/dma/modals/PublicAdvisoryModal.jsx';
import EscalateSDMAModal from './components/dma/modals/EscalateSDMAModal.jsx';
import ReadinessAuditModal from './components/dma/modals/ReadinessAuditModal.jsx';
import DMAToast from './components/dma/modals/DMAToast.jsx';

// Administrator Components & Screens
import AdminNavbar from './components/admin/AdminNavbar.jsx';
import AdminFooter from './components/admin/AdminFooter.jsx';
import AdminDashboard from './components/admin/AdminDashboard.jsx';
import AdminLogsScreen from './components/admin/AdminLogsScreen.jsx';
import AdminDataModelsScreen from './components/admin/AdminDataModelsScreen.jsx';
import AdminApprovalsScreen from './components/admin/AdminApprovalsScreen.jsx';
import AdminConfigScreen from './components/admin/AdminConfigScreen.jsx';

// Admin Modals & Toast
import ReviewDocsModal from './components/admin/modals/ReviewDocsModal.jsx';
import CryptoAuthModal from './components/admin/modals/CryptoAuthModal.jsx';
import DiagnosticsModal from './components/admin/modals/DiagnosticsModal.jsx';
import EditConfigModal from './components/admin/modals/EditConfigModal.jsx';
import AdminToast from './components/admin/modals/AdminToast.jsx';

function CitizenPortal() {
  const { activeTab } = useWeather();

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen />;
      case 'forecast':
        return <ForecastScreen />;
      case 'weather-map':
        return <WeatherMapScreen />;
      case 'alerts':
        return <AlertsScreen />;
      case 'search':
        return <LocationSearchScreen />;
      case 'about':
        return <AboutScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Header />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderScreen()}
      </main>
      <Footer />

      {/* Global Citizen Modals & Notifications */}
      <Toast />
      <SafetyGuidanceModal />
      <AlertDetailsModal />
      <AddLocationModal />
    </div>
  );
}

function MeteorologistPortal() {
  const { metTab, isAuthenticated } = useMeteorologist();

  if (metTab === 'signup') {
    return <SignupScreen />;
  }

  if (!isAuthenticated || metTab === 'login') {
    return <LoginScreen />;
  }

  const renderDeskScreen = () => {
    switch (metTab) {
      case 'dashboard':
        return <MeteorologistDashboard />;
      case 'forecast-analysis':
        return <ForecastAnalysisScreen />;
      case 'weather-events':
        return <WeatherEventsScreen />;
      case 'analytics':
        return <AnalyticsScreen />;
      case 'profile-settings':
        return <ProfileSettingsScreen />;
      default:
        return <MeteorologistDashboard />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <MeteorologistNavbar />
      <main className="flex-1 max-w-[1540px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderDeskScreen()}
      </main>
      <MeteorologistFooter />

      {/* Global Meteorologist Modals & Toast */}
      <BulletinModal />
      <SoundingModal />
      <DisasterLiaisonModal />
      <AddRegionModal />
      <MeteorologistToast />
    </div>
  );
}

function DMAPortal() {
  const { dmaTab } = useDisasterManagement();

  const renderDMAScreen = () => {
    switch (dmaTab) {
      case 'dashboard':
        return <DMADashboard />;
      case 'risk-map':
        return <DMARiskMapScreen />;
      case 'alerts-actions':
        return <DMAAlertsActionsScreen />;
      case 'incident-history':
        return <DMAIncidentHistoryScreen />;
      case 'profile-settings':
        return <DMAProfileSettingsScreen />;
      default:
        return <DMADashboard />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <DMANavbar />
      <main className="flex-1 max-w-[1540px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderDMAScreen()}
      </main>
      <DMAFooter />

      {/* Global DMA Modals & Toast */}
      <EmergencyBroadcastModal />
      <OfficialAlertModal />
      <PublicAdvisoryModal />
      <EscalateSDMAModal />
      <ReadinessAuditModal />
      <DMAToast />
    </div>
  );
}

function AdminPortal() {
  const { adminTab } = useAdmin();

  const renderAdminScreen = () => {
    switch (adminTab) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'data-models':
        return <AdminDataModelsScreen />;
      case 'approvals':
        return <AdminApprovalsScreen />;
      case 'logs':
        return <AdminLogsScreen />;
      case 'config':
        return <AdminConfigScreen />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <AdminNavbar />
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderAdminScreen()}
      </main>
      <AdminFooter />

      {/* Global Admin Modals & Toast */}
      <ReviewDocsModal />
      <CryptoAuthModal />
      <DiagnosticsModal />
      <EditConfigModal />
      <AdminToast />
    </div>
  );
}

function AppContent() {
  const { portalMode } = useMeteorologist();

  if (portalMode === 'citizen') {
    return <CitizenPortal />;
  }

  if (portalMode === 'meteorologist') {
    return <MeteorologistPortal />;
  }

  if (portalMode === 'dma') {
    return <DMAPortal />;
  }

  return <AdminPortal />;
}

export default function App() {
  return (
    <AdminProvider>
      <MeteorologistProvider>
        <DisasterManagementProvider>
          <WeatherProvider>
            <AppContent />
          </WeatherProvider>
        </DisasterManagementProvider>
      </MeteorologistProvider>
    </AdminProvider>
  );
}
