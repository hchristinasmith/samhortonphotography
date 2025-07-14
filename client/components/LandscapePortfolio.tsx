import { useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getLocalPhotos } from '../apiClient'

// Import portfolio styles
import '../styles/portfolio.css'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

const LandscapePortfolio = () => {
  // Refs for GSAP animations
  const headerRef = useRef<HTMLDivElement>(null)
  const horizontalRef = useRef<HTMLDivElement>(null)
  const panelsRef = useRef<HTMLDivElement>(null)

  // Fetch photos from local shcaptured folder
  const {
    data: photos,
    isError,
    isPending,
  } = useQuery({
    queryKey: ['local-photos'],
    queryFn: () => getLocalPhotos(),
  })

  // Use all photos from the local folder for now
  // In a production app, you'd filter based on folder structure, metadata, or naming conventions
  const landscapePhotos = photos

  // Initialize GSAP animations
  useEffect(() => {
    // Header animation
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: -50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
        }
      )
    }

    // Horizontal scroll animation
    if (horizontalRef.current && panelsRef.current) {
      const panels = panelsRef.current.children
      const totalPanels = panels.length
      const panelsElement = panelsRef.current
      
      gsap.to(panelsElement, {
        x: () => -(panelsElement.scrollWidth - window.innerWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: horizontalRef.current,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: () => `+=${panelsElement.scrollWidth - window.innerWidth}`,
        },
      })
    }

    // Clean up ScrollTrigger instances on unmount
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [photos])

  return (
    <div className="bg-black text-white min-h-screen">

     
      {/* Horizontal Scroll Section with Landscape Photos */}
      <section ref={horizontalRef} className="horizontal-scroll">
        <div ref={panelsRef} className="horizontal-scroll-content">
          {isPending && (
            <div className="horizontal-scroll-panel bg-neutral-900 flex items-center justify-center">
              <div className="loading-spinner"></div>
            </div>
          )}
          
          {isError && (
            <div className="horizontal-scroll-panel bg-neutral-900 flex items-center justify-center">
              <div className="text-center text-red-400">
                Error loading photos. Please try again later.
              </div>
            </div>
          )}
          
          {landscapePhotos && landscapePhotos.length > 0 ? (
            landscapePhotos.map((photo) => (
              <div 
                key={photo.id} 
                className="horizontal-scroll-panel"
              >
                <img 
                  src={photo.link} 
                  alt={photo.name || `Landscape photo`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            ))
          ) : (
            <div className="horizontal-scroll-panel bg-neutral-900 flex items-center justify-center">
              <div className="text-center text-neutral-400">
                No landscape photos found.
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Back to Portfolio Link */}
      <div className="text-center pb-16">
        <a 
          href="/" 
          className="inline-block px-6 py-2 border border-white text-white hover:bg-white hover:text-black transition-colors rounded-md"
        >
          Back to Home
        </a>
      </div>
    </div>
  )
}

export default LandscapePortfolio
