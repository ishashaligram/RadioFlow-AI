import React from 'react'
import { useElapsed } from '../hooks'

const StatDot = ({ color, label, value }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
    <span
      style={{
        width: 6,
        height: 6,
        borderRadius: '50%',
        background: color,
        flexShrink: 0,
      }}
    />
    <span
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: 'var(--text-secondary)',
      }}
    >
      {label}:{' '}
      <strong style={{ color, fontWeight: 600 }}>{value}</strong>
    </span>
  </div>
)

export default function Header({ stats, triageStartTime, systemDate }) {
  const elapsed = useElapsed(triageStartTime)

  const fmtElapsed = (ms) => {
    const s = Math.floor(ms / 1000)
    const m = Math.floor(s / 60)
    return `${String(m).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
  }

  return (
    <header
      style={{
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-dim)',
        padding: '0 24px',
        height: 54,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
        gap: 16,
      }}
    >
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          {/* Logo mark */}
          <div
            style={{
              width: 30,
              height: 30,
              background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
              borderRadius: 7,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>

          <div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: 15,
                letterSpacing: '-0.025em',
                color: '#e2e8f0',
                lineHeight: 1,
              }}
            >
              RadioFlow{' '}
              <span style={{ color: 'var(--accent)' }}>AI</span>
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 9,
                color: 'var(--text-muted)',
                letterSpacing: '0.1em',
                marginTop: 1,
              }}
            >
              RADIOLOGY ORCHESTRATION &amp; TRIAGE
            </div>
          </div>
        </div>

        <div
          style={{
            width: 1,
            height: 22,
            background: 'var(--border-dim)',
          }}
        />

        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            color: 'var(--text-muted)',
            letterSpacing: '0.06em',
          }}
        >
          {systemDate}
        </div>
      </div>

      {/* Right-side indicators */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        {triageStartTime && (
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: 'var(--accent)',
              letterSpacing: '0.08em',
            }}
          >
            ELAPSED {fmtElapsed(elapsed)}
          </div>
        )}

        {/* Priority counts */}
        <div style={{ display: 'flex', gap: 14 }}>
          <StatDot color="#ef4444" label="P1" value={stats.p1} />
          <StatDot color="#f59e0b" label="P2" value={stats.p2} />
          <StatDot color="#10b981" label="P3" value={stats.p3} />
        </div>

        <div
          style={{ width: 1, height: 18, background: 'var(--border-dim)' }}
        />

        {/* System status */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            color: 'var(--ok)',
            letterSpacing: '0.06em',
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: 'var(--ok)',
              animation: 'pulse 2.2s ease-in-out infinite',
            }}
          />
          SYSTEM ONLINE
        </div>
      </div>
    </header>
  )
}
