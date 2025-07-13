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
    <div className="bg-black text-white min-h-screen pt-20">
      {/* Portfolio Header with reduced opacity */}
      <div 
        ref={headerRef} 
        className="relative h-64 md:h-96 overflow-hidden flex items-center justify-center"
      >
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-60" 
          style={{ 
            backgroundImage: 'url(/shcaptured/Photo 08-04-2025, 2 19 25 PM.jpg)', 
            filter: 'brightness(0.4)' 
          }}
        ></div>
      </div>

      {/* Portfolio Description */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <p className="text-lg text-neutral-300 mb-8">
          My landscape photography focuses on capturing the raw beauty of nature. From dramatic mountain 
          ranges to serene coastal scenes, I strive to convey the emotion and atmosphere of each location.
          Each image is carefully composed and edited to highlight the natural elements that make these 
          landscapes so captivating.
        </p>
      </div>

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
            landscapePhotos.map((photo, index) => (
              <div 
                key={photo.id} 
                className={`horizontal-scroll-panel bg-neutral-${900 - (index % 3) * 100}`}
              >
                <img 
                  src={photo.link} 
                  alt={photo.name} 
                  className="w-full h-full object-cover"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                  }}
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
