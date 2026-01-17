"use client"

import { useRef, useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ContactForm } from "@/components/contact-form"

gsap.registerPlugin(ScrollTrigger)

interface ContactSectionProps {
  onContactClick?: () => void
}

export function ContactSection({ onContactClick }: ContactSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      // Header slide in
      if (headerRef.current) {
        gsap.from(headerRef.current, {
          x: -60,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        })
      }

      // Form fade up
      if (formRef.current) {
        gsap.from(formRef.current, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: formRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const handleFormSubmit = (data: { name: string; email: string; phone?: string; message: string }) => {
 
    if (onContactClick) {
      onContactClick()
    }
  }

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative py-32 pb-40 px-6 md:px-12 border-t border-border/30"
    >
      <div className="w-full max-w-4xl mx-auto">
        {/* Section header */}
        <div ref={headerRef} className="mb-16">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">04 / Contact</span>
          <h2 className="mt-4 font-(--font-bebas) text-5xl md:text-7xl tracking-tight">Get in touch</h2>
        </div>

        {/* Contact Form */}
        <ContactForm
          ref={formRef}
          onSubmit={handleFormSubmit}
          idPrefix="contact"
          spacing="normal"
          textareaRows={6}
        />
      </div>
    </section>
  )
}
