import ComponentCardAdmin from "@/components/common/ComponentCardAdmin";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import UserTable from "@/components/tables/UserTable";
import Button from "@/components/ui/button/Button";
import { fetchUsers } from "@/lib/api/users";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  title: "JAGRATAMA | Dashboard Pengajuan Dokumen",
  description:
    "JAGRATAMA adalah dashboard digital untuk pengajuan, pelacakan, dan pengelolaan dokumen secara mudah dan efisien",
};

export default async function UserIndex() {
  const users = await fetchUsers()

  return (
    <div>
      <PageBreadcrumb pageTitle="Pengguna" />
      <div className="mt-6 space-y-6">
        <ComponentCardAdmin title="Daftar Pengguna">
          <UserTable users={users} />
        </ComponentCardAdmin>
      </div>
    </div>
  );
}
