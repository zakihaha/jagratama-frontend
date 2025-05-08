"use client"

import { Document, Page } from "react-pdf"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { FileIcon } from "lucide-react"

interface PDFThumbnailNavigatorProps {
  filePath: string
  currentPage: number
  numPages: number
  onPageChange: (page: number) => void
}

export const PDFThumbnailNavigator = ({ filePath, currentPage, numPages, onPageChange }: PDFThumbnailNavigatorProps) => {
  const pageCount = numPages || 0

  if (!filePath) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 p-4 text-center">
        <FileIcon className="h-12 w-12 mb-3 opacity-50" />
        <p className="text-sm">Upload a PDF to view page thumbnails here</p>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Thumbnails */}
        <Document
          file={filePath}
          loading={<div className="h-20 w-full animate-pulse bg-slate-200 dark:bg-slate-700 rounded"></div>}
        >
          {Array.from(new Array(pageCount), (_, index) => {
            // Only render thumbnails within the visible range
            return (
              <div
                key={`thumbnail-${index + 1}`}
                className={cn(
                  "mb-3 cursor-pointer rounded border-2 transition-all hover:opacity-80",
                  currentPage === index + 1
                    ? "border-emerald-500 shadow-md"
                    : "border-transparent hover:border-slate-300 dark:hover:border-slate-600",
                )}
                onClick={() => onPageChange(index + 1)}
              >
                <div className="relative">
                  <Page
                    pageNumber={index + 1}
                    width={150}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    loading={<Skeleton className="h-[212px] w-[150px] rounded" />}
                  />
                  <div className="absolute bottom-0 right-0 bg-slate-800/70 text-white text-xs px-2 py-1 rounded-tl">
                    {index + 1}
                  </div>
                  {currentPage === index + 1 && (
                    <div className="absolute inset-0 bg-emerald-500/10 pointer-events-none"></div>
                  )}
                </div>
              </div>
            )
          })}
        </Document>
      
    </div>
  )
}
