import React from 'react';
import { AlertCircle, CheckCircle2, Clock, ShieldCheck, ArrowRightLeft } from 'lucide-react';

export const StatusBadge = ({ status, type }) => {
  if (type) {
    if (type === 'lost') {
      return (
        <span className="badge badge-lost">
          <AlertCircle size={12} />
          Lost
        </span>
      );
    }
    if (type === 'found') {
      return (
        <span className="badge badge-found">
          <ShieldCheck size={12} />
          Found
        </span>
      );
    }
  }

  switch (status) {
    case 'returned':
      return (
        <span className="badge badge-returned">
          <CheckCircle2 size={12} />
          Returned
        </span>
      );
    case 'claim_pending':
      return (
        <span className="badge badge-pending">
          <Clock size={12} />
          Claim Pending
        </span>
      );
    case 'in_handover':
      return (
        <span className="badge badge-handover">
          <ArrowRightLeft size={12} />
          In Handover
        </span>
      );
    case 'open':
    default:
      return (
        <span className="badge" style={{ backgroundColor: 'var(--bg-subtle)', color: 'var(--text-muted)' }}>
          Active
        </span>
      );
  }
};
