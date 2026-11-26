'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdminAuth } from './AdminAuthContext';
import { useTheme } from '../../components/ThemeProvider';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Chip,
  Button,
  CircularProgress,
  ListSubheader,
  Tooltip,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import EventIcon from '@mui/icons-material/Event';
import CampaignIcon from '@mui/icons-material/Campaign';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import PermMediaIcon from '@mui/icons-material/PermMedia';
import SettingsIcon from '@mui/icons-material/Settings';
import EmailIcon from '@mui/icons-material/Email';
import HistoryIcon from '@mui/icons-material/History';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import MenuIcon from '@mui/icons-material/Menu';

const DRAWER_WIDTH = 260;

interface NavGroup {
  groupTitle: string;
  items: {
    label: string;
    href: string;
    icon: React.ElementType;
    badgeKey?: 'unreadMessages';
  }[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    groupTitle: 'Overview',
    items: [
      { label: 'Dashboard', href: '/admin', icon: DashboardIcon },
    ],
  },
  {
    groupTitle: 'Community & Content',
    items: [
      { label: 'Announcements & Alerts', href: '/admin/announcements', icon: CampaignIcon },
      { label: 'Activities & Training', href: '/admin/activities', icon: VolunteerActivismIcon },
      { label: 'Events & Courses', href: '/admin/events', icon: EventIcon },
      { label: 'Prayer Times & Iqamah', href: '/admin/prayer-times', icon: AccessTimeFilledIcon },
      { label: 'Gallery & Media', href: '/admin/media', icon: PermMediaIcon },
    ],
  },
  {
    groupTitle: 'Communications',
    items: [
      { label: 'Inquiries Inbox', href: '/admin/contact-messages', icon: EmailIcon, badgeKey: 'unreadMessages' },
    ],
  },
  {
    groupTitle: 'Administration',
    items: [
      { label: 'Mosque Settings', href: '/admin/site-settings', icon: SettingsIcon },
      { label: 'Security Audit Trail', href: '/admin/audit-logs', icon: HistoryIcon },
    ],
  },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { admin, loading, logout } = useAdminAuth();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState<number>(0);

