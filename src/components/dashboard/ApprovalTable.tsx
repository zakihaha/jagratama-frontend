"use client";

import Image from "next/image";
import { CircleArrowDown, CircleArrowUp, FileX, TriangleAlert, Upload } from "lucide-react";
import Badge from "@/components/ui/badge/Badge";
import { Button } from "@/components/ui/button";
import { DocumentTrackingModel } from "@/types/document";
import { formatDate } from "@/lib/utils/formatDate";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { FormState, reuploadDocumentAction } from "@/app/jagratama/documents/actions";

export default function ApprovalTable({ steps, slug }: { steps: DocumentTrackingModel[]; slug: string }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedApprovalId, setSelectedApprovalId] = useState<number | null>(null);

  const initialState: FormState = {
    success: false,
    message: "",
    errors: {},
    data: undefined
  };

  const [state, formAction, isPending] = useActionState(
    reuploadDocumentAction,
    initialState
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setSelectedFile(null);
  };

  const handleReuploadButtonClick = (approval_id: number) => {
    setIsDialogOpen(true);
    setSelectedFile(null); // Reset selected file when opening dialog
    setSelectedApprovalId(approval_id);
  };

  const handleReuploadSubmit = async (formData: FormData) => {
    if (selectedFile && selectedApprovalId) {
      formData.append("slug", slug);
      formData.append("approval_id", selectedApprovalId?.toString());

      formAction(formData); // Call the action
    }
  };

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
    } else if (!state.success && state.message) {
      toast.error(state.message);
    }
    setIsDialogOpen(false);
    setSelectedFile(null);
  }, [state]);

  return (
    <div className="relative pl-6 mt-3">
      {/* Vertical Line */}
      <div className="absolute left-2 top-10 bottom-8 w-[2px] bg-[#E5E7EB] z-0" />

      <table className="w-full table-auto">
        <thead>
          <tr>
            <th className="text-left text-sm text-[#404040] font-normal">
              Informasi
            </th>
            <th className="text-left text-sm text-[#404040] font-normal">
              Catatan
            </th>
            <th className="text-left text-sm text-[#404040] font-normal">
              Status
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {
            steps.map((step, index) => {
              const isCompleted = step.status === "approved";
              const isRejected = step.status === "rejected";

              let isCurrent = false;
              let isFuture = false;

              const prevApproved = index === 0 || steps[index - 1].status === "approved";

              if (prevApproved) {
                isCurrent = !isCompleted;
              } else {
                isFuture = true;
              }

              let stepNote = ""

              // step note
              if (isCompleted || isRejected) {
                if (step.note) {
                  stepNote = step.note
                } else {
                  stepNote = "No note"
                }
              }

              if (isCurrent) {
                stepNote = "In progress"
              }
              // ${step.status === "Pending" ? "grayscale" : ""}

              return (
                <tr key={index} className="align-top">
                  <td
                    className={cn(
                      "py-4 text-sm text-[#262626] relative",
                      isFuture && "grayscale",
                    )}
                  >
                    {/* Bullet */}
                    <span
                      className={cn(
                        "absolute left-[-21px] top-7 w-3 h-3 rounded-full z-10",
                        isCompleted && "bg-[#20939C]",
                        isCurrent && "bg-[#20939C]",
                        isFuture && "bg-[#20939C]",
                        isRejected && "bg-[#D33126]",
                      )}
                    />
                    <div className="flex gap-3 items-center">
                      <Image
                        src={step.user.image}
                        alt="User"
                        width={30}
                        height={30}
                        className="rounded-full mt-1"
                      />
                      <div>
                        <p>{step.user?.name}</p>
                        {isCompleted && <p className="text-xs text-[#A1A1A1]">{formatDate(step?.resolved_at)}</p>}
                        {isRejected && (
                          <div className="text-red-600 flex items-center gap-1">
                            <TriangleAlert className="w-4 h-4" /> Mohon upload ulang surat
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-sm text-[#404040]">
                    {step.note === "-" ? "-" : <div>{step.note}</div>}
                  </td>
                  <td className="py-4">
                    <Badge
                      variant="outline"
                      size="sm"
                      color={
                        step.status === "approved"
                          ? "success"
                          : step.status === "pending"
                            ? isCurrent ? "light" : "warning"
                            : step.status === "rejected"
                              ? "error"
                              : "light"
                      }
                    >
                      {step.status === "approved"
                        ? "Disetujui"
                        : step.status === "pending"
                          ? isCurrent ? "Proses" : "Pending"
                          : "Revisi"}
                    </Badge>
                  </td>
                  <td className="py-4 text-end space-x-2">
                    {step.status === "approved" && (
                      <Link href={step.file} target="_blank">
                        <Button
                          size="sm"
                          variant="outline"
                          className="!text-sm !font-normal !ring-[#20939C] !text-[#20939C] !rounded-[8px]"
                        >
                          Download
                          <CircleArrowDown size={16} className="ml-1" />
                        </Button>
                      </Link>
                    )}

                    {step.status === "rejected" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="!text-sm !font-normal !rounded-[8px]"
                        onClick={() => handleReuploadButtonClick(step.id)}
                      >
                        Upload Ulang
                        <CircleArrowUp size={16} className="ml-1" />
                      </Button>
                    )}
                  </td>
                </tr>
              )

            })}


        </tbody>
      </table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="font-medium">Upload Ulang Dokumen</DialogTitle>
          </DialogHeader>
          <form action={handleReuploadSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="file" className="font-normal">
                  Pilih File
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="file"
                    type="file"
                    onChange={handleFileChange}
                    name="file"
                  />
                  {selectedFile && (
                    <div className="flex items-center text-sm text-green-600">
                      <FileX className="w-4 h-4 mr-1" />
                      {selectedFile.name}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!selectedFile || isPending}
              >
                <Upload className="w-4 h-4 mr-2" />
                Reupload
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
