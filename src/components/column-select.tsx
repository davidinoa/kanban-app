import { Select, SelectItem } from '@nextui-org/select'
import useAppStore from '~/zustand/app-store'

export default function ColumnSelect() {
  const board = useAppStore((state) => state.currentBoard)
  const columns = board?.columns ?? []

  if (!columns[0]) return null

  return (
    <Select
      label="Status"
      placeholder="Select a column"
      labelPlacement="outside"
      defaultSelectedKeys={[columns[0].id.toString()]}
      disallowEmptySelection
      classNames={{
        label: '!text-gray-100 font-bold',
        value: '!text-gray-100 text-base',
        trigger:
          'bg-transparent shadow-none border border-gray-100/25 p-0 min-h-fit h-fit px-4 py-2 rounded hover:!bg-gray-50',
      }}
    >
      {columns.map((column) => (
        <SelectItem
          key={column.id}
          value={column.id}
          className="text-gray-100 hover:!bg-purple-100/25 data-[selected=true]:!bg-purple-100 data-[selected=true]:!text-white data-[selectable=true]:focus:bg-transparent data-[selectable=true]:focus:text-gray-100 data-[selectable=true]:focus:hover:text-purple-100 [&_span]:text-base"
        >
          {column.name}
        </SelectItem>
      ))}
    </Select>
  )
}