  useEffect(() => {
    async function fetchBadgeCounts() {
      try {
        const res = await fetch('/api/v1/admin/contact-messages', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            const unread = data.filter((m: any) => !m.isRead).length;
            setUnreadMessages(unread);
          }
        }
      } catch (err) {
        // Silently catch badge errors
      }
    }

    if (admin) {
      fetchBadgeCounts();
    }
  }, [admin, pathname]);

  // If on login page, render plain content
  if (pathname === '/admin/login') {
    return <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>{children}</Box>;
  }

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
        }}
      >
        <CircularProgress color="primary" />
        <Typography variant="body2" color="text.secondary">
          Authenticating administrator session...
        </Typography>
      </Box>
    );
  }

  if (!admin) {
    return null;
  }

  // Determine current page title
  let currentPageTitle = 'Administration';
  for (const group of NAV_GROUPS) {
    const found = group.items.find((item) => item.href === pathname);
    if (found) {
      currentPageTitle = found.label;
      break;
    }
  }

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Brand Header */}
      <Box sx={{ p: 2.25, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          component="img"
          src="/images/alfalah-official-emblem.jpg"
          alt="Alfalah Crest"
          sx={{
            width: 42,
            height: 42,
            borderRadius: '50%',
            border: '2px solid #e2e8f0',
            objectFit: 'cover',
          }}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="subtitle1" sx={{ color: 'primary.main', fontWeight: 800, lineHeight: 1.2 }}>
            ALFALAH CMS
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
            Mosque Management
          </Typography>
        </Box>
      </Box>

      <Divider />

      {/* Nav List with Sections */}
      <List sx={{ px: 1.5, py: 1, flex: 1, overflowY: 'auto' }}>
        {NAV_GROUPS.map((group) => (
          <Box key={group.groupTitle} sx={{ mb: 1.5 }}>
            <ListSubheader
              disableSticky
              sx={{
                fontSize: '0.68rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'text.secondary',
                lineHeight: '28px',
                px: 1.5,
                background: 'transparent',
              }}
            >
              {group.groupTitle}
            </ListSubheader>

            {group.items.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              const badgeCount = item.badgeKey === 'unreadMessages' ? unreadMessages : 0;

              return (
                <ListItem key={item.href} disablePadding sx={{ mb: 0.25 }}>
                  <Link href={item.href} style={{ width: '100%', textDecoration: 'none', color: 'inherit' }}>
                    <ListItemButton
                      selected={isActive}
                      onClick={() => setMobileOpen(false)}
                      sx={{
                        borderRadius: 2,
                        py: 0.9,
                        px: 1.5,
                        '&.Mui-selected': {
                          backgroundColor: 'primary.main',
                          color: '#ffffff',
                          '&:hover': {
                            backgroundColor: 'primary.dark',
                          },
                          '& .MuiListItemIcon-root': {
                            color: '#ffffff',
                          },
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 34, color: isActive ? '#ffffff' : 'text.secondary' }}>
                        <Icon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{
                          fontSize: '0.86rem',
                          fontWeight: isActive ? 700 : 500,
                        }}
                      />
                      {badgeCount > 0 && (
                        <Chip
                          label={badgeCount}
                          size="small"
                          color={isActive ? 'default' : 'primary'}
                          sx={{
                            height: 18,
                            fontSize: '0.65rem',
                            fontWeight: 800,
                            backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : undefined,
                            color: isActive ? '#fff' : undefined,
                          }}
                        />
                      )}
                    </ListItemButton>
                  </Link>
                </ListItem>
              );
            })}
          </Box>
        ))}
      </List>

      <Divider />

      {/* Drawer Bottom Actions */}
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Link href="/" target="_blank" style={{ textDecoration: 'none' }}>
          <Button
            fullWidth
            variant="outlined"
            size="small"
            startIcon={<OpenInNewIcon fontSize="small" />}
            sx={{
              color: 'text.secondary',
              borderColor: 'divider',
              fontSize: '0.8rem',
              py: 0.8,
            }}
          >
            Open Public Website
          </Button>
        </Link>
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        width: '100%',
        maxWidth: '100vw',
        overflowX: 'hidden',
        backgroundColor: 'background.default',
      }}
    >
      {/* Top Application Bar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { xs: '100%', md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
          borderBottom: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper',
          color: 'text.primary',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', minHeight: 64, px: { xs: 1.5, sm: 2.5 }, gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0, flex: 1 }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={() => setMobileOpen(!mobileOpen)}
              sx={{ display: { md: 'none' }, flexShrink: 0 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="subtitle1"
              noWrap
              sx={{ fontWeight: 800, color: 'text.primary', fontSize: { xs: '0.95rem', sm: '1rem' } }}
            >
              {currentPageTitle}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.75, sm: 1.5 }, flexShrink: 0 }}>
            <Tooltip title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
              <IconButton onClick={toggleTheme} color="inherit" size="small">
                {theme === 'dark' ? <Brightness7Icon fontSize="small" /> : <Brightness4Icon fontSize="small" />}
              </IconButton>
            </Tooltip>

            {/* User Pill */}
            <Box
              sx={{
                display: { xs: 'none', sm: 'flex' },
                alignItems: 'center',
                gap: 1.2,
                px: 1.5,
                py: 0.5,
                borderRadius: 20,
                backgroundColor: 'background.default',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Box
                sx={{
                  width: 26,
                  height: 26,
                  borderRadius: '50%',
                  backgroundColor: 'primary.main',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                }}
              >
                {admin.fullName?.charAt(0) || 'A'}
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.8rem', lineHeight: 1.1 }}>
                  {admin.fullName}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
                  Mosque Administrator
                </Typography>
              </Box>
            </Box>

            <Button
              variant="text"
              color="error"
              size="small"
              onClick={logout}
              startIcon={<ExitToAppIcon fontSize="small" />}
              sx={{ fontWeight: 700, fontSize: { xs: '0.78rem', sm: '0.82rem' }, px: { xs: 1, sm: 1.5 }, minWidth: 'auto' }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Responsive Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
              borderRight: '1px solid',
              borderColor: 'divider',
              backgroundColor: 'background.paper',
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          p: { xs: 1.75, sm: 3, md: 3.5 },
          width: { xs: '100%', md: `calc(100% - ${DRAWER_WIDTH}px)` },
          maxWidth: '100%',
          overflowX: 'hidden',
          mt: 8,
          backgroundColor: 'background.default',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
