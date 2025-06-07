import { CircleFadingArrowUp, Funnel, Search } from "lucide-react";
import React from "react";
import Button from "@/components/ui/button/Button";
import Link from "next/link";

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
      {/* Card Body */}
      <div className="py-4 sm:py-6">
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
};

export default ComponentCard;
