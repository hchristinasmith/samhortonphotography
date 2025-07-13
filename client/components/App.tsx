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
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-md py-4 px-6 border-b border-neutral-800">
        <nav className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-light tracking-wider">
            SAM HORTON PHOTOGRAPHY
          </div>
          <div className="flex gap-8 font-light">
            <a href="/" className="hover:text-neutral-400 transition-colors">Portfolio</a>
            <a href="/about" className="hover:text-neutral-400 transition-colors">About</a>
            <a href="/contact" className="hover:text-neutral-400 transition-colors">Contact</a>
          </div>
        </nav>
      </header>
      
      <main className="pt-20">
        <Outlet />
      </main>
      
      <footer className="py-8 px-6 mt-16 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto text-center text-sm text-neutral-400">
          <p> {new Date().getFullYear()} Sam Horton Photography. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default App