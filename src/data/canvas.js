// Layout of the site canvas. Presentation only: copy lives in site.js / projects.js and the region components.
//
// The whole site is one board. Each route is a region on it; visiting the route glides the board there.
// Coordinates are CSS pixels and only apply on the desktop/tablet canvas; on phones the regions stack
// in the order listed here.
//
// Region heights are measured from their content, except Work, whose project frames are positioned
// absolutely and so need an explicit height.

export const REGIONS = [
  { id: 'home', path: '/', label: 'Home', x: 40, y: 72, width: 640 },
  { id: 'work', path: '/work', label: 'Work', x: 780, y: 72, width: 1720, height: 1080 },
  { id: 'about', path: '/about', label: 'About', x: 40, y: 1260, width: 1140 },
  { id: 'contact', path: '/contact', label: 'Contact', x: 1300, y: 1260, width: 580 },
]

export const regionForPath = (pathname) => REGIONS.find((r) => r.path === pathname)

// Named groups inside the text regions, shown in the editor's Layers panel. Each id matches a
// `data-layer` attribute in regions.jsx. Work's layers come from FRAMES below.
export const REGION_LAYERS = {
  home: [
    { id: 'home-intro', name: 'Intro' },
    { id: 'home-approach', name: 'How I approach design' },
    { id: 'home-system', name: 'Consistency starts with a system' },
  ],
  about: [
    { id: 'about-intro', name: 'About me' },
    { id: 'about-skills', name: 'Skills & capabilities' },
    { id: 'about-education', name: 'Education' },
    { id: 'about-experience', name: 'Experience' },
  ],
  contact: [
    { id: 'contact-intro', name: 'Contact me' },
    { id: 'contact-details', name: 'Contact details' },
    { id: 'contact-links', name: 'Links' },
  ],
}

// Inside the Work region. Frames sit below the region's heading; cards sit inside their frame.
//
// variant: 'feature' -> large, for the lead case studies
//          'plate'   -> illustration on its own backdrop
//          'browser' -> landing page in a slim browser frame

const FRAMES_TOP = 200

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
