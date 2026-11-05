import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { storageService } from '../services/storageService';
import confetti from 'canvas-confetti';
import {
  FileCheck2,
  CheckCircle2,
  ArrowRightLeft,
  Calendar,
  MapPin,
  User,
  ShieldCheck,
  Printer,
  ArrowLeft,
  Sparkles,
  Lock,
  Building,
  KeyRound,
  AlertTriangle
} from 'lucide-react';

export const HandoverPage = () => {
  const { id } = useParams();
  const { currentUser, showToast, triggerRefresh, refreshKey } = useApp();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [handover, setHandover] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form state if handover not yet finalized
  const [giverName, setGiverName] = useState('');
  const [giverRole, setGiverRole] = useState('Finder / Item Holder');
  const [receiverName, setReceiverName] = useState('');
  const [receiverRole, setReceiverRole] = useState('Verified Owner');
  const [handoverLocation, setHandoverLocation] = useState('Hostel Block B Caretaker Office');
  const [handoverPin, setHandoverPin] = useState('8419');
  const [enteredPin, setEnteredPin] = useState('8419');
  const [notes, setNotes] = useState('Both parties inspected the item. Proof verified in person.');
  const [agreedDualConfirmation, setAgreedDualConfirmation] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    async function loadHandoverData() {
      setLoading(true);
      try {
        const itm = await storageService.getItemById(id);
        if (isMounted) setItem(itm);

        if (itm) {
          const ho = await storageService.getHandoverByItemId(itm.id);
          if (isMounted) {
            setHandover(ho);
            // Pre-fill form if not yet created
            if (!ho) {
              setGiverName(itm.reporterName || currentUser.name);
              setReceiverName(itm.recipientName || 'Verified Claimant');
            }
          }
        }
      } catch (err) {
        console.error('Failed to load handover details:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadHandoverData();
    return () => {
      isMounted = false;
    };
  }, [id, refreshKey]);

  const handleConfirmHandover = async (e) => {
    e.preventDefault();
    if (!giverName.trim() || !receiverName.trim()) {
      setError('Please provide names for both the giver and receiver.');
      return;
    }
    if (!handoverLocation.trim()) {
      setError('Please specify the handover location.');
      return;
    }
    if (!agreedDualConfirmation) {
      setError('Both parties must check the dual confirmation agreement.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const newHo = await storageService.createHandover({
        itemId: item.id,
        itemTitle: item.title,
        giverId: item.reporterId || currentUser.id,
        giverName: giverName.trim(),
        giverRole: giverRole,
        receiverId: item.recipientId || 'claimant_user',
        receiverName: receiverName.trim(),
        receiverRole: receiverRole,
        location: handoverLocation.trim(),
        handoverPin: enteredPin || handoverPin,
        notes: notes.trim()
      });

      // Fire celebratory confetti!
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (cErr) {}

      triggerRefresh();
      setHandover(newHo);
      showToast(
        'Handover Confirmed!',
        `Receipt #${newHo.receiptNumber} generated. Item status marked as Returned.`,
        'success'
      );
    } catch (err) {
      console.error('Failed to create handover:', err);
      setError('Failed to record handover. Please retry.');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="container" style={{ paddingTop: '5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading handover details...
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="page-wrapper">
        <div className="container" style={{ paddingTop: '5rem', textAlign: 'center' }}>
          <AlertTriangle size={48} style={{ color: 'var(--lost-color)', margin: '0 auto 1rem' }} />
          <h2>Item Not Found</h2>
          <Link to="/browse" className="btn btn-outline" style={{ marginTop: '1rem' }}>
            Back to Browse
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="container" style={{ paddingTop: '2.5rem' }}>
        {/* Navigation Breadcrumb */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link
            to={`/items/${item.id}`}
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
            <span>Back to Item Details</span>
          </Link>

          {handover && (
            <button onClick={handlePrint} className="btn btn-outline btn-sm">
              <Printer size={15} />
              <span>Print Official Receipt</span>
            </button>
          )}
        </div>

        {/* If Handover is Finalized -> Render the Printable Official Receipt Card */}
        {handover ? (
          <div>
            <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 2rem' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  color: 'var(--success-color)',
                  backgroundColor: 'var(--success-bg)',
                  border: '1px solid var(--success-border)',
                  padding: '0.35rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.825rem',
                  fontWeight: 700,
                  marginBottom: '0.75rem'
                }}
              >
                <CheckCircle2 size={15} />
                <span>Verified Handover Record</span>
              </div>
              <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                Handover Confirmed & Closed
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                The item has been safely returned to its rightful owner. This digital receipt serves as the permanent handover certificate.
              </p>
            </div>

            {/* Official Receipt Card */}
            <div className="receipt-container" id="printable-receipt">
              <div className="receipt-header">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <ShieldCheck size={28} style={{ color: 'var(--success-color)' }} />
                  <span style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
                    CampusFind Handover Receipt
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  HOSTEL BELONGINGS VERIFICATION & RECOVERY SLIP
                </div>
                <div className="receipt-stamp">SUCCESSFULLY RETURNED</div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <div className="receipt-row">
                  <span className="receipt-label">Receipt Reference Number:</span>
                  <span className="receipt-value" style={{ fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>
                    {handover.receiptNumber || `CP-REC-${handover.id}`}
                  </span>
                </div>

                <div className="receipt-row">
                  <span className="receipt-label">Item Name:</span>
                  <span className="receipt-value">{handover.itemTitle}</span>
                </div>

                <div className="receipt-row">
                  <span className="receipt-label">Item Database ID:</span>
                  <span className="receipt-value" style={{ fontFamily: 'var(--font-mono)' }}>{handover.itemId}</span>
                </div>

                <div className="receipt-row">
                  <span className="receipt-label">Item Category:</span>
                  <span className="receipt-value">{item.category}</span>
                </div>

                <div className="receipt-row">
                  <span className="receipt-label">Handover Date & Time:</span>
                  <span className="receipt-value">
                    {new Date(handover.handoverDate).toLocaleString('en-US', {
                      dateStyle: 'medium',
                      timeStyle: 'short'
                    })}
                  </span>
                </div>

                <div className="receipt-row">
                  <span className="receipt-label">Handover Spot / Location:</span>
                  <span className="receipt-value">{handover.location}</span>
                </div>

                <div className="receipt-row">
                  <span className="receipt-label">Handed Over By (Giver):</span>
                  <span className="receipt-value">
                    {handover.giverName} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>({handover.giverRole})</span>
                  </span>
                </div>

                <div className="receipt-row">
                  <span className="receipt-label">Received By (Recipient):</span>
                  <span className="receipt-value">
                    {handover.receiverName} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>({handover.receiverRole})</span>
                  </span>
                </div>

                <div className="receipt-row">
                  <span className="receipt-label">Verification Status:</span>
                  <span className="receipt-value" style={{ color: 'var(--success-color)' }}>
                    {handover.confirmationStatus}
                  </span>
                </div>

                {handover.handoverPin && (
                  <div className="receipt-row">
                    <span className="receipt-label">Security Handover PIN:</span>
                    <span className="receipt-value" style={{ fontFamily: 'var(--font-mono)' }}>
                      •••• {handover.handoverPin.slice(-2)}
                    </span>
                  </div>
                )}
              </div>

              {handover.notes && (
                <div
                  style={{
                    backgroundColor: 'var(--bg-subtle)',
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem',
                    color: 'var(--text-muted)',
                    border: '1px solid var(--border)',
                    marginBottom: '1.5rem'
                  }}
                >
                  <strong>Inspection Notes:</strong> {handover.notes}
                </div>
              )}

              {/* Security & Authentication Disclaimer */}
              <div
                style={{
                  textAlign: 'center',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  borderTop: '1px solid var(--border)',
                  paddingTop: '1rem',
                  lineHeight: 1.5
                }}
              >
                Recorded on CampusFind. In a campus production deployment, dual digital signatures and college student card barcode scans are used to enforce zero-fraud returns.
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2.5rem' }}>
              <Link to="/my-activity" className="btn btn-outline">
                View in My Activity
              </Link>
              <Link to="/browse" className="btn btn-primary">
                Browse Other Items
              </Link>
            </div>
          </div>
        ) : (
          /* Handover Execution Form */
          <div>
            <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 2.5rem' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  color: 'var(--handover-color)',
                  backgroundColor: 'var(--handover-bg)',
                  border: '1px solid var(--handover-border)',
                  padding: '0.35rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.825rem',
                  fontWeight: 700,
                  marginBottom: '0.75rem'
                }}
              >
                <ArrowRightLeft size={15} />
                <span>Handover Execution Protocol</span>
              </div>

              <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                Handover Confirmation
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
                Record the physical return of <strong>{item.title}</strong>. This closes the report and issues a verifiable digital receipt.
              </p>
            </div>

            <div className="form-card">
              <form onSubmit={handleConfirmHandover}>
                {/* Item summary banner */}
                <div
                  style={{
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                  }}
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.title}
                      style={{ width: '60px', height: '60px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                    />
                  )}
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-main)' }}>{item.title}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Category: {item.category} • Location: {item.location} • ID: {item.id}
                    </div>
                  </div>
                </div>

                {/* Giver & Receiver Information */}
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">
                      Handing Over (Giver Name) <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      value={giverName}
                      onChange={(e) => setGiverName(e.target.value)}
                      placeholder="e.g. abhishek"
                      className="form-control"
                      required
                    />
                    <div className="form-hint">The finder or caretaker releasing the item</div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Giver Role</label>
                    <input
                      type="text"
                      value={giverRole}
                      onChange={(e) => setGiverRole(e.target.value)}
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">
                      Receiving (Owner Name) <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      value={receiverName}
                      onChange={(e) => setReceiverName(e.target.value)}
                      placeholder="e.g. sai"
                      className="form-control"
                      required
                    />
                    <div className="form-hint">The student collecting the verified item</div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Receiver Role</label>
                    <input
                      type="text"
                      value={receiverRole}
                      onChange={(e) => setReceiverRole(e.target.value)}
                      className="form-control"
                    />
                  </div>
                </div>

                {/* Handover Spot & PIN */}
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">
                      Physical Handover Spot <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      value={handoverLocation}
                      onChange={(e) => setHandoverLocation(e.target.value)}
                      placeholder="e.g. Hostel Block B Caretaker Office, Central Mess Gate"
                      className="form-control"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Security Handover PIN (4-Digits)
                    </label>
                    <input
                      type="text"
                      maxLength={4}
                      value={enteredPin}
                      onChange={(e) => setEnteredPin(e.target.value)}
                      className="form-control"
                      style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.2em' }}
                    />
                    <div className="form-hint">Security code shared between both parties</div>
                  </div>
                </div>

                {/* Handover Inspection Notes */}
                <div className="form-group">
                  <label className="form-label">Inspection & Handover Notes</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g., Both parties met in person at the Caretaker desk. Key tested on room lock."
                    className="form-control"
                    rows={2}
                  />
                </div>

                {/* Dual Party Confirmation Agreement */}
                <div
                  style={{
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.25rem',
                    marginBottom: '1.75rem'
                  }}
                >
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.65rem',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      color: 'var(--text-main)',
                      fontWeight: 600
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={agreedDualConfirmation}
                      onChange={(e) => setAgreedDualConfirmation(e.target.checked)}
                      style={{ marginTop: '3px' }}
                    />
                    <span>
                      Dual Confirmation: Both the giver ({giverName || 'Giver'}) and the receiver ({receiverName || 'Receiver'}) confirm that physical possession has taken place and all ownership verification was validated.
                    </span>
                  </label>
                </div>

                {error && (
                  <div style={{ color: 'var(--lost-color)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                    {error}
                  </div>
                )}

                {/* Actions */}
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
                    className="btn btn-success btn-lg"
                    disabled={submitting}
                  >
                    <FileCheck2 size={18} />
                    {submitting ? 'Finalizing Handover...' : 'Confirm Return & Generate Receipt'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
