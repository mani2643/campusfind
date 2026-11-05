import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { storageService } from '../services/storageService';
import { CATEGORIES, LOCATIONS } from '../services/mockData';
import {
  ShieldCheck,
  Camera,
  MapPin,
  Calendar,
  Lock,
  Building,
  UserCheck,
  Info,
  Sparkles
} from 'lucide-react';

export const ReportFoundPage = () => {
  const { currentUser, showToast, triggerRefresh } = useApp();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    category: 'Keys',
    location: 'Central Mess / Dining Hall',
    specificSpot: '',
    dateEvent: new Date().toISOString().split('T')[0],
    description: '',
    custody: 'with_finder', // 'with_finder' | 'with_admin'
    adminOfficeLocation: 'Hostel Block B Caretaker Office',
    hasHiddenClue: true,
    hiddenClueDescription: '',
    contactPref: 'in_app'
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Quick preset sample photos for rapid college testing
  const samplePhotoPresets = [
    { label: 'Room Key', url: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=600&q=80' },
    { label: 'ID Card', url: 'https://images.unsplash.com/photo-1589330694653-dad6bc0140fa?auto=format&fit=crop&w=600&q=80' },
    { label: 'Scientific Calculator', url: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=600&q=80' },
    { label: 'Leather Wallet', url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, image: 'Image size exceeds 4MB limit.' }));
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setErrors((prev) => ({ ...prev, image: '' }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Please provide an item name or general description.';
    if (!formData.category) errs.category = 'Please select a category.';
    if (!formData.location) errs.location = 'Please select where the item was found.';
    if (!formData.dateEvent) errs.dateEvent = 'Please select the date found.';
    if (!formData.description.trim()) errs.description = 'Please describe the visible features.';
    if (formData.hasHiddenClue && !formData.hiddenClueDescription.trim()) {
      errs.hiddenClueDescription = 'Please describe the secret clue that only the real owner would know.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const fullLocation = formData.specificSpot.trim()
        ? `${formData.location} (${formData.specificSpot.trim()})`
        : formData.location;

      const currentHolder =
        formData.custody === 'with_admin'
          ? formData.adminOfficeLocation
          : `${currentUser.name} (${currentUser.hostel})`;

      const newItem = await storageService.createItem({
        type: 'found',
        title: formData.title.trim(),
        category: formData.category,
        location: fullLocation,
        dateEvent: formData.dateEvent,
        description: formData.description.trim(),
        image: imagePreview || '',
        custody: formData.custody,
        currentHolder: currentHolder,
        hasHiddenClue: formData.hasHiddenClue,
        hiddenClueDescription: formData.hasHiddenClue ? formData.hiddenClueDescription.trim() : '',
        reporterId: currentUser.id,
        reporterName: currentUser.name,
        reporterHostel: currentUser.hostel,
        contactPref: formData.contactPref
      });

      triggerRefresh();
      showToast(
        'Found Item Published',
        `"${newItem.title}" has been listed. Owners can now request verification with private clues.`,
        'success'
      );
      navigate(`/items/${newItem.id}`);
    } catch (err) {
      console.error('Failed to report found item:', err);
      showToast('Error', 'Could not record item. Please check fields.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container" style={{ paddingTop: '2.5rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 2.5rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'var(--found-color)',
              backgroundColor: 'var(--found-bg)',
              border: '1px solid var(--found-border)',
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.825rem',
              fontWeight: 700,
              marginBottom: '0.75rem'
            }}
          >
            <ShieldCheck size={15} />
            <span>Found Item Report</span>
          </div>

          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            Report a Found Item
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
            Help a fellow student get their belongings back. You can hide sensitive features from public view to prevent fake claims.
          </p>
        </div>

        <div className="form-card">
          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div className="form-group">
              <label className="form-label">
                Item Title or General Description <span className="required">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Brass Room Key, Student ID Card, Blue Water Bottle, Hard Zippered Pouch"
                className="form-control"
              />
              <div className="form-hint">
                Tip: Keep the title general so false claimants cannot guess confidential details.
              </div>
              {errors.title && <div style={{ color: 'var(--lost-color)', fontSize: '0.8rem', marginTop: '0.3rem' }}>{errors.title}</div>}
            </div>

            {/* Category & Date */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  Category <span className="required">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="form-control"
                >
                  {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {errors.category && <div style={{ color: 'var(--lost-color)', fontSize: '0.8rem', marginTop: '0.3rem' }}>{errors.category}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">
                  Date Found <span className="required">*</span>
                </label>
                <input
                  type="date"
                  name="dateEvent"
                  value={formData.dateEvent}
                  onChange={handleInputChange}
                  className="form-control"
                />
                {errors.dateEvent && <div style={{ color: 'var(--lost-color)', fontSize: '0.8rem', marginTop: '0.3rem' }}>{errors.dateEvent}</div>}
              </div>
            </div>

            {/* Location & Specific Spot */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  Found Location <span className="required">*</span>
                </label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="form-control"
                >
                  {LOCATIONS.filter((l) => l !== 'All Locations').map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
                {errors.location && <div style={{ color: 'var(--lost-color)', fontSize: '0.8rem', marginTop: '0.3rem' }}>{errors.location}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">
                  Exact Spot (Optional)
                </label>
                <input
                  type="text"
                  name="specificSpot"
                  value={formData.specificSpot}
                  onChange={handleInputChange}
                  placeholder="e.g., Table 12 in mess, Bench near court 2, Washroom sink"
                  className="form-control"
                />
              </div>
            </div>

            {/* Public Description */}
            <div className="form-group">
              <label className="form-label">
                Visible Features (Public Description) <span className="required">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe visible general features (e.g. 'Found on the table after dinner, clean condition, blue color'). Do NOT mention confidential serial numbers or wallet contents."
                className="form-control"
                rows={3}
              />
              {errors.description && <div style={{ color: 'var(--lost-color)', fontSize: '0.8rem', marginTop: '0.3rem' }}>{errors.description}</div>}
            </div>

            {/* Custody of the item */}
            <div className="form-group">
              <label className="form-label">Current Custody Status</label>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '1rem',
                  marginTop: '0.5rem'
                }}
              >
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.65rem',
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: `2px solid ${formData.custody === 'with_finder' ? 'var(--primary)' : 'var(--border)'}`,
                    backgroundColor: formData.custody === 'with_finder' ? 'var(--primary-subtle)' : 'var(--bg-surface)',
                    cursor: 'pointer'
                  }}
                >
                  <input
                    type="radio"
                    name="custody"
                    value="with_finder"
                    checked={formData.custody === 'with_finder'}
                    onChange={handleInputChange}
                    style={{ marginTop: '3px' }}
                  />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-main)' }}>
                      Currently with me (Finder)
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Safely held in my room until verified owner claims it.
                    </div>
                  </div>
                </label>

                <label
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.65rem',
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: `2px solid ${formData.custody === 'with_admin' ? 'var(--primary)' : 'var(--border)'}`,
                    backgroundColor: formData.custody === 'with_admin' ? 'var(--primary-subtle)' : 'var(--bg-surface)',
                    cursor: 'pointer'
                  }}
                >
                  <input
                    type="radio"
                    name="custody"
                    value="with_admin"
                    checked={formData.custody === 'with_admin'}
                    onChange={handleInputChange}
                    style={{ marginTop: '3px' }}
                  />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-main)' }}>
                      Deposited with Administration
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Handed to Hostel Caretaker, Warden Office, or Library Desk.
                    </div>
                  </div>
                </label>
              </div>

              {formData.custody === 'with_admin' && (
                <div style={{ marginTop: '0.75rem' }}>
                  <input
                    type="text"
                    name="adminOfficeLocation"
                    value={formData.adminOfficeLocation}
                    onChange={handleInputChange}
                    placeholder="e.g., Hostel Block B Caretaker Desk / Warden Office"
                    className="form-control"
                  />
                </div>
              )}
            </div>

            {/* Smart Privacy Shield Section (Core Requirement) */}
            <div className="privacy-shield-box">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Lock size={18} style={{ color: 'var(--found-color)' }} />
                  <span style={{ fontWeight: 700, fontSize: '0.925rem', color: 'var(--text-main)' }}>
                    Smart Privacy Shield & Ownership Clue
                  </span>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.825rem', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    name="hasHiddenClue"
                    checked={formData.hasHiddenClue}
                    onChange={handleInputChange}
                  />
                  Hide Sensitive Clue
                </label>
              </div>

              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '0.75rem', lineHeight: 1.5 }}>
                Protect against fake claims! Describe a detail you noticed that will be <strong>hidden from the public listing</strong>. The owner will be asked to name this clue when submitting a claim.
              </p>

              {formData.hasHiddenClue && (
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <textarea
                    name="hiddenClueDescription"
                    value={formData.hiddenClueDescription}
                    onChange={handleInputChange}
                    placeholder="e.g., Room number engraved on the key: B-204, or Pikachu sticker on the back of the ID card, or exact cash amount in wallet."
                    className="form-control"
                    rows={2}
                    style={{ backgroundColor: 'var(--bg-surface)' }}
                  />
                  {errors.hiddenClueDescription && (
                    <div style={{ color: 'var(--lost-color)', fontSize: '0.8rem', marginTop: '0.3rem' }}>
                      {errors.hiddenClueDescription}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Photograph Upload */}
            <div className="form-group">
              <label className="form-label">Item photo (optional)</label>
              {imagePreview ? (
                <div className="upload-preview-box">
                  <img src={imagePreview} alt="Found item preview" />
                  <button
                    type="button"
                    onClick={() => setImagePreview(null)}
                    className="remove-photo-btn"
                  >
                    Remove Photo
                  </button>
                </div>
              ) : (
                <>
                  <label className="upload-dropzone">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFile}
                      style={{ display: 'none' }}
                    />
                    <span className="upload-camera-icon"><Camera size={28} strokeWidth={1.8} /></span>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.9rem' }}>
                      Click to choose a photo
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      JPG, PNG, or WEBP · up to 4 MB
                    </div>
                  </label>

                  <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Quick demo samples:</span>
                    {samplePhotoPresets.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setImagePreview(preset.url)}
                        className="btn btn-outline btn-sm"
                        style={{ padding: '0.2rem 0.5rem', fontSize: '0.725rem' }}
                      >
                        + {preset.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Reporting student context */}
            <div
              style={{
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                marginBottom: '1.75rem',
                fontSize: '0.85rem'
              }}
            >
              <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                Listing by: {currentUser.name} ({currentUser.hostel})
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.775rem' }}>
                Only verified claimants approved by you will receive coordination access for the handover.
              </p>
            </div>

            {/* Submit */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn btn-outline"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-found btn-lg"
                disabled={submitting}
              >
                {submitting ? 'Submitting Found Item...' : 'Publish Found Item Listing'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
