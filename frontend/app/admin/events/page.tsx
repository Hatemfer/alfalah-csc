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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const EVENT_CATEGORIES = ['Lecture', 'Course', 'Community', 'Youth', 'Eid', 'Interfaith'];

export default function AdminEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState<any>({
    title: '',
    slug: '',
    category: 'Community',
    summary: '',
    description: '',
    startTime: new Date().toISOString().slice(0, 16),
    endTime: new Date(Date.now() + 3 * 3600 * 1000).toISOString().slice(0, 16),
    venue: 'Alfalah Community Support Centre',
    registrationUrl: '',
    isFeatured: false,
    isPublished: true,
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/admin/events', { credentials: 'include' });
      if (res.ok) {
        const json = await res.json();
        setEvents(json);
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
      category: 'Community',
      summary: '',
      description: '',
      startTime: new Date().toISOString().slice(0, 16),
      endTime: new Date(Date.now() + 3 * 3600 * 1000).toISOString().slice(0, 16),
      venue: 'Alfalah Community Support Centre',
      registrationUrl: '',
      isFeatured: false,
      isPublished: true,
    });
    setDialogOpen(true);
  };

  const handleOpenEdit = (ev: any) => {
    setEditingId(ev.id);
    setFormData({
      ...ev,
      startTime: new Date(ev.startTime).toISOString().slice(0, 16),
      endTime: new Date(ev.endTime).toISOString().slice(0, 16),
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setFeedback(null);

    try {
      const url = editingId ? `/api/v1/admin/events/${editingId}` : '/api/v1/admin/events';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || 'Failed to save event');
      }

      setFeedback({
        type: 'success',
        message: `Event "${formData.title}" saved successfully.`,
      });
      setDialogOpen(false);
      await loadEvents();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete event "${title}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/v1/admin/events/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to delete event');

      setFeedback({ type: 'success', message: `Event "${title}" deleted.` });
      await loadEvents();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Events & Courses Scheduling
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage upcoming community lectures, short courses, and centre gatherings.
          </Typography>
        </div>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAdd}>
          Schedule New Event
        </Button>
      </Box>

      {feedback && (
        <Alert severity={feedback.type} sx={{ mb: 3 }} onClose={() => setFeedback(null)}>
          {feedback.message}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Event Title</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Date & Time</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Venue</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {events.length > 0 ? (
                  events.map((ev) => (
                    <TableRow key={ev.id} hover>
                      <TableCell sx={{ fontWeight: 600 }}>{ev.title}</TableCell>
                      <TableCell>
                        <Chip label={ev.category} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>
                        {new Date(ev.startTime).toLocaleString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </TableCell>
                      <TableCell>{ev.venue}</TableCell>
                      <TableCell>
                        <Chip
                          label={ev.isPublished ? 'Published' : 'Draft'}
                          color={ev.isPublished ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small" color="primary" onClick={() => handleOpenEdit(ev)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => handleDelete(ev.id, ev.title)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ textAlign: 'center', py: 3, color: 'text.secondary' }}>
                      No events scheduled. Click &quot;Schedule New Event&quot; to add one.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>
          {editingId ? 'Edit Event Details' : 'Schedule New Event'}
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            label="Event Title"
            fullWidth
            required
            value={formData.title}
            onChange={(e) => {
              const val = e.target.value;
              setFormData({
                ...formData,
                title: val,
                slug: editingId ? formData.slug : generateSlug(val),
              });
            }}
          />
          <TextField
            label="URL Slug"
            fullWidth
            required
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          />
          <TextField
            select
            label="Category"
            fullWidth
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            {EVENT_CATEGORIES.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </TextField>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Start Date & Time"
                type="datetime-local"
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="End Date & Time"
                type="datetime-local"
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              />
            </Grid>
          </Grid>
          <TextField
            label="Short Summary"
            multiline
            rows={2}
            fullWidth
            required
            value={formData.summary}
            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
          />
          <TextField
            label="Full Description"
            multiline
            rows={4}
            fullWidth
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <TextField
            label="Venue Location"
            fullWidth
            value={formData.venue}
            onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
          />
          <TextField
            label="Online Registration URL (Optional)"
            fullWidth
            placeholder="https://..."
            value={formData.registrationUrl}
            onChange={(e) => setFormData({ ...formData, registrationUrl: e.target.value })}
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                />
              }
              label="Feature on Homepage"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                />
              }
              label="Publish publicly"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDialogOpen(false)} disabled={saving}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Event'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
