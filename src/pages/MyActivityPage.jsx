import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { storageService } from '../services/storageService';
import { StatusBadge } from '../components/StatusBadge';
import {
  Layers,
  AlertCircle,
  ShieldCheck,
  Clock,
  CheckCircle2,
  FileText,
  User,
  ArrowRight,
  ExternalLink,
  Trash2,
  Check,
  X,
  MapPin,
  Calendar
} from 'lucide-react';

export const MyActivityPage = () => {
  const { currentUser, switchUser, personas, showToast, triggerRefresh, refreshKey } = useApp();

  const [activeTab, setActiveTab] = useState('lost'); // 'lost' | 'found' | 'incoming_claims' | 'my_claims' | 'handovers'
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [incomingClaims, setIncomingClaims] = useState([]);
  const [myClaims, setMyClaims] = useState([]);
  const [handovers, setHandovers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Review modal state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [activeClaim, setActiveClaim] = useState(null);
  const [responseNotes, setResponseNotes] = useState('');

  useEffect(() => {
    let isMounted = true;
    async function loadUserActivity() {
      setLoading(true);
      try {
        const allItems = await storageService.getItems({ status: 'all' });
        const allClaims = await storageService.getClaims();
        const allHandovers = await storageService.getHandovers();

        if (isMounted) {
          // Items reported by current user
          const myLost = allItems.filter(
            (i) => i.type === 'lost' && (i.reporterId === currentUser.id || i.reporterName === currentUser.name)
          );
          const myFound = allItems.filter(
            (i) => i.type === 'found' && (i.reporterId === currentUser.id || i.reporterName === currentUser.name)
          );

          // Claims where current user is the claimant
          const submittedByMe = allClaims.filter(
            (c) => c.claimantId === currentUser.id || c.claimantName === currentUser.name
          );

          // Claims on items reported by current user (requiring current user's decision!)
          const myFoundItemIds = myFound.map((i) => i.id);
          const incomingForMe = allClaims.filter((c) => myFoundItemIds.includes(c.itemId));

          // Handovers involving current user
          const myHos = allHandovers.filter(
            (h) =>
              h.giverId === currentUser.id ||
              h.receiverId === currentUser.id ||
              h.giverName === currentUser.name ||
              h.receiverName === currentUser.name
          );

          setLostItems(myLost);
          setFoundItems(myFound);
          setMyClaims(submittedByMe);
          setIncomingClaims(incomingForMe);
          setHandovers(myHos);
        }
      } catch (err) {
        console.error('Failed to load user activity:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadUserActivity();
    return () => {
      isMounted = false;
    };
  }, [currentUser, refreshKey]);

  // Handle claim approve/reject
  const handleClaimDecision = async (claimId, decision) => {
    try {
      await storageService.updateClaimStatus(claimId, decision, responseNotes.trim());
      triggerRefresh();
      setReviewModalOpen(false);
      setActiveClaim(null);
      setResponseNotes('');

      if (decision === 'approved') {
        showToast('Claim Approved', 'Claim approved! Item is ready for Handover.', 'success');
      } else {
        showToast('Claim Rejected', 'Claim rejected.', 'info');
      }
    } catch (err) {
      console.error('Failed to update claim:', err);
      showToast('Error', 'Failed to update claim.', 'error');
    }
  };

  // Close / Delete report
  const handleDeleteReport = async (itemId, title) => {
    if (window.confirm(`Are you sure you want to remove the listing for "${title}"?`)) {
      try {
        await storageService.deleteItem(itemId);
        triggerRefresh();
        showToast('Report Closed', `Listing for "${title}" has been removed.`, 'info');
      } catch (err) {
        console.error('Failed to delete report:', err);
      }
    }
  };

  const pendingIncomingCount = incomingClaims.filter((c) => c.status === 'pending').length;

  return (
    <div className="page-wrapper">
      <div className="container" style={{ paddingTop: '2.5rem' }}>
        {/* User Persona Header Card */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.75rem',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary-border)' }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                  {currentUser.name}
                </h1>
                <span className="badge badge-category">{currentUser.role}</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                {currentUser.hostel} • Room {currentUser.room} • {currentUser.email}
              </p>
            </div>
          </div>

          {/* Quick Persona Switcher for Evaluation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Switch Persona:</span>
            {personas.map((p) => (
              <button
                key={p.id}
                onClick={() => switchUser(p)}
                className={`btn btn-sm ${p.id === currentUser.id ? 'btn-primary' : 'btn-outline'}`}
                style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
              >
                {p.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Tabbed Navigation */}
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            borderBottom: '1px solid var(--border)',
            marginBottom: '2rem',
            overflowX: 'auto',
            paddingBottom: '0.25rem'
          }}
        >
          <button
            onClick={() => setActiveTab('lost')}
            className={`btn btn-sm ${activeTab === 'lost' ? 'btn-primary' : 'btn-outline'}`}
            style={{ borderRadius: 'var(--radius-md) var(--radius-md) 0 0', borderBottom: 'none' }}
          >
            <AlertCircle size={15} />
            <span>My Lost Reports ({lostItems.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('found')}
            className={`btn btn-sm ${activeTab === 'found' ? 'btn-primary' : 'btn-outline'}`}
            style={{ borderRadius: 'var(--radius-md) var(--radius-md) 0 0', borderBottom: 'none' }}
          >
            <ShieldCheck size={15} />
            <span>My Found Listings ({foundItems.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('incoming_claims')}
            className={`btn btn-sm ${activeTab === 'incoming_claims' ? 'btn-primary' : 'btn-outline'}`}
            style={{
              borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
              borderBottom: 'none',
              position: 'relative'
            }}
          >
            <Clock size={15} />
            <span>Claims Awaiting My Decision ({incomingClaims.length})</span>
            {pendingIncomingCount > 0 && (
              <span
                style={{
                  backgroundColor: 'var(--pending-color)',
                  color: '#fff',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.1rem 0.45rem',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  marginLeft: '0.35rem'
                }}
              >
                {pendingIncomingCount} Action
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('my_claims')}
            className={`btn btn-sm ${activeTab === 'my_claims' ? 'btn-primary' : 'btn-outline'}`}
            style={{ borderRadius: 'var(--radius-md) var(--radius-md) 0 0', borderBottom: 'none' }}
          >
            <FileText size={15} />
            <span>Claims I Submitted ({myClaims.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('handovers')}
            className={`btn btn-sm ${activeTab === 'handovers' ? 'btn-primary' : 'btn-outline'}`}
            style={{ borderRadius: 'var(--radius-md) var(--radius-md) 0 0', borderBottom: 'none' }}
          >
            <CheckCircle2 size={15} />
            <span>Handover Receipts ({handovers.length})</span>
          </button>
        </div>

        {/* Tab Contents */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
            Loading activity...
          </div>
        ) : (
          <div>
            {/* TAB 1: My Lost Reports */}
            {activeTab === 'lost' && (
              <div>
                {lostItems.length === 0 ? (
                  <div className="form-card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <AlertCircle size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>No lost items reported yet</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: '0.5rem 0 1.5rem' }}>
                      If you've lost keys, an ID card, or an electronic device in your hostel, post a report so others can help.
                    </p>
                    <Link to="/report-lost" className="btn btn-lost">
                      Report a Lost Item
                    </Link>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {lostItems.map((item) => (
                      <div
                        key={item.id}
                        style={{
                          backgroundColor: 'var(--bg-surface)',
                          border: '1px solid var(--border)',
                          borderRadius: 'var(--radius-md)',
                          padding: '1.25rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          flexWrap: 'wrap',
                          gap: '1rem',
                          boxShadow: 'var(--shadow-sm)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.title}
                              style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                            />
                          )}
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                                {item.title}
                              </h4>
                              <StatusBadge status={item.status} />
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', gap: '1rem' }}>
                              <span>Category: {item.category}</span>
                              <span>Location: {item.location}</span>
                              <span>Reported: {new Date(item.dateReported).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Link to={`/items/${item.id}`} className="btn btn-outline btn-sm">
                            View Details
                          </Link>
                          {item.status !== 'returned' && (
                            <button
                              onClick={() => handleDeleteReport(item.id, item.title)}
                              className="btn btn-outline btn-sm"
                              style={{ color: 'var(--lost-color)' }}
                              title="Delete or close report"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: My Found Listings */}
            {activeTab === 'found' && (
              <div>
                {foundItems.length === 0 ? (
                  <div className="form-card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <ShieldCheck size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>No found items posted by you</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: '0.5rem 0 1.5rem' }}>
                      Found something in the mess, library, or corridor? List it with private ownership clues.
                    </p>
                    <Link to="/report-found" className="btn btn-found">
                      Report a Found Item
                    </Link>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {foundItems.map((item) => (
                      <div
                        key={item.id}
                        style={{
                          backgroundColor: 'var(--bg-surface)',
                          border: '1px solid var(--border)',
                          borderRadius: 'var(--radius-md)',
                          padding: '1.25rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          flexWrap: 'wrap',
                          gap: '1rem',
                          boxShadow: 'var(--shadow-sm)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.title}
                              style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                            />
                          )}
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                                {item.title}
                              </h4>
                              <StatusBadge status={item.status} />
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', gap: '1rem' }}>
                              <span>Category: {item.category}</span>
                              <span>Location: {item.location}</span>
                              <span>Custody: {item.custody === 'with_admin' ? 'At Caretaker Office' : 'With Finder'}</span>
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {item.status === 'in_handover' && (
                            <Link to={`/handover/${item.id}`} className="btn btn-primary btn-sm">
                              Confirm Handover
                            </Link>
                          )}
                          <Link to={`/items/${item.id}`} className="btn btn-outline btn-sm">
                            View Listing
                          </Link>
                          {item.status !== 'returned' && (
                            <button
                              onClick={() => handleDeleteReport(item.id, item.title)}
                              className="btn btn-outline btn-sm"
                              style={{ color: 'var(--lost-color)' }}
                              title="Delete listing"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: Incoming Claims for Review */}
            {activeTab === 'incoming_claims' && (
              <div>
                {incomingClaims.length === 0 ? (
                  <div className="form-card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <Clock size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>No claims awaiting your review</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                      When a student claims an item you found, their private ownership clues will appear here for your verification.
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {incomingClaims.map((claim) => (
                      <div
                        key={claim.id}
                        style={{
                          backgroundColor: 'var(--bg-surface)',
                          border: '1px solid var(--border)',
                          borderRadius: 'var(--radius-lg)',
                          padding: '1.5rem',
                          boxShadow: 'var(--shadow-sm)'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <div>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>
                              Ownership Claim For:
                            </span>
                            <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
                              {claim.itemTitle}
                            </h4>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                              Claimant: <strong>{claim.claimantName}</strong> ({claim.claimantHostel}) • Submitted {new Date(claim.dateSubmitted).toLocaleString()}
                            </div>
                          </div>
                          <span className={`badge badge-${claim.status === 'approved' ? 'returned' : claim.status === 'rejected' ? 'lost' : 'pending'}`}>
                            {claim.status.toUpperCase()}
                          </span>
                        </div>

                        {/* Submitted Clue */}
                        <div
                          style={{
                            backgroundColor: 'var(--bg-subtle)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-md)',
                            padding: '1rem',
                            margin: '1rem 0'
                          }}
                        >
                          <div style={{ fontSize: '0.775rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                            CLAIMANT'S PRIVATE OWNERSHIP CLUE:
                          </div>
                          <div style={{ fontSize: '0.925rem', color: 'var(--text-main)', fontStyle: 'italic', lineHeight: 1.5 }}>
                            "{claim.ownershipClue}"
                          </div>
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', flexWrap: 'wrap' }}>
                          <Link to={`/items/${claim.itemId}`} className="btn btn-outline btn-sm">
                            View Item
                          </Link>

                          {claim.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleClaimDecision(claim.id, 'rejected')}
                                className="btn btn-lost btn-sm"
                              >
                                Reject
                              </button>
                              <button
                                onClick={() => handleClaimDecision(claim.id, 'approved')}
                                className="btn btn-success btn-sm"
                              >
                                Approve Claim & Start Handover
                              </button>
                            </>
                          )}

                          {claim.status === 'approved' && (
                            <Link to={`/handover/${claim.itemId}`} className="btn btn-primary btn-sm">
                              Proceed to Handover →
                            </Link>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: Claims I Submitted */}
            {activeTab === 'my_claims' && (
              <div>
                {myClaims.length === 0 ? (
                  <div className="form-card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <FileText size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>No claims submitted</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: '0.5rem 0 1.5rem' }}>
                      Browse found items and submit an ownership clue if you spot your lost belongings.
                    </p>
                    <Link to="/browse" className="btn btn-outline">
                      Browse Found Items
                    </Link>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {myClaims.map((claim) => (
                      <div
                        key={claim.id}
                        style={{
                          backgroundColor: 'var(--bg-surface)',
                          border: '1px solid var(--border)',
                          borderRadius: 'var(--radius-md)',
                          padding: '1.25rem',
                          boxShadow: 'var(--shadow-sm)'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                            {claim.itemTitle}
                          </h4>
                          <span className={`badge badge-${claim.status === 'approved' ? 'returned' : claim.status === 'rejected' ? 'lost' : 'pending'}`}>
                            {claim.status.toUpperCase()}
                          </span>
                        </div>

                        <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                          Date Submitted: {new Date(claim.dateSubmitted).toLocaleString()}
                        </div>

                        <div
                          style={{
                            backgroundColor: 'var(--bg-subtle)',
                            padding: '0.75rem',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.85rem',
                            marginBottom: '0.75rem'
                          }}
                        >
                          <strong>Your Submitted Clue:</strong> {claim.ownershipClue}
                        </div>

                        {claim.responseNotes && (
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-main)', marginBottom: '0.75rem' }}>
                            <strong>Finder Response:</strong> {claim.responseNotes}
                          </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                          <Link to={`/items/${claim.itemId}`} className="btn btn-outline btn-sm">
                            View Item
                          </Link>
                          {claim.status === 'approved' && (
                            <Link to={`/handover/${claim.itemId}`} className="btn btn-primary btn-sm">
                              Open Handover Receipt
                            </Link>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 5: Handover Receipts */}
            {activeTab === 'handovers' && (
              <div>
                {handovers.length === 0 ? (
                  <div className="form-card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <CheckCircle2 size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>No completed handovers yet</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                      When items are verified and confirmed as returned, their official digital receipts will be archived here.
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {handovers.map((ho) => (
                      <div
                        key={ho.id}
                        style={{
                          backgroundColor: 'var(--bg-surface)',
                          border: '1px solid var(--border)',
                          borderRadius: 'var(--radius-md)',
                          padding: '1.25rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          flexWrap: 'wrap',
                          gap: '1rem',
                          boxShadow: 'var(--shadow-sm)'
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
                              {ho.itemTitle}
                            </h4>
                            <span className="badge badge-returned">RETURNED</span>
                          </div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            Giver: <strong>{ho.giverName}</strong> → Receiver: <strong>{ho.receiverName}</strong>
                          </div>
                          <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                            Receipt Ref: <span style={{ fontFamily: 'var(--font-mono)' }}>{ho.receiptNumber || ho.id}</span> • {new Date(ho.handoverDate).toLocaleDateString()} at {ho.location}
                          </div>
                        </div>

                        <Link to={`/handover/${ho.itemId}`} className="btn btn-outline btn-sm">
                          <FileText size={15} />
                          <span>View Official Receipt</span>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
