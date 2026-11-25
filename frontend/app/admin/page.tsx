'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAdminAuth } from './AdminAuthContext';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Divider,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Avatar,
} from '@mui/material';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import EventIcon from '@mui/icons-material/Event';
import CampaignIcon from '@mui/icons-material/Campaign';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AddIcon from '@mui/icons-material/Add';
import PermMediaIcon from '@mui/icons-material/PermMedia';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import SettingsIcon from '@mui/icons-material/Settings';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import VideocamIcon from '@mui/icons-material/Videocam';
import SendIcon from '@mui/icons-material/Send';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';

interface ContactMessage {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface Announcement {
  id: string;
  title: string;
  badgeText?: string;
  isPinned: boolean;
  isUrgent: boolean;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const { admin } = useAdminAuth();

  const [stats, setStats] = useState({
    activitiesCount: 0,
    eventsCount: 0,
    announcementsCount: 0,
    messagesCount: 0,
    unreadMessagesCount: 0,
    galleryCount: 0,
  });

  const [recentMessages, setRecentMessages] = useState<ContactMessage[]>([]);
  const [recentAnnouncements, setRecentAnnouncements] = useState<Announcement[]>([]);
  const [activeMessage, setActiveMessage] = useState<ContactMessage | null>(null);
  const [todayPrayer, setTodayPrayer] = useState<any>(null);
  const [siteSettings, setSiteSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [actRes, evRes, annRes, msgRes, prayerRes, settingsRes, galleryRes] = await Promise.all([
          fetch('/api/v1/admin/activities', { credentials: 'include' }).catch(() => null),
          fetch('/api/v1/admin/events', { credentials: 'include' }).catch(() => null),
          fetch('/api/v1/admin/announcements', { credentials: 'include' }).catch(() => null),
          fetch('/api/v1/admin/contact-messages', { credentials: 'include' }).catch(() => null),
          fetch('/api/v1/prayer-times/today').catch(() => null),
          fetch('/api/v1/site-settings').catch(() => null),
          fetch('/api/v1/media/gallery').catch(() => null),
        ]);

        const activities = actRes && actRes.ok ? await actRes.json() : [];
        const events = evRes && evRes.ok ? await evRes.json() : [];
        const announcements = annRes && annRes.ok ? await annRes.json() : [];
        const messages = msgRes && msgRes.ok ? await msgRes.json() : [];
        const prayerData = prayerRes && prayerRes.ok ? await prayerRes.json() : null;
        const settingsData = settingsRes && settingsRes.ok ? await settingsRes.json() : {};
        const galleryData = galleryRes && galleryRes.ok ? await galleryRes.json() : [];

        const unread = Array.isArray(messages) ? messages.filter((m: any) => !m.isRead).length : 0;

        setStats({
          activitiesCount: Array.isArray(activities) ? activities.length : 0,
          eventsCount: Array.isArray(events) ? events.length : 0,
          announcementsCount: Array.isArray(announcements) ? announcements.length : 0,
          messagesCount: Array.isArray(messages) ? messages.length : 0,
          unreadMessagesCount: unread,
          galleryCount: Array.isArray(galleryData) ? galleryData.length : 0,
        });

        if (Array.isArray(messages)) {
          setRecentMessages(messages.slice(0, 5));
        }
        if (Array.isArray(announcements)) {
          setRecentAnnouncements(announcements.slice(0, 4));
        }
        if (prayerData) {
          setTodayPrayer(prayerData);
        }
        if (settingsData) {
          setSiteSettings(settingsData);
        }
      } catch (e) {
        console.warn('Dashboard statistics load error:', e);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const markMessageAsRead = async (id: string) => {
    try {
      await fetch(`/api/v1/admin/contact-messages/${id}/read`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ isRead: true }),
      });
      setRecentMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, isRead: true } : m))
      );
      setStats((prev) => ({
        ...prev,
        unreadMessagesCount: Math.max(0, prev.unreadMessagesCount - 1),
      }));
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress sx={{ color: '#3988CA' }} />
      </Box>
    );
  }

  const statCards = [
    {
      title: 'Community Programmes',
      subtitle: 'Training, STEM & Madrasah',
      count: stats.activitiesCount,
      href: '/admin/activities',
      icon: VolunteerActivismIcon,
      color: '#0284C7',
      bgColor: '#E0F2FE',
      status: 'Active on Website',
    },
    {
      title: 'Events & Courses',
      subtitle: 'Upcoming gatherings & lectures',
      count: stats.eventsCount,
      href: '/admin/events',
      icon: EventIcon,
      color: '#6366F1',
      bgColor: '#EEF2FF',
      status: 'Public Registration',
    },
    {
      title: 'Active Notices',
      subtitle: 'Public alert & ticker banners',
      count: stats.announcementsCount,
      href: '/admin/announcements',
      icon: CampaignIcon,
      color: '#D97706',
      bgColor: '#FEF3C7',
      status: 'Live on Homepage',
    },
    {
      title: 'Community Inquiries',
      subtitle: `${stats.unreadMessagesCount} unread message${stats.unreadMessagesCount === 1 ? '' : 's'}`,
      count: stats.messagesCount,
      href: '/admin/contact-messages',
      icon: EmailIcon,
      color: stats.unreadMessagesCount > 0 ? '#E11D48' : '#059669',
      bgColor: stats.unreadMessagesCount > 0 ? '#FFE4E6' : '#ECFDF5',
      badge: stats.unreadMessagesCount > 0 ? `${stats.unreadMessagesCount} New` : undefined,
      status: stats.unreadMessagesCount > 0 ? 'Requires Attention' : 'All Inquiries Addressed',
    },
    {
      title: 'Gallery & Media',
      subtitle: 'Curated photos & video tour',
      count: stats.galleryCount,
      href: '/admin/media',
      icon: PermMediaIcon,
      color: '#0D9488',
      bgColor: '#CCFBF1',
      status: 'Live on /gallery',
    },
  ];

  return (
    <Box sx={{ maxWidth: 1280, mx: 'auto', pb: 6 }}>
      {/* ============================================================== */}
      {/* 1. EXECUTIVE COMMAND HEADER */}
      {/* ============================================================== */}
      <Box
        sx={{
          p: { xs: 2.5, md: 3 },
          borderRadius: '20px',
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          boxShadow: '0 2px 10px rgba(15,23,42,0.03)',
          mb: 3.5,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          gap: 2.5,
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 0.5, flexWrap: 'wrap' }}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
              Welcome back, {admin?.fullName || 'Super Admin'}
            </Typography>
            <Chip
              icon={<CheckCircleIcon sx={{ fontSize: '14px !important', color: '#16A34A' }} />}
              label="Live Production Active"
              size="small"
              sx={{
                fontSize: '0.72rem',
                fontWeight: 700,
                backgroundColor: '#DCFCE7',
                color: '#15803D',
                borderRadius: '9999px',
              }}
            />
          </Box>
          <Typography variant="body2" sx={{ color: '#64748B' }}>
            Al Falah Community Support Centre • 89 Tindal Street, Balsall Heath, Birmingham B12 9QU • Charity #1150221
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            size="small"
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            endIcon={<OpenInNewIcon fontSize="small" />}
            sx={{
              borderColor: '#CBD5E1',
              color: '#334155',
              textTransform: 'none',
              fontWeight: 700,
              borderRadius: '9999px',
              px: 2,
            }}
          >
            Open Live Website
          </Button>

          <Button
            variant="contained"
            size="small"
            href="/admin/announcements"
            startIcon={<AddIcon fontSize="small" />}
            sx={{
              backgroundColor: '#3988CA',
              color: '#ffffff',
              textTransform: 'none',
              fontWeight: 700,
              borderRadius: '9999px',
              px: 2.2,
              boxShadow: 'none',
              '&:hover': { backgroundColor: '#2b6ea6', boxShadow: 'none' },
            }}
          >
            Post Announcement
          </Button>
        </Box>
      </Box>

      {/* ============================================================== */}
      {/* 2. TOP METRIC CARDS (5 KPIs) */}
      {/* ============================================================== */}
      <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Grid item xs={12} sm={6} md={2.4} key={card.title}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: '16px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 2px 8px rgba(15,23,42,0.03)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 18px rgba(15,23,42,0.06)',
                  },
                }}
              >
                <CardContent sx={{ flex: 1, p: 2.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                    <Box
                      sx={{
                        width: 42,
                        height: 42,
                        borderRadius: '12px',
                        backgroundColor: card.bgColor,
                        color: card.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon fontSize="small" />
                    </Box>

                    {card.badge && (
                      <Chip
                        label={card.badge}
                        size="small"
                        sx={{
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          height: 20,
                          backgroundColor: '#FFE4E6',
                          color: '#E11D48',
                        }}
                      />
                    )}
                  </Box>

                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A', mb: 0.25, letterSpacing: '-0.02em' }}>
                    {card.count}
                  </Typography>

                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0F172A', lineHeight: 1.3 }}>
                    {card.title}
                  </Typography>

                  <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mt: 0.25 }}>
                    {card.subtitle}
                  </Typography>
                </CardContent>

                <Box
                  sx={{
                    px: 2,
                    py: 1,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: '1px solid #F1F5F9',
                    backgroundColor: '#F8FAFC',
                  }}
                >
                  <Typography variant="caption" sx={{ fontWeight: 600, color: '#64748B' }}>
                    {card.status}
                  </Typography>

                  <Link href={card.href} style={{ textDecoration: 'none' }}>
                    <Button
                      size="small"
                      endIcon={<ArrowForwardIcon sx={{ fontSize: 13 }} />}
                      sx={{
                        textTransform: 'none',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: '#3988CA',
                        p: 0,
                        minWidth: 'auto',
                      }}
                    >
                      Manage
                    </Button>
                  </Link>
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* ============================================================== */}
      {/* 3. MOSQUE OPERATIONAL PULSE & TODAY'S PRAYER TIMETABLE */}
      {/* ============================================================== */}
      <Card
        sx={{
          mb: 3.5,
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 2px 10px rgba(15,23,42,0.03)',
          background: 'linear-gradient(135deg, #F0F9FF 0%, #FFFFFF 100%)',
        }}
      >
        <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '10px',
                  backgroundColor: '#3988CA',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <AccessTimeFilledIcon fontSize="small" />
              </Box>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0F172A' }}>
                  Today's Congregational Prayer Timetable
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748B' }}>
                  Live Birmingham schedule syncing directly to the homepage and worshippers' mobile display.
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
              <Chip
                label={`Friday Jumu'ah: ${siteSettings.jumuah_time || '13:00'}`}
                size="small"
                sx={{
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  backgroundColor: '#DCEEFF',
                  color: '#0284C7',
                }}
              />
              <Link href="/admin/prayer-times" style={{ textDecoration: 'none' }}>
                <Button
                  size="small"
                  variant="outlined"
                  endIcon={<ArrowForwardIcon fontSize="small" />}
                  sx={{
                    borderRadius: '8px',
                    borderColor: '#3988CA',
                    color: '#3988CA',
                    textTransform: 'none',
                    fontWeight: 700,
                  }}
                >
                  Manage Timetable & PDF
                </Button>
              </Link>
            </Box>
          </Box>

          {/* Prayer Times Strip */}
          <Grid container spacing={1.5}>
            {[
              { name: 'Fajr', begins: todayPrayer?.fajrAdhan || '06:03 AM', jamaah: todayPrayer?.fajrIqamah || '06:30 AM' },
              { name: 'Sunrise', begins: todayPrayer?.sunrise || '07:46 AM', jamaah: 'Shuruq' },
              { name: 'Dhuhr', begins: todayPrayer?.dhuhrAdhan || '12:10 PM', jamaah: todayPrayer?.dhuhrIqamah || '12:45 PM' },
              { name: 'Asr', begins: todayPrayer?.asrAdhan || '02:14 PM', jamaah: todayPrayer?.asrIqamah || '02:30 PM' },
              { name: 'Maghrib', begins: todayPrayer?.maghribAdhan || '04:13 PM', jamaah: todayPrayer?.maghribIqamah || '04:18 PM' },
              { name: 'Isha', begins: todayPrayer?.ishaAdhan || '06:05 PM', jamaah: todayPrayer?.ishaIqamah || '07:00 PM' },
            ].map((p) => (
              <Grid item xs={6} sm={4} md={2} key={p.name}>
                <Box
                  sx={{
                    p: 1.5,
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    border: '1px solid #E2E8F0',
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                    {p.name}
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0F172A', my: 0.25 }}>
                    {p.jamaah}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.68rem', display: 'block' }}>
                    Begins: {p.begins}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* ============================================================== */}
      {/* 4. QUICK MANAGEMENT SHORTCUT LAUNCHPAD */}
      {/* ============================================================== */}
      <Card sx={{ mb: 3.5, borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(15,23,42,0.03)' }}>
        <CardContent sx={{ p: 2.5 }}>
          <Typography
            variant="caption"
            sx={{ fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', mb: 1.5 }}
          >
            Quick Management Shortcuts
          </Typography>

          <Grid container spacing={1.5}>
            {[
              { label: 'Post New Alert', icon: CampaignIcon, href: '/admin/announcements' },
              { label: 'Adjust Iqamah Times', icon: AccessTimeFilledIcon, href: '/admin/prayer-times' },
              { label: 'Add Community Activity', icon: VolunteerActivismIcon, href: '/admin/activities' },
              { label: 'Schedule Event / Course', icon: EventIcon, href: '/admin/events' },
              { label: 'Curate Gallery Photos', icon: PermMediaIcon, href: '/admin/media' },
              { label: 'Mosque Legal & Contact', icon: SettingsIcon, href: '/admin/site-settings' },
            ].map((shortcut) => {
              const Icon = shortcut.icon;
              return (
                <Grid item xs={6} sm={4} md={2} key={shortcut.label}>
                  <Link href={shortcut.href} style={{ textDecoration: 'none' }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      size="small"
                      startIcon={<Icon sx={{ fontSize: 16 }} />}
                      sx={{
                        py: 1.25,
                        borderRadius: '10px',
                        borderColor: '#E2E8F0',
                        color: '#334155',
                        textTransform: 'none',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        backgroundColor: '#FFFFFF',
                        '&:hover': {
                          borderColor: '#3988CA',
                          backgroundColor: '#F0F9FF',
                          color: '#0284C7',
                        },
                      }}
                    >
                      {shortcut.label}
                    </Button>
                  </Link>
                </Grid>
              );
            })}
          </Grid>
        </CardContent>
      </Card>

      {/* ============================================================== */}
      {/* 5. SPLIT INTELLIGENCE ROW (INQUIRIES + MOSQUE DETAILS) */}
      {/* ============================================================== */}
      <Grid container spacing={3}>
        {/* Left Column: Recent Community Inquiries (Live Stream) */}
        <Grid item xs={12} md={7}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: '16px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 2px 8px rgba(15,23,42,0.03)',
            }}
          >
            <CardContent sx={{ p: 2.5, flex: 1, display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', fontSize: '1.05rem' }}>
                    Recent Community Inquiries
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748B' }}>
                    Direct messages submitted via the public contact form
                  </Typography>
                </Box>

                <Link href="/admin/contact-messages" style={{ textDecoration: 'none' }}>
                  <Button
                    size="small"
                    endIcon={<ArrowForwardIcon fontSize="small" />}
                    sx={{ textTransform: 'none', fontWeight: 700, color: '#3988CA' }}
                  >
                    View All ({stats.messagesCount})
                  </Button>
                </Link>
              </Box>

              <Divider sx={{ mb: 1.5 }} />

              {recentMessages.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {recentMessages.map((msg) => {
                    const initials = msg.fullName
                      ? msg.fullName
                          .split(' ')
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join('')
                          .toUpperCase()
                      : '?';

                    return (
                      <Box
                        key={msg.id}
                        onClick={() => {
                          setActiveMessage(msg);
                          if (!msg.isRead) markMessageAsRead(msg.id);
                        }}
                        sx={{
                          p: 1.5,
                          borderRadius: '12px',
                          border: '1px solid',
                          borderColor: msg.isRead ? '#E2E8F0' : '#BAE6FD',
                          backgroundColor: msg.isRead ? '#FFFFFF' : '#F0F9FF',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 1.5,
                          '&:hover': {
                            backgroundColor: '#F8FAFC',
                            borderColor: '#3988CA',
                          },
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 38,
                            height: 38,
                            fontSize: '0.82rem',
                            fontWeight: 800,
                            backgroundColor: msg.isRead ? '#E2E8F0' : '#3988CA',
                            color: msg.isRead ? '#475569' : '#FFFFFF',
                          }}
                        >
                          {initials}
                        </Avatar>

                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.25 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
                              <Typography variant="body2" sx={{ fontWeight: msg.isRead ? 600 : 800, color: '#0F172A' }}>
                                {msg.fullName}
                              </Typography>
                              {!msg.isRead && (
                                <Chip
                                  label="New"
                                  size="small"
                                  sx={{
                                    height: 18,
                                    fontSize: '0.65rem',
                                    fontWeight: 800,
                                    backgroundColor: '#FFE4E6',
                                    color: '#E11D48',
                                  }}
                                />
                              )}
                            </Box>

                            <Typography variant="caption" sx={{ color: '#94A3B8', flexShrink: 0 }}>
                              {new Date(msg.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                            </Typography>
                          </Box>

                          <Typography
                            variant="caption"
                            sx={{
                              display: 'block',
                              color: '#334155',
                              fontWeight: 600,
                              mb: 0.25,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            Subject: {msg.subject || 'General Inquiry'}
                          </Typography>

                          <Typography
                            variant="caption"
                            sx={{
                              color: '#64748B',
                              display: '-webkit-box',
                              WebkitLineClamp: 1,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {msg.message}
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              ) : (
                <Box sx={{ p: 4, textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <MarkEmailReadIcon sx={{ fontSize: 36, color: '#CBD5E1', mx: 'auto', mb: 1 }} />
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748B' }}>
                    No community inquiries pending.
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column: Mosque Credentials & Notices */}
        <Grid item xs={12} md={5}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Mosque Identity & Compliance Card */}
            <Card
              sx={{
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 2px 8px rgba(15,23,42,0.03)',
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', fontSize: '1.05rem' }}>
                    Mosque Identity & Details
                  </Typography>
                  <Link href="/admin/site-settings" style={{ textDecoration: 'none' }}>
                    <Button size="small" sx={{ textTransform: 'none', fontWeight: 700, color: '#3988CA' }}>
                      Edit
                    </Button>
                  </Link>
                </Box>

                <Divider sx={{ mb: 2 }} />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Box sx={{ display: 'flex', gap: 1.25, alignItems: 'flex-start' }}>
                    <LocationOnIcon sx={{ color: '#3988CA', fontSize: 18, mt: 0.2 }} />
                    <Box>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748B', display: 'block' }}>
                        Physical Centre Address
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#0F172A' }}>
                        {siteSettings.org_address || '89 Tindal Street, Balsall Heath, Birmingham B12 9QU'}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1.25, alignItems: 'flex-start' }}>
                    <PhoneIcon sx={{ color: '#3988CA', fontSize: 18, mt: 0.2 }} />
                    <Box>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748B', display: 'block' }}>
                        Helpline / Telephone
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#0F172A' }}>
                        {siteSettings.org_phone || '07782 958305'}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1.25, alignItems: 'flex-start' }}>
                    <MailOutlineIcon sx={{ color: '#3988CA', fontSize: 18, mt: 0.2 }} />
                    <Box>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748B', display: 'block' }}>
                        Official Email
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#0F172A' }}>
                        {siteSettings.org_email || 'alfalahcsc@hotmail.com'}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1.25, alignItems: 'flex-start' }}>
                    <VerifiedUserIcon sx={{ color: '#16A34A', fontSize: 18, mt: 0.2 }} />
                    <Box>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748B', display: 'block' }}>
                        Charity Commission Registration
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#15803D' }}>
                        UK Registered Charity #{siteSettings.org_charity_number || '1150221'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Active Announcements Snapshot */}
            <Card
              sx={{
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 2px 8px rgba(15,23,42,0.03)',
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', fontSize: '1.05rem' }}>
                    Live Announcements
                  </Typography>
                  <Link href="/admin/announcements" style={{ textDecoration: 'none' }}>
                    <Button size="small" sx={{ textTransform: 'none', fontWeight: 700, color: '#3988CA' }}>
                      Manage
                    </Button>
                  </Link>
                </Box>

                <Divider sx={{ mb: 1.5 }} />

                {recentAnnouncements.length > 0 ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {recentAnnouncements.map((ann) => (
                      <Box
                        key={ann.id}
                        sx={{
                          p: 1.25,
                          borderRadius: '10px',
                          backgroundColor: '#F8FAFC',
                          border: '1px solid #E2E8F0',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.25,
                        }}
                      >
                        <Chip
                          label={ann.badgeText || 'Notice'}
                          size="small"
                          sx={{
                            fontSize: '0.68rem',
                            fontWeight: 800,
                            height: 20,
                            backgroundColor: '#DCEEFF',
                            color: '#0284C7',
                          }}
                        />
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 700,
                            color: '#0F172A',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            flex: 1,
                          }}
                        >
                          {ann.title}
                        </Typography>
                        {ann.isPinned && (
                          <Typography variant="caption" sx={{ color: '#D97706', fontWeight: 700 }}>
                            📌 Pinned
                          </Typography>
                        )}
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" sx={{ color: '#64748B', py: 1 }}>
                    No announcements currently posted.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>

      {/* ============================================================== */}
      {/* 6. MODAL: DETAILED INQUIRY VIEWER & REPLY LAUNCHER */}
      {/* ============================================================== */}
      {activeMessage && (
        <Dialog
          open
          onClose={() => setActiveMessage(null)}
          maxWidth="sm"
          fullWidth
          PaperProps={{ sx: { borderRadius: '16px', p: 1 } }}
        >
          <DialogTitle sx={{ fontWeight: 800, color: '#0F172A', pb: 1 }}>
            Inquiry from {activeMessage.fullName}
          </DialogTitle>
          <DialogContent sx={{ pt: 1 }}>
            <Box sx={{ mb: 2, p: 2, borderRadius: '12px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
              <Grid container spacing={1}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>
                    <strong>Email:</strong> {activeMessage.email}
                  </Typography>
                </Grid>
                {activeMessage.phone && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>
                      <strong>Phone:</strong> {activeMessage.phone}
                    </Typography>
                  </Grid>
                )}
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>
                    <strong>Subject:</strong> {activeMessage.subject || 'General Inquiry'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>
                    <strong>Received:</strong> {new Date(activeMessage.createdAt).toLocaleString('en-GB')}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0F172A', mb: 0.75 }}>
              Message Content:
            </Typography>
            <Box
              sx={{
                p: 2,
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                backgroundColor: '#FFFFFF',
                whiteSpace: 'pre-line',
                fontSize: '0.88rem',
                color: '#334155',
                lineHeight: 1.6,
              }}
            >
              {activeMessage.message}
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2, gap: 1 }}>
            <Button
              variant="outlined"
              onClick={() => setActiveMessage(null)}
              sx={{ textTransform: 'none', fontWeight: 600, color: '#64748B' }}
            >
              Close
            </Button>
            <Button
              variant="contained"
              component="a"
              href={`mailto:${activeMessage.email}?subject=Re: ${encodeURIComponent(activeMessage.subject || 'Al Falah Community Inquiry')}`}
              startIcon={<SendIcon sx={{ fontSize: 16 }} />}
              sx={{
                backgroundColor: '#3988CA',
                borderRadius: '10px',
                textTransform: 'none',
                fontWeight: 700,
                px: 2.5,
                boxShadow: 'none',
                '&:hover': { backgroundColor: '#2b6ea6', boxShadow: 'none' },
              }}
            >
              Reply via Email
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}
