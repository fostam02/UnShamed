
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { AppProvider } from '@/context/AppContext';
import { AuthProvider } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ThemeProvider } from '@/components/theme-provider';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ProtectedAdminRoute } from '@/components/admin/ProtectedAdminRoute';
import { AdminLayout } from '@/components/admin/AdminLayout';

// Import your components
import { AddState } from '@/pages/AddState';
import { StateDetails } from '@/pages/StateDetails';
import { StateProfiles } from '@/pages/StateProfiles';
import {
  AdminDashboard,
  AISettings,
  UserManagement,
  SecuritySettings,
  NotificationSettings,
  DatabaseManagement
} from '@/pages/admin';
import LoginDirect from '@/pages/LoginDirect';
import RegisterDirect from '@/pages/RegisterDirect';
import LoginSimple from '@/pages/LoginSimple';
import RegisterSimple from '@/pages/RegisterSimple';
import RegisterFixed from '@/pages/RegisterFixed';
import LoginFixed from '@/pages/LoginFixed';
import LoginUltraSimple from '@/pages/LoginUltraSimple';
import RegisterUltraSimple from '@/pages/RegisterUltraSimple';
import LandingPage from '@/pages/LandingPage';
import ForgotPassword from '@/pages/ForgotPassword';
import Dashboard from '@/pages/Dashboard';
import Profile from '@/pages/Profile';
import AuditLog from '@/pages/AuditLog';
import Notifications from '@/pages/Notifications';
import Delegates from '@/pages/Delegates';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <AuthProvider>
          <AppProvider>
            <Router>
              <div className="min-h-screen bg-background">
                <Routes>
                  {/* Public routes */}
                  <Route path="/welcome" element={<LandingPage />} />
                  <Route path="/login" element={<LoginUltraSimple />} />
                  <Route path="/register" element={<RegisterUltraSimple />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />

                  {/* Protected routes */}
                  <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                    <Route index element={<Dashboard />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/audit" element={<AuditLog />} />
                    <Route path="/notifications" element={<Notifications />} />
                    <Route path="/delegates" element={<Delegates />} />
                    <Route path="/add-state" element={<AddState />} />
                    <Route path="/state/:id" element={<StateDetails />} />
                    <Route path="/states" element={<StateProfiles />} />
                  </Route>

                  {/* Admin routes */}
                  <Route path="/admin" element={
                    <ProtectedRoute>
                      <ProtectedAdminRoute>
                        <AdminLayout />
                      </ProtectedAdminRoute>
                    </ProtectedRoute>
                  }>
                    <Route index element={<AdminDashboard />} />
                    <Route path="ai-settings" element={<AISettings />} />
                    <Route path="users" element={<UserManagement />} />
                    <Route path="security" element={<SecuritySettings />} />
                    <Route path="notifications" element={<NotificationSettings />} />
                    <Route path="database" element={<DatabaseManagement />} />
                  </Route>

                  {/* Root route is handled by the index in the protected routes section */}

                  {/* Fallback route */}
                  <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
                <Toaster />
              </div>
            </Router>
          </AppProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;



