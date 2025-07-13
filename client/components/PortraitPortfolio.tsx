import { useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getLocalPhotos } from '../apiClient'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

const PortraitPortfolio = () => {
  // Refs for GSAP animations
  const headerRef = useRef<HTMLDivElement>(null)
  const galleryRef = useRef<HTMLDivElement>(null)

  // Fetch photos from local shcaptured folder
  const {
    data: photos,
    isError,
    isPending,
  } = useQuery({
    queryKey: ['local-photos'],
    queryFn: () => getLocalPhotos(),
  })

  // Filter photos that might be portraits (based on naming convention or other criteria)
  // This is a simple filter - you might want to use a more sophisticated approach
  const portraitPhotos = photos?.filter((photo, index) => {
    // For demo purposes, let's consider odd-indexed photos as portraits
    // In a real app, you'd filter based on folder structure, metadata, or naming conventions
    return index % 2 === 1
  })

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

    // Gallery animations
    if (galleryRef.current) {
      const items = galleryRef.current.querySelectorAll('.gallery-item')
      gsap.fromTo(
        items,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: galleryRef.current,
            start: 'top 80%',
          },
        }
      )
    }

    // Clean up ScrollTrigger instances on unmount
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [photos])

  return (
    <div className="bg-black text-white min-h-screen pt-20">
      {/* Portfolio Header */}
      <div 
        ref={headerRef} 
        className="relative h-64 md:h-96 overflow-hidden flex items-center justify-center"
      >
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ 
            backgroundImage: 'url(https://source.unsplash.com/random/1920x1080/?portrait,people)', 
            filter: 'brightness(0.5)' 
          }}
        ></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-light mb-4">Portrait Photography</h1>
          <p className="text-xl text-neutral-200 max-w-2xl mx-auto">
            Capturing personality and emotion in every frame
          </p>
        </div>
      </div>

      {/* Portfolio Description */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <p className="text-lg text-neutral-300 mb-8">
          My portrait photography is about revealing the authentic character of each subject. 
          I work closely with individuals to create images that reflect their unique personality 
          and story. Using natural light and thoughtful composition, I aim to create portraits 
          that are both visually striking and emotionally resonant.
        </p>
      </div>

      {/* Gallery */}
      <div ref={galleryRef} className="max-w-7xl mx-auto px-6 pb-20">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portraitPhotos.map((photo) => (
              <div key={photo.id} className="gallery-item overflow-hidden rounded-lg">
                <img 
                  src={photo.link} 
                  alt={photo.name} 
                  className="w-full h-96 object-cover transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-neutral-400 py-12">
            No portrait photos found.
          </div>
        )}
      </div>

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

export default PortraitPortfolio
