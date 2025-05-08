"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import type { QRPosition } from "./approval-letter-manager"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { CheckIcon, XIcon, SendIcon, AlertTriangleIcon } from "lucide-react"

interface ActionButtonsProps {
  qrPosition: QRPosition
  disabled?: boolean
  isLoading: boolean
  approveHandle: ({ approved, note }: { approved: boolean, note?: string }) => void // Add the 'approve' property as an optional function
}

export const ActionButtons = ({ qrPosition, disabled, isLoading, approveHandle }: ActionButtonsProps) => {
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false)
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")
  const [approved, setApproved] = useState(false)

  const openDialog = ({ approved }: { approved: boolean }) => {
    if (approved) {
      setApproved(true)
      setIsApproveDialogOpen(true)
    } else {
      setApproved(false)
      setIsRejectDialogOpen(true)
    }
  }

  const submitApproval = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    approveHandle({ approved, note: rejectionReason })
  }

  return (
    <div className="space-y-4">
      {/* Approve Dialog */}
      <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <Button
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
          disabled={disabled}
          onClick={() => openDialog({ approved: true })}
        >
          <CheckIcon className="mr-2 h-4 w-4" />
          Approve Document
        </Button>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Approval</DialogTitle>
            <DialogDescription>
              You are about to approve this document with the QR code signature. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm">
              Document: <span className="font-medium"> </span>
            </p>
            <p className="text-sm">
              QR Code Position: Page {qrPosition.page}, X: {qrPosition.xPercent.toFixed(1)}%, Y:{" "}
              {qrPosition.yPercent.toFixed(1)}%
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApproveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => approveHandle({ approved: true })} className="bg-emerald-500 hover:bg-emerald-600" disabled={isLoading}>
              {isLoading ? (
                <>Processing...</>
              ) : (
                <>
                  <SendIcon className="mr-2 h-4 w-4" />
                  Confirm Approval
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <Button
          variant="outline"
          className="w-full border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 dark:border-red-900 dark:hover:bg-red-950/30"
          disabled={disabled}
          onClick={() => openDialog({ approved: false })}
        >
          <XIcon className="mr-2 h-4 w-4" />
          Reject Document
        </Button>
        <DialogContent>
          <form onSubmit={submitApproval}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangleIcon className="h-5 w-5 text-red-500" />
                Reject Document
              </DialogTitle>
              <DialogDescription>Please provide a reason for rejecting this document.</DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Textarea
                placeholder="Enter rejection reason..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" disabled={isLoading} type="submit" onClick={() => approveHandle({ approved: false, note: rejectionReason })}>
                {isLoading ? (
                  <>Processing...</>
                ) : (
                  <>
                    <SendIcon className="mr-2 h-4 w-4" />
                    Confirm Rejection
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
