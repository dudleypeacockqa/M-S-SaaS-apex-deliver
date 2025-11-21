import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Package, 
  Factory, 
  CheckCircle, 
  DollarSign, 
  Calculator, 
  FileText, 
  Upload, 
  Settings,
  ChevronDown,
  ChevronRight,
  X,
  Menu
} from 'lucide-react';

interface NavSection {
  title: string;
  items: NavItem[];
}

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navSections: NavSection[] = [
  {
    title: 'OVERVIEW',
    items: [
      { label: 'Executive Dashboard', path: '/fpa', icon: LayoutDashboard },
    ],
  },
  {
    title: 'PLANNING & ANALYTICS',
    items: [
      { label: 'Demand Forecasting', path: '/fpa/demand-forecasting', icon: TrendingUp },
      { label: 'Inventory Management', path: '/fpa/inventory', icon: Package },
      { label: 'Production Tracking', path: '/fpa/production', icon: Factory },
      { label: 'Quality Control', path: '/fpa/quality', icon: CheckCircle },
    ],
  },
  {
    title: 'FINANCIAL MANAGEMENT',
    items: [
      { label: 'Working Capital', path: '/fpa/working-capital', icon: DollarSign },
      { label: 'What-If Analysis', path: '/fpa/what-if', icon: Calculator },
      { label: 'Financial Reports', path: '/fpa/reports', icon: FileText },
    ],
  },
  {
    title: 'OPERATIONS',
    items: [
      { label: 'Data Import', path: '/fpa/import', icon: Upload },
      { label: 'Admin Panel', path: '/fpa/admin', icon: Settings },
    ],
  },
];

export const SidebarNavigation: React.FC = () => {
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(navSections.map(section => section.title))
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleSection = (title: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(title)) {
        next.delete(title);
      } else {
        next.add(title);
      }
      return next;
    });
  };

  const isActive = (path: string) => {
    if (path === '/fpa') {
      return location.pathname === '/fpa';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-900 text-white rounded-md shadow-lg"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside className={`fixed left-0 top-0 h-full w-64 bg-slate-900 text-white flex flex-col z-40 transition-transform duration-300 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
      {/* Logo/Brand Section */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xs">FP&A</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">CapLiquify FP&A</h1>
              <p className="text-xs text-slate-400">Manufacturing Dashboard</p>
            </div>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden p-1 text-slate-400 hover:text-white transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        {navSections.map((section) => {
          const isExpanded = expandedSections.has(section.title);
          
          return (
            <div key={section.title} className="mb-6">
              <button
                onClick={() => toggleSection(section.title)}
                className="w-full px-6 py-2 flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider hover:text-slate-200 transition-colors"
              >
                <span>{section.title}</span>
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
              
              {isExpanded && (
                <div className="mt-2">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);
                    
                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`
                          flex items-center gap-3 px-6 py-2.5 text-sm font-medium transition-colors
                          ${active 
                            ? 'bg-blue-600 text-white border-r-2 border-blue-400' 
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                          }
                        `}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </NavLink>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer/User Info */}
      <div className="p-4 border-t border-slate-800 text-xs text-slate-400">
        <p className="text-slate-500">© 2025 CapLiquify</p>
      </div>
    </aside>
    </>
  );
};

