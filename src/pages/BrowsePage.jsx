import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { storageService } from '../services/storageService';
import { CATEGORIES, LOCATIONS } from '../services/mockData';
import { ItemCard } from '../components/ItemCard';
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  Compass,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  Tag,
  MapPin,
  ArrowUpDown
} from 'lucide-react';

export const BrowsePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { refreshKey } = useApp();

  // Search & Filter state initialized from query params
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'all');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('cat') || 'All');
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get('loc') || 'All Locations');
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get('status') || 'active'); // Default active (unreturned)
  const [sortBy, setSortBy] = useState('newest');

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sync state when URL params change
  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null) setSearchQuery(q);
    const loc = searchParams.get('loc');
    if (loc !== null) setSelectedLocation(loc);
    const type = searchParams.get('type');
    if (type !== null) setSelectedType(type);
  }, [searchParams]);

  // Fetch items based on filters
  useEffect(() => {
    let isMounted = true;
    async function loadFilteredItems() {
      setLoading(true);
      try {
        const results = await storageService.getItems({
          type: selectedType,
          category: selectedCategory,
          location: selectedLocation,
          status: selectedStatus,
          searchQuery: searchQuery,
          sortBy: sortBy
        });
        if (isMounted) setItems(results);
      } catch (err) {
        console.error('Failed to load items:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadFilteredItems();
    return () => {
      isMounted = false;
    };
  }, [
    selectedType,
    selectedCategory,
    selectedLocation,
    selectedStatus,
    searchQuery,
    sortBy,
    refreshKey
  ]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedType('all');
    setSelectedCategory('All');
    setSelectedLocation('All Locations');
    setSelectedStatus('all');
    setSortBy('newest');
    setSearchParams({});
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedType !== 'all' ||
    selectedCategory !== 'All' ||
    selectedLocation !== 'All Locations' ||
    selectedStatus !== 'all';

  return (
    <div className="page-wrapper">
      <div className="container" style={{ paddingTop: '2.5rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            Browse Lost & Found Items
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
            Real-time feed of reported items across all hostel blocks, dining halls, and academic complexes.
          </p>
        </div>

        {/* Filter Controls Card */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '2rem'
          }}
        >
          {/* Top Row: Search & Type Toggle */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1rem',
              marginBottom: '1.25rem'
            }}
          >
            {/* Search Input */}
            <div style={{ position: 'relative' }}>
              <Search
                size={18}
                style={{
                  position: 'absolute',
                  left: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)'
                }}
              />
              <input
                type="text"
                placeholder="Search items, keywords, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-control"
                style={{ paddingLeft: '2.4rem' }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-muted)'
                  }}
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Type Filter Buttons */}
            <div
              style={{
                display: 'flex',
                backgroundColor: 'var(--bg-subtle)',
                padding: '0.3rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)'
              }}
            >
              <button
                type="button"
                onClick={() => setSelectedType('all')}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  backgroundColor: selectedType === 'all' ? 'var(--bg-surface)' : 'transparent',
                  color: selectedType === 'all' ? 'var(--text-main)' : 'var(--text-muted)',
                  boxShadow: selectedType === 'all' ? 'var(--shadow-sm)' : 'none'
                }}
              >
                All Items
              </button>
              <button
                type="button"
                onClick={() => setSelectedType('lost')}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  backgroundColor: selectedType === 'lost' ? 'var(--lost-bg)' : 'transparent',
                  color: selectedType === 'lost' ? 'var(--lost-color)' : 'var(--text-muted)',
                  boxShadow: selectedType === 'lost' ? 'var(--shadow-sm)' : 'none'
                }}
              >
                Lost Items
              </button>
              <button
                type="button"
                onClick={() => setSelectedType('found')}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  backgroundColor: selectedType === 'found' ? 'var(--found-bg)' : 'transparent',
                  color: selectedType === 'found' ? 'var(--found-color)' : 'var(--text-muted)',
                  boxShadow: selectedType === 'found' ? 'var(--shadow-sm)' : 'none'
                }}
              >
                Found Items
              </button>
            </div>
          </div>

          {/* Secondary Row: Category, Location, Status, Sort */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
              gap: '1rem',
              alignItems: 'center'
            }}
          >
            {/* Category Select */}
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                CATEGORY:
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="form-control"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Select */}
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                LOCATION / HOSTEL:
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="form-control"
              >
                {LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Select */}
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                STATUS:
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="form-control"
              >
                <option value="active">Active Only (Excludes Returned)</option>
                <option value="all">All Statuses (Including Returned)</option>
                <option value="open">Open / Unclaimed</option>
                <option value="claim_pending">Claim Pending</option>
                <option value="in_handover">In Handover Process</option>
                <option value="returned">Successfully Returned</option>
              </select>
            </div>

            {/* Sort Select */}
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                SORT BY:
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="form-control"
              >
                <option value="newest">Newest Reports First</option>
                <option value="oldest">Oldest Reports First</option>
              </select>
            </div>
          </div>

          {/* Active filter pills & Reset button */}
          {hasActiveFilters && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '1.25rem',
                paddingTop: '1rem',
                borderTop: '1px solid var(--border)',
                flexWrap: 'wrap',
                gap: '0.5rem'
              }}
            >
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Active filters applied
              </div>
              <button
                onClick={handleClearFilters}
                className="btn btn-outline btn-sm"
                style={{ fontSize: '0.775rem' }}
              >
                <X size={14} />
                Clear All Filters
              </button>
            </div>
          )}
        </div>

        {/* Results Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem',
            fontSize: '0.9rem',
            color: 'var(--text-muted)'
          }}
        >
          <div>
            Showing <strong style={{ color: 'var(--text-main)' }}>{items.length}</strong> {items.length === 1 ? 'item' : 'items'}
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/report-lost" className="btn btn-lost btn-sm">
              + Report Lost
            </Link>
            <Link to="/report-found" className="btn btn-found btn-sm">
              + Report Found
            </Link>
          </div>
        </div>

        {/* Items Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
            Loading items...
          </div>
        ) : items.length === 0 ? (
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '4rem 2rem',
              textAlign: 'center',
              maxWidth: '600px',
              margin: '2rem auto'
            }}
          >
            <Compass size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 1.25rem' }} />
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              No matching hostel items found
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              Try adjusting your search terms or clearing your location/category filters. If your item isn't listed yet, file a report so your fellow hostelers can assist!
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              {hasActiveFilters && (
                <button onClick={handleClearFilters} className="btn btn-outline">
                  Reset All Filters
                </button>
              )}
              <Link to="/report-lost" className="btn btn-lost">
                Report a Lost Item
              </Link>
            </div>
          </div>
        ) : (
          <div className="items-grid">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
