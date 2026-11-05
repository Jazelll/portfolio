// Layout of the portfolio canvas. Presentation only: copy lives in site.js / projects.js and the
// region components.
//
// The whole portfolio is one board of frames, one per section. Each section has its own route; visiting
// it glides the board there, and panning to another frame updates the URL.
//
// Frames are laid out in rows: `row` picks the row, frames sit left to right in listed order, and row
// heights come from the measured content (see SiteCanvas), so longer copy can't make frames overlap.
// Only `width` is fixed; `est` is a rough height for the first paint.
// On phones the frames stack in the order listed here.

export const LAYOUT = { originX: 40, originY: 72, colGap: 140, rowGap: 180 }

export const REGIONS = [
  { id: 'home', path: '/', label: 'Introduction', row: 0, width: 1180, est: 980 },
  { id: 'work', path: '/work', label: 'Selected work', row: 0, width: 1780, est: 1380 },
  { id: 'approach', path: '/approach', label: 'Approach', row: 1, width: 1280, est: 760 },
  { id: 'system', path: '/system', label: 'Design system', row: 1, width: 1380, est: 1500 },
  { id: 'about', path: '/about', label: 'About', row: 2, width: 1180, est: 1100 },
  { id: 'skills', path: '/skills', label: 'Skills', row: 2, width: 960, est: 700 },
  { id: 'education', path: '/education', label: 'Education', row: 2, width: 560, est: 420 },
  { id: 'contact', path: '/contact', label: 'Contact', row: 3, width: 1180, est: 760 },
]

REGIONS.forEach((r, i) => {
  r.number = String(i + 1).padStart(2, '0')
})

export const regionForPath = (pathname) => REGIONS.find((r) => r.path === pathname)

// Sticky notes left on the board by Althea, set in the gaps between frames (never over content).
// Each is anchored to a frame: `below` sits in the row gap under it, `right` beside it; dx/dy offset from
// that frame's left/top edge. Keep them few: they're a hint of a shared workspace, not decoration.
export const STICKY_NOTES = [
  {
    id: 'welcome',
    region: 'home',
    anchor: 'below',
    dx: 24,
    rotate: -2,
    text: 'Hi! This whole portfolio is one canvas. Drag around, or jump between pages on the left.',
  },
  {
    id: 'open-project',
    region: 'work',
    anchor: 'below',
    dx: 1300,
    rotate: 1.5,
    text: 'Tip: select a project, then click it again (or double-click) to open the full case study.',
  },
  {
    id: 'system-story',
    region: 'system',
    anchor: 'below',
    dx: 40,
    rotate: -1.5,
    text: 'Curious how the system came together? I’m happy to walk you through it.',
    link: { to: '/contact', label: 'Say hello →' },
  },
  {
    id: 'availability',
    region: 'contact',
    anchor: 'right',
    dx: 56,
    dy: 48,
    rotate: 2,
    text: 'Currently open to new roles and collaborations.',
  },
]

// Rough positions before anything is measured (first paint), from the estimated heights.
export function estimateLayout() {
  const rows = []
  REGIONS.forEach((r) => {
    rows[r.row] ??= []
    rows[r.row].push(r)
  })
  const pos = {}
  let y = LAYOUT.originY
  rows.forEach((row) => {
    let x = LAYOUT.originX
    row.forEach((r) => {
      pos[r.id] = { x, y }
      x += r.width + LAYOUT.colGap
    })
    y += Math.max(...row.map((r) => r.height ?? r.est)) + LAYOUT.rowGap
  })
  return pos
}

// Named layers inside each frame, shown in the editor's Layers panel. Each id matches a `data-layer`
// attribute in regions.jsx. Work's layers come from FRAMES below.
export const REGION_LAYERS = {
  home: [
    { id: 'home-intro', name: 'Opening statement', kind: 'group' },
    { id: 'home-facts', name: 'Profile facts', kind: 'frame' },
  ],
  approach: [
    { id: 'approach-understand', name: '01 Understand', kind: 'frame' },
    { id: 'approach-structure', name: '02 Structure', kind: 'frame' },
    { id: 'approach-design', name: '03 Design', kind: 'frame' },
    { id: 'approach-refine', name: '04 Refine', kind: 'frame' },
  ],
  system: [
    { id: 'system-contribution', name: 'My contribution', kind: 'frame' },
    { id: 'system-foundations', name: 'A · Foundations', kind: 'frame' },
    { id: 'system-library', name: 'B · Component library', kind: 'frame' },
    { id: 'system-states', name: 'C · Interaction states', kind: 'frame' },
    { id: 'system-platforms', name: 'D · Cross-platform', kind: 'frame' },
    { id: 'system-tokens', name: 'E · Design tokens', kind: 'frame' },
  ],
  about: [
    { id: 'about-intro', name: 'About me', kind: 'frame' },
    { id: 'about-experience', name: 'Experience', kind: 'frame' },
  ],
  skills: [
    { id: 'skills-sheet', name: 'Specification sheet', kind: 'frame' },
    { id: 'skills-1', name: 'Product design', kind: 'group' },
    { id: 'skills-2', name: 'Interface design', kind: 'group' },
    { id: 'skills-3', name: 'Design systems', kind: 'group' },
    { id: 'skills-4', name: 'Tools', kind: 'group' },
    { id: 'skills-5', name: 'Collaboration', kind: 'group' },
  ],
  education: [{ id: 'education-credential', name: 'Credential', kind: 'frame' }],
  contact: [
    { id: 'contact-invitation', name: 'Invitation', kind: 'group' },
    { id: 'contact-details', name: 'Details', kind: 'frame' },
  ],
}

// Inside the Work frame. Project frames are positioned in an area below its header (so the header can grow
// freely); cards sit inside their frame. y starts below 0 to leave room for each frame's name label.
//
// variant: 'feature' -> large, for the lead case studies
//          'plate'   -> illustration on its own backdrop
//          'browser' -> landing page in a slim browser frame

const FRAMES_TOP = 28

export const FRAMES = [
  {
    id: 'product',
    label: 'Product design',
    x: 0,
    y: FRAMES_TOP,
    width: 980,
    height: 870,
    cards: [
      { slug: 'fido', variant: 'feature', x: 36, y: 40, width: 470 },
      { slug: 'fixo', variant: 'feature', x: 546, y: 96, width: 400 },
      { slug: 'memoire', variant: 'plate', x: 90, y: 470, width: 330 },
      { slug: 'financial-platforms', variant: 'plate', x: 470, y: 500, width: 380 },
    ],
  },
  {
    id: 'web',
    label: 'Landing pages & web',
    x: 1040,
    y: FRAMES_TOP,
    width: 660,
    height: 700,
    cards: [
      { slug: 'the-pasta-place', variant: 'browser', x: 32, y: 40, width: 280 },
      { slug: 'gcrait', variant: 'browser', x: 344, y: 90, width: 280 },
      { slug: 'animation-festival', variant: 'browser', x: 48, y: 350, width: 280 },
      { slug: 'access-ph', variant: 'browser', x: 360, y: 400, width: 264 },
    ],
  },
]

export const NOTE = { x: 1070, y: FRAMES_TOP + 742, width: 290 }

// Height of the area the project frames sit in.
export const FRAMES_HEIGHT = Math.max(...FRAMES.map((f) => f.y + f.height))
