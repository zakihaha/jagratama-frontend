import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import UserTable from "@/components/tables/UserTable";
import Button from "@/components/ui/button/Button";
import { fetchUsers } from "@/lib/api/users";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  title: "Next.js Basic Table | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Basic Table  page for TailAdmin  Tailwind CSS Admin Dashboard Template",
};

export default async function UserIndex() {
  const users = await fetchUsers()

  return (
    <div>
      <PageBreadcrumb pageTitle="User Lists" />
      <div className="space-y-6">
        <ComponentCard title="Hehhe">
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
