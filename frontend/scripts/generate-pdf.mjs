import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read prayer calendar data
const calendarData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../data/prayerCalendar.json'), 'utf8')
);

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function to12Hour(time24) {
  if (!time24 || time24 === '—' || time24 === '-') return '—';
  const parts = time24.split(':');
  if (parts.length < 2) return time24;
  let hour = parseInt(parts[0], 10);
  const min = parts[1];
  if (isNaN(hour)) return time24;
  hour = hour % 12;
  if (hour === 0) hour = 12;
  return `${hour}:${min}`;
}

function escapePDFText(str) {
  return str.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

function getMonthDays(year, monthIndex) {
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const list = [];
  const monthCal = calendarData.calendar[monthIndex] || {};
  const monthIqama = calendarData.iqamaCalendar[monthIndex] || {};

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, monthIndex, d);
    const dayKey = String(d);
    const calRow = monthCal[dayKey] || ['05:16', '06:53', '11:52', '14:19', '16:49', '18:19'];
    const iqamaRow = monthIqama[dayKey] || ['05:45', '12:45', '14:45', '16:54', '19:00'];

    const formatIqama = (iqamaVal, adhanVal) => {
      if (!iqamaVal || iqamaVal === '+0') return adhanVal;
      if (iqamaVal.startsWith('+')) {
        const addMin = parseInt(iqamaVal.slice(1), 10) || 5;
        const [h, m] = adhanVal.split(':').map(Number);
        const totalM = h * 60 + m + addMin;
        const newH = Math.floor(totalM / 60) % 24;
        const newM = totalM % 60;
        return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
      }
      return iqamaVal;
    };

    let hijriShort = '';
    try {
      const parts = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
        day: 'numeric',
        month: 'short',
      }).formatToParts(date);
      const dVal = parts.find((p) => p.type === 'day')?.value || '';
      const mVal = parts.find((p) => p.type === 'month')?.value || '';
      hijriShort = `${dVal} ${mVal}`.trim();
    } catch {
      hijriShort = '';
    }

    list.push({
      day: d,
      dayOfWeek: date.toLocaleDateString('en-GB', { weekday: 'short' }),
      isFriday: date.getDay() === 5,
      hijriShort,
      fajr: { adhan: calRow[0] || '05:16', iqamah: formatIqama(iqamaRow[0] || '05:45', calRow[0] || '05:16') },
      sunrise: calRow[1] || '06:53',
      dhuhr: { adhan: calRow[2] || '11:52', iqamah: formatIqama(iqamaRow[1] || '12:45', calRow[2] || '11:52') },
      asr: { adhan: calRow[3] || '14:19', iqamah: formatIqama(iqamaRow[2] || '14:45', calRow[3] || '14:19') },
      maghrib: { adhan: calRow[4] || '16:49', iqamah: formatIqama(iqamaRow[3] || '16:54', calRow[4] || '16:49') },
      isha: { adhan: calRow[5] || '18:19', iqamah: formatIqama(iqamaRow[4] || '19:00', calRow[5] || '18:19') },
    });
  }
  return list;
}

