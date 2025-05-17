"use client";

import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import { Input } from "@/components/ui/input";
import { UserModel } from "@/types/user";
import { Label } from "@radix-ui/react-label";
import React, { useActionState, useEffect, useRef, useState } from "react";
import { FormState, updateProfileAction } from "../users/actions";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import Image from "next/image";
import { BriefcaseBusiness, CircleArrowUp, CircleUser, Mail, Users } from "lucide-react";

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

  const [image, setImage] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      console.log("set file");
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
      </div>
    </ComponentCard>
  );
};

export default ProfileUpdateForm;
