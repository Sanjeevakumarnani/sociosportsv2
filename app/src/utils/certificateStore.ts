/** Certificate storage: JSON file on server only (no localStorage). */

import { API_URL } from '../services/api';

export interface CertificateRecord {
  certificateId: string;
  fullName: string;
  sportName: string;
  imageBase64: string;
  location?: string;
  submittedAt: string;
}

export function imageToDataUrl(value: string): string {
  if (!value) return '';
  if (value.startsWith('data:')) return value;
  return `data:image/jpeg;base64,${value}`;
}

export async function getCertificateById(certificateId: string): Promise<CertificateRecord | null> {
  try {
    const res = await fetch(`${API_URL}/certificates/${encodeURIComponent(certificateId)}`);
    if (res.status === 404) return null;
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function saveCertificate(record: Omit<CertificateRecord, 'submittedAt'>): Promise<void> {
  const res = await fetch(`${API_URL}/certificates`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(record),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any).error || res.statusText || 'Failed to save');
  }
}

export async function getAllCertificates(): Promise<CertificateRecord[]> {
  try {
    const res = await fetch(`${API_URL}/certificates`);
    if (!res.ok) return [];
    const arr = await res.json();
    if (!Array.isArray(arr)) return [];
    return arr.sort(
      (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
  } catch {
    return [];
  }
}
