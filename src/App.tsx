
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/context/AuthContext';

// Import your page components
import Register from '@/pages/Register';
import { AISettings } from '@/pages/admin/AISettings';
import DelegateManagement from '@/pages/DelegateManagement';

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="app-theme">
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<DelegateManagement />} />
            <Route path="/admin/ai-settings" element={<AISettings />} />
          </Route>
        </Routes>
        
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

