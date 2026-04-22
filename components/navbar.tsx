"use client"

import { useState, useEffect, useLayoutEffect } from "react"
import { useTheme } from "next-themes"
import { Moon, Sun, Monitor } from "lucide-react"
import { ScrambleTextOnHover } from "@/components/scramble-text"
import Link from "next/link"
import Image from "next/image"

export function Navbar() {
  const { theme, setTheme } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useLayoutEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { id: "hero", label: "Home" },
    { id: "signals", label: "About" },
    { id: "work", label: "Work" },
    { id: "principles", label: "Principles" },
    { id: "contact", label: "Contact" },
  ]

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const activeTheme = mounted ? (theme ?? "system") : "system"

  return (
    <nav className="fixed top-0 left-0 right-0 z-100 flex justify-center pt-2 md:pt-6 px-4">
      <div
        className={`w-full max-w-4xl mx-auto transition-all duration-300 md:rounded-full ${
          scrolled
            ? "bg-background/80 backdrop-blur-md border border-border/50 shadow-lg"
            : "bg-background/50 backdrop-blur-sm border border-border/30"
        }`}
      >
        <div className="flex items-center justify-between h-14 md:h-16 px-4 md:px-6">
          {/* Logo */}
          <Link
            href="/"
            className="font-(--font-bebas) text-xl md:text-xl tracking-wider text-foreground hover:text-primary transition-colors duration-200 cursor-pointer"
          >
           <Image src="/logo.webp" alt="TED.CODE" width={32} height={32} className="w-10 h-10 rounded-full" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors duration-200 cursor-pointer"
              >
                <ScrambleTextOnHover text={link.label} as="span" duration={0.4} />
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 border border-border/50 rounded-xl p-1 bg-background/50">
            <button
              onClick={() => setTheme("light")}
              className={`relative flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200 ${
                activeTheme === "light" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
              aria-label="Light mode"
            >
              <Sun className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTheme("dark")}
              className={`relative flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200 ${
                activeTheme === "dark" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
              aria-label="Dark mode"
            >
              <Moon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTheme("system")}
              className={`relative flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200 ${
                activeTheme === "system" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
              aria-label="System mode"
            >
              <Monitor className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden flex flex-col gap-1.5 w-10 h-10 items-center justify-center border border-border/50 rounded-xl hover:border-primary transition-all duration-200"
            aria-label="Toggle menu"
            onClick={() => {
              setIsMobileMenuOpen(!isMobileMenuOpen)
              const menu = document.getElementById("mobile-menu")
              menu?.classList.toggle("hidden")
            }}
          >
            <span className="w-5 h-0.5 bg-foreground transition-all duration-200"></span>
            <span className="w-5 h-0.5 bg-foreground transition-all duration-200"></span>
            <span className="w-5 h-0.5 bg-foreground transition-all duration-200"></span>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div id="mobile-menu" className="hidden md:hidden border-t border-border/50 py-4 px-4">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  scrollToSection(link.id)
                  setIsMobileMenuOpen(false)
                  const menu = document.getElementById("mobile-menu")
                  menu?.classList.add("hidden")
                }}
                className="font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors duration-200 py-2 text-left cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
