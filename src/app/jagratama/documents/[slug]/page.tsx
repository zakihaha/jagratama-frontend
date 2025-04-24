import { getDocument, getDocumentTracking } from "@/lib/api/documents";
import DocumentDetailPage from "./Detail";
import DocumentTracker from "@/components/documents/Tracker";

const DocumentDetail = async ({ params }: { params: { slug: string } }) => {
  const slug = (await params).slug;
  const document = await getDocument(slug);
  const trackingSteps = await getDocumentTracking(slug);

  return (
    <>
      <DocumentDetailPage document={document} trackingSteps={trackingSteps} />
    </>
  );
};

export default DocumentDetail;
