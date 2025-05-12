"use client";

import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import { Input } from "@/components/ui/input";
import { UserModel } from "@/types/user";
import { Label } from "@radix-ui/react-label";
import React, { useActionState, useEffect } from "react";
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

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);

      setTimeout(() => {
        redirect("/jagratama/users");
      }, 1500);
    } else if (!state.success && state.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <ComponentCard title="Profile">
      <div className="w-full xl:w-2/3 flex flex-col items-center lg:items-start">
        <div className="flex flex-row items-center mb-[30px]">
          <Image
            // src={user?.avatar || '/images/placeholder.png'}
            src="https://i.pinimg.com/736x/6c/44/7f/6c447f6216b583880cd1c22a7f1848e5.jpg"
            alt="Profile Picture"
            width={100}
            height={100}
            className="rounded-full w-[100px] h-[100px] object-cover mr-3"
          />
          <div className="text-[#262626]">
            <div className="text-base font-medium mb-2">Update Foto Profil</div>
            <div className="flex flex-row gap-[10px] items-center justify-center text-sm px-[6px] py-[10px] border border-[#E5E7EB] rounded-[8px]">
              Upload
              <CircleArrowUp className="w-4 h-4" />
            </div>
          </div>
        </div>

        <form action={formAction}>
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-[#262626]">
              <div className="flex flex-col gap-2">
                <Label
                  className="flex flex-row items-center gap-2 text-sm"
                  htmlFor="name"
                >
                  <CircleUser className="text-[#A1A1A1] w-4 h-4" /> Full Name
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
                <Label className="flex flex-row items-center gap-2 text-sm" htmlFor="position_id"><Users className="text-[#A1A1A1] w-4 h-4" /> Position</Label>
                <Input
                  className="!rounded-2xl md:h-12 md:w-[320px] md:py-3 md:px-4 placeholder:!text-[#A1A1A1]"
                  type="email"
                  id="email"
                  placeholder="jussa@mail.com"
                  defaultValue={user?.position?.name}
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
