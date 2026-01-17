"use client"

import { useRef, forwardRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional().or(z.literal("")),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

type ContactFormData = z.infer<typeof contactFormSchema>

interface ContactFormProps {
  onSubmit?: (data: { name: string; email: string; phone?: string; message: string }) => void
  idPrefix?: string
  className?: string
  spacing?: "compact" | "normal"
  textareaRows?: number
}

export const ContactForm = forwardRef<HTMLFormElement, ContactFormProps>(
  ({ onSubmit, idPrefix = "", className, spacing = "normal", textareaRows = 6 }, ref) => {
    const { toast } = useToast()
    const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
      reset,
    } = useForm<ContactFormData>({
      resolver: zodResolver(contactFormSchema),
      defaultValues: {
        name: "",
        email: "",
        phone: "",
        message: "",
      },
    })

    const onSubmitForm = async (data: ContactFormData) => {
      try {
        const response = await fetch('/api/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || 'Failed to send message')
        }

        toast({
          title: "Message sent successfully!",
          description: "Thank you for contacting us. We'll get back to you soon.",
        })

        // Reset form
        reset()

        // Call optional onSubmit callback
        if (onSubmit) {
          onSubmit(data)
        }
      } catch (error) {
        console.error("Error sending message:", error)
        toast({
          title: "Failed to send message",
          description: error instanceof Error ? error.message : "Please try again later.",
          variant: "destructive",
        })
      }
    }

    const spaceClass = spacing === "compact" ? "space-y-5" : "space-y-6"
    const inputId = (field: string) => idPrefix ? `${idPrefix}-${field}` : field

    return (
      <form
        ref={ref}
        onSubmit={handleSubmit(onSubmitForm)}
        className={cn(spaceClass, className)}
      >
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor={inputId("name")} className="font-mono text-xs uppercase tracking-widest text-foreground">
            Name <span className="text-accent">*</span>
          </Label>
          <Input
            type="text"
            id={inputId("name")}
            {...register("name")}
            aria-invalid={errors.name ? "true" : "false"}
            className={cn(
              "px-4 py-3 rounded-xl h-auto",
              errors.name && "border-destructive"
            )}
            placeholder="Your name"
          />
          {errors.name && (
            <p className="text-xs text-destructive mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor={inputId("email")} className="font-mono text-xs uppercase tracking-widest text-foreground">
            Email <span className="text-accent">*</span>
          </Label>
          <Input
            type="email"
            id={inputId("email")}
            {...register("email")}
            aria-invalid={errors.email ? "true" : "false"}
            className={cn(
              "px-4 py-3 rounded-xl h-auto",
              errors.email && "border-destructive"
            )}
            placeholder="your.email@example.com"
          />
          {errors.email && (
            <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Phone (Optional) */}
        <div className="space-y-2">
          <Label htmlFor={inputId("phone")} className="font-mono text-xs uppercase tracking-widest text-foreground">
            Phone <span className="text-muted-foreground text-[10px]">(Optional)</span>
          </Label>
          <Input
            type="tel"
            id={inputId("phone")}
            {...register("phone")}
            aria-invalid={errors.phone ? "true" : "false"}
            className={cn(
              "px-4 py-3 rounded-xl h-auto",
              errors.phone && "border-destructive"
            )}
            placeholder={spacing === "compact" ? "Enter your phone number" : "Enter your phone number"}
          />
          {errors.phone && (
            <p className="text-xs text-destructive mt-1">{errors.phone.message}</p>
          )}
        </div>

        {/* Message */}
        <div className="space-y-2">
          <Label htmlFor={inputId("message")} className="font-mono text-xs uppercase tracking-widest text-foreground">
            Message <span className="text-accent">*</span>
          </Label>
          <Textarea
            id={inputId("message")}
            {...register("message")}
            rows={textareaRows}
            aria-invalid={errors.message ? "true" : "false"}
            className={cn(
              "px-4 py-3 rounded-xl resize-none",
              errors.message && "border-destructive"
            )}
            placeholder="Tell me about your project..."
          />
          {errors.message && (
            <p className="text-xs text-destructive mt-1">{errors.message.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            "w-full max-w-xs rounded-xl font-medium text-white",
            "bg-accent  hover:bg-accent/90",
            "transition-all duration-300",
            "hover:shadow-lg hover:shadow-accent/50 hover:scale-[1.02]",
            "active:scale-95",
            spacing === "compact" ? "h-12" : "h-14"
          )}
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </Button>
      </form>
    )
  }
)

ContactForm.displayName = "ContactForm"
