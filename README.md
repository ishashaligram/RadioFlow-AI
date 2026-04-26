# RadioFlow AI — Radiology Orchestration & Triage

A production-grade Clinical Decision Support System (CDSS) built with React + Vite + Tailwind CSS.

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
radioflow-ai/
├── index.html                      # Vite entry point
├── vite.config.js                  # Vite config with React plugin
├── tailwind.config.js              # Tailwind (content paths, custom fonts)
├── postcss.config.js               # PostCSS (autoprefixer)
├── package.json
└── src/
    ├── main.jsx                    # ReactDOM.createRoot entry
    ├── App.jsx                     # Root orchestration — state machine + triage engine
    ├── index.css                   # Design tokens, keyframes, global primitives
    ├── data.js                     # Mock cases, AI findings, priority config, triage steps
    ├── hooks.js                    # useElapsed, useToasts
    └── components/
        ├── Header.jsx              # Top nav — branding, stats, elapsed timer, system status
        ├── Toast.jsx               # P1 critical alert toasts (fixed overlay)
        ├── Worklist.jsx            # Left pane — sortable table + triage controls
        ├── DicomViewer.jsx         # Mock DICOM viewer with scan-line animation
        ├── XAIPanel.jsx            # Explainable AI report (finding, rationale, safety log)
        └── ClinicalWorkspace.jsx   # Right pane — composes DicomViewer + XAIPanel
```

## Architecture Overview

### State Machine (App.jsx)
The root component owns all shared state. The triage engine is an `async` function that:
1. Marks all cases `"processing"` 
2. Steps through 5 pipeline stages with animated labels
3. Assigns randomised AI findings from a curated pool
4. Triggers P1 toast notifications with staggered timing
5. Clears row highlight animations after 2.2s

### Performance
- `useMemo` for worklist sort and selected case lookup
- `useMemo` for priority count statistics
- `requestAnimationFrame` loop for smooth DICOM scan-line
- CSS transitions for confidence bar fill and row highlights

### Design System
- **Fonts**: IBM Plex Mono (data/labels) + Syne (headings/UI)
- **Theme**: Dark clinical — Slate-900 base, navy surfaces, indigo accents
- **Colours**: CSS custom properties on `:root` for theming consistency
- **Animations**: Pure CSS keyframes (pulse, spin, fadeUp, rowFlash, slideInRight)

## Customisation

### Adding Cases
Edit `INITIAL_CASES` in `src/data.js`. Each case needs:
```js
{ id, patient, age, study, modality, received, mrn, referrer, indication }
```

### Adding AI Findings
Edit `AI_FINDINGS` in `src/data.js`. Each entry:
```js
{ finding, priority, confidence, rationale, safetyChecks[] }
```

### Priority Config
`PRIORITY_CONFIG` controls colours and sort order for P1/P2/P3.

## Tech Stack
- **React 18** — UI framework
- **Vite 5** — build tool + HMR
- **Tailwind CSS 3** — utility classes (minimal usage; design tokens prefer CSS vars)
- **IBM Plex Mono + Syne** — Google Fonts
- **lucide-react** — icon library (available, used selectively)
