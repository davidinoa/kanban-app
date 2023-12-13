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
import { type RouterOutputs } from '~/trpc/shared'
import useAppStore from '~/zustand/app-store'
import CreateColumnsModal from '../modals/create-columns-modal'
import ViewTaskModal from '../modals/view-task-modal'
import Column from './column'
import Draggable from './task'
import { insertAtIndex, removeAtIndex } from './utils'

type TaskGroups = Record<string, string[]>

type RefData = {
  sortable: { containerId: string; index: number }
}

type BoardType = RouterOutputs['boards']['getById']

type BoardProps = {
  board: BoardType
}

function transformBoardToTaskGroups(board: BoardType) {
  return board.columns.reduce<TaskGroups>((acc, column) => {
    acc[column.id] = column.tasks.map((task) => String(task.id))
    return acc
  }, {})
}

export default function Board({ board }: BoardProps) {
  const setCurrentBoard = useAppStore((state) => state.setCurrentBoard)
  useEffect(() => {
    setCurrentBoard(board)
  }, [setCurrentBoard, board])

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const [taskGroups, setTaskGroups] = useState<TaskGroups>(
    transformBoardToTaskGroups(board),
  )

  const [activeTaskId, setActiveTaskId] = useState<string | null>(null)

  useEffect(() => setTaskGroups(transformBoardToTaskGroups(board)), [board])

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

  function handleDragEnd({ active, over }: DragOverEvent) {
    if (!over) return setActiveTaskId(null)

    const activeItemId = active.id
    const overId = over.id
    if (activeItemId === overId) return setActiveTaskId(null)

    const activeRefData = active.data.current as RefData
    const overData = over.data.current as RefData | undefined
    const activeContainerId = activeRefData.sortable.containerId
    const overContainerId = (overData?.sortable.containerId ??
      over.id) as keyof TaskGroups
    const activeItemIndex = activeRefData.sortable.index
    const overIndex =
      overId in taskGroups
        ? taskGroups[overContainerId]!.length + 1
        : overData?.sortable.index ?? 0

    const draggedElement = document.getElementById(`task-${activeItemId}`)!
    const draggedElementRect = draggedElement.getBoundingClientRect()
    if (draggedElementRect.top < 80) {
      draggedElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }

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
      autoScroll={{
        acceleration: 1.5,
        layoutShiftCompensation: true,
      }}
    >
      <div className="h-full min-w-fit pr-4">
        <div className="column-container grid h-full grid-flow-col gap-6 p-6">
          {board.columns.map((column) => (
            <Column
              key={column.id}
              column={column}
              taskIds={taskGroups[column.id.toString()] ?? []}
            />
          ))}
          <CreateColumnsModal boardId={board.id} />
        </div>
      </div>
      <DragOverlay zIndex={20}>
        {activeTaskId ? (
          <Draggable taskId={activeTaskId} displayOverlay />
        ) : null}
      </DragOverlay>
      <ViewTaskModal />
    </DndContext>
  )
}
