import { useDroppable } from '@dnd-kit/core'
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'

import { type RouterOutputs } from '~/trpc/shared'
import TaskCard from './task-card'

type ColumnProps = {
  column: RouterOutputs['boards']['getById']['columns'][number]
}

export default function Column({ column }: ColumnProps) {
  const columnId = column.id.toString()
  const { setNodeRef } = useDroppable({ id: columnId })

  return (
    <section className="flex flex-col">
      <h3 className="mb-6">{column.name}</h3>
      <SortableContext
        id={columnId}
        items={column.tasks}
        strategy={rectSortingStrategy}
      >
        <ul
          ref={setNodeRef}
          className="flex grow flex-col gap-5 rounded-md p-4 dark:bg-gray-300/25"
        >
          {column.tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </ul>
      </SortableContext>
    </section>
  )
}
