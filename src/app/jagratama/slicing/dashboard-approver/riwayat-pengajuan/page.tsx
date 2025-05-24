import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import { fetchDocuments } from "@/lib/api/documents";
import { Funnel, Search } from "lucide-react";
import DocumentApproverTable from "@/components/tables/DocumentApproverTable";

export const metadata: Metadata = {
  title: "JAGRATAMA | Dashboard Pengajuan Dokumen",
  description:
    "JAGRATAMA adalah dashboard digital untuk pengajuan, pelacakan, dan pengelolaan dokumen secara mudah dan efisien",
};

const RiwayatPengajuanApproverPage = async () => {
  const documents = await fetchDocuments();

  return (
    <div>
      <PageBreadcrumb pageTitle="Riwayat Pengajuan" />

      <div className="mt-[30px] h-screen">
        <div className="flex flex-row justify-between items-center mb-6">
          <p className="font-medium mb-6">Pengajuan Terbaru</p>
          <div className="flex flex-row flex-wrap lg:items-center lg:justify-between gap-4">
          <button className="rounded-[8px] border border-[#E5E7EB] text-[#262626] py-[10px] px-4 flex gap-[10px] items-center">
            <Funnel />
            Filter
          </button>
          <div className="relative">
            <input
              className="rounded-[8px] border border-[#E5E7EB] text-[#262626] py-[10px] pl-12 pr-4 placeholder:text-[#A1A1A1]"
              placeholder="Cari Dokumen..."
              type="text"
              name=""
              id=""
            />
            <Search className="absolute top-3 left-4 text-[#A1A1A1]" />
          </div>
        </div>
        </div>
        <DocumentApproverTable documents={documents} />
      </div>
    </div>
  );
};

export default RiwayatPengajuanApproverPage;
