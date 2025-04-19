
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { AppProvider } from '@/context/AppContext';
import { AuthProvider } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ThemeProvider } from '@/components/theme-provider';
import { ProtectedRoute } from '@/components/ProtectedRoute';

// Import your components
import { AddState } from '@/pages/AddState';
import { StateDetails } from '@/pages/StateDetails';
import { StateProfiles } from '@/pages/StateProfiles';
import { AdminDashboard, AISettings, UserManagement, SecuritySettings, NotificationSettings, DatabaseManagement } from '@/pages/admin';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
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
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />

                  {/* Protected routes */}
                  <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                    <Route path="/" element={<StateProfiles />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/states" element={<StateProfiles />} />
                    <Route path="/add-state" element={<AddState />} />
                    <Route path="/state/:stateId" element={<StateDetails />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/audit" element={<AuditLog />} />
                    <Route path="/notifications" element={<Notifications />} />
                    <Route path="/delegates" element={<Delegates />} />
                    {/* Admin routes */}
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/ai-settings" element={<AISettings />} />
                    <Route path="/admin/users" element={<UserManagement />} />
                    <Route path="/admin/security" element={<SecuritySettings />} />
                    <Route path="/admin/notifications" element={<NotificationSettings />} />
                    <Route path="/admin/database" element={<DatabaseManagement />} />
                  </Route>

                  {/* Fallback route */}
                  <Route path="*" element={<Navigate to="/" replace />} />
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
