import { ApprovalLetterManager } from "@/components/pdf-approval/approval-letter-manager";
import Button from "@/components/ui/button/Button";
import { getDocumentReview } from "@/lib/api/documents";
import { ArrowLeft, ArrowRightCircle, SendHorizonal } from "lucide-react";
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
    // <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
    //   <div className="container mx-auto py-8">
    <div className="p-6 h-screen w-full bg-gray-50">
      <div className="p-6 w-full bg-white border border-[#E5E7EB] rounded-t-3xl flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex flex-row items-center gap-2">
          <ArrowLeft />
          <h1 className="text-xl font-medium">Konfirmasi Dokumen</h1>
        </div>
        <div className="flex flex-row gap-4">
          <Button
            className="!bg-[#20939C] !text-xs lg:!text-sm !font-normal !rounded-[8px] !p-2 lg:!p-4"
            size="md"
            variant="primary"
            type="submit"
          >
            Setujui
            <ArrowRightCircle />
          </Button>
        </div>
      </div>

      <ApprovalLetterManager slug={slug} documentData={document} />
    </div>
    // </div>
    // </main>
  )
}
