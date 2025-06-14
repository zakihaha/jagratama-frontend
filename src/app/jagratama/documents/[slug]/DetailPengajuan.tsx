import ApprovalTable from "@/components/dashboard/ApprovalTable";
import Badge from "@/components/ui/badge/Badge";
import { formatDate } from "@/lib/utils/formatDate";
import { DocumentModel, DocumentTrackingModel } from "@/types/document";
import { Box, Calendar, FileText } from "lucide-react";
import Image from "next/image";

const DetailPengajuan = ({ document, trackingSteps }: { document: DocumentModel, trackingSteps: DocumentTrackingModel[] }) => {
  return (
    <div className="py-[30px] px-5 ">
      <div className="rounded-2xl border border-[#E5E7EB] p-3">
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-2">
            <FileText className="text-[#20939C]" />
            <p className="text-lg">{document.title}</p>
          </div>
          <Badge
            variant="outline"
            size="sm"
            color={
              document.last_status === "approved"
                ? "success"
                : document.last_status === "pending"
                  ? "warning"
                  : document.last_status === "rejected"
                    ? "error"
                    : "light"
            }
          >
            {document.last_status === "approved"
              ? "Disetujui"
              : document.last_status === "pending"
                ? "Pending"
                : "Revisi"}
          </Badge>
        </div>

        <div className="mt-6 flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-12">
          <div className="flex flex-col gap-2">
            <p className="text-[#404040] text-sm">Tanggal Diajukan</p>
            <div className="flex flex-row items-center gap-2 text-[#A1A1A1] text-sm">
              <Calendar />
              <p>{formatDate(document.created_at)}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-[#404040] text-sm">Tipe Surat</p>
            <div className="flex flex-row items-center gap-2 text-[#A1A1A1] text-sm">
              <Box />
              <p>{document.category.name}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-[#404040] text-sm">Ditujukan Kepada</p>
            <div className="flex flex-row items-center gap-2 text-[#A1A1A1] text-sm">
              <Image
                src={document.addressed_user.image}
                alt="User"
                width={24}
                height={24}
                className="rounded-full"
              />
              <p>{document.addressed_user.name}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2">
          <p className="text-[#404040] text-sm">Deskripsi :</p>
          <p className="text-[#A1A1A1] text-sm">
            {document.description != "" ? document.description : "Tidak ada"}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-[#E5E7EB] p-3 overflow-x-auto">
        <p className="text-base font-medium">Proses Pengajuan</p>

        <ApprovalTable steps={trackingSteps} slug={document.slug} />
      </div>
    </div>
  );
};

export default DetailPengajuan;
