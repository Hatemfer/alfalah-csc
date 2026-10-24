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
} from '@mui/material';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import EventIcon from '@mui/icons-material/Event';
import CampaignIcon from '@mui/icons-material/Campaign';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AddIcon from '@mui/icons-material/Add';

export default function AdminDashboardPage() {
  const { admin } = useAdminAuth();
  const [stats, setStats] = useState({
    activitiesCount: 0,
    eventsCount: 0,
    announcementsCount: 0,
    messagesCount: 0,
  });
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [actRes, evRes, annRes, msgRes, logRes] = await Promise.all([
          fetch('/api/v1/admin/activities', { credentials: 'include' }),
          fetch('/api/v1/admin/events', { credentials: 'include' }),
          fetch('/api/v1/admin/announcements', { credentials: 'include' }),
          fetch('/api/v1/admin/contact-messages', { credentials: 'include' }),
          fetch('/api/v1/admin/audit-logs?limit=5', { credentials: 'include' }),
        ]);

        const activities = actRes.ok ? await actRes.json() : [];
        const events = evRes.ok ? await evRes.json() : [];
        const announcements = annRes.ok ? await annRes.json() : [];
        const messages = msgRes.ok ? await msgRes.json() : [];
        const logs = logRes.ok ? await logRes.json() : [];

        setStats({
          activitiesCount: activities.length,
          eventsCount: events.length,
          announcementsCount: announcements.length,
          messagesCount: messages.length,
        });
        setRecentLogs(logs);
      } catch (e) {
        console.warn('Dashboard statistics load error:', e);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  const statCards = [
    {
      title: 'Community Programmes',
      count: stats.activitiesCount,
      href: '/admin/activities',
      icon: VolunteerActivismIcon,
      color: '#059669',
    },
    {
      title: 'Events & Courses',
      count: stats.eventsCount,
      href: '/admin/events',
      icon: EventIcon,
      color: '#0284c7',
    },
    {
      title: 'Active Notices',
      count: stats.announcementsCount,
      href: '/admin/announcements',
      icon: CampaignIcon,
      color: '#d97706',
    },
    {
      title: 'Inquiries Received',
      count: stats.messagesCount,
      href: '/admin/contact-messages',
      icon: EmailIcon,
      color: '#7c3aed',
    },
  ];

  return (
    <Box>
      {/* Welcome Banner */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', mb: 0.5 }}>
          Welcome back, {admin?.fullName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Overview of website content, prayer configurations, and community inquiries.
        </Typography>
      </Box>

      {/* KPI Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Grid item xs={12} sm={6} md={3} key={card.title}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 3,
                      backgroundColor: `${card.color}15`,
                      color: card.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon fontSize="medium" />
                  </Box>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800 }}>
                      {card.count}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {card.title}
                    </Typography>
                  </Box>
                </CardContent>
                <Divider />
                <Box sx={{ p: 1, textAlign: 'right' }}>
                  <Link href={card.href} style={{ textDecoration: 'none' }}>
                    <Button size="small" endIcon={<ArrowForwardIcon />}>
                      Manage
                    </Button>
                  </Link>
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Quick Actions & Recent Activity Grid */}
      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid item xs={12} md={5}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Quick CMS Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Link href="/admin/announcements" style={{ textDecoration: 'none' }}>
                  <Button fullWidth variant="contained" startIcon={<AddIcon />}>
                    Post New Announcement
                  </Button>
                </Link>
                <Link href="/admin/prayer-times" style={{ textDecoration: 'none' }}>
                  <Button fullWidth variant="outlined" startIcon={<AccessTimeFilledIcon />}>
                    Update Prayer Iqamah Overrides
                  </Button>
                </Link>
                <Link href="/admin/activities" style={{ textDecoration: 'none' }}>
                  <Button fullWidth variant="outlined" startIcon={<VolunteerActivismIcon />}>
                    Add Community Activity
                  </Button>
                </Link>
                <Link href="/admin/events" style={{ textDecoration: 'none' }}>
                  <Button fullWidth variant="outlined" startIcon={<EventIcon />}>
                    Schedule Upcoming Event
                  </Button>
                </Link>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Audit Logs */}
        <Grid item xs={12} md={7}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Recent Administrative Activity
                </Typography>
                <Link href="/admin/audit-logs" style={{ textDecoration: 'none' }}>
                  <Button size="small">View Full Log</Button>
                </Link>
              </Box>
              <Divider sx={{ mb: 1.5 }} />

              {recentLogs.length > 0 ? (
                <List disablePadding>
                  {recentLogs.map((log) => (
                    <ListItem key={log.id} disableGutters sx={{ py: 1 }}>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip
                              label={log.action}
                              size="small"
                              sx={{ fontSize: '0.7rem', fontWeight: 700 }}
                            />
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {log.entityType}
                            </Typography>
                          </Box>
                        }
                        secondary={`By ${log.adminEmail || 'System'} • ${new Date(log.createdAt).toLocaleString('en-GB')}`}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                  No recent logged actions.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
