import { auth } from "@/auth";
import { getUser } from "@/lib/api/users";
import { Metadata } from "next";
import React from "react";
import ProfileUpdateForm from "./ProfileUpdateForm";

export const metadata: Metadata = {
  title: "JAGRATAMA | Dashboard Pengajuan Dokumen",
  description:
    "JAGRATAMA adalah dashboard digital untuk pengajuan, pelacakan, dan pengelolaan dokumen secara mudah dan efisien",
};

const Profile = async () => {
  const session = await auth();
  const user = await getUser(session?.user?.id as string);

  return <ProfileUpdateForm user={user} />
}

export default Profile;
