"use client";

import { ArrowLeft, Box, SendHorizonal } from "lucide-react";
import dynamic from "next/dynamic";
import PdfViewerWithThumbnails from "./PdfViewerWithThumbnails";
import Button from "@/components/ui/button/Button";
import Image from "next/image";

export default function PreviewPage() {
  return (
    <div className="p-6 h-screen w-full bg-gray-50">
      <div className="p-6 w-full bg-white border border-[#E5E7EB] rounded-t-3xl flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex flex-row items-center gap-2">
          <ArrowLeft />
          <h1 className="text-xl font-medium">Konfirmasi Dokumen</h1>
        </div>
        <div className="flex flex-row gap-4">
          <Button
            className="!text-xs lg:!text-sm !font-normal !rounded-[8px] !p-2 lg:!p-4"
            size="md"
            variant="outline"
            type="submit"
          >
            Perbaiki Lagi
          </Button>
          <Button
            className="!bg-[#20939C] !text-xs lg:!text-sm !font-normal !rounded-[8px] !p-2 lg:!p-4"
            size="md"
            variant="primary"
            type="submit"
          >
            Ajukan Sekarang
            <SendHorizonal />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 h-[calc(100%-4rem)]">
        <div className="col-span-9">
          <PdfViewerWithThumbnails url="/pdf/CV_Meisha Afifah Putri.pdf" />
        </div>

        <div className="order-first md:order-last col-span-3 p-4 bg-white border-x border-b border-[#E5E7EB] md:rounded-br-3xl flex flex-col justify-between">
          <div className="bg-[#F9FAFB] rounded-2xl p-3">
            <h2 className="text-sm lg:text-base font-normal mb-5">Informasi Pengajuan</h2>
            <div className="text-sm text-gray-700 space-y-4">
              <div className="space-y-2">
                <p className="text-sm lg:text-base">Tipe Surat</p>
                <div className="bg-white flex flex-row items-center gap-[10px] border border-[#CFD6DD] rounded-2xl p-3">
                  <Box />
                  <p className="text-xs lg:text-sm">(KAK/LPJ SBH)</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm lg:text-base">Ditunjukan Kepada</p>
                <div className="bg-white flex flex-row items-center gap-[10px] border border-[#CFD6DD] rounded-2xl p-3">
                  <Image
                    src="/images/user/owner.jpg"
                    alt="User"
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                  <p className="text-xs lg:text-sm">Ketua UMKM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
