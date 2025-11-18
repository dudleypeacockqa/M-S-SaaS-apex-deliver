import React from 'react';
import { SidebarNavigation } from './SidebarNavigation';
import { AIChatbot } from './AIChatbot';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <SidebarNavigation />

      {/* Main Content - White background with proper spacing */}
      <main className="flex-1 lg:ml-64 ml-0 overflow-y-auto bg-white">
        <div className="min-h-full">
          {children}
        </div>
      </main>

      {/* AI Chatbot */}
      <AIChatbot />
    </div>
  );
};

