import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router'

import App from './components/App'
import Home from './components/Home'
import LandscapePortfolio from './components/LandscapePortfolio'
import PortraitPortfolio from './components/PortraitPortfolio'
import Contact from './components/Contact'

const routes = createRoutesFromElements(
  <Route path="/" element={<App />}>
    <Route index element={<Home />} />
    <Route path="landscape" element={<LandscapePortfolio />} />
    <Route path="portrait" element={<PortraitPortfolio />} />
    <Route path="contact" element={<Contact />} />
  </Route>
)

const router = createBrowserRouter(routes)

export default router