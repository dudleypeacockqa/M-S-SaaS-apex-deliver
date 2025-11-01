import { Button } from "@/components/ui/Button";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export default function MarketingNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Features", href: "/features" },
    { name: "Pricing", href: "/pricing" },
    { name: "Security", href: "/security" },
    { name: "About", href: "/about" },
    { name: "Team", href: "/team" },
    { name: "Podcast", href: "/podcast" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50">
      <nav className="container mx-auto flex items-center justify-between py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <img src={APP_LOGO} alt={APP_TITLE} className="h-10 w-auto" />
          <span className="text-xl font-bold text-primary">{APP_TITLE}</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="hidden lg:flex items-center gap-4">
          <Button variant="ghost" asChild>
            <a href={getLoginUrl()}>Sign In</a>
          </Button>
          <Button asChild>
            <a href={getLoginUrl()}>Start Free Trial</a>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-white">
          <div className="container py-4 flex flex-col gap-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-base font-medium text-foreground hover:text-primary transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="flex flex-col gap-3 pt-4 border-t border-border">
              <Button variant="ghost" asChild className="w-full">
                <a href={getLoginUrl()}>Sign In</a>
              </Button>
              <Button asChild className="w-full">
                <a href={getLoginUrl()}>Start Free Trial</a>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
