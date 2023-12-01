import { useDroppable } from '@dnd-kit/core'
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'
import Draggable from './draggable'
import './droppable.css'

type DroppableProps = {
  columnId: string
  taskIds: string[]
}

export default function Droppable({ columnId, taskIds }: DroppableProps) {
  const { setNodeRef } = useDroppable({ id: columnId })
  return (
    <SortableContext
      id={columnId}
      items={taskIds}
      strategy={rectSortingStrategy}
    >
      <ul ref={setNodeRef} className="droppable">
        {taskIds.map((taskId) => (
          <Draggable key={taskId} taskId={taskId} />
        ))}
      </ul>
    </SortableContext>
  )
}
