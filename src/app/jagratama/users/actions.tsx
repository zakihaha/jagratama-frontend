'use server'

import { CreateUserSchema, UpdateUserProfileSchema } from '@/lib/schemas/user'
import { createUser, deleteUser, updateUser, updateUserProfile } from '@/lib/api/users';
import { revalidatePath } from 'next/cache';
import { UserCreateRequest, UserProfileRequest } from '@/types/user';

export type Errors = {
  general?: string[];

  name?: string[];
  email?: string[];
  password?: string[];
  role_id?: string[];
  position_id?: string[];
};

export type FormState = {
  success: boolean;
  message: string;
  errors: Errors;
};

export async function createUserAction(prevState: FormState, formData: FormData) {
  const errors: Errors = {}

  let name = formData.get('name')
  let email = formData.get('email')
  let role_id_str = formData.get('role_id')
  let position_id_str = formData.get('position_id')
  let password = formData.get('password')

  let role_id = 0
  let position_id = 0

  if (typeof role_id_str === 'string') {
    role_id = parseInt(role_id_str)
  } else if (typeof role_id_str === 'number') {
    role_id = role_id_str
  }

  if (typeof position_id_str === 'string') {
    position_id = parseInt(position_id_str)
  } else if (typeof position_id_str === 'number') {
    position_id = position_id_str
  }

  const data: UserCreateRequest = {
    name: name as string,
    email: email as string,
    role_id,
    position_id,
    password: password as string,
  }

  const parsed = CreateUserSchema.safeParse(data)

  if (!parsed.success) {
    parsed.error.flatten().fieldErrors.name && (errors.name = parsed.error.flatten().fieldErrors.name)
    parsed.error.flatten().fieldErrors.email && (errors.email = parsed.error.flatten().fieldErrors.email)
    parsed.error.flatten().fieldErrors.password && (errors.password = parsed.error.flatten().fieldErrors.password)
    parsed.error.flatten().fieldErrors.role_id && (errors.role_id = parsed.error.flatten().fieldErrors.role_id)
    parsed.error.flatten().fieldErrors.position_id && (errors.position_id = parsed.error.flatten().fieldErrors.position_id)
    return { success: false, message: "Failed to create user.", errors }
  }

  try {
    await createUser(parsed.data)
    revalidatePath('/jagratama/users'); // refreshes the user list page
    return { success: true, message: "User created successfully", errors: {} }
  } catch (error) {
    if (error instanceof Error) {
      errors.general = [error.message]
    } else {
      errors.general = ['Failed to create user']
    }
    return { success: false, message: "Failed to create user", errors: errors }
  }
}

export async function updateUserAction(prevState: FormState, formData: FormData) {
  const id = formData.get('id') as string;
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const role_id = formData.get('role_id') as string;
  const position_id = formData.get('position_id') as string;

  const errors: Errors = {}
  const data: UserCreateRequest = {
    name,
    email,
    role_id: parseInt(role_id),
    position_id: parseInt(position_id),
    password: '',
  }

  try {
    await updateUser(id, data)
    revalidatePath('/jagratama/users');
    return { success: true, message: "User updated successfully", errors: {} };
  } catch (err) {
    errors.general = ['Failed to update user']
    return { success: false, message: "Failed to update user", errors };
  }
}

export async function deleteUserAction(prevState: FormState, formData: FormData) {
  const id = formData.get('id') as string;
  const errors: Errors = {}

  try {
    await deleteUser(id)
    revalidatePath('/jagratama/users'); // refreshes the user list page
    return { success: true, message: "User deleted successfully", errors: {} }
  } catch (error) {
    errors.general = ['Failed to delete user']
    return { success: false, message: "Failed to delete user", errors: errors }
  }
}

export async function updateProfileAction(prevState: FormState, formData: FormData) {
  const name = formData.get('name') as string;

  const errors: Errors = {}
  const data: UserProfileRequest = {
    name,
  }

  const parsed = UpdateUserProfileSchema.safeParse(data)

  if (!parsed.success) {
    parsed.error.flatten().fieldErrors.name && (errors.name = parsed.error.flatten().fieldErrors.name)
    return { success: false, message: "Failed to update user.", errors }
  }

  try {
    await updateUserProfile(data)
    return { success: true, message: "Profile updated successfully", errors: {} };
  } catch (err) {
    errors.general = ['Failed to update user']
    return { success: false, message: "Failed to update profile", errors };
  }
}
