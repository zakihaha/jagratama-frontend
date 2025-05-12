import { API_V1_BASE_URL } from '@/lib/config';
import { fetchWithAuth } from '../fetchWithAuth';
import { FileModel } from '@/types/file';

export async function uploadFile(data: FormData): Promise<FileModel> {
  const res = await fetchWithAuth(`${API_V1_BASE_URL}/upload`, {
    method: 'POST',
    cache: 'no-store', // Or 'force-cache' if data is not updated often
    body: data,
  }, false)
  if (!res.ok) {
    throw new Error('Failed to upload file')
  }

  const json = await res.json()
  return json.data as FileModel
}
