/* eslint-disable react/require-default-props */

'use client'

import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useDroppable,
  useSensor,
  useSensors,
  type DragOverEvent,
  type DragStartEvent,
  type UniqueIdentifier,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useState } from 'react'

const removeAtIndex = <T,>(array: T[], index: number) => [
  ...array.slice(0, index),
  ...array.slice(index + 1),
]

const insertAtIndex = <T,>(array: T[], index: number, item: T) => [
  ...array.slice(0, index),
  item,
  ...array.slice(index),
]

type ItemProps = { id: string; dragOverlay?: boolean }
type SortableItemProps = { id: string }
type DroppableProps = { id: string; items: string[] }

function Item({ id, dragOverlay = false }: ItemProps) {
  return (
    <div
      className={`${
        dragOverlay ? 'cursor-grabbing' : 'cursor-grab'
      } mb-2 box-border flex h-8 w-28 select-none items-center rounded-md border-2 border-gray-400 bg-transparent pl-2`}
    >
      Item {id}
    </div>
  )
}

function SortableItem({ id }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

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
      <Item id={id} />
    </li>
  )
}

function Droppable({ id, items }: DroppableProps) {
  const { setNodeRef } = useDroppable({ id })
  return (
    <SortableContext items={items} strategy={rectSortingStrategy} id={id}>
      <ul
        ref={setNodeRef}
        className="min-w-[110px] list-none rounded-lg border border-black px-2 py-5"
      >
        {items.map((item) => (
          <SortableItem key={item} id={item} />
        ))}
      </ul>
    </SortableContext>
  )
}

type GroupId = 'group1' | 'group2' | 'group3'
type ItemGroups = Record<GroupId, string[]>
type RefData = {
  sortable: { containerId: GroupId; index: number }
}

export default function Page() {
  const [itemGroups, setItemGroups] = useState<ItemGroups>({
    group1: ['1', '2', '3'],
    group2: ['4', '5', '6'],
    group3: ['7', '8', '9'],
  })

  const [activeId, setActiveId] = useState<UniqueIdentifier>()

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const moveBetweenContainers = (
    items: ItemGroups,
    activeContainerId: GroupId,
    activeItemIndex: number,
    overContainerId: GroupId,
    overContainerIndex: number,
    activeItem: ItemGroups[GroupId][number],
  ) => ({
    ...items,
    [activeContainerId]: removeAtIndex(
      items[activeContainerId],
      activeItemIndex,
    ),
    [overContainerId]: insertAtIndex(
      items[overContainerId],
      overContainerIndex,
      activeItem,
    ),
  })

  const handleDragStart = ({ active }: DragStartEvent) => setActiveId(active.id)

  const handleDragCancel = () => setActiveId(undefined)

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    if (!over) return
    const activeItemData = active.data.current as RefData
    const overEntityData = over.data.current as RefData | undefined
    const activeContainerId = activeItemData.sortable.containerId
    const overContainerId = (overEntityData?.sortable.containerId ??
      over.id) as GroupId

    if (activeContainerId === overContainerId) return

    const activeItemIndex = activeItemData.sortable.index
    const overContainerIndex =
      over.id in itemGroups
        ? itemGroups[overContainerId as GroupId].length + 1
        : overEntityData?.sortable.index ?? 0

    setItemGroups((prevItemGroups) =>
      moveBetweenContainers(
        prevItemGroups,
        activeContainerId,
        activeItemIndex,
        overContainerId,
        overContainerIndex,
        active.id.toString(), // FIXME
      ),
    )
  }

  const handleDragEnd = ({ active, over }: DragOverEvent) => {
    if (!over) return setActiveId(undefined)

    const activeItemId = active.id
    const overId = over.id
    if (activeItemId === overId) return setActiveId(undefined)

    const activeRefData = active.data.current as RefData
    const overRefData = over.data.current as RefData
    const activeContainerId = activeRefData.sortable.containerId
    const overContainerId = overRefData.sortable.containerId
    const activeItemIndex = activeRefData.sortable.index
    const overIndex =
      overId in itemGroups
        ? itemGroups[overContainerId].length + 1
        : overRefData.sortable.index

    return setItemGroups((prevItemGroups) =>
      activeContainerId === overContainerId
        ? {
            ...prevItemGroups,
            [overContainerId]: arrayMove(
              prevItemGroups[overContainerId],
              activeItemIndex,
              overIndex,
            ),
          }
        : moveBetweenContainers(
            itemGroups,
            activeContainerId,
            activeItemIndex,
            overContainerId,
            overIndex,
            active.id.toString(), // FIXME
          ),
    )
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragCancel={handleDragCancel}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-2 bg-white text-black">
        {Object.keys(itemGroups).map((groupId) => (
          <Droppable
            key={groupId}
            id={groupId}
            items={itemGroups[groupId as GroupId]}
          />
        ))}
      </div>
    </DndContext>
  )
}
