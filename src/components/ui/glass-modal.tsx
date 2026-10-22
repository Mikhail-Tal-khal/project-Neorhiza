"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * GlassModal — frosted-glass dialog with opaque fallback, focus trap and
 * accessible labeling provided by Radix Dialog primitives.
 */
export const GlassModal = DialogPrimitive.Root;
export const GlassModalTrigger = DialogPrimitive.Trigger;
export const GlassModalClose = DialogPrimitive.Close;

export function GlassModalContent({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay
        className="fixed inset-0 z-50 bg-teal-950/40 backdrop-blur-sm motion-safe:data-[state=open]:animate-in motion-safe:data-[state=open]:fade-in-0"
      />
      <DialogPrimitive.Content
        className={cn(
          "glass fixed left-1/2 top-1/2 z-50 max-h-[85dvh] w-[calc(100vw-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl p-6 shadow-glass-lg outline-none md:p-8",
          "motion-safe:data-[state=open]:animate-in motion-safe:data-[state=open]:fade-in-0 motion-safe:data-[state=open]:zoom-in-95 scrollbar-fine",
          className
        )}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <DialogPrimitive.Title className="text-xl font-semibold tracking-[0.01em] text-teal-700 dark:text-teal-50">
            {title}
          </DialogPrimitive.Title>
          <DialogPrimitive.Close
            aria-label="Close dialog"
            className="flex size-11 shrink-0 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-teal-50 hover:text-teal-700 dark:text-mist-200 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <X aria-hidden="true" className="size-4" />
          </DialogPrimitive.Close>
        </div>
        {description && (
          <DialogPrimitive.Description className="mb-5 text-sm leading-relaxed text-slate-500 dark:text-mist-200">
            {description}
          </DialogPrimitive.Description>
        )}
        <div className="text-sm leading-relaxed text-ink dark:text-teal-50/90">
          {children}
        </div>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
