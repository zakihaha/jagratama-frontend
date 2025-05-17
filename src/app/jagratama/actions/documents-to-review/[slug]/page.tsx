import { ApprovalLetterManager } from "@/components/pdf-approval/approval-letter-manager";
import { getDocumentReview } from "@/lib/api/documents";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "JAGRATAMA | Dashboard Pengajuan Dokumen",
  description:
    "JAGRATAMA adalah dashboard digital untuk pengajuan, pelacakan, dan pengelolaan dokumen secara mudah dan efisien",
};

interface Props {
  params: {
    slug: string
  }
}

export default async function Home({ params }: Props) {
  const { slug } = await params
  const document = await getDocumentReview(slug)

  if (!document) {
    return <div className="container mx-auto py-8">Document not found</div>
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto py-8">
        <ApprovalLetterManager slug={slug} documentData={document} />
      </div>
    </main>
  )
}
