"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Lightbulb, Palette, Code2, Rocket, ArrowRight } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

const signals = [
  {
    title: "Problem Solver",
    description: "Turning complex challenges into elegant solutions",
    icon: Lightbulb,
  },
  {
    title: "Design Enthusiast",
    description: "Creating beautiful and intuitive user experiences",
    icon: Palette,
  },
  {
    title: "Code Artist",
    description: "Crafting clean, maintainable, and efficient code",
    icon: Code2,
  },
  {
    title: "Innovation Driver",
    description: "Always exploring new technologies and approaches",
    icon: Rocket,
  },
]

interface SignalsSectionProps {
  onContactClick?: () => void
}

export function SignalsSection({ onContactClick }: SignalsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    if (!sectionRef.current || !cursorRef.current) return

    const section = sectionRef.current
    const cursor = cursorRef.current

    const handleMouseMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      gsap.to(cursor, {
        x: x,
        y: y,
        duration: 0.5,
        ease: "power3.out",
      })
    }

    const handleMouseEnter = () => setIsHovering(true)
    const handleMouseLeave = () => setIsHovering(false)

    section.addEventListener("mousemove", handleMouseMove)
    section.addEventListener("mouseenter", handleMouseEnter)
    section.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      section.removeEventListener("mousemove", handleMouseMove)
      section.removeEventListener("mouseenter", handleMouseEnter)
      section.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  useEffect(() => {
    if (!sectionRef.current || !headerRef.current || !gridRef.current) return

    const ctx = gsap.context(() => {
      // Header slide in from left
      gsap.fromTo(
        headerRef.current,
        { x: -60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      )

      const cards = gridRef.current?.querySelectorAll("article")
      if (cards) {
        gsap.fromTo(
          cards,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          },
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <>
      <section id="signals" ref={sectionRef} className="relative py-32 px-6 md:px-12">
        <div className="w-full max-w-7xl mx-auto relative">
          <div
            ref={cursorRef}
            className={cn(
              "pointer-events-none absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 z-50",
              "w-12 h-12 rounded-full border-2 border-accent bg-accent",
              "transition-opacity duration-300",
              isHovering ? "opacity-100" : "opacity-0",
            )}
          />

          {/* Section header */}
          <div ref={headerRef} className="mb-16">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">01 / Overview</span>
          <h2 className="mt-4 font-[var(--font-bebas)] text-5xl md:text-7xl tracking-tight">
            Crafting digital experiences with passion and precision
          </h2>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Problem Solver - Top Left */}
          <SignalCard signal={signals[0]} />

          {/* Design Enthusiast - Top Right (spans 2 columns on lg) */}
          <SignalCard signal={signals[1]} className="lg:col-span-2" />

          {/* Connect Card - Center (spans 2 columns on md, 1 on lg, tall) */}
          <ConnectCard className="md:col-span-2 lg:col-span-1 lg:row-span-2" onClick={onContactClick} />

          {/* Code Artist - Bottom Left */}
          <SignalCard signal={signals[2]} />

          {/* Innovation Driver - Bottom Right */}
          <SignalCard signal={signals[3]} />
        </div>
        </div>
      </section>

    </>
  )
}

function SignalCard({
  signal,
  className,
}: {
  signal: { title: string; description: string; icon: React.ElementType }
  className?: string
}) {
  const Icon = signal.icon

  return (
    <article
      className={cn(
        "group relative",
        "bg-card border border-border/50 rounded-2xl p-8",
        "transition-all duration-500 ease-out",
        "hover:border-accent/50 hover:shadow-xl hover:shadow-accent/5",
        "hover:-translate-y-1",
        className,
      )}
    >
      {/* Icon */}
      <div className="mb-6 w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center group-hover:bg-accent/20 transition-colors duration-300">
        <Icon className="w-6 h-6 text-accent" />
      </div>

      {/* Title */}
      <h3 className="font-[var(--font-bebas)] text-3xl md:text-4xl tracking-tight mb-3 group-hover:text-accent transition-colors duration-300">
        {signal.title}
      </h3>

      {/* Description */}
      <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{signal.description}</p>

      {/* Decorative corner accent */}
      <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-accent/40 group-hover:bg-accent transition-colors duration-300" />
    </article>
  )
}

function ConnectCard({ className, onClick }: { className?: string; onClick?: () => void }) {
  return (
    <article
      className={cn(
        "group relative",
        "bg-gradient-to-br from-accent/10 via-accent/5 to-transparent",
        "border border-accent/30 rounded-2xl p-8 md:p-12",
        "flex flex-col items-center justify-center text-center",
        "transition-all duration-500 ease-out",
        "hover:border-accent hover:shadow-2xl hover:shadow-accent/10",
        "hover:scale-[1.02]",
        className,
      )}
    >
      {/* Title */}
      <h3 className="font-[var(--font-bebas)] text-5xl md:text-6xl tracking-tight mb-6">Let's Connect</h3>

      {/* Subtitle */}
      <p className="text-lg md:text-xl text-foreground/80 mb-8 max-w-md">Ready to bring your ideas to life?</p>

      {/* CTA Button */}
      <button
        onClick={onClick}
        className={cn(
          "group/btn relative px-8 py-4 rounded-full z-10",
          "bg-accent text-white font-medium",
          "transition-all duration-300",
          "hover:shadow-lg hover:shadow-accent/50 hover:scale-105",
          "flex items-center gap-2",
        )}
      >
        <span>Get in Touch</span>
        <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover/btn:translate-x-1" />
      </button>

      {/* Decorative elements */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </article>
  )
}
