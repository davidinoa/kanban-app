'use client'

import { Button as NextUiButton } from '@nextui-org/button'
import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/popover'
import { useState } from 'react'
import { twMerge } from 'tailwind-merge'
import VerticalEllipsisIcon from '~/assets/icon-vertical-ellipsis.svg'
import Button, { buttonStyles } from './button'
import CreateEditTaskModal from './modals/create-edit-task-modal'
import DeleteTaskModal from './modals/delete-task-modal'

type Status = 'closed' | 'idle' | 'editing' | 'deleting'

type TaskActionsPopoverProps = {
  taskId: number
}

export default function TaskActionsPopover({
  taskId,
}: TaskActionsPopoverProps) {
  const [status, setStatus] = useState<Status>('closed')
  const isPopoverOpen = status === 'idle'
  const isDeleting = status === 'deleting'
  const isEditing = status === 'editing'

  return (
    <>
      <Popover
        placement="bottom"
        offset={16}
        isOpen={isPopoverOpen}
        onOpenChange={(isOpen) => {
          setStatus(isOpen ? 'idle' : 'closed')
        }}
      >
        <PopoverTrigger>
          <NextUiButton
            isIconOnly
            aria-label="task actions"
            className={twMerge(buttonStyles({ variant: 'icon' }), 'h-fit p-2')}
          >
            <VerticalEllipsisIcon viewBox="0 0 5 20" />
          </NextUiButton>
        </PopoverTrigger>
        <PopoverContent className="flex w-48 flex-col items-start gap-1 overflow-hidden rounded-lg p-0 py-2 pr-6">
          <Button
            variant="ghost"
            className="w-full justify-start rounded-l-none rounded-r-full px-4 font-normal text-red-100 data-[focus-visible=true]:bg-red-100 data-[hover=true]:bg-red-100 data-[focus-visible=true]:text-white data-[hover=true]:text-white dark:data-[hover=true]:bg-red-100"
            onPress={() => setStatus('deleting')}
          >
            Delete Task
          </Button>
          <Button variant="ghost" onPress={() => setStatus('editing')}>
            edit
          </Button>
        </PopoverContent>
      </Popover>
      <CreateEditTaskModal
        mode="edit"
        isOpen={isEditing}
        taskId={taskId}
        onOpenChange={(isOpen: boolean) =>
          setStatus(isOpen ? 'editing' : 'closed')
        }
      />
      <DeleteTaskModal
        isOpen={isDeleting}
        onOpenChange={(isOpen: boolean) =>
          setStatus(isOpen ? 'deleting' : 'closed')
        }
      />
    </>
  )
}
