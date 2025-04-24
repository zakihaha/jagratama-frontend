import { API_V1_BASE_URL } from '@/lib/config';
import { DocumentCreateRequest, DocumentModel, DocumentTrackingModel } from '@/types/document';

export async function fetchDocuments(): Promise<DocumentModel[]> {
  const res = await fetch(`${API_V1_BASE_URL}/documents`, {
    next: { tags: ['document'] }, // Enables cache invalidation if needed
    cache: 'no-store', // Or 'force-cache' if data is not updated often
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer`,
    },
  })

  if (!res.ok) {
    throw new Error('Failed to fetch documents')
  }

  const json = await res.json()
  return json.data as DocumentModel[]
}

export async function createDocument(data: DocumentCreateRequest): Promise<void> {
  console.log(data);

  const res = await fetch(`${API_V1_BASE_URL}/documents`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer`,
    },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    throw new Error('Failed to create document')
  }

  return
}

export async function getDocument(slug: string): Promise<DocumentModel> {
  const res = await fetch(`${API_V1_BASE_URL}/documents/${slug}`, {
    next: { tags: ['documents'] }, // Enables cache invalidation if needed
    cache: 'no-store', // Or 'force-cache' if data is not updated often
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer`,
    },
  })

  if (!res.ok) {
    throw new Error('Failed to fetch document')
  }

  const json = await res.json()
  return json.data as DocumentModel
}

export async function updateDocument(slug: string, data: DocumentCreateRequest): Promise<void> {
  const res = await fetch(`${API_V1_BASE_URL}/documents/${slug}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer`,
    },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    throw new Error('Failed to update document')
  }

  return
}

export async function deleteDocument(slug: string): Promise<void> {
  const res = await fetch(`${API_V1_BASE_URL}/documents/${slug}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer`,
    },
  })
  if (!res.ok) {
    throw new Error('Failed to delete document')
  }

  return
}

export async function getDocumentTracking(slug: string): Promise<DocumentTrackingModel[]> {
  const res = await fetch(`${API_V1_BASE_URL}/documents/${slug}/tracking`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer`,
    },
  })
  if (!res.ok) {
    throw new Error('Failed to fetch document tracking')
  }
  const json = await res.json()
  return json.data as DocumentTrackingModel[]
}
