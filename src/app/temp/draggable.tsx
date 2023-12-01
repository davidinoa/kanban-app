/* eslint-disable react/require-default-props */
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import './draggable.css'

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

  return (
    <li
      ref={setNodeRef}
      style={{
        transition,
        listStyle: 'none',
        transform: CSS.Transform.toString(transform),
        opacity: isDragging ? 0.5 : 1,
        cursor: displayOverlay ? 'grabbing' : 'grab',
      }}
      {...attributes}
      {...listeners}
    >
      <div className="item">{taskId}</div>
    </li>
  )
}
