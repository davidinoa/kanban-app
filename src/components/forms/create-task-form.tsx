import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useRef } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import CrossIcon from '~/assets/icon-cross.svg'
import { createFormSchema, type CreateFormValues } from '~/schemas/task-schemas'
import { api, type RouterOutputs } from '~/utils/api'
import Button from '../button'
import ColumnSelect from '../column-select'

type FormState = {
  isLoading: boolean
  isValid: boolean
  isDirty: boolean
}

type CreateTaskFormProps = {
  board: RouterOutputs['boards']['getById']
  onClose: () => void
  onFormStateChange: (state: FormState) => void
}

export default function CreateTaskForm({
  board,
  onClose,
  onFormStateChange,
}: CreateTaskFormProps) {
  const apiUtils = api.useUtils()
  const createMutation = api.tasks.create.useMutation()
  const { isLoading } = createMutation

  const { register, handleSubmit, formState, reset, control, watch } =
    useForm<CreateFormValues>({
      resolver: zodResolver(createFormSchema),
      defaultValues: {
        taskTitle: '',
        description: '',
        subtasks: [{ subtaskTitle: '' }],
        // TODO: fix this - columns[0] should always exist here
        columnId: board.columns[0]?.id.toString() ?? '',
      },
    })

  const onFormStateChangeRef = useRef(onFormStateChange)

  const {
    fields: subtaskFields,
    append,
    remove,
  } = useFieldArray({
    name: 'subtasks',
    control,
  })

  useEffect(() => {
    onFormStateChangeRef.current?.({
      isLoading,
      isValid: formState.isValid,
      isDirty: formState.isDirty,
    })
  }, [formState.isDirty, formState.isValid, isLoading])

  return (
    <form
      id="create-task-form"
      className="flex flex-col gap-6 py-2 text-gray-100 dark:text-white"
      onSubmit={handleSubmit((data) => {
        const { taskTitle, description, subtasks, columnId } = data

        const payload = {
          taskTitle,
          description,
          columnId: Number(columnId),
          subtasks: subtasks.filter((c): c is { subtaskTitle: string } =>
            Boolean(c.subtaskTitle),
          ),
        }

        return createMutation.mutate(payload, {
          onError: (error) => {
            toast.error(error.message)
          },
          onSuccess: () => {
            apiUtils.boards.getById
              .invalidate()
              .then(() => toast.success('Task created successfully'))
              .then(() => reset())
              .then(() => onClose())
              .catch(() => toast.error('Failed to update task'))
          },
        })
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

/**
 * TODOS:
 * - Display errors to the users
 * - Disable input after reaching limit
 */
