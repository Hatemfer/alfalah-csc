'use client';

import React, { useEffect, useState, useMemo, useRef } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  MenuItem,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Tooltip,
  Divider,
} from '@mui/material';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded';
import UploadFileRoundedIcon from '@mui/icons-material/UploadFileRounded';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import { ConfirmDeleteModal } from '@/components/admin/ConfirmDeleteModal';
import { to12Hour } from '@/utils/prayerTimes';

interface DailyPrayerData {
  date: string;
  fajr: { adhan: string; iqamah: string };
  sunrise: string;
  dhuhr: { adhan: string; iqamah: string };
  asr: { adhan: string; iqamah: string };
  maghrib: { adhan: string; iqamah: string };
  isha: { adhan: string; iqamah: string };
  isOverridden?: boolean;
  timezone?: string;
}

export default function AdminPrayerTimesPage() {
  const [settings, setSettings] = useState<any>(null);
  const [overrides, setOverrides] = useState<any[]>([]);
  const [todayData, setTodayData] = useState<DailyPrayerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [savingOverride, setSavingOverride] = useState(false);
  const [savingJumuahPdf, setSavingJumuahPdf] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showAdvancedAdhan, setShowAdvancedAdhan] = useState(false);

  const [jumuahTime, setJumuahTime] = useState('13:00');
  const [timetablePdfUrl, setTimetablePdfUrl] = useState('/downloads/AlFalah-Prayer-Timetable.pdf');
  const pdfInputRef = useRef<HTMLInputElement | null>(null);

  const [deleteModal, setDeleteModal] = useState<{ open: boolean; date: string; loading: boolean }>({
    open: false,
    date: '',
    loading: false,
  });

  const todayIso = new Date().toISOString().slice(0, 10);

  const [formState, setFormState] = useState({
    date: todayIso,
    endDate: todayIso,
    fajrAdhan: '',
    fajrIqamah: '',
    sunrise: '',
    dhuhrAdhan: '',
    dhuhrIqamah: '',
    asrAdhan: '',
    asrIqamah: '',
    maghribAdhan: '',
    maghribIqamah: '',
    ishaAdhan: '',
    ishaIqamah: '',
    notes: 'Official mosque timetable',
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [setRes, overRes, todayRes, siteRes] = await Promise.all([
        fetch('/api/v1/admin/prayer-settings', { credentials: 'include' }),
        fetch('/api/v1/admin/prayer-overrides', { credentials: 'include' }),
        fetch('/api/v1/prayer-times/today'),
        fetch('/api/v1/site-settings'),
      ]);

      if (setRes.ok) setSettings(await setRes.json());
      if (overRes.ok) setOverrides(await overRes.json());
      if (todayRes.ok) setTodayData(await todayRes.json());
      if (siteRes.ok) {
        const s = await siteRes.json();
        if (s.jumuah_time) setJumuahTime(s.jumuah_time);
        if (s.timetable_pdf_url !== undefined) setTimetablePdfUrl(s.timetable_pdf_url);
      }
    } catch (e) {
      console.error(e);
      setFeedback({ type: 'error', message: 'Failed to connect to prayer times service.' });
    } finally {
      setLoading(false);
    }
  }

  const handleEditOverride = (item: any) => {
    setFormState({
      date: item.date,
      endDate: item.date,
      fajrAdhan: item.fajrAdhan || '',
      fajrIqamah: item.fajrIqamah || '',
      sunrise: item.sunrise || '',
      dhuhrAdhan: item.dhuhrAdhan || '',
      dhuhrIqamah: item.dhuhrIqamah || '',
      asrAdhan: item.asrAdhan || '',
      asrIqamah: item.asrIqamah || '',
      maghribAdhan: item.maghribAdhan || '',
      maghribIqamah: item.maghribIqamah || '',
      ishaAdhan: item.ishaAdhan || '',
      ishaIqamah: item.ishaIqamah || '',
      notes: item.notes || 'Official mosque timetable',
    });
    if (item.fajrAdhan || item.dhuhrAdhan) {
      setShowAdvancedAdhan(true);
    }
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  const applyRangePreset = (daysCount: number) => {
    const start = new Date();
    const end = new Date();
    end.setDate(start.getDate() + Math.max(0, daysCount - 1));
    setFormState((prev) => ({
      ...prev,
      date: start.toISOString().slice(0, 10),
      endDate: end.toISOString().slice(0, 10),
    }));
  };

  const applyRestOfMonthPreset = () => {
    const start = new Date();
    const end = new Date(start.getFullYear(), start.getMonth() + 1, 0);
    setFormState((prev) => ({
      ...prev,
      date: start.toISOString().slice(0, 10),
      endDate: end.toISOString().slice(0, 10),
    }));
  };

  const rangeDaysCount = useMemo(() => {
    if (!formState.date) return 1;
    if (!formState.endDate || formState.endDate <= formState.date) return 1;
    const start = new Date(`${formState.date}T12:00:00Z`).getTime();
    const end = new Date(`${formState.endDate}T12:00:00Z`).getTime();
    return Math.min(90, Math.floor((end - start) / 86400000) + 1);
  }, [formState.date, formState.endDate]);

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    setFeedback(null);
    try {
      const res = await fetch('/api/v1/admin/prayer-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error('Failed to update prayer calculation settings');
      setFeedback({ type: 'success', message: 'Prayer calculation parameters updated successfully.' });
      await loadData();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setSavingSettings(false);
    }
  };

  const handleSaveOverride = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingOverride(true);
    setFeedback(null);
    try {
      const payload = {
        ...formState,
        endDate: formState.endDate && formState.endDate >= formState.date ? formState.endDate : undefined,
      };
      const res = await fetch('/api/v1/admin/prayer-overrides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to save timetable schedule');
      const result = await res.json();
      const updatedCount = result?.count || 1;
      setFeedback({
        type: 'success',
        message:
          updatedCount > 1
            ? `Schedule saved across ${updatedCount} days (${formState.date} to ${formState.endDate}). Live on public website.`
            : `Timetable override saved for ${formState.date}. Live on public website.`,
      });
      await loadData();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setSavingOverride(false);
    }
  };

  const handleSaveJumuahAndPdf = async () => {
    setSavingJumuahPdf(true);
    setFeedback(null);
    try {
      const [jRes, pRes] = await Promise.all([
        fetch('/api/v1/admin/site-settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ key: 'jumuah_time', value: jumuahTime }),
        }),
        fetch('/api/v1/admin/site-settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ key: 'timetable_pdf_url', value: timetablePdfUrl }),
        }),
      ]);
      if (!jRes.ok || !pRes.ok) throw new Error('Failed to update Jumu’ah or PDF settings');
      setFeedback({
        type: 'success',
        message: 'Friday Jumu’ah time & Official Timetable PDF updated on the live website.',
      });
      await loadData();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setSavingJumuahPdf(false);
    }
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPdf(true);
    setFeedback(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/v1/admin/media/upload', {
        method: 'POST',
        credentials: 'include',
        body: fd,
      });
      if (!res.ok) throw new Error('Failed to upload PDF file');
      const data = await res.json();
      const uploadedUrl = data.url || data.filePath;
      if (uploadedUrl) {
        setTimetablePdfUrl(uploadedUrl);
        await fetch('/api/v1/admin/site-settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ key: 'timetable_pdf_url', value: uploadedUrl }),
        });
        setFeedback({
          type: 'success',
          message: `Uploaded "${file.name}" and published it as the live Official Timetable PDF.`,
        });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setUploadingPdf(false);
      if (pdfInputRef.current) pdfInputRef.current.value = '';
    }
  };

  const handleRemovePdf = async () => {
    setSavingJumuahPdf(true);
    setFeedback(null);
    try {
      const res = await fetch('/api/v1/admin/site-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ key: 'timetable_pdf_url', value: '' }),
      });
      if (!res.ok) throw new Error('Failed to remove PDF');
      setTimetablePdfUrl('');
      setFeedback({
        type: 'success',
        message: 'Official Timetable PDF removed. The download card is now hidden on the public website until you upload a new one.',
      });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setSavingJumuahPdf(false);
    }
  };

  const promptDeleteOverride = (date: string) => {
    setDeleteModal({ open: true, date, loading: false });
  };

  const handleConfirmDeleteOverride = async () => {
    try {
      setDeleteModal((prev) => ({ ...prev, loading: true }));
      const res = await fetch(`/api/v1/admin/prayer-overrides/${deleteModal.date}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to delete override');
      setFeedback({
        type: 'success',
        message: `Override for ${deleteModal.date} removed. Astronomical calculations resumed for this day.`,
      });
      setDeleteModal({ open: false, date: '', loading: false });
      await loadData();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
      setDeleteModal((prev) => ({ ...prev, loading: false }));
    }
  };

  const isTodayOverridden = useMemo(() => Boolean(todayData?.isOverridden), [todayData]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, gap: 2 }}>
        <CircularProgress size={44} thickness={4} sx={{ color: '#0284C7' }} />
        <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 600 }}>
          Loading prayer timetables &amp; astronomical engine...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 8, maxWidth: 1200, mx: 'auto' }}>
      {/* Page Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', mb: 0.5 }}>
            Prayer Times &amp; Congregation Management
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748B', maxWidth: 740 }}>
            Adhan start times calculate automatically for Birmingham 365 days a year. Use this dashboard to set fixed Jama&apos;ah times for any date range, update Friday Jumu&apos;ah, or upload the printable PDF timetable.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          size="small"
          onClick={loadData}
          startIcon={<RefreshRoundedIcon />}
          sx={{
            borderColor: '#CBD5E1',
            color: '#334155',
            fontWeight: 700,
            textTransform: 'none',
            borderRadius: 2,
            px: 2,
            '&:hover': { borderColor: '#94A3B8', backgroundColor: '#F8FAFC' },
          }}
        >
          Refresh Timetable
        </Button>
      </Box>

      {feedback && (
        <Alert severity={feedback.type} sx={{ mb: 3, borderRadius: 2, fontWeight: 600 }} onClose={() => setFeedback(null)}>
          {feedback.message}
        </Alert>
      )}

      {/* TODAY'S LIVE TIMETABLE */}
      <Card
        sx={{
          mb: 4,
          borderRadius: 3,
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 16px -2px rgba(15, 23, 42, 0.05)',
          overflow: 'hidden',
          backgroundColor: '#FFFFFF',
        }}
      >
        <Box
          sx={{
            px: 3,
            py: 2,
            backgroundColor: '#F8FAFC',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 1.5,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                backgroundColor: '#E0F2FE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0284C7',
              }}
            >
              <AccessTimeRoundedIcon fontSize="small" />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: '#0F172A' }}>
                Today&apos;s Live Timetable (Worshipper View)
              </Typography>
              <Typography sx={{ fontSize: '0.78rem', color: '#64748B' }}>
                Date: <strong>{todayData?.date || todayIso}</strong> • Jumu&apos;ah: <strong>{to12Hour(jumuahTime)}</strong>
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {isTodayOverridden ? (
              <Chip
                icon={<CheckCircleRoundedIcon style={{ color: '#B45309' }} />}
                label="Mosque Override Active"
                size="small"
                sx={{
                  backgroundColor: '#FEF3C7',
                  color: '#92400E',
                  fontWeight: 700,
                  fontSize: '0.76rem',
                  border: '1px solid #FDE68A',
                }}
              />
            ) : (
              <Chip
                icon={<CheckCircleRoundedIcon style={{ color: '#059669' }} />}
                label="Astronomical Auto-Calculation Active"
                size="small"
                sx={{
                  backgroundColor: '#ECFDF5',
                  color: '#065F46',
                  fontWeight: 700,
                  fontSize: '0.76rem',
                  border: '1px solid #A7F3D0',
                }}
              />
            )}

            <Button
              size="small"
              variant="text"
              onClick={() => {
                setFormState((prev) => ({
                  ...prev,
                  date: todayIso,
                  endDate: todayIso,
                  fajrIqamah: todayData?.fajr.iqamah || '',
                  dhuhrIqamah: todayData?.dhuhr.iqamah || '',
                  asrIqamah: todayData?.asr.iqamah || '',
                  maghribIqamah: todayData?.maghrib.iqamah || '',
                  ishaIqamah: todayData?.isha.iqamah || '',
                }));
                window.scrollTo({ top: 380, behavior: 'smooth' });
              }}
              sx={{ fontWeight: 700, textTransform: 'none', color: '#0284C7', fontSize: '0.8rem' }}
            >
              Edit Today&apos;s Times
            </Button>
          </Box>
        </Box>

        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={2}>
            {[
              { id: 'fajr', name: 'Fajr', adhan: todayData?.fajr.adhan || '05:43', iqamah: todayData?.fajr.iqamah || '06:45' },
              { id: 'sunrise', name: 'Sunrise', adhan: todayData?.sunrise || '07:46', iqamah: '—' },
              { id: 'dhuhr', name: 'Dhuhr', adhan: todayData?.dhuhr.adhan || '11:55', iqamah: todayData?.dhuhr.iqamah || '12:45' },
              { id: 'asr', name: 'Asr', adhan: todayData?.asr.adhan || '14:14', iqamah: todayData?.asr.iqamah || '14:30' },
              { id: 'maghrib', name: 'Maghrib', adhan: todayData?.maghrib.adhan || '16:03', iqamah: todayData?.maghrib.iqamah || '16:03' },
              { id: 'isha', name: 'Isha', adhan: todayData?.isha.adhan || '18:05', iqamah: todayData?.isha.iqamah || '19:00' },
            ].map((item) => (
              <Grid item xs={6} sm={4} md={2} key={item.id}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: '1px solid #E2E8F0',
                    backgroundColor: item.id === 'sunrise' ? '#F8FAFC' : '#FFFFFF',
                    textAlign: 'center',
                    transition: 'all 0.15s ease',
                    '&:hover': {
                      borderColor: '#0284C7',
                      boxShadow: '0 4px 12px rgba(2, 132, 199, 0.08)',
                    },
                  }}
                >
                  <Typography sx={{ fontSize: '0.9rem', fontWeight: 800, color: '#0F172A', mb: 0.5 }}>
                    {item.name}
                  </Typography>
                  <Typography sx={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600 }}>
                    Begins {to12Hour(item.adhan)}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '1.25rem',
                      fontWeight: 800,
                      color: item.iqamah === '—' ? '#94A3B8' : '#0284C7',
                      mt: 0.5,
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {item.iqamah === '—' ? '—' : to12Hour(item.iqamah)}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '0.66rem',
                      fontWeight: 700,
                      color: '#94A3B8',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {item.iqamah === '—' ? 'Shuruq' : 'Jama’ah'}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* DATE-RANGE CONGREGATION SCHEDULE OVERRIDES */}
      <Card
        sx={{
          mb: 4,
          borderRadius: 3,
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 16px -2px rgba(15, 23, 42, 0.05)',
          overflow: 'hidden',
          backgroundColor: '#FFFFFF',
        }}
      >
        <Box
          sx={{
            px: 3,
            py: 2.25,
            backgroundColor: '#F8FAFC',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 1.5,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                backgroundColor: '#EFF6FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#2563EB',
              }}
            >
              <CalendarMonthRoundedIcon fontSize="small" />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: '#0F172A' }}>
                Set Jama&apos;ah Times (Single Day or Date Range)
              </Typography>
              <Typography sx={{ fontSize: '0.78rem', color: '#64748B' }}>
                Update congregation times for 1 day, 2 weeks, or the entire month in one click. Leave any field blank to use automatic astronomical calculation.
              </Typography>
            </Box>
          </Box>

          <Chip
            label={`Applying to ${rangeDaysCount} ${rangeDaysCount === 1 ? 'day' : 'days'}`}
            size="small"
            sx={{ backgroundColor: '#E0F2FE', color: '#0369A1', fontWeight: 800, fontSize: '0.75rem' }}
          />
        </Box>

        <CardContent sx={{ p: 3 }}>
          <Box component="form" onSubmit={handleSaveOverride}>
            {/* Date Range + Quick Presets */}
            <Box sx={{ mb: 3, p: 2, backgroundColor: '#F8FAFC', borderRadius: 2, border: '1px solid #E2E8F0' }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={3}>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.84rem', color: '#1E293B', mb: 0.75 }}>
                    Start Date *
                  </Typography>
                  <TextField
                    type="date"
                    size="small"
                    fullWidth
                    required
                    value={formState.date}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormState((prev) => ({
                        ...prev,
                        date: val,
                        endDate: prev.endDate < val ? val : prev.endDate,
                      }));
                    }}
                    sx={{ backgroundColor: '#FFFFFF' }}
                  />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.84rem', color: '#1E293B', mb: 0.75 }}>
                    End Date (Optional)
                  </Typography>
                  <TextField
                    type="date"
                    size="small"
                    fullWidth
                    inputProps={{ min: formState.date }}
                    value={formState.endDate}
                    onChange={(e) => setFormState({ ...formState, endDate: e.target.value })}
                    sx={{ backgroundColor: '#FFFFFF' }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.84rem', color: '#1E293B', mb: 0.75 }}>
                    Quick Range Presets
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                    <Button
                      size="small"
                      variant={rangeDaysCount === 1 ? 'contained' : 'outlined'}
                      onClick={() => applyRangePreset(1)}
                      sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.78rem', borderRadius: 2 }}
                    >
                      Today Only
                    </Button>
                    <Button
                      size="small"
                      variant={rangeDaysCount === 7 ? 'contained' : 'outlined'}
                      onClick={() => applyRangePreset(7)}
                      sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.78rem', borderRadius: 2 }}
                    >
                      Next 7 Days
                    </Button>
                    <Button
                      size="small"
                      variant={rangeDaysCount === 14 ? 'contained' : 'outlined'}
                      onClick={() => applyRangePreset(14)}
                      sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.78rem', borderRadius: 2 }}
                    >
                      Next 14 Days
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={applyRestOfMonthPreset}
                      sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.78rem', borderRadius: 2 }}
                    >
                      Rest of Month
                    </Button>
                    <Button
                      size="small"
                      variant="text"
                      onClick={() => setShowAdvancedAdhan(!showAdvancedAdhan)}
                      sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.76rem', color: '#64748B', ml: 'auto' }}
                    >
                      {showAdvancedAdhan ? 'Hide Custom Adhan' : '+ Custom Adhan'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>

            {/* 5 Jama'ah Inputs */}
            <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', color: '#0F172A', mb: 1.5 }}>
              Official Congregation (Jama&apos;ah) Times (24h HH:MM)
            </Typography>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              {[
                { key: 'fajr', label: "Fajr Jama'ah", adhanKey: 'fajrAdhan', iqamahKey: 'fajrIqamah', phIq: '06:45', phAd: '05:43' },
                { key: 'dhuhr', label: "Dhuhr Jama'ah", adhanKey: 'dhuhrAdhan', iqamahKey: 'dhuhrIqamah', phIq: '12:45', phAd: '11:58' },
                { key: 'asr', label: "Asr Jama'ah", adhanKey: 'asrAdhan', iqamahKey: 'asrIqamah', phIq: '14:30', phAd: '14:14' },
                { key: 'maghrib', label: "Maghrib Jama'ah", adhanKey: 'maghribAdhan', iqamahKey: 'maghribIqamah', phIq: '16:03', phAd: '16:03' },
                { key: 'isha', label: "Isha Jama'ah", adhanKey: 'ishaAdhan', iqamahKey: 'ishaIqamah', phIq: '19:00', phAd: '18:05' },
              ].map((p) => (
                <Grid item xs={6} sm={2.4} key={p.key}>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.84rem', color: '#1E293B', mb: 0.75 }}>
                    {p.label}
                  </Typography>
                  <TextField
                    size="small"
                    fullWidth
                    placeholder={p.phIq}
                    value={(formState as any)[p.iqamahKey]}
                    onChange={(e) => setFormState({ ...formState, [p.iqamahKey]: e.target.value })}
                  />
                  {showAdvancedAdhan && (
                    <Box sx={{ mt: 1 }}>
                      <Typography sx={{ fontSize: '0.72rem', color: '#64748B', mb: 0.25 }}>
                        Custom Adhan
                      </Typography>
                      <TextField
                        size="small"
                        fullWidth
                        placeholder={p.phAd}
                        value={(formState as any)[p.adhanKey]}
                        onChange={(e) => setFormState({ ...formState, [p.adhanKey]: e.target.value })}
                      />
                    </Box>
                  )}
                </Grid>
              ))}
            </Grid>

            {/* Notes & Save */}
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={8}>
                <Typography sx={{ fontWeight: 700, fontSize: '0.84rem', color: '#1E293B', mb: 0.75 }}>
                  Schedule Notes / Occasion
                </Typography>
                <TextField
                  size="small"
                  fullWidth
                  placeholder="e.g. Winter Jama'ah Timetable - Nov/Dec 2026"
                  value={formState.notes}
                  onChange={(e) => setFormState({ ...formState, notes: e.target.value })}
                />
              </Grid>

              <Grid item xs={12} sm={4} sx={{ display: 'flex', gap: 1.5, mt: { xs: 0, sm: 3 } }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={savingOverride}
                  startIcon={savingOverride ? <CircularProgress size={18} color="inherit" /> : <SaveRoundedIcon />}
                  sx={{
                    flex: 1,
                    height: 40,
                    fontWeight: 700,
                    textTransform: 'none',
                    borderRadius: 2,
                    backgroundColor: '#0284C7',
                    '&:hover': { backgroundColor: '#0369A1' },
                  }}
                >
                  {savingOverride
                    ? 'Saving...'
                    : rangeDaysCount > 1
                      ? `Apply to ${rangeDaysCount} Days`
                      : 'Save Override'}
                </Button>

                <Button
                  variant="outlined"
                  onClick={() =>
                    setFormState({
                      date: todayIso,
                      endDate: todayIso,
                      fajrAdhan: '',
                      fajrIqamah: '',
                      sunrise: '',
                      dhuhrAdhan: '',
                      dhuhrIqamah: '',
                      asrAdhan: '',
                      asrIqamah: '',
                      maghribAdhan: '',
                      maghribIqamah: '',
                      ishaAdhan: '',
                      ishaIqamah: '',
                      notes: 'Official mosque timetable',
                    })
                  }
                  sx={{
                    height: 40,
                    fontWeight: 700,
                    textTransform: 'none',
                    borderRadius: 2,
                    borderColor: '#CBD5E1',
                    color: '#475569',
                  }}
                >
                  Reset
                </Button>
              </Grid>
            </Grid>
          </Box>

          {/* ACTIVE OVERRIDES TABLE */}
          <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid #E2E8F0' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
              <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', color: '#0F172A' }}>
                Active &amp; Scheduled Overrides ({overrides.length})
              </Typography>
              <Typography sx={{ fontSize: '0.78rem', color: '#64748B' }}>
                Click edit to adjust a day or delete to restore automatic calculation.
              </Typography>
            </Box>

            {overrides.length === 0 ? (
              <Box
                sx={{
                  p: 4,
                  textAlign: 'center',
                  backgroundColor: '#F8FAFC',
                  borderRadius: 2,
                  border: '1px dashed #CBD5E1',
                }}
              >
                <InfoOutlinedIcon sx={{ color: '#94A3B8', fontSize: 32, mb: 1 }} />
                <Typography sx={{ fontWeight: 700, color: '#334155', fontSize: '0.9rem' }}>
                  No Manual Overrides Active
                </Typography>
                <Typography sx={{ color: '#64748B', fontSize: '0.8rem', maxWidth: 450, mx: 'auto', mt: 0.5 }}>
                  The mosque timetable is running 100% automatically using Birmingham astronomical calculation rules and standard Jama&apos;ah offsets.
                </Typography>
              </Box>
            ) : (
              <TableContainer sx={{ border: '1px solid #E2E8F0', borderRadius: 2, maxHeight: 360 }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 800, color: '#1E293B', backgroundColor: '#F8FAFC', py: 1.25 }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#1E293B', backgroundColor: '#F8FAFC' }}>Fajr</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#1E293B', backgroundColor: '#F8FAFC' }}>Dhuhr</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#1E293B', backgroundColor: '#F8FAFC' }}>Asr</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#1E293B', backgroundColor: '#F8FAFC' }}>Maghrib</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#1E293B', backgroundColor: '#F8FAFC' }}>Isha</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#1E293B', backgroundColor: '#F8FAFC' }}>Notes</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, color: '#1E293B', backgroundColor: '#F8FAFC', pr: 2 }}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {overrides.map((o) => {
                      const isToday = o.date === todayIso;
                      return (
                        <TableRow
                          key={o.id || o.date}
                          sx={{
                            backgroundColor: isToday ? '#F0F9FF' : 'inherit',
                            '&:hover': { backgroundColor: isToday ? '#E0F2FE' : '#F8FAFC' },
                          }}
                        >
                          <TableCell sx={{ fontWeight: 700, color: '#0F172A', py: 1.25 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <span>{o.date}</span>
                              {isToday && (
                                <Chip
                                  label="Today"
                                  size="small"
                                  sx={{
                                    height: 20,
                                    fontSize: '0.68rem',
                                    fontWeight: 800,
                                    backgroundColor: '#0284C7',
                                    color: '#FFFFFF',
                                  }}
                                />
                              )}
                            </Box>
                          </TableCell>
                          <TableCell sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{o.fajrIqamah || '—'}</TableCell>
                          <TableCell sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{o.dhuhrIqamah || '—'}</TableCell>
                          <TableCell sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{o.asrIqamah || '—'}</TableCell>
                          <TableCell sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{o.maghribIqamah || '—'}</TableCell>
                          <TableCell sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{o.ishaIqamah || '—'}</TableCell>
                          <TableCell sx={{ color: '#64748B', fontSize: '0.8rem' }}>{o.notes || '—'}</TableCell>
                          <TableCell align="right" sx={{ pr: 1.5 }}>
                            <Tooltip title="Edit this override">
                              <IconButton size="small" onClick={() => handleEditOverride(o)} sx={{ color: '#0284C7', mr: 0.5 }}>
                                <EditOutlinedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete override and restore automatic calculation">
                              <IconButton size="small" onClick={() => promptDeleteOverride(o.date)} sx={{ color: '#DC2626' }}>
                                <DeleteOutlineRoundedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* FRIDAY JUMU'AH & OFFICIAL TIMETABLE PDF */}
      <Card
        sx={{
          mb: 4,
          borderRadius: 3,
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 16px -2px rgba(15, 23, 42, 0.05)',
          overflow: 'hidden',
          backgroundColor: '#FFFFFF',
        }}
      >
        <Box
          sx={{
            px: 3,
            py: 2.25,
            backgroundColor: '#F8FAFC',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              backgroundColor: '#FEF2F2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#DC2626',
            }}
          >
            <PictureAsPdfRoundedIcon fontSize="small" />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: '#0F172A' }}>
              Friday Jumu&apos;ah &amp; Printable Timetable PDF
            </Typography>
            <Typography sx={{ fontSize: '0.78rem', color: '#64748B' }}>
              Synced directly to the homepage prayer bar and the public Prayer Timetable page.
            </Typography>
          </Box>
        </Box>

        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={2.5} alignItems="flex-end">
            <Grid item xs={12} sm={3}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.84rem', color: '#1E293B', mb: 0.75 }}>
                Friday Jumu&apos;ah Time (24h)
              </Typography>
              <TextField
                size="small"
                fullWidth
                placeholder="13:00"
                value={jumuahTime}
                onChange={(e) => setJumuahTime(e.target.value)}
                helperText={`Displays as: ${jumuahTime} (${to12Hour(jumuahTime)})`}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.84rem', color: '#1E293B', mb: 0.75 }}>
                Official Bi-Monthly Timetable PDF URL
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  size="small"
                  fullWidth
                  value={timetablePdfUrl}
                  onChange={(e) => setTimetablePdfUrl(e.target.value)}
                  placeholder="/downloads/AlFalah-Prayer-Timetable.pdf"
                />
                <input
                  ref={pdfInputRef}
                  type="file"
                  accept="application/pdf"
                  style={{ display: 'none' }}
                  onChange={handlePdfUpload}
                />
                <Button
                  variant="outlined"
                  size="small"
                  disabled={uploadingPdf}
                  onClick={() => pdfInputRef.current?.click()}
                  startIcon={uploadingPdf ? <CircularProgress size={16} /> : <UploadFileRoundedIcon />}
                  sx={{
                    whiteSpace: 'nowrap',
                    fontWeight: 700,
                    textTransform: 'none',
                    borderRadius: 2,
                    borderColor: '#CBD5E1',
                    color: '#334155',
                  }}
                >
                  {uploadingPdf ? 'Uploading...' : timetablePdfUrl ? 'Replace PDF' : 'Upload PDF'}
                </Button>
                {timetablePdfUrl && (
                  <>
                    <Tooltip title="Preview current PDF">
                      <IconButton
                        component="a"
                        href={timetablePdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ border: '1px solid #E2E8F0', borderRadius: 2 }}
                      >
                        <OpenInNewRoundedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Remove PDF from website">
                      <IconButton
                        onClick={handleRemovePdf}
                        disabled={savingJumuahPdf}
                        sx={{ border: '1px solid #FECACA', borderRadius: 2, color: '#DC2626', '&:hover': { backgroundColor: '#FEF2F2' } }}
                      >
                        <DeleteOutlineRoundedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </>
                )}
              </Box>
            </Grid>

            <Grid item xs={12} sm={3} sx={{ display: 'flex', justifyContent: 'flex-end', pb: { sm: 2.8 } }}>
              <Button
                variant="contained"
                fullWidth
                disabled={savingJumuahPdf}
                startIcon={savingJumuahPdf ? <CircularProgress size={18} color="inherit" /> : <SaveRoundedIcon />}
                onClick={handleSaveJumuahAndPdf}
                sx={{
                  height: 40,
                  fontWeight: 700,
                  textTransform: 'none',
                  borderRadius: 2,
                  backgroundColor: '#0284C7',
                  '&:hover': { backgroundColor: '#0369A1' },
                }}
              >
                {savingJumuahPdf ? 'Saving...' : 'Save Jumu’ah & PDF'}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* ASTRONOMICAL SOLAR CALCULATION PARAMETERS */}
      {settings && (
        <Card
          sx={{
            borderRadius: 3,
            border: '1px solid #E2E8F0',
            boxShadow: '0 4px 16px -2px rgba(15, 23, 42, 0.05)',
            overflow: 'hidden',
            backgroundColor: '#FFFFFF',
          }}
        >
          <Box
            sx={{
              px: 3,
              py: 2.25,
              backgroundColor: '#F8FAFC',
              borderBottom: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                backgroundColor: '#F3E8FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#7E22CE',
              }}
            >
              <TuneRoundedIcon fontSize="small" />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: '#0F172A' }}>
                Astronomical Solar Calculation Parameters (Birmingham, UK)
              </Typography>
              <Typography sx={{ fontSize: '0.78rem', color: '#64748B' }}>
                Governs 365-day automated prayer begins times and fallback congregation offsets when no manual override exists.
              </Typography>
            </Box>
          </Box>

          <CardContent sx={{ p: 3 }}>
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={4}>
                <Typography sx={{ fontWeight: 700, fontSize: '0.84rem', color: '#1E293B', mb: 0.75 }}>
                  Centre Latitude
                </Typography>
                <TextField
                  type="number"
                  size="small"
                  fullWidth
                  value={settings.latitude}
                  onChange={(e) => setSettings({ ...settings, latitude: parseFloat(e.target.value) })}
                  helperText="Default: 52.457800 (Balsall Heath)"
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <Typography sx={{ fontWeight: 700, fontSize: '0.84rem', color: '#1E293B', mb: 0.75 }}>
                  Centre Longitude
                </Typography>
                <TextField
                  type="number"
                  size="small"
                  fullWidth
                  value={settings.longitude}
                  onChange={(e) => setSettings({ ...settings, longitude: parseFloat(e.target.value) })}
                  helperText="Default: -1.890400 (Balsall Heath)"
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <Typography sx={{ fontWeight: 700, fontSize: '0.84rem', color: '#1E293B', mb: 0.75 }}>
                  Asr Juristic Method
                </Typography>
                <TextField
                  select
                  size="small"
                  fullWidth
                  value={settings.asrJuristic}
                  onChange={(e) => setSettings({ ...settings, asrJuristic: e.target.value })}
                  helperText="Hanafi shadow ratio (standard for UK mosques)"
                >
                  <MenuItem value="HANAFI">Hanafi (Standard for UK/Birmingham)</MenuItem>
                  <MenuItem value="SHAFI">Shafi / Standard (1x Shadow)</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
                <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', color: '#0F172A', mb: 1.5 }}>
                  Automated Congregation (Iqamah) Offsets (Minutes After Adhan)
                </Typography>
              </Grid>

              {[
                { key: 'fajrIqamahOffsetMins', label: 'Fajr Offset (Mins)' },
                { key: 'dhuhrIqamahOffsetMins', label: 'Dhuhr Offset (Mins)' },
                { key: 'asrIqamahOffsetMins', label: 'Asr Offset (Mins)' },
                { key: 'maghribIqamahOffsetMins', label: 'Maghrib Offset (Mins)' },
                { key: 'ishaIqamahOffsetMins', label: 'Isha Offset (Mins)' },
              ].map((off) => (
                <Grid item xs={6} sm={2.4} key={off.key}>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.84rem', color: '#1E293B', mb: 0.75 }}>
                    {off.label}
                  </Typography>
                  <TextField
                    type="number"
                    size="small"
                    fullWidth
                    value={settings[off.key]}
                    onChange={(e) => setSettings({ ...settings, [off.key]: parseInt(e.target.value, 10) })}
                  />
                </Grid>
              ))}
            </Grid>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                disabled={savingSettings}
                startIcon={savingSettings ? <CircularProgress size={18} color="inherit" /> : <SaveRoundedIcon />}
                onClick={handleSaveSettings}
                sx={{
                  fontWeight: 700,
                  textTransform: 'none',
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  backgroundColor: '#0284C7',
                  '&:hover': { backgroundColor: '#0369A1' },
                }}
              >
                {savingSettings ? 'Updating...' : 'Update Calculation Parameters'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      <ConfirmDeleteModal
        open={deleteModal.open}
        onClose={() => setDeleteModal((prev) => ({ ...prev, open: false }))}
        onConfirm={handleConfirmDeleteOverride}
        title="Remove Timetable Override"
        itemName={deleteModal.date}
        description={`Remove timetable override for ${deleteModal.date}? Astronomical prayer calculations will automatically resume for this day.`}
        loading={deleteModal.loading}
        confirmText="Remove Override"
      />
    </Box>
  );
}
