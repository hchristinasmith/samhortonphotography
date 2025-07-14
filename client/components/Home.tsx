import { useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getLocalPhotos } from '../apiClient'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

const Home = () => {
  // State for loading animation
  const [loading, setLoading] = useState(true)
  
  // Refs for GSAP animations
  const loaderRef = useRef<HTMLDivElement>(null)
  const loaderTextRef = useRef<HTMLDivElement>(null)
  const loaderOverlayRef = useRef<HTMLDivElement>(null)
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

  // Entry animation with camera flash effect
  useEffect(() => {
    if (loading && loaderRef.current && loaderTextRef.current && loaderOverlayRef.current) {
      // Create a timeline for the camera flash animation
      const tl = gsap.timeline();
      
      // First reveal the text with blur
      tl.to(loaderTextRef.current.querySelectorAll('.flash-text'), {
        opacity: 1,
        filter: 'blur(4px)',
        duration: 0.3,
        stagger: 0.02,
        ease: 'power2.out',
      });
      
      // First flash on the text
      tl.add(() => {
        const textElement = loaderTextRef.current?.querySelector('h1');
        if (textElement) {
          textElement.classList.add('text-flash');
          setTimeout(() => {
            textElement.classList.remove('text-flash');
          }, 800);
        }
      });
      
      // Sharpen the text after flash
      tl.to(loaderTextRef.current.querySelectorAll('.flash-text'), {
        filter: 'blur(0px)',
        duration: 0.5,
        stagger: 0.01,
        ease: 'power2.out',
      }, "+=0.2");
      
      // Second flash after a delay
      tl.add(() => {
        const textElement = loaderTextRef.current?.querySelector('h1');
        if (textElement) {
          setTimeout(() => {
            textElement.classList.add('text-flash');
            setTimeout(() => {
              textElement.classList.remove('text-flash');
            }, 800);
          }, 1000);
        }
      });
      
      // After photos are loaded, animate out the loader
      if (!isPending) {
        setTimeout(() => {
          const exitTl = gsap.timeline({
            onComplete: () => setLoading(false)
          });
          
          // Final flash before revealing content
          exitTl.add(() => {
            const textElement = loaderTextRef.current?.querySelector('h1');
            if (textElement) {
              textElement.classList.add('text-flash');
              setTimeout(() => {
                textElement.classList.remove('text-flash');
              }, 800);
            }
          });
          
          // Animate out the text
          exitTl.to(loaderTextRef.current, {
            opacity: 0,
            duration: 0.5,
            ease: 'power2.in'
          }, "+=0.5");
          
          // Animate out the overlay panels
          exitTl.to(loaderOverlayRef.current.querySelectorAll('.overlay-panel'), {
            scaleY: 0,
            transformOrigin: 'top',
            duration: 1,
            stagger: 0.1,
            ease: 'power4.inOut'
          }, "-=0.2");
        }, 1500); // Wait 1.5s before starting exit animation
      }
    }
  }, [loading, isPending]);

  // Initialize GSAP animations for main content
  useEffect(() => {
    if (!loading) {
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

    }

    // Clean up ScrollTrigger instances on unmount
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [loading, photos])

  return (
    <>
      {/* Loading Screen */}
      {loading && (
        <div 
          ref={loaderRef} 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black"
        >
          <div ref={loaderTextRef} className="text-center">
            <h1 className="text-4xl font-light mb-4">
              {/* Split text for flash animation */}
              {'SAM HORTON PHOTOGRAPHY'.split('').map((char, index) => (
                <span key={index} className="flash-text">
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </h1>
          </div>
          
          {/* Overlay panels that will animate out */}
          <div ref={loaderOverlayRef} className="fixed inset-0 z-40 pointer-events-none">
            <div className="overlay-panel absolute inset-0 bg-black transform-origin-top"></div>
            <div className="overlay-panel absolute inset-0 bg-neutral-900 transform-origin-top"></div>
            <div className="overlay-panel absolute inset-0 bg-neutral-800 transform-origin-top"></div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`bg-black text-white min-h-screen ${loading ? 'opacity-0' : 'opacity-100 transition-opacity duration-1000'}`}>
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
    </>
  )
}

export default Home
