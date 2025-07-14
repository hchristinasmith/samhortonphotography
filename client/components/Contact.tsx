import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

const Contact = () => {
  // Refs for animations
  const contactRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const textRef = useRef<HTMLParagraphElement>(null)

  // Initialize GSAP animations
  useEffect(() => {
    // Animate heading and text
    if (headingRef.current && textRef.current && contactRef.current) {
      const contactItems = contactRef.current.querySelectorAll('.contact-item')
      
      gsap.fromTo(
        headingRef.current,
        { 
          opacity: 0,
          y: 30
        },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out'
        }
      )
      
      gsap.fromTo(
        textRef.current,
        { 
          opacity: 0,
          y: 30
        },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
          delay: 0.2
        }
      )
      
      gsap.fromTo(
        contactItems,
        { 
          opacity: 0,
          y: 20
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power2.out',
          delay: 0.5
        }
      )
    }
  }, [])

  return (
    <div className="bg-black text-white min-h-screen flex items-center justify-center">
      <div className="max-w-xl w-full px-6">
        <h1 
          ref={headingRef}
          className="text-3xl font-light mb-8 uppercase tracking-widest text-center"
        >
          Contact
        </h1>
        
        <p 
          ref={textRef}
          className="text-neutral-300 mb-16 font-light text-center"
        >
          For inquiries about photography sessions, prints, or collaborations, please reach out directly.
        </p>
        
        <div 
          ref={contactRef}
          className="space-y-10 flex flex-col items-center"
        >
          <div className="contact-item flex flex-col items-center">
            <h2 className="text-xl font-light mb-2 uppercase tracking-wider">Email</h2>
            <a 
              href="mailto:contact@samhortonphotography.com" 
              className="text-neutral-300 hover:text-white transition-colors"
            >
              contact@samhortonphotography.com
            </a>
          </div>
          
          <div className="contact-item flex flex-col items-center">
            <h2 className="text-xl font-light mb-2 uppercase tracking-wider">Phone</h2>
            <a 
              href="tel:+6421555555" 
              className="text-neutral-300 hover:text-white transition-colors"
            >
              +64 21 555 555
            </a>
          </div>
          
          <div className="contact-item flex flex-col items-center">
            <h2 className="text-xl font-light mb-2 uppercase tracking-wider">Instagram</h2>
            <a 
              href="https://instagram.com/samhortonphoto" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-neutral-300 hover:text-white transition-colors"
            >
              @samhortonphoto
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
