import { z } from 'zod'

export const CreateDocumentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  category_id: z.number().min(1, 'Category is required'),
})

export type CreateDocumentInput = z.infer<typeof CreateDocumentSchema>
