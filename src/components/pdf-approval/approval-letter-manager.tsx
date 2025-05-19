"use client"

import { useState, useRef, useEffect } from "react"
import { PDFViewer } from "./pdf-viewer"
import { QRCodePanel } from "./qr-code-panel"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRightCircle } from "lucide-react"
import { toast } from "sonner"
import { API_V1_BASE_URL } from "@/lib/config"
import { getSession, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { PDFThumbnailNavigator } from "./pdf-thumbnail-navigator"
import { formatDate } from "@/lib/utils/formatDate"
import { DocumentReviewDetailModel } from "@/types/document"

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
  documentData: DocumentReviewDetailModel
}

export const ApprovalLetterManager = ({ slug, documentData }: Params) => {
  const session = useSession()
  const router = useRouter()

  // const [file, setFile] = useState<File | null>(null)
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

  const [formInput, setFormInput] = useState({
    approved: "approved",
    note: "",
  })

  const pdfContainerRef = useRef<HTMLDivElement>(null)
  const pdfViewerRef = useRef<any>(null)


  const handleFormInputChange = (field: keyof FormData, value: string) => {
    setFormInput(prev => ({ ...prev, [field]: value }));
  };

  // Generate QR data once when file changes
  useEffect(() => {
    const date = formatDate(new Date().toISOString())
    const qrText = `Dokumen: ${documentData.title}\nNama: ${session.data?.user.name}\nEmail: ${session.data?.user.email}\nTimestamp: ${date}`
    setQrData(qrText)
  }, [session.data])

  const handleFileUpload = (uploadedFile: File) => {
    // setFile(uploadedFile)
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
    if (!documentData.requires_signature) return
    setQrPosition((prev) => ({ ...prev, isPlaced: true, page: currentPage }))
    toast("Signature Added")
  }

  const handleRemoveSignature = () => {
    if (!documentData.requires_signature) return
    setQrPosition((prev) => ({ ...prev, isPlaced: false }))
    toast("Signature Removed")
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleDownload = async () => {
    // if (!file) return

    setIsDownloading(true)

    try {
      let pdfBlob: Blob

      // Set a timeout to prevent UI freezing
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("PDF generation timed out")), 30000)
      })

      const myFile = await fetch(documentData.file).then((res) => res.blob())
      if (!myFile) {
        throw new Error("File not found")
      }

      // If signature is placed, generate signed PDF
      if (qrPosition.isPlaced && pdfViewerRef.current && typeof pdfViewerRef.current.generateSignedPDF === "function") {
        pdfBlob = (await Promise.race([pdfViewerRef.current.generateSignedPDF(), timeoutPromise])) as Blob
      } else {
        // Otherwise just use the original file
        pdfBlob = new Blob([await myFile.arrayBuffer()], { type: "application/pdf" })
      }

      // Create a download URL for the file
      const url = URL.createObjectURL(pdfBlob)

      // Create a temporary anchor element
      const a = document.createElement("a")
      a.href = url
      const fileName = documentData.file.split('/').pop()?.replace(/\.[^/.]+$/, "") || "document";
      a.download = fileName + "_signed.pdf";
      document.body.appendChild(a)
      a.click()

      // Clean up
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast("Download Complete")
    } catch (error) {
      console.error("Error generating PDF:", error)
      toast("Download Failed")
    } finally {
      setIsDownloading(false)
    }
  }

  const approveDocumentHandle = async () => {
    const approved = formInput.approved === "approved"
    const note = formInput.note

    console.log("Approval Data:", { approved, note });

    if (!approved && !note) {
      toast.error("Masukkan catatan untuk menolak dokumen")
      return
    }
    
    if (!documentData.is_reviewer && (approved === false)) return

    if (documentData.requires_signature && !qrPosition.isPlaced) {
      toast.error("Berikan tanda tangan pada dokumen sebelum menyetujui")
      return
    }

    setIsLoading(true)
    const status = approved ? "approved" : "rejected"

    try {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("PDF generation timed out")), 30000)
      })

      let fileId: number | null = null
      if (documentData.requires_signature) {
        const myFile = await fetch(documentData.file).then((res) => res.blob())
        if (!myFile) {
          throw new Error("File not found")
        }

        let pdfBlob: Blob

        if (qrPosition.isPlaced && pdfViewerRef.current && typeof pdfViewerRef.current.generateSignedPDF === "function") {
          pdfBlob = (await Promise.race([pdfViewerRef.current.generateSignedPDF(), timeoutPromise])) as Blob
        } else {
          // Otherwise just use the original file
          pdfBlob = new Blob([await myFile.arrayBuffer()], { type: "application/pdf" })
        }

        if (!pdfBlob) {
          throw new Error("Failed to generate signed PDF")
        }

        // Create a FormData object to send the PDF file
        const formData = new FormData()
        formData.append("file", pdfBlob, `${documentData.title}_signed.pdf`)

        const resFile = await fetch(`${API_V1_BASE_URL}/upload?type=document`, {
          method: 'POST',
          cache: 'no-store', // Or 'force-cache' if data is not updated often
          headers: {
            'Authorization': `Bearer ${session.data?.accessToken}`,
          },
          body: formData,
        })

        if (!resFile.ok) {
          throw new Error("Failed to upload signed PDF")
        }
        const fileData = await resFile.json()
        fileId = fileData.data.id
      }

      const res = await fetch(`${API_V1_BASE_URL}/documents/${slug}/approval`, {
        method: 'POST',
        cache: 'no-store', // Or 'force-cache' if data is not updated often
        headers: {
          'Authorization': `Bearer ${session.data?.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, note, file_id: fileId }),
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

  // if session is not authenticated, re get session
  useEffect(() => {
    if (session.status === "unauthenticated") {
      getSession()
    }
  }, [session.status])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Thumbnail Navigator - only show when file is loaded */}
      <Card className="max-h-[900px] overflow-scroll lg:col-span-2 p-4 shadow-md rounded-none bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hidden lg:block scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent">
        <PDFThumbnailNavigator
          filePath={documentData.file}
          currentPage={currentPage}
          numPages={numPages}
          onPageChange={handlePageChange}
        />
      </Card>

      {/* Main PDF Viewer */}
      <Card
        className={`${documentData.file ? "lg:col-span-7" : "lg:col-span-7"
          } p-4 shadow-md rounded-none lg:mt-8 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700`}
      >
        <div ref={pdfContainerRef} className="relative">
          <PDFViewer
            ref={pdfViewerRef}
            filePath={documentData.file}
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
        </div>
      </Card>

      {/* QR Code Panel */}
      <Card className="lg:col-span-3 p-4 shadow-md rounded-none bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <QRCodePanel
          currentPage={currentPage}
          onPositionChange={handleQRPositionChange}
          qrPosition={qrPosition}
          onAddSignature={handleAddSignature}
          onRemoveSignature={handleRemoveSignature}
          onFormInputChange={handleFormInputChange}
          formInputValue={formInput}
          isPlaced={qrPosition.isPlaced}
          document={documentData}
        />
        <div className="mt-6">
          <Button
            className="!bg-[#20939C] !text-xs lg:!text-sm !font-normal !rounded-[8px] !py-2 lg:!py-6 w-full"
            type="submit"
            disabled={
              !documentData.file 
              || (!qrPosition.isPlaced && documentData.requires_signature && (formInput.approved === "approved")) 
              || (formInput.approved === "rejected" && formInput.note === "")
              || isLoading}
            onClick={approveDocumentHandle}
          >
            Setujui
            <ArrowRightCircle />
          </Button>
        </div>
      </Card>
    </div>
  )
}

