export interface AIPredictionBox {
  name: string;
  class: number;
  confidence: number;
  box: { x1: number; y1: number; x2: number; y2: number };
}

export async function aiPredict(file: File, model?: string): Promise<AIPredictionBox[]> {
  // Allow runtime override via multiple window keys for quick local testing
  const w = (window as any) || {};
  const runtimeOverride = (w.__AI_API_URL || w.AI_API_URL || w.AT_API_URL) as string | undefined;
  // Prefer backend proxy in production: /api/v1/ai
  const isProd = typeof window !== 'undefined' && window.location.hostname !== 'localhost';
  const apiBase = isProd
    ? '/api/v1/ai' // backend proxy
    : (runtimeOverride || process.env.REACT_APP_AI_API_URL || 'http://localhost:8000');
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


