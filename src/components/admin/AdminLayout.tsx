import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Users,
  Settings,
  Brain,
  Bell,
  Database,
  ChevronLeft,
  Shield
} from 'lucide-react';

const adminNavItems = [
  { title: 'Dashboard', href: '/admin', icon: <Shield className="h-4 w-4" /> },
  { title: 'AI Settings', href: '/admin/ai-settings', icon: <Brain className="h-4 w-4" /> },
  { title: 'Users', href: '/admin/users', icon: <Users className="h-4 w-4" /> },
  { title: 'Security', href: '/admin/security', icon: <Settings className="h-4 w-4" /> },
  { title: 'Notifications', href: '/admin/notifications', icon: <Bell className="h-4 w-4" /> },
  { title: 'Database', href: '/admin/database', icon: <Database className="h-4 w-4" /> },
];

export function AdminLayout() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r bg-card">
        <div className="p-4 border-b">
          <Link
            to="/"
            className="flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Main App
          </Link>
        </div>
        <nav className="p-2 space-y-1">
          {adminNavItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                location.pathname === item.href ? "bg-accent" : "transparent"
              )}
            >
              {item.icon}
              <span>{item.title}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;

