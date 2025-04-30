import { RoleModel } from '@/types/role'
import { API_V1_BASE_URL } from '@/lib/config';
import { fetchWithAuth } from '../fetchWithAuth';

export async function fetchRoles(): Promise<RoleModel[]> {
  const res = await fetchWithAuth(`${API_V1_BASE_URL}/roles`, {
    next: { tags: ['roles'] }, // Enables cache invalidation if needed
    cache: 'no-store', // Or 'force-cache' if data is not updated often
  })

  if (!res.ok) {
    throw new Error('Failed to fetch roles')
  }

  const json = await res.json()
  return json.data as RoleModel[]
}
