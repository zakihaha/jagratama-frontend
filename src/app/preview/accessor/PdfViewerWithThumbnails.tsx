"use client";

import { Minus, Plus } from "lucide-react";
import { useEffect, useState, useRef } from "react";

interface PdfViewerWithThumbnailsProps {
  url: string;
}

export default function PdfViewerWithThumbnails({
  url,
}: PdfViewerWithThumbnailsProps) {
  const [pdf, setPdf] = useState<any>(null);
  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(1.5);
  const containerRef = useRef<HTMLDivElement>(null);
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    if (url) {
      const parts = url.split("/");
      setFileName(parts[parts.length - 1]);
    }
  }, [url]);

  useEffect(() => {
    const loadPdf = async () => {
      const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

      const loadingTask = pdfjsLib.getDocument(url);
      const loadedPdf = await loadingTask.promise;
      setPdf(loadedPdf);
      setNumPages(loadedPdf.numPages);
    };

    loadPdf();
  }, [url]);

  const scrollToPage = (pageNumber: number) => {
    const el = document.getElementById(`page-${pageNumber}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(0.5, prev - 0.25));
  };

  const zoomIn = () => {
    setScale((prev) => Math.min(3, prev + 0.25));
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="lg:w-1/4 hidden lg:block overflow-y-auto space-y-4 p-4 bg-white border-x border-b border-[#E5E7EB] rounded-bl-3xl">
        <p>Preview File</p>
        {pdf &&
          Array.from({ length: numPages }, (_, i) => i + 1).map((pageNum) => (
            <div key={pageNum} className="flex flex-row gap-4">
              <p className="text-center text-sm mt-1">{pageNum} .</p>
              <div
                onClick={() => scrollToPage(pageNum)}
                className="border cursor-pointer rounded-md p-1 hover:border-[#20939C]"
              >
                <PageThumbnail pdf={pdf} pageNumber={pageNum} />
              </div>
            </div>
          ))}
      </div>

      <div
        ref={containerRef}
        className="lg:w-3/4 overflow-y-scroll overflow-x-auto p-6 space-y-8 border-x md:border-l border-[#E5E7EB] lg:border-0"
        style={{ maxHeight: "100vh" }}
      >
        <div className="flex flex-col md:flex-row gap-2 justify-between items-center mb-4 text-sm lg:text-base font-normal">
          <p>{fileName}</p>
          <div className="flex items-center space-x-2">
            <button
              onClick={zoomOut}
              className="p-[6px] border border-[#E5E7EB] rounded-[8px] hover:bg-gray-100"
            >
              <Minus className="w-5 h-5" />
            </button>
            <span className="w-12 text-center p-[6px] border border-[#E5E7EB] rounded-[12px] hover:bg-gray-100">{Math.round(scale * 100)}%</span>
            <button
              onClick={zoomIn}
              className="p-[6px] border border-[#E5E7EB] rounded-[8px] hover:bg-gray-100"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
        {pdf &&
          Array.from({ length: numPages }, (_, i) => i + 1).map((pageNum) => (
            <div key={pageNum} id={`page-${pageNum}`}>
              <PageCanvas pdf={pdf} pageNumber={pageNum} scale={scale} />
            </div>
          ))}
      </div>
    </div>
  );
}

function PageCanvas({
  pdf,
  pageNumber,
  scale,
}: {
  pdf: any;
  pageNumber: number;
  scale: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!pdf) return;

    (async () => {
      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale });

      const canvas = canvasRef.current;
      if (!canvas) return;
      const context = canvas.getContext("2d")!;
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({ canvasContext: context, viewport }).promise;
    })();
  }, [pdf, pageNumber, scale]);

  return (
    <div className="flex justify-center overflow-auto">
      <canvas ref={canvasRef} style={{ display: "block" }} />
    </div>
  );
}

function PageThumbnail({ pdf, pageNumber }: { pdf: any; pageNumber: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!pdf) return;

    (async () => {
      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale: 0.3 });

      const canvas = canvasRef.current;
      if (!canvas) return;
      const context = canvas.getContext("2d")!;
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({ canvasContext: context, viewport }).promise;
    })();
  }, [pdf, pageNumber]);

  return <canvas ref={canvasRef} className="w-full" />;
}
