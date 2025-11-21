import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BarChart3, 
  Workflow, 
  Zap, 
  Users, 
  Settings, 
  Building,
  Bot,
  Target,
  Database
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from '@/components/ui/sidebar';
import { useTenant } from '@/contexts/TenantContext';
import { useAuth } from '@/contexts/AuthContext';

const navigationItems = [
  {
    title: 'Overview',
    url: '/app/dashboard',
    icon: LayoutDashboard,
    description: 'Dashboard overview'
  },
  {
    title: 'Analytics',
    url: '/app/analytics',
    icon: BarChart3,
    description: 'Performance metrics'
  },
  {
    title: 'AI Agents',
    url: '/app/agents',
    icon: Bot,
    description: 'Manage AI agents'
  },
  {
    title: 'Workflows',
    url: '/app/workflows',
    icon: Workflow,
    description: 'Automation workflows'
  },
  {
    title: 'Integrations',
    url: '/app/integrations',
    icon: Zap,
    description: 'System integrations'
  },
  {
    title: 'Data Sources',
    url: '/app/data',
    icon: Database,
    description: 'Data connections'
  },
];

const managementItems = [
  {
    title: 'Team',
    url: '/app/team',
    icon: Users,
    description: 'Team management'
  },
  {
    title: 'Goals',
    url: '/app/goals',
    icon: Target,
    description: 'Performance goals'
  },
  {
    title: 'Settings',
    url: '/app/settings',
    icon: Settings,
    description: 'Organization settings'
  }
];

export const DashboardSidebar = () => {
  const { state } = useSidebar();
  const location = useLocation();
  const { currentTenant } = useTenant();
  const { userProfile } = useAuth();
  const currentPath = location.pathname;
  const collapsed = state === 'collapsed';

  const isActive = (url: string) => {
    if (url === '/app/dashboard') {
      return currentPath === url;
    }
    return currentPath.startsWith(url);
  };

  const getNavClass = (url: string) => {
    return isActive(url) 
      ? "bg-primary/10 text-primary border-r-2 border-primary font-medium" 
      : "hover:bg-muted/50 text-muted-foreground hover:text-foreground";
  };

  return (
    <Sidebar className={`border-r border-border ${collapsed ? "w-16" : "w-64"}`} collapsible="icon">
      <SidebarHeader className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
            <Building className="h-4 w-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-sm truncate">
                {currentTenant?.name || 'IntelliFlow'}
              </h2>
              <p className="text-xs text-muted-foreground truncate">
                {currentTenant?.subscription_tier || 'Starter'}
              </p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            Main Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${getNavClass(item.url)}`}
                      title={collapsed ? item.title : undefined}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && (
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{item.title}</div>
                          <div className="text-xs text-muted-foreground truncate">
                            {item.description}
                          </div>
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {managementItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${getNavClass(item.url)}`}
                      title={collapsed ? item.title : undefined}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && (
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{item.title}</div>
                          <div className="text-xs text-muted-foreground truncate">
                            {item.description}
                          </div>
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};