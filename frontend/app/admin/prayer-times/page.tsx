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
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded';
import UploadFileRoundedIcon from '@mui/icons-material/UploadFileRounded';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
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
  const [savingJumuah, setSavingJumuah] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [jumuahTime, setJumuahTime] = useState('13:00');
  const [timetablePdfUrl, setTimetablePdfUrl] = useState('/downloads/AlFalah-Prayer-Timetable.pdf');

  // PDF Modal States
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [selectedPdfFile, setSelectedPdfFile] = useState<File | null>(null);
  const [deletePdfModalOpen, setDeletePdfModalOpen] = useState(false);
  const [deletingPdfLoading, setDeletingPdfLoading] = useState(false);

  const [deleteModal, setDeleteModal] = useState<{ open: boolean; date: string; loading: boolean }>({
    open: false,
    date: '',
    loading: false,
  });

  const todayIso = new Date().toISOString().slice(0, 10);

  const [formState, setFormState] = useState({
    date: todayIso,
    endDate: todayIso,
    fajrIqamah: '',
    dhuhrIqamah: '',
    asrIqamah: '',
    maghribIqamah: '',
    ishaIqamah: '',
    notes: '',
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
      fajrIqamah: item.fajrIqamah || '',
      dhuhrIqamah: item.dhuhrIqamah || '',
      asrIqamah: item.asrIqamah || '',
      maghribIqamah: item.maghribIqamah || '',
      ishaIqamah: item.ishaIqamah || '',
      notes: item.notes || '',
    });
    window.scrollTo({ top: 340, behavior: 'smooth' });
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
      if (!res.ok) throw new Error('Failed to update calculation settings');
      setFeedback({ type: 'success', message: 'Astronomical calculation parameters updated.' });
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
            ? `Jama'ah schedule applied to ${updatedCount} days (${formState.date} to ${formState.endDate}).`
            : `Jama'ah schedule saved for ${formState.date}.`,
      });
      await loadData();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setSavingOverride(false);
    }
  };

  const handleSaveJumuah = async () => {
    setSavingJumuah(true);
    setFeedback(null);
    try {
      const res = await fetch('/api/v1/admin/site-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ key: 'jumuah_time', value: jumuahTime }),
      });
      if (!res.ok) throw new Error('Failed to update Jumu’ah time');
      setFeedback({ type: 'success', message: `Friday Jumu’ah time updated to ${jumuahTime} (${to12Hour(jumuahTime)}).` });
      await loadData();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setSavingJumuah(false);
    }
  };

  const handleConfirmUploadPdf = async () => {
    if (!selectedPdfFile) return;
    setUploadingPdf(true);
    setFeedback(null);
    try {
      const fd = new FormData();
      fd.append('file', selectedPdfFile);
      const res = await fetch('/api/v1/admin/media/upload', {
        method: 'POST',
        credentials: 'include',
        body: fd,
      });
      if (!res.ok) throw new Error('Failed to upload PDF file');
      const data = await res.json();
      const uploadedUrl = data.url || data.storagePath || data.filePath;
      if (uploadedUrl) {
        const oldUrl = timetablePdfUrl;
        // Automatically delete previous PDF from server disk if it was an uploaded file
        if (oldUrl && oldUrl.startsWith('/uploads/')) {
          try {
            await fetch(`/api/v1/admin/media/by-path?path=${encodeURIComponent(oldUrl)}`, {
              method: 'DELETE',
              credentials: 'include',
            });
          } catch (e) {
            console.warn('Could not clean up previous PDF file:', e);
          }
        }

        await fetch('/api/v1/admin/site-settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ key: 'timetable_pdf_url', value: uploadedUrl }),
        });

        setTimetablePdfUrl(uploadedUrl);
        setPdfModalOpen(false);
        setSelectedPdfFile(null);
        setFeedback({
          type: 'success',
          message: `Published "${selectedPdfFile.name}" as the live Official Timetable PDF. Previous file removed from server storage.`,
        });
        await loadData();
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setUploadingPdf(false);
    }
  };

  const handleConfirmRemovePdf = async () => {
    setDeletingPdfLoading(true);
    setFeedback(null);
    try {
      const oldUrl = timetablePdfUrl;
      await fetch('/api/v1/admin/site-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ key: 'timetable_pdf_url', value: '' }),
      });

      // Delete physical file from storage if uploaded
      if (oldUrl && oldUrl.startsWith('/uploads/')) {
        try {
          await fetch(`/api/v1/admin/media/by-path?path=${encodeURIComponent(oldUrl)}`, {
            method: 'DELETE',
            credentials: 'include',
          });
        } catch (e) {
          console.warn('Could not delete file from disk:', e);
        }
      }

      setTimetablePdfUrl('');
      setDeletePdfModalOpen(false);
      setFeedback({
        type: 'success',
        message: 'Official Timetable PDF removed from website and deleted from storage.',
      });
      await loadData();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setDeletingPdfLoading(false);
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
        message: `Override for ${deleteModal.date} removed. Automatic calculation restored.`,
      });
      setDeleteModal({ open: false, date: '', loading: false });
      await loadData();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
      setDeleteModal((prev) => ({ ...prev, loading: false }));
    }
  };

  const isTodayOverridden = useMemo(() => Boolean(todayData?.isOverridden), [todayData]);

  const pdfDisplayName = useMemo(() => {
    if (!timetablePdfUrl) return '';
    const parts = timetablePdfUrl.split('/');
    return decodeURIComponent(parts[parts.length - 1] || 'Official-Timetable.pdf');
  }, [timetablePdfUrl]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, gap: 2 }}>
        <CircularProgress size={40} thickness={4} sx={{ color: '#0284C7' }} />
        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
          Loading prayer timetable...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 6, maxWidth: 1160, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.02em', mb: 0.25 }}>
            Prayer Times &amp; Timetable
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Adhan times update automatically every day. Manage Jama&apos;ah schedules, Friday Jumu&apos;ah, and the printable PDF below.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          size="small"
          onClick={loadData}
          startIcon={<RefreshRoundedIcon />}
          sx={{
            borderColor: 'divider',
            color: 'text.primary',
            fontWeight: 700,
            textTransform: 'none',
            borderRadius: 2,
            px: 2,
            backgroundColor: 'background.paper',
            '&:hover': { borderColor: '#94A3B8', backgroundColor: 'background.default' },
          }}
        >
          Refresh
        </Button>
      </Box>

      {feedback && (
        <Alert severity={feedback.type} sx={{ mb: 3, borderRadius: 2, fontWeight: 600 }} onClose={() => setFeedback(null)}>
          {feedback.message}
        </Alert>
      )}

      {/* 1. TODAY'S LIVE TIMETABLE */}
      <Card
        sx={{
          mb: 3,
          borderRadius: 3,
          border: '1px solid', borderColor: 'divider',
          boxShadow: '0 2px 10px rgba(15, 23, 42, 0.04)',
          overflow: 'hidden',
          backgroundColor: 'background.paper',
        }}
      >
        <Box
          sx={{
            px: 3,
            py: 1.75,
            backgroundColor: 'background.default',
            borderBottom: '1px solid', borderColor: 'divider',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 1.5,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
            <AccessTimeRoundedIcon sx={{ color: '#0284C7', fontSize: 20 }} />
            <Typography sx={{ fontWeight: 800, fontSize: '0.96rem', color: 'text.primary' }}>
              Today&apos;s Live Timetable
            </Typography>
            <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary', fontWeight: 600 }}>
              ({todayData?.date || todayIso})
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              icon={<CheckCircleRoundedIcon style={{ color: isTodayOverridden ? '#B45309' : '#059669' }} />}
              label={isTodayOverridden ? 'Custom Schedule Active' : 'Auto-Calculated'}
              size="small"
              sx={{
                backgroundColor: isTodayOverridden ? 'rgba(245, 158, 11, 0.16)' : 'rgba(16, 185, 129, 0.16)',
                color: isTodayOverridden ? '#92400E' : '#065F46',
                fontWeight: 700,
                fontSize: '0.74rem',
                border: isTodayOverridden ? '1px solid #FDE68A' : '1px solid #A7F3D0',
              }}
            />

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
              }}
              sx={{ fontWeight: 700, textTransform: 'none', color: '#0284C7', fontSize: '0.8rem' }}
            >
              Load Today into Form
            </Button>
          </Box>
        </Box>

        <CardContent sx={{ p: 2.5 }}>
          <Grid container spacing={1.5}>
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
                    p: 1.75,
                    borderRadius: 2,
                    border: '1px solid', borderColor: 'divider',
                    backgroundColor: item.id === 'sunrise' ? 'background.default' : 'background.paper',
                    textAlign: 'center',
                  }}
                >
                  <Typography sx={{ fontSize: '0.86rem', fontWeight: 800, color: 'text.primary' }}>{item.name}</Typography>
                  <Typography sx={{ fontSize: '0.72rem', color: 'text.secondary', fontWeight: 600, mt: 0.25 }}>
                    Begins {to12Hour(item.adhan)}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '1.15rem',
                      fontWeight: 800,
                      color: item.iqamah === '—' ? '#94A3B8' : '#0284C7',
                      mt: 0.4,
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {item.iqamah === '—' ? '—' : to12Hour(item.iqamah)}
                  </Typography>
                  <Typography sx={{ fontSize: '0.62rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>
                    {item.iqamah === '—' ? 'Shuruq' : 'Jama’ah'}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* 2. FRIDAY JUMU'AH & OFFICIAL TIMETABLE PDF */}
      <Card
        sx={{
          mb: 3,
          borderRadius: 3,
          border: '1px solid', borderColor: 'divider',
          boxShadow: '0 2px 10px rgba(15, 23, 42, 0.04)',
          overflow: 'hidden',
          backgroundColor: 'background.paper',
        }}
      >
        <Box
          sx={{
            px: 3,
            py: 1.75,
            backgroundColor: 'background.default',
            borderBottom: '1px solid', borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            gap: 1.25,
          }}
        >
          <PictureAsPdfRoundedIcon sx={{ color: '#DC2626', fontSize: 20 }} />
          <Typography sx={{ fontWeight: 800, fontSize: '0.96rem', color: 'text.primary' }}>
            Friday Jumu&apos;ah &amp; Printable Timetable PDF
          </Typography>
        </Box>

        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={3} alignItems="stretch">
            {/* Left: Jumu'ah Time */}
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  p: 2.25,
                  borderRadius: 2.5,
                  border: '1px solid', borderColor: 'divider',
                  backgroundColor: 'background.default',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.84rem', color: 'text.primary' }}>
                      Friday Jumu&apos;ah Time
                    </Typography>
                    <Chip
                      label={to12Hour(jumuahTime)}
                      size="small"
                      sx={{ height: 22, fontSize: '0.72rem', fontWeight: 800, backgroundColor: 'rgba(57, 136, 202, 0.16)', color: '#38BDF8' }}
                    />
                  </Box>
                  <TextField
                    type="time"
                    size="small"
                    fullWidth
                    value={jumuahTime}
                    onChange={(e) => setJumuahTime(e.target.value)}
                    sx={{ backgroundColor: 'background.paper' }}
                  />
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  disabled={savingJumuah}
                  onClick={handleSaveJumuah}
                  startIcon={savingJumuah ? <CircularProgress size={16} color="inherit" /> : <SaveRoundedIcon />}
                  sx={{
                    mt: 2,
                    height: 38,
                    fontWeight: 700,
                    textTransform: 'none',
                    borderRadius: 2,
                    backgroundColor: '#0284C7',
                    '&:hover': { backgroundColor: '#0369A1' },
                  }}
                >
                  {savingJumuah ? 'Saving...' : 'Save Jumu’ah Time'}
                </Button>
              </Box>
            </Grid>

            {/* Right: Official PDF File Card */}
            <Grid item xs={12} md={8}>
              <Box
                sx={{
                  p: 2.25,
                  borderRadius: 2.5,
                  border: '1px solid', borderColor: 'divider',
                  backgroundColor: 'background.default',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: 2,
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2, flexWrap: 'wrap' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box
                      sx={{
                        width: 42,
                        height: 42,
                        borderRadius: 2,
                        backgroundColor: timetablePdfUrl ? 'rgba(239, 68, 68, 0.14)' : 'action.selected',
                        color: timetablePdfUrl ? '#DC2626' : '#64748B',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <PictureAsPdfRoundedIcon />
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', color: 'text.primary' }}>
                        Official Bi-Monthly Timetable PDF
                      </Typography>
                      <Typography sx={{ fontSize: '0.78rem', color: timetablePdfUrl ? '#059669' : '#64748B', fontWeight: 600 }}>
                        {timetablePdfUrl ? `Active: ${pdfDisplayName}` : 'No PDF currently published on website'}
                      </Typography>
                    </Box>
                  </Box>

                  {timetablePdfUrl && (
                    <Chip
                      label="Visible on Website"
                      size="small"
                      sx={{ backgroundColor: 'rgba(16, 185, 129, 0.16)', color: '#10B981', fontWeight: 700, fontSize: '0.72rem' }}
                    />
                  )}
                </Box>

                <Box sx={{ display: 'flex', gap: 1.25, flexWrap: 'wrap', alignItems: 'center' }}>
                  <Button
                    variant="contained"
                    onClick={() => {
                      setSelectedPdfFile(null);
                      setPdfModalOpen(true);
                    }}
                    startIcon={<UploadFileRoundedIcon />}
                    sx={{
                      height: 38,
                      px: 2.5,
                      fontWeight: 700,
                      textTransform: 'none',
                      borderRadius: 2,
                      backgroundColor: '#3988CA',
                      '&:hover': { backgroundColor: '#2b6ea6' },
                    }}
                  >
                    {timetablePdfUrl ? 'Upload / Replace PDF' : 'Upload PDF'}
                  </Button>

                  {timetablePdfUrl && (
                    <>
                      <Button
                        component="a"
                        href={timetablePdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="outlined"
                        startIcon={<OpenInNewRoundedIcon />}
                        sx={{
                          height: 38,
                          px: 2,
                          fontWeight: 700,
                          textTransform: 'none',
                          borderRadius: 2,
                          backgroundColor: 'background.paper',
                          borderColor: 'divider',
                          color: 'text.primary',
                        }}
                      >
                        Preview
                      </Button>

                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => setDeletePdfModalOpen(true)}
                        startIcon={<DeleteOutlineRoundedIcon />}
                        sx={{
                          height: 38,
                          px: 2,
                          fontWeight: 700,
                          textTransform: 'none',
                          borderRadius: 2,
                          backgroundColor: 'background.paper',
                          borderColor: 'rgba(239, 68, 68, 0.35)',
                          ml: { sm: 'auto' },
                        }}
                      >
                        Remove PDF
                      </Button>
                    </>
                  )}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* 3. JAMA'AH SCHEDULE (DATE RANGE) */}
      <Card
        sx={{
          mb: 3,
          borderRadius: 3,
          border: '1px solid', borderColor: 'divider',
          boxShadow: '0 2px 10px rgba(15, 23, 42, 0.04)',
          overflow: 'hidden',
          backgroundColor: 'background.paper',
        }}
      >
        <Box
          sx={{
            px: 3,
            py: 1.75,
            backgroundColor: 'background.default',
            borderBottom: '1px solid', borderColor: 'divider',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 1.5,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
            <CalendarMonthRoundedIcon sx={{ color: '#2563EB', fontSize: 20 }} />
            <Typography sx={{ fontWeight: 800, fontSize: '0.96rem', color: 'text.primary' }}>
              Congregation (Jama&apos;ah) Schedule
            </Typography>
          </Box>

          <Chip
            label={`Applying to ${rangeDaysCount} ${rangeDaysCount === 1 ? 'day' : 'days'}`}
            size="small"
            sx={{ backgroundColor: 'rgba(57, 136, 202, 0.16)', color: '#38BDF8', fontWeight: 800, fontSize: '0.74rem' }}
          />
        </Box>

        <CardContent sx={{ p: 3 }}>
          <Box component="form" onSubmit={handleSaveOverride}>
            <Box sx={{ mb: 3, p: 2, backgroundColor: 'background.default', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={3}>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.82rem', color: 'text.primary', mb: 0.75 }}>
                    Start Date
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
                    sx={{ backgroundColor: 'background.paper' }}
                  />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.82rem', color: 'text.primary', mb: 0.75 }}>
                    End Date
                  </Typography>
                  <TextField
                    type="date"
                    size="small"
                    fullWidth
                    inputProps={{ min: formState.date }}
                    value={formState.endDate}
                    onChange={(e) => setFormState({ ...formState, endDate: e.target.value })}
                    sx={{ backgroundColor: 'background.paper' }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.82rem', color: 'text.primary', mb: 0.75 }}>
                    Quick Select
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Button
                      size="small"
                      variant={rangeDaysCount === 1 ? 'contained' : 'outlined'}
                      onClick={() => applyRangePreset(1)}
                      sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.76rem', borderRadius: 2 }}
                    >
                      Today
                    </Button>
                    <Button
                      size="small"
                      variant={rangeDaysCount === 7 ? 'contained' : 'outlined'}
                      onClick={() => applyRangePreset(7)}
                      sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.76rem', borderRadius: 2 }}
                    >
                      7 Days
                    </Button>
                    <Button
                      size="small"
                      variant={rangeDaysCount === 14 ? 'contained' : 'outlined'}
                      onClick={() => applyRangePreset(14)}
                      sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.76rem', borderRadius: 2 }}
                    >
                      14 Days
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={applyRestOfMonthPreset}
                      sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.76rem', borderRadius: 2 }}
                    >
                      Rest of Month
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>

            <Grid container spacing={2} sx={{ mb: 2.5 }}>
              {[
                { key: 'fajrIqamah', label: 'Fajr Jama’ah', ph: '06:45' },
                { key: 'dhuhrIqamah', label: 'Dhuhr Jama’ah', ph: '12:45' },
                { key: 'asrIqamah', label: 'Asr Jama’ah', ph: '14:30' },
                { key: 'maghribIqamah', label: 'Maghrib Jama’ah', ph: '16:03' },
                { key: 'ishaIqamah', label: 'Isha Jama’ah', ph: '19:00' },
              ].map((p) => (
                <Grid item xs={6} sm={2.4} key={p.key}>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.82rem', color: 'text.primary', mb: 0.75 }}>
                    {p.label}
                  </Typography>
                  <TextField
                    size="small"
                    fullWidth
                    placeholder={p.ph}
                    value={(formState as any)[p.key]}
                    onChange={(e) => setFormState({ ...formState, [p.key]: e.target.value })}
                  />
                </Grid>
              ))}
            </Grid>

            <Grid container spacing={2} alignItems="flex-end">
              <Grid item xs={12} sm={8}>
                <Typography sx={{ fontWeight: 700, fontSize: '0.82rem', color: 'text.primary', mb: 0.75 }}>
                  Note (Optional)
                </Typography>
                <TextField
                  size="small"
                  fullWidth
                  placeholder="e.g. Winter Schedule"
                  value={formState.notes}
                  onChange={(e) => setFormState({ ...formState, notes: e.target.value })}
                />
              </Grid>

              <Grid item xs={12} sm={4} sx={{ display: 'flex', gap: 1.25 }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={savingOverride}
                  startIcon={savingOverride ? <CircularProgress size={16} color="inherit" /> : <SaveRoundedIcon />}
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
                      ? `Save (${rangeDaysCount} Days)`
                      : 'Save Schedule'}
                </Button>

                <Button
                  variant="outlined"
                  onClick={() =>
                    setFormState({
                      date: todayIso,
                      endDate: todayIso,
                      fajrIqamah: '',
                      dhuhrIqamah: '',
                      asrIqamah: '',
                      maghribIqamah: '',
                      ishaIqamah: '',
                      notes: '',
                    })
                  }
                  sx={{
                    height: 40,
                    fontWeight: 700,
                    textTransform: 'none',
                    borderRadius: 2,
                    borderColor: 'divider',
                    color: 'text.secondary',
                  }}
                >
                  Clear
                </Button>
              </Grid>
            </Grid>
          </Box>

          {/* Active Overrides Table */}
          {overrides.length > 0 && (
            <Box sx={{ mt: 3.5, pt: 3, borderTop: '1px solid #E2E8F0' }}>
              <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', color: 'text.primary', mb: 1.5 }}>
                Scheduled Overrides ({overrides.length})
              </Typography>
              <TableContainer sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, maxHeight: 320 }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 800, color: 'text.primary', backgroundColor: 'background.default' }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: 'text.primary', backgroundColor: 'background.default' }}>Fajr</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: 'text.primary', backgroundColor: 'background.default' }}>Dhuhr</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: 'text.primary', backgroundColor: 'background.default' }}>Asr</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: 'text.primary', backgroundColor: 'background.default' }}>Maghrib</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: 'text.primary', backgroundColor: 'background.default' }}>Isha</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: 'text.primary', backgroundColor: 'background.default' }}>Note</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, color: 'text.primary', backgroundColor: 'background.default', pr: 2 }}>
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
                            backgroundColor: isToday ? 'rgba(57, 136, 202, 0.12)' : 'inherit',
                            '&:hover': { backgroundColor: isToday ? 'rgba(57, 136, 202, 0.2)' : 'action.hover' },
                          }}
                        >
                          <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <span>{o.date}</span>
                              {isToday && (
                                <Chip
                                  label="Today"
                                  size="small"
                                  sx={{ height: 18, fontSize: '0.66rem', fontWeight: 800, backgroundColor: '#0284C7', color: '#FFFFFF' }}
                                />
                              )}
                            </Box>
                          </TableCell>
                          <TableCell sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{o.fajrIqamah || '—'}</TableCell>
                          <TableCell sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{o.dhuhrIqamah || '—'}</TableCell>
                          <TableCell sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{o.asrIqamah || '—'}</TableCell>
                          <TableCell sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{o.maghribIqamah || '—'}</TableCell>
                          <TableCell sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{o.ishaIqamah || '—'}</TableCell>
                          <TableCell sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>{o.notes || '—'}</TableCell>
                          <TableCell align="right" sx={{ pr: 1.5 }}>
                            <Tooltip title="Edit">
                              <IconButton size="small" onClick={() => handleEditOverride(o)} sx={{ color: '#0284C7', mr: 0.5 }}>
                                <EditOutlinedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Remove">
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
            </Box>
          )}
        </CardContent>
      </Card>

      {/* 4. COLLAPSIBLE ADVANCED ASTRONOMICAL SETTINGS */}
      {settings && (
        <Card
          sx={{
            borderRadius: 3,
            border: '1px solid', borderColor: 'divider',
            boxShadow: 'none',
            overflow: 'hidden',
            backgroundColor: 'background.paper',
          }}
        >
          <Box
            onClick={() => setShowAdvanced(!showAdvanced)}
            sx={{
              px: 3,
              py: 1.75,
              backgroundColor: 'background.default',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
              '&:hover': { backgroundColor: 'action.hover' },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
              <TuneRoundedIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: 'text.primary' }}>
                  Advanced: Astronomical Calculation &amp; Default Offsets
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                  Birmingham coordinates (52.4578, -1.8904) and fallback Iqamah offsets
                </Typography>
              </Box>
            </Box>
            {showAdvanced ? <KeyboardArrowUpRoundedIcon sx={{ color: 'text.secondary' }} /> : <KeyboardArrowDownRoundedIcon sx={{ color: 'text.secondary' }} />}
          </Box>

          <Collapse in={showAdvanced}>
            <Divider />
            <CardContent sx={{ p: 3 }}>
              <Grid container spacing={2.5}>
                <Grid item xs={12} sm={4}>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.82rem', color: 'text.primary', mb: 0.75 }}>
                    Latitude
                  </Typography>
                  <TextField
                    type="number"
                    size="small"
                    fullWidth
                    value={settings.latitude}
                    onChange={(e) => setSettings({ ...settings, latitude: parseFloat(e.target.value) })}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.82rem', color: 'text.primary', mb: 0.75 }}>
                    Longitude
                  </Typography>
                  <TextField
                    type="number"
                    size="small"
                    fullWidth
                    value={settings.longitude}
                    onChange={(e) => setSettings({ ...settings, longitude: parseFloat(e.target.value) })}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.82rem', color: 'text.primary', mb: 0.75 }}>
                    Asr Juristic Method
                  </Typography>
                  <TextField
                    select
                    size="small"
                    fullWidth
                    value={settings.asrJuristic}
                    onChange={(e) => setSettings({ ...settings, asrJuristic: e.target.value })}
                  >
                    <MenuItem value="HANAFI">Hanafi (Standard for UK/Birmingham)</MenuItem>
                    <MenuItem value="SHAFI">Shafi / Standard</MenuItem>
                  </TextField>
                </Grid>

                {[
                  { key: 'fajrIqamahOffsetMins', label: 'Fajr Offset (Mins)' },
                  { key: 'dhuhrIqamahOffsetMins', label: 'Dhuhr Offset (Mins)' },
                  { key: 'asrIqamahOffsetMins', label: 'Asr Offset (Mins)' },
                  { key: 'maghribIqamahOffsetMins', label: 'Maghrib Offset (Mins)' },
                  { key: 'ishaIqamahOffsetMins', label: 'Isha Offset (Mins)' },
                ].map((off) => (
                  <Grid item xs={6} sm={2.4} key={off.key}>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.82rem', color: 'text.primary', mb: 0.75 }}>
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
                  startIcon={savingSettings ? <CircularProgress size={16} color="inherit" /> : <SaveRoundedIcon />}
                  onClick={handleSaveSettings}
                  sx={{
                    fontWeight: 700,
                    textTransform: 'none',
                    borderRadius: 2,
                    px: 3,
                    backgroundColor: '#0284C7',
                    '&:hover': { backgroundColor: '#0369A1' },
                  }}
                >
                  {savingSettings ? 'Saving...' : 'Save Calculation Settings'}
                </Button>
              </Box>
            </CardContent>
          </Collapse>
        </Card>
      )}

      {/* Override Deletion Confirmation Modal */}
      <ConfirmDeleteModal
        open={deleteModal.open}
        onClose={() => setDeleteModal((prev) => ({ ...prev, open: false }))}
        onConfirm={handleConfirmDeleteOverride}
        title="Remove Timetable Override"
        itemName={deleteModal.date}
        description={`Remove timetable override for ${deleteModal.date}? Astronomical calculations will resume for this day.`}
        loading={deleteModal.loading}
        confirmText="Remove Override"
      />

      {/* PDF Removal Confirmation Modal */}
      <ConfirmDeleteModal
        open={deletePdfModalOpen}
        onClose={() => !deletingPdfLoading && setDeletePdfModalOpen(false)}
        onConfirm={handleConfirmRemovePdf}
        title="Remove Official Timetable PDF?"
        itemName={pdfDisplayName || 'Timetable PDF'}
        description="This will remove the timetable download button from the live website and permanently delete the PDF file from server storage."
        loading={deletingPdfLoading}
        confirmText="Remove PDF"
      />

      {/* PDF Upload / Replace Dialog Modal */}
      <Dialog
        open={pdfModalOpen}
        onClose={() => !uploadingPdf && setPdfModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 20px 40px rgba(15, 23, 42, 0.16)',
            p: 1,
          },
        }}
      >
        <DialogTitle sx={{ px: 3, pt: 2.5, pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                backgroundColor: 'rgba(239, 68, 68, 0.14)',
                color: '#DC2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <PictureAsPdfRoundedIcon fontSize="small" />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 800, fontSize: '1.05rem', color: 'text.primary', lineHeight: 1.3 }}>
                {timetablePdfUrl ? 'Replace Official Timetable PDF' : 'Upload Official Timetable PDF'}
              </Typography>
              <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary', mt: 0.25 }}>
                Printable PDF schedule for worshippers on the website.
              </Typography>
            </Box>
          </Box>
          <IconButton size="small" onClick={() => setPdfModalOpen(false)} disabled={uploadingPdf} sx={{ color: '#94A3B8' }}>
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ px: 3, py: 2 }}>
          {/* Current file banner if exists */}
          {timetablePdfUrl && (
            <Box
              sx={{
                mb: 2.25,
                px: 2,
                py: 1.25,
                borderRadius: 2,
                backgroundColor: 'background.default',
                border: '1px solid', borderColor: 'divider',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 1.5,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0, flex: 1 }}>
                <Typography sx={{ fontSize: '0.74rem', fontWeight: 700, color: 'text.secondary', whiteSpace: 'nowrap' }}>
                  Current File:
                </Typography>
                <Typography
                  sx={{
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: 'text.primary',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                  title={pdfDisplayName}
                >
                  {pdfDisplayName}
                </Typography>
              </Box>
              <Button
                component="a"
                href={timetablePdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                variant="text"
                startIcon={<OpenInNewRoundedIcon sx={{ fontSize: 13 }} />}
                sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.78rem', color: '#0284C7', flexShrink: 0 }}
              >
                Preview
              </Button>
            </Box>
          )}

          {/* PDF Dropzone */}
          <input
            id="timetable-pdf-file-input"
            type="file"
            accept="application/pdf"
            style={{ display: 'none' }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setSelectedPdfFile(file);
            }}
          />

          {!selectedPdfFile ? (
            <Box
              onClick={() => document.getElementById('timetable-pdf-file-input')?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files?.[0];
                if (file && file.type === 'application/pdf') {
                  setSelectedPdfFile(file);
                }
              }}
              sx={{
                border: '2px dashed #CBD5E1',
                borderRadius: 2.5,
                p: 3.5,
                textAlign: 'center',
                backgroundColor: 'background.default',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                '&:hover': {
                  borderColor: '#3988CA',
                  backgroundColor: 'rgba(57, 136, 202, 0.12)',
                },
              }}
            >
              <CloudUploadRoundedIcon sx={{ fontSize: 38, color: '#0284C7', mb: 1 }} />
              <Typography sx={{ fontWeight: 800, fontSize: '0.92rem', color: 'text.primary', mb: 0.5 }}>
                Click to browse or drag &amp; drop PDF here
              </Typography>
              <Typography sx={{ fontSize: '0.76rem', color: 'text.secondary' }}>
                Adobe PDF format only (max 10MB)
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                border: '1.5px solid #0284C7',
                borderRadius: 2.5,
                p: 2,
                backgroundColor: 'rgba(57, 136, 202, 0.12)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0, flex: 1 }}>
                <PictureAsPdfRoundedIcon sx={{ color: '#DC2626', fontSize: 32, flexShrink: 0 }} />
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography
                    sx={{
                      fontWeight: 800,
                      fontSize: '0.88rem',
                      color: 'text.primary',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                    title={selectedPdfFile.name}
                  >
                    {selectedPdfFile.name}
                  </Typography>
                  <Typography sx={{ fontSize: '0.74rem', color: 'text.secondary', fontWeight: 600 }}>
                    {(selectedPdfFile.size / 1024 / 1024).toFixed(2)} MB • Ready to publish
                  </Typography>
                </Box>
              </Box>

              <Button
                size="small"
                variant="outlined"
                onClick={() => document.getElementById('timetable-pdf-file-input')?.click()}
                sx={{
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  borderRadius: 2,
                  flexShrink: 0,
                  backgroundColor: 'background.paper',
                  borderColor: '#BAE6FD',
                  color: '#0284C7',
                  '&:hover': { backgroundColor: 'rgba(57, 136, 202, 0.12)', borderColor: '#3988CA' },
                }}
              >
                Change File
              </Button>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5, pt: 1, gap: 1 }}>
          <Button
            variant="outlined"
            onClick={() => setPdfModalOpen(false)}
            disabled={uploadingPdf}
            sx={{ fontWeight: 700, textTransform: 'none', borderRadius: 2, color: 'text.secondary', borderColor: 'divider' }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            disabled={!selectedPdfFile || uploadingPdf}
            onClick={handleConfirmUploadPdf}
            startIcon={uploadingPdf ? <CircularProgress size={16} color="inherit" /> : <UploadFileRoundedIcon />}
            sx={{
              fontWeight: 700,
              textTransform: 'none',
              borderRadius: 2,
              px: 3,
              backgroundColor: '#0284C7',
              '&:hover': { backgroundColor: '#0369A1' },
            }}
          >
            {uploadingPdf ? 'Uploading & Publishing...' : 'Upload & Publish to Website'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
