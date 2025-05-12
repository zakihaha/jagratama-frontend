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
import {
  MultiSelectOption,
  Option,
} from "@/components/form/input/MultiSelectOption";
import { CircleArrowRight } from "lucide-react";
import { UploadFile } from "@/components/dashboard/UploadFile";

const DocumentCreate = () => {
  const initialState: FormState = {
    success: false,
    message: "",
    errors: {},
  };

  const [state, formAction, isPending] = useActionState(
    createDocumentAction,
    initialState
  );
  const [message, setMessage] = useState<string>("");
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);

  const options = [
    { value: 1, label: "Cat 1" },
    { value: 2, label: "Cat 2" },
    { value: 3, label: "Cat 3" },
  ];

  // Sample data for demonstration
  const COUNTRIES: Option[] = [
    { value: "reviewer@gmail.com", label: "Akun Reviewer" },
    { value: "approver@gmail.com", label: "Akun Approver" },
    { value: "admin@gmail.com", label: "Akun Admin" },
  ];

  const handleSubmit = async (formData: FormData) => {
    // Append selectedCountries as JSON string
    formData.append("approvers", JSON.stringify(selectedCountries));

    formAction(formData); // Call the action
  };

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);

      setTimeout(() => {
        redirect("/jagratama/documents");
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
              <UploadFile />

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
                    options={options}
                    placeholder="Pilih Tipe Surat"
                    name="category_id"
                    id="category_id"
                    className="dark:bg-dark-900 !rounded-2xl placeholder:!text-[#A1A1A1]"
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
                <div>
                  <Label
                    className="text-[#262626] mb-2 text-sm"
                    htmlFor="approvers"
                  >
                    Ditunjukan Kepada
                  </Label>
                  <MultiSelectOption
                    className="!rounded-2xl placeholder:!text-[#A1A1A1]"
                    options={COUNTRIES}
                    selected={selectedCountries}
                    onChange={setSelectedCountries}
                    placeholder="Pilih Pengajuan"
                    searchPlaceholder="Pengajuan Kepada"
                  />
                </div>
                {state.errors.approvers && (
                  <p className="text-red-500 text-sm mt-1">
                    {state.errors.approvers}
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

export default DocumentCreate;
