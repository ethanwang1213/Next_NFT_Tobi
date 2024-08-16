import * as pdfjsLib from "pdfjs-dist/webpack.mjs";
import React, { useEffect, useRef, useState } from "react";

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const PdfToImage: React.FC<{ pdfUrl: string }> = ({ pdfUrl }) => {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const loadPdf = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;

        const page = await pdf.getPage(1);
        const originalViewport = page.getViewport({ scale: 1 });

        const desiredWidth = 200;
        const desiredHeight = 180;
        const scale = Math.min(
          desiredWidth / originalViewport.width,
          desiredHeight / originalViewport.height,
        );
        const viewport = page.getViewport({ scale });

        const canvas = canvasRef.current;
        const context = canvas?.getContext("2d");

        if (canvas && context) {
          canvas.width = viewport.width;
          canvas.height = viewport.height;

          const renderContext = {
            canvasContext: context,
            viewport: viewport,
          };
          await page.render(renderContext).promise;

          const imgData = canvas.toDataURL("image/png");
          setImgSrc(imgData);
        }
      } catch (error) {
        console.error("Error loading PDF: ", error);
      }
    };

    loadPdf();
  }, [pdfUrl]);

  return (
    <div>
      {imgSrc ? (
        <img
          src={imgSrc}
          alt="PDF Page"
          className="w-full h-[150px] object-cover"
        />
      ) : (
        <canvas ref={canvasRef} style={{ display: "none" }} />
      )}
    </div>
  );
};

export default PdfToImage;
