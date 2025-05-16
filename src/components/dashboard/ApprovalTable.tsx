import Image from "next/image";
import { CircleArrowDown, CircleArrowUp, TriangleAlert } from "lucide-react";
import Badge from "@/components/ui/badge/Badge";
import { Button } from "@/components/ui/button";
import { error } from "console";
import { DocumentTrackingModel } from "@/types/document";
import { formatDate } from "@/lib/utils/formatDate";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function ApprovalTable({ steps }: { steps: DocumentTrackingModel[] }) {
  console.log(steps);

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
                    <div className="flex gap-3 items-start">
                      <Image
                        src={"/images/user/owner.jpg"}
                        alt="User"
                        width={30}
                        height={30}
                        className="rounded-full mt-1"
                      />
                      <div>
                        <p>{step.user?.name}</p>
                        <p className="text-xs text-[#A1A1A1]">{step?.resolved_at && formatDate(step?.resolved_at)}</p>
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
    </div>
  );
}
