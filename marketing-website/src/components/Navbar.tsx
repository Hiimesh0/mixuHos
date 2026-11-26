import React, { useState, useEffect } from 'react';
import { Activity, ExternalLink, Menu, X, ShieldCheck } from 'lucide-react';
import styles from './Navbar.module.css';
import { HOSPITAL_APP_URL } from '../config';

interface NavbarProps {
  onOpenDemo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenDemo }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Overview', href: '#overview' },
    { label: 'Features', href: '#features' },
    { label: 'Modules', href: '#modules' },
    { label: 'Live Preview', href: '#preview' },
    { label: 'Benefits', href: '#benefits' },
    { label: 'Workflow', href: '#workflow' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.navContainer}`}>
        {/* Brand Logo */}
        <a href="#" className={styles.brand}>
          <div className={styles.logoIcon}>
            <Activity size={22} color="#0D9488" />
          </div>
          <div className={styles.brandText}>
            <span className={styles.brandName}>MIXU INFOSYSTEM</span>
            <span className={styles.brandSub}>Hospital Intelligence & EMR</span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className={styles.desktopNav}>
          {navLinks.map(link => (
            <a key={link.href} href={link.href} className={styles.navLink}>
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right CTA Actions */}
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.scheduleBtn}
            onClick={onOpenDemo}
          >
            Request Demo
          </button>
          <a
            href={HOSPITAL_APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.launchBtn}
          >
            <span>Launch Live App</span>
            <ExternalLink size={15} />
          </a>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className={styles.mobileToggle}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className={styles.mobileDrawer}>
          <nav className={styles.mobileNav}>
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                className={styles.mobileNavLink}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className={styles.mobileDrawerActions}>
              <button
                type="button"
                className={styles.mobileScheduleBtn}
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenDemo();
                }}
              >
                Request Custom Walkthrough
              </button>
              <a
                href={HOSPITAL_APP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.mobileLaunchBtn}
              >
                <span>Launch Live App</span>
                <ExternalLink size={16} />
              </a>
            </div>
            <div className={styles.badgeRow}>
              <ShieldCheck size={16} color="#10B981" />
              <span>NABH Aligned • Flat-JSON Persistence Engine</span>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
