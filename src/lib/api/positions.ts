import { PositionModel } from '@/types/position'
import { API_V1_BASE_URL } from '@/lib/config';
import { fetchWithAuth } from '../fetchWithAuth';

export async function fetchPositions(): Promise<PositionModel[]> {
  const res = await fetchWithAuth(`${API_V1_BASE_URL}/positions`, {
    next: { tags: ['positions'] }, // Enables cache invalidation if needed
    cache: 'no-store', // Or 'force-cache' if data is not updated often
  })

  if (!res.ok) {
    throw new Error('Failed to fetch positions')
  }

  const json = await res.json()
  return json.data as PositionModel[]
}

export async function fetchPositionCategoryRulesByCategoryId(categoryId: number): Promise<PositionModel[]> {
  const res = await fetchWithAuth(`${API_V1_BASE_URL}/positions/rules-by-category/${categoryId}`, {
    next: { tags: ['position_category_rules'] },
    cache: 'no-store', // Or 'force-cache' if data is not updated often
  })
  const json = await res.json();
  return json.data as PositionModel[]
}
