export interface SavedScan {
  id: string;
  timestamp: number; // epoch ms
  speciesName: string;
  trust: number; // 0-1
  imageDataUrl?: string; // optional preview
}

const STORAGE_KEY = 'invastop_scan_history_v1';
const MAX_ENTRIES = 50;

export function loadScans(): SavedScan[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedScan[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveScan(entry: SavedScan) {
  const list = loadScans();
  // prepend newest
  const updated = [entry, ...list].slice(0, MAX_ENTRIES);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function clearScans() {
  localStorage.removeItem(STORAGE_KEY);
}

export function exportScansJson(): string {
  const list = loadScans();
  return JSON.stringify(list, null, 2);
}

export async function shareLatestScan(): Promise<boolean> {
  const [latest] = loadScans();
  if (!latest) return false;
  const text = `InvaStop scan: ${latest.speciesName} — Trust Level ${(latest.trust * 100).toFixed(0)}% (on ${new Date(latest.timestamp).toLocaleString()})`;
  if ((navigator as any).share) {
    try {
      await (navigator as any).share({ title: 'InvaStop Scan Result', text });
      return true;
    } catch {
      return false;
    }
  }
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}


