import { auth } from "@/auth";
import { getUser } from "@/lib/api/users";
import { Metadata } from "next";
import React from "react";
import ProfileUpdateForm from "./ProfileUpdateForm";

export const metadata: Metadata = {
  title: "Next.js Profile | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Profile page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const Profile = async () => {
  const session = await auth();
  const user = await getUser(session?.user?.id as string);

  return <ProfileUpdateForm user={user} />
}

export default Profile;
