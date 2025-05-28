import { ApprovalLetterManager } from "@/components/pdf-approval/approval-letter-manager";
import { ApprovalLetterManager2 } from "@/components/pdf-approval/approval-letter-manager-2";
import { getDocument, getDocumentReview } from "@/lib/api/documents";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "JAGRATAMA | Dashboard Pengajuan Dokumen",
  description:
    "JAGRATAMA adalah dashboard digital untuk pengajuan, pelacakan, dan pengelolaan dokumen secara mudah dan efisien",
};

type Params = Promise<{ slug: string }>

export default async function DocumentConfirmationPage({ params }: { params: Params }) {
  const { slug } = await params
  const document = await getDocument(slug)

  if (!document) {
    return <div className="container mx-auto py-8">Document not found</div>
  }

  return (
    <main className="p-6 h-screen w-full bg-gray-50">
      <div className="p-6 w-full bg-white border border-[#E5E7EB] rounded-t-3xl gap-4 justify-between items-center">
        <div className="flex flex-row items-center gap-2">
          <ArrowLeft />
          <h1 className="text-xl font-medium">Konfirmasi Dokumen</h1>
        </div>
      </div>

      <ApprovalLetterManager2 slug={slug} documentData={document} />

      <Toaster />
    </main>
  )
}
