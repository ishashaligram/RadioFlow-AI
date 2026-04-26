import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * Tracks elapsed milliseconds since `startTime`.
 * Returns 0 when startTime is null (idle).
 */
export function useElapsed(startTime) {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (!startTime) {
      setElapsed(0)
      return
    }
    const id = setInterval(() => setElapsed(Date.now() - startTime), 1000)
    return () => clearInterval(id)
  }, [startTime])

  return elapsed
}

/**
 * Minimal toast queue manager.
 * Returns [toasts, addToast, dismissToast]
 */
export function useToasts() {
  const [toasts, setToasts] = useState([])
  const counter = useRef(0)

  const dismiss = useCallback((id) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, removing: true } : t))
    )
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 320)
  }, [])

  const add = useCallback(
    (payload) => {
      const id = ++counter.current
      setToasts((prev) => [...prev, { id, removing: false, ...payload }])
      const DISPLAY_MS = 5000
      const ANIMATE_MS = 320
      setTimeout(() => {
        setToasts((prev) =>
          prev.map((t) => (t.id === id ? { ...t, removing: true } : t))
        )
      }, DISPLAY_MS - ANIMATE_MS)
      setTimeout(
        () => setToasts((prev) => prev.filter((t) => t.id !== id)),
        DISPLAY_MS
      )
      return id
    },
    []
  )

  return [toasts, add, dismiss]
}
