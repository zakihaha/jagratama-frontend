"use client";

import {
  ArrowLeft,
  ArrowRightCircle,
  Box,
  CheckCircle,
  ChevronDown,
  PenLine,
  RefreshCcw,
  SendHorizonal,
  XCircle,
} from "lucide-react";
import dynamic from "next/dynamic";
import PdfViewerWithThumbnails from "./PdfViewerWithThumbnails";
import Button from "@/components/ui/button/Button";
import Image from "next/image";
import { useState } from "react";

type StatusType = "approve" | "revisi" | "tolak";

export default function PreviewPage() {
  const [status, setStatus] = useState<StatusType>("approve");

  const statusIcon: Record<StatusType, React.ReactElement> = {
    approve: <CheckCircle className="w-5 h-5 text-[#20939C] absolute left-3 top-1/2 -translate-y-1/2" />,
    revisi: <RefreshCcw className="w-5 h-5 text-[#E57818] absolute left-3 top-1/2 -translate-y-1/2" />,
    tolak: <XCircle className="w-5 h-5 text-[#D33126] absolute left-3 top-1/2 -translate-y-1/2" />,
  };

  const statusTextColor: Record<StatusType, string> = {
    approve: "text-[#20939C]",
    revisi: "text-[#E57818]",
    tolak: "text-[#D33126]",
  };

  return (
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
      <div className="grid grid-cols-1 md:grid-cols-12 h-[calc(100%-4rem)]">
        <div className="col-span-9">
          <PdfViewerWithThumbnails url="/pdf/CV_Meisha Afifah Putri.pdf" />
        </div>

        <div className="order-first md:order-last col-span-3 p-4 bg-white border-x border-b border-[#E5E7EB] md:rounded-br-3xl flex flex-col space-y-6">
          <div className="bg-[#F9FAFB] rounded-2xl p-3">
            <h2 className="text-sm lg:text-base font-normal mb-5">
              Status Pengajuann
            </h2>
            <div className="text-sm text-gray-700 space-y-4">
      <div className="space-y-2">
        <p className="text-sm">Pilih Status</p>
        <div className="relative">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as StatusType)}
            className={`w-full appearance-none pl-10 pr-10 py-3 rounded-2xl border bg-white border-[#CFD6DD] focus:outline-none ${statusTextColor[status]}`}
          >
            <option value="approve">Setujui</option>
            <option value="revisi">Revisi</option>
            <option value="tolak">Tolak</option>
          </select>

          {statusIcon[status]}
          <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>
    </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm">Catatan</p>
            <form action="">
              <textarea
                className="w-full bg-white flex flex-row items-center gap-[10px] border border-[#CFD6DD] rounded-2xl p-3"
                placeholder="Masukan Catatan"
                name=""
                id=""
              ></textarea>
            </form>
          </div>
          <div className="space-y-2">
            <p className="text-sm">Action</p>
            <label className="text-sm text-[#262626] flex items-center justify-between gap-3 p-5 bg-[#F7FCFC] border border-[#2C8289] rounded-2xl cursor-pointer">
              Masukan Tanda Tangan
              <PenLine className="w-5 h-5 text-[#2C8289]" />
              <input type="file" accept="image/*" className="hidden" />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
