import React from 'react'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
  SheetHeader,
} from '@/components/ui/sheet'
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerTitle,
  DrawerDescription,
  DrawerHeader,
} from '@/components/ui/drawer'
import { ClassroomModules } from './ClassroomModules'
import { useMediaQuery } from '@/hooks/use-media-query'

interface SidebarMenuProps {
  children: React.ReactNode
}

export const SidebarMenu: React.FC<SidebarMenuProps> = ({ children }) => {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return (
      <Sheet>
        <SheetTrigger asChild>{children}</SheetTrigger>
        <SheetContent
          side="right"
          className="w-full rounded-l-4xl border-none bg-white p-0 shadow-[-7px_-2px_22.4px_0px_rgba(0,0,0,0.25)] sm:w-[406px] outline-none focus:outline-none"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Menu de Conteúdo</SheetTitle>
            <SheetDescription>
              Lista de módulos e aulas do curso
            </SheetDescription>
          </SheetHeader>
          <div className="h-full overflow-y-auto bg-[#F8F9FA] custom-scrollbar">
            <ClassroomModules />
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="h-[85vh] bg-[#F8F9FA] outline-none">
        <DrawerHeader className="sr-only">
          <DrawerTitle>Menu de Conteúdo</DrawerTitle>
          <DrawerDescription>
            Lista de módulos e aulas do curso
          </DrawerDescription>
        </DrawerHeader>
        <div className="h-full overflow-y-auto custom-scrollbar">
          <ClassroomModules />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
