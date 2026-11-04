import { BrowserRouter, Navigate, Route, Routes, useParams } from 'react-router-dom'
import Layout from './components/Layout'
import SiteCanvas from './components/canvas/SiteCanvas'
import ProjectDetail from './pages/ProjectDetail'
import NotFound from './pages/NotFound'
import { REGIONS } from './data/canvas'

// Links from when the canvas lived under /canvas.
function CanvasRedirect() {
  const { section } = useParams()
  return <Navigate to={`/${section ?? ''}`} replace />
}

// The whole portfolio is one canvas. Every section frame has its own route, all under one layout route so
// the canvas stays mounted and changing section glides the board instead of loading a page.
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route element={<SiteCanvas />}>
            {REGIONS.map((r) =>
              r.path === '/' ? <Route key={r.id} index element={null} /> : <Route key={r.id} path={r.path.slice(1)} element={null} />,
            )}
          </Route>
          <Route path="canvas" element={<CanvasRedirect />} />
          <Route path="canvas/:section" element={<CanvasRedirect />} />
          <Route path="work/:slug" element={<ProjectDetail />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
