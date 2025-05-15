import ApprovalTable from "@/components/dashboard/ApprovalTable";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Box, Calendar, CircleArrowDown, FileText } from "lucide-react";
import Image from "next/image";

const DetailPengajuan = () => {
  return (
    <div className="py-[30px] px-5 ">
      <div className="rounded-2xl border border-[#E5E7EB] p-3">
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-2">
            <FileText className="text-[#20939C]" />
            <p className="text-lg">Nama File Pengajuan</p>
          </div>
          <Badge variant="outline" size="sm" color="warning">
            Pending
          </Badge>
        </div>

        <div className="mt-6 flex flex-row items-center gap-12">
          <div className="flex flex-col gap-2">
            <p className="text-[#404040] text-sm">Keterangan</p>
            <div className="flex flex-row items-center gap-5 text-[#A1A1A1] text-sm">
              <div className="flex flex-row items-center gap-2">
                <Box />
                <p>(KAK/LPJ SBH)</p>
              </div>
              <div className="flex flex-row items-center gap-2">
                <Calendar />
                <p>21/04/2025</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-[#404040] text-sm">Ditujukan Kepada</p>
            <div className="flex flex-row items-center gap-2 text-[#A1A1A1] text-sm">
              <Image
                src="/images/user/owner.jpg"
                alt="User"
                width={24}
                height={24}
                className="rounded-full"
              />
              <p>Direktur</p>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <p className="text-[#404040] text-sm">Deskripsi :</p>
          <p className="text-[#A1A1A1] text-sm">
            Kami mengajukan surat LPJ untuk kegiatan SBH (Sub Bidang Himpunan)
            yang telah dilaksanakan pada bulan Februari–Maret 2024. Kegiatan ini
            merupakan bagian dari program kerja rutin yang bertujuan untuk
            meningkatkan keterlibatan mahasiswa dalam pengembangan organisasi.
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-[#E5E7EB] p-3">
        <p className="text-base font-medium">Proses Pengajuan</p>

        <ApprovalTable />
      </div>
    </div>
  );
};

export default DetailPengajuan;
