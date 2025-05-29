"use client";
import { Funnel, Search, Upload, UserPlus } from "lucide-react";
import React, { useState } from "react";
import Button from "@/components/ui/button/Button";
import UserCreateForm from "@/app/jagratama/users/create/UserCreateForm";
import { RoleModel } from "@/types/role";
import { PositionModel } from "@/types/position";

interface ComponentCardAdminProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  desc?: string;
  roles?: RoleModel[];
  positions?: PositionModel[];
}

const ComponentCardAdmin: React.FC<ComponentCardAdminProps> = ({
  title,
  children,
  className = "",
  desc = "",
  roles = [],
  positions = [],
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <div className={`relative bg-white dark:bg-white/[0.03] ${className}`}>
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
          <div className="py-5">
            <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
              {title}
            </h3>
            {desc && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {desc}
              </p>
            )}
          </div>
          <div className="flex flex-row flex-wrap lg:items-center lg:justify-between gap-4">
            <button className="rounded-[8px] border border-[#E5E7EB] text-[#262626] py-[10px] px-4 flex gap-[10px] items-center">
              <Funnel />
              Filter
            </button>
            <div className="relative">
              <input
                className="rounded-[8px] border border-[#E5E7EB] text-[#262626] py-[10px] pl-12 pr-4 placeholder:text-[#A1A1A1]"
                placeholder="Cari Nama..."
                type="text"
              />
              <Search className="absolute top-3 left-4 text-[#A1A1A1]" />
            </div>
            <button className="rounded-[8px] border border-[#E5E7EB] text-[#262626] py-[10px] px-4 flex gap-[10px] items-center">
              Export User
              <Upload />
            </button>
            <Button
              onClick={openModal}
              size="sm"
              variant="primary"
              className="!bg-[#20939C]"
            >
              Tambah
              <UserPlus />
            </Button>
          </div>
        </div>

        {/* Body */}
        <div className="py-4 border-t border-gray-100 dark:border-gray-800 sm:py-6 ">
          <div className="space-y-6">{children}</div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-lg p-6 max-w-[600px] w-full shadow-xl relative backdrop-blur-sm">
            <div className="flex flex-col gap-1">
            <p className="text-[#262626] text-base font-medium">Tambah User</p>
            <p className="text-[#737373] text-sm">Masukan data pengguna Jagratama</p>
            </div>
            <hr className="my-[30px]" />
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={closeModal}
              aria-label="Close modal"
            >
              ✕
            </button>

            <UserCreateForm
              roles={roles}
              positions={positions}
              onClose={closeModal}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ComponentCardAdmin;
