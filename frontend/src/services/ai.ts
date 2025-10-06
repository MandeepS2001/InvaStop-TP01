export interface AIPredictionBox {
  name: string;
  class: number;
  confidence: number;
  box: { x1: number; y1: number; x2: number; y2: number };
}

export async function aiPredict(file: File, model?: string): Promise<AIPredictionBox[]> {
  // Enforce client-side size/type constraints to avoid 413 on serverless
  const MAX_BYTES = 4 * 1024 * 1024; // 4MB (Vercel payload practical limit)
  const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
  if (!allowedTypes.has(file.type)) {
    throw new Error(`Unsupported image type: ${file.type}. Please use JPEG, PNG or WEBP.`);
  }
  if (file.size > MAX_BYTES) {
    throw new Error(`Image is too large (${(file.size/1024/1024).toFixed(2)}MB). Please choose a photo under 4MB.`);
  }
  // Allow runtime override via multiple window keys for quick local testing
  const w = (window as any) || {};
  const runtimeOverride = (w.__AI_API_URL || w.AI_API_URL || w.AT_API_URL) as string | undefined;
  // Prefer backend proxy. In production, use the deployed backend domain; locally use localhost.
  const isProd = typeof window !== 'undefined' && window.location.hostname !== 'localhost';
  const envApi = (process.env.REACT_APP_API_URL || '').replace(/\/$/, '');
  const prodBase = (runtimeOverride as string) || (envApi ? `${envApi}/api/v1/ai` : 'https://invastopbackend.vercel.app/api/v1/ai');
  const devBase = (runtimeOverride as string) || (process.env.REACT_APP_AI_API_URL || 'http://localhost:8000/api/v1/ai');
  const apiBase = isProd ? prodBase : devBase;
  const form = new FormData();
  form.append('img', file, file.name);
  if (model) form.append('model', model);

  const resp = await fetch(`${apiBase}/predict`, {
    method: 'POST',
    body: form
  });

  if (!resp.ok) {
    const text = await resp.text().catch(() => '');
    throw new Error(`AI predict failed (${resp.status}): ${text}`);
  }
  return (await resp.json()) as AIPredictionBox[];
}


