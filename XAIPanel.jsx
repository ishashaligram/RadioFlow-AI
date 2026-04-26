import React from 'react'
import { PRIORITY_CONFIG } from '../data'

// ── Empty states ─────────────────────────────────────────────────────────────

function EmptyState({ icon, message }) {
  return (
    <div
      className="animate-fade-up"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: 260,
        gap: 10,
        opacity: 0.3,
      }}
    >
      {icon}
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: 'var(--text-muted)',
          letterSpacing: '0.1em',
          textAlign: 'center',
          maxWidth: 200,
        }}
      >
        {message}
      </span>
    </div>
  )
}

// ── Confidence bar ────────────────────────────────────────────────────────────

function ConfidenceBar({ value, color }) {
  return (
    <div
      style={{
        height: 4,
        background: 'rgba(255,255,255,0.07)',
        borderRadius: 2,
        overflow: 'hidden',
        marginTop: 10,
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${value}%`,
          background: color,
          borderRadius: 2,
          transition: 'width 1.1s cubic-bezier(0.22,1,0.36,1)',
        }}
      />
    </div>
  )
}

// ── XAI Panel ────────────────────────────────────────────────────────────────

export default function XAIPanel({ selectedCase }) {
  // No selection
  if (!selectedCase) {
    return (
      <EmptyState
        message="SELECT A CASE TO LOAD XAI REPORT"
        icon={
          <svg
            width="34"
            height="34"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="1.5"
          >
            <path d="M12 2a10 10 0 1 0 10 10" />
            <path d="M22 2 12 12" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        }
      />
    )
  }

  // Triage not yet run
  if (selectedCase.aiStatus === 'pending') {
    return (
      <EmptyState
        message="RUN AI TRIAGE TO GENERATE ANALYSIS"
        icon={
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--warn)"
            strokeWidth="1.5"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <circle cx="12" cy="16" r="0.5" fill="var(--warn)" />
          </svg>
        }
      />
    )
  }

  // Processing
  if (selectedCase.aiStatus === 'processing') {
    return (
      <div
        className="animate-fade-up"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: 260,
          gap: 14,
        }}
      >
        <svg
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2"
          className="animate-spin"
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            color: 'var(--accent)',
            letterSpacing: '0.12em',
            animation: 'pulse 1.4s ease-in-out infinite',
          }}
        >
          ANALYZING STUDY…
        </span>
      </div>
    )
  }

  // Complete — render full report
  const pc = PRIORITY_CONFIG[selectedCase.priority] || PRIORITY_CONFIG.P3

  return (
    <div
      className="animate-fade-up"
      style={{ display: 'flex', flexDirection: 'column', gap: 11 }}
    >
      {/* ── Finding card ── */}
      <div
        style={{
          background: pc.bg,
          border: `1px solid ${pc.border}`,
          borderRadius: 8,
          padding: '14px 16px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <div style={{ flex: 1, marginRight: 12 }}>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 9,
                color: pc.color,
                letterSpacing: '0.12em',
                marginBottom: 5,
              }}
            >
              PREDICTED FINDING
            </div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: '#e2e8f0',
                lineHeight: 1.35,
              }}
            >
              {selectedCase.finding}
            </div>
          </div>

          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 24,
                fontWeight: 700,
                color: pc.color,
                lineHeight: 1,
              }}
            >
              {selectedCase.confidence}%
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 9,
                color: pc.color,
                opacity: 0.65,
                letterSpacing: '0.08em',
                marginTop: 2,
              }}
            >
              CONFIDENCE
            </div>
          </div>
        </div>

        <ConfidenceBar value={selectedCase.confidence} color={pc.color} />

        {/* Priority badge row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginTop: 10,
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              fontWeight: 600,
              color: pc.color,
              letterSpacing: '0.06em',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: pc.color,
                animation:
                  selectedCase.priority === 'P1'
                    ? 'pulse 1s ease-in-out infinite'
                    : 'none',
              }}
            />
            {selectedCase.priority} — {pc.label}
          </span>
        </div>
      </div>

      {/* ── Clinical Rationale ── */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-dim)',
          borderRadius: 8,
          padding: '12px 14px',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            color: 'var(--accent-bright)',
            letterSpacing: '0.12em',
            marginBottom: 8,
          }}
        >
          CLINICAL RATIONALE
        </div>
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: '#cbd5e1',
            lineHeight: 1.75,
            margin: 0,
          }}
        >
          {selectedCase.rationale}
        </p>
      </div>

      {/* ── Safety Check Log ── */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-dim)',
          borderRadius: 8,
          padding: '12px 14px',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            color: 'var(--ok)',
            letterSpacing: '0.12em',
            marginBottom: 9,
          }}
        >
          SAFETY CHECK LOG
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {(selectedCase.safetyChecks ?? []).map((check, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 8,
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                color: '#94a3b8',
                lineHeight: 1.5,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: check.includes('⚠')
                    ? 'var(--warn)'
                    : 'var(--ok)',
                  flexShrink: 0,
                  marginTop: 3,
                }}
              />
              {check}
            </div>
          ))}
        </div>
      </div>

      {/* ── Study metadata footer ── */}
      <div
        style={{
          borderTop: '1px solid var(--border-dim)',
          paddingTop: 10,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            color: 'var(--text-muted)',
            letterSpacing: '0.06em',
          }}
        >
          REF: {selectedCase.referrer}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            color: 'var(--text-muted)',
            letterSpacing: '0.06em',
          }}
        >
          ENGINE v4.6-RF &nbsp;·&nbsp; 2026-04-26
        </span>
      </div>
    </div>
  )
}
