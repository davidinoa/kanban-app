import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/popover'
import VerticalEllipsisIcon from '~/assets/icon-vertical-ellipsis.svg'
import Button from './button'

export default function BoardActionsPopover() {
  return (
    <Popover placement="bottom-end">
      <PopoverTrigger>
        <Button variant="icon" aria-label="board actions" className="p-2">
          <VerticalEllipsisIcon
            height={16}
            viewBox="0 0 5 20"
            className="md:hidden"
          />
          <VerticalEllipsisIcon
            viewBox="0 0 5 20"
            className="hidden md:block"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-48 flex-col items-start gap-1 overflow-hidden rounded-lg p-0 py-2 pr-6">
        <Button
          variant="ghost"
          className="w-full justify-start rounded-l-none rounded-r-full px-4 py-3 text-gray-100 hover:bg-purple-100/10 hover:text-purple-100 focus-visible:bg-purple-100/10 focus-visible:text-purple-100 "
        >
          Edit Board
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start rounded-l-none rounded-r-full px-4 text-red-100 hover:bg-red-100 hover:text-white focus-visible:bg-red-100 focus-visible:text-white"
        >
          Delete Board
        </Button>
      </PopoverContent>
    </Popover>
  )
}
