import React, { useEffect } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { SearchNormal1, TickCircle } from 'iconsax-react'
import { ResourceBadge } from 'ies2-aulapp-ui-kit'
import { cn } from '@/lib/utils'
import { modules } from '@/mocks/courseModules'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'

const CircularProgress = ({ percentage }: { percentage: number }) => {
  const radius = 18
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  const count = useMotionValue(0)
  const rounded = useTransform(count, Math.round)

  useEffect(() => {
    const animation = animate(count, percentage, {
      duration: 1.5,
      ease: 'easeOut',
    })
    return animation.stop
  }, [percentage, count])

  return (
    <div className="relative flex h-11 w-11 items-center justify-center">
      <svg className="h-full w-full -rotate-90 transform">
        <circle
          className="text-gray-200"
          strokeWidth="4"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="22"
          cy="22"
        />
        <motion.circle
          className="text-[#FF246E]"
          strokeWidth="4"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="22"
          cy="22"
        />
      </svg>
      <span className="absolute text-[10px] font-bold text-[#FF246E] flex items-center justify-center">
        <motion.span>{rounded}</motion.span>%
      </span>
    </div>
  )
}

const ProgressBar = ({
  current,
  total,
}: {
  current: number
  total: number
}) => {
  const percentage = Math.min(100, Math.max(0, (current / total) * 100))

  return (
    <div className="h-2 w-[84px] overflow-hidden rounded-full bg-[#E7E7E7]">
      <motion.div
        className="h-full rounded-full bg-[#FF246E]"
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 1, ease: 'easeOut' }}
      />
    </div>
  )
}

const getModuleProgress = (lessons: (typeof modules)[0]['lessons']) => {
  if (!lessons.length) return 0
  const totalProgress = lessons.reduce((acc, lesson) => {
    return acc + lesson.current / lesson.total
  }, 0)
  return Math.round((totalProgress / lessons.length) * 100)
}

export const ClassroomModules: React.FC = () => {
  const activeModuleId =
    modules.find((m) => m.status === 'in-progress')?.id || modules[0]?.id

  return (
    <div className="flex flex-col gap-8 px-3 py-6">
      {/* Header */}
      <div className="px-2">
        <h1 className="font-inter text-[32px] font-bold leading-tight text-black text-center">
          4.2 Nome da Aula
        </h1>
      </div>

      {/* Search */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <SearchNormal1 size="24" color="#6C757D" variant="Linear" />
        </div>
        <input
          type="text"
          placeholder="Buscar aqui"
          className="h-12 w-full rounded-lg border border-[#6C757D] bg-white pl-11 pr-4 text-sm text-[#343A40] placeholder-[#6C757D] outline-none focus:border-[#FF246E] focus-visible:ring-2 focus-visible:ring-[#FF246E]/30"
        />
      </div>

      {/* Modules List */}
      <Accordion
        type="single"
        collapsible
        className="flex flex-col gap-4"
        defaultValue={activeModuleId}
      >
        {modules.map((module) => (
          <AccordionItem
            key={module.id}
            value={module.id}
            className="group overflow-hidden rounded-2xl border-none bg-white shadow-[0px_4px_8px_0px_rgba(0,0,0,0.15)] data-[state=open]:bg-linear-to-br data-[state=open]:from-[#FF246E] data-[state=open]:to-[#487BFF] data-[state=open]:p-px data-[state=open]:shadow-none"
          >
            <div className="flex flex-col h-full w-full bg-transparent data-[state=open]:gap-px">
              <AccordionTrigger
                className={cn(
                  'flex items-center justify-between px-4 py-4 hover:no-underline bg-white rounded-2xl group-data-[state=open]:rounded-b-none group-data-[state=open]:rounded-t-[15px] cursor-pointer',
                  'focus-visible:relative focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF246E]'
                )}
              >
                <div className="flex items-center gap-4">
                  {getModuleProgress(module.lessons) === 100 ? (
                    <TickCircle size="32" color="#46B35E" variant="Bold" />
                  ) : (
                    <CircularProgress
                      percentage={getModuleProgress(module.lessons)}
                    />
                  )}
                  <div className="flex gap-2 text-left">
                    <span className="font-inter text-base font-bold text-[#343A40]">
                      {module.number}
                    </span>
                    <span className="font-inter text-base font-bold text-[#343A40]">
                      {module.title}
                    </span>
                  </div>
                </div>
              </AccordionTrigger>

              <AccordionContent className="p-0 bg-transparent">
                <div className="flex flex-col gap-px rounded-b-[15px] overflow-hidden">
                  {module.lessons.map((lesson) => (
                    <button
                      key={lesson.id}
                      className="flex w-full items-center justify-between bg-white px-4 py-4 first:rounded-t-none last:rounded-b-[15px] hover:bg-gray-50 focus-visible:relative focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF246E] focus-visible:ring-inset cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        {/* Resource Badge (Icon + Label) */}
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <ResourceBadge
                              variant={lesson.type}
                              appearance="ghost"
                            />
                          </div>
                          <div className="flex items-center gap-2 pl-[34px]">
                            {' '}
                            {/* Indent to align with text */}
                            <span className="font-plus-jakarta text-sm font-bold text-[#343A40]">
                              {lesson.number}
                            </span>
                            <span className="font-plus-jakarta text-sm font-bold text-[#343A40]">
                              {lesson.title}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right Side: Progress */}
                      <div className="flex flex-col items-end gap-1">
                        {lesson.completed ? (
                          <div className="flex items-center gap-2">
                            <TickCircle
                              size="22"
                              color="#46B35E"
                              variant="Bold"
                            />
                            <span className="font-plus-jakarta text-xs font-bold text-[#46B35E2]">
                              {lesson.current}/{lesson.total}
                            </span>
                          </div>
                        ) : (
                          <>
                            <span className="font-plus-jakarta text-xs font-bold text-[#343A40]">
                              {lesson.current}/{lesson.total}
                            </span>
                            <ProgressBar
                              current={lesson.current}
                              total={lesson.total}
                            />
                          </>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </AccordionContent>
            </div>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
