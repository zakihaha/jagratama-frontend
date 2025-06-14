export type DocumentModel = {
  id: number
  user_id: number
  category_id: number
  title: string
  slug: string
  description: string
  file: string
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

export type DocumentModelWithPagination = {
  data: DocumentModel[]
  total_data: number
  limit: number
  page: number
  total_page: number
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
  file: string
  user: {
    id: number
    name: string
    email: string
    image: string
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
  total_users: number
}

export type DocumentReviewDetailModel = {
  title: string
  note: string
  file: string
  requires_signature: boolean
  is_reviewer: boolean
}
