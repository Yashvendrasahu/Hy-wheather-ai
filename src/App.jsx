// src/App.jsx
import React from 'react';
import { WeatherProvider, useWeather } from './context/WeatherContext.jsx';
import Header from './components/common/Header.jsx';
import Footer from './components/common/Footer.jsx';
import Toast from './components/common/Toast.jsx';
import SafetyGuidanceModal from './components/common/SafetyGuidanceModal.jsx';
import AlertDetailsModal from './components/common/AlertDetailsModal.jsx';
import AddLocationModal from './components/common/AddLocationModal.jsx';

import HomeScreen from './components/screens/HomeScreen.jsx';
import ForecastScreen from './components/screens/ForecastScreen.jsx';
import WeatherMapScreen from './components/screens/WeatherMapScreen.jsx';
import AlertsScreen from './components/screens/AlertsScreen.jsx';
import LocationSearchScreen from './components/screens/LocationSearchScreen.jsx';
import AboutScreen from './components/screens/AboutScreen.jsx';

function MainContent() {
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

      {/* Global Modals & Notifications */}
      <Toast />
      <SafetyGuidanceModal />
      <AlertDetailsModal />
      <AddLocationModal />
    </div>
  );
}

export default function App() {
  return (
    <WeatherProvider>
      <MainContent />
    </WeatherProvider>
  );
}
