import { Outlet } from 'react-router'
import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import '../styles/app.css'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

function App() {
  useEffect(() => {
    // Initialize any global GSAP animations here
    gsap.to('body', { 
      opacity: 1, 
      duration: 1.5, 
      ease: 'power2.inOut' 
    })
  }, [])

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Main Content */}
      <main>
        <div className="fixed top-6 left-6 z-50">
          <h1 className="text-xl font-light tracking-widest uppercase">
            SAM HORTON PHOTOGRAPHY
          </h1>
        </div>
        <Outlet />
      </main>
      
      {/* Footer */}
      <footer className="fixed bottom-6 right-6 z-40 text-xs font-light text-neutral-400">
        <p>{new Date().getFullYear()} &copy; All rights reserved</p>
      </footer>
      
      {/* Navigation */}
      <header className="fixed bottom-6 left-0 right-0">
        <nav className="flex justify-center">
          <ul className="flex items-center gap-2 font-light text-sm">
          
          <li>
              <a 
                href="/" 
                className="hover:text-neutral-400 transition-colors uppercase tracking-wider"
              >
                Home
              </a>
            </li>
            |
            <li>
              <a 
                href="/landscape" 
                className="hover:text-neutral-400 transition-colors uppercase tracking-wider"
              >
                Landscapes
              </a>
            </li>
            |
            <li>
              <a 
                href="/portrait" 
                className="hover:text-neutral-400 transition-colors uppercase tracking-wider"
              >
                Portraits
              </a>
            </li>
            |
            <li>
              <a 
                href="/contact" 
                className="hover:text-neutral-400 transition-colors uppercase tracking-wider"
              >
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </header>
    </div>
  )
}

export default App