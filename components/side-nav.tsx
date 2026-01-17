"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

const navItems = [
  { id: "hero", label: "Home" },
  { id: "signals", label: "About" },
  { id: "work", label: "Work" },
  { id: "principles", label: "Principles" },
  { id: "contact", label: "Contact" },
]

export function SideNav() {
  const [activeSection, setActiveSection] = useState("hero")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.3 },
    )

    navItems.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <nav className="fixed left-0 top-0 z-40 h-screen w-16 md:w-20 hidden md:flex flex-col justify-center border-r border-border/50 bg-background/60 backdrop-blur-md">
      <div className="flex flex-col gap-6 px-4">
        {navItems.map(({ id, label }) => (
          <button key={id} onClick={() => scrollToSection(id)} className="group relative flex items-center gap-3">
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full transition-all duration-300",
                activeSection === id ? "bg-accent scale-125" : "bg-muted-foreground/40 group-hover:bg-accent/60",
              )}
            />
            <span
              className={cn(
                "absolute left-6 font-mono text-[10px] uppercase tracking-widest opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:left-8 whitespace-nowrap",
                activeSection === id ? "text-accent font-medium" : "text-muted-foreground",
              )}
            >
              {label}
            </span>
          </button>
        ))}
      </div>

      <div className="absolute bottom-8 left-0 right-0 px-4">
        <div className="flex flex-col items-center gap-2">
          <div className="h-px w-8 bg-border/50" />
          <p className="font-mono text-[8px] uppercase tracking-widest text-muted-foreground/60 text-center rotate-180 [writing-mode:vertical-lr]">
            Crafted with passion
          </p>
        </div>
      </div>
    </nav>
  )
}
