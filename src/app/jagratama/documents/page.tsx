import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DocumentTable from "@/components/tables/DocumentTable";
import Button from "@/components/ui/button/Button";
import { fetchDocuments } from "@/lib/api/documents";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  title: "JAGRATAMA | Dashboard Pengajuan Dokumen",
  description:
    "JAGRATAMA adalah dashboard digital untuk pengajuan, pelacakan, dan pengelolaan dokumen secara mudah dan efisien",
};

export default async function DocumentsIndex() {
  const documents = await fetchDocuments()

  return (
    <div>
      <PageBreadcrumb pageTitle="Document Lists" />
      <div className="space-y-6">
        <ComponentCard title="Hehhe">
          <div>
            <Link href={"/jagratama/documents/create"}>
              <Button size="sm" variant="primary">
                Create
              </Button>
            </Link>
          </div>

          <DocumentTable documents={documents} />
        </ComponentCard>
      </div>
    </div>
  );
}
