import { UserCreateRequest, UserModel, UserModelWithPagination, UserProfileRequest } from '@/types/user'
import { API_V1_BASE_URL } from '@/lib/config';
import { fetchWithAuth } from '../fetchWithAuth';

export async function fetchUsers(name?: string, position?: number, page: number = 1, limit: number = 20): Promise<UserModelWithPagination> {
  const res = await fetchWithAuth(`${API_V1_BASE_URL}/users?page=${page}&limit=${limit}${name ? `&name=${name}` : ''}${position ? `&position_id=${position}` : ''}`, {
    next: { tags: ['users'] }, // Enables cache invalidation if needed
    cache: 'no-store', // Or 'force-cache' if data is not updated often
  })

  if (!res.ok) {
    throw new Error('Failed to fetch users')
  }

  const json = await res.json()
  return json.data as UserModelWithPagination
}

export async function createUser(data: UserCreateRequest): Promise<void> {
  const res = await fetchWithAuth(`${API_V1_BASE_URL}/users`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    throw new Error('Failed to create user')
  }

  return
}

export async function getUser(id: string): Promise<UserModel> {
  const res = await fetchWithAuth(`${API_V1_BASE_URL}/users/${id}`, {
    next: { tags: ['users'] }, // Enables cache invalidation if needed
    cache: 'no-store', // Or 'force-cache' if data is not updated often
  })

  if (!res.ok) {
    throw new Error('Failed to fetch user')
  }

  const json = await res.json()
  return json.data as UserModel
}

export async function updateUser(id: string, data: UserCreateRequest): Promise<void> {
  const res = await fetchWithAuth(`${API_V1_BASE_URL}/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    throw new Error('Failed to update user')
  }

  return
}

export async function deleteUser(id: string): Promise<void> {
  const res = await fetchWithAuth(`${API_V1_BASE_URL}/users/${id}`, {
    method: 'DELETE',
  })
  if (!res.ok) {
    throw new Error('Failed to delete user')
  }

  return
}

export async function updateUserProfile(data: UserProfileRequest): Promise<void> {
  const res = await fetchWithAuth(`${API_V1_BASE_URL}/users/profile`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    throw new Error('Failed to update user profile')
  }

  return
}

export async function fetchUsersApproverReviewer(): Promise<UserModel[]> {
  const res = await fetchWithAuth(`${API_V1_BASE_URL}/users/approver-reviewer`, {
    next: { tags: ['users-approver-reviewer'] }, // Enables cache invalidation if needed
    cache: 'no-store', // Or 'force-cache' if data is not updated often
  })
  if (!res.ok) {
    throw new Error('Failed to fetch users')
  }

  const json = await res.json()
  return json.data as UserModel[]
}

export async function updateUserPassword(oldPassword: string, newPassword: string): Promise<void> {
  const res = await fetchWithAuth(`${API_V1_BASE_URL}/users/password`, {
    method: 'PUT',
    body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
  })
  if (!res.ok) {
    throw new Error('Failed to update user password')
  }

  return
}
