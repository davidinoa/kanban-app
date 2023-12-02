/* eslint-disable react/require-default-props */

'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card, CardBody } from '@nextui-org/card'
import DragIcon from '~/assets/icon-drag.svg'
import useAppStore from '~/zustand/app-store'

type DraggableProps = {
  taskId: string
  displayOverlay?: boolean
}

export default function Draggable({
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
          classNames={{
            body: 'p-0 flex flex-col gap-2',
            base: `px-4 py-6 w-full relative`,
          }}
        >
          <CardBody>
            <p className="font-bold leading-tight">{task.title}</p>
            <span className="text-xs">
              {task.subtasks.filter((s) => s.isCompleted).length} of{' '}
              {task.subtasks.length} subtasks
            </span>
          </CardBody>
        </Card>
        <button
          type="button"
          style={{ position: 'absolute' }}
          className={`${
            displayOverlay ? 'cursor-grabbing' : 'cursor-grab'
          } right-2 top-6`}
          {...attributes}
          {...listeners}
        >
          <DragIcon width={20} height={20} />
        </button>
      </div>
    </li>
  )
}
