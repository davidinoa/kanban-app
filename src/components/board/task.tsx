'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card, CardBody } from '@nextui-org/card'
import { useState } from 'react'
import DragIcon from '~/assets/icon-drag.svg'
import useAppStore from '~/zustand/app-store'

type DraggableProps = {
  taskId: string
  displayOverlay?: boolean
}

export default function Task({
  taskId,
  displayOverlay = false,
}: DraggableProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: taskId,
  })

  const board = useAppStore((state) => state.currentBoard)
  const setViewingTaskId = useAppStore((state) => state.setViewingTaskId)
  const [isPressing, setIsPressing] = useState(false)

  if (!board) return null

  function findTaskInBoard(currentBoard: typeof board, id: number) {
    return currentBoard?.columns
      .flatMap((column) => column.tasks)
      .find((task) => task.id === id)
  }

  const task = findTaskInBoard(board, Number(taskId))
  if (!task) return null

  return (
    <li
      id={`task-${taskId}`}
      ref={setNodeRef}
      style={{
        transition,
        listStyle: 'none',
        transform: CSS.Transform.toString(transform),
        opacity: isDragging ? 0.5 : 1,
        cursor: displayOverlay ? 'grabbing' : 'grab',
      }}
    >
      <div className="relative">
        <Card
          isPressable
          onPress={() => setViewingTaskId(taskId)}
          onPressStart={() => setIsPressing(true)}
          onPressEnd={() => setIsPressing(false)}
          classNames={{
            body: 'p-0 flex flex-col gap-2',
            base: `px-4 py-6 pr-8 w-full relative`,
          }}
        >
          <CardBody>
            <p className="text-sm font-bold leading-tight md:text-base">
              {task.title}
            </p>
            {task.subtasks.length > 0 && (
              <span className="hidden text-xs font-bold text-gray-100 md:block">
                {task.subtasks.filter((s) => s.isCompleted).length} of{' '}
                {task.subtasks.length} subtasks
              </span>
            )}
          </CardBody>
        </Card>
        <button
          type="button"
          className={`${displayOverlay ? 'cursor-grabbing' : 'cursor-grab'} ${
            isPressing ? 'scale-90' : 'scale-100'
          } absolute right-2 top-6 z-10 transition-all`}
          {...attributes}
          {...listeners}
        >
          <DragIcon width={20} height={20} />
        </button>
      </div>
    </li>
  )
}
