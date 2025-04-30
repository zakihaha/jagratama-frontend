"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UploadIcon, FileTextIcon } from "lucide-react"

interface FileUploadProps {
  onFileUpload: (file: File) => void
}

export const FileUpload = ({ onFileUpload }: FileUploadProps) => {
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type === "application/pdf") {
        onFileUpload(file)
      } else {
        alert("Please upload a PDF file.")
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.type === "application/pdf") {
        onFileUpload(file)
      } else {
        alert("Please upload a PDF file.")
      }
    }
  }

  const handleButtonClick = () => {
    inputRef.current?.click()
  }

  return (
    <div className="w-full">
      <div
        className={`flex flex-col items-center justify-center h-[500px] border-2 border-dashed rounded-lg p-6 transition-colors ${
          dragActive
            ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
            : "border-slate-300 dark:border-slate-600"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="rounded-full bg-slate-100 dark:bg-slate-800 p-4">
            <FileTextIcon className="h-10 w-10 text-emerald-500" />
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-lg">Upload your PDF</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Drag and drop your file here or click to browse
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500">Supported format: PDF</p>
          </div>
          <Button onClick={handleButtonClick} className="mt-4 bg-emerald-500 hover:bg-emerald-600">
            <UploadIcon className="mr-2 h-4 w-4" />
            Select File
          </Button>
          <Input ref={inputRef} type="file" accept="application/pdf" onChange={handleChange} className="hidden" />
        </div>
      </div>
    </div>
  )
}
