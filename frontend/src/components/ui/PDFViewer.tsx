import React, { useState, useRef, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCw,
  RotateCcw,
  Download,
  FileText,
} from "lucide-react";

interface PDFViewerProps {
  url: string;
  onLoad?: (data: { totalPages: number }) => void;
  onError?: (error: any) => void;
  currentPage?: number;
  zoom?: number;
  rotation?: number;
}

export default function PDFViewer({
  url,
  onLoad,
  onError,
  currentPage = 1,
  zoom = 100,
  rotation = 0,
}: PDFViewerProps) {
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;

    const loadPDF = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Dynamic import of PDF.js
        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

        const loadingTask = pdfjsLib.getDocument(url);
        const pdf = await loadingTask.promise;

        if (mounted) {
          setPdfDoc(pdf);
          setTotalPages(pdf.numPages);
          setIsLoading(false);
          onLoad?.({ totalPages: pdf.numPages });
        }
      } catch (err) {
        console.error("Error loading PDF:", err);
        if (mounted) {
          setError("Failed to load PDF");
          setIsLoading(false);
          onError?.(err);
        }
      }
    };

    if (url) {
      loadPDF();
    }

    return () => {
      mounted = false;
    };
  }, [url, onLoad, onError]);

  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return;

    const renderPage = async () => {
      try {
        const page = await pdfDoc.getPage(currentPage);
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext("2d");
        if (!context) return;

        const viewport = page.getViewport({ scale: zoom / 100, rotation });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        await page.render(renderContext).promise;
      } catch (err) {
        console.error("Error rendering PDF page:", err);
        setError("Failed to render PDF page");
      }
    };

    renderPage();
  }, [pdfDoc, currentPage, zoom, rotation]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Loading PDF...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <FileText size={48} className="text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">{error}</p>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <Download size={16} />
            Download PDF
          </a>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full h-full overflow-auto bg-gray-100">
      <div className="flex justify-center p-4">
        <canvas
          ref={canvasRef}
          className="shadow-lg"
          style={{
            maxWidth: "100%",
            height: "auto",
          }}
        />
      </div>
    </div>
  );
}
