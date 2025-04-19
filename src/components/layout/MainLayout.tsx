
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { SparkChatBubble } from '@/components/spark/SparkChatBubble';
import { useAuth } from '@/context/AuthContext';

export default function MainLayout() {
  const { userProfile } = useAuth();

  return (
    <div className="flex min-h-screen">
      <Sidebar className="w-64 flex-shrink-0" />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <SparkChatBubble />
      </div>
    </div>
  );
}



