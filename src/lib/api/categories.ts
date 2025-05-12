import { CategoryModel } from '@/types/category'
import { API_V1_BASE_URL } from '@/lib/config';
import { fetchWithAuth } from '../fetchWithAuth';

export async function fetchCategories(): Promise<CategoryModel[]> {
  const res = await fetchWithAuth(`${API_V1_BASE_URL}/categories`, {
    next: { tags: ['categories'] }, // Enables cache invalidation if needed
    cache: 'no-store', // Or 'force-cache' if data is not updated often
  })
  if (!res.ok) {
    throw new Error('Failed to fetch categories')
  }

  const json = await res.json()
  return json.data as CategoryModel[]
}
