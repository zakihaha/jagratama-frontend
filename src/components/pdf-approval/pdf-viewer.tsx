"use client"

import type React from "react"

import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import { QRCodeSVG } from "qrcode.react"
import type { QRPosition } from "./approval-letter-manager"
import { Skeleton } from "@/components/ui/skeleton"
import { Maximize2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PDFDocument } from "pdf-lib"
import QRCode from "qrcode"

import "react-pdf/dist/esm/Page/AnnotationLayer.css"
import "react-pdf/dist/esm/Page/TextLayer.css"

interface PDFViewerProps {
  filePath: string
  currentPage: number
  numPages: number
  onDocumentLoadSuccess: ({ numPages }: { numPages: number }) => void
  qrPosition: QRPosition
  onPageChange: (page: number) => void
  onPositionChange: (position: Partial<QRPosition>) => void
  onRemoveSignature: () => void
  qrData: string
}

export const PDFViewer = forwardRef<any, PDFViewerProps>(
  (
    {
      filePath,
      currentPage,
      numPages,
      onDocumentLoadSuccess,
      qrPosition,
      onPageChange,
      onPositionChange,
      onRemoveSignature,
      qrData,
    },
    ref,
  ) => {
    const [scale, setScale] = useState(1)
    const [width, setWidth] = useState<number | undefined>(undefined)
    const [loading, setLoading] = useState(true)
    const [isResizing, setIsResizing] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    const [startPos, setStartPos] = useState({ x: 0, y: 0 })
    const [startScale, setStartScale] = useState(1)
    const [pdfDocument, setPdfDocument] = useState<any>(null)
    const [pageSize, setPageSize] = useState({ width: 0, height: 0 })
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const qrRef = useRef<HTMLDivElement>(null)
    const qrContentRef = useRef<HTMLDivElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const pageRef = useRef<HTMLDivElement>(null)
    const qrCodeSize = 100 // Base QR code size in pixels

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
      generateSignedPDF: async () => {
        return await generateSignedPDF()
      },
    }))

    useEffect(() => {
      // Set up the worker for PDF.js using a CDN URL
      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`
    }, [])

    useEffect(() => {
      const updateWidth = () => {
        const container = document.querySelector(".pdf-container")
        if (container) {
          setWidth(container.clientWidth)
        }
      }

      updateWidth()
      window.addEventListener("resize", updateWidth)
      return () => window.removeEventListener("resize", updateWidth)
    }, [])

    // Update page size when the page renders
    const handlePageRenderSuccess = (page: any) => {
      if (page && page.target) {
        const { width: pageWidth, height: pageHeight } = page.target
        if (pageWidth && pageHeight) {
          setPageSize({ width: pageWidth, height: pageHeight })
        }
      }
    }

    const handleLoadSuccess = (pdf: any) => {
      setLoading(false)
      setPdfDocument(pdf)
      onDocumentLoadSuccess(pdf)
    }

    const handleLoadError = (error: Error) => {
      console.error("Error loading PDF:", error)
      setLoading(false)
    }

    // Convert percentage position to pixels for display
    const getPixelPosition = () => {
      return {
        x: (qrPosition.xPercent / 100) * pageSize.width,
        y: (qrPosition.yPercent / 100) * pageSize.height,
      }
    }

    // Update position when pixel position changes
    useEffect(() => {
      if (pageSize.width > 0 && pageSize.height > 0) {
        const pixelPos = getPixelPosition()
        setPosition({ x: pixelPos.x, y: pixelPos.y })
      }
    }, [qrPosition.xPercent, qrPosition.yPercent, pageSize])

    // Generate a signed PDF with the QR code embedded - using your approach
    const generateSignedPDF = async () => {
      if (!pdfDocument || !qrPosition.isPlaced) {
        throw new Error("PDF document or signature not available")
      }

      try {
        const myFile = await fetch(filePath).then((res) => res.blob())
        if (!myFile) {
          throw new Error("File not found")
        }

        // Get the original PDF as an ArrayBuffer
        const arrayBuffer = await myFile.arrayBuffer()

        // Use pdf-lib for PDF manipulation
        const pdfDoc = await PDFDocument.load(arrayBuffer)

        // Get the target page
        const pages = pdfDoc.getPages()
        if (qrPosition.page > pages.length) {
          throw new Error("Selected page does not exist in the document")
        }

        const targetPage = pages[qrPosition.page - 1]
        const { width: pdfWidth, height: pdfHeight } = targetPage.getSize()

        // Calculate the scaled size for the QR code
        const scaledSize = Math.round(qrCodeSize * qrPosition.scale)

        // Generate a high-quality QR code using qrcode library
        // Use a higher resolution for better quality
        const highResSize = scaledSize * 4 // 4x the display size for higher resolution

        // Generate QR code with high error correction and margin for better scanning
        const qrDataUrl = await QRCode.toDataURL(qrData, {
          // errorCorrectionLevel: "H", // Highest error correction level
          margin: 1, // Small margin around the QR code
          width: 1000,
          type: 'image/png',
          color: {
            dark: "#000000", // Pure black for better contrast
            light: "#ffffff", // Pure white for better contrast
          },
          // rendererOpts: {
          //   quality: 1.0, // Highest quality
          // },
        })

        // Get the container dimensions
        const container = containerRef.current
        if (!container) throw new Error("Container not found")

        const rect = container.getBoundingClientRect()

        // Calculate scale factors
        const scaleX = pdfWidth / rect.width
        const scaleY = pdfHeight / rect.height

        // Calculate position in PDF coordinates
        const x = position.x * scaleX
        const y = (rect.height - position.y - scaledSize) * scaleY

        // Calculate size in PDF coordinates
        const pdfImageWidth = scaledSize * scaleX
        const pdfImageHeight = scaledSize * scaleY

        // Embed the QR code image in the PDF
        const qrImageEmbed = await pdfDoc.embedPng(qrDataUrl)

        // Add QR code to the target page
        targetPage.drawImage(qrImageEmbed, {
          x,
          y,
          width: pdfImageWidth,
          height: pdfImageHeight,
        })

        // Save the PDF
        const modifiedPdfBytes = await pdfDoc.save()

        // Return as blob
        return new Blob([modifiedPdfBytes], { type: "application/pdf" })
      } catch (error) {
        console.error("Error generating PDF:", error)

        // Fallback: return the original PDF if there's an error
        // const myFile = await fetch(filePath).then((res) => res.blob())
        // if (!myFile) {
        //   throw new Error("File not found")
        // }
        // return new Blob([await myFile.arrayBuffer()], { type: "application/pdf" })
      }
    }

    // Custom drag implementation
    const handleMouseDown = (e: React.MouseEvent) => {
      if (qrPosition.isPlaced && qrPosition.page === currentPage) {
        e.preventDefault()
        setIsDragging(true)

        const container = containerRef.current
        if (!container) return

        const rect = container.getBoundingClientRect()
        setStartPos({
          x: e.clientX - rect.left - position.x,
          y: e.clientY - rect.top - position.y,
        })
      }
    }

    useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging || !containerRef.current) return

        const container = containerRef.current
        const rect = container.getBoundingClientRect()

        // Calculate new position
        let x = e.clientX - rect.left - startPos.x
        let y = e.clientY - rect.top - startPos.y

        // Get QR code size
        const qrElement = qrRef.current
        const qrWidth = qrElement ? qrElement.offsetWidth : qrCodeSize * qrPosition.scale
        const qrHeight = qrElement ? qrElement.offsetHeight : qrCodeSize * qrPosition.scale

        // Constrain to container bounds
        x = Math.max(0, Math.min(x, rect.width - qrWidth))
        y = Math.max(0, Math.min(y, rect.height - qrHeight))

        // Update position
        setPosition({ x, y })

        // Convert to percentage
        const xPercent = (x / pageSize.width) * 100
        const yPercent = (y / pageSize.height) * 100

        // Update QR position
        onPositionChange({ xPercent, yPercent })
      }

      const handleMouseUp = () => {
        setIsDragging(false)
      }

      if (isDragging) {
        document.addEventListener("mousemove", handleMouseMove)
        document.addEventListener("mouseup", handleMouseUp)
      }

      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }, [isDragging, startPos, pageSize, qrPosition.scale, onPositionChange])

    const startResizing = (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsResizing(true)
      setStartPos({ x: e.clientX, y: e.clientY })
      setStartScale(qrPosition.scale)
    }

    useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
        if (isResizing) {
          e.preventDefault()
          const dx = e.clientX - startPos.x
          const scaleFactor = 0.01
          const newScale = Math.max(0.2, Math.min(2, startScale + dx * scaleFactor))
          
          onPositionChange({ scale: newScale })
        }
      }

      const handleMouseUp = () => {
        setIsResizing(false)
      }

      if (isResizing) {
        document.addEventListener("mousemove", handleMouseMove)
        document.addEventListener("mouseup", handleMouseUp)
      }

      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }, [isResizing, startPos, startScale, onPositionChange])

    // Initialize pageSize with reasonable defaults if not set
    useEffect(() => {
      if (pageSize.width === 0 && width) {
        // Use a typical aspect ratio for PDF pages (A4 = 1:1.414)
        setPageSize({ width: width, height: width * 1.414 })
      }
    }, [width, pageSize.width])

    return (
      <div
        className="pdf-container relative border rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-900"
        ref={containerRef}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Skeleton className="h-[600px] w-full rounded-lg" />
          </div>
        )}
        <Document
          file={filePath}
          onLoadSuccess={handleLoadSuccess}
          onLoadError={handleLoadError}
          className="flex justify-center"
          loading={
            <div className="flex items-center justify-center h-[600px]">
              <Skeleton className="h-[600px] w-full rounded-lg" />
            </div>
          }
        >
          <div className="relative" ref={pageRef}>
            <Page
              pageNumber={currentPage}
              width={width}
              scale={scale}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              onRenderSuccess={handlePageRenderSuccess}
              loading={
                <div className="flex items-center justify-center h-[600px] w-full">
                  <Skeleton className="h-[600px] w-full rounded-lg" />
                </div>
              }
            />

            {/* Only show QR code on the selected page when it's been placed */}
            {qrPosition.isPlaced && qrPosition.page === currentPage && (
              <div
                ref={qrRef}
                className="absolute cursor-move"
                style={{
                  left: `${position.x}px`,
                  top: `${position.y}px`,
                  touchAction: "none",
                }}
                onMouseDown={handleMouseDown}
                onTouchStart={(e) => {
                  const touch = e.touches[0]
                  handleMouseDown({
                    preventDefault: () => e.preventDefault(),
                    clientX: touch.clientX,
                    clientY: touch.clientY,
                  } as React.MouseEvent)
                }}
              >
                <div
                  ref={qrContentRef}
                  className="relative border-2 border-emerald-500 rounded p-2 bg-white shadow-lg group"
                  style={{
                    transform: `scale(${qrPosition.scale})`,
                    transformOrigin: "top left",
                  }}
                >
                  <QRCodeSVG
                    value={qrData || "default"}
                    size={qrCodeSize}
                    level="H"
                    bgColor="#ffffff"
                    fgColor="#000000"
                  />

                  {/* Resize handle - positioned relative to the scaled container */}
                  <div
                    className="absolute top-0 right-0 -mt-2 -mr-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center cursor-se-resize shadow-md"
                    style={{
                      transform: `scale(${1 / qrPosition.scale})`,
                      transformOrigin: "center",
                    }}
                    onMouseDown={startResizing}
                    onTouchStart={(e) => {
                      e.stopPropagation()
                      const touch = e.touches[0]
                      startResizing({
                        preventDefault: () => e.preventDefault(),
                        stopPropagation: () => e.stopPropagation(),
                        clientX: touch.clientX,
                        clientY: touch.clientY,
                      } as React.MouseEvent)
                    }}
                  >
                    <Maximize2 className="h-3 w-3 text-white" />
                  </div>

                  {/* Remove button - positioned relative to the scaled container */}
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-0 left-0 -mt-2 -ml-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{
                      transform: `scale(${1 / qrPosition.scale})`,
                      transformOrigin: "center",
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      onRemoveSignature()
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Document>
      </div>
    )
  },
)

PDFViewer.displayName = "PDFViewer"
