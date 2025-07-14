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
    <div className="bg-black text-white min-h-screen">
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
    </div>
  )
}

export default Home
