import React from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Sparkles,
  ShieldCheck,
  Lock,
  FileCheck2,
  Users,
  Lightbulb,
  CheckCircle2,
  Database,
  ArrowRight,
  ExternalLink,
  Layers,
  Heart
} from 'lucide-react';

export const AboutPage = () => {
  return (
    <div className="page-wrapper">
      <div className="container" style={{ paddingTop: '2.5rem' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3.5rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'var(--primary)',
              backgroundColor: 'var(--primary-subtle)',
              border: '1px solid var(--primary-border)',
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.825rem',
              fontWeight: 700,
              marginBottom: '1rem'
            }}
          >
            <Sparkles size={14} />
            <span>Design Thinking College Project</span>
          </div>

          <h1 style={{ fontSize: '2.75rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1.2 }}>
            About CampusFind
          </h1>

          <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', marginTop: '1rem', lineHeight: 1.6 }}>
            A student-centric digital lost & found ecosystem built to replace chaotic hostel WhatsApp groups with structured reporting, private clue verification, and verifiable handover receipts.
          </p>

          <div style={{ fontStyle: 'italic', color: 'var(--primary)', fontWeight: 600, marginTop: '0.5rem' }}>
            "Lost on Campus. Found with CampusFind."
          </div>
        </div>

        {/* The Real Problem We Solved (Design Thinking: Empathize & Define) */}
        <section style={{ marginBottom: '4rem' }}>
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '2.5rem',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1.25rem' }}>
              1. The Hostel Problem (Empathize & Define)
            </h2>

            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              In university hostels, misplaced keys, college IDs, earbuds, chargers, and calculators are daily occurrences. Traditional informal methods fail students in several critical ways:
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '1.5rem'
              }}
            >
              <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <div style={{ fontWeight: 700, color: 'var(--lost-color)', marginBottom: '0.4rem', fontSize: '1rem' }}>
                  ❌ WhatsApp Spam & Information Blackout
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  Messages in 500-member batch groups get buried in minutes under conversation clutter. There is no central, searchable registry.
                </p>
              </div>

              <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <div style={{ fontWeight: 700, color: 'var(--lost-color)', marginBottom: '0.4rem', fontSize: '1rem' }}>
                  ❌ Privacy Violations & Doxxing
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  Finders frequently post photos of government IDs, room numbers, and personal details publicly in chat groups, exposing students to privacy and harassment risks.
                </p>
              </div>

              <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <div style={{ fontWeight: 700, color: 'var(--lost-color)', marginBottom: '0.4rem', fontSize: '1rem' }}>
                  ❌ Opportunistic & Impostor Claims
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  When someone posts "Found AirPods at Gym", dishonest individuals claim it without providing proof. The finder has no objective verification tool.
                </p>
              </div>

              <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <div style={{ fontWeight: 700, color: 'var(--lost-color)', marginBottom: '0.4rem', fontSize: '1rem' }}>
                  ❌ No Return Accountability
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  Caretakers and finders hand items over without documentation. If an item is given to the wrong person, there is zero audit trail.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Design Thinking Solution & Innovation */}
        <section style={{ marginBottom: '4rem' }}>
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '2.5rem',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1.25rem' }}>
              2. How CampusFind Solves It (Ideate & Prototype)
            </h2>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem'
              }}
            >
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--found-bg)',
                    color: 'var(--found-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <Lock size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                    Smart Privacy Shield
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    Finders can conceal sensitive details (such as wallet contents, room numbers engraved on keys, or stickers on calculators). These remain private to the finder and serve as secret verification questions.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--pending-bg)',
                    color: 'var(--pending-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                    Ownership Clue Matching
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    Rather than relying solely on visual photos, a claimant must provide an identifying clue in private. The person holding the item reviews this clue before authorizing contact or handover.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--success-bg)',
                    color: 'var(--success-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <FileCheck2 size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                    Dual Handover Confirmation & Digital Receipts
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    The handover form requires explicit confirmation from both the giver and the recipient, location logging, and a security PIN. It outputs an official printable Handover Receipt with a unique reference number.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--primary-subtle)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <Database size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                    Dual Storage Architecture
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    Engineered with an abstraction layer: runs zero-dependency in localStorage Demo Mode with pre-seeded realistic data, yet is 100% plug-and-play with Supabase Cloud Postgres via environment variables.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Limitations & Real-world Deployment Roadmap */}
        <section style={{ marginBottom: '4rem' }}>
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '2.5rem',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1.25rem' }}>
              3. Prototype Limitations & Future Roadmap
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.925rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              <div>
                <strong style={{ color: 'var(--text-main)' }}>• College SSO & ID Verification:</strong> In this prototype, authentication is demonstrated through mock personas (bharath, abhishek, sai, bhanu prakash, pravallika, vennela). A production deployment would integrate campus Single Sign-On (e.g. Google Workspace / Microsoft Entra ID) using official <code>@campus.edu</code> email domains.
              </div>

              <div>
                <strong style={{ color: 'var(--text-main)' }}>• Barcode / NFC Card Tap Handover:</strong> Future hardware iterations could allow scanning the claimant's physical hostel RFID card or barcode at the caretaker's desk to verify identity instantly during handover.
              </div>

              <div>
                <strong style={{ color: 'var(--text-main)' }}>• Server-Side Authorization:</strong> In the demo mode, client-side integrity handles data. With Supabase, Row Level Security (RLS) policies included in <code>supabase_schema.sql</code> prevent users from approving their own claims or tampering with other students' records.
              </div>

              <div>
                <strong style={{ color: 'var(--text-main)' }}>• Push & WhatsApp Webhook Notifications:</strong> Automated WhatsApp/SMS alerts when a matching item or new claim is posted in the student's hostel block.
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <Link to="/browse" className="btn btn-primary btn-lg">
            <span>Explore CampusFind Prototype</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
};
