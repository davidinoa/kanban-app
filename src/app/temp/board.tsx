/* eslint-disable react/jsx-no-bind */

'use client'

import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { useEffect, useState } from 'react'
import './board.css'
import Draggable from './draggable'
import Droppable from './droppable'
import { insertAtIndex, removeAtIndex } from './utils'

type TaskGroups = Record<string, string[]>

type RefData = {
  sortable: { containerId: string; index: number }
}

export default function Board() {
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const [taskGroups, setTaskGroups] = useState<TaskGroups>({
    'column-1': ['01', '02', '03'],
    'column-2': ['04', '05', '06'],
    'column-3': ['07', '08', '09', '10'],
  })

  const [activeTaskId, setActiveTaskId] = useState<string | null>(null)

  useEffect(() => {
    if (activeTaskId) {
      document.body.classList.add('cursor-grabbing')
    } else {
      document.body.classList.remove('cursor-grabbing')
    }
  }, [activeTaskId])

  function moveBetweenContainers<T extends keyof TaskGroups>({
    tasks,
    activeContainerId,
    activeItemIndex,
    overContainerId,
    overIndex,
  }: {
    tasks: TaskGroups
    activeContainerId: T
    activeItemIndex: number
    overContainerId: T
    overIndex: number
  }): TaskGroups {
    return {
      ...tasks,
      [activeContainerId]: removeAtIndex(
        tasks[activeContainerId] ?? [],
        activeItemIndex,
      ),
      [overContainerId]: insertAtIndex(
        tasks[overContainerId] ?? [],
        overIndex,
        tasks[activeContainerId]![activeItemIndex]!,
      ),
    }
  }

  function handleDragStart({ active }: DragStartEvent) {
    setActiveTaskId(String(active.id))
  }

  function handleDragCancel() {
    setActiveTaskId(null)
  }

  function handleDragOver({ active, over }: DragOverEvent) {
    if (!over) return
    const activeData = active.data.current as RefData
    const overData = over.data.current as RefData | undefined
    const activeContainerId = activeData.sortable.containerId
    const overContainerId = (overData?.sortable.containerId ??
      over.id) as keyof TaskGroups

    if (activeContainerId === overContainerId) return
    const activeItemIndex = activeData.sortable.index
    const overContainerIndex =
      over.id in taskGroups
        ? taskGroups[overContainerId]!.length + 1
        : overData?.sortable.index ?? 0

    setTaskGroups((prevTaskGroups) =>
      moveBetweenContainers({
        tasks: prevTaskGroups,
        activeContainerId,
        activeItemIndex,
        overContainerId,
        overIndex: overContainerIndex,
      }),
    )
  }

  const handleDragEnd = ({ active, over }: DragOverEvent) => {
    if (!over) return setActiveTaskId(null)

    const activeItemId = active.id
    const overId = over.id
    if (activeItemId === overId) return setActiveTaskId(null)

    const activeRefData = active.data.current as RefData
    const overRefData = over.data.current as RefData
    const activeContainerId = activeRefData.sortable.containerId
    const overContainerId = overRefData.sortable.containerId
    const activeItemIndex = activeRefData.sortable.index
    const overIndex =
      overId in taskGroups
        ? taskGroups[overContainerId]!.length + 1
        : overRefData.sortable.index

    return setTaskGroups((prevItemGroups) =>
      activeContainerId === overContainerId
        ? {
            ...prevItemGroups,
            [overContainerId]: arrayMove(
              prevItemGroups[overContainerId]!,
              activeItemIndex,
              overIndex,
            ),
          }
        : moveBetweenContainers({
            tasks: prevItemGroups,
            activeContainerId,
            activeItemIndex,
            overContainerId,
            overIndex,
          }),
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
      <div className="container">
        {Object.keys(taskGroups).map((columnId) => (
          <Droppable
            key={columnId}
            columnId={columnId}
            taskIds={taskGroups[columnId] ?? []}
          />
        ))}
      </div>
      <DragOverlay>
        {activeTaskId ? (
          <Draggable taskId={activeTaskId} displayOverlay />
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
