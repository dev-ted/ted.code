"use client"

import { useState } from "react"
import { HeroSection } from "@/components/hero-section"
import { SignalsSection } from "@/components/signals-section"
import { WorkSection } from "@/components/work-section"
import { PrinciplesSection } from "@/components/principles-section"
import { ContactSection } from "@/components/contact-section"
import { SideNav } from "@/components/side-nav"
import { Navbar } from "@/components/navbar"
import { ContactModal } from "@/components/contact-modal"
import { Footer } from "@/components/footer"

export default function Page() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)

  return (
    <main className="relative min-h-screen">
      <Navbar />
      <SideNav />
      <div className="grid-bg fixed inset-0 opacity-30" aria-hidden="true" />

      <div className="relative z-10 w-full">
        <HeroSection onContactClick={() => setIsContactModalOpen(true)} />
        <SignalsSection onContactClick={() => setIsContactModalOpen(true)} />
        <WorkSection />
        <PrinciplesSection />
        <ContactSection onContactClick={() => setIsContactModalOpen(true)} />
      </div>

      <Footer />
      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
    </main>
  )
}
