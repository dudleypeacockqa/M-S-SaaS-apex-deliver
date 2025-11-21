
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/marketing/financeflo/ui/dropdown-menu";

interface SubLink {
  name: string;
  path: string;
  description?: string;
}

interface SolutionLink {
  name: string;
  path: string;
  description: string;
  subLinks: SubLink[];
}

interface SolutionsDropdownProps {
  title: string;
  links: SolutionLink[];
}

export const SolutionsDropdown = ({ title, links }: SolutionsDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const hoverTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setHoveredIndex(null);
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    }
  };

  const handleMouseEnter = (index: number) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    // Add a small delay before clearing hover to allow moving to submenu
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredIndex(null);
    }, 100);
  };

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
        <DropdownMenuTrigger asChild>
          <button
            className="flex items-center px-4 py-2 text-base font-medium text-brand-navy hover:text-brand-gold transition-all duration-300 focus:outline-none group relative"
          >
            {title}
            <ChevronDown className={`ml-2 h-4 w-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} group-hover:text-brand-gold`} />
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-gold to-brand-gold-light transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 w-72 p-2 z-50 overflow-visible"
          align="center"
          sideOffset={8}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <div className="space-y-1">
            {links.map((link, index) => (
              <div
                key={link.path}
                className="relative group/item"
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
              >
                <div
                  className="w-full px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-brand-gold/5 hover:to-brand-gold/10 transition-all duration-300 border border-transparent hover:border-brand-gold/20 flex items-center justify-between cursor-pointer"
                >
                  <div className="flex-1">
                    <div className="font-semibold text-brand-navy group-hover/item:text-brand-gold transition-colors">{link.name}</div>
                    <div className="text-xs text-gray-600 leading-relaxed group-hover/item:text-gray-700 transition-colors">
                      {link.description}
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400 group-hover/item:text-brand-gold transition-colors" />
                </div>

                {/* Submenu */}
                {hoveredIndex === index && link.subLinks && link.subLinks.length > 0 && (
                  <div
                    className="submenu-panel absolute left-full top-0 -ml-1 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 w-80 p-2 z-[100]"
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="space-y-1">
                      {link.subLinks.map((subLink) => (
                        <Link
                          key={subLink.path}
                          to={subLink.path}
                          className="block px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-brand-gold/5 hover:to-brand-gold/10 transition-all duration-300 group border border-transparent hover:border-brand-gold/20"
                          onClick={() => setIsOpen(false)}
                        >
                          <div className="font-medium text-brand-navy group-hover:text-brand-gold transition-colors">{subLink.name}</div>
                          {subLink.description && (
                            <div className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors mt-1">
                              {subLink.description}
                            </div>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
