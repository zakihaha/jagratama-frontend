export type DocumentModel = {
  id: number
  user_id: number
  category_id: number
  title: string
  slug: string
  description: string
  file_path: string
  created_at: string
  updated_at: string
  user: {
    id: number
    name: string
    email: string
    image_path: string
  }
  category: {
    id: number
    name: string
  }
}

export type DocumentCreateRequest = {
  title: string
  description?: string
  category_id: number
  approvers?: string[]
}

export type DocumentTrackingModel = {
  id: number
  note?: string
  status: string
  resolved_at?: string
  user: {
    id: number
    name: string
    email: string
    image_path: string
  }
}

export type DocumentToReviewModel = DocumentModel & {
  status: string
}
