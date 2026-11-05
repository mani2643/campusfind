import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { storageService } from '../services/storageService';
import { StatusBadge } from '../components/StatusBadge';
import {
  MapPin,
  Calendar,
  Lock,
  ShieldCheck,
  AlertCircle,
  ArrowRightLeft,
  CheckCircle2,
  Share2,
  ArrowLeft,
  User,
  Building,
  FileText,
  Clock,
  Sparkles,
  X
} from 'lucide-react';

export const ItemDetailsPage = () => {
  const { id } = useParams();
  const { currentUser, showToast, triggerRefresh, refreshKey } = useApp();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [claims, setClaims] = useState([]);
  const [handover, setHandover] = useState(null);
  const [loading, setLoading] = useState(true);

  // Claim modal state
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [ownershipClue, setOwnershipClue] = useState('');
  const [claimConsent, setClaimConsent] = useState(false);
  const [claimSubmitting, setClaimSubmitting] = useState(false);
  const [claimError, setClaimError] = useState('');

  // Review modal state for reporter
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [activeClaimForReview, setActiveClaimForReview] = useState(null);
  const [responseNotes, setResponseNotes] = useState('');

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const itm = await storageService.getItemById(id);
        if (isMounted) setItem(itm);

        if (itm) {
          const itemClaims = await storageService.getClaims({ itemId: itm.id });
          if (isMounted) setClaims(itemClaims);

          if (itm.status === 'returned') {
            const ho = await storageService.getHandoverByItemId(itm.id);
            if (isMounted) setHandover(ho);
          }
        }
      } catch (err) {
        console.error('Failed to load item details:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, [id, refreshKey]);

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="container" style={{ paddingTop: '5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading item details...
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="page-wrapper">
        <div className="container" style={{ paddingTop: '5rem', textAlign: 'center' }}>
          <AlertCircle size={48} style={{ color: 'var(--lost-color)', margin: '0 auto 1rem' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Item Not Found</h2>
          <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 1.5rem' }}>
            This item report may have been deleted or the ID is invalid.
          </p>
          <Link to="/browse" className="btn btn-outline">
            ← Back to Browse
          </Link>
        </div>
      </div>
    );
  }

  const isReporter = currentUser.id === item.reporterId;
  const isReturned = item.status === 'returned';
  const isInHandover = item.status === 'in_handover';
  const hasUserClaimed = claims.some((c) => c.claimantId === currentUser.id);
  const userClaim = claims.find((c) => c.claimantId === currentUser.id);

  // Submit Claim
  const handleClaimSubmit = async (e) => {
    e.preventDefault();
    if (!ownershipClue.trim()) {
      setClaimError('Please provide a specific ownership clue or proof.');
      return;
    }
    if (!claimConsent) {
      setClaimError('Please confirm the honesty statement.');
      return;
    }

    setClaimSubmitting(true);
    setClaimError('');
    try {
      await storageService.createClaim({
        itemId: item.id,
        itemTitle: item.title,
        claimantId: currentUser.id,
        claimantName: currentUser.name,
        claimantHostel: currentUser.hostel,
        ownershipClue: ownershipClue.trim()
      });

      triggerRefresh();
      setClaimModalOpen(false);
      setOwnershipClue('');
      setClaimConsent(false);
      showToast(
        'Claim Submitted',
        `Your ownership claim has been sent privately to the finder (${item.reporterName}).`,
        'success'
      );
    } catch (err) {
      console.error('Failed to submit claim:', err);
      setClaimError('Could not submit claim. Please try again.');
    } finally {
      setClaimSubmitting(false);
    }
  };

  // Approve / Reject Claim
  const handleClaimDecision = async (claimId, decision) => {
    try {
      await storageService.updateClaimStatus(claimId, decision, responseNotes.trim());
      triggerRefresh();
      setReviewModalOpen(false);
      setActiveClaimForReview(null);
      setResponseNotes('');

      if (decision === 'approved') {
        showToast(
          'Claim Approved!',
          'The claim has been approved. The item is now ready for Handover Confirmation.',
          'success'
        );
      } else {
        showToast('Claim Rejected', 'The claim has been marked as rejected.', 'info');
      }
    } catch (err) {
      console.error('Failed to update claim:', err);
      showToast('Error', 'Failed to update claim status.', 'error');
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container" style={{ paddingTop: '2.5rem' }}>
        {/* Breadcrumb Navigation */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link
            to="/browse"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--text-muted)'
            }}
          >
            <ArrowLeft size={16} />
            <span>Back to listings</span>
          </Link>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                showToast('Link Copied', 'Item URL copied to clipboard!', 'info');
              }}
              className="btn btn-outline btn-sm"
              title="Share item link"
            >
              <Share2 size={14} />
              Share
            </button>
          </div>
        </div>

        {/* Status Callout Banner */}
        {isReturned && (
          <div
            style={{
              backgroundColor: 'var(--success-bg)',
              border: '1px solid var(--success-border)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              marginBottom: '2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <CheckCircle2 size={24} style={{ color: 'var(--success-color)' }} />
              <div>
                <div style={{ fontWeight: 800, color: 'var(--success-color)', fontSize: '1rem' }}>
                  Item Successfully Returned to Owner
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  This report is officially resolved with a dual-party verified Handover Receipt.
                </div>
              </div>
            </div>

            <Link to={`/handover/${item.id}`} className="btn btn-success btn-sm">
              <FileText size={15} />
              View Official Handover Receipt
            </Link>
          </div>
        )}

        {isInHandover && (
          <div
            style={{
              backgroundColor: 'var(--handover-bg)',
              border: '1px solid var(--handover-border)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              marginBottom: '2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <ArrowRightLeft size={24} style={{ color: 'var(--handover-color)' }} />
              <div>
                <div style={{ fontWeight: 800, color: 'var(--handover-color)', fontSize: '1rem' }}>
                  Ownership Verified — Handover in Progress
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Approved recipient: <strong>{item.recipientName || 'Verified Claimant'}</strong>. Proceed to the physical handover form to confirm return.
                </div>
              </div>
            </div>

            <Link to={`/handover/${item.id}`} className="btn btn-primary btn-sm">
              Proceed to Handover Form →
            </Link>
          </div>
        )}

        {/* Main Details Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem',
            alignItems: 'start'
          }}
        >
          {/* Left Column: Image & Media */}
          <div>
            <div
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-md)',
                position: 'relative'
              }}
            >
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.title}
                  style={{ width: '100%', maxHeight: '420px', objectFit: 'cover', display: 'block' }}
                />
              ) : (
                <div
                  style={{
                    height: '320px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-muted)',
                    gap: '0.75rem'
                  }}
                >
                  <ShieldCheck size={48} />
                  <span style={{ fontWeight: 600 }}>No photograph uploaded</span>
                </div>
              )}

              {/* Status Badges Overlay */}
              <div
                style={{
                  position: 'absolute',
                  top: '1rem',
                  left: '1rem',
                  display: 'flex',
                  gap: '0.5rem'
                }}
              >
                <StatusBadge type={item.type} />
                <StatusBadge status={item.status} />
              </div>
            </div>

            {/* Reporter Context Box */}
            <div
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                marginTop: '1.5rem',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                Listing & Custody Information
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.875rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Reported By:</span>
                  <span style={{ fontWeight: 600 }}>{item.reporterName}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Hostel Affiliation:</span>
                  <span style={{ fontWeight: 600 }}>{item.reporterHostel}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Current Custody:</span>
                  <span style={{ fontWeight: 600 }}>
                    {item.custody === 'with_admin' ? 'Hostel Caretaker Office' : 'With Student Finder'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Current Physical Holder:</span>
                  <span style={{ fontWeight: 600 }}>{item.currentHolder}</span>
                </div>
              </div>

              {/* Safety note */}
              <div
                style={{
                  marginTop: '1rem',
                  padding: '0.65rem',
                  backgroundColor: 'var(--bg-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  gap: '0.4rem',
                  alignItems: 'center'
                }}
              >
                <Lock size={14} style={{ flexShrink: 0, color: 'var(--primary)' }} />
                <span>
                  For student privacy and anti-doxxing, phone numbers and private room numbers are never published publicly.
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Title, Metadata, Description, & Claim Action */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span className="badge badge-category">{item.category}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>• Item ID: {item.id}</span>
            </div>

            <h1 style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.25, marginBottom: '1rem' }}>
              {item.title}
            </h1>

            {/* Meta Row */}
            <div
              style={{
                display: 'flex',
                gap: '1.5rem',
                flexWrap: 'wrap',
                padding: '0.85rem 0',
                borderTop: '1px solid var(--border)',
                borderBottom: '1px solid var(--border)',
                marginBottom: '1.5rem',
                fontSize: '0.9rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)' }}>
                <MapPin size={16} style={{ color: 'var(--primary)' }} />
                <span>{item.location}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)' }}>
                <Calendar size={16} />
                <span>Event Date: {item.dateEvent || 'Recent'}</span>
              </div>
            </div>

            {/* Description Section */}
            <div style={{ marginBottom: '1.75rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                Description
              </h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, fontSize: '0.95rem' }}>
                {item.description}
              </p>
            </div>

            {/* Distinguishing Features if Lost */}
            {item.distinguishingFeatures && (
              <div style={{ marginBottom: '1.75rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                  Distinguishing Features
                </h3>
                <div
                  style={{
                    backgroundColor: 'var(--bg-subtle)',
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    fontSize: '0.9rem',
                    color: 'var(--text-main)'
                  }}
                >
                  {item.distinguishingFeatures}
                </div>
              </div>
            )}

            {/* Privacy Shield Notice if Found */}
            {item.hasHiddenClue && (
              <div
                style={{
                  backgroundColor: 'var(--found-bg)',
                  border: '1px solid var(--found-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  marginBottom: '1.75rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: 'var(--found-color)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                  <Lock size={16} />
                  <span>Smart Privacy Shield Active</span>
                </div>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  The finder has registered a secret identifying clue (e.g. markings, sticker, serial number). When submitting a claim, describe this secret clue to prove rightful ownership.
                </p>

                {/* If the current user IS the reporter, show their secret clue for reference */}
                {isReporter && item.hiddenClueDescription && (
                  <div
                    style={{
                      marginTop: '0.75rem',
                      padding: '0.65rem 0.85rem',
                      backgroundColor: 'rgba(255,255,255,0.7)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.8rem',
                      color: 'var(--text-main)',
                      border: '1px dashed var(--found-border)'
                    }}
                  >
                    <strong>Your Secret Clue (Visible only to you):</strong> {item.hiddenClueDescription}
                  </div>
                )}
              </div>
            )}

            {/* Primary Action Button Area */}
            <div
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              {isReturned ? (
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--success-color)', marginBottom: '0.5rem' }}>
                    This item has been returned.
                  </div>
                  <Link to={`/handover/${item.id}`} className="btn btn-success" style={{ width: '100%' }}>
                    View Official Handover Receipt
                  </Link>
                </div>
              ) : isInHandover ? (
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--handover-color)', marginBottom: '0.5rem' }}>
                    Claim Approved! Awaiting Handover Confirmation.
                  </div>
                  <Link to={`/handover/${item.id}`} className="btn btn-primary" style={{ width: '100%' }}>
                    Open Handover Form & Receipt
                  </Link>
                </div>
              ) : isReporter ? (
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                    You reported this item
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    {claims.length > 0
                      ? `${claims.length} claim(s) received for this item. Review them below.`
                      : 'No claims submitted yet. You will be notified when someone claims this item.'}
                  </p>
                  <Link to="/my-activity" className="btn btn-outline" style={{ width: '100%' }}>
                    Manage in My Activity
                  </Link>
                </div>
              ) : item.type === 'found' ? (
                <div>
                  {hasUserClaimed ? (
                    <div>
                      <div
                        style={{
                          backgroundColor: 'var(--pending-bg)',
                          border: '1px solid var(--pending-border)',
                          color: 'var(--pending-color)',
                          padding: '0.85rem',
                          borderRadius: 'var(--radius-md)',
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          marginBottom: '0.75rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}
                      >
                        <Clock size={16} />
                        <span>You submitted a claim for this item ({userClaim?.status?.toUpperCase()}).</span>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Your clue: "{userClaim?.ownershipClue}". The finder will review it.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                        Does this item belong to you?
                      </h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                        Submit an ownership claim with a private clue to verify that you are the rightful owner.
                      </p>
                      <button
                        onClick={() => setClaimModalOpen(true)}
                        className="btn btn-primary btn-lg"
                        style={{ width: '100%' }}
                      >
                        <ShieldCheck size={18} />
                        Claim This Item
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Item is Lost */
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                    Did you find this item?
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    Help {item.reporterName} recover it! You can report finding it or coordinate with them.
                  </p>
                  <button
                    onClick={() => {
                      showToast(
                        'Notification Sent',
                        `Notification sent to ${item.reporterName} that you have spotted their item.`,
                        'success'
                      );
                    }}
                    className="btn btn-found btn-lg"
                    style={{ width: '100%' }}
                  >
                    <Sparkles size={18} />
                    I Found This Item! Notify Owner
                  </button>
                </div>
              )}
            </div>

            {/* Claims Review Section for the Reporter/Holder */}
            {isReporter && claims.length > 0 && (
              <div
                style={{
                  marginTop: '2rem',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.5rem',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1rem' }}>
                  Submitted Ownership Claims ({claims.length})
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {claims.map((c) => (
                    <div
                      key={c.id}
                      style={{
                        backgroundColor: 'var(--bg-subtle)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-md)',
                        padding: '1rem'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{c.claimantName}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {c.claimantHostel} • {new Date(c.dateSubmitted).toLocaleDateString()}
                          </div>
                        </div>
                        <span className={`badge badge-${c.status === 'approved' ? 'returned' : c.status === 'rejected' ? 'lost' : 'pending'}`}>
                          {c.status.toUpperCase()}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', margin: '0.5rem 0' }}>
                        <strong>Claimant's Private Clue:</strong>
                        <div
                          style={{
                            backgroundColor: 'var(--bg-surface)',
                            padding: '0.5rem 0.75rem',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border)',
                            marginTop: '0.3rem',
                            fontStyle: 'italic'
                          }}
                        >
                          "{c.ownershipClue}"
                        </div>
                      </div>

                      {c.status === 'pending' && (
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                          <button
                            onClick={() => {
                              setActiveClaimForReview(c);
                              setReviewModalOpen(true);
                            }}
                            className="btn btn-primary btn-sm"
                          >
                            Review & Decide
                          </button>
                        </div>
                      )}

                      {c.responseNotes && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                          Decision Notes: {c.responseNotes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Claim Submission Modal */}
        {claimModalOpen && (
          <div className="modal-overlay" role="dialog" aria-modal="true">
            <div className="modal-content">
              <div className="modal-header">
                <div className="modal-title">Submit Ownership Claim</div>
                <button
                  onClick={() => setClaimModalOpen(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleClaimSubmit}>
                <div className="modal-body">
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Claiming item:</div>
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>{item.title}</div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Private Ownership Clue / Proof <span className="required">*</span>
                    </label>
                    <textarea
                      value={ownershipClue}
                      onChange={(e) => setOwnershipClue(e.target.value)}
                      placeholder="Describe something only the rightful owner would know: e.g. room number on key, markings, wallpaper on phone, contents inside wallet, specific sticker."
                      className="form-control"
                      rows={3}
                      required
                    />
                    <div className="form-hint">
                      This information is transmitted securely and privately ONLY to {item.reporterName}. It will never be displayed publicly.
                    </div>
                  </div>

                  <div className="form-group">
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', cursor: 'pointer', fontSize: '0.825rem', color: 'var(--text-main)' }}>
                      <input
                        type="checkbox"
                        checked={claimConsent}
                        onChange={(e) => setClaimConsent(e.target.checked)}
                        style={{ marginTop: '2px' }}
                      />
                      <span>
                        I certify that I am the rightful owner of this item and understand that making false claims violates college hostel discipline.
                      </span>
                    </label>
                  </div>

                  {claimError && (
                    <div style={{ color: 'var(--lost-color)', fontSize: '0.825rem', marginBottom: '0.5rem' }}>
                      {claimError}
                    </div>
                  )}
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    onClick={() => setClaimModalOpen(false)}
                    className="btn btn-outline"
                    disabled={claimSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={claimSubmitting}
                  >
                    {claimSubmitting ? 'Submitting...' : 'Send Claim for Review'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Claim Review Decision Modal (for Reporter) */}
        {reviewModalOpen && activeClaimForReview && (
          <div className="modal-overlay" role="dialog" aria-modal="true">
            <div className="modal-content">
              <div className="modal-header">
                <div className="modal-title">Review Ownership Claim</div>
                <button
                  onClick={() => setReviewModalOpen(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="modal-body">
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Claimant:</div>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-main)' }}>
                    {activeClaimForReview.claimantName} ({activeClaimForReview.claimantHostel})
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                    Submitted Ownership Clue:
                  </div>
                  <div
                    style={{
                      backgroundColor: 'var(--bg-subtle)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.85rem',
                      fontSize: '0.925rem',
                      fontStyle: 'italic',
                      lineHeight: 1.5
                    }}
                  >
                    "{activeClaimForReview.ownershipClue}"
                  </div>
                </div>

                {item.hasHiddenClue && item.hiddenClueDescription && (
                  <div
                    style={{
                      marginBottom: '1rem',
                      padding: '0.75rem',
                      backgroundColor: 'var(--found-bg)',
                      border: '1px solid var(--found-border)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.825rem'
                    }}
                  >
                    <strong style={{ color: 'var(--found-color)' }}>Your Secret Verification Clue:</strong>
                    <div style={{ marginTop: '0.2rem' }}>{item.hiddenClueDescription}</div>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Response Notes (Optional)</label>
                  <input
                    type="text"
                    value={responseNotes}
                    onChange={(e) => setResponseNotes(e.target.value)}
                    placeholder="e.g., Clue matches perfectly. Ready for handover at Common Room."
                    className="form-control"
                  />
                </div>
              </div>

              <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
                <button
                  onClick={() => handleClaimDecision(activeClaimForReview.id, 'rejected')}
                  className="btn btn-lost btn-sm"
                >
                  Reject Claim
                </button>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => setReviewModalOpen(false)} className="btn btn-outline btn-sm">
                    Cancel
                  </button>
                  <button
                    onClick={() => handleClaimDecision(activeClaimForReview.id, 'approved')}
                    className="btn btn-success btn-sm"
                  >
                    Approve Claim & Proceed
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
