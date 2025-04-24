import DocumentUpdateForm from './DocumentUpdateForm';
import { DocumentCreateRequest } from '@/types/document';
import { getDocument } from '@/lib/api/documents';

interface Props {
  params: {
    slug: string
  }
}
const DocumentEdit = async ({ params }: Props) => {
  const document = await getDocument(params.slug);
  console.log(document);
  

  const documentCreateRequest: DocumentCreateRequest = {
    title: document.title,
    description: document.description,
    category_id: document.category_id, 
  };

  return <DocumentUpdateForm slug={document.slug} document={documentCreateRequest} />;
};

export default DocumentEdit;
