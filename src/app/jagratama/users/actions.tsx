'use server'

import { CreateUserSchema, UpdateUserPasswordSchema, UpdateUserProfileSchema } from '@/lib/schemas/user'
import { createUser, updateUser, updateUserPassword, updateUserProfile } from '@/lib/api/users';
import { revalidatePath } from 'next/cache';
import { UserCreateRequest, UserPasswordRequest, UserProfileRequest } from '@/types/user';
import { uploadFile } from '@/lib/api/files';

export type Errors = {
  general?: string[];

  name?: string[];
  email?: string[];
  organization?: string[];
  role_id?: string[];
  position_id?: string[];
  image_id?: string[];
  [key: string]: string[] | undefined; // for any other fields that might have errors
};

export type FormState = {
  success: boolean;
  message: string;
  errors: Errors;
};

export async function createUserAction(prevState: FormState, formData: FormData) {
  const errors: Errors = {}

  const name = formData.get('name')
  const email = formData.get('email')
  const role_id_str = formData.get('role_id')
  const position_id_str = formData.get('position_id')
  const organization = formData.get('organization')

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
    organization: organization ? (organization as string) : undefined,
  }

  const parsed = CreateUserSchema.safeParse(data)

  if (!parsed.success) {
    parsed.error.flatten().fieldErrors.name && (errors.name = parsed.error.flatten().fieldErrors.name)
    parsed.error.flatten().fieldErrors.email && (errors.email = parsed.error.flatten().fieldErrors.email)
    parsed.error.flatten().fieldErrors.role_id && (errors.role_id = parsed.error.flatten().fieldErrors.role_id)
    parsed.error.flatten().fieldErrors.position_id && (errors.position_id = parsed.error.flatten().fieldErrors.position_id)
    parsed.error.flatten().fieldErrors.organization && (errors.organization = parsed.error.flatten().fieldErrors.organization)
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
  const organization = formData.get('organization') as string;

  const errors: Errors = {}
  const data: UserCreateRequest = {
    name,
    email,
    role_id: parseInt(role_id),
    position_id: parseInt(position_id),
    organization: organization ? organization : undefined,
  }

  try {
    await updateUser(id, data)
    revalidatePath('/jagratama/users');
    return { success: true, message: "User updated successfully", errors: {} };
  } catch (err) {
    if (err instanceof Error) {
      errors.general = [err.message]
    } else {
      errors.general = ['Failed to update user']
    }
    return { success: false, message: "Failed to update user", errors };
  }
}

export async function deleteUserAction(prevState: FormState, formData: FormData) {
  return { success: true, message: "User deleted successfully", errors: {} }
  // const id = formData.get('id') as string;
  // const errors: Errors = {}

  try {
    //   await deleteUser(id)
    //   revalidatePath('/jagratama/users'); // refreshes the user list page
    // return { success: true, message: "User deleted successfully", errors: {} }
  } catch (error) {
    // errors.general = ['Failed to delete user']
    // return { success: false, message: "Failed to delete user", errors: errors }
  }
}

export async function updateProfileAction(prevState: FormState, formData: FormData) {
  const errors: Errors = {}

  const file = formData.get('file') as File

  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      errors.image_id = ['File size exceeds 5MB']
      return { success: false, message: "Failed to update profile.", errors }
    }

    const allowedTypes = ['image/jpeg', 'image/png']
    if (!allowedTypes.includes(file.type)) {
      errors.image_id = ['File type not allowed']
      return { success: false, message: "Failed to update profile.", errors }
    }

    try {
      const formDataFile = new FormData()
      formDataFile.append('file', file)

      const res = await uploadFile(formDataFile)
      const file_id = res.id

      formData.set('image_id', file_id.toString())
    } catch (error) {
      if (error instanceof Error) {
        errors.general = [error.message]
      } else {
        errors.general = ['Failed to upload file']
      }

      return { success: false, message: "Failed to create document.", errors }
    }
  }

  const name = formData.get('name') as string;
  const image_id_str = formData.get('image_id') as string;

  const data: UserProfileRequest = {
    name,
  }

  if (image_id_str) {
    data.image_id = parseInt(image_id_str)
  }

  const parsed = UpdateUserProfileSchema.safeParse(data)

  if (!parsed.success) {
    parsed.error.flatten().fieldErrors.name && (errors.name = parsed.error.flatten().fieldErrors.name)
    parsed.error.flatten().fieldErrors.image_id && (errors.image_id = parsed.error.flatten().fieldErrors.image_id)

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

export async function updatePasswordAction(prevState: FormState, formData: FormData) {
  const errors: Errors = {}

  const oldPassword = formData.get('old_password') as string;
  const newPassword = formData.get('new_password') as string;

  if (!oldPassword || !newPassword) {
    errors.general = ['Password lama dan password baru harus diisi']
    return { success: false, message: "Failed to update password.", errors }
  }

  const data: UserPasswordRequest = {
    old_password: oldPassword,
    new_password: newPassword,
  }

  const parsed = UpdateUserPasswordSchema.safeParse(data)

  if (!parsed.success) {
    parsed.error.flatten().fieldErrors.old_password && (errors.old_password = parsed.error.flatten().fieldErrors.old_password)
    parsed.error.flatten().fieldErrors.new_password && (errors.new_password = parsed.error.flatten().fieldErrors.new_password)
    return { success: false, message: "Gagal update password.", errors }
  }


  try {
    await updateUserPassword(oldPassword, newPassword);

    return { success: true, message: "Password updated successfully", errors: {} };
  } catch (error) {
    console.log('Error updating password:', error);
    
    if (error instanceof Error) {
      errors.general = [error.message]
    } else {
      errors.general = ['Failed to update password']
    }

    return { success: false, message: "Failed to update password", errors }
  }
}
