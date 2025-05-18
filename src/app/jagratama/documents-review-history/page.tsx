import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DocumentReviewHistoryTable from "@/components/tables/DocumentReviewHistoryTable";
import { fetchDocumentReviewHistory } from "@/lib/api/documents";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Next.js Basic Table | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Basic Table  page for TailAdmin  Tailwind CSS Admin Dashboard Template",
};

export default async function DocumentsReviewHistoryIndex() {
  const documents = await fetchDocumentReviewHistory()

  return (
    <div>
      <PageBreadcrumb pageTitle="Document Review History" />
      <div className="mt-6 space-y-6">
        <ComponentCard title="Hehhe">
          <DocumentReviewHistoryTable documents={documents} />
        </ComponentCard>
      </div>
    </div>
  );
}
