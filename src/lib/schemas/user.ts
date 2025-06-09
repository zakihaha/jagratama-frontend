import { z } from 'zod'

export const CreateUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  role_id: z.number().min(1, 'Role is required'),
  position_id: z.number().min(1, 'Position is required'),
  organization: z.string().optional(),
})
export type CreateUserInput = z.infer<typeof CreateUserSchema>

export const UpdateUserProfileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  image_id: z.number().optional(),
})
export type UpdateUserProfileInput = z.infer<typeof UpdateUserProfileSchema>
