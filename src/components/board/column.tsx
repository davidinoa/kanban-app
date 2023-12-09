import { useDroppable } from '@dnd-kit/core'
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'
import { type RouterOutputs } from '~/trpc/shared'
import Task from './task'

type ColumnProps = {
  column: RouterOutputs['boards']['getById']['columns'][0]
  taskIds: string[]
}

export default function Column({ taskIds, column }: ColumnProps) {
  const columnId = String(column.id)
  const { setNodeRef } = useDroppable({ id: columnId })
  return (
    <section
      key={columnId}
      className="flex max-h-full flex-col overflow-hidden"
    >
      <h3 className="mb-6 pl-1 text-xs font-bold uppercase tracking-widest text-gray-100 md:text-sm">
        {column.name} ({taskIds.length})
      </h3>
      <SortableContext
        id={columnId}
        items={taskIds}
        strategy={rectSortingStrategy}
      >
        <ul
          ref={setNodeRef}
          className="scrollbar-hidden flex grow flex-col gap-5 overflow-auto rounded-md bg-sky/50 p-4 dark:bg-gray-300/25"
        >
          {taskIds.map((taskId) => (
            <Task key={taskId} taskId={taskId} />
          ))}
        </ul>
      </SortableContext>
    </section>
  )
}
