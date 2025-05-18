import React, { useEffect, useRef, useState } from 'react';
import { Loader } from 'rsuite';
import * as pdfjsLib from 'pdfjs-dist';
import 'pdfjs-dist/web/pdf_viewer.css';

// Set the worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const PdfJsViewer = ({ url, fileName }) => {
  const canvasRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [pdfDoc, setPdfDoc] = useState(null);

  // Load the PDF document
  useEffect(() => {
    const loadPdf = async () => {
      try {
        setIsLoading(true);
        
        // Load the PDF document
        const loadingTask = pdfjsLib.getDocument(url);
        const pdf = await loadingTask.promise;
        
        setPdfDoc(pdf);
        setNumPages(pdf.numPages);
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading PDF:', err);
        setError(err);
        setIsLoading(false);
      }
    };

    loadPdf();
  }, [url]);

  // Render the current page
  useEffect(() => {
    const renderPage = async () => {
      if (!pdfDoc) return;

      try {
        // Get the page
        const page = await pdfDoc.getPage(currentPage);
        
        // Set the scale
        const viewport = page.getViewport({ scale });
        
        // Prepare canvas
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        // Render the PDF page
        const renderContext = {
          canvasContext: context,
          viewport: viewport
        };
        
        await page.render(renderContext).promise;
      } catch (err) {
        console.error('Error rendering page:', err);
        setError(err);
      }
    };

    renderPage();
  }, [pdfDoc, currentPage, scale]);

  // Handle page navigation
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < numPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Handle zoom
  const zoomIn = () => {
    setScale(prevScale => Math.min(prevScale + 0.2, 3.0));
  };

  const zoomOut = () => {
    setScale(prevScale => Math.max(prevScale - 0.2, 0.5));
  };

  return (
    <div className="pdf-js-viewer">
      {isLoading ? (
        <div className="pdf-loading">
          <Loader size="md" content="Loading PDF..." vertical />
        </div>
      ) : error ? (
        <div className="pdf-error">
          <p>Error loading PDF: {error.message}</p>
          <p>Please try downloading the file instead.</p>
        </div>
      ) : (
        <>
          <div className="pdf-controls">
            <div className="pdf-navigation">
              <button 
                onClick={goToPreviousPage} 
                disabled={currentPage <= 1}
                className="pdf-nav-btn"
              >
                Previous
              </button>
              <span className="pdf-page-info">
                Page {currentPage} of {numPages}
              </span>
              <button 
                onClick={goToNextPage} 
                disabled={currentPage >= numPages}
                className="pdf-nav-btn"
              >
                Next
              </button>
            </div>
            <div className="pdf-zoom">
              <button onClick={zoomOut} className="pdf-zoom-btn">-</button>
              <span className="pdf-zoom-level">{Math.round(scale * 100)}%</span>
              <button onClick={zoomIn} className="pdf-zoom-btn">+</button>
            </div>
          </div>
          <div className="pdf-container">
            <canvas ref={canvasRef} className="pdf-canvas" />
          </div>
        </>
      )}
    </div>
  );
};

export default PdfJsViewer;