function generateMonthPageStream(year, monthIndex) {
  const monthSchedule = getMonthDays(year, monthIndex);
  const monthName = MONTH_NAMES[monthIndex];
  const firstDay = monthSchedule[0];
  const lastDay = monthSchedule[monthSchedule.length - 1];
  const hijriSpan = `${firstDay?.hijriShort || ''} – ${lastDay?.hijriShort || ''} AH`;

  const cmds = [];
  const leftX = 25;
  const topY = 816;
  const boxWidth = 545.28;
  const boxHeight = 90;

  cmds.push('q');
  cmds.push('0.03 0.35 0.52 rg');
  cmds.push(`${leftX} ${topY - boxHeight} ${boxWidth} ${boxHeight} re f`);
  cmds.push('0.96 0.62 0.04 rg');
  cmds.push(`${leftX} ${topY - boxHeight} ${boxWidth} 3.5 re f`);
  cmds.push('Q');

  cmds.push('BT');
  cmds.push('1 1 1 rg');
  cmds.push('/F2 15 Tf');
  cmds.push(`${leftX + 20} ${topY - 26} Td`);
  cmds.push(`(${escapePDFText('AL FALAH COMMUNITY SUPPORT CENTRE')}) Tj`);

  cmds.push('/F1 8 Tf');
  cmds.push('0 -13 Td');
  cmds.push(`(${escapePDFText('89 Tindal Street, Balsall Heath, Birmingham (B12 9QU) • Charity Reg: 1150221')}) Tj`);

  cmds.push('/F2 12 Tf');
  cmds.push('0 -19 Td');
  cmds.push(`(${escapePDFText('PRAYER TIMETABLE & CONGREGATION SCHEDULE')}) Tj`);

  cmds.push('0.98 0.88 0.38 rg');
  cmds.push('/F2 13 Tf');
  cmds.push('0 -18 Td');
  cmds.push(`(${escapePDFText(`${monthName.toUpperCase()} ${year}  •  ${hijriSpan}`)}) Tj`);
  cmds.push('ET');

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

  cmds.push('q');
  cmds.push('0.01 0.41 0.63 rg');
  cmds.push(`${leftX} ${tableTopY - headerRowHeight} ${boxWidth} ${headerRowHeight} re f`);
  cmds.push('Q');

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

  const rowHeight = 16.5;
  let curRowY = tableTopY - headerRowHeight;

  monthSchedule.forEach((d, idx) => {
    const isFriday = d.isFriday;
    const bgY = curRowY - rowHeight;

    cmds.push('q');
    if (isFriday) {
      cmds.push('0.91 0.96 0.93 rg');
    } else if (idx % 2 === 1) {
      cmds.push('0.97 0.98 0.99 rg');
    } else {
      cmds.push('1 1 1 rg');
    }
    cmds.push(`${leftX} ${bgY} ${boxWidth} ${rowHeight} re f`);

    cmds.push('0.88 0.91 0.94 RG');
    cmds.push('0.5 w');
    cmds.push(`${leftX} ${bgY} m ${leftX + boxWidth} ${bgY} l S`);

    let divX = leftX;
    for (const c of cols) {
      divX += c.width;
      cmds.push(`${divX} ${bgY} m ${divX} ${bgY + rowHeight} l S`);
    }
    cmds.push('Q');

    cmds.push('BT');
    if (isFriday) {
      cmds.push('0.06 0.45 0.23 rg');
    } else {
      cmds.push('0.08 0.12 0.18 rg');
    }

    let cellX = leftX;

    cmds.push(isFriday ? '/F2 8 Tf' : '/F1 8 Tf');
    cmds.push(`1 0 0 1 ${cellX + 4} ${bgY + 5} Tm`);
    cmds.push(`(${escapePDFText(String(d.day))}) Tj`);
    cellX += cols[0].width;

    cmds.push(isFriday ? '/F2 8 Tf' : '/F1 8 Tf');
    cmds.push(`1 0 0 1 ${cellX + 7} ${bgY + 5} Tm`);
    cmds.push(`(${escapePDFText(d.dayOfWeek)}) Tj`);
    cellX += cols[1].width;

    cmds.push('/F1 7 Tf');
    cmds.push(`1 0 0 1 ${cellX + 4} ${bgY + 5} Tm`);
    cmds.push(`(${escapePDFText(d.hijriShort)}) Tj`);
    cellX += cols[2].width;

    const formatPair = (ad, iq) => `${to12Hour(ad)} / ${iq === '—' ? '—' : to12Hour(iq)}`;

    cmds.push('/F1 7.5 Tf');
    cmds.push(`1 0 0 1 ${cellX + 6} ${bgY + 5} Tm`);
    cmds.push(`(${escapePDFText(formatPair(d.fajr.adhan, d.fajr.iqamah))}) Tj`);
    cellX += cols[3].width;

    cmds.push('/F1 7.5 Tf');
    cmds.push(`1 0 0 1 ${cellX + 7} ${bgY + 5} Tm`);
    cmds.push(`(${escapePDFText(to12Hour(d.sunrise))}) Tj`);
    cellX += cols[4].width;

    cmds.push('/F1 7.5 Tf');
    cmds.push(`1 0 0 1 ${cellX + 6} ${bgY + 5} Tm`);
    cmds.push(`(${escapePDFText(formatPair(d.dhuhr.adhan, d.dhuhr.iqamah))}) Tj`);
    cellX += cols[5].width;

    cmds.push('/F1 7.5 Tf');
    cmds.push(`1 0 0 1 ${cellX + 6} ${bgY + 5} Tm`);
    cmds.push(`(${escapePDFText(formatPair(d.asr.adhan, d.asr.iqamah))}) Tj`);
    cellX += cols[6].width;

    cmds.push('/F1 7.5 Tf');
    cmds.push(`1 0 0 1 ${cellX + 6} ${bgY + 5} Tm`);
    cmds.push(`(${escapePDFText(formatPair(d.maghrib.adhan, d.maghrib.iqamah))}) Tj`);
    cellX += cols[7].width;

    cmds.push('/F1 7.5 Tf');
    cmds.push(`1 0 0 1 ${cellX + 6} ${bgY + 5} Tm`);
    cmds.push(`(${escapePDFText(formatPair(d.isha.adhan, d.isha.iqamah))}) Tj`);
    cellX += cols[8].width;

    cmds.push('ET');
    curRowY -= rowHeight;
  });

  const footerTop = curRowY - 14;
  const footerHeight = 65;

  cmds.push('q');
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

function buildPDF(pages) {
  const streams = pages.map((p) => generateMonthPageStream(p.year, p.monthIndex));
  const numPages = streams.length;
  let out = '%PDF-1.4\n';
  const offsets = [];

  function addObj(str) {
    offsets.push(Buffer.byteLength(out, 'latin1'));
    out += str + '\n';
  }

  addObj('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj');
  const kidsStr = Array.from({ length: numPages }, (_, i) => `${3 + i * 2} 0 R`).join(' ');
  addObj(`2 0 obj\n<< /Type /Pages /Kids [${kidsStr}] /Count ${numPages} >>\nendobj`);

  const fontRegObj = 3 + numPages * 2;
  const fontBoldObj = fontRegObj + 1;

  for (let i = 0; i < numPages; i++) {
    const pageNum = 3 + i * 2;
    const streamNum = pageNum + 1;
    const content = streams[i];
    const byteLen = Buffer.byteLength(content, 'latin1');

    addObj(
      `${pageNum} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Contents ${streamNum} 0 R /Resources << /Font << /F1 ${fontRegObj} 0 R /F2 ${fontBoldObj} 0 R >> >> >>\nendobj`
    );
    addObj(`${streamNum} 0 obj\n<< /Length ${byteLen} >>\nstream\n${content}\nendstream\nendobj`);
  }

  addObj(`${fontRegObj} 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj`);
  addObj(`${fontBoldObj} 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj`);

  const xrefOffset = Buffer.byteLength(out, 'latin1');
  const totalObjs = offsets.length + 1;
  out += `xref\n0 ${totalObjs}\n0000000000 65535 f \n`;
  for (let i = 0; i < offsets.length; i++) {
    out += String(offsets[i]).padStart(10, '0') + ' 00000 n \n';
  }
  out += `trailer\n<< /Size ${totalObjs} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

  return Buffer.from(out, 'latin1');
}

// Generate October & November (bimonthly brochure like GLMCC)
const octNovPDF = buildPDF([
  { year: 2026, monthIndex: 9 },  // October
  { year: 2026, monthIndex: 10 }, // November
]);

const outDir = path.join(__dirname, '../public/downloads');
fs.mkdirSync(outDir, { recursive: true });

fs.writeFileSync(path.join(outDir, 'GLM-Oct_Nov-Timetable.pdf'), octNovPDF);
fs.writeFileSync(path.join(outDir, 'AlFalah-Oct_Nov-Timetable.pdf'), octNovPDF);
fs.writeFileSync(path.join(outDir, 'AlFalah-Prayer-Timetable.pdf'), octNovPDF);

console.log('Successfully generated timetable PDFs in public/downloads/ (Size:', octNovPDF.length, 'bytes)');

