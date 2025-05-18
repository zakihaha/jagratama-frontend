import { Metadata } from "next";
import React from "react";
import DetailPengajuan from "./DetailPengajuan";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "JAGRATAMA | Dashboard Pengajuan Dokumen",
  description:
    "JAGRATAMA adalah dashboard digital untuk pengajuan, pelacakan, dan pengelolaan dokumen secara mudah dan efisien",
};

const DetailPengajuanPage = async () => {
  return (
    <>
      <PageBreadcrumb pageTitle="Detail Pengajuan" icon={<ArrowLeft />} />

      <DetailPengajuan />
      
    </>
  );
};

export default DetailPengajuanPage;
