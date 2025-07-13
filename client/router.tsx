import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router'

import App from './components/App'
import Home from './components/Home'
import LandscapePortfolio from './components/LandscapePortfolio'
import PortraitPortfolio from './components/PortraitPortfolio'

const routes = createRoutesFromElements(
  <Route path="/" element={<App />}>
    <Route index element={<Home />} />
    <Route path="portfolio/landscape" element={<LandscapePortfolio />} />
    <Route path="portfolio/portrait" element={<PortraitPortfolio />} />
  </Route>
)

const router = createBrowserRouter(routes)

export default router