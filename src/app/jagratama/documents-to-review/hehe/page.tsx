"use client";

import React, { useState, useRef, useEffect } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Document, Page, pdfjs } from 'react-pdf';

import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`

export default function App() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const [numPages, setNumPages] = useState(1);
  const [targetPage, setTargetPage] = useState(0);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfSize, setPdfSize] = useState({ width: 0, height: 0 });

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);

  const resizerRef = useRef<HTMLDivElement>(null);

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = imageSize.width;
    const startHeight = imageSize.height;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = Math.max(50, startWidth + (moveEvent.clientX - startX));
      const newHeight = Math.max(50, startHeight + (moveEvent.clientY - startY));
      setImageSize({ width: newWidth, height: newHeight });
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file) {
      const url = URL.createObjectURL(file);

      setPdfUrl(url);
      setPdfFile(file);

      const pdfBytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(pdfBytes);
      setNumPages(pdfDoc.getPageCount());
    };
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file) {
      setImageUrl(URL.createObjectURL(file))
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        setImageSize({ width: img.width, height: img.height });
      };
      img.onerror = (error) => {
        console.error("Error loading image:", error);
      };
    };
  };

  const handleExport = async () => {
    if (!pdfFile || !imageUrl) return;

    const pdfBytes = await pdfFile.arrayBuffer();
    const imageBytes = await fetch(imageUrl).then((res) => res.arrayBuffer());

    const pdfDoc = await PDFDocument.load(pdfBytes);
    const image = await pdfDoc.embedPng(imageBytes);

    const page = pdfDoc.getPage(targetPage);
    const { width, height } = page.getSize();

    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();

    // Ukuran gambar di layar
    const displayImageWidth = imageSize.width;
    const displayImageHeight = imageSize.height;

    // Hitung posisi relatif terhadap ukuran PDF
    const scaleX = width / rect.width;
    const scaleY = height / rect.height;

    const x = position.x * scaleX;
    const y = (rect.height - position.y - displayImageHeight) * scaleY;

    // Ukuran gambar yang akan dimasukkan ke PDF (opsional bisa pakai skala juga)
    const pdfImageWidth = displayImageWidth * scaleX;
    const pdfImageHeight = displayImageHeight * scaleY;

    page.drawImage(image, {
      x,
      y,
      width: pdfImageWidth,
      height: pdfImageHeight,
    });

    const pdfBytesModified = await pdfDoc.save();
    const blob = new Blob([pdfBytesModified], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'signed.pdf';
    link.click();
  };

  const handleSend = async () => {
    if (!pdfFile || !imageUrl) return;

    const pdfBytes = await pdfFile.arrayBuffer();
    const imageBytes = await fetch(imageUrl).then((res) => res.arrayBuffer());

    const pdfDoc = await PDFDocument.load(pdfBytes);
    const image = await pdfDoc.embedPng(imageBytes);

    const page = pdfDoc.getPage(targetPage);
    const { width, height } = page.getSize();

    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const scaledY = (position.y / rect.height) * height;
    const scaledX = (position.x / rect.width) * width;

    // Ukuran gambar di layar
    const displayImageWidth = imageSize.width;
    const displayImageHeight = imageSize.height;

    page.drawImage(image, {
      x: scaledX,
      y: height - scaledY - displayImageHeight,
      width: displayImageWidth,
      height: displayImageHeight,
    });

    const pdfBytesModified = await pdfDoc.save();
    const blob = new Blob([pdfBytesModified], { type: 'application/pdf' });

    const formData = new FormData();
    formData.append('file', blob, 'signed.pdf');

    try {
      const response = await fetch('https://your-api-endpoint.com/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log('Success:', data);
      alert('PDF berhasil dikirim!');
    } catch (error) {
      console.error('Error sending PDF:', error);
      alert('Gagal mengirim PDF.');
    }
  };


  const handlePrevPage = () => {
    if (targetPage > 0) setTargetPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (targetPage < numPages - 1) setTargetPage((prev) => prev + 1);
  };

  const getPageSize = async () => {
    if (pdfUrl) {
      try {
        const pdfBytes = await fetch(pdfUrl).then((res) => res.arrayBuffer());
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const page = pdfDoc.getPage(0);
        const { width, height } = page.getSize();

        setPdfSize({ width, height });
      } catch (error) {
        console.error("Error loading PDF:", error);
      }
    }
  }

  useEffect(() => {
    getPageSize();
  }, [pdfUrl]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();

      let x = e.clientX - rect.left - 50;
      let y = e.clientY - rect.top - 50;

      const imageWidth = imageSize.width;
      const imageHeight = imageSize.height;

      x = Math.max(0, Math.min(x, rect.width - imageWidth));
      y = Math.max(0, Math.min(y, rect.height - imageHeight));

      setPosition({ x, y });
    };

    const handleMouseUp = () => {
      if (isDragging) setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);


  return (
    <div className="">
      <div
        id="pdf-container"
        ref={containerRef}
        className="relative border border-gray-300 w-[700px] mx-auto mb-4"
      >
        {pdfUrl && (
          <Document file={pdfUrl} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
            <Page pageNumber={targetPage + 1} width={700} />
          </Document>
        )}

        {imageUrl && (
          <>
            <img
              src={imageUrl}
              alt="Signature"
              style={{
                position: 'absolute',
                zIndex: 10,
                left: position.x,
                top: position.y,
                width: imageSize.width,
                height: imageSize.height,
                cursor: isDragging ? 'grabbing' : 'grab',
              }}
              onMouseDown={() => setIsDragging(true)}
            />
            <div
              onMouseDown={handleResizeStart}
              style={{
                position: 'absolute',
                left: position.x + imageSize.width - 10,
                top: position.y + imageSize.height - 10,
                width: "15px",
                height: "15px",
                background: 'blue',
                cursor: 'nwse-resize',
                zIndex: 10,
              }}
            />
          </>
        )
        }
      </div>
      <br />
      <br />

      {pdfUrl && (
        <div className="mb-4 flex items-center space-x-2">
          <button
            onClick={handlePrevPage}
            disabled={targetPage === 0}
            className="px-2 py-1 border rounded bg-gray-200 disabled:opacity-50"
          >
            ⬅️ Prev
          </button>
          <span>Halaman {targetPage + 1} / {numPages}</span>
          <button
            onClick={handleNextPage}
            disabled={targetPage === numPages - 1}
            className="px-2 py-1 border rounded bg-gray-200 disabled:opacity-50"
          >
            Next ➡️
          </button>
        </div>
      )}

      <br />
      <br />
      <br />
      <h1 className="text-2xl font-bold mb-4">PDF Signature Editor</h1>

      <input
        type="file"
        accept="application/pdf"
        onChange={handlePdfUpload}
        ref={fileInputRef}
        className="mb-4"
      />

      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        ref={imageInputRef}
        className="mb-4"
      />

      <br />
      <br />
      <br />

      <button
        onClick={handleExport}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Simpan PDF dengan Tanda Tangan
      </button>
      <button
        onClick={handleSend}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 ml-2"
      >
        Kirim ke API
      </button>

    </div>
  );
}
