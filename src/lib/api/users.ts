import { User } from '@/types/user'
import { API_V1_BASE_URL } from '@/lib/config';

export async function fetchUsers(): Promise<User[]> {
  const res = await fetch(`${API_V1_BASE_URL}/users`, {
    // Next.js 15 Server Component fetch best practice:
    next: { tags: ['users'] }, // Enables cache invalidation if needed
    cache: 'no-store', // Or 'force-cache' if data is not updated often
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6Ilpha2kiLCJlbWFpbCI6Inpha2lAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiZXhwIjoxNzQ1MzgyMzk0fQ.2LJUH8_BDp_3U3F56l_5RawZeOvtTdnRTV-gsNNr_as`,
    },
  })

  if (!res.ok) throw new Error('Failed to fetch users')

  const json = await res.json()
  console.log(json);
  
  return json.data as User[]
}
