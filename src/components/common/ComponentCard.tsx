import { CircleFadingArrowUp, Funnel, Link, Search } from "lucide-react";
import React from "react";
import Button from "@/components/ui/button/Button";

interface ComponentCardProps {
  title: string;
  children: React.ReactNode;
  className?: string; // Additional custom classes for styling
  desc?: string; // Description text
}

const ComponentCard: React.FC<ComponentCardProps> = ({
  title,
  children,
  className = "",
  desc = "",
}) => {
  return (
    <div className={` bg-white  dark:bg-white/[0.03] ${className}`}>
      {/* Card Header */}
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
              placeholder="Cari Dokumen..."
              type="text"
              name=""
              id=""
            />
            <Search className="absolute top-3 left-4 text-[#A1A1A1]" />
          </div>
          <a href="/jagratama/documents/create">
          <Button size="sm" variant="primary" className="!bg-[#20939C]">
            <CircleFadingArrowUp />
            Upload File
          </Button>
          </a>
        </div>
      </div>

      {/* Card Body */}
      <div className="py-4 border-t border-gray-100 dark:border-gray-800 sm:py-6">
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
};

export default ComponentCard;
