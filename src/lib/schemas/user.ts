import { z } from 'zod'

export const CreateUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  role_id: z.number().min(1, 'Role is required'),
  position_id: z.number().min(1, 'Position is required'),
  organization: z.string().optional(),
})

export const UpdateUserProfileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  image_id: z.number().optional(),
})

export const UpdateUserPasswordSchema = z.object({
  old_password: z.string(),
  new_password: z.string().min(8, 'Password harus memiliki minimal 8 karakter'),
})

export type CreateUserInput = z.infer<typeof CreateUserSchema>
export type UpdateUserProfileInput = z.infer<typeof UpdateUserProfileSchema>
export type UpdateUserPasswordInput = z.infer<typeof UpdateUserPasswordSchema>
