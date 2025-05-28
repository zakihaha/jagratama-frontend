"use client"

import type React from "react"

import type { QRPosition } from "./approval-letter-manager"
import { Button } from "@/components/ui/button"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown, CheckCircle, XCircle, PenLine, Box } from "lucide-react"
import { DocumentModel, DocumentReviewDetailModel } from "@/types/document"
import Image from "next/image"

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
  document: DocumentModel
}


export const QRCodePanel2 = ({
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
          Informasi Pengajuan
        </CardTitle>
      </CardHeader>
      <CardContent className="py-4 pt-0 px-0">
        <div className="space-y-4">
          <div className="text-sm text-gray-700 space-y-4">
            <div className="space-y-2">
              <p className="text-sm">Tipe Surat</p>
              <div className="bg-white flex flex-row items-center gap-[10px] border border-[#CFD6DD] rounded-2xl p-3">
                <Box />
                <p className="text-xs lg:text-sm">{document.category.name}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm">Ditunjukan Kepada</p>
            <div className="bg-white flex flex-row items-center gap-[10px] border border-[#CFD6DD] rounded-2xl p-3">
              <Image
                src={document.addressed_user.image || "/images/user/owner.jpg"}
                alt="User"
                width={24}
                height={24}
                className="rounded-full"
              />
              <p className="text-xs lg:text-sm">{document.addressed_user.name}</p>
            </div>
          </div>

          {/* {
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
          } */}

          {/* {
            document.requires_signature && ( */}
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
          {/* )
          } */}
        </div>
      </CardContent>
    </div>
  )
}
