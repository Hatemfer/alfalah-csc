'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Divider,
  Chip,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import SecurityIcon from '@mui/icons-material/Security';
import BusinessIcon from '@mui/icons-material/Business';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';

interface SettingMeta {
  label: string;
  category: 'identity' | 'contact' | 'system' | 'fundraising';
  description: string;
  placeholder?: string;
}

const SETTING_DEFINITIONS: Record<string, SettingMeta> = {
  org_name_en: {
    label: 'Organisation Name (English)',
    category: 'identity',
    description: 'The official name displayed in website banners and document footers.',
    placeholder: 'ALFALAH COMMUNITY SUPPORT CENTRE',
  },
  org_name_ar: {
    label: 'Organisation Name (Arabic)',
    category: 'identity',
    description: 'Official Arabic title of the centre.',
    placeholder: 'مركز الفلاح الإسلامي',
  },
  org_charity_number: {
    label: 'UK Registered Charity Number',
    category: 'identity',
    description: 'Registered with the Charity Commission for England and Wales.',
    placeholder: '1150221',
  },
  org_address: {
    label: 'Physical Premises Address',
    category: 'contact',
    description: 'Street address where daily prayers and community activities take place.',
    placeholder: '89 Tindal Street, Balsall Heath, Birmingham B12 9QU',
  },
  org_phone: {
    label: 'Mosque Helpline / Mobile',
    category: 'contact',
    description: 'Primary telephone number for community inquiries and urgent matters.',
    placeholder: '07782 958305',
  },
  org_email: {
    label: 'Official Mosque Email',
    category: 'contact',
    description: 'Email address shown on the public contact page and header.',
    placeholder: 'alfalahcsc@hotmail.com',
  },
  potential_domain: {
    label: 'Website Domain',
    category: 'system',
    description: 'Canonical live domain name for public links and SSL.',
    placeholder: 'alfalahcsc.com',
  },
  purchase_appeal_target: {
    label: 'Mosque Purchase Appeal Target (£)',
    category: 'fundraising',
    description: 'Total fundraising goal in GBP shown on the homepage appeal banner (e.g. 600000).',
    placeholder: '600000',
  },
  purchase_appeal_raised: {
    label: 'Amount Raised to Date (£)',
    category: 'fundraising',
    description: 'Current funds raised in GBP toward purchasing 89 Tindal Street (set 0 to hide progress bar).',
    placeholder: '0',
  },
};

