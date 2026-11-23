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
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
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

export default function AdminDashboardPage() {
  const { admin } = useAdminAuth();
  const [stats, setStats] = useState({
    activitiesCount: 0,
    eventsCount: 0,
    announcementsCount: 0,
    messagesCount: 0,
    unreadMessagesCount: 0,
  });
  const [recentMessages, setRecentMessages] = useState<any[]>([]);
  const [recentAnnouncements, setRecentAnnouncements] = useState<any[]>([]);
  const [activeMessage, setActiveMessage] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [actRes, evRes, annRes, msgRes] = await Promise.all([
          fetch('/api/v1/admin/activities', { credentials: 'include' }),
          fetch('/api/v1/admin/events', { credentials: 'include' }),
          fetch('/api/v1/admin/announcements', { credentials: 'include' }),
          fetch('/api/v1/admin/contact-messages', { credentials: 'include' }),
        ]);

        const activities = actRes.ok ? await actRes.json() : [];
        const events = evRes.ok ? await evRes.json() : [];
        const announcements = annRes.ok ? await annRes.json() : [];
        const messages = msgRes.ok ? await msgRes.json() : [];

        const unread = Array.isArray(messages) ? messages.filter((m: any) => !m.isRead).length : 0;

        setStats({
          activitiesCount: Array.isArray(activities) ? activities.length : 0,
          eventsCount: Array.isArray(events) ? events.length : 0,
          announcementsCount: Array.isArray(announcements) ? announcements.length : 0,
          messagesCount: Array.isArray(messages) ? messages.length : 0,
          unreadMessagesCount: unread,
        });

        if (Array.isArray(messages)) {
          setRecentMessages(messages.slice(0, 5));
        }
        if (Array.isArray(announcements)) {
          setRecentAnnouncements(announcements.slice(0, 4));
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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  const statCards = [
    {
      title: 'Community Programmes',
      subtitle: 'Training, STEM, Quran',
      count: stats.activitiesCount,
      href: '/admin/activities',
      icon: VolunteerActivismIcon,
      color: '#3988CA',
    },
    {
      title: 'Events & Courses',
      subtitle: 'Upcoming gatherings',
      count: stats.eventsCount,
      href: '/admin/events',
      icon: EventIcon,
      color: '#0284c7',
    },
    {
      title: 'Active Notices',
      subtitle: 'Banners & announcements',
      count: stats.announcementsCount,
      href: '/admin/announcements',
      icon: CampaignIcon,
      color: '#f59e0b',
    },
    {
      title: 'Community Inquiries',
      subtitle: `${stats.unreadMessagesCount} unread messages`,
      count: stats.messagesCount,
      href: '/admin/contact-messages',
      icon: EmailIcon,
      color: stats.unreadMessagesCount > 0 ? '#ef4444' : '#10b981',
      badge: stats.unreadMessagesCount > 0 ? `${stats.unreadMessagesCount} New` : undefined,
    },
  ];

  return (
    <Box>
      {/* Executive Welcome Banner */}
      <Box
        sx={{
          p: { xs: 2.5, md: 3 },
          borderRadius: 3,
          backgroundColor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          mb: 3.5,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          gap: 2,
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              Welcome back, {admin?.fullName || 'Committee'}
            </Typography>
            <Chip
              icon={<CheckCircleIcon sx={{ fontSize: '14px !important', color: '#10b981' }} />}
              label="Live Website Active"
              size="small"
              sx={{
                fontSize: '0.72rem',
                fontWeight: 700,
                backgroundColor: 'rgba(16, 185, 129, 0.08)',
                color: '#059669',
                borderColor: 'rgba(16, 185, 129, 0.2)',
              }}
              variant="outlined"
            />
          </Box>
          <Typography variant="body2" color="text.secondary">
            Al Falah Community Support Centre • 89 Tindal Street, Balsall Heath, Birmingham B12 9QU
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          <Link href="/" target="_blank" style={{ textDecoration: 'none' }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<OpenInNewIcon fontSize="small" />}
              sx={{ borderColor: 'divider', color: 'text.secondary' }}
            >
              Preview Live Site
            </Button>
          </Link>
          <Link href="/admin/announcements" style={{ textDecoration: 'none' }}>
            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon fontSize="small" />}
            >
              Post Announcement
            </Button>
          </Link>
        </Box>
      </Box>

      {/* KPI Stats Cards */}
      <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Grid item xs={12} sm={6} md={3} key={card.title}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flex: 1, p: 2.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                    <Box
                      sx={{
                        p: 1.25,
                        borderRadius: 2.5,
                        backgroundColor: `${card.color}15`,
                        color: card.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon fontSize="medium" />
                    </Box>
                    {card.badge && (
                      <Chip
                        label={card.badge}
                        size="small"
                        color="error"
                        sx={{ fontSize: '0.7rem', fontWeight: 800, height: 22 }}
                      />
                    )}
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.25, letterSpacing: '-0.02em' }}>
                    {card.count}
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    {card.title}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                    {card.subtitle}
                  </Typography>
                </CardContent>
                <Divider />
                <Box sx={{ px: 2, py: 1, display: 'flex', justifyContent: 'flex-end', backgroundColor: 'background.default' }}>
                  <Link href={card.href} style={{ textDecoration: 'none' }}>
                    <Button size="small" endIcon={<ArrowForwardIcon fontSize="inherit" />} sx={{ fontSize: '0.8rem' }}>
                      Manage
                    </Button>
                  </Link>
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Quick CMS Action Strip */}
      <Card sx={{ mb: 3.5, p: 2 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
          Quick Management Shortcuts
        </Typography>
        <Grid container spacing={1.5}>
          <Grid item xs={6} sm={4} md={2.4}>
            <Link href="/admin/announcements" style={{ textDecoration: 'none' }}>
              <Button fullWidth variant="outlined" size="small" startIcon={<CampaignIcon />} sx={{ py: 1, fontSize: '0.82rem' }}>
                New Alert
              </Button>
            </Link>
          </Grid>
          <Grid item xs={6} sm={4} md={2.4}>
            <Link href="/admin/prayer-times" style={{ textDecoration: 'none' }}>
              <Button fullWidth variant="outlined" size="small" startIcon={<AccessTimeFilledIcon />} sx={{ py: 1, fontSize: '0.82rem' }}>
                Iqamah Overrides
              </Button>
            </Link>
          </Grid>
          <Grid item xs={6} sm={4} md={2.4}>
            <Link href="/admin/activities" style={{ textDecoration: 'none' }}>
              <Button fullWidth variant="outlined" size="small" startIcon={<VolunteerActivismIcon />} sx={{ py: 1, fontSize: '0.82rem' }}>
                Add Activity
              </Button>
            </Link>
          </Grid>
          <Grid item xs={6} sm={4} md={2.4}>
            <Link href="/admin/events" style={{ textDecoration: 'none' }}>
              <Button fullWidth variant="outlined" size="small" startIcon={<EventIcon />} sx={{ py: 1, fontSize: '0.82rem' }}>
                Schedule Event
              </Button>
            </Link>
          </Grid>
          <Grid item xs={12} sm={4} md={2.4}>
            <Link href="/admin/media" style={{ textDecoration: 'none' }}>
              <Button fullWidth variant="outlined" size="small" startIcon={<PermMediaIcon />} sx={{ py: 1, fontSize: '0.82rem' }}>
                Upload Media
              </Button>
            </Link>
          </Grid>
        </Grid>
      </Card>

      {/* Two Column Section */}
      <Grid container spacing={3}>
        {/* Left Column: Recent Inquiries */}
        <Grid item xs={12} md={7}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    Recent Community Inquiries
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Messages submitted via the public contact page
                  </Typography>
                </Box>
                <Link href="/admin/contact-messages" style={{ textDecoration: 'none' }}>
                  <Button size="small" endIcon={<ArrowForwardIcon fontSize="small" />}>
                    View All ({stats.messagesCount})
                  </Button>
                </Link>
              </Box>

              <Divider sx={{ mb: 1.5 }} />

              {recentMessages.length > 0 ? (
                <List disablePadding>
                  {recentMessages.map((msg) => (
                    <ListItem
                      key={msg.id}
                      disableGutters
                      sx={{
                        py: 1.25,
                        px: 1.5,
                        borderRadius: 2,
                        mb: 0.5,
                        cursor: 'pointer',
                        '&:hover': { backgroundColor: 'action.hover' },
                        backgroundColor: msg.isRead ? 'transparent' : 'rgba(57, 136, 202, 0.05)',
                        borderLeft: msg.isRead ? '3px solid transparent' : '3px solid #3988CA',
                      }}
                      onClick={() => {
                        setActiveMessage(msg);
                        if (!msg.isRead) markMessageAsRead(msg.id);
                      }}
                    >
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" sx={{ fontWeight: msg.isRead ? 600 : 800 }}>
                              {msg.fullName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(msg.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Typography
                            variant="caption"
                            sx={{
                              color: 'text.secondary',
                              display: '-webkit-box',
                              WebkitLineClamp: 1,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            <strong>{msg.subject}:</strong> {msg.message}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box sx={{ py: 4, textAlign: 'center' }}>
                  <EmailIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1, opacity: 0.5 }} />
                  <Typography variant="body2" color="text.secondary">
                    No inquiries received yet.
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column: Mosque Information & Active Announcements */}
        <Grid item xs={12} md={5}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Mosque Verified Details Card */}
            <Card>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <VerifiedUserIcon color="primary" fontSize="small" />
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    Mosque Identity & Details
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                    <LocationOnIcon fontSize="small" sx={{ color: 'text.secondary', mt: 0.2 }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 600 }}>
                        Official Address
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        89 Tindal Street, Balsall Heath, Birmingham B12 9QU
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                    <PhoneIcon fontSize="small" sx={{ color: 'text.secondary', mt: 0.2 }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 600 }}>
                        Helpline / Telephone
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        07782 958305
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                    <MailOutlineIcon fontSize="small" sx={{ color: 'text.secondary', mt: 0.2 }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 600 }}>
                        Official Email
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        alfalahcsc@hotmail.com
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ pt: 1 }}>
                    <Chip
                      label="UK Registered Charity #1156221"
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ fontWeight: 700, fontSize: '0.75rem' }}
                    />
                  </Box>
                </Box>
              </CardContent>
              <Divider />
              <Box sx={{ p: 1.5, backgroundColor: 'background.default', textAlign: 'right' }}>
                <Link href="/admin/site-settings" style={{ textDecoration: 'none' }}>
                  <Button size="small" endIcon={<ArrowForwardIcon fontSize="inherit" />}>
                    Update Details
                  </Button>
                </Link>
              </Box>
            </Card>

            {/* Active Notices Snapshot */}
            <Card>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    Active Announcements
                  </Typography>
                  <Link href="/admin/announcements" style={{ textDecoration: 'none' }}>
                    <Button size="small">Manage</Button>
                  </Link>
                </Box>
                <Divider sx={{ mb: 1.5 }} />

                {recentAnnouncements.length > 0 ? (
                  <List disablePadding>
                    {recentAnnouncements.map((ann) => (
                      <ListItem key={ann.id} disableGutters sx={{ py: 1 }}>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Chip
                                label={ann.badgeText || 'Notice'}
                                size="small"
                                sx={{ fontSize: '0.65rem', fontWeight: 700, height: 20 }}
                              />
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {ann.title}
                              </Typography>
                            </Box>
                          }
                          secondary={
                            ann.isPinned ? '📌 Pinned to public banner' : 'Standard announcement'
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
                    No announcements posted yet.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>

      {/* Message Detail Dialog */}
      {activeMessage && (
        <Dialog open onClose={() => setActiveMessage(null)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>
            Inquiry from {activeMessage.fullName}
          </DialogTitle>
          <DialogContent sx={{ pt: 1 }}>
            <Box sx={{ mb: 2, p: 1.5, borderRadius: 2, backgroundColor: 'background.default' }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                <strong>Email:</strong> {activeMessage.email}
              </Typography>
              {activeMessage.phone && (
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  <strong>Phone:</strong> {activeMessage.phone}
                </Typography>
              )}
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                <strong>Subject:</strong> {activeMessage.subject}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                <strong>Date:</strong> {new Date(activeMessage.createdAt).toLocaleString('en-GB')}
              </Typography>
            </Box>

            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
              Message Content:
            </Typography>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-line', p: 1.5, border: '1px solid #e2e8f0', borderRadius: 2 }}>
              {activeMessage.message}
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button
              variant="outlined"
              component="a"
              href={`mailto:${activeMessage.email}?subject=Re: ${encodeURIComponent(activeMessage.subject || 'Al Falah Inquiry')}`}
              startIcon={<EmailIcon />}
            >
              Reply via Email
            </Button>
            <Button variant="contained" onClick={() => setActiveMessage(null)}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}
