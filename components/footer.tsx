"use client"

import { useRef, useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function Footer() {
  const footerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!footerRef.current) return

    const ctx = gsap.context(() => {
      if (footerRef.current) {
        gsap.from(footerRef.current, {
          y: 20,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 95%",
            toggleActions: "play none none reverse",
          },
        })
      }
    }, footerRef)

    return () => ctx.revert()
  }, [])

  return (
    <footer
      ref={footerRef}
      className=" bottom-0 left-0 right-0 z-50 py-6 px-6 md:px-12"
    >
      <div className="relative w-full max-w-7xl mx-auto">
      

        {/* Centered text content */}
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
            © {new Date().getFullYear()} TED.CODE. ALL RIGHTS RESERVED.
          </p>
          <p className="font-mono text-[10px] text-muted-foreground">
            Crafting digital experiences with passion and precision.
          </p>
        </div>
      </div>
    </footer>
  )
}
