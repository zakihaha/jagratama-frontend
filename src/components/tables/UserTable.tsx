"use client";

import React, { useActionState, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import Image from "next/image";
import Button from "@/components/ui/button/Button";
import { UserModel } from "@/types/user";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/ui/modal";
import { deleteUserAction, FormState } from "@/app/jagratama/users/actions";
import Link from "next/link";
import { ChevronLeft, ChevronRight, PenLine } from "lucide-react";
import UserUpdateForm from "@/app/jagratama/users/[id]/edit/UserUpdateForm";
import { RoleModel } from "@/types/role";
import { PositionModel } from "@/types/position";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

type Props = {
  users: UserModel[];
  roles: RoleModel[];
  positions: PositionModel[];
  totalPage: number;
  currentPage: number;
};

export default function UserTable({ users, roles, positions, totalPage, currentPage }: Props) {
  const warningModal = useModal();
  const initialState: FormState = {
    success: false,
    message: "",
    errors: {},
  };

  const [state, action, isLoading] = useActionState(
    deleteUserAction,
    initialState
  );

  const [selectedUser, setSelectedUser] = useState<UserModel | null>(null);

  const [isModalEditOpen, setModalEditOpen] = useState(false);
  const openModal = () => setModalEditOpen(true);
  const closeModal = () => setModalEditOpen(false);


  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialPage = searchParams.get("page") || 1; // Default to page 1 if not specified
  const [pageTerm, setPageTerm] = useState(initialPage);

  // Handle page change
  const handlePageChange = (page: number) => {
    setPageTerm(page);

    if (page < 1 || page > totalPage) return // Prevent invalid page numbers
    if (page === currentPage) return // Prevent unnecessary state updates

    const currentParams = new URLSearchParams(searchParams.toString());

    // Handle search term filtering
    currentParams.set('page', String(page));
    router.push(`${pathname}?${currentParams.toString()}`);
  }

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = []
    const maxPagesToShow = 5 // Show at most 5 page numbers

    if (totalPage <= maxPagesToShow) {
      // If we have fewer pages than maxPagesToShow, show all pages
      for (let i = 1; i <= totalPage; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      // Calculate start and end of middle pages
      let startPage = Math.max(2, currentPage - 1)
      let endPage = Math.min(totalPage - 1, currentPage + 1)

      // Adjust if we're near the beginning
      if (currentPage <= 3) {
        endPage = 4
      }

      // Adjust if we're near the end
      if (currentPage >= totalPage - 2) {
        startPage = totalPage - 3
      }

      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pages.push("ellipsis1")
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }

      // Add ellipsis before last page if needed
      if (endPage < totalPage - 1) {
        pages.push("ellipsis2")
      }

      // Always show last page
      pages.push(totalPage)
    }

    return pages
  }

  return (
    <div className="overflow-hidden bg-white dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <Table>
            {/* Table Header */}
            <TableHeader className="bg-[#F3F4F6] border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-[#262626] text-start text-theme-sm dark:text-gray-400"
                >
                  #
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-[#262626] text-start text-theme-sm dark:text-gray-400"
                >
                  User
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-[#262626] text-start text-theme-sm dark:text-gray-400"
                >
                  Email
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-[#262626] text-start text-theme-sm dark:text-gray-400"
                >
                  Role
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-[#262626] text-start text-theme-sm dark:text-gray-400"
                >
                  Jabatan
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-[#262626] text-start text-theme-sm dark:text-gray-400"
                >
                  Organisasi
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-[#262626] text-start text-theme-sm dark:text-gray-400"
                >
                  {""}
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {users.map((user, key) => (
                <TableRow key={key}>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {key + 1 + (currentPage - 1) * 20}
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 relative rounded-full overflow-hidden shrink-0">
                        <Image
                          width={40}
                          height={40}
                          src={user.image}
                          alt={user.name}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {user.name}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {user.email}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {user.role.name}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {user.position.name}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {user.organization || "-"}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400 space-x-4">
                    <Button
                      size="sm"
                      variant="outline"
                      className="!text-[#20939C]"
                      onClick={() => {
                        setSelectedUser(user);
                        openModal();
                      }}
                    >
                      <PenLine className="w-4 h-4" />
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPage > 1 && (
            <div className="flex flex-wrap items-center gap-1 justify-center mt-10">
              <button
                className="p-[10px] text-sm border border-[#E5E7EB] rounded-md text-[#262626] disabled:opacity-50"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {getPageNumbers().map((page, i) =>
                page === "ellipsis1" || page === "ellipsis2" ? (
                  <div key={`ellipsis-${i}`} className="px-3 py-2 text-gray-500">
                    <span className="text-sm">...</span>
                  </div>
                ) : (
                  <button
                    key={i}
                    className={`px-[13px] py-[6px] text-sm rounded-md ${currentPage === page
                      ? "bg-[#E2F6F7] text-[#20939C]"
                      : "text-[#1D293D] hover:bg-gray-200"
                      }`}
                    onClick={() => handlePageChange(page as number)}
                  >
                    {page}
                  </button>
                ),
              )}

              <button
                className="p-[10px] text-sm border border-[#E5E7EB] rounded-md text-[#262626] disabled:opacity-50"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPage}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* edit modal */}
        {isModalEditOpen && selectedUser && (
          <div className="fixed inset-0 z-99999 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-lg p-6 max-w-[600px] w-full shadow-xl relative backdrop-blur-sm">
              <div className="flex flex-col gap-1">
                <p className="text-[#262626] text-base font-medium">
                  Edit User
                </p>
                <p className="text-[#737373] text-sm">
                  Masukan data pengguna Jagratama
                </p>
              </div>
              <hr className="my-[30px]" />
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                onClick={closeModal}
                aria-label="Close modal"
              >
                ✕
              </button>

              <UserUpdateForm
                id={selectedUser.id}
                user={selectedUser}
                onClose={() => {
                  setSelectedUser(null);
                  closeModal();
                }}
                positions={positions}
                roles={roles}
              />
            </div>
          </div>
        )}

        {/* Warning Modal */}
        <Modal
          isOpen={warningModal.isOpen}
          onClose={warningModal.closeModal}
          className="max-w-[600px] p-5 lg:p-10"
        >
          <div className="text-center">
            <div className="relative flex items-center justify-center z-1 mb-7">
              <svg
                className="fill-warning-50 dark:fill-warning-500/15"
                width="90"
                height="90"
                viewBox="0 0 90 90"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M34.364 6.85053C38.6205 -2.28351 51.3795 -2.28351 55.636 6.85053C58.0129 11.951 63.5594 14.6722 68.9556 13.3853C78.6192 11.0807 86.5743 21.2433 82.2185 30.3287C79.7862 35.402 81.1561 41.5165 85.5082 45.0122C93.3019 51.2725 90.4628 63.9451 80.7747 66.1403C75.3648 67.3661 71.5265 72.2695 71.5572 77.9156C71.6123 88.0265 60.1169 93.6664 52.3918 87.3184C48.0781 83.7737 41.9219 83.7737 37.6082 87.3184C29.8831 93.6664 18.3877 88.0266 18.4428 77.9156C18.4735 72.2695 14.6352 67.3661 9.22531 66.1403C-0.462787 63.9451 -3.30193 51.2725 4.49185 45.0122C8.84391 41.5165 10.2138 35.402 7.78151 30.3287C3.42572 21.2433 11.3808 11.0807 21.0444 13.3853C26.4406 14.6722 31.9871 11.951 34.364 6.85053Z"
                  fill=""
                  fillOpacity=""
                />
              </svg>

              <span className="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
                <svg
                  className="fill-warning-600 dark:fill-orange-400"
                  width="38"
                  height="38"
                  viewBox="0 0 38 38"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M32.1445 19.0002C32.1445 26.2604 26.2589 32.146 18.9987 32.146C11.7385 32.146 5.85287 26.2604 5.85287 19.0002C5.85287 11.7399 11.7385 5.85433 18.9987 5.85433C26.2589 5.85433 32.1445 11.7399 32.1445 19.0002ZM18.9987 35.146C27.9158 35.146 35.1445 27.9173 35.1445 19.0002C35.1445 10.0831 27.9158 2.85433 18.9987 2.85433C10.0816 2.85433 2.85287 10.0831 2.85287 19.0002C2.85287 27.9173 10.0816 35.146 18.9987 35.146ZM21.0001 26.0855C21.0001 24.9809 20.1047 24.0855 19.0001 24.0855L18.9985 24.0855C17.894 24.0855 16.9985 24.9809 16.9985 26.0855C16.9985 27.19 17.894 28.0855 18.9985 28.0855L19.0001 28.0855C20.1047 28.0855 21.0001 27.19 21.0001 26.0855ZM18.9986 10.1829C19.827 10.1829 20.4986 10.8545 20.4986 11.6829L20.4986 20.6707C20.4986 21.4992 19.827 22.1707 18.9986 22.1707C18.1701 22.1707 17.4986 21.4992 17.4986 20.6707L17.4986 11.6829C17.4986 10.8545 18.1701 10.1829 18.9986 10.1829Z"
                    fill=""
                  />
                </svg>
              </span>
            </div>

            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90 sm:text-title-sm">
              Warning Alert!
            </h4>
            <p className="text-sm leading-6 text-gray-500 dark:text-gray-400">
              Lorem ipsum dolor sit amet consectetur. Feugiat ipsum libero
              tempor felis risus nisi non. Quisque eu ut tempor curabitur.
            </p>

            <div className="flex items-center justify-center w-full gap-3 mt-7">
              <form action={action}>
                <input type="hidden" name="id" value={warningModal.id} />
                <button
                  type="submit"
                  className="flex justify-center w-full px-4 py-3 text-sm font-medium text-white rounded-lg bg-warning-500 shadow-theme-xs hover:bg-warning-600 sm:w-auto"
                  disabled={isLoading}
                >
                  {isLoading ? "Deleting..." : "Okay, Got It"}
                </button>
              </form>
            </div>
          </div>
        </Modal>
      </div>
    </div >
  );
}
