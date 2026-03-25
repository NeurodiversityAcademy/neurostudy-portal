import { readFile } from 'fs/promises';
import path from 'path';
import { NextRequest } from 'next/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: { file: string } }
) {
  const requestedFile = params.file;

  // Only serve known PDF files from this route.
  if (!requestedFile.endsWith('.pdf') || requestedFile.includes('/')) {
    return new Response('Not found', { status: 404 });
  }

  const filePath = path.join(
    process.cwd(),
    'src',
    'app',
    'documents',
    requestedFile
  );

  try {
    const fileBuffer = await readFile(filePath);
    return new Response(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${requestedFile}"`,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch {
    return new Response('Not found', { status: 404 });
  }
}
