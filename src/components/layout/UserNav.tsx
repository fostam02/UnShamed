import React from 'react';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';

export function UserNav() {
  const { userProfile, logout } = useAuth();

  // Get initials from name, firstName, or email
  const getInitials = () => {
    if (userProfile?.name) {
      return userProfile.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase();
    } else if (userProfile?.firstName) {
      return userProfile.firstName.charAt(0).toUpperCase();
    } else if (userProfile?.email) {
      return userProfile.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  // Get display name from name, firstName + lastName, or email
  const getDisplayName = () => {
    if (userProfile?.name) {
      return userProfile.name;
    } else if (userProfile?.firstName) {
      return userProfile.firstName + (userProfile.lastName ? ` ${userProfile.lastName}` : '');
    } else if (userProfile?.email) {
      return userProfile.email.split('@')[0];
    }
    return 'User';
  };

  const initials = getInitials();
  const displayName = getDisplayName();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {userProfile?.email || 'No email'}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {userProfile?.role === 'admin' && (
          <DropdownMenuItem asChild>
            <Link to="/admin">Admin Panel</Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild>
          <Link to="/profile">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            console.log('Logout clicked from UserNav');
            logout();
          }}
          className="text-red-500 hover:text-red-600 cursor-pointer"
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
