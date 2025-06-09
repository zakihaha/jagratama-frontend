"use client";

import ComponentCard from "@/components/common/ComponentCard";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import Button from "@/components/ui/button/Button";
import { ChevronDownIcon } from "@/icons";
import { useActionState, useEffect, useState } from "react";
import {
  createDocumentAction,
  FormState,
} from "@/app/jagratama/documents/actions";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import TextArea from "@/components/form/input/TextArea";
import { CircleArrowRight } from "lucide-react";
import { UploadFile } from "@/components/dashboard/UploadFile";
import { CategoryModel } from '@/types/category'
import { UserModel } from "@/types/user";
import { PositionModel } from "@/types/position";
import { API_V1_BASE_URL } from "@/lib/config";
import { useSession } from "next-auth/react";
import { SearchableSelect } from "@/components/form/input/SearchableSelect"

const DocumentCreateForm = ({ categories, users }: { categories: CategoryModel[], users: UserModel[] }) => {
  const session = useSession();
  const initialState: FormState = {
    success: false,
    message: "",
    errors: {},
    data: undefined
  };

  const [state, formAction, isPending] = useActionState(
    createDocumentAction,
    initialState
  );
  const [message, setMessage] = useState<string>("");
  const [positions, setPositions] = useState<PositionModel[]>([]);
  const [selectedApprovers, setSelectedApprovers] = useState<Record<string, string>>({});

  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.name
  }))

  const userOptions = users.map((user) => ({
    value: user.email,
    label: user.name
  }));

  const handleSelectCategory = async (value: string) => {
    if (value) {
      const valueId = parseInt(value, 10);

      const res = await fetch(`${API_V1_BASE_URL}/positions/rules-by-category/${valueId}`, {
        cache: 'no-store', // Or 'force-cache' if data is not updated often
        headers: {
          'Authorization': `Bearer ${session.data?.accessToken}`,
        },
      })
      const json = await res.json();
      const positions: PositionModel[] = json.data;
      setPositions(positions);
    }
  }

  const getUserOptionsByPosition = (positionId: number) => {
    return userOptions.filter((user) => {
      // Assuming users have a position_id field to filter by
      return users.find((u) => u.email === user.value && u.position_id === positionId);
    });
  };

  const handleLectureTargetChange = (positionId: number, value: string) => {
    const positionIdString = positionId.toString();
    setSelectedApprovers((prev) => ({
      ...prev,
      [positionIdString]: value
    }));
  };

  const handleSubmit = async (formData: FormData) => {
    const selectedApproversArray = Object.values(selectedApprovers);
    formData.append("approvers", JSON.stringify(selectedApproversArray));

    formAction(formData); // Call the action
  };

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);

      setTimeout(() => {
        redirect(`/jagratama/documents/${state.data?.slug}/confirmation`);
      }, 1500);
    } else if (!state.success && state.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <ComponentCard title="Pengajuan">
      <div className="w-full lg:w-2/3 xl:w-1/2 flex flex-col justify-self-center">
        <h1 className="mb-3 text-base font-medium text-[#262626]">
          Siapkan Pengajuan
        </h1>
        <form action={handleSubmit}>
          <div className="border border-[#E5E7EB] rounded-2xl p-3">
            <div className="space-y-6">
              <UploadFile name="file" />
              {state.errors.file_id && (
                <p className="text-red-500 text-sm mt-1">
                  {state.errors.file_id}
                </p>
              )}

              <div>
                <Label className="text-[#262626] mb-2 text-sm" htmlFor="title">
                  Judul Pengajuan
                </Label>
                <Input
                  className="!rounded-2xl placeholder:!text-[#A1A1A1]"
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Masukan Judul"
                />
                {state.errors.title && (
                  <p className="text-red-500 text-sm mt-1">
                    {state.errors.title}
                  </p>
                )}
              </div>
              <div>
                <Label
                  className="text-[#262626] mb-2 text-sm"
                  htmlFor="category_id"
                >
                  Tipe Surat
                </Label>
                <div className="relative">
                  <Select
                    options={categoryOptions}
                    placeholder="Pilih Tipe Surat"
                    name="category_id"
                    id="category_id"
                    className="dark:bg-dark-900 !rounded-2xl placeholder:!text-[#A1A1A1]"
                    onChange={handleSelectCategory}
                  />
                  <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                    <ChevronDownIcon />
                  </span>
                </div>
                {state.errors.category_id && (
                  <p className="text-red-500 text-sm mt-1">
                    {state.errors.category_id}
                  </p>
                )}
              </div>

              <div>
                <Label
                  className="text-[#262626] mb-2 text-sm"
                  htmlFor="description"
                >
                  Description
                </Label>
                <TextArea
                  className="!rounded-2xl placeholder:!text-[#A1A1A1]"
                  name="description"
                  id="description"
                  placeholder="Masukan Deskripsi.."
                  value={message}
                  onChange={(value) => setMessage(value)}
                  rows={6}
                />
                {state.errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {state.errors.description}
                  </p>
                )}
              </div>
            </div>
            {
              positions && positions.length > 0 && (
                <>
                  <hr className="my-6" />
                  <div className="space-y-6">
                    <Label className="text-[#262626] mb-2 text-sm">Ditujukan Kepada:</Label>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                      {positions.map((position) => (
                        <div key={position.id}>
                          <Label
                            className="text-[#262626] mb-2 text-sm"
                            htmlFor={`approvers-${position.id}`}
                          >
                            {position.name}
                          </Label>
                          <SearchableSelect
                            className="!rounded-2xl placeholder:!text-[#A1A1A1]"
                            options={getUserOptionsByPosition(position.id)}
                            value={selectedApprovers[position.id] || ""}
                            onChange={(value) => handleLectureTargetChange(position.id, value)}
                            placeholder={`Select User`}
                            searchPlaceholder={`Search User...`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )
            }
          </div>
          <Button
            className="!bg-[#20939C] rounded-[8px] text-sm mt-6"
            size="md"
            variant="primary"
            type="submit"
            disabled={isPending || state.success}
          >
            {isPending || state.success ? "Loading..." : "Berikutnya"}
            <CircleArrowRight />
          </Button>
        </form>
      </div>
    </ComponentCard>
  );
};

export default DocumentCreateForm;
