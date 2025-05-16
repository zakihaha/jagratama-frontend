"use client"

import type React from "react"

import { useRef } from "react"
import type { QRPosition } from "./approval-letter-manager"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { QrCode, Maximize, PenTool, Move } from "lucide-react"
import { DocumentReviewDetailModel } from "@/types/document"

interface QRCodePanelProps {
  currentPage: number
  onPositionChange: (position: Partial<QRPosition>) => void
  qrPosition: QRPosition
  onAddSignature: () => void
  onRemoveSignature: () => void
  isPlaced: boolean
  document: DocumentReviewDetailModel
}

export const QRCodePanel = ({
  currentPage,
  onPositionChange,
  qrPosition,
  onAddSignature,
  onRemoveSignature,
  isPlaced,
  document,
}: QRCodePanelProps) => {
  const qrRef = useRef<HTMLDivElement>(null)

  const handleScaleChange = (value: number[]) => {
    onPositionChange({ scale: value[0] })
  }

  return (
    <div className="space-y-4">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          Masukkan Tanda Tangan
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="space-y-4">
          {
            document.requires_signature && (
              <div className="pt-2">
                {!isPlaced ? (
                  <Button className="w-full bg-emerald-500 hover:bg-emerald-600" onClick={onAddSignature}>
                    <PenTool className="mr-2 h-4 w-4" />
                    Add Signature
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
                    onClick={onRemoveSignature}
                  >
                    Remove Signature
                  </Button>
                )}

                <p className="text-xs text-slate-500 mt-2">
                  {isPlaced
                    ? "Your signature has been added to the document. You can drag it to reposition or use the resize handle."
                    : "Click 'Add Signature' to place the QR code on the document."}
                </p>
              </div>
            )
          }
        </div>
      </CardContent>
    </div>
  )
}
