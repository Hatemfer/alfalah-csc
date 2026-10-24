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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState<any>({
    title: '',
    content: '',
    badgeText: 'Notice',
    isPinned: false,
    isPublished: true,
    expiresAt: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    loadAnnouncements();
  }, []);

  async function loadAnnouncements() {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/admin/announcements', { credentials: 'include' });
      if (res.ok) {
        const json = await res.json();
        setAnnouncements(json);
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
      content: '',
      badgeText: 'Notice',
      isPinned: false,
      isPublished: true,
      expiresAt: '',
    });
    setDialogOpen(true);
  };

  const handleOpenEdit = (a: any) => {
    setEditingId(a.id);
    setFormData({
      ...a,
      expiresAt: a.expiresAt ? new Date(a.expiresAt).toISOString().slice(0, 10) : '',
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setFeedback(null);

    try {
      const url = editingId ? `/api/v1/admin/announcements/${editingId}` : '/api/v1/admin/announcements';
      const method = editingId ? 'PUT' : 'POST';

      const payload = {
        ...formData,
        expiresAt: formData.expiresAt ? `${formData.expiresAt}T23:59:59Z` : undefined,
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || 'Failed to save announcement');
      }

      setFeedback({
        type: 'success',
        message: `Announcement "${formData.title}" saved successfully.`,
      });
      setDialogOpen(false);
      await loadAnnouncements();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete notice "${title}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/v1/admin/announcements/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to delete announcement');

      setFeedback({ type: 'success', message: `Notice "${title}" deleted.` });
      await loadAnnouncements();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Announcements & Community Notices
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Post important community updates, Eid announcements, and urgent notices.
          </Typography>
        </div>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAdd}>
          Post Announcement
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
                  <TableCell sx={{ fontWeight: 700 }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Badge</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Pinned</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {announcements.length > 0 ? (
                  announcements.map((a) => (
                    <TableRow key={a.id} hover>
                      <TableCell sx={{ fontWeight: 600 }}>{a.title}</TableCell>
                      <TableCell>
                        {a.badgeText ? <Chip label={a.badgeText} size="small" /> : '-'}
                      </TableCell>
                      <TableCell>
                        {a.isPinned ? <Chip label="Pinned" color="secondary" size="small" /> : 'No'}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={a.isPublished ? 'Published' : 'Draft'}
                          color={a.isPublished ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small" color="primary" onClick={() => handleOpenEdit(a)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => handleDelete(a.id, a.title)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} sx={{ textAlign: 'center', py: 3, color: 'text.secondary' }}>
                      No announcements posted yet.
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
          {editingId ? 'Edit Announcement' : 'Post Announcement'}
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            label="Notice Title"
            fullWidth
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <TextField
            label="Badge Tag (e.g. Notice, Eid, Important)"
            fullWidth
            value={formData.badgeText}
            onChange={(e) => setFormData({ ...formData, badgeText: e.target.value })}
          />
          <TextField
            label="Notice Content"
            multiline
            rows={5}
            fullWidth
            required
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          />
          <TextField
            label="Expiration Date (Optional)"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={formData.expiresAt}
            onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
            helperText="Notice will automatically archive after this date"
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isPinned}
                  onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                />
              }
              label="Pin to top of homepage & notices"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                />
              }
              label="Published"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDialogOpen(false)} disabled={saving}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Post Notice'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
