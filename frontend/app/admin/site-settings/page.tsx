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
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import SecurityIcon from '@mui/icons-material/Security';

export default function AdminSiteSettingsPage() {
  const [settings, setSettings] = useState<any[]>([]);
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
        setSettings(json);
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
      setFeedback({ type: 'success', message: `Setting "${key}" updated successfully.` });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setSavingKey(null);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          Organisation & Site Settings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Configure verified charity credentials, official names, address, and contact information.
        </Typography>
      </Box>

      {feedback && (
        <Alert severity={feedback.type} sx={{ mb: 3 }} onClose={() => setFeedback(null)}>
          {feedback.message}
        </Alert>
      )}

      {/* Security Notice on Bank Details */}
      <Alert
        severity="info"
        icon={<SecurityIcon />}
        sx={{ mb: 3 }}
      >
        <strong>Client Privacy & Financial Safeguard:</strong> The organisation&apos;s bank account credentials (Al Rayan Bank) are kept strictly confidential and internal. They are never published on the website or exposed via public APIs.
      </Alert>

      <Card>
        <CardContent>
          <Grid container spacing={3}>
            {settings.map((s) => (
              <Grid item xs={12} key={s.key}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, flexWrap: 'wrap' }}>
                  <Box sx={{ flex: 1, minWidth: 260 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      {s.key}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                      {s.description || 'Configurable setting'}
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      defaultValue={s.value}
                      id={`setting-${s.key}`}
                    />
                  </Box>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<SaveIcon />}
                    disabled={savingKey === s.key}
                    onClick={() => {
                      const input = document.getElementById(`setting-${s.key}`) as HTMLInputElement;
                      if (input) handleUpdate(s.key, input.value);
                    }}
                    sx={{ mt: 3 }}
                  >
                    {savingKey === s.key ? 'Saving...' : 'Update'}
                  </Button>
                </Box>
                <Divider sx={{ my: 2 }} />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}
