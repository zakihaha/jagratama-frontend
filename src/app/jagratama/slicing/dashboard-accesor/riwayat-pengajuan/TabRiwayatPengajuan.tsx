"use client";
import { Funnel, Search } from "lucide-react";
import { useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DocumentAccesorTable from "@/components/tables/DocumentAccesorTable";
import type { DocumentModel } from "@/types";

type Props = {
  documents: DocumentModel[];
};

const TabRiwayatPengajuan = ({ documents }: Props) => {
  const [activeTab, setActiveTab] = useState("semua");

  const dataSemua = documents;
  const dataDitolak = documents.filter(
    (doc) =>
      doc.status?.toLowerCase().includes("ditolak") ||
      doc.status?.toLowerCase().includes("revisi")
  );

  return (
    <div>
      <PageBreadcrumb pageTitle="Riwayat Pengajuan" />

      <div className="py-6">
        <div className="flex gap-4 mb-4 border-b border-gray-200">
          <button
            className={`pb-2 text-sm font-medium border-b-2 flex items-center ${
              activeTab === "semua"
                ? "border-[#20939C] text-[#20939C]"
                : "border-transparent text-gray-500 hover:text-[#20939C]"
            }`}
            onClick={() => setActiveTab("semua")}
          >
            Semua Pengajuan
            <span
              className={`ml-1 px-1 text-xs rounded-full border ${
                activeTab === "semua"
                  ? "bg-[#D33126] text-white border-[#EFADA9]"
                  : "bg-gray-100 text-gray-400 border-gray-300"
              }`}
            >
              {dataSemua.length}
            </span>
          </button>

          <button
            className={`pb-2 text-sm font-medium border-b-2 flex items-center ${
              activeTab === "ditolak"
                ? "border-[#20939C] text-[#20939C]"
                : "border-transparent text-gray-500 hover:text-[#20939C]"
            }`}
            onClick={() => setActiveTab("ditolak")}
          >
            Ditolak/Revisi
            <span
              className={`ml-1 px-1 text-xs rounded-full border ${
                activeTab === "ditolak"
                  ? "bg-[#D33126] text-white border-[#EFADA9]"
                  : "bg-gray-100 text-gray-400 border-gray-300"
              }`}
            >
              {dataDitolak.length}
            </span>
          </button>
        </div>
      </div>

      <div className="mt-[10px] h-screen">
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
              />
              <Search className="absolute top-3 left-4 text-[#A1A1A1]" />
            </div>
          </div>
        </div>

        <DocumentAccesorTable
          documents={activeTab === "semua" ? dataSemua : dataDitolak}
        />
      </div>
    </div>
  );
};

export default TabRiwayatPengajuan;
