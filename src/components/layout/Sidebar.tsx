import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Globe,
  PlusCircle,
  Users,
  Bell,
  User,
  FileText,
  Shield,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation();
  const { logout, userProfile } = useAuth();

  // Add temporary debug display
  const debugInfo = (
    <div className="px-3 py-2 text-xs text-muted-foreground">
      <pre className="whitespace-pre-wrap">
        {JSON.stringify({
          role: userProfile?.role,
          email: userProfile?.email,
          isAdmin: userProfile?.role === 'admin'
        }, null, 2)}
      </pre>
    </div>
  );

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'States', href: '/states', icon: Globe },
    { name: 'Add State', href: '/add-state', icon: PlusCircle },
    { name: 'Delegates', href: '/delegates', icon: Users },
    { name: 'Notifications', href: '/notifications', icon: Bell },
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Audit Log', href: '/audit', icon: FileText },
  ];

  // Force add admin panel for debugging
  navigation.push({
    name: 'Admin Panel',
    href: '/admin',
    icon: Shield,
  });

  return (
    <div className={cn("pb-12 min-h-screen flex flex-col", className)}>
      {debugInfo} {/* Add debug info at the top */}
      <div className="space-y-4 py-4 flex-grow">
        <div className="px-3 py-2">
          <div className="space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  location.pathname === item.href ? "bg-accent text-accent-foreground" : "transparent"
                )}
              >
                <item.icon className="mr-2 h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Logout button at the bottom */}
      <div className="px-3 py-4 mt-auto border-t">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 dark:hover:text-red-400"
          onClick={() => {
            console.log('Logout clicked from sidebar');
            // Use window.location directly for more reliable logout
            localStorage.removeItem('authUser');
            localStorage.removeItem('unShamedState');
            sessionStorage.removeItem('adminAuth');
            console.log('Auth data cleared, redirecting to login...');
            window.location.href = '/login';
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log Out</span>
        </Button>
      </div>
    </div>
  );
}








