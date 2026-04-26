import React from 'react'
import DicomViewer from './DicomViewer'
import XAIPanel from './XAIPanel'

/**
 * Right-hand clinical workspace: DICOM viewer + case summary + XAI report.
 */
export default function ClinicalWorkspace({ selectedCase }) {
  return (
    <div
      style={{
        width: 368,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg-surface)',
        borderLeft: '1px solid var(--border-dim)',
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
    >
      {/* Pane header */}
      <div
        style={{
          padding: '11px 16px',
          borderBottom: '1px solid var(--border-dim)',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="12" cy="12" r="4" />
          <line x1="12" y1="3" x2="12" y2="8" />
          <line x1="12" y1="16" x2="12" y2="21" />
          <line x1="3" y1="12" x2="8" y2="12" />
          <line x1="16" y1="12" x2="21" y2="12" />
        </svg>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#e2e8f0', lineHeight: 1 }}>
            Clinical Workspace
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              color: 'var(--text-muted)',
              letterSpacing: '0.1em',
              marginTop: 2,
            }}
          >
            DICOM VIEWER &nbsp;+&nbsp; EXPLAINABLE AI
          </div>
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          padding: 14,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          flex: 1,
        }}
      >
        {/* DICOM mock viewer */}
        <DicomViewer selectedCase={selectedCase} />

        {/* Case summary strip */}
        {selectedCase && (
          <div
            className="card animate-fade-up"
            style={{ padding: '10px 14px' }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#e2e8f0',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {selectedCase.patient}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    color: 'var(--text-muted)',
                    marginTop: 2,
                  }}
                >
                  {selectedCase.study} &middot; {selectedCase.id}
                </div>
              </div>

              {selectedCase.priority && (() => {
                const colors = {
                  P1: '#ef4444', P2: '#f59e0b', P3: '#10b981',
                }
                const bgs = {
                  P1: 'rgba(239,68,68,0.12)', P2: 'rgba(245,158,11,0.10)', P3: 'rgba(16,185,129,0.10)',
                }
                const borders = {
                  P1: 'rgba(239,68,68,0.32)', P2: 'rgba(245,158,11,0.28)', P3: 'rgba(16,185,129,0.26)',
                }
                return (
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 9,
                      fontWeight: 600,
                      color: colors[selectedCase.priority],
                      background: bgs[selectedCase.priority],
                      border: `1px solid ${borders[selectedCase.priority]}`,
                      borderRadius: 4,
                      padding: '3px 8px',
                      letterSpacing: '0.06em',
                      flexShrink: 0,
                      marginLeft: 8,
                    }}
                  >
                    {selectedCase.priority}
                  </span>
                )
              })()}
            </div>

            {/* Clinical indication */}
            <div
              style={{
                marginTop: 7,
                paddingTop: 7,
                borderTop: '1px solid var(--border-dim)',
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                color: 'var(--text-muted)',
                lineHeight: 1.55,
              }}
            >
              <span style={{ color: 'var(--text-secondary)' }}>
                Indication:{' '}
              </span>
              {selectedCase.indication}
            </div>
          </div>
        )}

        {/* XAI report section */}
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-dim)',
            borderRadius: 8,
            padding: '12px 14px',
            flex: 1,
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              color: 'var(--accent)',
              letterSpacing: '0.14em',
              marginBottom: 13,
              display: 'flex',
              alignItems: 'center',
              gap: 7,
            }}
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="2"
            >
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
            XAI ANALYSIS REPORT
          </div>
          <XAIPanel selectedCase={selectedCase} />
        </div>
      </div>
    </div>
  )
}
