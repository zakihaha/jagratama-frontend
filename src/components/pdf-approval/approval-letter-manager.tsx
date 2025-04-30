"use client"

import { useState, useRef, useEffect } from "react"
import { PDFViewer } from "./pdf-viewer"
import { QRCodePanel } from "./qr-code-panel"
import { FileUpload } from "./file-upload"
import { ActionButtons } from "./action-buttons"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Download } from "lucide-react"
import { toast } from "sonner"
import { API_V1_BASE_URL } from "@/lib/config"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { PDFThumbnailNavigator } from "./pdf-thumbnail-navigator"

// Use relative positioning for QR code
export type QRPosition = {
  xPercent: number // X position as percentage of page width
  yPercent: number // Y position as percentage of page height
  scale: number
  page: number
  isPlaced: boolean
}

interface Params {
  slug: string
}

export const ApprovalLetterManager = ({ slug }: Params) => {
  const session = useSession()
  const router = useRouter()

  const [file, setFile] = useState<File | null>(null)
  const [numPages, setNumPages] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [isDownloading, setIsDownloading] = useState(false)
  const [qrPosition, setQrPosition] = useState<QRPosition>({
    xPercent: 10, // Default position at 10% from left
    yPercent: 10, // Default position at 10% from top
    scale: 1,
    page: 1,
    isPlaced: false,
  })
  // Generate stable QR code data that won't change with position/scale updates
  const [qrData, setQrData] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const pdfContainerRef = useRef<HTMLDivElement>(null)
  const pdfViewerRef = useRef<any>(null)

  // Generate QR data once when file changes
  useEffect(() => {
    if (file) {
      setQrData(
        JSON.stringify({
          user: "John Doe",
          timestamp: new Date().toISOString(),
          documentId: file.name || "unknown",
        }),
      )
    }
  }, [file])

  const handleFileUpload = (uploadedFile: File) => {
    setFile(uploadedFile)
    setCurrentPage(1)
    // Reset QR position when a new file is uploaded
    setQrPosition({ xPercent: 10, yPercent: 10, scale: 1, page: 1, isPlaced: false })
    toast("File uploaded successfully")
  }

  const handleDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
  }

  const handleQRPositionChange = (newPosition: Partial<QRPosition>) => {
    setQrPosition((prev) => ({ ...prev, ...newPosition }))
  }

  const handleAddSignature = () => {
    setQrPosition((prev) => ({ ...prev, isPlaced: true }))
    toast("Signature Added")
  }

  const handleRemoveSignature = () => {
    setQrPosition((prev) => ({ ...prev, isPlaced: false }))
    toast("Signature Removed")
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleDownload = async () => {
    if (!file) return

    setIsDownloading(true)

    // Show loading toast
    const loadingToast = toast("Preparing Download")

    try {
      let pdfBlob: Blob

      // Set a timeout to prevent UI freezing
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("PDF generation timed out")), 30000)
      })

      // If signature is placed, generate signed PDF
      if (qrPosition.isPlaced && pdfViewerRef.current && typeof pdfViewerRef.current.generateSignedPDF === "function") {
        pdfBlob = (await Promise.race([pdfViewerRef.current.generateSignedPDF(), timeoutPromise])) as Blob
      } else {
        // Otherwise just use the original file
        pdfBlob = new Blob([await file.arrayBuffer()], { type: "application/pdf" })
      }

      // Create a download URL for the file
      const url = URL.createObjectURL(pdfBlob)

      // Create a temporary anchor element
      const a = document.createElement("a")
      a.href = url
      a.download = file.name.replace(/\.[^/.]+$/, "") + "_signed.pdf"
      document.body.appendChild(a)
      a.click()

      // Clean up
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast("Download Complete")
    } catch (error) {
      console.error("Error generating PDF:", error)
      toast("Download Failed")

      // Fallback: download the original PDF
      try {
        const originalPdfBlob = new Blob([await file.arrayBuffer()], { type: "application/pdf" })
        const url = URL.createObjectURL(originalPdfBlob)
        const a = document.createElement("a")
        a.href = url
        a.download = file.name.replace(/\.[^/.]+$/, "") + "_original.pdf"
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)

        toast("Original PDF Downloaded")
      } catch (fallbackError) {
        console.error("Fallback download failed:", fallbackError)
      }
    } finally {
      setIsDownloading(false)
    }
  }

  const approveDocumentHandle = async ({ approved, note }: { approved: boolean, note?: string }) => {
    setIsLoading(true)
    const status = approved ? "approved" : "rejected"

    try {
      const res = await fetch(`${API_V1_BASE_URL}/documents/${slug}/approval`, {
        method: 'POST',
        cache: 'no-store', // Or 'force-cache' if data is not updated often
        headers: {
          'Authorization': `Bearer ${session.data?.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, note }),
      })

      if (!res.ok) {
        throw new Error(`Failed to ${status} document`)
      }

      toast.success(`Document ${status} successfully`)
      setIsLoading(false)
      router.push('/jagratama/documents-to-review')
    } catch (error) {
      console.error("Error approving document:", error)
      toast.error(`Approval ${status} failed`)
      setIsLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Thumbnail Navigator - only show when file is loaded */}
      <Card className="max-h-[900px] overflow-scroll lg:col-span-2 p-4 shadow-md rounded-xl bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hidden lg:block scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent">
        <PDFThumbnailNavigator
          file={file}
          currentPage={currentPage}
          numPages={numPages}
          onPageChange={handlePageChange}
        />
      </Card>

      {/* Main PDF Viewer */}
      <Card
        className={`${file ? "lg:col-span-7" : "lg:col-span-7"
          } p-4 shadow-md rounded-xl bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700`}
      >
        {file ? (
          <div ref={pdfContainerRef} className="relative">
            <PDFViewer
              ref={pdfViewerRef}
              file={file}
              currentPage={currentPage}
              onDocumentLoadSuccess={handleDocumentLoadSuccess}
              qrPosition={qrPosition}
              onPageChange={handlePageChange}
              onPositionChange={handleQRPositionChange}
              onRemoveSignature={handleRemoveSignature}
              qrData={qrData}
              numPages={numPages}
            />
            <div className="flex justify-between mt-4">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                disabled={currentPage <= 1}
              >
                Previous Page
              </Button>
              <span className="flex items-center text-sm">
                Page {currentPage} of {numPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setCurrentPage(Math.min(currentPage + 1, numPages))}
                disabled={currentPage >= numPages}
              >
                Next Page
              </Button>
            </div>

            {/* Download Button */}
            <div className="mt-4 flex justify-end">
              <Button onClick={handleDownload} className="bg-emerald-500 hover:bg-emerald-600" disabled={isDownloading}>
                <Download className="mr-2 h-4 w-4" />
                {isDownloading ? "Processing..." : "Download Document"}
              </Button>
            </div>
          </div>
        ) : (
          <FileUpload onFileUpload={handleFileUpload} />
        )}
      </Card>

      {/* QR Code Panel */}
      <Card className="lg:col-span-3 p-4 shadow-md rounded-xl bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <QRCodePanel
          currentPage={currentPage}
          onPositionChange={handleQRPositionChange}
          qrPosition={qrPosition}
          onAddSignature={handleAddSignature}
          onRemoveSignature={handleRemoveSignature}
          isPlaced={qrPosition.isPlaced}
        />
        <div className="mt-6">
          <ActionButtons file={file} qrPosition={qrPosition} disabled={!file || !qrPosition.isPlaced} isLoading approveHandle={approveDocumentHandle} />
        </div>
      </Card>
    </div>
  )
}

