import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useRef } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import CrossIcon from '~/assets/icon-cross.svg'
import { editFormSchema, type EditFormValues } from '~/schemas/task-schemas'
import { api, type RouterOutputs } from '~/utils/api'
import Button from '../button'
import ColumnSelect from '../column-select'

type FormState = {
  isLoading: boolean
  isValid: boolean
  isDirty: boolean
}

type EditTaskFormProps = {
  task: RouterOutputs['tasks']['get']
  onFormStateChange: (state: FormState) => void
  onClose: () => void
}

export default function EditTaskForm({
  task,
  onFormStateChange,
  onClose,
}: EditTaskFormProps) {
  const apiUtils = api.useUtils()
  const editMutation = api.tasks.update.useMutation()

  const { control, formState, handleSubmit, register, watch } =
    useForm<EditFormValues>({
      resolver: zodResolver(editFormSchema),
      defaultValues: {
        taskId: task.id,
        taskTitle: task.title,
        description: task.description,
        subtasks: task.subtasks.map((subtask) => ({
          subtaskId: subtask.id,
          subtaskTitle: subtask.title,
        })),
        columnId: task.columnId.toString(),
      },
    })

  const {
    fields: subtaskFields,
    append,
    remove,
  } = useFieldArray({
    name: 'subtasks',
    control,
  })

  const onFormStateChangeRef = useRef(onFormStateChange)
  const { isValid, isDirty } = formState
  const { isLoading } = editMutation
  useEffect(() => {
    onFormStateChangeRef.current?.({
      isLoading,
      isValid,
      isDirty,
    })
  }, [isLoading, isValid, isDirty])

  return (
    <form
      id="edit-task-form"
      className="flex flex-col gap-6 py-2 text-gray-100 dark:text-white"
      onSubmit={handleSubmit((values) => {
        editMutation.mutate(
          {
            id: values.taskId,
            title: values.taskTitle,
            description: values.description,
            columnId: Number(values.columnId),
            subtasks: values.subtasks.filter(
              (s): s is { subtaskTitle: string; subtaskId?: number } =>
                Boolean(s.subtaskTitle),
            ),
          },
          {
            onError: (error) => {
              toast.error(error.message)
            },
            onSuccess: () => {
              apiUtils.tasks.get
                .invalidate()
                .then(() => apiUtils.boards.getById.invalidate())
                .then(() => toast.success('Task updated successfully'))
                .then(() => onClose())
                .catch(() => toast.error('Failed to update task'))
            },
          },
        )
      })}
    >
      <label className="flex flex-col gap-2">
        <span className="text-xs font-bold md:text-sm">Title</span>
        <input
          {...register('taskTitle')}
          type="text"
          autoComplete="off"
          placeholder="e.g. Take coffee break"
          className="rounded-sm border border-gray-100/25 bg-transparent px-4 py-2 placeholder:text-gray-100/50"
        />
      </label>
      <label className="flex flex-col gap-2">
        <span className="text-xs font-bold md:text-sm">Description</span>
        <textarea
          {...register('description')}
          placeholder="e.g. It's always good to take a break."
          className="scrollbar-hidden h-[4.7rem] w-full resize-none rounded-sm border border-gray-100/25 bg-transparent px-4 py-2 leading-[1.75] placeholder:text-gray-100/50 sm:h-[7rem]"
        />
      </label>
      <fieldset className="flex flex-col gap-3 overflow-hidden pr-1">
        <legend className="mb-2 text-xs font-bold md:text-sm">Subtasks</legend>
        <div className="flex flex-1 flex-col gap-3">
          {subtaskFields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2 pr-2">
              <input
                type="text"
                placeholder="e.g. Todo"
                className="grow rounded border border-gray-100/25 bg-transparent px-4 py-2 placeholder:text-gray-100/50 "
                {...register(`subtasks.${index}.subtaskTitle`)}
              />
              <Button
                variant="icon"
                aria-label="delete subtask"
                className="-mr-2 h-fit px-2 py-2"
                onPress={() => remove(index)}
              >
                <CrossIcon />
              </Button>
            </div>
          ))}
        </div>
        <div className="px-1 pb-1">
          <Button
            variant="secondary"
            className="w-full flex-shrink-0"
            isDisabled={watch('subtasks')?.at(-1)?.subtaskTitle === ''}
            onPress={() => append({ subtaskTitle: '' })}
          >
            + Add New Subtask
          </Button>
        </div>
      </fieldset>
      <ColumnSelect control={control} name="columnId" />
    </form>
  )
}
