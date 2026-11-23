import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const pdfPath = path.join(process.cwd(), 'public', 'downloads', 'AlFalah-Prayer-Timetable.pdf');
    if (fs.existsSync(pdfPath)) {
      const fileBuffer = fs.readFileSync(pdfPath);
      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'inline; filename="AlFalah-Prayer-Timetable.pdf"',
          'Cache-Control': 'public, max-age=86400, stale-while-revalidate=43200',
        },
      });
    }

    // Fallback: redirect to public download path
    return NextResponse.redirect(new URL('/downloads/AlFalah-Prayer-Timetable.pdf', req.url));
  } catch (error) {
    console.error('Error serving prayer timetable PDF:', error);
    return NextResponse.redirect(new URL('/downloads/AlFalah-Prayer-Timetable.pdf', req.url));
  }
}
