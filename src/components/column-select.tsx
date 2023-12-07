import { Select, SelectItem } from '@nextui-org/select'
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from 'react-hook-form'
import useAppStore from '~/zustand/app-store'

interface ColumnSelectProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>
  name: Path<TFieldValues>
  onChange?: (value: string) => void
}

export default function ColumnSelect<TFieldValues extends FieldValues>({
  control,
  name,
  onChange,
}: ColumnSelectProps<TFieldValues>) {
  const board = useAppStore((state) => state.currentBoard)
  const columns = board?.columns ?? []

  if (!columns[0]) return null
  const defaultSelectedKey = columns[0].id.toString()

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Select
          {...field}
          onChange={(e) => {
            onChange?.(e.target.value)
            field.onChange(e)
          }}
          label="Status"
          placeholder="Select a column"
          labelPlacement="outside"
          selectedKeys={[String(field.value)]}
          defaultSelectedKeys={[defaultSelectedKey]}
          disallowEmptySelection
          classNames={{
            label:
              'text-xs md:text-sm !text-gray-100 font-bold dark:!text-white',
            value: '!text-gray-100 text-base',
            trigger:
              'bg-transparent shadow-none border border-gray-100/25 p-0 min-h-fit h-fit px-4 py-2 rounded hover:!bg-gray-50 dark:hover:!bg-purple-100/25 transition-colors',
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
      )}
    />
  )
}
