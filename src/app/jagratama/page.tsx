import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { fetchDocumentCounter } from "@/lib/api/documents";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "JAGRATAMA | Dashboard Pengajuan Dokumen",
  description:
    "JAGRATAMA adalah dashboard digital untuk pengajuan, pelacakan, dan pengelolaan dokumen secara mudah dan efisien",
};

const JagratamaIndex = async () => {
  const documentCounter = await fetchDocumentCounter();
  const { total_document, total_rejected, total_pending, total_approved } = documentCounter;

  return (
    <div>
      <PageBreadcrumb pageTitle="Dashboard" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="border border-[#E5E7EB] rounded-2xl p-3 flex flex-row gap-3">
          <div className="rounded-[8px] bg-[#F7FDFD] border border-[#CEEFF1] p-[14px] flex items-center justify-center">
            <Image
              className=""
              src="/images/icons/file-document.svg"
              alt="document"
              width={36}
              height={36}
            />
          </div>
          <div>
            <p className="text-3xl text-[#262626] font-medium">{total_document}</p>
            <p className="text-sm text-[#737373]">Total Dokumen</p>
          </div>
        </div>
        <div className="border border-[#E5E7EB] rounded-2xl p-3 flex flex-row gap-3">
          <div className="rounded-[8px] bg-[#EFFDF4] border border-[#7AF2A8] p-[14px] flex items-center justify-center">
            <Image
              className=""
              src="/images/icons/file-approved.svg"
              alt="document"
              width={36}
              height={36}
            />
          </div>
          <div>
            <p className="text-3xl text-[#262626] font-medium">{total_approved}</p>
            <p className="text-sm text-[#737373]">Berhasil Disetujui</p>
          </div>
        </div>
        <div className="border border-[#E5E7EB] rounded-2xl p-3 flex flex-row gap-3">
          <div className="rounded-[8px] bg-[#FDF2E8] border border-[#F0AE75] p-[14px] flex items-center justify-center">
            <Image
              className=""
              src="/images/icons/file-pending.svg"
              alt="document"
              width={36}
              height={36}
            />
          </div>
          <div>
            <p className="text-3xl text-[#262626] font-medium">{total_pending}</p>
            <p className="text-sm text-[#737373]">Pending Disetujui</p>
          </div>
        </div>
        <div className="border border-[#E5E7EB] rounded-2xl p-3 flex flex-row gap-3">
          <div className="rounded-[8px] bg-[#FBEBE9] border border-[#E8847D] p-[14px] flex items-center justify-center">
            <Image
              className=""
              src="/images/icons/file-rejected.svg"
              alt="document"
              width={36}
              height={36}
            />
          </div>
          <div>
            <p className="text-3xl text-[#262626] font-medium">{total_rejected}</p>
            <p className="text-sm text-[#737373]">Belum Disetujui</p>
          </div>
        </div>
      </div>
      {/* <div className="mt-[30px] p-3 border border-[#E5E7EB] rounded-2xl h-screen">
        <p className="font-medium">File Terbaru</p>
        <div className="flex flex-col items-center justify-center h-screen">
        <Image
              className=""
              src="/images/dashboard/EmptyState.png"
              alt="document"
              width={150}
              height={150}
            />
            <p className="text-base text-[#262626] font-medium">Belum Ada File</p>
            <p className="text-sm text-[#737373]">Ayo masukan dokumen kamu untuk diajukan hari ini</p>
        </div>
      </div> */}
    </div>
  );
};

export default JagratamaIndex;
