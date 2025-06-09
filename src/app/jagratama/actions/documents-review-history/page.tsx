import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import SearchInput from "@/components/documents/Search";
import DocumentReviewHistoryTable from "@/components/tables/DocumentReviewHistoryTable";
import { fetchDocumentReviewHistory } from "@/lib/api/documents";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "JAGRATAMA | Dashboard Pengajuan Dokumen",
  description:
    "JAGRATAMA adalah dashboard digital untuk pengajuan, pelacakan, dan pengelolaan dokumen secara mudah dan efisien",
};

export default async function DocumentsReviewHistoryIndex({
  searchParams,
}: {
  searchParams: Promise<{ title: string; status: string; }>
}) {
  const query = await searchParams;
  const documents = await fetchDocumentReviewHistory(query.title, query.status);

  return (
    <div>
      <PageBreadcrumb pageTitle="Riwayat Approval Pengajuan" />
      <div className="mt-4 space-y-6">
        <ComponentCard title="Hehhe">
          <>
            <div className="flex flex-row justify-end items-center mb-6">
              <SearchInput />
            </div>
            <DocumentReviewHistoryTable documents={documents} />
          </>
        </ComponentCard>
      </div>
    </div>
  );
}
