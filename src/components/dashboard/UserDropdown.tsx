"use client";

import { useState } from "react";
import {
  ChevronsUpDown,
  LogOut,
  User,
  UserPen,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";

type UserDropdownProps = {
  isCollapsed?: boolean;
  name?: string;
  email?: string;
  image?: string;
};

export function UserDropdown({ isCollapsed = false, name, email, image }: UserDropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`relative ${isCollapsed ? "w-auto" : "w-full"
        } rounded-xl border bg-white shadow-sm overflow-hidden transition-all duration-300`}
    >
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center ${isCollapsed ? "justify-center p-2" : "justify-between px-4 py-3"
          }`}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            {
              image ? (
                <>
                  <Image
                    src={image || "/images/user/owner.jpg"}
                    alt="User"
                    width={36}
                    height={36}
                    className="rounded-full"
                  />
                  <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500 ring-2 ring-white" />
                </>
              ) : (
                <User className="w-9 h-9 text-muted-foreground" />
              )
            }
          </div>
          {!isCollapsed && (
            <div className="text-left">
              <p className="text-sm font-semibold text-foreground">{name}</p>
              <p className="text-xs text-muted-foreground">
                {email}
              </p>
            </div>
          )}
        </div>
        {!isCollapsed && (
          <ChevronsUpDown className="w-4 h-4 text-muted-foreground ml-auto" />
        )}
      </button>

      {!isCollapsed && (
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${open ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
            }`}
        >
          <hr className="border-t" />
          <Link
            href="/jagratama/profile"
            className="px-4 py-3 flex items-center gap-2 cursor-pointer hover:text-[#20939C] hover:bg-[#E2F6F7] transition"
          >
            <UserPen className="w-4 h-4" />
            <span>Profile</span>
          </Link>
          <div
            onClick={() =>
              signOut({
                redirect: true,
                redirectTo: "/signin",
              })
            }
            className="px-4 py-3 flex items-center gap-2 cursor-pointer text-red-500 hover:bg-[#FBEBE9] transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </div>
        </div>
      )}

      {isCollapsed && open && (
        <div className="absolute bottom-full mb-2 right-0 w-48 bg-white border rounded-xl shadow-md overflow-hidden z-50">
          <Link
            href="/jagratama/profile"
            className="px-4 py-3 flex items-center gap-2 cursor-pointer hover:text-[#20939C] hover:bg-[#E2F6F7] transition"
          >
            <UserPen className="w-4 h-4" />
            <span>Profile</span>
          </Link>
          <div
            onClick={() =>
              signOut({
                redirect: true,
                redirectTo: "/signin",
              })
            }
            className="px-4 py-3 flex items-center gap-2 cursor-pointer text-red-500 hover:bg-[#FBEBE9] transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </div>
        </div>
      )}
    </div>
  );
}
