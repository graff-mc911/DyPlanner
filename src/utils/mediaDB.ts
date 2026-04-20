const DB_NAME = 'focusone_media';
const DB_VERSION = 2;
const STORE = 'files';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'id' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export type MediaSourceType = 'audio' | 'video' | 'youtube' | 'url';

export interface StoredMedia {
  id: string;
  title: string;
  type: MediaSourceType;
  blob?: Blob;
  url?: string;
  thumbnail?: string;
}

export async function saveMedia(item: StoredMedia): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).put(item);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function loadAllMedia(): Promise<StoredMedia[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const req = tx.objectStore(STORE).getAll();
    req.onsuccess = () => resolve(req.result as StoredMedia[]);
    req.onerror = () => reject(req.error);
  });
}

export async function deleteMedia(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export function extractYouTubeId(input: string): string | null {
  const raw = input.trim();
  const direct = raw.match(/^([a-zA-Z0-9_-]{11})$/);
  if (direct) return direct[1];

  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    return null;
  }

  const host = parsed.hostname.toLowerCase();
  const path = parsed.pathname.replace(/\/+$/, '');
  const candidates: string[] = [];

  if (host === 'youtu.be' || host === 'www.youtu.be') {
    const shortId = path.split('/').filter(Boolean)[0];
    if (shortId) candidates.push(shortId);
  }

  const isYouTubeHost =
    /(^|\.)youtube\.com$/.test(host) || /(^|\.)youtube-nocookie\.com$/.test(host);

  if (isYouTubeHost) {
    const fromQuery = parsed.searchParams.get('v');
    if (fromQuery) candidates.push(fromQuery);

    const segments = path.split('/').filter(Boolean);
    if (segments.length >= 2 && ['embed', 'shorts', 'live', 'v'].includes(segments[0])) {
      candidates.push(segments[1]);
    }
  }

  for (const candidate of candidates) {
    const clean = candidate.trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(clean)) {
      return clean;
    }
  }

  return null;
}
