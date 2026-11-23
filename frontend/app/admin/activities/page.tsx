'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
  Alert,
  CircularProgress,
  MenuItem,
  Grid,
  InputAdornment,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const CATEGORIES = [
  'First Aid & Emergency Training',
  'Community Safeguarding & Welfare',
  'Youth & STEM Robotics',
  'Quran & Tajweed',
  'Islamic Studies & Tafsir',
  'Handmade & Arts',
  'Youth & Sports',
  'Elders & Community Support',
  'Sisters Circle',
];

export default function AdminActivitiesPage() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState<any>({
    title: '',
    slug: '',
    category: 'First Aid & Emergency Training',
    shortDescription: '',
    fullDescription: '',
    scheduleInfo: '',
    location: 'Alfalah Community Support Centre, 89 Tindal St',
    imageUrl: '',
    isPublished: true,
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    loadActivities();
  }, []);

  async function loadActivities() {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/admin/activities', { credentials: 'include' });
      if (res.ok) {
        const json = await res.json();
        setActivities(Array.isArray(json) ? json : []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      title: '',
      slug: '',
      category: 'First Aid & Emergency Training',
      shortDescription: '',
      fullDescription: '',
      scheduleInfo: '',
      location: 'Alfalah Community Support Centre, 89 Tindal St',
      imageUrl: '',
      isPublished: true,
    });
    setDialogOpen(true);
  };

  const handleOpenEdit = (act: any) => {
    setEditingId(act.id);
    setFormData({ ...act });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setFeedback(null);

    try {
      const url = editingId ? `/api/v1/admin/activities/${editingId}` : '/api/v1/admin/activities';
      const method = editingId ? 'PUT' : 'POST';

      const payload = {
        ...formData,
        slug: formData.slug || generateSlug(formData.title),
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to save activity');
      }

      setFeedback({
        type: 'success',
        message: editingId ? 'Activity updated successfully.' : 'New activity published successfully.',
      });
      setDialogOpen(false);
      await loadActivities();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete the activity "${title}"?`)) return;

    try {
      const res = await fetch(`/api/v1/admin/activities/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to delete activity');
      setFeedback({ type: 'success', message: 'Activity removed successfully.' });
      await loadActivities();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
    }
  };

  const filteredActivities = activities.filter((act) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      act.title?.toLowerCase().includes(q) ||
      act.category?.toLowerCase().includes(q) ||
      act.shortDescription?.toLowerCase().includes(q)
    );
  });

  return (
    <Box>
      <Box sx={{ mb: 3.5, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2 }}>
        <div>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Activities & Community Programmes
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage workshops, First Aid certification, Safeguarding classes, STEM labs, and community sessions.
          </Typography>
        </div>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAdd}
          sx={{ px: 2.5 }}
        >
          Add New Programme
        </Button>
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

      {/* Search Bar */}
      <Card sx={{ mb: 3, p: 2 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search programmes by title, category, or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Card>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Programme</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Schedule</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredActivities.length > 0 ? (
                  filteredActivities.map((act) => (
                    <TableRow key={act.id} hover>
                      <TableCell sx={{ minWidth: 260 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          {act.imageUrl ? (
                            <Box
                              component="img"
                              src={act.imageUrl}
                              alt={act.title}
                              sx={{
                                width: 56,
                                height: 56,
                                borderRadius: 2,
                                objectFit: 'cover',
                                border: '1px solid #e2e8f0',
                                flexShrink: 0,
                              }}
                            />
                          ) : (
                            <Box
                              sx={{
                                width: 56,
                                height: 56,
                                borderRadius: 2,
                                backgroundColor: 'rgba(57, 136, 202, 0.1)',
                                color: 'primary.main',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                              }}
                            >
                              <VolunteerActivismIcon />
                            </Box>
                          )}
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                              {act.title}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{
                                display: '-webkit-box',
                                WebkitLineClamp: 1,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                              }}
                            >
                              {act.shortDescription || 'No description provided'}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        <Chip
                          label={act.category || 'General'}
                          size="small"
                          sx={{ fontWeight: 700, fontSize: '0.72rem' }}
                        />
                      </TableCell>

                      <TableCell sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
                        {act.scheduleInfo || 'See timetable'}
                      </TableCell>

                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        <Chip
                          label={act.isPublished ? 'Published' : 'Draft'}
                          size="small"
                          color={act.isPublished ? 'success' : 'default'}
                          sx={{ fontWeight: 700, fontSize: '0.72rem' }}
                        />
                      </TableCell>

                      <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                        <Tooltip title="Edit Programme">
                          <IconButton size="small" onClick={() => handleOpenEdit(act)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Programme">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDelete(act.id, act.title)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} sx={{ textAlign: 'center', py: 5, color: 'text.secondary' }}>
                      <VolunteerActivismIcon sx={{ fontSize: 44, color: 'text.secondary', opacity: 0.4, mb: 1, display: 'block', mx: 'auto' }} />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        No programmes found. Click &quot;Add New Programme&quot; to publish your first one.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>
          {editingId ? 'Edit Programme Details' : 'Add New Community Programme'}
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Grid container spacing={2.5}>
            <Grid item xs={12} sm={8}>
              <TextField
                label="Programme Title *"
                fullWidth
                value={formData.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setFormData({
                    ...formData,
                    title,
                    slug: editingId ? formData.slug : generateSlug(title),
                  });
                }}
                placeholder="e.g. Accredited First Aid & CPR Training"
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                select
                label="Category *"
                fullWidth
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {CATEGORIES.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Short Summary *"
                fullWidth
                multiline
                rows={2}
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                placeholder="Brief 1-2 sentence description shown on activity cards..."
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Full Details & Syllabus"
                fullWidth
                multiline
                rows={4}
                value={formData.fullDescription}
                onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                placeholder="Detailed curriculum, learning outcomes, certificate information, requirements..."
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Schedule / Timings"
                fullWidth
                value={formData.scheduleInfo}
                onChange={(e) => setFormData({ ...formData, scheduleInfo: e.target.value })}
                placeholder="e.g. Every Saturday 10:00 AM - 12:00 PM"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Location / Venue"
                fullWidth
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Alfalah Community Support Centre, 89 Tindal St"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Cover Image URL"
                fullWidth
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="/images/activities/first-aid.jpeg or https://..."
                helperText="Upload images in the Media Library to generate URLs, or enter a photo link."
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    color="primary"
                  />
                }
                label="Publish immediately to public website"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setDialogOpen(false)} disabled={saving}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSave} disabled={saving || !formData.title}>
            {saving ? 'Saving...' : editingId ? 'Update Programme' : 'Publish Programme'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
