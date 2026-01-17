"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Github } from "lucide-react"
import Link from "next/link"
import { useQuery } from "convex/react"

import { api } from "@/convex/_generated/api"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

gsap.registerPlugin(ScrollTrigger)

export function WorkSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const projectsPerPage = 5

  // Fetch projects from Convex
  const projects = useQuery(api.projects.getAll) || []

  const totalPages = Math.ceil(projects.length / projectsPerPage)
  const startIndex = (currentPage - 1) * projectsPerPage
  const endIndex = startIndex + projectsPerPage
  const currentProjects = projects.slice(startIndex, endIndex)

  // Assign grid spans based on position within the page (0-4)
  // This ensures each page has the same grid layout structure
  const getSpanForPosition = (position: number): string => {
    const spans = [
      "col-span-2 row-span-2", // Position 0: Large featured card
      "col-span-1 row-span-1", // Position 1: Small card
      "col-span-1 row-span-2", // Position 2: Tall card
      "col-span-1 row-span-1", // Position 3: Small card
      "col-span-2 row-span-1", // Position 4: Wide card
    ]
    return spans[position] || "col-span-1 row-span-1"
  }

  // Map projects with their assigned spans for the current page
  const projectsWithSpans = currentProjects.map((project: any, index: number) => ({
    ...project,
    span: getSpanForPosition(index),
  }))

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
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        },
      )

      const cards = gridRef.current?.querySelectorAll("article")
      if (cards && cards.length > 0) {
        gsap.set(cards, { y: 60, opacity: 0 })
        gsap.to(cards, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [currentPage])

  return (
    <section ref={sectionRef} id="work" className="relative py-32 px-6 md:px-12">
      <div className="w-full max-w-7xl mx-auto">
        {/* Section header */}
        <div ref={headerRef} className="mb-16 flex items-end justify-between">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">02 / Projects</span>
          <h2 className="mt-4 font-(--font-bebas) text-5xl md:text-7xl tracking-tight">Building Digital Magic </h2>
        </div>
        <p className="hidden md:block max-w-xs font-mono text-xs text-muted-foreground text-right leading-relaxed">
          Showcasing my recent work and creations and projects i've contributed to.
        </p>
      </div>

      {/* Asymmetric grid */}
      <div
        ref={gridRef}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[180px] md:auto-rows-[200px]"
      >
        {projectsWithSpans.map((experiment: any, index: number) => (
          <WorkCard 
            key={experiment._id} 
            experiment={experiment} 
            index={startIndex + index} 
            persistHover={index === 0} 
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="mt-12">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                href="#" 
                onClick={(e) => {
                  e.preventDefault()
                  if (currentPage > 1) {
                    setCurrentPage(currentPage - 1)
                    window.scrollTo({ top: sectionRef.current?.offsetTop ? sectionRef.current.offsetTop - 100 : 0, behavior: 'smooth' })
                  }
                }}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            
            {(() => {
              const pages: (number | 'ellipsis')[] = []
              
              if (totalPages <= 7) {
                // Show all pages if 7 or fewer
                for (let i = 1; i <= totalPages; i++) {
                  pages.push(i)
                }
              } else {
                // Always show first page
                pages.push(1)
                
                if (currentPage <= 3) {
                  // Near the start: 1 2 3 4 ... last
                  for (let i = 2; i <= 4; i++) {
                    pages.push(i)
                  }
                  pages.push('ellipsis')
                  pages.push(totalPages)
                } else if (currentPage >= totalPages - 2) {
                  // Near the end: 1 ... (n-3) (n-2) (n-1) n
                  pages.push('ellipsis')
                  for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i)
                  }
                } else {
                  // In the middle: 1 ... (current-1) current (current+1) ... last
                  pages.push('ellipsis')
                  for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i)
                  }
                  pages.push('ellipsis')
                  pages.push(totalPages)
                }
              }
              
              return pages.map((page, idx) => {
                if (page === 'ellipsis') {
                  return (
                    <PaginationItem key={`ellipsis-${idx}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )
                }
                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        setCurrentPage(page)
                        window.scrollTo({ top: sectionRef.current?.offsetTop ? sectionRef.current.offsetTop - 100 : 0, behavior: 'smooth' })
                      }}
                      isActive={currentPage === page}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              })
            })()}
            
            <PaginationItem>
              <PaginationNext 
                href="#" 
                onClick={(e) => {
                  e.preventDefault()
                  if (currentPage < totalPages) {
                    setCurrentPage(currentPage + 1)
                    window.scrollTo({ top: sectionRef.current?.offsetTop ? sectionRef.current.offsetTop - 100 : 0, behavior: 'smooth' })
                  }
                }}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
      </div>
    </section>
  )
}

function WorkCard({
  experiment,
  index,
  persistHover = false,
}: {
  experiment: {
    title: string
    medium: string
    description: string
    span: string
    link?: string
    githubLink?: string
    contributorType?: "created" | "contributed"
  }
  index: number
  persistHover?: boolean
}) {
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLElement>(null)
  const [isScrollActive, setIsScrollActive] = useState(false)

  useEffect(() => {
    if (!persistHover || !cardRef.current) return

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: cardRef.current,
        start: "top 80%",
        onEnter: () => setIsScrollActive(true),
      })
    }, cardRef)

    return () => ctx.revert()
  }, [persistHover])

  const isActive = isHovered || isScrollActive
  const hasLink = !!experiment.link
  const hasGithubLink = !!experiment.githubLink

  const CardContent = () => (
    <>
      {/* Background layer */}
      <div
        className={cn(
          "absolute inset-0 bg-accent/5 transition-opacity duration-500",
          isActive ? "opacity-100" : "opacity-0",
        )}
      />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {experiment.medium}
          </span>
          {experiment.contributorType && (
            <span className={cn(
              "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors duration-300",
              experiment.contributorType === "created" 
                ? "bg-accent/10 text-accent" 
                : "bg-muted text-muted-foreground"
            )}>
              {experiment.contributorType === "created" ? "Created" : "Contributed"}
            </span>
          )}
        </div>
        <h3
          className={cn(
            "mt-3 font-(--font-bebas) text-2xl md:text-4xl tracking-tight transition-colors duration-300",
            isActive ? "text-accent" : "text-foreground",
          )}
        >
          {experiment.title}
        </h3>
      </div>

      {/* Description - reveals on hover */}
      <div className="relative z-10">
        <p
          className={cn(
            "font-mono text-xs text-muted-foreground leading-relaxed transition-all duration-500 max-w-[280px]",
            isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
          )}
        >
          {experiment.description}
        </p>
      </div>

      {/* GitHub button - only show if githubLink exists */}
      {hasGithubLink && (
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            if (experiment.githubLink) {
              window.open(experiment.githubLink, "_blank", "noopener,noreferrer")
            }
          }}
          className={cn(
            "absolute top-4 right-4 z-30 p-2 rounded-md transition-all duration-300",
            "bg-background/80 backdrop-blur-sm border border-border/50",
            "hover:bg-accent/10 hover:border-accent/60",
            "focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background",
            isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100",
          )}
          aria-label={`View ${experiment.title} on GitHub`}
          title={`View ${experiment.title} on GitHub`}
        >
          <Github className="w-4 h-4 text-foreground" aria-hidden="true" />
        </button>
      )}

      {/* Index marker */}
      <span
        className={cn(
          "absolute bottom-4 right-4 font-mono text-[10px] transition-colors duration-300",
          isActive ? "text-accent" : "text-muted-foreground/40",
        )}
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Corner line */}
      <div
        className={cn(
          "absolute top-0 right-0 w-12 h-12 transition-all duration-500",
          isActive ? "opacity-100" : "opacity-0",
        )}
      >
        <div className="absolute top-0 right-0 w-full h-px bg-accent" />
        <div className="absolute top-0 right-0 w-px h-full bg-accent" />
      </div>
    </>
  )

  const cardClassName = cn(
    "group relative border border-border/40 p-5 flex flex-col justify-between transition-all duration-500 overflow-hidden",
    experiment.span,
    isActive && "border-accent/60",
    hasLink && "cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background",
    !hasLink && "cursor-default",
  )

  if (hasLink) {
    return (
      <article
        ref={cardRef}
        className={cardClassName}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link
          href={experiment.link!}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 z-10"
          aria-label={`Visit ${experiment.title} website`}
          tabIndex={0}
        />
        <CardContent />
      </article>
    )
  }

  return (
    <article
      ref={cardRef}
      className={cardClassName}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent />
    </article>
  )
}
