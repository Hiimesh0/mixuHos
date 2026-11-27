import React, { useState, useEffect } from 'react';
import { Activity, Lock, Menu, X, CalendarCheck2 } from 'lucide-react';
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
    { label: 'Accounts & Reports', href: '#accounts' },
    { label: 'Workflow', href: '#workflow' },
    { label: 'Benefits', href: '#benefits' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.navContainer}`}>
        {/* Brand Logo */}
        <a href="#" className={styles.brand}>
          <div className={styles.logoIcon}>
            <Activity size={22} color="#14B8A6" />
          </div>
          <div className={styles.brandText}>
            <span className={styles.brandName}>MIXU INFOSYSTEM</span>
            <span className={styles.brandSub}>Hospital Intelligence &amp; EMR</span>
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
            <CalendarCheck2 size={16} />
            <span>Book a Demo</span>
          </button>
          <a
            href={`${HOSPITAL_APP_URL}#/login`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.launchBtn}
            title="Authorized staff and hospital personnel login"
          >
            <Lock size={14} />
            <span>Staff Login</span>
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

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className={styles.mobileNav}>
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
          <div className={styles.mobileNavActions}>
            <button
              type="button"
              className={styles.mobileScheduleBtn}
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDemo();
              }}
            >
              <CalendarCheck2 size={16} />
              <span>Book a Demo</span>
            </button>
            <a
              href={`${HOSPITAL_APP_URL}#/login`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mobileLaunchBtn}
            >
              <Lock size={15} />
              <span>Staff Login</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
