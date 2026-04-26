import React, { useState, useMemo, useCallback } from 'react'

import Header from './components/Header'
import Toast from './components/Toast'
import Worklist from './components/Worklist'
import ClinicalWorkspace from './components/ClinicalWorkspace'

import { INITIAL_CASES, AI_FINDINGS, PRIORITY_CONFIG, TRIAGE_STEPS } from './data'
import { useToasts } from './hooks'

// ─────────────────────────────────────────────────────────────────────────────
//  RadioFlow AI — Root Orchestration Component
//  Single Responsibility: state machine + triage engine coordination
// ─────────────────────────────────────────────────────────────────────────────

const SYSTEM_DATE = new Date().toLocaleDateString('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

/**
 * Randomly assigns AI findings to cases.
 * Ensures at least one P1 if numCases >= 3.
 */
function assignFindings(cases) {
  // Shuffle a copy of the findings pool
  const pool = [...AI_FINDINGS].sort(() => Math.random() - 0.5)

  // Cycle through pool if we have more cases than findings
  return cases.map((c, i) => {
    const f = pool[i % pool.length]
    return {
      ...c,
      aiStatus: 'complete',
      priority: f.priority,
      finding: f.finding,
      confidence: f.confidence,
      rationale: f.rationale,
      safetyChecks: f.safetyChecks,
      highlighted: true,
    }
  })
}

export default function App() {
  // ── Core state ──────────────────────────────────────────────────────────────
  const [cases, setCases] = useState(INITIAL_CASES)
  const [selectedId, setSelectedId] = useState(null)
  const [isRunning, setIsRunning] = useState(false)
  const [triageStep, setTriageStep] = useState(-1)
  const [triageStartTime, setTriageStartTime] = useState(null)
  const [hasRun, setHasRun] = useState(false)

  // ── Toast notifications ─────────────────────────────────────────────────────
  const [toasts, addToast, dismissToast] = useToasts()

  // ── Derived state ───────────────────────────────────────────────────────────

  /** Priority-sorted worklist — memoized so it only recalculates when cases change */
  const sortedCases = useMemo(() => {
    return [...cases].sort((a, b) => {
      // Processed cases always sort above pending ones
      if (a.priority && b.priority) {
        return (
          PRIORITY_CONFIG[a.priority].order - PRIORITY_CONFIG[b.priority].order
        )
      }
      if (a.priority) return -1
      if (b.priority) return 1
      return 0
    })
  }, [cases])

  /** Currently selected case object */
  const selectedCase = useMemo(
    () => cases.find((c) => c.id === selectedId) ?? null,
    [cases, selectedId]
  )

  /** Priority counts for header stats */
  const stats = useMemo(
    () => ({
      p1: cases.filter((c) => c.priority === 'P1').length,
      p2: cases.filter((c) => c.priority === 'P2').length,
      p3: cases.filter((c) => c.priority === 'P3').length,
    }),
    [cases]
  )

  // ── Triage engine ───────────────────────────────────────────────────────────

  /**
   * runTriage — the core orchestration function.
   * 1. Marks all cases as "processing"
   * 2. Steps through each TRIAGE_STEPS label with a delay
   * 3. Assigns AI findings, triggers P1 toasts, then clears highlights
   */
  const runTriage = useCallback(async () => {
    if (isRunning) return

    setIsRunning(true)
    setHasRun(true)
    setTriageStartTime(Date.now())

    // Reset all to processing
    setCases((prev) =>
      prev.map((c) => ({
        ...c,
        aiStatus: 'processing',
        priority: null,
        finding: null,
        confidence: null,
        rationale: null,
        safetyChecks: null,
        highlighted: false,
      }))
    )

    // Step through pipeline labels
    for (let s = 0; s < TRIAGE_STEPS.length; s++) {
      setTriageStep(s)
      await new Promise((r) => setTimeout(r, 680))
    }

    // Assign findings
    const processed = assignFindings(INITIAL_CASES)
    setCases(processed)

    // Fire P1 toasts with stagger
    const criticals = processed.filter((c) => c.priority === 'P1')
    criticals.forEach((c, i) => {
      setTimeout(
        () =>
          addToast({
            patient: c.patient,
            finding: c.finding,
            confidence: c.confidence,
          }),
        i * 550
      )
    })

    // Clear row highlights after animation completes
    setTimeout(() => {
      setCases((prev) => prev.map((c) => ({ ...c, highlighted: false })))
    }, 2200)

    // Reset engine state
    setIsRunning(false)
    setTriageStep(-1)
    setTriageStartTime(null)
  }, [isRunning, addToast])

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg-base)',
        overflow: 'hidden',
      }}
    >
      {/* Floating critical alerts */}
      <Toast toasts={toasts} onDismiss={dismissToast} />

      {/* Top nav */}
      <Header
        stats={stats}
        triageStartTime={triageStartTime}
        systemDate={SYSTEM_DATE}
      />

      {/* Main two-pane workspace */}
      <main
        style={{
          display: 'flex',
          flex: 1,
          overflow: 'hidden',
          minHeight: 0,
        }}
      >
        {/* Left — Radiology Worklist */}
        <Worklist
          cases={sortedCases}
          selectedId={selectedId}
          onSelect={setSelectedId}
          isRunning={isRunning}
          step={triageStep}
          hasRun={hasRun}
          onRunTriage={runTriage}
        />

        {/* Right — Clinical Workspace (DICOM + XAI) */}
        <ClinicalWorkspace selectedCase={selectedCase} />
      </main>
    </div>
  )
}
