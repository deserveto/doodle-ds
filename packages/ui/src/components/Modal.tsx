import type { ComponentProps, ReactNode } from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { CloseIcon } from "@sangisalarp/icons";
import { cn } from "../lib/cn";

export interface ModalProps
  extends Omit<ComponentProps<"div">, "title" | "onClose"> {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  footer?: ReactNode;
}

export function Modal({
  open,
  onClose,
  title,
  footer,
  className,
  children,
  ...props
}: ModalProps) {
  return (
    <DialogPrimitive.Root
      open={open}
      onOpenChange={(o) => {
        if (!o) onClose();
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-bg-deep/80" />
        <DialogPrimitive.Content
          className={cn(
            "fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2",
            className,
          )}
          {...props}
        >
          <div className="animate-pop-in relative rounded-cutout border-2 border-line bg-surface p-6 shadow-pop-xl">
            <span
              aria-hidden
              className="absolute -top-3 left-8 -rotate-2 rounded-sm border border-line/20 bg-accent-salmon/80 px-5 py-0.5 font-hand text-base font-bold"
            >
              hey, look!
            </span>
            <DialogPrimitive.Close
              className="absolute top-3 right-3 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-line bg-surface font-display font-bold shadow-pop-xs transition-transform duration-100 hover:rotate-90 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
              aria-label="Close"
            >
              <CloseIcon className="h-4 w-4" />
            </DialogPrimitive.Close>
            {title && (
              <DialogPrimitive.Title className="pr-8 font-display text-2xl font-bold tracking-tight">
                {title}
              </DialogPrimitive.Title>
            )}
            <DialogPrimitive.Description className="mt-3 text-fg-soft">
              {children}
            </DialogPrimitive.Description>
            {footer && (
              <div className="mt-6 flex justify-end gap-3">{footer}</div>
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
