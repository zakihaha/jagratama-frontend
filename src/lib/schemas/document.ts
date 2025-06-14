import { z } from 'zod'

export const CreateDocumentSchema = z.object({
  file_id: z.number().min(1, 'File is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  category_id: z.number().min(1, 'Category is required'),
  approvers: z.array(z.string().email('Invalid email address')).min(2, 'At least 2 approvers are required'),
})

export type CreateDocumentInput = z.infer<typeof CreateDocumentSchema>
