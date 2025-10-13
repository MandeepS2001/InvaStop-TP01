import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { saveScan, loadScans, exportScansJson, shareLatestScan } from '../utils/scanHistory';
import { aiPredict, AIPredictionBox } from '../services/ai';

interface Props {
  open: boolean;
  onClose: () => void;
}

const AICaptureModal: React.FC<Props> = ({ open, onClose }) => {
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const uploadInputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<AIPredictionBox[] | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [history, setHistory] = useState(loadScans());

  // Helper function to convert image URL to base64
  const getBase64Image = (imgUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (imgUrl.startsWith('data:')) {
        resolve(imgUrl); // Already base64
        return;
      }
      
      fetch(imgUrl)
        .then(response => response.blob())
        .then(blob => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        })
        .catch(reject);
    });
  };

  const exportToPDF = async () => {
    const { jsPDF } = require('jspdf');
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    
    // Helper functions for better PDF styling
    const addGradientHeader = () => {
      // Main header background
      doc.setFillColor(34, 197, 94);
      doc.rect(0, 0, pageWidth, 50, 'F');
      
      // Subtle gradient effect with darker bottom
      doc.setFillColor(22, 163, 74);
      doc.rect(0, 40, pageWidth, 10, 'F');
    };
    
    const addCard = (x: number, y: number, width: number, height: number, color: number[] = [255, 255, 255]) => {
      // Card shadow
      doc.setFillColor(0, 0, 0, 0.1);
      doc.roundedRect(x + 2, y + 2, width, height, 8, 8, 'F');
      
      // Card background
      doc.setFillColor(color[0], color[1], color[2]);
      doc.roundedRect(x, y, width, height, 8, 8, 'F');
      
      // Card border
      doc.setDrawColor(229, 231, 235);
      doc.setLineWidth(1);
      doc.roundedRect(x, y, width, height, 8, 8, 'S');
    };
    
    const addBadge = (x: number, y: number, text: string, color: number[]) => {
      const textWidth = doc.getTextWidth(text);
      const badgeWidth = textWidth + 16;
      const badgeHeight = 16;
      
      // Badge background
      doc.setFillColor(color[0], color[1], color[2]);
      doc.roundedRect(x, y, badgeWidth, badgeHeight, 8, 8, 'F');
      
      // Badge text
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(text, x + 8, y + 11);
    };
    
    // Create beautiful header
    addGradientHeader();
    
    // Header text with better typography
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('InvaStop', 20, 22);
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'normal');
    doc.text('Plant Identification Report', 20, 35);
    
    // Timestamp with better styling
    doc.setFontSize(10);
    doc.setTextColor(220, 252, 231);
    doc.text(`Generated on ${new Date().toLocaleDateString('en-AU')} at ${new Date().toLocaleTimeString('en-AU')}`, 20, 45);
    
    let yPos = 70;
    
    // Current identification section with detailed layout
    if (top) {
      // Section title
      doc.setTextColor(31, 41, 55);
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text('Current Plant Identification', 20, yPos);
      yPos += 30;
      
      // Main identification card - larger for detailed info
      addCard(20, yPos, pageWidth - 40, 120, [255, 255, 255]);
      
      // Species name with better typography
      doc.setTextColor(17, 24, 39);
      doc.setFontSize(26);
      doc.setFont('helvetica', 'bold');
      const speciesName = top.name.replace(/_/g, ' ').toUpperCase();
      doc.text(speciesName, 30, yPos + 25);
      
      // Confidence badge with better design
      const confidenceColor = top.confidence >= 0.85 ? [34, 197, 94] : 
                             top.confidence >= 0.6 ? [245, 158, 11] : [239, 68, 68];
      addBadge(30, yPos + 35, `${Math.round(top.confidence * 100)}% Trust Level`, confidenceColor);
      
      // Identification details
      doc.setTextColor(75, 85, 99);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text('Identification Details:', 30, yPos + 60);
      
      doc.setFontSize(11);
      doc.text(`• Species: ${speciesName}`, 35, yPos + 75);
      doc.text(`• Confidence: ${Math.round(top.confidence * 100)}%`, 35, yPos + 88);
      doc.text(`• Date: ${new Date().toLocaleDateString('en-AU')}`, 35, yPos + 101);
      doc.text(`• Time: ${new Date().toLocaleTimeString('en-AU')}`, 35, yPos + 114);
      
      // Add current image with better positioning and sizing
      if (previewUrl) {
        try {
          const base64Image = await getBase64Image(previewUrl);
          const img = new Image();
          img.onload = async () => {
            const imgWidth = 100;
            const imgHeight = (img.height * imgWidth) / img.width;
            const imgX = pageWidth - 130;
            const imgY = yPos + 10;
            
            // Image with better border and shadow
            doc.setFillColor(249, 250, 251);
            doc.roundedRect(imgX - 5, imgY - 5, imgWidth + 10, imgHeight + 10, 12, 12, 'F');
            doc.setDrawColor(209, 213, 219);
            doc.setLineWidth(2);
            doc.roundedRect(imgX - 5, imgY - 5, imgWidth + 10, imgHeight + 10, 12, 12, 'S');
            
            doc.addImage(base64Image, 'JPEG', imgX, imgY, imgWidth, imgHeight);
            
            // Continue with history table
            yPos += 140;
            await addHistoryTable(doc, yPos, history, 'Scan History', pageWidth, pageHeight);
            addFooter(doc, pageWidth, pageHeight);
            doc.save('invastop_identification_report.pdf');
          };
          img.src = base64Image;
        } catch (error) {
          console.error('Error loading current image:', error);
          // Continue without image
          yPos += 140;
          await addHistoryTable(doc, yPos, history, 'Scan History', pageWidth, pageHeight);
          addFooter(doc, pageWidth, pageHeight);
          doc.save('invastop_identification_report.pdf');
        }
      } else {
        yPos += 140;
        await addHistoryTable(doc, yPos, history, 'Scan History', pageWidth, pageHeight);
        addFooter(doc, pageWidth, pageHeight);
        doc.save('invastop_identification_report.pdf');
      }
    } else {
      await addHistoryTable(doc, yPos, history, 'InvaStop Scan History', pageWidth, pageHeight);
      addFooter(doc, pageWidth, pageHeight);
      doc.save('invastop_scan_history.pdf');
    }
    
    async function addHistoryTable(doc: any, startY: number, history: any[], title: string = 'Scan History', pageWidth: number, pageHeight: number) {
      let yPos = startY;
      
      // Section title with better spacing
      doc.setTextColor(31, 41, 55);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text(title, 20, yPos);
      yPos += 25;
      
      if (history.length === 0) {
        // Empty state with better design
        addCard(20, yPos, pageWidth - 40, 50, [248, 250, 252]);
        doc.setTextColor(107, 114, 128);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'normal');
        doc.text('No previous scans available', 30, yPos + 30);
        return;
      }
      
      // Table header
      const tableTop = yPos;
      const headerHeight = 30;
      const rowHeight = 25;
      const colWidths = [25, 150, 50, 85, 75]; // #, Species, Trust, Date, Time
      
      // Helper function to draw table header
      const drawTableHeader = (startY: number) => {
        // Header background
        doc.setFillColor(75, 85, 99);
        doc.rect(20, startY, pageWidth - 40, headerHeight, 'F');
        
        // Header text
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        
        let xPos = 25;
        doc.text('#', xPos, startY + 19);
        xPos += colWidths[0];
        
        doc.text('Species', xPos, startY + 19);
        xPos += colWidths[1];
        
        doc.text('Trust %', xPos, startY + 19);
        xPos += colWidths[2];
        
        doc.text('Date', xPos, startY + 19);
        xPos += colWidths[3];
        
        doc.text('Time', xPos, startY + 19);
      };
      
      // Draw initial header
      drawTableHeader(tableTop);
      yPos = tableTop + headerHeight;
      
      // Table rows
      for (const [index, scan] of Array.from(history.entries())) {
        // Check if we need a new page (leave room for header + at least 2 rows)
        if (yPos > pageHeight - 100) {
          doc.addPage();
          yPos = 30;
          
          // Redraw header on new page using helper function
          drawTableHeader(yPos);
          yPos += headerHeight;
        }
        
        // Alternate row colors
        const isEven = index % 2 === 0;
        const rowColor = isEven ? [255, 255, 255] : [248, 250, 252];
        
        // Row background
        doc.setFillColor(rowColor[0], rowColor[1], rowColor[2]);
        doc.rect(20, yPos, pageWidth - 40, rowHeight, 'F');
        
        // Row border
        doc.setDrawColor(229, 231, 235);
        doc.setLineWidth(0.5);
        doc.rect(20, yPos, pageWidth - 40, rowHeight, 'S');
        
        // Row content
        doc.setTextColor(17, 24, 39);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        
        let xPos = 25;
        
        // Row number
        doc.text(String(index + 1), xPos, yPos + 17);
        xPos += colWidths[0];
        
        // Species name
        const speciesName = scan.speciesName.replace(/_/g, ' ');
        doc.text(speciesName, xPos, yPos + 17);
        xPos += colWidths[1];
        
        // Trust level with color
        const trustColor = scan.trust >= 0.85 ? [34, 197, 94] : 
                          scan.trust >= 0.6 ? [245, 158, 11] : [239, 68, 68];
        doc.setTextColor(trustColor[0], trustColor[1], trustColor[2]);
        doc.setFont('helvetica', 'bold');
        doc.text(`${Math.round(scan.trust * 100)}%`, xPos, yPos + 17);
        doc.setFont('helvetica', 'normal');
        xPos += colWidths[2];
        
        // Date
        doc.setTextColor(107, 114, 128);
        doc.text(new Date(scan.timestamp).toLocaleDateString('en-AU'), xPos, yPos + 17);
        xPos += colWidths[3];
        
        // Time
        doc.text(new Date(scan.timestamp).toLocaleTimeString('en-AU'), xPos, yPos + 17);
        
        yPos += rowHeight;
      }
      
      // Table bottom border
      doc.setDrawColor(209, 213, 219);
      doc.setLineWidth(1);
      doc.line(20, yPos, pageWidth - 20, yPos);
    }
    
    function addFooter(doc: any, pageWidth: number, pageHeight: number) {
      // Footer background with gradient
      doc.setFillColor(75, 85, 99);
      doc.rect(0, pageHeight - 40, pageWidth, 40, 'F');
      
      // Footer content with better typography
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Generated by InvaStop Plant Identification System', 20, pageHeight - 25);
      doc.text(`Report generated on ${new Date().toLocaleString('en-AU')}`, 20, pageHeight - 12);
      
      // Website link
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('invastop.com.au', pageWidth - 60, pageHeight - 20);
    }
  };

  if (!open) return null;

  const pickCamera = () => {
    cameraInputRef.current?.click();
  };

  const pickUpload = () => {
    uploadInputRef.current?.click();
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setError(null);
    setResults(null);
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreviewUrl(url);
  };

  const submit = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResults(null);
    try {
      const preds = await aiPredict(file);
      setResults(preds);
      // Save top result to history
      if (preds && preds.length > 0) {
        const top = preds[0];
        // capture a small preview if available
        let preview: string | undefined = undefined;
        if (previewUrl) preview = previewUrl;
        saveScan({
          id: `${Date.now()}-${Math.random().toString(36).slice(2,7)}`,
          timestamp: Date.now(),
          speciesName: top.name,
          trust: top.confidence,
          imageDataUrl: preview,
        });
        setHistory(loadScans());
      }
    } catch (e: any) {
      setError(e?.message || 'Failed to identify.');
    } finally {
      setLoading(false);
    }
  };

  const top = results?.[0];
  const confidencePct = top ? Math.round(top.confidence * 100) : null;
  const lowConfidence = (top?.confidence || 0) < 0.6;
  const confidenceLabel = top
    ? top.confidence >= 0.85
      ? 'High'
      : top.confidence >= 0.6
        ? 'Medium'
        : 'Low'
    : null;

  const speciesSlug = top ? top.name.toLowerCase().replace(/\s+/g, '-').replace(/\//g, '-') : null;

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.85) return 'text-green-600 bg-green-100';
    if (confidence >= 0.6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-6xl rounded-3xl bg-white shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-green-600 to-green-700 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">🔍</span>
              </div>
              <h2 className="text-2xl font-bold text-white">Identify My Plant</h2>
            </div>
            <button 
              onClick={onClose} 
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors duration-200"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-8">
          {!results ? (
            // Initial state - single column for image capture
            <div className="max-w-2xl mx-auto space-y-8">
              {/* Image Preview Area */}
              <div className="relative">
                {previewUrl ? (
                  <div className="relative group">
                    <img 
                      src={previewUrl} 
                      alt="preview" 
                      className="w-full h-80 object-cover rounded-2xl shadow-lg border-4 border-gray-100 transition-transform duration-300 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                ) : (
                  <div className="w-full h-80 rounded-2xl border-2 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center text-gray-500 hover:border-green-400 hover:bg-green-50 transition-all duration-300">
                    <div className="text-6xl mb-4">📸</div>
                    <p className="text-lg font-medium">No image selected</p>
                    <p className="text-sm">Choose a photo to get started</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={pickCamera} 
                  className="group flex items-center justify-center px-8 py-4 rounded-xl bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <span className="mr-2 text-xl">📷</span>
                  Use Camera
                </button>
                <button 
                  onClick={pickUpload} 
                  className="group flex items-center justify-center px-8 py-4 rounded-xl bg-white border-2 border-gray-300 hover:border-green-400 hover:bg-green-50 text-gray-700 font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  <span className="mr-2 text-xl">📁</span>
                  Upload Photo
                </button>
              </div>

              {/* Identify Button */}
              <div className="text-center">
                <button 
                  onClick={submit} 
                  disabled={!file || loading} 
                  className={`group relative px-12 py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 transform ${
                    !file || loading
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white hover:shadow-xl hover:scale-105'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Analyzing...
                    </div>
                  ) : (
                    <>
                      <span className="mr-2">🔬</span>
                      Identify Plant
                      <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
                    </>
                  )}
                </button>
                {!file && (
                  <p className="text-sm text-gray-500 mt-3">Select a photo first to begin identification</p>
                )}
              </div>

              {error && (
                <div className="rounded-xl bg-red-50 border border-red-200 p-4">
                  <div className="flex items-center">
                    <span className="text-red-500 text-xl mr-3">⚠️</span>
                    <div>
                      <h4 className="font-semibold text-red-800">Identification Failed</h4>
                      <p className="text-red-700 text-sm">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Hidden inputs */}
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={onFileChange}
              />
              <input
                ref={uploadInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onFileChange}
              />
            </div>
          ) : (
            // Results state - enhanced 2-column layout
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Left: Image, controls, and history */}
              <div className="space-y-6">
                <div className="relative">
                  {previewUrl && (
                    <div className="relative group">
                      <img 
                        src={previewUrl} 
                        alt="preview" 
                        className="w-full h-80 object-cover rounded-2xl shadow-lg border-4 border-gray-100" 
                      />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1">
                        <span className="text-sm font-medium text-gray-700">Your Photo</span>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* New Photo Buttons */}
                <div className="bg-gray-50 rounded-2xl p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">Try Another Photo</h3>
                  <div className="flex gap-3">
                    <button 
                      onClick={pickCamera} 
                      className="flex-1 flex items-center justify-center px-3 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition-colors duration-200 text-sm"
                    >
                      <span className="mr-2">📷</span>
                      Camera
                    </button>
                    <button 
                      onClick={pickUpload} 
                      className="flex-1 flex items-center justify-center px-3 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition-colors duration-200 text-sm"
                    >
                      <span className="mr-2">📁</span>
                      Upload
                    </button>
                  </div>
                </div>

                {/* Scan History - Always Visible */}
                <div className="bg-white rounded-2xl border border-gray-200 p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="mr-2">📚</span>
                    Scan History
                  </h4>
                  {history.length === 0 ? (
                    <div className="text-center py-6">
                      <div className="text-3xl mb-2">📸</div>
                      <p className="text-gray-600 text-sm">No previous scans</p>
                      <p className="text-gray-500 text-xs">Your identification history will appear here</p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {history.map((h) => (
                        <div key={h.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                          {h.imageDataUrl && (
                            <img 
                              src={h.imageDataUrl} 
                              alt="prev" 
                              className="h-10 w-10 object-cover rounded-md border border-gray-200 flex-shrink-0" 
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 text-sm truncate">{h.speciesName}</div>
                            <div className="text-xs text-gray-600">
                              Trust {(h.trust*100).toFixed(0)}% · {new Date(h.timestamp).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Hidden inputs */}
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={onFileChange}
                />
                <input
                  ref={uploadInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onFileChange}
                />
              </div>

              {/* Right: Results and actions */}
              <div className="space-y-6">
                {/* AI Prediction Card */}
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border-2 border-gray-100 p-6 shadow-lg">
                  {top ? (
                    <div>
                      {/* Species Name */}
                      <div className="text-center mb-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{top.name}</h3>
                        <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${getConfidenceColor(top.confidence)}`}>
                          <span className="mr-2">
                            {top.confidence >= 0.85 ? '✅' : top.confidence >= 0.6 ? '⚠️' : '❓'}
                          </span>
                          Trust Level: {confidencePct}% ({confidenceLabel})
                        </div>
                      </div>

                      {/* Low Confidence Warning */}
                      {lowConfidence && (
                        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                          <div className="flex items-start">
                            <span className="text-yellow-600 text-xl mr-3 mt-0.5">⚠️</span>
                            <div>
                              <h4 className="font-semibold text-yellow-800 mb-2">Low Trust Level</h4>
                              <p className="text-yellow-700 text-sm mb-3">
                                Try a clearer photo (single plant, in focus, good lighting) for better results.
                              </p>
                              <p className="text-yellow-700 text-sm font-medium">Other possibilities:</p>
                              <ul className="list-disc pl-5 mt-1 text-yellow-700 text-sm">
                                {results.slice(1, 4).map((r, i) => (
                                  <li key={i}>{r.name} ({Math.round(r.confidence*100)}%)</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Species Information Card */}
                      <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl border-2 border-green-200 p-6">
                        <div className="text-center">
                          <div className="text-6xl mb-4">🌿</div>
                          <h4 className="text-xl font-bold text-gray-900 mb-2">Plant Identified!</h4>
                          <p className="text-gray-600 mb-4">
                            Your photo has been successfully analyzed by our AI system.
                          </p>
                          <div className="inline-flex items-center px-4 py-2 bg-white rounded-full shadow-sm">
                            <span className="text-sm font-medium text-gray-700">
                              Analysis complete • {new Date().toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-6xl mb-4">🤔</div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Species Detected</h3>
                      <p className="text-gray-600">Try another angle or closer photo for better results.</p>
                    </div>
                  )}
                </div>

                {/* Quick Next Steps */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="mr-2">💡</span>
                    Quick Next Steps
                  </h4>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-3 mt-1">•</span>
                      <span className="text-gray-700 text-sm">If trust level is Medium/Low, take another photo closer and well‑lit.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-3 mt-1">•</span>
                      <span className="text-gray-700 text-sm">Open the species profile for control and prevention tips.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-3 mt-1">•</span>
                      <span className="text-gray-700 text-sm">Report a sighting if you suspect it's invasive in your area.</span>
                    </li>
                  </ul>
                </div>

                {/* Additional Actions */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Additional Actions</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => shareLatestScan()} 
                      className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 hover:from-purple-200 hover:to-purple-300 text-purple-700 transition-all duration-300 transform hover:scale-105"
                    >
                      <span className="text-2xl mb-2">📤</span>
                      <span className="text-sm font-medium">Share</span>
                    </button>
                    <button 
                      onClick={() => exportToPDF()} 
                      className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 transition-all duration-300 transform hover:scale-105"
                    >
                      <span className="text-2xl mb-2">💾</span>
                      <span className="text-sm font-medium">Export PDF</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced How it works section */}
          <div className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200 p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">ℹ️</span>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">How the AI scan works</h4>
                <p className="text-gray-700 leading-relaxed">
                  Your photo is securely scanned for leaf, flower, and stem patterns, then matched to known species—no images are stored. Results include a trust level to guide accuracy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICaptureModal;