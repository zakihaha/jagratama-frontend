import ComponentCard from "@/components/common/ComponentCard";
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
      <div className="space-y-6">
        <ComponentCard title="Daftar Pengguna">
          <div>
            <Link href={"/jagratama/users/create"}>
              <Button size="sm" variant="primary">
                Create
              </Button>
            </Link>
          </div>

          <UserTable users={users} />
        </ComponentCard>
      </div>
    </div>
  );
}
