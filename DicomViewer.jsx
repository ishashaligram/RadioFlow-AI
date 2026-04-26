import React, { useEffect, useRef } from 'react'

/**
 * Renders a stylised mock DICOM viewer with:
 * - Organ-appropriate SVG anatomy (chest, head, spine)
 * - Pathology overlay coloured by priority
 * - A continuous scan-line animation
 * - DICOM-style metadata overlay text
 */
export default function DicomViewer({ selectedCase }) {
  const scanRef = useRef(null)

  // Continuous scan-line animation via rAF
  useEffect(() => {
    let animId
    let pos = 0
    const tick = () => {
      pos = (pos + 0.35) % 102
      if (scanRef.current) scanRef.current.style.top = `${pos}%`
      animId = requestAnimationFrame(tick)
    }
    animId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animId)
  }, [])

  const pathologyColor =
    selectedCase?.priority === 'P1'
      ? { fill: 'rgba(239,68,68,0.18)', stroke: 'rgba(239,68,68,0.55)' }
      : selectedCase?.priority === 'P2'
      ? { fill: 'rgba(245,158,11,0.14)', stroke: 'rgba(245,158,11,0.48)' }
      : null

  const isChest =
    selectedCase &&
    (selectedCase.study.includes('Chest') ||
      selectedCase.study.includes('CXR'))

  const isHead =
    selectedCase && selectedCase.study.includes('Head')

  const isSpine =
    selectedCase && selectedCase.study.includes('Spine')

  return (
    <div
      style={{
        background: '#000',
        borderRadius: 8,
        border: '1px solid var(--border-dim)',
        overflow: 'hidden',
        position: 'relative',
        height: 228,
        flexShrink: 0,
      }}
    >
      {/* Background gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 72% 82% at 50% 50%, #18263a 0%, #000 100%)',
        }}
      />

      {/* Anatomy SVG */}
      <svg
        viewBox="0 0 300 228"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity: selectedCase ? 0.75 : 0.1,
          transition: 'opacity 0.5s ease',
        }}
      >
        {!selectedCase && (
          <text
            x="150"
            y="120"
            textAnchor="middle"
            fill="rgba(99,179,237,0.25)"
            fontSize="11"
            fontFamily="IBM Plex Mono, monospace"
            letterSpacing="4"
          >
            NO STUDY LOADED
          </text>
        )}

        {/* CHEST / CXR */}
        {isChest && (
          <>
            {/* Thoracic cage */}
            <ellipse cx="150" cy="128" rx="92" ry="84" fill="none" stroke="#1e3a5a" strokeWidth="1.5" />
            {/* Left lung */}
            <ellipse cx="113" cy="122" rx="47" ry="63" fill="#0a1520" stroke="#1e3a5a" strokeWidth="1" />
            {/* Right lung */}
            <ellipse cx="187" cy="122" rx="47" ry="63" fill="#0a1520" stroke="#1e3a5a" strokeWidth="1" />
            {/* Spine */}
            <path d="M150 62 C148 95 147 135 149 196" stroke="#243040" strokeWidth="5" fill="none" />
            {/* Heart */}
            <ellipse cx="140" cy="168" rx="28" ry="24" fill="#0d1f36" stroke="#1e3a5a" strokeWidth="1" />
            {/* Rib lines */}
            {[80, 100, 120, 140, 160].map((y, i) => (
              <path
                key={i}
                d={`M72 ${y} C90 ${y - 5} 110 ${y - 8} 150 ${y - 3} C190 ${y + 2} 210 ${y - 4} 228 ${y}`}
                fill="none"
                stroke="#16293a"
                strokeWidth="1"
              />
            ))}
            {/* Pathology overlay – left lung (PTX) or right (consolidation) */}
            {pathologyColor && selectedCase?.priority === 'P1' && (
              <ellipse
                cx="113"
                cy="118"
                rx="38"
                ry="52"
                fill={pathologyColor.fill}
                stroke={pathologyColor.stroke}
                strokeWidth="1"
                strokeDasharray="4,2"
              />
            )}
            {pathologyColor && selectedCase?.priority === 'P2' && (
              <ellipse
                cx="187"
                cy="138"
                rx="30"
                ry="36"
                fill={pathologyColor.fill}
                stroke={pathologyColor.stroke}
                strokeWidth="1"
                strokeDasharray="4,2"
              />
            )}
          </>
        )}

        {/* HEAD CT */}
        {isHead && (
          <>
            {/* Skull outer */}
            <ellipse cx="150" cy="114" rx="88" ry="94" fill="#0a1520" stroke="#1e3a5a" strokeWidth="1.5" />
            {/* Skull inner table */}
            <ellipse cx="150" cy="114" rx="78" ry="84" fill="none" stroke="#152535" strokeWidth="1" />
            {/* Brain parenchyma */}
            <ellipse cx="150" cy="108" rx="64" ry="72" fill="#0d1a28" stroke="#1a3048" strokeWidth="0.8" />
            {/* Falx cerebri */}
            <line x1="150" y1="38" x2="150" y2="182" stroke="#1e3a5a" strokeWidth="1.5" strokeDasharray="3,3" />
            {/* Sulci lines */}
            {[-30, -10, 10, 30].map((dx, i) => (
              <path
                key={i}
                d={`M${150 + dx} 50 C${148 + dx} 80 ${145 + dx} 120 ${147 + dx} 175`}
                fill="none"
                stroke="rgba(30,58,90,0.7)"
                strokeWidth="0.6"
              />
            ))}
            {/* Pathology overlay – temporal EDH (P1) */}
            {pathologyColor && selectedCase?.priority === 'P1' && (
              <path
                d="M185 72 C215 68 230 95 224 118 C218 138 198 145 182 126 Z"
                fill={pathologyColor.fill}
                stroke={pathologyColor.stroke}
                strokeWidth="1"
              />
            )}
          </>
        )}

        {/* SPINE CT */}
        {isSpine && (
          <>
            {/* Vertebral column */}
            <rect x="130" y="20" width="40" height="196" rx="4" fill="none" stroke="#1e3a5a" strokeWidth="1" />
            {/* Vertebral bodies */}
            {[30, 60, 90, 120, 150, 180].map((y, i) => (
              <rect
                key={i}
                x="125"
                y={y}
                width="50"
                height="22"
                rx="3"
                fill="#0d1a28"
                stroke="#1e3a5a"
                strokeWidth="1"
              />
            ))}
            {/* Disc spaces */}
            {[52, 82, 112, 142, 172].map((y, i) => (
              <rect
                key={i}
                x="130"
                y={y}
                width="40"
                height="6"
                rx="1"
                fill="#0a1220"
                stroke="#152535"
                strokeWidth="0.5"
              />
            ))}
            {/* Pedicle lines */}
            {[30, 60, 90, 120, 150, 180].map((y, i) => (
              <React.Fragment key={i}>
                <line x1="80" y1={y + 11} x2="125" y2={y + 11} stroke="#16293a" strokeWidth="1" />
                <line x1="175" y1={y + 11} x2="220" y2={y + 11} stroke="#16293a" strokeWidth="1" />
              </React.Fragment>
            ))}
            {/* Pathology – compression fracture at L2 (index 3) */}
            {pathologyColor && (
              <rect
                x="122"
                y={118}
                width="56"
                height="17"
                rx="2"
                fill={pathologyColor.fill}
                stroke={pathologyColor.stroke}
                strokeWidth="1"
                strokeDasharray="3,2"
              />
            )}
          </>
        )}
      </svg>

      {/* Scan-line */}
      <div
        ref={scanRef}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          height: 2,
          background:
            'linear-gradient(90deg, transparent 0%, rgba(59,130,246,0.55) 40%, rgba(99,179,237,0.7) 50%, rgba(59,130,246,0.55) 60%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Metadata overlay – top-left */}
      <div
        style={{
          position: 'absolute',
          top: 7,
          left: 9,
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          color: 'rgba(99,179,237,0.52)',
          lineHeight: 1.65,
          pointerEvents: 'none',
        }}
      >
        {selectedCase ? (
          <>
            <div>PT: {selectedCase.patient}</div>
            <div>
              MOD: {selectedCase.modality} &nbsp;|&nbsp; ACC: {selectedCase.id}
            </div>
            <div>DATE: 2026-04-26 &nbsp;{selectedCase.received}</div>
            <div>MRN: {selectedCase.mrn}</div>
          </>
        ) : (
          <div style={{ opacity: 0.4 }}>SELECT A STUDY</div>
        )}
      </div>

      {/* Metadata overlay – bottom-right */}
      <div
        style={{
          position: 'absolute',
          bottom: 7,
          right: 9,
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          color: 'rgba(99,179,237,0.28)',
          pointerEvents: 'none',
        }}
      >
        MOCK DICOM VIEWER v2.1 &nbsp;· &nbsp;W:1500 L:-600
      </div>

      {/* Priority overlay badge */}
      {selectedCase?.priority && (
        <div
          style={{
            position: 'absolute',
            top: 7,
            right: 9,
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            fontWeight: 600,
            color:
              selectedCase.priority === 'P1'
                ? '#ef4444'
                : selectedCase.priority === 'P2'
                ? '#f59e0b'
                : '#10b981',
            letterSpacing: '0.08em',
            animation:
              selectedCase.priority === 'P1'
                ? 'pulse 1s ease-in-out infinite'
                : 'none',
          }}
        >
          ● {selectedCase.priority}
        </div>
      )}
    </div>
  )
}
