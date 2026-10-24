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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const CATEGORIES = ['Education', 'Youth', 'Sisters', 'Charity', 'Community', 'Elders'];

export default function AdminActivitiesPage() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState<any>({
    title: '',
    slug: '',
    category: 'Education',
    shortDescription: '',
    fullDescription: '',
    scheduleInfo: '',
    location: 'Alfalah Community Support Centre',
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
        setActivities(json);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      title: '',
      slug: '',
      category: 'Education',
      shortDescription: '',
      fullDescription: '',
      scheduleInfo: '',
      location: 'Alfalah Community Support Centre',
      isPublished: true,
    });
    setDialogOpen(true);
  };

  const handleOpenEdit = (act: any) => {
    setEditingId(act.id);
    setFormData({ ...act });
    setDialogOpen(true);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleSave = async () => {
    setSaving(true);
    setFeedback(null);

    try {
      const url = editingId ? `/api/v1/admin/activities/${editingId}` : '/api/v1/admin/activities';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || 'Failed to save activity');
      }

      setFeedback({
        type: 'success',
        message: `Activity "${formData.title}" saved successfully.`,
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
    if (!window.confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/v1/admin/activities/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to delete activity');

      setFeedback({ type: 'success', message: `Activity "${title}" deleted.` });
      await loadActivities();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Community Programmes & Activities
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage educational classes, youth mentorship, and community welfare services.
          </Typography>
        </div>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAdd}>
          Add New Activity
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
                  <TableCell sx={{ fontWeight: 700 }}>Activity Title</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Schedule</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {activities.length > 0 ? (
                  activities.map((act) => (
                    <TableRow key={act.id} hover>
                      <TableCell sx={{ fontWeight: 600 }}>{act.title}</TableCell>
                      <TableCell>
                        <Chip label={act.category} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>{act.scheduleInfo || 'Flexible / On-Demand'}</TableCell>
                      <TableCell>
                        <Chip
                          label={act.isPublished ? 'Published' : 'Draft'}
                          color={act.isPublished ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small" color="primary" onClick={() => handleOpenEdit(act)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => handleDelete(act.id, act.title)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} sx={{ textAlign: 'center', py: 3, color: 'text.secondary' }}>
                      No community activities found. Click &quot;Add New Activity&quot; to create one.
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
          {editingId ? 'Edit Community Activity' : 'Add New Community Activity'}
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            label="Activity Title"
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
            helperText="Used in public URL: /activities/[slug]"
          />
          <TextField
            select
            label="Category"
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
          <TextField
            label="Short Summary"
            multiline
            rows={2}
            fullWidth
            required
            value={formData.shortDescription}
            onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
            helperText="Brief summary shown on homepage & listing cards"
          />
          <TextField
            label="Full Detailed Description"
            multiline
            rows={4}
            fullWidth
            value={formData.fullDescription}
            onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
          />
          <TextField
            label="Schedule / Timings"
            fullWidth
            placeholder="e.g. Every Saturday 10:00 - 12:30"
            value={formData.scheduleInfo}
            onChange={(e) => setFormData({ ...formData, scheduleInfo: e.target.value })}
          />
          <TextField
            label="Location"
            fullWidth
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />
          <FormControlLabel
            control={
              <Switch
                checked={formData.isPublished}
                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
              />
            }
            label="Publish publicly on website"
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDialogOpen(false)} disabled={saving}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Activity'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
