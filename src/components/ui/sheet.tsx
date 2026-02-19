import * as React from 'react'
import * as SheetPrimitive from '@radix-ui/react-dialog'
import { AnimatePresence, motion } from 'framer-motion'

import { cn } from '@/lib/utils'

const SheetContext = React.createContext<{
  open: boolean
  setOpen: (open: boolean) => void
} | null>(null)

function Sheet({
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  defaultOpen,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Root>) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(
    defaultOpen || false
  )

  const open = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen
  const setOpen = controlledOnOpenChange || setUncontrolledOpen

  return (
    <SheetContext.Provider value={{ open, setOpen }}>
      <SheetPrimitive.Root
        data-slot="sheet"
        open={open}
        onOpenChange={setOpen}
        {...props}
      />
    </SheetContext.Provider>
  )
}

function SheetTrigger({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

function SheetClose({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />
}

function SheetPortal({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Portal>) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
}

function SheetOverlay({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
  return (
    <SheetPrimitive.Overlay data-slot="sheet-overlay" asChild {...props}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={cn('fixed inset-0 z-80 bg-black/50', className)}
      />
    </SheetPrimitive.Overlay>
  )
}

const sheetVariants = {
  top: {
    initial: { y: '-100%' },
    animate: { y: 0 },
    exit: { y: '-100%' },
  },
  bottom: {
    initial: { y: '100%' },
    animate: { y: 0 },
    exit: { y: '100%' },
  },
  left: {
    initial: { x: '-100%' },
    animate: { x: 0 },
    exit: { x: '-100%' },
  },
  right: {
    initial: { x: '100%' },
    animate: { x: 0 },
    exit: { x: '100%' },
  },
}

function SheetContent({
  className,
  children,
  side = 'right',
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: 'top' | 'right' | 'bottom' | 'left'
}) {
  const context = React.useContext(SheetContext)
  if (!context) {
    throw new Error('SheetContent must be used within a Sheet')
  }
  const { open } = context

  return (
    <SheetPortal forceMount>
      <AnimatePresence>
        {open && (
          <>
            <SheetOverlay forceMount />
            <SheetPrimitive.Content
              data-slot="sheet-content"
              forceMount
              asChild
              {...props}
            >
              <motion.div
                className={cn(
                  'bg-background fixed z-90 flex flex-col gap-4 shadow-lg',
                  side === 'right' &&
                    'inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm',
                  side === 'left' &&
                    'inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm',
                  side === 'top' && 'inset-x-0 top-0 h-auto border-b',
                  side === 'bottom' && 'inset-x-0 bottom-0 h-auto border-t',
                  className
                )}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={sheetVariants[side]}
                transition={{ type: 'spring', damping: 20, stiffness: 100 }}
              >
                {children}
              </motion.div>
            </SheetPrimitive.Content>
          </>
        )}
      </AnimatePresence>
    </SheetPortal>
  )
}

function SheetHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sheet-header"
      className={cn('flex flex-col gap-1.5 p-4', className)}
      {...props}
    />
  )
}

function SheetFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn('mt-auto flex flex-col gap-2 p-4', className)}
      {...props}
    />
  )
}

function SheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn('text-foreground font-semibold', className)}
      {...props}
    />
  )
}

function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
