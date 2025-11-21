import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '@/components/marketing/financeflo/ui/sidebar';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardHeader } from './DashboardHeader';
import { ProtectedRoute } from '@/components/marketing/financeflo/auth/ProtectedRoute';

export const DashboardLayout = () => {
  return (
    <ProtectedRoute>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <DashboardSidebar />
          
          <div className="flex-1 flex flex-col overflow-hidden">
            <DashboardHeader />
            
            <main className="flex-1 overflow-y-auto bg-background p-4 md:p-6">
              <div className="max-w-7xl mx-auto">
                <Outlet />
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
};