import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import SiteCanvas from './components/canvas/SiteCanvas'
import ProjectDetail from './pages/ProjectDetail'
import NotFound from './pages/NotFound'

// Home, Work, About and Contact are regions of one canvas. They share a single layout route so the
// canvas stays mounted and a route change glides the board instead of loading a new page.
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route element={<SiteCanvas />}>
            <Route index element={null} />
            <Route path="work" element={null} />
            <Route path="about" element={null} />
            <Route path="contact" element={null} />
          </Route>
          <Route path="canvas" element={<Navigate to="/work" replace />} />
          <Route path="work/:slug" element={<ProjectDetail />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
