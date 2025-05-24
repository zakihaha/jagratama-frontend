import { Metadata } from "next";
import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { ArrowLeft } from "lucide-react";
import DetailPengajuanApprover from "./DetailPengajuan";

export const metadata: Metadata = {
  title: "JAGRATAMA | Dashboard Pengajuan Dokumen",
  description:
    "JAGRATAMA adalah dashboard digital untuk pengajuan, pelacakan, dan pengelolaan dokumen secara mudah dan efisien",
};

const DetailPengajuanApproverPage = async () => {
  return (
    <>
      <PageBreadcrumb pageTitle="Detail Pengajuan" icon={<ArrowLeft />} />

      <DetailPengajuanApprover />
      
    </>
  );
};

export default DetailPengajuanApproverPage;
