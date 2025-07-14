import { useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getLocalPhotos } from '../apiClient'

// Import portfolio styles
import '../styles/portfolio.css'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

const PortraitPortfolio = () => {
  // Refs for GSAP animations
  const headerRef = useRef<HTMLDivElement>(null)
  const galleryRef = useRef<HTMLDivElement>(null)
  const portraitRefs = useRef<(HTMLDivElement | null)[]>([])
  
  // Clear the refs array when component re-renders
  portraitRefs.current = []

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
  const portraitPhotos = photos

  // Add to refs array
  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !portraitRefs.current.includes(el)) {
      portraitRefs.current.push(el)
    }
  }

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

    // Create reveal animations for portrait columns
    if (portraitRefs.current.length > 0) {
      // Create reveal animations for each portrait
      // For scrollable columns, we'll use a simpler animation approach
      // that doesn't rely on ScrollTrigger since each column has its own scroll context
      portraitRefs.current.forEach((portrait, index) => {
        if (!portrait) return
        
        // Calculate staggered delay based on position in its column
        const columnIndex = index % 3
        const positionInColumn = Math.floor(index / 3)
        const delay = 0.1 + (columnIndex * 0.1) + (positionInColumn * 0.05)
        
        gsap.fromTo(
          portrait,
          { 
            opacity: 0,
            y: 20,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
            delay: delay,
          }
        )
      })
    }

    // Clean up ScrollTrigger instances on unmount
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [photos])

  return (
    <div className="bg-black text-white min-h-screen flex flex-col">
      {/* Portrait Gallery with 3-Column Layout - Full Page */}
      <div ref={galleryRef} className="w-full h-screen">
        {isPending && (
          <div className="flex justify-center py-12">
            <div className="loading-spinner"></div>
          </div>
        )}
        
        {isError && (
          <div className="text-center text-red-400 py-12">
            Error loading photos. Please try again later.
          </div>
        )}
        
        {portraitPhotos && portraitPhotos.length > 0 ? (
          <div className="portrait-gallery-grid">
            {/* Column 1 */}
            <div className="portrait-column">
              {portraitPhotos
                .filter((_, index) => index % 3 === 0)
                .map((photo, index) => (
                  <div 
                    key={photo.id} 
                    ref={addToRefs}
                    className="portrait-grid-item"
                  >
                    <img 
                      src={photo.link} 
                      alt={`Portrait ${index * 3 + 1}`} 
                      className="portrait-grid-image"
                    />
                  </div>
                ))}
            </div>
            
            {/* Column 2 */}
            <div className="portrait-column">
              {portraitPhotos
                .filter((_, index) => index % 3 === 1)
                .map((photo, index) => (
                  <div 
                    key={photo.id} 
                    ref={addToRefs}
                    className="portrait-grid-item"
                  >
                    <img 
                      src={photo.link} 
                      alt={`Portrait ${index * 3 + 2}`} 
                      className="portrait-grid-image"
                    />
                  </div>
                ))}
            </div>
            
            {/* Column 3 */}
            <div className="portrait-column">
              {portraitPhotos
                .filter((_, index) => index % 3 === 2)
                .map((photo, index) => (
                  <div 
                    key={photo.id} 
                    ref={addToRefs}
                    className="portrait-grid-item"
                  >
                    <img 
                      src={photo.link} 
                      alt={`Portrait ${index * 3 + 3}`} 
                      className="portrait-grid-image"
                    />
                  </div>
                ))}
            </div>
          </div>
        ) : (
          <div className="text-center text-neutral-400 py-12">
            No portrait photos found.
          </div>
        )}
      </div>

    </div>
  )
}

export default PortraitPortfolio
