import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import UserTable from "@/components/tables/UserTable";
import SearchInputUsers from "@/components/users/SearchUsers";
import { fetchPositions } from "@/lib/api/positions";
import { fetchRoles } from "@/lib/api/roles";
import { fetchUsers } from "@/lib/api/users";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "JAGRATAMA | Dashboard Pengajuan Dokumen",
  description:
    "JAGRATAMA adalah dashboard digital untuk pengajuan, pelacakan, dan pengelolaan dokumen secara mudah dan efisien",
};

export default async function UserIndex({
  searchParams,
}: {
  searchParams: Promise<{ name: string, position: number, page: number }>;
}) {
  const query = await searchParams;
  const users = await fetchUsers(query.name, query.position, query.page)
  const roles = await fetchRoles();
  const positions = await fetchPositions();

  return (
    <div>
      <PageBreadcrumb pageTitle="Pengguna" />
      <div className="mt-6 space-y-6">
        <ComponentCard title="Daftar Pengguna">
          <>
            <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center mb-6">
              <SearchInputUsers positions={positions} roles={roles} />
            </div>
            <UserTable users={users.data} positions={positions} roles={roles} currentPage={users.page} totalPage={users.total_page} />
          </>
        </ComponentCard>
      </div>
    </div>
  );
}
