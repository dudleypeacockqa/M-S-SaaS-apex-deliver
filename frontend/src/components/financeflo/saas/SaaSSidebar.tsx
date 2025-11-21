import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard,
  Bot,
  Network,
  Workflow,
  BarChart3,
  Settings,
  Users,
  Building2,
  Zap,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTenant } from '@/contexts/TenantContext';
import { useAuth } from '@/contexts/AuthContext';

const SaaSSidebar = () => {
  const location = useLocation();
  const { currentTenant } = useTenant();
  const { userProfile } = useAuth();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/app/dashboard',
      icon: LayoutDashboard,
      description: 'Overview & Analytics'
    },
    {
      name: 'AI Agents',
      href: '/app/agents',
      icon: Bot,
      description: 'Intelligent Automation'
    },
    {
      name: 'Integrations',
      href: '/app/integrations',
      icon: Network,
      description: 'System Connections'
    },
    {
      name: 'Workflows',
      href: '/app/workflows',
      icon: Workflow,
      description: 'Automated Processes'
    },
    {
      name: 'Analytics',
      href: '/app/analytics',
      icon: BarChart3,
      description: 'Performance Insights'
    },
    {
      name: 'Team',
      href: '/app/team',
      icon: Users,
      description: 'Member Management'
    },
    {
      name: 'Settings',
      href: '/app/settings',
      icon: Settings,
      description: 'Configuration'
    }
  ];

  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-gray-200">
      {/* Header */}
      <div className="flex h-16 items-center px-6 border-b border-gray-200">
        <Link to="/app/dashboard" className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">IntelliFlow</span>
        </Link>
      </div>

      {/* Tenant Selector */}
      {currentTenant && (
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <Building2 className="h-4 w-4 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{currentTenant.name}</p>
                <p className="text-xs text-gray-500 capitalize">{currentTenant.subscription_tier}</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-6 py-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                active
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className={`mr-3 h-5 w-5 ${active ? 'text-blue-700' : 'text-gray-400'}`} />
              <div className="flex-1">
                <div className="font-medium">{item.name}</div>
                <div className={`text-xs ${active ? 'text-blue-600' : 'text-gray-500'}`}>
                  {item.description}
                </div>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User Info */}
      <div className="p-6 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
            {userProfile?.first_name?.[0] || userProfile?.email?.[0] || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {userProfile?.first_name && userProfile?.last_name 
                ? `${userProfile.first_name} ${userProfile.last_name}`
                : userProfile?.email
              }
            </p>
            <p className="text-xs text-gray-500">IntelliFlow User</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaaSSidebar;