import { z } from 'zod'

export const CreateUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  role_id: z.number().min(1, 'Role is required'),
  position_id: z.number().min(1, 'Position is required'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
})

export type CreateUserInput = z.infer<typeof CreateUserSchema>
