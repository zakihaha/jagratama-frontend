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

interface QRCodePanelProps {
  currentPage: number
  onPositionChange: (position: Partial<QRPosition>) => void
  qrPosition: QRPosition
  onAddSignature: () => void
  onRemoveSignature: () => void
  isPlaced: boolean
}

export const QRCodePanel = ({
  currentPage,
  onPositionChange,
  qrPosition,
  onAddSignature,
  onRemoveSignature,
  isPlaced,
}: QRCodePanelProps) => {
  const qrRef = useRef<HTMLDivElement>(null)

  const handleScaleChange = (value: number[]) => {
    onPositionChange({ scale: value[0] })
  }

  const handlePageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const page = Number.parseInt(e.target.value)
    if (!isNaN(page) && page > 0) {
      onPositionChange({ page })
    }
  }

  const handlePositionChange = (axis: "x" | "y", value: string) => {
    const numValue = Number.parseInt(value)
    if (!isNaN(numValue)) {
      onPositionChange({ [axis]: numValue })
    }
  }

  const applyToCurrentPage = () => {
    onPositionChange({ page: currentPage })
  }

  const resetPosition = () => {
    onPositionChange({ x: 0, y: 0, scale: 1 })
  }

  return (
    <div className="space-y-4">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          <QrCode className="h-5 w-5" />
          QR Code Signature
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="scale" className="flex items-center gap-2">
                <Maximize className="h-4 w-4" /> Size
              </Label>
              <span className="text-sm text-slate-500">{(qrPosition.scale * 100).toFixed(0)}%</span>
            </div>
            <Slider
              id="scale"
              min={0.5}
              max={2}
              step={0.1}
              value={[qrPosition.scale]}
              onValueChange={handleScaleChange}
              className="cursor-pointer"
            />
          </div>

          {/* Position Controls */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Move className="h-4 w-4" /> Position
            </Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="x-pos" className="text-xs">
                  X Position
                </Label>
                <Input
                  id="x-pos"
                  type="number"
                  value={qrPosition.x}
                  onChange={(e) => handlePositionChange("x", e.target.value)}
                  className="h-8"
                />
              </div>
              <div>
                <Label htmlFor="y-pos" className="text-xs">
                  Y Position
                </Label>
                <Input
                  id="y-pos"
                  type="number"
                  value={qrPosition.y}
                  onChange={(e) => handlePositionChange("y", e.target.value)}
                  className="h-8"
                />
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={resetPosition} className="w-full mt-1">
              Reset Position
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="page" className="flex items-center gap-2">
              <QrCode className="h-4 w-4" /> Page
            </Label>
            <div className="flex gap-2">
              <Input
                id="page"
                type="number"
                min={1}
                value={qrPosition.page}
                onChange={handlePageChange}
                className="h-9"
              />
              <Button variant="outline" size="sm" onClick={applyToCurrentPage} className="whitespace-nowrap">
                Use Current
              </Button>
            </div>
          </div>

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
        </div>
      </CardContent>
    </div>
  )
}
