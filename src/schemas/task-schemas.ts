import { z } from 'zod'

const maxTitleLength = 255
const maxDescriptionLength = 5_000
const titleTooLongMessage = `Title must be at most ${maxTitleLength} characters long`

const subtaskSchema = z.object({
  subtaskId: z.number().optional(),
  subtaskTitle: z.string().max(maxTitleLength, titleTooLongMessage).optional(),
})

export const createFormSchema = z.object({
  taskTitle: z
    .string()
    .min(1, 'Task title is required')
    .max(maxTitleLength, titleTooLongMessage),
  description: z.string().max(maxDescriptionLength).optional(),
  subtasks: z.array(subtaskSchema),
  columnId: z.string(),
})

export const editFormSchema = z.object({
  taskId: z.number(),
  taskTitle: z
    .string()
    .min(1, 'Task title is required')
    .max(maxTitleLength, titleTooLongMessage),
  description: z.string().max(maxDescriptionLength).nullable().optional(),
  subtasks: z.array(subtaskSchema),
  columnId: z.string(),
})

export type CreateFormValues = z.infer<typeof createFormSchema>
export type EditFormValues = z.infer<typeof editFormSchema>
