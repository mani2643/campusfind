import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Lock, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

export const ItemCard = ({ item }) => {
  const formattedDate = item.dateReported
    ? new Date(item.dateReported).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      })
    : 'Recent';

  return (
    <div className={`item-card ${item.status === 'returned' ? 'item-returned' : ''}`}>
      <div className="item-card-image-wrapper">
        {item.image ? (
          <img
            src={item.image}
            alt={item.title}
            className="item-card-image"
            loading="lazy"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div
          className="item-card-image-placeholder"
          style={{ display: item.image ? 'none' : 'flex' }}
        >
          <Tag size={32} />
          <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{item.category}</span>
        </div>

        <div className="card-top-badges">
          <StatusBadge type={item.type} />
          {item.status !== 'open' && <StatusBadge status={item.status} />}
        </div>
      </div>

      <div className="item-card-body">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
          <span className="badge badge-category">{item.category}</span>
          {item.hasHiddenClue && (
            <span
              style={{
                fontSize: '0.72rem',
                color: 'var(--found-color)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontWeight: 600
              }}
              title="Finder has set a private ownership verification clue"
            >
              <Lock size={12} />
              Private Clue
            </span>
          )}
        </div>

        <h3 className="item-card-title">{item.title}</h3>

        <div className="item-card-meta">
          <div className="meta-item">
            <MapPin size={14} style={{ color: 'var(--primary)', flexShrink: 0 }} />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {item.location}
            </span>
          </div>
          <div className="meta-item">
            <Calendar size={14} style={{ flexShrink: 0 }} />
            <span>Reported {formattedDate}</span>
          </div>
        </div>

        <p className="item-card-desc">{item.description}</p>

        <div className="item-card-footer">
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {item.custody === 'with_admin' ? 'At Caretaker Office' : `By ${item.reporterName?.split(' ')[0] || 'Student'}`}
          </span>
          <Link to={`/items/${item.id}`} className="btn btn-outline btn-sm">
            <span>View Details</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};
