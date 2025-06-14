"use client";

import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import { Input } from "@/components/ui/input";
import { UserModel } from "@/types/user";
import { Label } from "@radix-ui/react-label";
import React, { useActionState, useEffect, useRef, useState } from "react";
import { FormState, updatePasswordAction, updateProfileAction } from "../users/actions";
import { toast } from "sonner";
import Image from "next/image";
import { BriefcaseBusiness, CircleArrowUp, CircleUser, EyeIcon, EyeOff, Mail, RectangleEllipsis, Users } from "lucide-react";

const ProfileUpdateForm = ({ user }: { user: UserModel }) => {
  const initialState: FormState = {
    success: false,
    message: "",
    errors: {},
  };

  const [state, formAction, isPending] = useActionState(
    updateProfileAction,
    initialState
  );

  const [state_password, formActionPassword, isPendingPassword] = useActionState(
    updatePasswordAction,
    initialState
  );

  const [image, setImage] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isModalPasswordOpen, setModalPasswordOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)

      const reader = new FileReader()
      reader.onload = () => {
        setImage(reader.result as string)
      }
      reader.readAsDataURL(file)

    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleSubmit = async (formData: FormData) => {
    // Append imageFile
    if (imageFile) {
      formData.append("file", imageFile)
    }

    formAction(formData); // Call the action
  };

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);

      setTimeout(() => {
        window.location.href = "/jagratama";
      }, 1000);
    } else if (!state.success && state.message) {
      toast.error(state.message);
    }
  }, [state]);

  useEffect(() => {
    if (state_password.success) {
      toast.success(state_password.message);
      setModalPasswordOpen(false);
      setOldPassword("");
      setNewPassword("");
    } else if (!state_password.success && state_password.message) {
      toast.error(state_password.message);
    }
  }, [state_password]);

  return (
    <ComponentCard title="Profile">
      <div className="w-full xl:w-2/3 flex flex-col items-center lg:items-start">
        <div className="flex flex-row items-center mb-[30px]">
          <Image
            src={image || user?.image || "/images/profile.png"}
            alt="Profile Picture"
            width={100}
            height={100}
            className="rounded-full w-[100px] h-[100px] object-cover mr-3"
          />
          <div className="text-[#262626]">
            <div className="text-base font-medium mb-2">Update Foto Profil</div>
            <button
              onClick={handleUploadClick}
              className="flex flex-row gap-[10px] items-center justify-center text-sm px-[6px] py-[10px] border border-[#E5E7EB] rounded-[8px] hover:bg-gray-50 transition-colors"
            >
              Upload
              <CircleArrowUp className="w-4 h-4" />
            </button>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
          </div>
        </div>

        <form action={handleSubmit}>
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-[#262626]">
              <div className="flex flex-col gap-2">
                <Label
                  className="flex flex-row items-center gap-2 text-sm"
                  htmlFor="name"
                >
                  <CircleUser className="text-[#A1A1A1] w-4 h-4" /> Nama Lengkap
                </Label>
                <Input
                  className="!rounded-2xl md:h-12 md:w-[320px] md:py-3 md:px-4 placeholder:!text-[#A1A1A1]"
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Justin Hubner"
                  defaultValue={user?.name}
                />
                {state.errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {state.errors.name}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label className="flex flex-row items-center gap-2 text-sm" htmlFor="email"><Mail className="text-[#A1A1A1] w-4 h-4" /> Email</Label>
                <Input
                  className="!rounded-2xl md:h-12 md:w-[320px] md:py-3 md:px-4 placeholder:!text-[#A1A1A1]"
                  type="email"
                  id="email"
                  placeholder="jussa@mail.com"
                  defaultValue={user?.email}
                  disabled
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label className="flex flex-row items-center gap-2 text-sm" htmlFor="position_id"><BriefcaseBusiness className="text-[#A1A1A1] w-4 h-4" /> Jabatan</Label>
                <Input
                  className="!rounded-2xl md:h-12 md:w-[320px] md:py-3 md:px-4 placeholder:!text-[#A1A1A1]"
                  type="text"
                  id="jabatan"
                  placeholder="Direktur"
                  defaultValue={user?.position?.name}
                  disabled
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label className="flex flex-row items-center gap-2 text-sm" htmlFor="position_id"><RectangleEllipsis className="text-[#A1A1A1] w-4 h-4" /> Password</Label>
                <p
                  className="cursor-pointer text-red-400 text-sm mt-3 hover:underline"
                  onClick={() => setModalPasswordOpen(true)}
                >
                  Klik untuk ubah password
                </p>
              </div>
            </div>

            <Button
              className="!bg-[#20939C] !text-sm !rounded-[8px] !py-[14px] !px-4"
              size="md"
              variant="primary"
              type="submit"
              disabled={isPending || state.success}
            >
              {isPending || state.success ? "Loading..." : "Update Profile"}
            </Button>
          </div>
        </form>

        {/* password modal */}
        {isModalPasswordOpen && (
          <div className="fixed inset-0 z-99999 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-lg p-6 max-w-[600px] w-full shadow-xl relative backdrop-blur-sm">
              <div className="flex flex-col gap-1">
                <p className="text-[#262626] text-base font-medium">
                  Edit Password
                </p>
                <p className="text-[#737373] text-sm">
                  Masukan password baru Anda.
                </p>
              </div>
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                onClick={() => setModalPasswordOpen(false)}
                aria-label="Close modal"
              >
                ✕
              </button>

              <form action={formActionPassword}>
                <div className="mt-8 space-y-6 gap-x-4">
                  <div className="flex flex-col gap-2">
                    <Label className="text-[#262626] text-sm font-normal" htmlFor="old_password">
                      Password Lama
                    </Label>
                    <div className="relative">
                      <Input
                        className="!rounded-2xl md:h-12 md:py-3 md:px-4 placeholder:!text-[#A1A1A1]"
                        type={showOldPassword ? "text" : "password"}
                        name="old_password"
                        id="old_password"
                        placeholder="Masukkan password lama"
                        onChange={(e) => setOldPassword(e.target.value)}
                        value={oldPassword}
                        required
                      />
                      <span
                        onClick={() => setShowOldPassword(!showOldPassword)}
                        className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                      >
                        {showOldPassword ? (
                          <EyeIcon className="w-4" />
                        ) : (
                          <EyeOff className="w-4" />
                        )}
                      </span>
                    </div>
                    {state_password.errors.old_password && (
                      <p className="text-red-500 text-sm mt-1">{state_password.errors.old_password}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="text-[#262626] text-sm font-normal" htmlFor="new_password">
                      Password Baru
                    </Label>
                    <div className="relative">
                      <Input
                        className="!rounded-2xl md:h-12 md:py-3 md:px-4 placeholder:!text-[#A1A1A1]"
                        type={showNewPassword ? "text" : "password"}
                        name="new_password"
                        id="new_password"
                        placeholder="Masukkan password baru"
                        onChange={(e) => setNewPassword(e.target.value)}
                        value={newPassword}
                        required
                      />
                      <span
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                      >
                        {showOldPassword ? (
                          <EyeIcon className="w-4" />
                        ) : (
                          <EyeOff className="w-4" />
                        )}
                      </span>
                    </div>
                    {state_password.errors.new_password && (
                      <p className="text-red-500 text-sm mt-1">{state_password.errors.new_password}</p>
                    )}
                  </div>
                  <div className="flex flex-row gap-4">
                    <Button
                      className="!bg-[#20939C] w-fit text-sm font-normal"
                      size="md"
                      variant="primary"
                      type="submit"
                      disabled={isPending || state.success}
                    >
                      {isPending || state.success ? "Loading..." : "Update Password"}
                    </Button>
                    <Button onClick={() => setModalPasswordOpen(false)} className="text-sm" variant="outline">
                      Batal
                    </Button>
                  </div>
                </div>
              </form>

            </div>
          </div>
        )}
      </div>
    </ComponentCard>
  );
};

export default ProfileUpdateForm;
