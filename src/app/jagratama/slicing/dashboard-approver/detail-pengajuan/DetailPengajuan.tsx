import ApprovalAccessorTable from "@/components/dashboard/ApprovalAccessorTable";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import { Box, Calendar, Eye, FileText } from "lucide-react";
import Image from "next/image";

const DetailPengajuanApprover = () => {
  return (
    <div className="py-[30px] px-5 ">
      <div className="flex flex-col xl:flex-row gap-5">
        <div className="rounded-2xl border border-[#E5E7EB] p-3">
          <div className="flex flex-row items-center gap-2">
            <FileText className="text-[#20939C] w-12 h-12" />
            <div className="">
              <p className="text-sm text-[#A1A1A1]">#PG-0001</p>
              <p className="text-lg font-normal">Nama File Pengajuan</p>
            </div>
          </div>
          <hr className="mt-6 bg-[#E5E7EB]" />

          <div className="mt-6 flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-12">
            <div className="flex flex-col gap-2">
              <p className="text-[#404040] text-sm">Pengaju</p>
              <div className="flex flex-row items-center gap-2 text-[#A1A1A1] text-sm">
                <Image
                  src="/images/user/owner.jpg"
                  alt="User"
                  width={24}
                  height={24}
                  className="rounded-full"
                />
                <p>Snow Universe</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-[#404040] text-sm">Tanggal Diajukan</p>
              <div className="flex flex-row items-center gap-2 text-[#A1A1A1] text-sm">
                <Calendar />
                <p>21/04/2025</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-[#404040] text-sm">Tipe Surat</p>
              <div className="flex flex-row items-center gap-2 text-[#A1A1A1] text-sm">
                <Box />
                <p>(KAK/LPJ SBH)</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-[#404040] text-sm">Organisasi</p>
              <p className="text-[#A1A1A1] text-sm">Osora team</p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-[#404040] text-sm">Status</p>
              <Badge variant="outline" size="sm" color="warning">
                Pending
              </Badge>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2">
            <p className="text-[#404040] text-sm">Deskripsi :</p>
            <p className="text-[#A1A1A1] text-sm">
              Kami mengajukan surat LPJ untuk kegiatan SBH (Sub Bidang Himpunan)
              yang telah dilaksanakan pada bulan Februari–Maret 2024. Kegiatan
              ini merupakan bagian dari program kerja rutin yang bertujuan untuk
              meningkatkan keterlibatan mahasiswa dalam pengembangan organisasi.
            </p>
          </div>
        </div>
        <div className="rounded-2xl border border-[#E5E7EB] p-3">
          <p className="font-medium mb-[10px]">File Pengajuan</p>
          <div className="bg-[#F7FDFD] border border-[#20939C] rounded-[8px] p-6 flex flex-col justify-center items-center">
            <div className="border border-[#E2F6F7] bg-white p-3 rounded-[20px] w-fit">
              <FileText className="w-6" />
            </div>
            <p className="mt-4 mb-2 text-sm font-medium">
              Document_Jagratama_002.pdf
            </p>
            <p className="text-xs text-[#A1A1A1]">PDF FIle</p>
          </div>
          <Button
            size="sm"
            variant="primary"
            className="mt-5 w-full !bg-[#20939C] !text-sm !font-normal !rounded-[8px]"
          >
            Buka Surat Pengajuan
            <Eye size={20} className="ml-1" />
          </Button>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-[#E5E7EB] p-3 bg-white overflow-hidden">
        <p className="text-base font-medium">Proses Pengajuan</p>
        <ApprovalAccessorTable />
      </div>
    </div>
  );
};

export default DetailPengajuanApprover;
