import { Metadata } from "next";
import React from "react";
import DetailPengajuan from "./DetailPengajuan";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { ArrowLeft } from "lucide-react";
import { getDocument, getDocumentTracking } from "@/lib/api/documents";

export const metadata: Metadata = {
  title: "JAGRATAMA | Dashboard Pengajuan Dokumen",
  description:
    "JAGRATAMA adalah dashboard digital untuk pengajuan, pelacakan, dan pengelolaan dokumen secara mudah dan efisien",
};

type Params = Promise<{ slug: string }>

const DetailPengajuanPage = async ({ params }: { params: Params }) => {
  const slug = (await params).slug;
    const document = await getDocument(slug);
    const trackingSteps = await getDocumentTracking(slug);

  return (
    <>
      <PageBreadcrumb pageTitle="Detail Pengajuan" icon={<ArrowLeft />} />

      <DetailPengajuan document={document} trackingSteps={trackingSteps} />
      
    </>
  );
};

export default DetailPengajuanPage;
