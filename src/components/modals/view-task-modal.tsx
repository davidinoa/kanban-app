import { Checkbox, CheckboxGroup } from '@nextui-org/checkbox'
import { Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/modal'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { api, type RouterOutputs } from '~/utils/api'
import ColumnSelect from '../column-select'

type Task =
  RouterOutputs['boards']['getById']['columns'][number]['tasks'][number]

type ViewTaskModalProps = {
  task: Task
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
}

export default function ViewTaskModal({
  task,
  isOpen,
  onOpenChange,
}: ViewTaskModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="center"
      scrollBehavior="inside"
      classNames={{
        wrapper: 'p-4',
        base: 'm-0 max-h-full',
      }}
    >
      <ModalContent>
        <ModalHeader className="px-6 pb-0 pt-8">
          <h2>{task.title}</h2>
        </ModalHeader>
        <ModalBody className="px-6 pb-8 pt-6">
          <p className="text-xs leading-relaxed text-gray-100">
            {task.description}
          </p>
          <Form
            taskId={task.id}
            columnId={task.columnId}
            subtasks={task.subtasks}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

type FormProps = {
  taskId: number
  columnId: number
  subtasks: Task['subtasks']
}

function Form({ taskId, columnId, subtasks }: FormProps) {
  const defaultCheckedSubtasks = subtasks
    .filter((subtask) => subtask.isCompleted)
    .map((subtask) => subtask.id.toString())

  const { control } = useForm({
    defaultValues: {
      columnId: columnId.toString(),
      subtasks: defaultCheckedSubtasks,
    },
  })

  const apiUtils = api.useUtils()
  const subtaskUpdateMutation = api.subtasks.update.useMutation()
  const taskUpdateMutation = api.tasks.update.useMutation()

  return (
    <div className="flex flex-col gap-6">
      <Controller
        name="subtasks"
        control={control}
        render={({ field }) => (
          <CheckboxGroup
            value={field.value}
            onChange={field.onChange}
            label={`Subtasks (${field.value.length}/${subtasks.length})`}
            classNames={{
              base: 'w-full',
              label: 'text-xs font-bold',
            }}
          >
            {subtasks.map((subtask) => (
              <Checkbox
                key={subtask.id}
                value={subtask.id.toString()}
                onChange={(e) => {
                  subtaskUpdateMutation.mutate({
                    id: subtask.id,
                    isCompleted: e.target.checked,
                  })
                }}
                checked={field.value.includes(subtask.id.toString())}
                classNames={{
                  base: 'px-3 py-4 bg-gray-400 hover:bg-purple-100/25 transition-colors max-w-full rounded m-0 [&>:nth-child(2)]:after:bg-purple-100',
                  label:
                    'text-xs font-bold group-data-[selected=true]:line-through group-data-[selected=true]:text-white/50',
                }}
              >
                {subtask.title}
              </Checkbox>
            ))}
          </CheckboxGroup>
        )}
      />
      <ColumnSelect
        control={control}
        name="columnId"
        onChange={(selectedId: string) => {
          taskUpdateMutation.mutate(
            {
              id: taskId,
              columnId: Number(selectedId),
            },
            {
              onSuccess: () => {
                apiUtils.boards.getById
                  .invalidate()
                  .catch(() => toast.error('Failed to update task status'))
              },
            },
          )
        }}
      />
    </div>
  )
}
