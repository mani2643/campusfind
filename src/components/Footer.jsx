import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ShieldCheck, Heart, MapPin, ExternalLink, Sparkles } from 'lucide-react';

export const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderTop: '1px solid var(--border)',
        paddingTop: '3.5rem',
        paddingBottom: '2rem',
        marginTop: 'auto'
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '2.5rem',
            marginBottom: '3rem'
          }}
        >
          {/* Brand Col */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.85rem' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--primary)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Compass size={18} />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>CampusFind</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1rem' }}>
              Lost on Campus. Found with CampusFind. A modern, student-centric lost and found platform built for college hostels with privacy-first verification and verifiable handovers.
            </p>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--primary)',
                backgroundColor: 'var(--primary-subtle)',
                padding: '0.3rem 0.65rem',
                borderRadius: 'var(--radius-full)'
              }}
            >
              <Sparkles size={12} />
              Design Thinking College Project
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem' }}>
              Navigation
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem' }}>
              <li>
                <Link to="/" style={{ color: 'var(--text-muted)' }}>Home Dashboard</Link>
              </li>
              <li>
                <Link to="/browse" style={{ color: 'var(--text-muted)' }}>Browse All Items</Link>
              </li>
              <li>
                <Link to="/report-lost" style={{ color: 'var(--text-muted)' }}>Report a Lost Item</Link>
              </li>
              <li>
                <Link to="/report-found" style={{ color: 'var(--text-muted)' }}>Report a Found Item</Link>
              </li>
              <li>
                <Link to="/my-activity" style={{ color: 'var(--text-muted)' }}>My Activity & Claims</Link>
              </li>
              <li>
                <Link to="/about" style={{ color: 'var(--text-muted)' }}>Project & Methodology</Link>
              </li>
            </ul>
          </div>

          {/* Hostel Safety & Ethics */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem' }}>
              Hostel Best Practices
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <li style={{ display: 'flex', gap: '0.5rem' }}>
                <ShieldCheck size={16} style={{ color: 'var(--success-color)', flexShrink: 0, marginTop: '2px' }} />
                <span>Never share private room keys or bank cards with unverified claimants.</span>
              </li>
              <li style={{ display: 'flex', gap: '0.5rem' }}>
                <ShieldCheck size={16} style={{ color: 'var(--success-color)', flexShrink: 0, marginTop: '2px' }} />
                <span>Conduct physical handovers in well-lit areas like the caretaker desk or mess hall.</span>
              </li>
              <li style={{ display: 'flex', gap: '0.5rem' }}>
                <ShieldCheck size={16} style={{ color: 'var(--success-color)', flexShrink: 0, marginTop: '2px' }} />
                <span>Always generate and confirm the digital Handover Receipt to close reports.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom credits */}
        <div
          style={{
            borderTop: '1px solid var(--border)',
            paddingTop: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.8rem',
            color: 'var(--text-muted)'
          }}
        >
          <div>
            © 2026 CampusFind. Built for Student Hostel Living.
          </div>
          <div>
            React • Vite • Responsive CSS • Dual-Engine Storage Architecture
          </div>
        </div>
      </div>
    </footer>
  );
};