export default function AdminSiteSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/admin/site-settings', { credentials: 'include' });
      if (res.ok) {
        const json = await res.json();
        const map: Record<string, string> = {};
        if (Array.isArray(json)) {
          json.forEach((s: any) => {
            map[s.key] = s.value;
          });
        }
        // Ensure standard keys exist even if not seeded
        if (!map['org_phone']) map['org_phone'] = '07782 958305';
        if (!map['purchase_appeal_target']) map['purchase_appeal_target'] = '600000';
        if (!map['purchase_appeal_raised']) map['purchase_appeal_raised'] = '0';
        setSettings(map);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleUpdate = async (key: string, value: string) => {
    setSavingKey(key);
    setFeedback(null);
    try {
      const res = await fetch('/api/v1/admin/site-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ key, value }),
      });
      if (!res.ok) throw new Error('Failed to update setting');
      setSettings((prev) => ({ ...prev, [key]: value }));
      const label = SETTING_DEFINITIONS[key]?.label || key;
      setFeedback({ type: 'success', message: `"${label}" was successfully updated and saved.` });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setSavingKey(null);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  const identityKeys = ['org_name_en', 'org_name_ar', 'org_charity_number'];
  const contactKeys = ['org_address', 'org_phone', 'org_email', 'potential_domain'];
  const fundraisingKeys = ['purchase_appeal_target', 'purchase_appeal_raised'];

  return (
    <Box>
      <Box sx={{ mb: 3.5 }}>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          Mosque & Site Configuration
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage verified legal credentials, official telephone helpline, physical address, and organisation details.
        </Typography>
      </Box>

      {feedback && (
        <Alert
          severity={feedback.type}
          icon={feedback.type === 'success' ? <CheckCircleOutlineIcon fontSize="inherit" /> : undefined}
          sx={{ mb: 3 }}
          onClose={() => setFeedback(null)}
        >
          {feedback.message}
        </Alert>
      )}

      {/* Security Safeguard Banner */}
      <Alert
        severity="info"
        icon={<SecurityIcon />}
        sx={{ mb: 3.5, backgroundColor: 'rgba(57, 136, 202, 0.08)', color: 'text.primary', border: '1px solid rgba(57, 136, 202, 0.2)' }}
      >
        <strong>Financial Data Safeguard:</strong> The charity&apos;s bank account details (Al Rayan Bank) are kept strictly protected within the internal charity registry and are never exposed publicly through client APIs.
      </Alert>

      {/* 1. Identity & Charity Credentials */}
      <Card sx={{ mb: 3.5 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <BusinessIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Charity & Organisation Identity
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
            Legal identity information registered with the UK Charity Commission.
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            {identityKeys.map((key) => {
              const def = SETTING_DEFINITIONS[key] || {
                label: key,
                description: 'Configuration setting',
              };
              const currentValue = settings[key] || '';

              return (
                <Grid item xs={12} key={key}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, flexWrap: 'wrap' }}>
                    <Box sx={{ flex: 1, minWidth: { xs: '100%', sm: 280 } }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {def.label}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                        {def.description}
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        id={`input-${key}`}
                        defaultValue={currentValue}
                        placeholder={def.placeholder}
                      />
                    </Box>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<SaveIcon />}
                      disabled={savingKey === key}
                      onClick={() => {
                        const input = document.getElementById(`input-${key}`) as HTMLInputElement;
                        if (input) handleUpdate(key, input.value);
                      }}
                      sx={{ mt: 3, px: 2.5 }}
                    >
                      {savingKey === key ? 'Saving...' : 'Save'}
                    </Button>
                  </Box>
                  <Divider sx={{ my: 2.5 }} />
                </Grid>
              );
            })}
          </Grid>
        </CardContent>
      </Card>

      {/* 2. Contact, Address & Online Presence */}
      <Card sx={{ mb: 3.5 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <ContactPhoneIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Contact Lines & Physical Location
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
            Helpline numbers, email, and visitor address shown across public contact pages.
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            {contactKeys.map((key) => {
              const def = SETTING_DEFINITIONS[key] || {
                label: key,
                description: 'Configuration setting',
              };
              const currentValue = settings[key] || '';

              return (
                <Grid item xs={12} key={key}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, flexWrap: 'wrap' }}>
                    <Box sx={{ flex: 1, minWidth: { xs: '100%', sm: 280 } }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {def.label}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                        {def.description}
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        id={`input-${key}`}
                        defaultValue={currentValue}
                        placeholder={def.placeholder}
                      />
                    </Box>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<SaveIcon />}
                      disabled={savingKey === key}
                      onClick={() => {
                        const input = document.getElementById(`input-${key}`) as HTMLInputElement;
                        if (input) handleUpdate(key, input.value);
                      }}
                      sx={{ mt: 3, px: 2.5 }}
                    >
                      {savingKey === key ? 'Saving...' : 'Save'}
                    </Button>
                  </Box>
                  <Divider sx={{ my: 2.5 }} />
                </Grid>
              );
            })}
          </Grid>
        </CardContent>
      </Card>

      {/* 3. Mosque Purchase Fundraising Appeal */}
      <Card sx={{ mb: 3.5 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <VolunteerActivismIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Mosque Purchase Fundraising Appeal
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
            Control the fundraising target and current amount raised displayed on the homepage appeal banner.
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            {fundraisingKeys.map((key) => {
              const def = SETTING_DEFINITIONS[key] || {
                label: key,
                description: 'Configuration setting',
              };
              const currentValue = settings[key] || '';

              return (
                <Grid item xs={12} key={key}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, flexWrap: 'wrap' }}>
                    <Box sx={{ flex: 1, minWidth: { xs: '100%', sm: 280 } }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {def.label}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                        {def.description}
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        type="number"
                        id={`input-${key}`}
                        defaultValue={currentValue}
                        placeholder={def.placeholder}
                      />
                    </Box>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<SaveIcon />}
                      disabled={savingKey === key}
                      onClick={() => {
                        const input = document.getElementById(`input-${key}`) as HTMLInputElement;
                        if (input) handleUpdate(key, input.value);
                      }}
                      sx={{ mt: 3, px: 2.5 }}
                    >
                      {savingKey === key ? 'Saving...' : 'Save'}
                    </Button>
                  </Box>
                  <Divider sx={{ my: 2.5 }} />
                </Grid>
              );
            })}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}
