"use client"

import type React from "react"

import type { QRPosition } from "./approval-letter-manager"
import { Button } from "@/components/ui/button"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown, CheckCircle, XCircle, PenLine } from "lucide-react"
import { DocumentReviewDetailModel } from "@/types/document"

interface QRCodePanelProps {
  currentPage: number
  onPositionChange: (position: Partial<QRPosition>) => void
  qrPosition: QRPosition
  onAddSignature: () => void
  onRemoveSignature: () => void
  onFormInputChange: (field: keyof FormData, value: string) => void;
  formInputValue: {
    approved: string
    note: string
  }
  isPlaced: boolean
  document: DocumentReviewDetailModel
}


export const QRCodePanel = ({
  onAddSignature,
  onFormInputChange,
  formInputValue,
  isPlaced,
  document,
}: QRCodePanelProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onFormInputChange(name as keyof FormData, value);
  };

  return (
    <div className="space-y-4">
      <CardHeader className="pt-4 pb-0 px-0">
        <CardTitle className="text-sm lg:text-base font-normal">
          Status Pengajuan
        </CardTitle>
      </CardHeader>
      <CardContent className="py-4 pt-0 px-0">
        <div className="space-y-4">
          <div className="text-sm text-gray-700 space-y-4">
            <div className="space-y-2">
              <p className="text-sm">Pilih Status</p>
              <div className="relative">
                <select
                  value={formInputValue.approved === "approved" ? "approved" : "rejected"}
                  onChange={handleChange}
                  name="approved"
                  className={`w-full appearance-none pl-10 pr-10 py-3 rounded-2xl border bg-white border-[#CFD6DD] focus:outline-none ${formInputValue.approved === "approved" ? "text-[#20939C]" : "text-[#E57818]"}`}
                >
                  <option value="approved">Setujui</option>
                  {
                    document.is_reviewer && (
                      <option value="rejected">Revisi</option>
                    )
                  }
                </select>

                {
                  formInputValue.approved === "approved" ? (
                    <CheckCircle className="w-5 h-5 text-[#20939C] absolute left-3 top-1/2 -translate-y-1/2" />
                  ) : (
                    <XCircle className="w-5 h-5 text-[#D33126] absolute left-3 top-1/2 -translate-y-1/2" />
                  )
                }
                <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {
            document.is_reviewer && (
              <div className="space-y-2">
                <p className="text-sm">Catatan</p>
                <form action="">
                  <textarea
                    className="w-full bg-white flex flex-row items-center gap-[10px] border border-[#CFD6DD] rounded-2xl p-3"
                    placeholder="Masukan Catatan"
                    name="note"
                    id="note"
                    onChange={handleChange}
                    defaultValue={formInputValue.note}
                  >
                  </textarea>
                </form>
              </div>
            )
          }

          {
            document.requires_signature && (
              <div className="pt-2">
                {!isPlaced ? (
                  <div className="space-y-2">
                    <p className="text-sm">Action</p>

                    <Button onClick={onAddSignature} className="text-sm text-[#262626] font-normal flex flex-wrap items-center justify-between gap-3 p-5 bg-[#F7FCFC] border border-[#2C8289] w-full h-auto rounded-2xl cursor-pointer hover:bg-[#eaf5f5]">
                      Masukan Tanda Tangan
                      <PenLine className="w-5 h-5 text-[#2C8289]" />
                    </Button>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            )
          }
        </div>
      </CardContent>
    </div>
  )
}
