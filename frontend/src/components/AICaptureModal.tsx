import React, { useRef, useState } from 'react';
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-4 shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">AI Plant Identifier</h2>
          <button onClick={onClose} className="rounded-md p-2 hover:bg-gray-100">✕</button>
        </div>

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

          {results && (
            <div className="rounded-lg border p-3">
              {top ? (
                <div>
                  <div className="text-lg font-bold">{top.name}</div>
                  <div className="text-sm text-gray-600">Confidence: {confidencePct}% ({confidenceLabel})</div>
                  {lowConfidence && (
                    <div className="mt-2 rounded-md bg-yellow-50 text-yellow-800 p-2 text-sm">
                      Confidence is low. Try a clearer photo (single plant, in focus, good lighting). Here are other possibilities:
                      <ul className="list-disc pl-5 mt-1">
                        {results.slice(1, 4).map((r, i) => (
                          <li key={i}>{r.name} ({Math.round(r.confidence*100)}%)</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-sm text-gray-600">No species detected. Try another angle or closer photo.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AICaptureModal;


