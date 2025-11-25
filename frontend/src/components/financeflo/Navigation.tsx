
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, ArrowRight } from "lucide-react";

import { NavigationDropdown } from "./navigation/NavigationDropdown";
import { SolutionsDropdown } from "./navigation/SolutionsDropdown";
import { NavigationActions } from "./navigation/NavigationActions";
import { MobileNavigationSection } from "./navigation/MobileNavigationSection";
import { industryLinks, erpLinks, implementationLinks, resourceLinks, vslLinks, getStartedLinks, leverageFloLinks, aiEnhancementLinks, ipaasLinks, solutionsLinks, maSolutionsLinks } from "./navigation/navigationData";
import { FinanceFloLogo } from "./brand/FinanceFloLogo";
import "../styles/brand.css";

export const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDesktopMenu, setActiveDesktopMenu] = useState<string | null>(null);
  const location = useLocation();
  const navRef = useRef<HTMLElement | null>(null);

  const isActive = (path: string) => location.pathname === path;

  const handleOpenMenu = useCallback((key: string) => {
    setActiveDesktopMenu(key);
  }, []);

  const handleCloseMenu = useCallback((key?: string) => {
    setActiveDesktopMenu((current) => {
      if (!current) return null;
      if (!key || current === key) {
        return null;
      }
      return current;
    });
  }, []);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDesktopMenu(null);
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      setActiveDesktopMenu(null);
    }
  }, [mobileMenuOpen]);

  return (
    <nav ref={navRef} className="glass-morphism sticky top-0 z-50 w-full border-b border-white/10 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20 lg:h-24">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <FinanceFloLogo variant="full" size="md" background="light" className="sm:hidden" />
              <FinanceFloLogo variant="full" size="lg" background="light" className="hidden sm:block lg:hidden" />
              <FinanceFloLogo variant="full" size="xl" background="light" className="hidden lg:block" />
            </Link>
          </div>
          
          <div className="hidden lg:block">
            <div className="ml-10 flex items-center space-x-6">
              <NavigationDropdown
                title="Industries"
                links={industryLinks}
                useColumns={true}
                isOpen={activeDesktopMenu === "industries"}
                onOpen={() => handleOpenMenu("industries")}
                onClose={() => handleCloseMenu("industries")}
              />

              <SolutionsDropdown
                title="Solutions"
                links={solutionsLinks}
                isOpen={activeDesktopMenu === "solutions"}
                onOpen={() => handleOpenMenu("solutions")}
                onClose={() => handleCloseMenu("solutions")}
              />

              <NavigationDropdown
                title="Resources"
                links={resourceLinks}
                isOpen={activeDesktopMenu === "resources"}
                onOpen={() => handleOpenMenu("resources")}
                onClose={() => handleCloseMenu("resources")}
              />

              <Link
                to="/pricing"
                className={`text-base font-medium text-foreground hover:text-primary transition-all duration-300 hover:scale-105 px-4 py-2 ${
                  isActive('/pricing') ? 'text-primary border-b-2 border-primary' : ''
                }`}
              >
                Pricing
              </Link>
            </div>
          </div>

          <div className="hidden lg:block">
            <NavigationActions />
          </div>
          
          <div className="lg:hidden">
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="nav-link p-2"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden dropdown-content border-t shadow-lg rounded-b-xl overflow-hidden max-h-[80vh] overflow-y-auto">
          <div className="px-2 pt-2 pb-3 space-y-1 divide-y divide-border">
            <MobileNavigationSection
              title="Industries"
              links={industryLinks.slice(0, 6)}
              onLinkClick={() => setMobileMenuOpen(false)}
            />

            {/* Solutions - Grouped */}
            <div className="py-2">
              <div className="px-3 py-2 text-sm font-semibold text-brand-navy">Solutions</div>
              <MobileNavigationSection
                title="M&A & Finance Solutions"
                links={maSolutionsLinks}
                onLinkClick={() => setMobileMenuOpen(false)}
              />
              <MobileNavigationSection
                title="ERP Solutions"
                links={erpLinks}
                onLinkClick={() => setMobileMenuOpen(false)}
              />
              <MobileNavigationSection
                title="AI Enhancement"
                links={aiEnhancementLinks}
                onLinkClick={() => setMobileMenuOpen(false)}
              />
              <MobileNavigationSection
                title="Implementation"
                links={implementationLinks}
                onLinkClick={() => setMobileMenuOpen(false)}
              />
              <MobileNavigationSection
                title="iPaaS & Integration"
                links={ipaasLinks}
                onLinkClick={() => setMobileMenuOpen(false)}
              />
              <MobileNavigationSection
                title="LeverageFlo.ai"
                links={leverageFloLinks.slice(0, 4)}
                onLinkClick={() => setMobileMenuOpen(false)}
              />
            </div>

            <MobileNavigationSection
              title="Resources"
              links={resourceLinks}
              onLinkClick={() => setMobileMenuOpen(false)}
            />
            
            <div className="py-4 space-y-2">
              <Link
                to="/pricing"
                className="block px-3 py-2 text-base font-medium text-foreground hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </Link>
            </div>
            
            <div className="pt-4 pb-2 px-3 space-y-2">
              <Button 
                variant="brand-secondary" 
                className="w-full"
                onClick={() => {
                  window.location.href = "/demo";
                  setMobileMenuOpen(false);
                }}
              >
                View Demos
              </Button>
              <Button 
                variant="brand-cta"
                className="w-full"
                onClick={() => {
                  window.location.href = "/contact";
                  setMobileMenuOpen(false);
                }}
              >
                Book Consultation
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
