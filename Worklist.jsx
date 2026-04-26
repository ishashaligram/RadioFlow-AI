import React from 'react'
import { PRIORITY_CONFIG, TRIAGE_STEPS } from '../data'

// ── Individual Row ────────────────────────────────────────────────────────────
function WorklistRow({ c, isSelected, onClick }) {
  const pc = c.priority ? PRIORITY_CONFIG[c.priority] : null

  return (
    <tr
      onClick={onClick}
      className={c.highlighted ? 'row-highlight' : ''}
      style={{
        cursor: 'pointer',
        borderBottom: '1px solid var(--border-dim)',
        transition: 'background 0.18s ease',
        background: isSelected ? 'rgba(59,130,246,0.07)' : 'transparent',
      }}
      onMouseEnter={(e) => {
        if (!isSelected) e.currentTarget.style.background = 'var(--bg-hover)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = isSelected
          ? 'rgba(59,130,246,0.07)'
          : 'transparent'
      }}
    >
      {/* Patient */}
      <td style={{ padding: '11px 16px' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}>
          {c.patient}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            color: 'var(--text-muted)',
            marginTop: 2,
          }}
        >
          {c.id} &middot; Age {c.age}
        </div>
      </td>

      {/* Study */}
      <td style={{ padding: '11px 12px' }}>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>
          {c.study}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            color: 'var(--text-muted)',
            marginTop: 2,
          }}
        >
          {c.modality}
        </div>
      </td>

      {/* Received */}
      <td
        style={{
          padding: '11px 12px',
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          color: 'var(--text-secondary)',
        }}
      >
        {c.received}
      </td>

      {/* AI Status */}
      <td style={{ padding: '11px 12px' }}>
        {c.aiStatus === 'pending' && (
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: 'var(--text-muted)',
              letterSpacing: '0.08em',
            }}
          >
            PENDING
          </span>
        )}
        {c.aiStatus === 'processing' && (
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: 'var(--accent)',
              letterSpacing: '0.08em',
              animation: 'pulse 1.2s ease-in-out infinite',
            }}
          >
            ANALYZING
          </span>
        )}
        {c.aiStatus === 'complete' && (
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: 'var(--ok)',
              letterSpacing: '0.08em',
            }}
          >
            COMPLETE
          </span>
        )}
      </td>

      {/* Priority Badge */}
      <td style={{ padding: '11px 16px' }}>
        {pc ? (
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              fontWeight: 600,
              color: pc.color,
              background: pc.bg,
              border: `1px solid ${pc.border}`,
              borderRadius: 4,
              padding: '3px 9px',
              letterSpacing: '0.06em',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              whiteSpace: 'nowrap',
            }}
          >
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: '50%',
                background: pc.color,
                flexShrink: 0,
                animation:
                  c.priority === 'P1'
                    ? 'pulse 1s ease-in-out infinite'
                    : 'none',
              }}
            />
            {c.priority} &middot; {pc.label}
          </span>
        ) : (
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: 'var(--text-muted)',
            }}
          >
            &mdash;
          </span>
        )}
      </td>
    </tr>
  )
}

// ── Main Worklist Component ───────────────────────────────────────────────────
export default function Worklist({
  cases,
  selectedId,
  onSelect,
  isRunning,
  step,
  hasRun,
  onRunTriage,
}) {
  const COLUMNS = ['Patient', 'Study', 'Received', 'AI Status', 'Priority']

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid var(--border-dim)',
        minWidth: 0,
        overflow: 'hidden',
      }}
    >
      {/* Toolbar */}
      <div
        style={{
          padding: '11px 20px',
          borderBottom: '1px solid var(--border-dim)',
          background: 'var(--bg-surface)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
          gap: 12,
        }}
      >
        <div>
          <div
            style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}
          >
            Radiology Worklist
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: 'var(--text-muted)',
              marginTop: 1,
            }}
          >
            {cases.length} STUDIES &middot; SORTED BY PRIORITY
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Step indicator */}
          {isRunning && step >= 0 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: 'var(--accent-dim)',
                border: '1px solid rgba(59,130,246,0.28)',
                borderRadius: 6,
                padding: '6px 12px',
              }}
            >
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="2.5"
                className="animate-spin"
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  color: 'var(--accent)',
                  letterSpacing: '0.07em',
                  whiteSpace: 'nowrap',
                }}
              >
                {TRIAGE_STEPS[step]}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 9,
                  color: 'rgba(59,130,246,0.5)',
                }}
              >
                {step + 1}/{TRIAGE_STEPS.length}
              </span>
            </div>
          )}

          {/* Run button */}
          <button
            className="btn-primary"
            onClick={onRunTriage}
            disabled={isRunning}
          >
            {isRunning ? (
              <>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className="animate-spin"
                >
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                Running Triage…
              </>
            ) : (
              <>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                {hasRun ? 'Re-run AI Triage' : 'Run AI Triage'}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr
              style={{
                borderBottom: '1px solid var(--border-dim)',
                background: 'rgba(13,21,36,0.85)',
                position: 'sticky',
                top: 0,
                zIndex: 1,
              }}
            >
              {COLUMNS.map((col) => (
                <th
                  key={col}
                  style={{
                    padding: '8px 16px',
                    textAlign: 'left',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 9,
                    fontWeight: 500,
                    color: 'var(--text-muted)',
                    letterSpacing: '0.12em',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {col.toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cases.map((c) => (
              <WorklistRow
                key={c.id}
                c={c}
                isSelected={selectedId === c.id}
                onClick={() => onSelect(c.id)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
