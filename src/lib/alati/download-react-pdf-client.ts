'use client';

import type { ReactElement } from 'react';

export async function downloadReactPdfClient(doc: ReactElement, filename: string) {
  const { pdf } = await import('@react-pdf/renderer');
  const blob = await pdf(doc).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
