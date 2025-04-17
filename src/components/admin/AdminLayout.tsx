import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Users, 
  Settings, 
  Shield, 
  Bell, 
  Database,
  ChevronLeft
} from 'lucide-react';

const adminNavItems = [
  {
    title: "Dashboard",
    icon: <Settings className="h-5 w-5" />,
    href: "/admin"
  },
  {
    title: "User Management",
    icon: <Users className="h-5 w-5" />,
    href: "/admin/users"
  },
  {
    title: "AI Settings",
    icon: <Settings className="h-5 w-5" />,
    href: "/admin/ai-settings"
  },
  {
    title: "Security Settings",
    icon: <Shield className="h-5 w-5" />,
    href: "/admin/security"
  },
  {
    title: "Notification Settings",
    icon: <Bell className="h-5 w-5" />,
    href: "/admin/notifications"
  },
  {
    title: "Database Management",
    icon: <Database className="h-5 w-5" />,
    href: "/admin/database"
  }
];

export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  return (
    <div className="flex min-h-screen">
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
        <nav className="p-2">
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
              {item.title}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
};