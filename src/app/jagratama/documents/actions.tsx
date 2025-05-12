'use server'

import { revalidatePath } from 'next/cache';
import { DocumentCreateRequest } from '@/types/document';
import { CreateDocumentSchema } from '@/lib/schemas/document';
import { createDocument, deleteDocument, updateDocument } from '@/lib/api/documents';
import { uploadFile } from '@/lib/api/files';

export type Errors = {
  general?: string[];

  file_id?: string[];
  title?: string[];
  description?: string[];
  category_id?: string[];
  approvers?: string[];
};

export type FormState = {
  success: boolean;
  message: string;
  errors: Errors;
};

export async function createDocumentAction(prevState: FormState, formData: FormData) {
  const errors: Errors = {}

  // upload file
  const file = formData.get('file') as File

  if (!file) {
    errors.file_id = ['File is required']
    return { success: false, message: "Failed to create document.", errors }
  }
  if (file.size > 10 * 1024 * 1024) {
    errors.file_id = ['File size exceeds 10MB']
    return { success: false, message: "Failed to create document.", errors }
  }
  if (file.type !== 'application/pdf') {
    errors.file_id = ['File type must be PDF']
    return { success: false, message: "Failed to create document.", errors }
  }

  try {
    const formDataFile = new FormData()
    formDataFile.append('file', file)
    
    const res = await uploadFile(formDataFile)
    const file_id = res.id
    formData.set('file_id', file_id.toString())
  } catch (error) {
    if (error instanceof Error) {
      errors.file_id = [error.message]
    } else {
      errors.file_id = ['Failed to upload file']
    }
    return { success: false, message: "Failed to create document.", errors }
    throw new Error("Failed to create document")
  }

  // upload document
  let title = formData.get('title') as string
  let description = formData.get('description') as string
  let file_id_str = formData.get('file_id') as string
  let category_id_str = formData.get('category_id')
  let approvers_str = formData.get('approvers') as string

  let category_id = 0

  if (typeof category_id_str === 'string') {
    category_id = parseInt(category_id_str)
  } else if (typeof category_id_str === 'number') {
    category_id = category_id_str
  }

  let approvers: string[] = []

  if (approvers_str && approvers_str.length > 0) {
    approvers = JSON.parse(approvers_str) as string[]
  }

  const data: DocumentCreateRequest = {
    file_id: parseInt(file_id_str),
    title,
    description,
    category_id,
    approvers,
  }

  const parsed = CreateDocumentSchema.safeParse(data)

  if (!parsed.success) {
    parsed.error.flatten().fieldErrors.file_id && (errors.file_id = parsed.error.flatten().fieldErrors.file_id)
    parsed.error.flatten().fieldErrors.title && (errors.title = parsed.error.flatten().fieldErrors.title)
    parsed.error.flatten().fieldErrors.description && (errors.description = parsed.error.flatten().fieldErrors.description)
    parsed.error.flatten().fieldErrors.category_id && (errors.category_id = parsed.error.flatten().fieldErrors.category_id)
    parsed.error.flatten().fieldErrors.approvers && (errors.approvers = parsed.error.flatten().fieldErrors.approvers)
    return { success: false, message: "Failed to create document.", errors }
  }

  try {
    await createDocument(parsed.data)
    revalidatePath('/jagratama/documents');
    return { success: true, message: "Document created successfully", errors: {} }
  } catch (error) {
    if (error instanceof Error) {
      errors.general = [error.message]
    } else {
      errors.general = ['Failed to create document']
    }
    return { success: false, message: "Failed to create document", errors: errors }
  }
}

export async function deleteDocumentAction(prevState: FormState, formData: FormData) {
  const slug = formData.get('slug') as string;
  const errors: Errors = {}

  try {
    await deleteDocument(slug)
    revalidatePath('/jagratama/documents'); // refreshes the document list page
    return { success: true, message: "Document deleted successfully", errors: {} }
  } catch (error) {
    errors.general = ['Failed to delete document']
    return { success: false, message: "Failed to delete document", errors: errors }
  }
}
