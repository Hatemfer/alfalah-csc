import prayerData from '../data/prayerCalendar.json';

export interface PrayerEntry {
  id: 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha' | 'jumua';
  nameEn: string;
  nameAr: string;
  adhan: string;
  iqamah: string;
  isPassed?: boolean;
  isNext?: boolean;
}

export interface DayPrayerSchedule {
  day: number;
  dayOfWeek: string;
  dayOfWeekFull: string;
  isFriday: boolean;
  dateStr: string;
  hijriStr: string;
  hijriShort: string;
  hijriDay: string;
  hijriMonth: string;
  prayers: PrayerEntry[];
  fajr: { adhan: string; iqamah: string };
  sunrise: string;
  dhuhr: { adhan: string; iqamah: string };
  asr: { adhan: string; iqamah: string };
  maghrib: { adhan: string; iqamah: string };
  isha: { adhan: string; iqamah: string };
  jumua: string;
}

// Ordinal helper: 1 -> "st", 2 -> "nd", 3 -> "rd", 13 -> "th"
export function getOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

// Convert 24-hour time "05:47" or "13:00" to 12-hour "5:47 AM" or "1:00 PM"
export function to12Hour(time24: string): string {
  if (!time24 || time24 === '—' || time24 === '-' || time24 === ' ') return '—';
  const parts = time24.split(':');
  if (parts.length < 2) return time24;
  let hour = parseInt(parts[0], 10);
  const min = parts[1];
  if (isNaN(hour)) return time24;
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12;
  if (hour === 0) hour = 12;
  return `${hour}:${min} ${ampm}`;
}

export function formatTimeWithMode(time24: string, is24h: boolean): string {
  if (is24h) return time24;
  return to12Hour(time24);
}

// Approximate Hijri month names
const HIJRI_MONTHS = [
  'Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani',
  'Jumada al-Ula', 'Jumada al-Thani', 'Rajab', 'Sha’ban',
  'Ramadan', 'Shawwal', 'Dhul Qi’dah', 'Dhul Hijjah'
];

export function getHijriDate(date: Date = new Date()): string {
  try {
    // Use Intl if supported for Islamic UAQ / Umm al-Qura calendar
    const formatter = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    const formatted = formatter.format(date);
    return formatted.includes('AH') ? formatted : `${formatted} AH`;
  } catch {
    // Fallback based on October 2026 -> 14 Jumada al-Ula 1448
    return '14 Jumada al-Ula 1448 AH';
  }
}

export function getDaySchedule(date: Date = new Date()): DayPrayerSchedule {
  const month = date.getMonth(); // 0 to 11
  const day = date.getDate(); // 1 to 31
  const dayKey = String(day);

  // Month calendar array from Mawaqit data
  const monthCal = prayerData.calendar[month] || {};
  const monthIqama = prayerData.iqamaCalendar[month] || {};

  // Times array: [fajr, shuruq, dhuhr, asr, maghrib, isha]
  const calRow = (monthCal as Record<string, string[]>)[dayKey] || ['05:16', '06:53', '11:52', '14:19', '16:49', '18:19'];
  // Iqama array: [fajr, dhuhr, asr, maghrib, isha]
  const iqamaRow = (monthIqama as Record<string, string[]>)[dayKey] || ['05:45', '12:45', '14:45', '16:54', '19:00'];

  const fajrAdhan = calRow[0] || '05:16';
  const sunrise = calRow[1] || '06:53';
  const dhuhrAdhan = calRow[2] || '11:52';
  const asrAdhan = calRow[3] || '14:19';
  const maghribAdhan = calRow[4] || '16:49';
  const ishaAdhan = calRow[5] || '18:19';

  // Format iqama if it begins with "+" (e.g. "+5" means 5 min after adhan)
  const formatIqama = (iqamaVal: string, adhanVal: string): string => {
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

  const fajrIqamah = formatIqama(iqamaRow[0] || '05:45', fajrAdhan);
  const dhuhrIqamah = formatIqama(iqamaRow[1] || '12:45', dhuhrAdhan);
  const asrIqamah = formatIqama(iqamaRow[2] || '14:45', asrAdhan);
  const maghribIqamah = formatIqama(iqamaRow[3] || '16:54', maghribAdhan);
  const ishaIqamah = formatIqama(iqamaRow[4] || '19:00', ishaAdhan);
  const jumua = prayerData.jumua || '13:00';

  const prayers: PrayerEntry[] = [
    { id: 'fajr', nameEn: 'Fajr', nameAr: 'الفجر', adhan: fajrAdhan, iqamah: fajrIqamah },
    { id: 'sunrise', nameEn: 'Sunrise', nameAr: 'الشروق', adhan: sunrise, iqamah: '—' },
    { id: 'dhuhr', nameEn: 'Dhuhr', nameAr: 'الظهر', adhan: dhuhrAdhan, iqamah: dhuhrIqamah },
    { id: 'asr', nameEn: 'Asr', nameAr: 'العصر', adhan: asrAdhan, iqamah: asrIqamah },
    { id: 'maghrib', nameEn: 'Maghrib', nameAr: 'المغرب', adhan: maghribAdhan, iqamah: maghribIqamah },
    { id: 'isha', nameEn: 'Isha', nameAr: 'العشاء', adhan: ishaAdhan, iqamah: ishaIqamah },
    { id: 'jumua', nameEn: "Jumu'ah", nameAr: 'الجمعة', adhan: '12:30', iqamah: jumua },
  ];

  const dateStr = date.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const dayOfWeek = date.toLocaleDateString('en-GB', { weekday: 'short' });
  const dayOfWeekFull = date.toLocaleDateString('en-GB', { weekday: 'long' });
  const isFriday = date.getDay() === 5;

  let hijriDay = '';
  let hijriMonth = '';
  let hijriShort = '';
  try {
    const parts = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).formatToParts(date);
    const dVal = parts.find((p) => p.type === 'day')?.value || '';
    const mVal = parts.find((p) => p.type === 'month')?.value || '';
    hijriDay = dVal;
    hijriMonth = mVal;
    hijriShort = `${dVal} ${mVal}`.trim();
  } catch {
    hijriShort = '';
  }

  return {
    day,
    dayOfWeek,
    dayOfWeekFull,
    isFriday,
    dateStr,
    hijriStr: getHijriDate(date),
    hijriShort,
    hijriDay,
    hijriMonth,
    prayers,
    fajr: { adhan: fajrAdhan, iqamah: fajrIqamah },
    sunrise,
    dhuhr: { adhan: dhuhrAdhan, iqamah: dhuhrIqamah },
    asr: { adhan: asrAdhan, iqamah: asrIqamah },
    maghrib: { adhan: maghribAdhan, iqamah: maghribIqamah },
    isha: { adhan: ishaAdhan, iqamah: ishaIqamah },
    jumua,
  };
}

export function getMonthSchedule(year: number, monthIndex: number): DayPrayerSchedule[] {
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const list: DayPrayerSchedule[] = [];

  for (let d = 1; d <= daysInMonth; d++) {
    const dObj = new Date(year, monthIndex, d);
    list.push(getDaySchedule(dObj));
  }

  return list;
}
