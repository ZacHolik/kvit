import { renderToStream } from '@react-pdf/renderer';

export async function renderPdfToBuffer(document: React.ReactElement) {
  const stream = await renderToStream(document);
  const chunks: Buffer[] = [];

  await new Promise<void>((resolve, reject) => {
    stream.on('data', (chunk) => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    });
    stream.on('end', resolve);
    stream.on('error', reject);
  });

  return Buffer.concat(chunks);
}
