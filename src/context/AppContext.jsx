import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { INITIAL_PERSONAS } from '../services/mockData';
import { storageService } from '../services/storageService';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  // Current user persona for demonstration
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('campusfind_current_persona');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Map personas saved by the previous version to the renamed demo identities.
        const legacyIds = {
          user_aarav: 'user_bharath',
          user_priya: 'user_abhishek',
          user_rohan: 'user_sai',
          user_caretaker: 'user_bhanu_prakash'
        };
        const currentId = legacyIds[parsed.id] || parsed.id;
        const matchingPersona = INITIAL_PERSONAS.find(persona => persona.id === currentId);
        if (matchingPersona) return matchingPersona;
      }
    } catch (e) {}
    return INITIAL_PERSONAS[0]; // bharath (Hostel Block B)
  });

  // Dark / Light Theme
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('campusfind_theme') || 'light';
  });

  // Storage Mode info (localStorage vs Supabase)
  const [storageInfo, setStorageInfo] = useState(storageService.getStorageMode());

  // Real-time calculated stats
  const [stats, setStats] = useState({
    total: 0,
    lost: 0,
    found: 0,
    returned: 0,
    active: 0,
    pendingClaims: 0,
    returnRate: 0
  });

  // Toast notifications
  const [toasts, setToasts] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('campusfind_theme', theme);
  }, [theme]);

  // Load stats
  const refreshStats = useCallback(async () => {
    try {
      const s = await storageService.getStats();
      setStats(s);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  }, []);

  useEffect(() => {
    refreshStats();
  }, [refreshStats, refreshKey]);

  // Switch persona
  const switchUser = (user) => {
    setCurrentUser(user);
    localStorage.setItem('campusfind_current_persona', JSON.stringify(user));
    showToast('Switched Persona', `Active student is now: ${user.name} (${user.hostel})`, 'info');
  };

  // Toggle Theme
  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Toast manager
  const showToast = (title, message, type = 'info') => {
    const id = Date.now() + Math.random().toString();
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4500);
  };

  const dismissToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Trigger global data refresh
  const triggerRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Reset to initial demo data
  const resetDemoData = () => {
    storageService.resetToSampleData();
    triggerRefresh();
    showToast('Demo Data Reset', 'CampusFind has been reset to default realistic hostel records.', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        switchUser,
        personas: INITIAL_PERSONAS,
        theme,
        toggleTheme,
        storageInfo,
        stats,
        refreshStats,
        triggerRefresh,
        resetDemoData,
        toasts,
        showToast,
        dismissToast,
        refreshKey
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
