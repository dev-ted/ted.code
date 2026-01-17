"use client"

import * as React from "react"
import { ContactForm } from "@/components/contact-form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const isMobile = useIsMobile()
  const [open, setOpen] = React.useState(isOpen)

  React.useEffect(() => {
    setOpen(isOpen)
  }, [isOpen])

  // Lock body scroll when dialog/drawer is open
  React.useEffect(() => {
    if (open) {
      // Save current scroll position
      const scrollY = window.scrollY
      // Lock body scroll
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
      document.body.style.overflow = 'hidden'
      
      return () => {
        // Restore scroll position when closing
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.width = ''
        document.body.style.overflow = ''
        window.scrollTo(0, scrollY)
      }
    }
  }, [open])

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      onClose()
    }
  }

  const handleFormSubmit = (data: { name: string; email: string; phone?: string; message: string }) => {
  
    handleOpenChange(false)
  }

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={handleOpenChange}>
        <DrawerContent className="max-h-[90vh] flex flex-col">
          <DrawerHeader className="text-left border-b border-border/50">
            <DrawerTitle className="font-(--font-bebas) text-3xl tracking-tight">
              Get in Touch
            </DrawerTitle>
            <DrawerDescription className="text-sm text-muted-foreground mt-1">
              Let's create something amazing together
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 py-6 overflow-y-auto flex-1">
            <ContactForm
              onSubmit={handleFormSubmit}
              idPrefix="modal"
              spacing="compact"
              textareaRows={5}
            />
          </div>
          <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className={cn(
          "max-w-2xl rounded-2xl border-border/50",
          "max-h-[85vh] overflow-hidden flex flex-col p-0"
        )}
      >
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/50">
          <DialogTitle className="font-(--font-bebas) text-3xl md:text-4xl tracking-tight">
            Get in Touch
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-1">
            Let's create something amazing together
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 overflow-y-auto flex-1">
          <ContactForm
            onSubmit={handleFormSubmit}
            idPrefix="modal"
            spacing="compact"
            textareaRows={5}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
