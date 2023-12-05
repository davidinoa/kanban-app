/* eslint-disable @typescript-eslint/no-use-before-define */
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/modal'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { flushSync } from 'react-dom'
import { useFieldArray, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'
import { useShallow } from 'zustand/react/shallow'
import CrossIcon from '~/assets/icon-cross.svg'
import { api } from '~/utils/api'
import useAppStore from '~/zustand/app-store'
import Button from '../button'

const maxNameLength = 255
const nameTooLongMessage = `Name must be at most ${maxNameLength} characters long`

const columnSchema = z.union([
  z.object({
    columnId: z.string(),
    columnName: z.string().min(1).max(maxNameLength, nameTooLongMessage),
  }),
  z.object({
    columnName: z.string().min(1).max(maxNameLength, nameTooLongMessage),
  }),
])

const formSchema = z.object({
  boardName: z
    .string()
    .min(1, 'Board name is required')
    .max(maxNameLength, nameTooLongMessage),
  columns: z.array(columnSchema).optional(),
})

type FormValues = z.infer<typeof formSchema>

type NewBoardModalProps = {
  mode: 'create' | 'edit'
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
}

export default function CreateEditBoardModal({
  mode,
  isOpen,
  onOpenChange,
}: NewBoardModalProps) {
  const createMutation = api.boards.create.useMutation()
  const editMutation = api.boards.edit.useMutation()
  const isLoading = createMutation.isLoading || editMutation.isLoading

  const isCreating = mode === 'create'
  const board = useAppStore(useShallow((state) => state.currentBoard))

  const defaultValues = isCreating
    ? {
        boardName: '',
      }
    : {
        boardName: board?.name ?? '',
        columns: board?.columns.length
          ? [
              ...board.columns.map((column) => ({
                columnId: String(column.id),
                columnName: column.name,
              })),
            ]
          : undefined,
      }

  const [readyToClose, setReadyToClose] = useState(false)

  useEffect(() => {
    if (readyToClose) {
      setReadyToClose(false)
      onOpenChange(false)
    }
  }, [onOpenChange, readyToClose])

  if (!isCreating && !board) {
    return null
  }

  return (
    <Modal
      scrollBehavior="inside"
      placement="center"
      isOpen={isOpen}
      onOpenChange={(value) => onOpenChange(isLoading ? true : value)}
      isDismissable={!isLoading}
      hideCloseButton={isLoading}
      classNames={{
        wrapper: 'p-4',
        base: 'max-w-[30rem] max-h-[min(calc(100%-2rem),37.5rem)]',
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 pt-6">
          <h2 className="heading-lg">
            {isCreating ? 'Add New Board' : 'Edit Board'}
          </h2>
        </ModalHeader>
        {isOpen ? (
          <Form
            boardId={board?.id}
            isCreating={isCreating}
            defaultValues={defaultValues}
            setReadyToClose={setReadyToClose}
          />
        ) : null}
      </ModalContent>
    </Modal>
  )
}

function Form({
  defaultValues,
  isCreating,
  setReadyToClose,
  boardId,
}: {
  defaultValues: FormValues
  isCreating: boolean
  setReadyToClose: (value: boolean) => void
  boardId?: number
}) {
  const router = useRouter()

  const apiUtils = api.useUtils()
  const createMutation = api.boards.create.useMutation()
  const editMutation = api.boards.edit.useMutation()

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  const {
    fields: columnFields,
    append,
    remove,
  } = useFieldArray({
    name: 'columns',
    control,
  })

  const isLoading = createMutation.isLoading || editMutation.isLoading

  return (
    <>
      <ModalBody>
        <form
          id="create-edit-board-form"
          className="flex flex-col gap-6 text-gray-100 dark:text-white"
          onSubmit={handleSubmit((data) => {
            const payload = {
              boardName: data.boardName,
              columns:
                data.columns
                  ?.filter(
                    (c): c is { columnName: string; columnId?: string } =>
                      Boolean(c.columnName),
                  )
                  .map((c) => ({
                    ...c,
                    columnId: c.columnId ? Number(c.columnId) : undefined,
                  })) ?? [],
            }

            async function handleMutationSuccess() {
              await apiUtils.boards.getAllNames.invalidate()
              await apiUtils.boards.getById.invalidate()
              toast.success('Board updated successfully')
              reset(isCreating ? undefined : payload)
            }

            if (isCreating) {
              return createMutation.mutate(payload, {
                onError: (error) =>
                  toast.error(error.message ?? 'Failed to create board'),
                onSuccess: ({ id }) => {
                  handleMutationSuccess()
                    .then(() => setReadyToClose(true))
                    .then(() => router.push(`/boards/${id}`))
                    .catch(() => toast.error("Couldn't redirect to new board"))
                },
              })
            }

            return editMutation.mutate(
              {
                ...payload,
                boardId: boardId!,
              },
              {
                onSuccess: () => {
                  handleMutationSuccess()
                    .then(() => setReadyToClose(true))
                    .catch(() => undefined)
                },
              },
            )
          })}
        >
          <label className="flex flex-col gap-2">
            <span className="text-xs font-bold md:text-sm">Board Name</span>
            <input
              {...register('boardName', { required: true })}
              type="text"
              autoComplete="off"
              placeholder="e.g. Web Design"
              aria-invalid={Boolean(errors.boardName)}
              className="rounded-sm border border-gray-100/25 bg-transparent px-4 py-2 placeholder:text-gray-100/50 aria-invalid:border-red-100"
            />
            {errors.boardName && (
              <p role="alert" className="text-xs text-red-100 md:text-sm">
                {errors.boardName.message}
              </p>
            )}
          </label>
          <fieldset className="flex flex-col gap-3">
            {columnFields.length > 0 && (
              <legend className="mb-2 text-xs font-bold md:text-sm">
                Board Columns
              </legend>
            )}
            {columnFields.map((field, index) => (
              <div key={field.id}>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    autoComplete="off"
                    placeholder="e.g. Todo"
                    aria-invalid={Boolean(errors.columns?.[index])}
                    className="grow rounded border border-gray-100/25 bg-transparent px-4 py-2 placeholder:text-gray-100/50 aria-invalid:border-red-100"
                    {...register(`columns.${index}.columnName`)}
                  />
                  <Button
                    variant="icon"
                    id={`delete-column-${index}`}
                    aria-label="delete column"
                    className="-mr-2 h-fit px-2 py-2"
                    onPress={() => {
                      const previousInput = document.querySelector(
                        `[name="columns.${index - 1}.columnName"]`,
                      ) as HTMLInputElement | undefined
                      previousInput?.focus()
                      remove(index)
                    }}
                  >
                    <CrossIcon />
                  </Button>
                </div>
                {errors.columns?.[index] && (
                  <p role="alert" className="text-xs text-red-100 md:text-sm">
                    Enter a name or remove this field
                  </p>
                )}
              </div>
            ))}
            <Button
              variant="secondary"
              className="w-full text-xs md:text-sm"
              isDisabled={watch('columns')?.at(-1)?.columnName === ''}
              onPress={(e) => {
                flushSync(() => append({ columnName: '' }))
                e.target.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              + Add New Column
            </Button>
          </fieldset>
        </form>
      </ModalBody>
      <ModalFooter className="flex flex-col pb-6 md:pb-8">
        <Button
          variant="primary"
          className="w-full text-xs md:text-sm"
          type="submit"
          form="create-edit-board-form"
          isLoading={isLoading}
        >
          {isCreating ? 'Create New Board' : 'Save Changes'}
        </Button>
      </ModalFooter>
    </>
  )
}

/**
 * TODOS:
 * - Disable input after reaching limit
 */
