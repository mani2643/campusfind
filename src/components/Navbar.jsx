import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Compass,
  Search,
  PlusCircle,
  HelpCircle,
  User,
  Sun,
  Moon,
  RotateCcw,
  Database,
  Menu,
  X,
  ShieldCheck,
  Check,
  ChevronDown,
  Layers
} from 'lucide-react';

export const Navbar = () => {
  const {
    currentUser,
    switchUser,
    personas,
    theme,
    toggleTheme,
    storageInfo,
    resetDemoData
  } = useApp();

  const [personaOpen, setPersonaOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const personaRef = useRef(null);
  const navigate = useNavigate();

  // Close persona dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (personaRef.current && !personaRef.current.contains(event.target)) {
        setPersonaOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {/* Top Storage Mode Notice */}
      <div className="storage-banner">
        <div className="container storage-banner-content" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span className={`storage-banner-badge ${storageInfo.isCloud ? 'cloud' : ''}`}>
              <Database size={11} style={{ marginRight: '3px', verticalAlign: 'middle' }} />
              {storageInfo.label}
            </span>
            <span style={{ fontSize: '0.775rem', opacity: 0.9 }}>
              {storageInfo.note}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={resetDemoData}
              className="btn btn-outline btn-sm"
              style={{
                padding: '0.15rem 0.6rem',
                fontSize: '0.725rem',
                height: 'auto',
                backgroundColor: 'rgba(255,255,255,0.1)',
                color: '#fff',
                borderColor: 'rgba(255,255,255,0.2)'
              }}
              title="Reset sample hostel records for demonstration"
            >
              <RotateCcw size={11} />
              Reset Demo Records
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="navbar">
        <div className="container navbar-container">
          <Link to="/" className="nav-brand">
            <div className="brand-icon-box">
              <Compass size={22} />
            </div>
            <div>
              <span style={{ fontWeight: 800 }}>CampusFind</span>
              <span className="nav-tagline">Hostel Lost & Found</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <ul className="nav-links">
            <li>
              <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/browse" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <Search size={15} />
                Browse Items
              </NavLink>
            </li>
            <li>
              <NavLink to="/report-lost" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Lost Item
              </NavLink>
            </li>
            <li>
              <NavLink to="/report-found" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Found Item
              </NavLink>
            </li>
            <li>
              <NavLink to="/my-activity" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <Layers size={15} />
                My Activity
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                About
              </NavLink>
            </li>
          </ul>

          {/* Action Tools */}
          <div className="nav-actions">
            {/* Persona Switcher for Demonstrating Multi-User Workflows */}
            <div style={{ position: 'relative' }} ref={personaRef}>
              <button
                className="persona-selector"
                onClick={() => setPersonaOpen(!personaOpen)}
                title="Switch student persona to test two-party claim & handover"
              >
                <img src={currentUser.avatar} alt={currentUser.name} className="persona-avatar" />
                <div style={{ textAlign: 'left', lineHeight: 1.1 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.8rem' }}>{currentUser.name.split(' ')[0]}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{currentUser.hostel.split(' ')[1] || currentUser.hostel}</div>
                </div>
                <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
              </button>

              {personaOpen && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 'calc(100% + 8px)',
                    width: '270px',
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-xl)',
                    padding: '0.5rem',
                    zIndex: 60
                  }}
                >
                  <div
                    style={{
                      padding: '0.5rem 0.75rem',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: 'var(--text-muted)',
                      borderBottom: '1px solid var(--border)',
                      marginBottom: '0.35rem'
                    }}
                  >
                    SELECT DEMO PERSON:
                  </div>

                  {personas.map((p) => {
                    const isSelected = p.id === currentUser.id;
                    return (
                      <div
                        key={p.id}
                        onClick={() => {
                          switchUser(p);
                          setPersonaOpen(false);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.65rem',
                          padding: '0.6rem 0.75rem',
                          borderRadius: 'var(--radius-sm)',
                          cursor: 'pointer',
                          backgroundColor: isSelected ? 'var(--primary-subtle)' : 'transparent',
                          transition: 'background-color 0.15s ease'
                        }}
                      >
                        <img
                          src={p.avatar}
                          alt={p.name}
                          style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
                            {p.name}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            {p.hostel} • {p.room}
                          </div>
                        </div>
                        {isSelected && <Check size={16} style={{ color: 'var(--primary)' }} />}
                      </div>
                    );
                  })}

                  <div
                    style={{
                      marginTop: '0.5rem',
                      padding: '0.5rem 0.75rem',
                      backgroundColor: 'var(--bg-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.72rem',
                      color: 'var(--text-muted)'
                    }}
                  >
                    Tip: Switch persons to submit a claim as one student and approve it as another!
                  </div>
                </div>
              )}
            </div>

            {/* Dark/Light mode toggle */}
            <button
              onClick={toggleTheme}
              className="icon-btn"
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} mode`}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              className="icon-btn mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-surface)',
              borderTop: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}
          >
            <NavLink
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              Home
            </NavLink>
            <NavLink
              to="/browse"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              Browse Items
            </NavLink>
            <NavLink
              to="/report-lost"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              Report Lost Item
            </NavLink>
            <NavLink
              to="/report-found"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              Report Found Item
            </NavLink>
            <NavLink
              to="/my-activity"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              My Activity
            </NavLink>
            <NavLink
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              About Project
            </NavLink>
          </div>
        )}
      </nav>
    </>
  );
};
