'use client';

import React, { useState } from 'react';
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
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';
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

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: DashboardIcon },
  { label: 'Homepage Blocks', href: '/admin/homepage', icon: ViewCarouselIcon },
  { label: 'Activities & Services', href: '/admin/activities', icon: VolunteerActivismIcon },
  { label: 'Events & Courses', href: '/admin/events', icon: EventIcon },
  { label: 'Announcements', href: '/admin/announcements', icon: CampaignIcon },
  { label: 'Prayer Times & Overrides', href: '/admin/prayer-times', icon: AccessTimeFilledIcon },
  { label: 'Media Library', href: '/admin/media', icon: PermMediaIcon },
  { label: 'Site Settings', href: '/admin/site-settings', icon: SettingsIcon },
  { label: 'Contact Inquiries', href: '/admin/contact-messages', icon: EmailIcon },
  { label: 'Audit Logs', href: '/admin/audit-logs', icon: HistoryIcon },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { admin, loading, logout } = useAdminAuth();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

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
          Checking administrator credentials...
        </Typography>
      </Box>
    );
  }

  if (!admin) {
    return null;
  }

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 800, letterSpacing: -0.5 }}>
          ALFALAH CMS
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
          Community Support Centre (Birmingham)
        </Typography>
      </Box>

      <Divider />

      <List sx={{ px: 1, py: 1.5, flex: 1 }}>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <ListItem key={item.href} disablePadding sx={{ mb: 0.5 }}>
              <Link href={item.href} style={{ width: '100%', textDecoration: 'none', color: 'inherit' }}>
                <ListItemButton
                  selected={isActive}
                  onClick={() => setMobileOpen(false)}
                  sx={{
                    borderRadius: 2,
                    py: 1,
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
                  <ListItemIcon sx={{ minWidth: 38, color: isActive ? '#ffffff' : 'text.secondary' }}>
                    <Icon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: '0.9rem',
                      fontWeight: isActive ? 700 : 500,
                    }}
                  />
                </ListItemButton>
              </Link>
            </ListItem>
          );
        })}
      </List>

      <Divider />

      {/* Drawer Footer Actions */}
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Link href="/" target="_blank" style={{ textDecoration: 'none' }}>
          <Button
            fullWidth
            variant="outlined"
            size="small"
            startIcon={<OpenInNewIcon />}
            sx={{ color: 'text.secondary', borderColor: 'divider' }}
          >
            View Public Website
          </Button>
        </Link>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'background.default' }}>
      {/* Top Application Bar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
          borderBottom: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper',
          color: 'text.primary',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={() => setMobileOpen(!mobileOpen)}
              sx={{ display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Staff Management Portal
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <IconButton onClick={toggleTheme} color="inherit" size="small" aria-label="Toggle theme">
              {theme === 'dark' ? <Brightness7Icon fontSize="small" /> : <Brightness4Icon fontSize="small" />}
            </IconButton>

            <Box sx={{ display: { xs: 'none', sm: 'flex' }, flexDirection: 'column', alignItems: 'flex-end' }}>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {admin.fullName}
              </Typography>
              <Chip
                label={admin.role}
                size="small"
                color="primary"
                variant="outlined"
                sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700 }}
              />
            </Box>

            <Button
              variant="text"
              color="error"
              size="small"
              onClick={logout}
              startIcon={<ExitToAppIcon />}
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
          p: { xs: 2, sm: 3, md: 4 },
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          mt: 8,
          backgroundColor: 'background.default',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
