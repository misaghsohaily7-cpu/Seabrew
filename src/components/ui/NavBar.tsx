import React, { useState, useEffect } from 'react';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { siteContent } from '../../content';
import { BrandButton } from './Button';
import { SeaBrewLogo } from './SeaBrewLogo';
import { ThemeToggle } from './ThemeToggle';

export const NavBar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleLinkClick = (id: string) => {
    setMobileMenuOpen(false);
    const smoother = ScrollSmoother.get();
    const element = document.getElementById(id);
    if (smoother && element) {
      smoother.scrollTo(element, true, 'top top');
    } else if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const smoother = ScrollSmoother.get();
    if (smoother) {
      smoother.scrollTo(0, true);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-[var(--color-cream)] transition-shadow duration-300 ${
        scrolled ? 'border-b border-[var(--color-gold)]/20 shadow-sm' : ''
      }`}
      aria-label="ناوبری اصلی وبسایت"
    >
      <div className="max-w-[1440px] mx-auto px-[6vw] h-20 md:h-24 flex items-center justify-between">
        {/* Official Brand Logo */}
        <a
          href="#hero"
          onClick={handleLogoClick}
          className="group flex items-center select-none text-[var(--color-ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-ink)] rounded-full p-1"
          aria-label="SEA BREW — صفحه اصلی"
        >
          <SeaBrewLogo variant="horizontal" size="sm" />
        </a>

        {/* Desktop Anchor Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-10" aria-label="بخش‌های صفحه">
          {siteContent.navigation.links.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick(link.id);
              }}
              className="relative py-2 text-sm font-bold text-[var(--color-ink)] opacity-80 hover:opacity-100 hover:text-[var(--color-maroon)] transition-all duration-250 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-ink)] rounded-full px-2"
            >
              {link.label}
              <span className="absolute bottom-0 inset-x-2 h-[1.5px] bg-[var(--color-gold)] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
            </a>
          ))}
        </nav>

        {/* Theme toggle + Desktop CTA BrandButton */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          <BrandButton
            variant="primary"
            asAnchor
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('contact');
            }}
          >
            {siteContent.navigation.cta}
          </BrandButton>
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? 'بستن منوی ناوبری' : 'باز کردن منوی ناوبری'}
          className="md:hidden relative z-[60] w-12 h-12 flex flex-col items-center justify-center gap-1.5 rounded-full bg-[var(--color-ink)] text-[var(--color-cream)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-ink)]"
        >
          <span
            className={`w-5 h-[2px] bg-[var(--color-cream)] transition-transform duration-300 ${
              mobileMenuOpen ? 'rotate-45 translate-y-[5px]' : ''
            }`}
          />
          <span
            className={`w-5 h-[2px] bg-[var(--color-cream)] transition-opacity duration-300 ${
              mobileMenuOpen ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <span
            className={`w-5 h-[2px] bg-[var(--color-cream)] transition-transform duration-300 ${
              mobileMenuOpen ? '-rotate-45 -translate-y-[5px]' : ''
            }`}
          />
        </button>

        {/* Mobile Fullscreen Cream Overlay with Circular Clip-Path Reveal */}
        <div
          className={`md:hidden fixed inset-0 z-50 bg-[var(--color-cream)] flex flex-col justify-between p-8 transition-all duration-500`}
          style={{
            clipPath: mobileMenuOpen
              ? 'circle(150% at calc(100% - 40px) 40px)'
              : 'circle(0% at calc(100% - 40px) 40px)',
            transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
            pointerEvents: mobileMenuOpen ? 'auto' : 'none',
          }}
          aria-hidden={!mobileMenuOpen}
        >
          {/* Header spacer */}
          <div className="h-16 flex items-center justify-start">
            <span className="font-black text-2xl text-[var(--color-ink)]">
              {siteContent.brand.name}
            </span>
          </div>

          {/* Large Mobile Links */}
          <div className="flex flex-col gap-6 my-auto">
            {siteContent.navigation.links.map((link, idx) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link.id);
                }}
                className="text-3xl font-black text-[var(--color-ink)] hover:text-[var(--color-maroon)] transition-colors py-2 flex items-center justify-between border-b border-[var(--color-gold)]/20"
                style={{
                  transitionDelay: `${idx * 50}ms`,
                }}
              >
                <span>{link.label}</span>
                <span className="text-sm font-normal text-[var(--color-maroon)]">۰{idx + 1}</span>
              </a>
            ))}
          </div>

          {/* Theme toggle row */}
          <div className="w-full flex items-center justify-between px-1 pb-4">
            <span className="text-sm font-bold text-[var(--color-maroon)]">
              حالت روز / شب
            </span>
            <ThemeToggle />
          </div>

          {/* Mobile CTA */}
          <div className="w-full pt-4">
            <BrandButton
              variant="primary"
              className="w-full"
              asAnchor
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick('contact');
              }}
            >
              {siteContent.navigation.cta}
            </BrandButton>
            <p className="text-center text-xs text-[var(--color-maroon)] mt-4">
              {siteContent.brand.subtitle}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
