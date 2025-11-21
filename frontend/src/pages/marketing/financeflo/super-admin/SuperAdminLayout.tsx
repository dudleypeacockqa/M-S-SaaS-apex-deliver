import React from 'react';
import { Outlet, useLocation, NavLink } from 'react-router-dom';
import { Card } from '@/components/marketing/financeflo/ui/card';
import { Button } from '@/components/marketing/financeflo/ui/button';
import { Badge } from '@/components/marketing/financeflo/ui/badge';
import { 
  LayoutDashboard, 
  Building2, 
  Activity, 
  DollarSign, 
  UserCheck,
  Settings,
  Shield,
  LogOut
} from 'lucide-react';

const SuperAdminLayout = () => {
  const location = useLocation();

  const navigationItems = [
    {
      title: 'Dashboard',
      url: '/super-admin',
      icon: LayoutDashboard,
      description: 'System overview and metrics'
    },
    {
      title: 'Tenant Management',
      url: '/super-admin/tenants',
      icon: Building2,
      description: 'Manage all tenant organizations'
    },
    {
      title: 'System Health',
      url: '/super-admin/health',
      icon: Activity,
      description: 'Infrastructure monitoring'
    },
    {
      title: 'Billing & Revenue',
      url: '/super-admin/billing',
      icon: DollarSign,
      description: 'Financial operations'
    },
    {
      title: 'User Impersonation',
      url: '/super-admin/impersonate',
      icon: UserCheck,
      description: 'Support user sessions'
    },
    {
      title: 'System Settings',
      url: '/super-admin/settings',
      icon: Settings,
      description: 'Global configuration'
    }
  ];

  const isActive = (url: string) => {
    if (url === '/super-admin') {
      return location.pathname === '/super-admin';
    }
    return location.pathname.startsWith(url);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-red-600" />
              <h1 className="text-xl font-bold">Super Admin Portal</h1>
            </div>
            <Badge variant="outline" className="text-red-600 border-red-600">
              Restricted Access
            </Badge>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-muted-foreground">super-admin@intelliflow.ai</p>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <LogOut className="w-4 h-4" />
              Exit Admin
            </Button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 border-r bg-card min-h-[calc(100vh-73px)]">
          <div className="p-4">
            <nav className="space-y-2">
              {navigationItems.map((item) => (
                <NavLink
                  key={item.url}
                  to={item.url}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors
                    ${isActive(item.url) 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }
                  `}
                >
                  <item.icon className="w-4 h-4" />
                  <div className="flex-1">
                    <div className="font-medium">{item.title}</div>
                    <div className="text-xs opacity-70">{item.description}</div>
                  </div>
                </NavLink>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default SuperAdminLayout;