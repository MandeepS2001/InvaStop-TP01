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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-4xl rounded-2xl bg-white p-4 shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">Identify My Plant</h2>
          <button onClick={onClose} className="rounded-md p-2 hover:bg-gray-100">✕</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Image and controls */}
          <div className="space-y-3">
            {previewUrl ? (
              <img src={previewUrl} alt="preview" className="w-full rounded-lg border" />
            ) : (
              <div className="w-full h-40 rounded-lg border-2 border-dashed flex items-center justify-center text-gray-500">
                No image selected
              </div>
            )}

            <div className="flex gap-2">
              <button onClick={pickCamera} className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700">Use Camera</button>
              <button onClick={pickUpload} className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200">Upload Photo</button>
              {/* Dedicated camera input (mobile will open camera) */}
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={onFileChange}
              />
              {/* Dedicated upload input (no capture attribute so file picker opens) */}
              <input
                ref={uploadInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onFileChange}
              />
            </div>

            <div className="flex items-center gap-2">
              <button onClick={submit} disabled={!file || loading} className={`px-4 py-2 rounded-lg text-white ${(!file||loading)?'bg-green-400':'bg-green-600 hover:bg-green-700'}`}>
                {loading ? 'Identifying…' : 'Identify'}
              </button>
              {!file && <span className="text-xs text-gray-500">Select a photo first</span>}
            </div>

            {error && <div className="rounded-md bg-red-50 text-red-700 p-3 text-sm">{error}</div>}
          </div>

          {/* Results panel */}
          {results && (
            <div className="rounded-lg border p-3">
              {top ? (
                <div>
                  <div className="text-lg font-bold">{top.name}</div>
                  <div className="text-sm text-gray-600">Trust Level: {confidencePct}% ({confidenceLabel})</div>
                  {lowConfidence && (
                    <div className="mt-2 rounded-md bg-yellow-50 text-yellow-800 p-2 text-sm">
                      Trust level is low. Try a clearer photo (single plant, in focus, good lighting). Here are other possibilities:
                      <ul className="list-disc pl-5 mt-1">
                        {results.slice(1, 4).map((r, i) => (
                          <li key={i}>{r.name} ({Math.round(r.confidence*100)}%)</li>
                        ))}
                      </ul>
                    </div>
                  )}

                {/* Next steps */}
                <div className="mt-3 grid gap-2">
                  {speciesSlug && (
                    <Link
                      to={`/species/${speciesSlug}`}
                      onClick={onClose}
                      className="inline-flex items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
                    >
                      View Species Profile
                    </Link>
                  )}
                  <Link
                    to={`/map`}
                    onClick={onClose}
                    className="inline-flex items-center justify-center rounded-md bg-green-600 px-3 py-2 text-white hover:bg-green-700"
                  >
                    Report a Sighting
                  </Link>
                  <div className="mt-2 rounded-md bg-gray-50 p-2 text-sm text-gray-700">
                    Quick next steps:
                    <ul className="list-disc pl-5 mt-1">
                      <li>If trust level is Medium/Low, take another photo closer and well‑lit.</li>
                      <li>Open the species profile for control and prevention tips.</li>
                      <li>Report a sighting if you suspect it’s invasive in your area.</li>
                    </ul>
                  </div>
                  {/* Share / Export */}
                  <div className="flex gap-2 mt-1">
                    <button onClick={() => shareLatestScan()} className="rounded-md bg-indigo-600 px-3 py-2 text-white hover:bg-indigo-700">Share</button>
                    <button onClick={() => {
                      const blob = new Blob([exportScansJson()], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url; a.download = 'invastop_scans.json'; a.click();
                      URL.revokeObjectURL(url);
                    }} className="rounded-md bg-gray-200 px-3 py-2 hover:bg-gray-300">Export</button>
                    <button onClick={() => setHistoryOpen((v) => !v)} className="ml-auto rounded-md border px-3 py-2 hover:bg-gray-50">{historyOpen ? 'Hide' : 'View'} History</button>
                  </div>
                </div>

                {/* History list */}
                {historyOpen && (
                  <div className="mt-3 rounded-lg border p-3">
                    <div className="font-semibold mb-2">My Scan History</div>
                    {history.length === 0 ? (
                      <div className="text-sm text-gray-600">No scans yet.</div>
                    ) : (
                      <ul className="space-y-2 max-h-56 overflow-auto">
                        {history.map((h) => (
                          <li key={h.id} className="flex items-center gap-3 border rounded-md p-2">
                            {h.imageDataUrl && <img src={h.imageDataUrl} alt="prev" className="h-12 w-12 object-cover rounded" />}
                            <div className="text-sm">
                              <div className="font-medium">{h.speciesName}</div>
                              <div className="text-gray-600">Trust Level {(h.trust*100).toFixed(0)}% · {new Date(h.timestamp).toLocaleString()}</div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-sm text-gray-600">No species detected. Try another angle or closer photo.</div>
            )}
          </div>
          )}

        {/* How it works - simple explainer */}
        <details className="mt-3 rounded-lg border p-3 text-sm text-gray-700">
          <summary className="cursor-pointer font-semibold text-gray-900">How the AI scan works</summary>
          <div className="mt-2 space-y-2">
            <p>
              Your photo is sent securely to our model running on a protected server. It looks for patterns
              in leaves, flowers, stems and shapes, then compares them with known species.
            </p>
            <p>
              The result includes a trust level. High trust level means the pattern closely matches a species; lower
              trust levels suggest it might be another plant, so try a clearer photo or compare alternatives.
            </p>
            <p>
              We do not store your photos for this feature; they are processed to generate the prediction and discarded.
            </p>
          </div>
        </details>
        </div>
      </div>
    </div>
  );
};

export default AICaptureModal;


