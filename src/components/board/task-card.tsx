/* eslint-disable react/require-default-props */
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card, CardBody } from '@nextui-org/card'
import { type RouterOutputs } from '~/trpc/shared'

type TaskCardProps = {
  task: RouterOutputs['boards']['getById']['columns'][number]['tasks'][number]
  dragOverlay?: boolean
}

export default function TaskCard({ task, dragOverlay = false }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id.toString() })

  return (
    <li
      style={{
        transition,
        transform: CSS.Transform.toString(transform),
        opacity: isDragging ? 0.5 : 1,
      }}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
    >
      <div>
        <Card
          isPressable
          classNames={{
            body: 'p-0 flex flex-col gap-2',
            base: `px-4 py-6 w-full ${
              dragOverlay ? 'cursor-grabbing' : 'cursor-grab'
            }`,
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
      </div>
    </li>
  )
}
