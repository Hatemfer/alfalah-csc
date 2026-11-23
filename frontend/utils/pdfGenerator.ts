import { getMonthSchedule, DayPrayerSchedule, to12Hour } from './prayerTimes';

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

interface PDFPageOptions {
  monthIndex: number; // 0 - 11
  year: number;
  use24Hour?: boolean;
}

// Helper to escape PDF text strings
function escapePDFText(str: string): string {
  return str.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

/**
 * Builds a vector PDF stream content for one monthly timetable page (A4: 595.28 x 841.89 pt)
 */
function generateMonthPageStream(opts: PDFPageOptions): string {
  const { monthIndex, year, use24Hour = false } = opts;
  const monthSchedule = getMonthSchedule(year, monthIndex);
  const monthName = MONTH_NAMES[monthIndex];
  const firstDay = monthSchedule[0];
  const lastDay = monthSchedule[monthSchedule.length - 1];
  const hijriSpan = `${firstDay?.hijriShort || ''} – ${lastDay?.hijriShort || ''} AH`;

  const cmds: string[] = [];

  // 1. Decorative Header Box (Deep Navy to Sky Blue: 545pt wide, 95pt high)
  const leftX = 25;
  const topY = 816;
  const boxWidth = 545.28;
  const boxHeight = 90;

  // Background rect for header (Navy #075985)
  cmds.push('q');
  cmds.push('0.03 0.35 0.52 rg'); // RGB: #075985
  cmds.push(`${leftX} ${topY - boxHeight} ${boxWidth} ${boxHeight} re f`);

  // Gold accent bar at bottom of header (Gold #F59E0B)
  cmds.push('0.96 0.62 0.04 rg');
  cmds.push(`${leftX} ${topY - boxHeight} ${boxWidth} 3.5 re f`);
  cmds.push('Q');

  // Header Text
  cmds.push('BT');
  cmds.push('1 1 1 rg'); // White text
  cmds.push('/F2 15 Tf'); // Helvetica-Bold
  cmds.push(`${leftX + 20} ${topY - 26} Td`);
  cmds.push(`(${escapePDFText('AL FALAH COMMUNITY SUPPORT CENTRE')}) Tj`);

  cmds.push('/F1 8 Tf'); // Helvetica
  cmds.push('0 -13 Td');
  cmds.push(`(${escapePDFText('89 Tindal Street, Balsall Heath, Birmingham (B12 9QU) • Charity Reg: 1150221')}) Tj`);

  cmds.push('/F2 12 Tf');
  cmds.push('0 -19 Td');
  cmds.push(`(${escapePDFText('PRAYER TIMETABLE & CONGREGATION SCHEDULE')}) Tj`);

  // Gold Month Name on the right side of header
  cmds.push('0.98 0.88 0.38 rg'); // Soft gold
  cmds.push('/F2 13 Tf');
  cmds.push('0 -18 Td');
  cmds.push(`(${escapePDFText(`${monthName.toUpperCase()} ${year}  •  ${hijriSpan}`)}) Tj`);
  cmds.push('ET');

  // 2. Table Column Dimensions
  // Total printable width: 545.28
  // Cols: Date(35), Day(32), Hijri(48), Fajr(72), Sunrise(46), Dhuhr(72), Asr(72), Maghrib(72), Isha(76) = 525pt + 20pt padding
  const cols = [
    { title: 'Date', width: 34, align: 'left' },
    { title: 'Day', width: 32, align: 'center' },
    { title: 'Hijri', width: 52, align: 'center' },
    { title: 'Fajr', width: 73, align: 'center', sub: 'Beg / Jam' },
    { title: 'Sunrise', width: 44, align: 'center', sub: '—' },
    { title: 'Dhuhr', width: 73, align: 'center', sub: 'Beg / Jam' },
    { title: 'Asr', width: 73, align: 'center', sub: 'Beg / Jam' },
    { title: 'Maghrib', width: 73, align: 'center', sub: 'Beg / Jam' },
    { title: 'Isha', width: 75, align: 'center', sub: 'Beg / Jam' },
  ];

  const tableTopY = topY - boxHeight - 14;
  const headerRowHeight = 22;

  // Draw Table Header Background (Sky 700: #0369A1)
  cmds.push('q');
  cmds.push('0.01 0.41 0.63 rg');
  cmds.push(`${leftX} ${tableTopY - headerRowHeight} ${boxWidth} ${headerRowHeight} re f`);
  cmds.push('Q');

  // Table Header Labels
  cmds.push('BT');
  cmds.push('1 1 1 rg');
  let curX = leftX;
  for (const c of cols) {
    cmds.push('/F2 8 Tf');
    const titleX = curX + (c.align === 'center' ? c.width / 2 - 10 : 4);
    cmds.push(`1 0 0 1 ${titleX} ${tableTopY - 12} Tm`);
    cmds.push(`(${escapePDFText(c.title)}) Tj`);

    if (c.sub && c.sub !== '—') {
      cmds.push('/F1 6.5 Tf');
      const subX = curX + (c.width / 2 - 12);
      cmds.push(`1 0 0 1 ${subX} ${tableTopY - 19} Tm`);
      cmds.push(`(${escapePDFText(c.sub)}) Tj`);
    }
    curX += c.width;
  }
  cmds.push('ET');

  // 3. Render 28-31 Day Rows
  const rowHeight = 16.5;
  let curRowY = tableTopY - headerRowHeight;

  monthSchedule.forEach((d, idx) => {
    const isFriday = d.isFriday;
    const bgY = curRowY - rowHeight;

    // Row Background Color
    cmds.push('q');
    if (isFriday) {
      cmds.push('0.91 0.96 0.93 rg'); // Emerald tint for Friday
    } else if (idx % 2 === 1) {
      cmds.push('0.97 0.98 0.99 rg'); // Subtle zebra
    } else {
      cmds.push('1 1 1 rg'); // White
    }
    cmds.push(`${leftX} ${bgY} ${boxWidth} ${rowHeight} re f`);

    // Subtle bottom border line
    cmds.push('0.88 0.91 0.94 RG');
    cmds.push('0.5 w');
    cmds.push(`${leftX} ${bgY} m ${leftX + boxWidth} ${bgY} l S`);

    // Vertical column divider lines
    let divX = leftX;
    for (const c of cols) {
      divX += c.width;
      cmds.push(`${divX} ${bgY} m ${divX} ${bgY + rowHeight} l S`);
    }
    cmds.push('Q');

    // Row Text
    cmds.push('BT');
    if (isFriday) {
      cmds.push('0.06 0.45 0.23 rg'); // Dark green for Friday text
    } else {
      cmds.push('0.08 0.12 0.18 rg'); // Dark slate text
    }

    let cellX = leftX;

    // Date
    cmds.push(isFriday ? '/F2 8 Tf' : '/F1 8 Tf');
    cmds.push(`1 0 0 1 ${cellX + 4} ${bgY + 5} Tm`);
    cmds.push(`(${escapePDFText(String(d.day))}) Tj`);
    cellX += cols[0].width;

    // Day of week
    cmds.push(isFriday ? '/F2 8 Tf' : '/F1 8 Tf');
    cmds.push(`1 0 0 1 ${cellX + 7} ${bgY + 5} Tm`);
    cmds.push(`(${escapePDFText(d.dayOfWeek)}) Tj`);
    cellX += cols[1].width;

    // Hijri
    cmds.push('/F1 7 Tf');
    cmds.push(`1 0 0 1 ${cellX + 4} ${bgY + 5} Tm`);
    cmds.push(`(${escapePDFText(d.hijriShort)}) Tj`);
    cellX += cols[2].width;

    // Helper for prayer cell (format adhan / iqamah)
    const formatPrayerPair = (adhan: string, iqamah: string) => {
      const a = use24Hour ? adhan : to12Hour(adhan).replace(/\s[AP]M/, '');
      const i = iqamah === '—' ? '—' : (use24Hour ? iqamah : to12Hour(iqamah).replace(/\s[AP]M/, ''));
      return `${a} / ${i}`;
    };

    // Fajr
    cmds.push('/F1 7.5 Tf');
    cmds.push(`1 0 0 1 ${cellX + 6} ${bgY + 5} Tm`);
    cmds.push(`(${escapePDFText(formatPrayerPair(d.fajr.adhan, d.fajr.iqamah))}) Tj`);
    cellX += cols[3].width;

    // Sunrise
    cmds.push('/F1 7.5 Tf');
    const sunStr = use24Hour ? d.sunrise : to12Hour(d.sunrise).replace(/\s[AP]M/, '');
    cmds.push(`1 0 0 1 ${cellX + 7} ${bgY + 5} Tm`);
    cmds.push(`(${escapePDFText(sunStr)}) Tj`);
    cellX += cols[4].width;

    // Dhuhr
    cmds.push('/F1 7.5 Tf');
    cmds.push(`1 0 0 1 ${cellX + 6} ${bgY + 5} Tm`);
    cmds.push(`(${escapePDFText(formatPrayerPair(d.dhuhr.adhan, d.dhuhr.iqamah))}) Tj`);
    cellX += cols[5].width;

    // Asr
    cmds.push('/F1 7.5 Tf');
    cmds.push(`1 0 0 1 ${cellX + 6} ${bgY + 5} Tm`);
    cmds.push(`(${escapePDFText(formatPrayerPair(d.asr.adhan, d.asr.iqamah))}) Tj`);
    cellX += cols[6].width;

    // Maghrib
    cmds.push('/F1 7.5 Tf');
    cmds.push(`1 0 0 1 ${cellX + 6} ${bgY + 5} Tm`);
    cmds.push(`(${escapePDFText(formatPrayerPair(d.maghrib.adhan, d.maghrib.iqamah))}) Tj`);
    cellX += cols[7].width;

    // Isha
    cmds.push('/F1 7.5 Tf');
    cmds.push(`1 0 0 1 ${cellX + 6} ${bgY + 5} Tm`);
    cmds.push(`(${escapePDFText(formatPrayerPair(d.isha.adhan, d.isha.iqamah))}) Tj`);
    cellX += cols[8].width;

    cmds.push('ET');

    curRowY -= rowHeight;
  });

  // 4. Footer Section (Jumu'ah Box + Guidelines)
  const footerTop = curRowY - 14;
  const footerHeight = 65;

  cmds.push('q');
  // Light blue container for footer
  cmds.push('0.94 0.97 1 rg');
  cmds.push('0.73 0.85 0.95 RG');
  cmds.push('1 w');
  cmds.push(`${leftX} ${footerTop - footerHeight} ${boxWidth} ${footerHeight} re B`);
  cmds.push('Q');

  cmds.push('BT');
  cmds.push('0.01 0.41 0.63 rg');
  cmds.push('/F2 9.5 Tf');
  cmds.push(`${leftX + 16} ${footerTop - 18} Td`);
  cmds.push(`(${escapePDFText('FRIDAY JUMU\'AH CONGREGATION: Khutbah & Salah at 13:00 (1:00 PM) sharp in English & Arabic')}) Tj`);

  cmds.push('0.2 0.25 0.3 rg');
  cmds.push('/F1 8 Tf');
  cmds.push('0 -14 Td');
  cmds.push(`(${escapePDFText('• Please arrive 10 minutes prior to Iqamah to perform wudu and pray Tahiyyat al-Masjid.')}) Tj`);

  cmds.push('0 -12 Td');
  cmds.push(`(${escapePDFText('• Considerate Parking: Please respect our Tindal Street neighbours and avoid blocking access or bus routes.')}) Tj`);

  cmds.push('0 -12 Td');
  cmds.push(`(${escapePDFText('• Live Screen & Mobile Updates: mawaqit.net • Website & Donations: https://alfalahcommunity.org.uk')}) Tj`);
  cmds.push('ET');

  return cmds.join('\n');
}

/**
 * Builds a complete multi-page or single-page PDF binary buffer in pure TypeScript (zero dependencies).
 */
export function buildPrayerTimetablePDF(pages: PDFPageOptions[]): Buffer {
  const pageStreams = pages.map((p) => generateMonthPageStream(p));
  const numPages = pageStreams.length;

  let out = '%PDF-1.4\n';
  const offsets: number[] = [];

  function addObj(str: string): number {
    offsets.push(Buffer.byteLength(out, 'latin1'));
    out += str + '\n';
    return offsets.length;
  }

  // 1 0 obj: Catalog
  addObj('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj');

  // 2 0 obj: Pages object (lists all page refs)
  // Page objects will start from obj 3 up to 2 + numPages
  const kidsStr = Array.from({ length: numPages }, (_, i) => `${3 + i * 2} 0 R`).join(' ');
  addObj(`2 0 obj\n<< /Type /Pages /Kids [${kidsStr}] /Count ${numPages} >>\nendobj`);

  // Font objects (will be placed at the end)
  const fontRegularObjNum = 3 + numPages * 2;
  const fontBoldObjNum = fontRegularObjNum + 1;

  // Add Page & Stream objects for each page
  for (let i = 0; i < numPages; i++) {
    const pageObjNum = 3 + i * 2;
    const streamObjNum = pageObjNum + 1;
    const streamContent = pageStreams[i];
    const streamByteLen = Buffer.byteLength(streamContent, 'latin1');

    addObj(
      `${pageObjNum} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Contents ${streamObjNum} 0 R /Resources << /Font << /F1 ${fontRegularObjNum} 0 R /F2 ${fontBoldObjNum} 0 R >> >> >>\nendobj`
    );

    addObj(
      `${streamObjNum} 0 obj\n<< /Length ${streamByteLen} >>\nstream\n${streamContent}\nendstream\nendobj`
    );
  }

  // Font objects (Standard 14 PDF fonts: Helvetica & Helvetica-Bold)
  addObj(`${fontRegularObjNum} 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj`);
  addObj(`${fontBoldObjNum} 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj`);

  // XRef Table
  const xrefOffset = Buffer.byteLength(out, 'latin1');
  const totalObjs = offsets.length + 1;
  out += `xref\n0 ${totalObjs}\n0000000000 65535 f \n`;
  for (let i = 0; i < offsets.length; i++) {
    out += String(offsets[i]).padStart(10, '0') + ' 00000 n \n';
  }
  out += `trailer\n<< /Size ${totalObjs} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

  return Buffer.from(out, 'latin1');
}

