'use client'

import { SignOutButton } from '@clerk/nextjs'
import {
  Button as NextUiButton,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@nextui-org/react'
import { useState } from 'react'
import { twMerge } from 'tailwind-merge'
import VerticalEllipsisIcon from '~/assets/icon-vertical-ellipsis.svg'
import Button, { buttonStyles } from './button'
import CreateEditBoardModal from './modals/create-edit-board-modal'
import DeleteBoardModal from './modals/delete-board-modal'

type Status = 'closed' | 'popoverOpen' | 'editModalOpen' | 'deleteModalOpen'

export default function BoardActionsPopover() {
  const [status, setStatus] = useState<Status>('closed')
  const isPopoverOpen = status === 'popoverOpen'
  const isEditModalOpen = status === 'editModalOpen'
  const isDeleteModalOpen = status === 'deleteModalOpen'

  return (
    <>
      <Popover
        placement="bottom"
        offset={28}
        isOpen={isPopoverOpen}
        onOpenChange={(isOpen) => setStatus(isOpen ? 'popoverOpen' : 'closed')}
      >
        <PopoverTrigger>
          <NextUiButton
            isIconOnly
            aria-label="board actions"
            className={twMerge(buttonStyles({ variant: 'icon' }), 'p-2')}
          >
            <VerticalEllipsisIcon
              height={16}
              viewBox="0 0 5 20"
              className="md:hidden"
            />
            <VerticalEllipsisIcon
              viewBox="0 0 5 20"
              className="hidden md:block"
            />
          </NextUiButton>
        </PopoverTrigger>
        <PopoverContent className="flex w-48 flex-col items-start gap-1 overflow-hidden rounded-lg p-0 py-2 pr-6">
          <Button
            variant="ghost"
            className="w-full justify-start rounded-l-none rounded-r-full px-4 py-3 text-gray-100 data-[focus-visible=true]:bg-purple-100/10 data-[hover=true]:bg-purple-100/10 data-[focus-visible=true]:text-purple-100 data-[hover=true]:text-purple-100"
            onClick={() => setStatus('editModalOpen')}
          >
            Edit Board
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start rounded-l-none rounded-r-full px-4 text-red-100 data-[focus-visible=true]:bg-red-100 data-[hover=true]:bg-red-100 data-[focus-visible=true]:text-white data-[hover=true]:text-white dark:data-[hover=true]:bg-red-100"
            onClick={() => setStatus('deleteModalOpen')}
          >
            Delete Board
          </Button>
          <div className="px-4 py-2">
            <SignOutButton />
          </div>
        </PopoverContent>
      </Popover>
      <CreateEditBoardModal
        mode="edit"
        isOpen={isEditModalOpen}
        onOpenChange={(isOpen) =>
          setStatus(isOpen ? 'editModalOpen' : 'closed')
        }
      />
      <DeleteBoardModal
        isOpen={isDeleteModalOpen}
        onOpenChange={(isOpen) =>
          setStatus(isOpen ? 'deleteModalOpen' : 'closed')
        }
      />
    </>
  )
}
