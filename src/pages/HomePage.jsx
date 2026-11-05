import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { storageService } from '../services/storageService';
import { ItemCard } from '../components/ItemCard';
import {
  Search,
  AlertCircle,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  MapPin,
  Lock,
  FileCheck2,
  CheckCircle2,
  Users,
  Compass
} from 'lucide-react';

export const HomePage = () => {
  const { stats, refreshKey } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [recentItems, setRecentItems] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'lost' | 'found'
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    async function loadRecent() {
      setLoading(true);
      try {
        const items = await storageService.getItems({
          type: activeTab,
          sortBy: 'newest'
        });
        if (isMounted) {
          setRecentItems(items.slice(0, 6));
        }
      } catch (err) {
        console.error('Failed to load recent items:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadRecent();
    return () => {
      isMounted = false;
    };
  }, [activeTab, refreshKey]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/browse');
    }
  };

  const handleQuickLocation = (loc) => {
    navigate(`/browse?loc=${encodeURIComponent(loc)}`);
  };

  return (
    <div className="page-wrapper">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-tag">
            <Sparkles size={14} />
            <span>Campus Lost & Found Ecosystem</span>
          </div>

          <h1 className="hero-title">
            Lost something? <span className="hero-highlight">Let's find it.</span>
          </h1>

          <p className="hero-subtitle">
            Lost on Campus. Found with CampusFind. A modern, student-centric platform built for college hostels to report lost belongings, verify ownership with private clues, and record safe handovers.
          </p>

          {/* Quick Action Buttons */}
          <div className="hero-actions">
            <Link to="/report-lost" className="btn btn-lost btn-lg">
              <AlertCircle size={18} />
              <span>Report Lost Item</span>
            </Link>
            <Link to="/report-found" className="btn btn-found btn-lg">
              <ShieldCheck size={18} />
              <span>Report Found Item</span>
            </Link>
            <Link to="/browse" className="btn btn-outline btn-lg">
              <Search size={18} />
              <span>Browse All Listings</span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="search-hero-box">
            <form onSubmit={handleSearchSubmit} className="search-input-wrapper">
              <Search size={20} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Search by item name, category, or location (e.g., 'ID card', 'keys', 'library')..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="btn btn-primary btn-sm">
                Search
              </button>
            </form>
          </div>

          {/* Real-time Stored Statistics */}
          <div className="stats-banner">
            <div className="stat-item">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Total Items Logged</div>
            </div>
            <div className="stat-item">
              <div className="stat-value" style={{ color: 'var(--success-color)' }}>
                {stats.returned}
              </div>
              <div className="stat-label">
                Successfully Returned ({stats.returnRate}%)
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-value" style={{ color: 'var(--lost-color)' }}>
                {stats.active}
              </div>
              <div className="stat-label">Active Open Listings</div>
            </div>
            <div className="stat-item">
              <div className="stat-value" style={{ color: 'var(--pending-color)' }}>
                {stats.pendingClaims}
              </div>
              <div className="stat-label">Claims Awaiting Decision</div>
            </div>
          </div>
        </div>
      </section>

      {/* How CampusFind Works - Design Thinking 4 Steps */}
      <section style={{ backgroundColor: 'var(--bg-surface)', padding: '4rem 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 3rem' }}>
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                color: 'var(--primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em'
              }}
            >
              Design Thinking Workflow
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.35rem' }}>
              How CampusFind Works
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
              Designed around student safety, anti-impostor verification, and closing the return loop.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1.75rem'
            }}
          >
            {/* Step 1 */}
            <div
              style={{
                backgroundColor: 'var(--bg-app)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.75rem',
                position: 'relative'
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--primary-subtle)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem'
                }}
              >
                <Search size={22} />
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.25rem' }}>
                STEP 01
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                Report with Photos
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Categorize your lost or found item with exact hostel block, mess, or library locations and photo uploads.
              </p>
            </div>

            {/* Step 2 */}
            <div
              style={{
                backgroundColor: 'var(--bg-app)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.75rem',
                position: 'relative'
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--found-bg)',
                  color: 'var(--found-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem'
                }}
              >
                <Lock size={22} />
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--found-color)', marginBottom: '0.25rem' }}>
                STEP 02
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                Smart Privacy Shield
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Finders can mask sensitive identifying details (wallet contents, student ID numbers, key engravings) from public view.
              </p>
            </div>

            {/* Step 3 */}
            <div
              style={{
                backgroundColor: 'var(--bg-app)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.75rem',
                position: 'relative'
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--pending-bg)',
                  color: 'var(--pending-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem'
                }}
              >
                <ShieldCheck size={22} />
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--pending-color)', marginBottom: '0.25rem' }}>
                STEP 03
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                Private Clue Verification
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                A claimant must submit private ownership clues. The holder reviews and approves the claim before any handover.
              </p>
            </div>

            {/* Step 4 */}
            <div
              style={{
                backgroundColor: 'var(--bg-app)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.75rem',
                position: 'relative'
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--success-bg)',
                  color: 'var(--success-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem'
                }}
              >
                <FileCheck2 size={22} />
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--success-color)', marginBottom: '0.25rem' }}>
                STEP 04
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                Dual Handover Receipt
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Both parties confirm the return, generating a digital, printable Handover Receipt with a permanent audit reference.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Location Shortcuts */}
      <section style={{ padding: '2.5rem 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={18} style={{ color: 'var(--primary)' }} />
              <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                Filter by Popular Hostel Spots:
              </span>
            </div>
            <Link to="/browse" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)' }}>
              View all locations →
            </Link>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {[
              'Central Mess / Dining Hall',
              'Central Library',
              'Hostel Block A',
              'Hostel Block B',
              'Hostel Block C',
              'Badminton / Sports Complex',
              'Common Room'
            ].map((loc) => (
              <button
                key={loc}
                onClick={() => handleQuickLocation(loc)}
                className="btn btn-outline btn-sm"
                style={{ borderRadius: 'var(--radius-full)', fontSize: '0.8rem' }}
              >
                {loc}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Recently Reported Items */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '2rem',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>
                Recently Reported Items
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                Latest items reported lost or found across hostel blocks
              </p>
            </div>

            {/* Filter Tabs */}
            <div
              style={{
                display: 'flex',
                backgroundColor: 'var(--bg-subtle)',
                padding: '0.25rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)'
              }}
            >
              <button
                onClick={() => setActiveTab('all')}
                style={{
                  padding: '0.4rem 0.85rem',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  backgroundColor: activeTab === 'all' ? 'var(--bg-surface)' : 'transparent',
                  color: activeTab === 'all' ? 'var(--text-main)' : 'var(--text-muted)',
                  boxShadow: activeTab === 'all' ? 'var(--shadow-sm)' : 'none'
                }}
              >
                All Items
              </button>
              <button
                onClick={() => setActiveTab('lost')}
                style={{
                  padding: '0.4rem 0.85rem',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  backgroundColor: activeTab === 'lost' ? 'var(--lost-bg)' : 'transparent',
                  color: activeTab === 'lost' ? 'var(--lost-color)' : 'var(--text-muted)',
                  boxShadow: activeTab === 'lost' ? 'var(--shadow-sm)' : 'none'
                }}
              >
                Lost Only
              </button>
              <button
                onClick={() => setActiveTab('found')}
                style={{
                  padding: '0.4rem 0.85rem',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  backgroundColor: activeTab === 'found' ? 'var(--found-bg)' : 'transparent',
                  color: activeTab === 'found' ? 'var(--found-color)' : 'var(--text-muted)',
                  boxShadow: activeTab === 'found' ? 'var(--shadow-sm)' : 'none'
                }}
              >
                Found Only
              </button>
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
              Loading recent hostel items...
            </div>
          ) : recentItems.length === 0 ? (
            <div
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '3rem',
                textAlign: 'center'
              }}
            >
              <Compass size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>No items found in this filter</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Be the first to report a lost or found item!
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                <Link to="/report-lost" className="btn btn-lost btn-sm">Report Lost</Link>
                <Link to="/report-found" className="btn btn-found btn-sm">Report Found</Link>
              </div>
            </div>
          ) : (
            <div className="items-grid">
              {recentItems.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link to="/browse" className="btn btn-outline btn-lg">
              <span>View All Hostel Items</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
