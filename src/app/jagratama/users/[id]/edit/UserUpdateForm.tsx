"use client";

import ComponentCard from "@/components/common/ComponentCard";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import Button from "@/components/ui/button/Button";
import { ChevronDownIcon } from "@/icons";
import { useActionState, useEffect } from "react";
import { FormState, updateUserAction } from "@/app/jagratama/users/actions";
import { UserCreateRequest } from "@/types/user";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import { PositionModel } from "@/types/position";
import { RoleModel } from "@/types/role";

export default function UserUpdateForm({
  id,
  user,
  roles,
  positions,
  onClose,
}: {
  id: number;
  user: UserCreateRequest;
  roles: RoleModel[];
  positions: PositionModel[];
  onClose?: () => void;
}) {
  const initialState: FormState = {
    success: false,
    message: "",
    errors: {},
  };

  const [state, formAction, isPending] = useActionState(
    updateUserAction,
    initialState
  );

  const roleOptions = roles.map((role) => ({
    value: role.id,
    label: role.name,
  }));

  const positionOptions = positions.map((position) => ({
    value: position.id,
    label: position.name,
  }));

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);

      onClose?.();
    } else if (!state.success && state.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form action={formAction}>
      <div className="space-y-6 grid grid-cols-2 gap-x-4">
        <input type="hidden" name="id" value={id} />
        <div>
          <Label className="text-[#262626] text-sm font-normal" htmlFor="name">
            Full Name
          </Label>
          <Input
            className="border !border-[#E5E5E5] !rounded-2xl placeholder:!text-[#A1A1A1] !text-sm"
            type="text"
            id="name"
            name="name"
            placeholder="Justin Hubner"
            defaultValue={user?.name}
          />
          {state.errors.name && (
            <p className="text-red-500 text-sm mt-1">{state.errors.name}</p>
          )}
        </div>
        <div>
          <Label className="text-[#262626] text-sm font-normal" htmlFor="email">
            Email
          </Label>
          <Input
            className="border !border-[#E5E5E5] !rounded-2xl placeholder:!text-[#A1A1A1] !text-sm"
            type="email"
            id="email"
            name="email"
            placeholder="jussa@mail.com"
            defaultValue={user?.email}
          />
          {state.errors.email && (
            <p className="text-red-500 text-sm mt-1">{state.errors.email}</p>
          )}
        </div>

        <div>
          <Label
            className="text-[#262626] text-sm font-normal"
            htmlFor="role_id"
          >
            Role
          </Label>
          <div className="relative">
            <Select
              options={roleOptions}
              defaultValue={String(user?.role_id)}
              placeholder="Select an option"
              name="role_id"
              id="role_id"
              className="border !border-[#E5E5E5] !rounded-2xl placeholder:!text-[#A1A1A1] !text-sm"
            />
            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
              <ChevronDownIcon />
            </span>
          </div>
          {state.errors.role_id && (
            <p className="text-red-500 text-sm mt-1">{state.errors.role_id}</p>
          )}
        </div>

        <div>
          <Label
            className="text-[#262626] text-sm font-normal"
            htmlFor="position_id"
          >
            Position
          </Label>
          <div className="relative">
            <Select
              options={positionOptions}
              defaultValue={String(user?.position_id)}
              placeholder="Select an option"
              name="position_id"
              id="position_id"
              className="border !border-[#E5E5E5] !rounded-2xl placeholder:!text-[#A1A1A1] !text-sm"
            />
            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
              <ChevronDownIcon />
            </span>
          </div>
          {state.errors.position_id && (
            <p className="text-red-500 text-sm mt-1">
              {state.errors.position_id}
            </p>
          )}
        </div>

        <div>
          <Label
            className="text-[#262626] text-sm font-normal"
            htmlFor="organization"
          >
            Organisasi
          </Label>
          <Input
            className="border !border-[#E5E5E5] !rounded-2xl placeholder:!text-[#A1A1A1] !text-sm"
            type="text"
            id="organization"
            name="organization"
            placeholder="Masukan Organisasi"
          />
        </div>
        
        <div></div>

        <div className="flex flex-row gap-4">
          <Button
            className="!bg-[#20939C] w-fit text-sm font-normal"
            size="md"
            variant="primary"
            type="submit"
            disabled={isPending || state.success}
          >
            {isPending || state.success ? "Loading..." : "Update Data"}
          </Button>
          <Button onClick={onClose} className="text-sm" variant="outline">
            Batal
          </Button>
        </div>
      </div>
    </form>
  );
}
