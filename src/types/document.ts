export type DocumentModel = {
  id: number
  user_id: number
  category_id: number
  title: string
  slug: string
  description: string
  file_path: string
  last_status: string // pending, approved, rejected
  approved_at: string
  created_at: string
  updated_at: string
  user: {
    id: number
    name: string
    email: string
    image: string
  }
  addressed_user: {
    id: number
    name: string
    email: string
    image: string
  }
  category: {
    id: number
    name: string
  }
}

export type DocumentCreateRequest = {
  title: string
  file_id: number
  description?: string
  category_id: number
  approvers: string[]
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

export type DocumentCounterModel = {
  total_document: number
  total_rejected: number
  total_pending: number
  total_approved: number
}
