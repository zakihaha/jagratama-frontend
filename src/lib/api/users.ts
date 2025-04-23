import { UserCreateRequest, UserModel } from '@/types/user'
import { API_V1_BASE_URL } from '@/lib/config';

export async function fetchUsers(): Promise<UserModel[]> {
  const res = await fetch(`${API_V1_BASE_URL}/users`, {
    next: { tags: ['users'] }, // Enables cache invalidation if needed
    cache: 'no-store', // Or 'force-cache' if data is not updated often
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer`,
    },
  })

  if (!res.ok) {
    throw new Error('Failed to fetch users')
  }

  const json = await res.json()
  return json.data as UserModel[]
}

export async function createUser(data: UserCreateRequest): Promise<void> {
  const res = await fetch(`${API_V1_BASE_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer`,
    },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    throw new Error('Failed to create user')
  }

  return
}

export async function getUser(id: string): Promise<UserModel> {
  const res = await fetch(`${API_V1_BASE_URL}/users/${id}`, {
    next: { tags: ['users'] }, // Enables cache invalidation if needed
    cache: 'no-store', // Or 'force-cache' if data is not updated often
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer`,
    },
  })

  if (!res.ok) {
    throw new Error('Failed to fetch user')
  }

  const json = await res.json()
  return json.data as UserModel
}

export async function updateUser(id: string, data: UserCreateRequest): Promise<void> {
  const res = await fetch(`${API_V1_BASE_URL}/users/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer`,
    },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    throw new Error('Failed to update user')
  }

  return
}

export async function deleteUser(id: string): Promise<void> {
  const res = await fetch(`${API_V1_BASE_URL}/users/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer`,
    },
  })
  if (!res.ok) {
    throw new Error('Failed to delete user')
  }
  
  return
}
