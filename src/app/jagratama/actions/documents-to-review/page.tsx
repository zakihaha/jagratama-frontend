import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DocumentToReviewTable from "@/components/tables/DocumentToReviewTable";
import { fetchDocumentToReview } from "@/lib/api/documents";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "JAGRATAMA | Dashboard Pengajuan Dokumen",
  description:
    "JAGRATAMA adalah dashboard digital untuk pengajuan, pelacakan, dan pengelolaan dokumen secara mudah dan efisien",
};

export default async function DocumentsToReviewIndex() {
  const documents = await fetchDocumentToReview()

  return (
    <div>
      <PageBreadcrumb pageTitle="Document To Review Lists" />
      <div className="space-y-6">
        <ComponentCard title="Hehhe">
          <DocumentToReviewTable documents={documents} />
        </ComponentCard>
      </div>
    </div>
  );
}
