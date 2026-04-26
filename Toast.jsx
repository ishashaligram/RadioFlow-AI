import React from 'react'

/**
 * Renders a stack of P1-critical toast alerts in the top-right corner.
 */
export default function Toast({ toasts, onDismiss }) {
  if (!toasts.length) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        pointerEvents: 'none',
      }}
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className={t.removing ? 'toast-exit' : 'toast-enter'}
          onClick={() => onDismiss(t.id)}
          style={{
            background: '#0a1828',
            border: '1px solid rgba(239,68,68,0.48)',
            borderLeft: '3px solid #ef4444',
            borderRadius: 8,
            padding: '12px 16px',
            minWidth: 310,
            maxWidth: 380,
            cursor: 'pointer',
            pointerEvents: 'all',
          }}
        >
          {/* Header row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 5,
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: '#ef4444',
                flexShrink: 0,
                animation: 'pulse 1s ease-in-out infinite',
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                fontWeight: 600,
                color: '#ef4444',
                letterSpacing: '0.1em',
              }}
            >
              CRITICAL ALERT — P1 FINDING
            </span>
          </div>

          {/* Patient */}
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: '#e2e8f0',
              lineHeight: 1.3,
            }}
          >
            {t.patient}
          </div>

          {/* Finding */}
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: '#94a3b8',
              marginTop: 3,
            }}
          >
            {t.finding} &middot; {t.confidence}% confidence
          </div>

          {/* Dismiss hint */}
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              color: 'rgba(239,68,68,0.45)',
              marginTop: 6,
              letterSpacing: '0.06em',
            }}
          >
            CLICK TO DISMISS
          </div>
        </div>
      ))}
    </div>
  )
}
