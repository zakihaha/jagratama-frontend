'use server'

import { revalidatePath } from 'next/cache';
import { DocumentCreateRequest } from '@/types/document';
import { CreateDocumentSchema } from '@/lib/schemas/document';
import { createDocument, deleteDocument, updateDocument } from '@/lib/api/documents';

export type Errors = {
  general?: string[];

  title?: string[];
  description?: string[];
  category_id?: string[];
};

export type FormState = {
  success: boolean;
  message: string;
  errors: Errors;
};

export async function createDocumentAction(prevState: FormState, formData: FormData) {
  const errors: Errors = {}

  let title = formData.get('title') as string
  let description = formData.get('description') as string
  let category_id_str = formData.get('category_id')

  let category_id = 0

  if (typeof category_id_str === 'string') {
    category_id = parseInt(category_id_str)
  } else if (typeof category_id_str === 'number') {
    category_id = category_id_str
  }

  const data: DocumentCreateRequest = {
    title,
    description,
    category_id,
  }

  const parsed = CreateDocumentSchema.safeParse(data)

  if (!parsed.success) {
    parsed.error.flatten().fieldErrors.title && (errors.title = parsed.error.flatten().fieldErrors.title)
    parsed.error.flatten().fieldErrors.description && (errors.description = parsed.error.flatten().fieldErrors.description)
    parsed.error.flatten().fieldErrors.category_id && (errors.category_id = parsed.error.flatten().fieldErrors.category_id)
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

export async function updateDocumentAction(prevState: FormState, formData: FormData) {
  const slug = formData.get('slug') as string;
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const category_id = formData.get('category_id') as string

  const errors: Errors = {}
  const data: DocumentCreateRequest = {
    title,
    description,
    category_id: parseInt(category_id),
  }

  try {
    await updateDocument(slug, data)
    revalidatePath('/jagratama/documents');
    return { success: true, message: "Document updated successfully", errors: {} };
  } catch (err) {
    errors.general = ['Failed to update document']
    return { success: false, message: "Failed to update document", errors };
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
