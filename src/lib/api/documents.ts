import { API_V1_BASE_URL } from '@/lib/config';
import { DocumentCounterModel, DocumentCreateRequest, DocumentModel, DocumentModelWithPagination, DocumentReviewDetailModel, DocumentToReviewModel, DocumentTrackingModel } from '@/types/document';
import { fetchWithAuth } from '../fetchWithAuth';

export async function fetchDocuments(status?: string, title?: string, page: string = '1', limit: string = '10'): Promise<DocumentModelWithPagination> {
  const res = await fetchWithAuth(`${API_V1_BASE_URL}/documents?${status ? `status=${status}&` : ''}${title ? `title=${title}&` : ''}page=${page}&limit=${limit}`, {
    next: { tags: ['document'] }, // Enables cache invalidation if needed
    cache: 'no-store', // Or 'force-cache' if data is not updated often
  })
  if (!res.ok) {
    throw new Error('Failed to fetch documents')
  }

  const json = await res.json()
  return json.data as DocumentModelWithPagination
}

export async function createDocument(data: DocumentCreateRequest): Promise<DocumentModel> {
  const res = await fetchWithAuth(`${API_V1_BASE_URL}/documents`, {
    method: 'POST',
    cache: 'no-store', // Or 'force-cache' if data is not updated often
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    throw new Error('Failed to create document')
  }

  const json = await res.json()
  return json.data as DocumentModel
}

export async function getDocument(slug: string): Promise<DocumentModel> {
  const res = await fetchWithAuth(`${API_V1_BASE_URL}/documents/${slug}`, {
    cache: 'no-store', // Or 'force-cache' if data is not updated often
  })
  if (!res.ok) {
    throw new Error('Failed to fetch document')
  }

  const json = await res.json()
  return json.data as DocumentModel
}

export async function updateDocument(slug: string, data: DocumentCreateRequest): Promise<void> {
  const res = await fetchWithAuth(`${API_V1_BASE_URL}/documents/${slug}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    throw new Error('Failed to update document')
  }

  return
}

export async function deleteDocument(slug: string): Promise<void> {
  const res = await fetchWithAuth(`${API_V1_BASE_URL}/documents/${slug}`, {
    method: 'DELETE',
  })
  if (!res.ok) {
    throw new Error('Failed to delete document')
  }

  return
}

export async function getDocumentTracking(slug: string): Promise<DocumentTrackingModel[]> {
  const res = await fetchWithAuth(`${API_V1_BASE_URL}/documents/${slug}/tracking`, {
    cache: 'no-store', // Or 'force-cache' if data is not updated often
  })

  if (!res.ok) {
    throw new Error('Failed to fetch document tracking')
  }
  const json = await res.json()
  return json.data as DocumentTrackingModel[]
}

export async function fetchDocumentToReview(title?: string): Promise<DocumentToReviewModel[]> {
  const res = await fetchWithAuth(`${API_V1_BASE_URL}/documents/to-review?${title ? `title=${title}` : ''}`, {
    next: { tags: ['document-to-review'] }, // Enables cache invalidation if needed
    cache: 'no-store', // Or 'force-cache' if data is not updated often
  })
  if (!res.ok) {
    throw new Error('Failed to fetch documents to review')
  }

  const json = await res.json()
  return json.data as DocumentToReviewModel[]
}

export async function fetchDocumentReviewHistory(title?: string, status?: string): Promise<DocumentToReviewModel[]> {
  const res = await fetchWithAuth(`${API_V1_BASE_URL}/documents/to-review/history?${title ? `title=${title}&` : ''}${status ? `status=${status}` : ''}`, {
    next: { tags: ['document-review-history'] }, // Enables cache invalidation if needed
    cache: 'no-store', // Or 'force-cache' if data is not updated often
  })
  if (!res.ok) {
    throw new Error('Failed to fetch documents review history')
  }

  const json = await res.json()
  return json.data as DocumentToReviewModel[]
}

export async function getDocumentReview(slug: string): Promise<DocumentReviewDetailModel> {
  const res = await fetchWithAuth(`${API_V1_BASE_URL}/documents/to-review/${slug}`, {
    next: { tags: ['document-review'] }, // Enables cache invalidation if needed
    cache: 'no-store', // Or 'force-cache' if data is not updated often
  })
  if (!res.ok) {
    throw new Error('Failed to get documents review detail')
  }

  const json = await res.json()
  return json.data as DocumentReviewDetailModel
}

export async function fetchDocumentCounter(): Promise<DocumentCounterModel> {
  const res = await fetchWithAuth(`${API_V1_BASE_URL}/documents/counter`, {
    next: { tags: ['document-counter'] }, // Enables cache invalidation if needed
    cache: 'no-store', // Or 'force-cache' if data is not updated often
  })
  if (!res.ok) {
    console.log(res);

    throw new Error('Failed to fetch document counter')
  }

  const json = await res.json()
  return json.data as DocumentCounterModel
}

export async function reuploadDocumentFile(slug: string, approval_id: string, file_id: number): Promise<void> {
  const res = await fetchWithAuth(`${API_V1_BASE_URL}/documents/${slug}/reupload/${approval_id}`, {
    method: 'POST',
    body: JSON.stringify({ file_id }),
  })

  if (!res.ok) {
    throw new Error('Failed to reupload document file')
  }

  return
}
