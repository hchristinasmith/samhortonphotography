import { useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getLocalPhotos } from '../apiClient'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

const Home = () => {
  // Refs for GSAP animations
  const heroRef = useRef<HTMLDivElement>(null)
  const staticSectionRef = useRef<HTMLDivElement>(null)
  const horizontalRef = useRef<HTMLDivElement>(null)
  const panelsRef = useRef<HTMLDivElement>(null)
  const parallaxRef = useRef<HTMLDivElement>(null)

  // Fetch photos from local shcaptured folder
  const {
    data: photos,
    isError,
    isPending,
  } = useQuery({
    queryKey: ['local-photos'],
    queryFn: () => getLocalPhotos(),
  })

  // Initialize GSAP animations
  useEffect(() => {
    // Hero section animation
    if (heroRef.current) {
      gsap.to(heroRef.current.querySelector('.hero-content'), {
        y: 0,
        opacity: 1,
        duration: 1.5,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top center',
          toggleActions: 'play none none reverse',
        },
      })
    }

    // Reveal animations for static content
    if (staticSectionRef.current) {
      const elements = staticSectionRef.current.querySelectorAll('.reveal')
      elements.forEach((el, index) => {
        gsap.fromTo(
          el,
          { y: 50, opacity: 0, visibility: 'hidden' },
          {
            y: 0,
            opacity: 1,
            visibility: 'visible',
            duration: 0.8,
            delay: index * 0.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el as Element,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      })
    }

    // Horizontal scroll animation
    if (horizontalRef.current && panelsRef.current) {
      const panels = panelsRef.current.children
      const totalPanels = panels.length
      
      gsap.to(panelsRef.current, {
        x: () => -(panelsRef.current.scrollWidth - window.innerWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: horizontalRef.current,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: () => `+=${panelsRef.current.scrollWidth - window.innerWidth}`,
        },
      })
    }

    // Parallax effect
    if (parallaxRef.current) {
      gsap.to(parallaxRef.current.querySelector('.parallax-bg'), {
        y: '20%',
        ease: 'none',
        scrollTrigger: {
          trigger: parallaxRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })
    }

    // Clean up ScrollTrigger instances on unmount
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [photos])

  return (
    <div className="overflow-x-hidden bg-black text-white">
      {/* Hero Section */}
      <section ref={heroRef} className="hero">
        <div 
          className="hero-image" 
          style={{ backgroundImage: 'url(https://source.unsplash.com/random/1920x1080/?landscape)', filter: 'brightness(0.7)' }}
        ></div>
        <div className="hero-content" style={{ opacity: 0, transform: 'translateY(50px)' }}>
          <h1 className="text-5xl font-light mb-4">SAM HORTON PHOTOGRAPHY</h1>
        </div>
      </section>

      {/* Portfolio Links Section */}
      <section className="py-16 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-light mb-12 text-center text-white">Portfolio</h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Landscape Portfolio Link */}
            <div className="relative overflow-hidden rounded-lg group cursor-pointer">
              <a href="/portfolio/landscape" className="block">
                <div className="relative h-80 overflow-hidden">
                  <img 
                    src="https://source.unsplash.com/random/800x600/?landscape,nature" 
                    alt="Landscape Photography" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <h3 className="text-3xl font-light text-white mb-2">Landscapes</h3>
                      <p className="text-neutral-200">Explore natural beauty</p>
                      <span className="inline-block mt-4 px-6 py-2 border border-white text-white group-hover:bg-white group-hover:text-black transition-colors">
                        View Gallery
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            </div>
            
            {/* Portrait Portfolio Link */}
            <div className="relative overflow-hidden rounded-lg group cursor-pointer">
              <a href="/portfolio/portrait" className="block">
                <div className="relative h-80 overflow-hidden">
                  <img 
                    src="https://source.unsplash.com/random/800x600/?portrait,people" 
                    alt="Portrait Photography" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <h3 className="text-3xl font-light text-white mb-2">Portraits</h3>
                      <p className="text-neutral-200">Capturing personalities</p>
                      <span className="inline-block mt-4 px-6 py-2 border border-white text-white group-hover:bg-white group-hover:text-black transition-colors">
                        View Gallery
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </div>
          
          <h2 className="text-3xl font-light mb-12 text-center text-white">Latest Work</h2>
          
          {isPending && (
            <div className="loading">
              <div className="loading-spinner"></div>
            </div>
          )}
          
          {isError && (
            <div className="text-center text-red-400">
              Error loading photos. Please try again later.
            </div>
          )}
          
          {photos && photos.length > 0 && (
            <div className="photo-grid">
              {photos.map((photo) => (
                <div key={photo.id} className="photo-item">
                  <img 
                    src={photo.link} 
                    alt={photo.name} 
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          )}
          
          {photos && photos.length === 0 && (
            <div className="text-center text-gray-400">
              No photos found. Add some photos to the shcaptured folder.
            </div>
          )}
        </div>
      </section>

      {/* Static Section - This won't be affected by photo updates */}
      <section ref={staticSectionRef} className="static-section bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-light mb-12 text-center reveal text-white">About My Work</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="reveal">
              <h3 className="text-xl font-medium mb-3 text-white">Landscapes</h3>
              <p className="text-gray-300">
                Capturing the beauty of nature in its most pristine form. From mountains to oceans,
                my landscape photography aims to transport you to these breathtaking locations.
              </p>
            </div>
            
            <div className="reveal">
              <h3 className="text-xl font-medium mb-3 text-white">Portraits</h3>
              <p className="text-gray-300">
                Every face tells a story. My portrait photography focuses on bringing out the unique
                personality and essence of each individual in a natural and authentic way.
              </p>
            </div>
            
            <div className="reveal">
              <h3 className="text-xl font-medium mb-3 text-white">Events</h3>
              <p className="text-gray-300">
                From weddings to corporate gatherings, I specialize in documenting special moments
                that you'll want to remember for years to come.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Horizontal Scroll Section */}
      <section ref={horizontalRef} className="horizontal-scroll">
        <div ref={panelsRef} className="horizontal-scroll-content">
          <div className="horizontal-scroll-panel bg-neutral-900">
            <div className="max-w-xl">
              <h2 className="text-3xl font-light mb-6 text-white">My Process</h2>
              <p className="text-lg text-gray-300">
                I believe in creating authentic images that tell a story. My approach combines technical expertise
                with artistic vision to capture moments that matter.
              </p>
            </div>
          </div>
          
          <div className="horizontal-scroll-panel bg-neutral-800">
            <div className="max-w-xl">
              <h2 className="text-3xl font-light mb-6 text-white">Equipment</h2>
              <p className="text-lg text-gray-300">
                Using professional-grade cameras and lenses to ensure the highest quality images.
                Every shot is carefully composed and expertly edited.
              </p>
            </div>
          </div>
          
          <div className="horizontal-scroll-panel bg-neutral-700">
            <div className="max-w-xl">
              <h2 className="text-3xl font-light mb-6 text-white">Delivery</h2>
              <p className="text-lg text-gray-300">
                After your session, you'll receive professionally edited high-resolution images
                that you can cherish for years to come.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Parallax Section */}
      <section ref={parallaxRef} className="parallax-section flex items-center">
        <div 
          className="parallax-bg" 
          style={{ backgroundImage: 'url(https://source.unsplash.com/random/1920x1080/?nature)' }}
        ></div>
        <div className="container mx-auto px-6 text-center text-white">
          <h2 className="text-4xl font-light mb-6">Ready to capture your story?</h2>
          <p className="text-xl mb-8">Let's create something beautiful together</p>
          <a 
            href="/contact" 
            className="inline-block px-8 py-3 bg-white text-black hover:bg-gray-200 transition-colors rounded-md border border-white"
          >
            Get in Touch
          </a>
        </div>
      </section>
    </div>
  )
}

export default Home
