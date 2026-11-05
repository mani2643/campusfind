import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { storageService } from '../services/storageService';
import { CATEGORIES, LOCATIONS } from '../services/mockData';
import {
  AlertCircle,
  UploadCloud,
  X,
  Camera,
  MapPin,
  Calendar,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const ReportLostPage = () => {
  const { currentUser, showToast, triggerRefresh } = useApp();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    category: 'Electronics',
    location: 'Hostel Block B',
    specificSpot: '',
    dateEvent: new Date().toISOString().split('T')[0],
    description: '',
    distinguishingFeatures: '',
    contactPref: 'in_app'
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Quick preset sample photos for rapid college testing
  const samplePhotoPresets = [
    { label: 'Room Key', url: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=600&q=80' },
    { label: 'ID Card', url: 'https://images.unsplash.com/photo-1589330694653-dad6bc0140fa?auto=format&fit=crop&w=600&q=80' },
    { label: 'Water Bottle', url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80' },
    { label: 'Headphones', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    if (!formData.title.trim()) errs.title = 'Item title is required.';
    if (!formData.category) errs.category = 'Please select a category.';
    if (!formData.location) errs.location = 'Please specify where it was lost.';
    if (!formData.dateEvent) errs.dateEvent = 'Please specify the date lost.';
    if (!formData.description.trim()) errs.description = 'Please provide a clear description.';
    if (formData.description.trim().length < 10) {
      errs.description = 'Description should be at least 10 characters to help identify it.';
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

      const newItem = await storageService.createItem({
        type: 'lost',
        title: formData.title.trim(),
        category: formData.category,
        location: fullLocation,
        dateEvent: formData.dateEvent,
        description: formData.description.trim(),
        distinguishingFeatures: formData.distinguishingFeatures.trim(),
        image: imagePreview || '',
        reporterId: currentUser.id,
        reporterName: currentUser.name,
        reporterHostel: currentUser.hostel,
        contactPref: formData.contactPref,
        custody: 'with_finder',
        currentHolder: 'Searching'
      });

      triggerRefresh();
      showToast('Lost Item Reported', `"${newItem.title}" has been listed. Hostel mates will be able to search and claim.`, 'success');
      navigate(`/items/${newItem.id}`);
    } catch (err) {
      console.error('Failed to submit lost item:', err);
      showToast('Submission Error', 'Could not record item. Please check fields.', 'error');
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
              color: 'var(--lost-color)',
              backgroundColor: 'var(--lost-bg)',
              border: '1px solid var(--lost-border)',
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.825rem',
              fontWeight: 700,
              marginBottom: '0.75rem'
            }}
          >
            <AlertCircle size={15} />
            <span>Lost Item Report</span>
          </div>

          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            Report a Lost Belonging
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
            Fill in the details about what you misplaced. Your report will be instantly searchable by everyone across the hostel blocks.
          </p>
        </div>

        <div className="form-card">
          <form onSubmit={handleSubmit}>
            {/* Item Title */}
            <div className="form-group">
              <label className="form-label">
                Item Title / Name <span className="required">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Brass Room Key with Blue Tag, College ID Card, Matte Black Earbuds"
                className="form-control"
              />
              {errors.title && <div style={{ color: 'var(--lost-color)', fontSize: '0.8rem', marginTop: '0.3rem' }}>{errors.title}</div>}
            </div>

            {/* Category & Location Row */}
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
                  Approximate Date Lost <span className="required">*</span>
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
                  Last Seen Location <span className="required">*</span>
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
                  Specific Spot / Landmark (Optional)
                </label>
                <input
                  type="text"
                  name="specificSpot"
                  value={formData.specificSpot}
                  onChange={handleInputChange}
                  placeholder="e.g., Table 4 near juice counter, 2nd floor reading carrel"
                  className="form-control"
                />
              </div>
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">
                Detailed Description <span className="required">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the item's brand, color, approximate size, and any context of where you lost it..."
                className="form-control"
                rows={3}
              />
              {errors.description && <div style={{ color: 'var(--lost-color)', fontSize: '0.8rem', marginTop: '0.3rem' }}>{errors.description}</div>}
            </div>

            {/* Distinguishing Features */}
            <div className="form-group">
              <label className="form-label">
                Distinguishing Characteristics / Proof Clues
              </label>
              <input
                type="text"
                name="distinguishingFeatures"
                value={formData.distinguishingFeatures}
                onChange={handleInputChange}
                placeholder="e.g., Small scratch on the top corner, Batman sticker inside case, specific keychain"
                className="form-control"
              />
              <div className="form-hint">
                These specific details help identify your item when someone reports finding a match.
              </div>
            </div>

            {/* Photo Upload Zone */}
            <div className="form-group">
              <label className="form-label">Item photo (optional)</label>
              {imagePreview ? (
                <div className="upload-preview-box">
                  <img src={imagePreview} alt="Preview" />
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

                  {/* Sample Presets for Demo Convenience */}
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

            {/* Reporting Student Info (Masked for Safety) */}
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
                Reporting as: {currentUser.name} ({currentUser.hostel})
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.775rem' }}>
                For student safety, private contact details, exact room numbers, and phone numbers are never displayed on public listings.
              </p>
            </div>

            {/* Submit Button */}
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
                className="btn btn-lost btn-lg"
                disabled={submitting}
              >
                {submitting ? 'Submitting Report...' : 'Publish Lost Item Report'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
