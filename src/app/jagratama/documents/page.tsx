import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import SearchInput from "@/components/documents/Search";
import DocumentTable from "@/components/tables/DocumentTable";
import { fetchDocuments } from "@/lib/api/documents";
import { Funnel, Search } from "lucide-react";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "JAGRATAMA | Dashboard Pengajuan Dokumen",
  description:
    "JAGRATAMA adalah dashboard digital untuk pengajuan, pelacakan, dan pengelolaan dokumen secara mudah dan efisien",
};

export default async function DocumentsIndex({
  searchParams,
}: {
  searchParams: Promise<{ title: string; status: string;  }>
}) {
  const query = await searchParams;
  const documents = await fetchDocuments(query.status, query.title);

  return (
    <div>
      <PageBreadcrumb pageTitle="Dokumen" />
      <div className="space-y-6">
        <ComponentCard title="Semua Dokumen">
          <>
            <div className="flex flex-row justify-end items-center mb-6">
              <SearchInput />
            </div>
            <DocumentTable documents={documents} />
          </>
        </ComponentCard>
      </div>
    </div>
  );
}
