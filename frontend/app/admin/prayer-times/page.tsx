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
  Divider,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

export default function AdminPrayerTimesPage() {
  const [settings, setSettings] = useState<any>(null);
  const [overrides, setOverrides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [savingOverride, setSavingOverride] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [newOverride, setNewOverride] = useState({
    date: new Date().toISOString().slice(0, 10),
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
      const [setRes, overRes] = await Promise.all([
        fetch('/api/v1/admin/prayer-settings', { credentials: 'include' }),
        fetch('/api/v1/admin/prayer-overrides', { credentials: 'include' }),
      ]);
      if (setRes.ok) setSettings(await setRes.json());
      if (overRes.ok) setOverrides(await overRes.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

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
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setSavingSettings(false);
    }
  };

  const handleAddOverride = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingOverride(true);
    setFeedback(null);
    try {
      const res = await fetch('/api/v1/admin/prayer-overrides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newOverride),
      });
      if (!res.ok) throw new Error('Failed to save timetable override');
      setFeedback({ type: 'success', message: `Timetable override saved for ${newOverride.date}.` });
      await loadData();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setSavingOverride(false);
    }
  };

  const handleDeleteOverride = async (date: string) => {
    if (!window.confirm(`Remove override for ${date}? Astronomical calculation will resume for this day.`)) return;
    try {
      const res = await fetch(`/api/v1/admin/prayer-overrides/${date}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to delete override');
      setFeedback({ type: 'success', message: `Override for ${date} removed.` });
      await loadData();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
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
          Prayer Times Configuration & Official Overrides
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Configure astronomical calculation rules or add manual timetable overrides for the centre.
        </Typography>
      </Box>

      {feedback && (
        <Alert severity={feedback.type} sx={{ mb: 3 }} onClose={() => setFeedback(null)}>
          {feedback.message}
        </Alert>
      )}

      {/* Manual Override Form */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            Add / Update Official Mosque Daily Override
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Times entered here take precedence over astronomical calculations for the selected date.
          </Typography>

          <Box component="form" onSubmit={handleAddOverride}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="Date"
                  type="date"
                  fullWidth
                  required
                  InputLabelProps={{ shrink: true }}
                  value={newOverride.date}
                  onChange={(e) => setNewOverride({ ...newOverride, date: e.target.value })}
                />
              </Grid>
              <Grid item xs={6} sm={1.5}>
                <TextField
                  label="Fajr Iqamah"
                  fullWidth
                  placeholder="06:00"
                  value={newOverride.fajrIqamah}
                  onChange={(e) => setNewOverride({ ...newOverride, fajrIqamah: e.target.value })}
                />
              </Grid>
              <Grid item xs={6} sm={1.5}>
                <TextField
                  label="Dhuhr Iqamah"
                  fullWidth
                  placeholder="13:15"
                  value={newOverride.dhuhrIqamah}
                  onChange={(e) => setNewOverride({ ...newOverride, dhuhrIqamah: e.target.value })}
                />
              </Grid>
              <Grid item xs={6} sm={1.5}>
                <TextField
                  label="Asr Iqamah"
                  fullWidth
                  placeholder="16:00"
                  value={newOverride.asrIqamah}
                  onChange={(e) => setNewOverride({ ...newOverride, asrIqamah: e.target.value })}
                />
              </Grid>
              <Grid item xs={6} sm={1.5}>
                <TextField
                  label="Maghrib Iqamah"
                  fullWidth
                  placeholder="18:05"
                  value={newOverride.maghribIqamah}
                  onChange={(e) => setNewOverride({ ...newOverride, maghribIqamah: e.target.value })}
                />
              </Grid>
              <Grid item xs={6} sm={1.5}>
                <TextField
                  label="Isha Iqamah"
                  fullWidth
                  placeholder="19:45"
                  value={newOverride.ishaIqamah}
                  onChange={(e) => setNewOverride({ ...newOverride, ishaIqamah: e.target.value })}
                />
              </Grid>
              <Grid item xs={6} sm={1.5}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={savingOverride}
                  sx={{ height: 54 }}
                  startIcon={<AddIcon />}
                >
                  Save
                </Button>
              </Grid>
            </Grid>
          </Box>

          {/* Existing Overrides Table */}
          {overrides.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                Active Overrides ({overrides.length})
              </Typography>
              <TableContainer sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                      <TableCell>Fajr</TableCell>
                      <TableCell>Dhuhr</TableCell>
                      <TableCell>Asr</TableCell>
                      <TableCell>Maghrib</TableCell>
                      <TableCell>Isha</TableCell>
                      <TableCell align="right">Remove</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {overrides.map((o) => (
                      <TableRow key={o.id}>
                        <TableCell sx={{ fontWeight: 600 }}>{o.date}</TableCell>
                        <TableCell>{o.fajrIqamah || '-'}</TableCell>
                        <TableCell>{o.dhuhrIqamah || '-'}</TableCell>
                        <TableCell>{o.asrIqamah || '-'}</TableCell>
                        <TableCell>{o.maghribIqamah || '-'}</TableCell>
                        <TableCell>{o.ishaIqamah || '-'}</TableCell>
                        <TableCell align="right">
                          <IconButton size="small" color="error" onClick={() => handleDeleteOverride(o.date)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Global Calculation Settings */}
      {settings && (
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
              Astronomical Calculation Parameters (Balsall Heath Birmingham)
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Applied when no manual override exists for a given date.
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Centre Latitude"
                  type="number"
                  fullWidth
                  value={settings.latitude}
                  onChange={(e) => setSettings({ ...settings, latitude: parseFloat(e.target.value) })}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Centre Longitude"
                  type="number"
                  fullWidth
                  value={settings.longitude}
                  onChange={(e) => setSettings({ ...settings, longitude: parseFloat(e.target.value) })}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  select
                  label="Asr Juristic Method"
                  fullWidth
                  value={settings.asrJuristic}
                  onChange={(e) => setSettings({ ...settings, asrJuristic: e.target.value })}
                >
                  <MenuItem value="HANAFI">Hanafi (Standard for UK/Birmingham)</MenuItem>
                  <MenuItem value="SHAFI">Shafi / Standard</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={6} sm={2.4}>
                <TextField
                  label="Fajr Iqamah Offset (Mins)"
                  type="number"
                  fullWidth
                  value={settings.fajrIqamahOffsetMins}
                  onChange={(e) => setSettings({ ...settings, fajrIqamahOffsetMins: parseInt(e.target.value, 10) })}
                />
              </Grid>
              <Grid item xs={6} sm={2.4}>
                <TextField
                  label="Dhuhr Iqamah Offset (Mins)"
                  type="number"
                  fullWidth
                  value={settings.dhuhrIqamahOffsetMins}
                  onChange={(e) => setSettings({ ...settings, dhuhrIqamahOffsetMins: parseInt(e.target.value, 10) })}
                />
              </Grid>
              <Grid item xs={6} sm={2.4}>
                <TextField
                  label="Asr Iqamah Offset (Mins)"
                  type="number"
                  fullWidth
                  value={settings.asrIqamahOffsetMins}
                  onChange={(e) => setSettings({ ...settings, asrIqamahOffsetMins: parseInt(e.target.value, 10) })}
                />
              </Grid>
              <Grid item xs={6} sm={2.4}>
                <TextField
                  label="Maghrib Iqamah Offset (Mins)"
                  type="number"
                  fullWidth
                  value={settings.maghribIqamahOffsetMins}
                  onChange={(e) => setSettings({ ...settings, maghribIqamahOffsetMins: parseInt(e.target.value, 10) })}
                />
              </Grid>
              <Grid item xs={6} sm={2.4}>
                <TextField
                  label="Isha Iqamah Offset (Mins)"
                  type="number"
                  fullWidth
                  value={settings.ishaIqamahOffsetMins}
                  onChange={(e) => setSettings({ ...settings, ishaIqamahOffsetMins: parseInt(e.target.value, 10) })}
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, textAlign: 'right' }}>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSaveSettings}
                disabled={savingSettings}
              >
                {savingSettings ? 'Saving...' : 'Update Calculation Settings'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
