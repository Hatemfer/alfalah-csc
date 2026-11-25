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
  Grid,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CampaignIcon from '@mui/icons-material/Campaign';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PushPinIcon from '@mui/icons-material/PushPin';
import { ConfirmDeleteModal } from '@/components/admin/ConfirmDeleteModal';

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

  // Custom Delete Modal State
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    id: string;
    title: string;
    loading: boolean;
  }>({
    open: false,
    id: '',
    title: '',
    loading: false,
  });

  useEffect(() => {
    loadAnnouncements();
  }, []);

  async function loadAnnouncements() {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/admin/announcements', { credentials: 'include' });
      if (res.ok) {
        const json = await res.json();
        setAnnouncements(Array.isArray(json) ? json : []);
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
      title: a.title,
      content: a.content,
      badgeText: a.badgeText || '',
      isPinned: a.isPinned,
      isPublished: a.isPublished,
      expiresAt: a.expiresAt ? a.expiresAt.slice(0, 10) : '',
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      setFeedback({ type: 'error', message: 'Notice title and content are required.' });
      return;
    }

    setSaving(true);
    setFeedback(null);

    try {
      const url = editingId
        ? `/api/v1/admin/announcements/${editingId}`
        : '/api/v1/admin/announcements';
      const method = editingId ? 'PUT' : 'POST';

      const payload = {
        ...formData,
        expiresAt: formData.expiresAt ? new Date(formData.expiresAt).toISOString() : null,
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => ({}));
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

  const promptDelete = (id: string, title: string) => {
    setDeleteModal({
      open: true,
      id,
      title,
      loading: false,
    });
  };

  const handleConfirmDelete = async () => {
    try {
      setDeleteModal((prev) => ({ ...prev, loading: true }));
      const res = await fetch(`/api/v1/admin/announcements/${deleteModal.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to delete announcement');

      setFeedback({ type: 'success', message: `Notice "${deleteModal.title}" deleted successfully.` });
      setDeleteModal({ open: false, id: '', title: '', loading: false });
      await loadAnnouncements();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
      setDeleteModal((prev) => ({ ...prev, loading: false }));
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3.5, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2 }}>
        <div>
          <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary' }}>
            Announcements & Community Notices
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Post important centre statements, seasonal schedules, Eid notices, and alerts.
          </Typography>
        </div>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAdd}
          sx={{
            px: 2.5,
            py: 1,
            backgroundColor: '#3988CA',
            fontWeight: 700,
            borderRadius: '10px',
            boxShadow: '0 4px 6px -1px rgba(57, 136, 202, 0.25)',
            '&:hover': {
              backgroundColor: '#2b6ea6',
            },
          }}
        >
          Post Announcement
        </Button>
      </Box>

      {feedback && (
        <Alert
          severity={feedback.type}
          icon={feedback.type === 'success' ? <CheckCircleOutlineIcon fontSize="inherit" /> : undefined}
          sx={{ mb: 3, borderRadius: '10px' }}
          onClose={() => setFeedback(null)}
        >
          {feedback.message}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#3988CA' }} />
        </Box>
      ) : (
        <Card sx={{ borderRadius: '14px', border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'background.default' }}>
                  <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.78rem' }}>NOTICE TITLE</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.78rem' }}>TAG / BADGE</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.78rem' }}>PINNED</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.78rem' }}>STATUS</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.78rem' }}>ACTIONS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {announcements.length > 0 ? (
                  announcements.map((a) => (
                    <TableRow key={a.id} hover sx={{ '&:hover': { backgroundColor: 'background.default' } }}>
                      <TableCell sx={{ fontWeight: 700, color: 'text.primary', minWidth: 260 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {a.isPinned && <PushPinIcon sx={{ fontSize: 16, color: '#0284C7' }} />}
                          <span>{a.title}</span>
                        </Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5, lineHeight: 1.4 }}>
                          {a.content?.slice(0, 85)}...
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {a.badgeText ? (
                          <Chip label={a.badgeText} size="small" sx={{ fontWeight: 700, fontSize: '0.72rem', backgroundColor: '#F1F5F9', color: 'text.primary' }} />
                        ) : (
                          <span style={{ color: '#94A3B8' }}>-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {a.isPinned ? (
                          <Chip label="Pinned" size="small" sx={{ fontWeight: 800, fontSize: '0.7rem', backgroundColor: '#E0F2FE', color: '#0369A1' }} />
                        ) : (
                          <span style={{ color: '#94A3B8', fontSize: '0.85rem' }}>No</span>
                        )}
                      </TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        <Chip
                          label={a.isPublished ? 'Published' : 'Draft'}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            fontSize: '0.72rem',
                            backgroundColor: a.isPublished ? '#DCFCE7' : '#F1F5F9',
                            color: a.isPublished ? '#15803D' : '#64748B',
                          }}
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                        <Tooltip title="Edit Notice">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenEdit(a)}
                            sx={{
                              color: '#3988CA',
                              border: '1px solid', borderColor: 'divider',
                              mr: 1,
                              '&:hover': { backgroundColor: '#F0F9FF' },
                            }}
                          >
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Notice">
                          <IconButton
                            size="small"
                            onClick={() => promptDelete(a.id, a.title)}
                            sx={{
                              color: '#DC2626',
                              border: '1px solid #FEE2E2',
                              backgroundColor: '#FEF2F2',
                              '&:hover': { backgroundColor: '#FEE2E2' },
                            }}
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
                      <CampaignIcon sx={{ fontSize: 48, color: '#94A3B8', opacity: 0.4, mb: 1, display: 'block', mx: 'auto' }} />
                      <Typography variant="body1" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}>
                        No announcements posted
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Click &quot;Post Announcement&quot; to publish notices to the homepage.
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
      <Dialog
        open={dialogOpen}
        onClose={() => !saving && setDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
          },
        }}
      >
        <DialogTitle
          sx={{
            p: 2.5,
            pb: 2,
            borderBottom: '1px solid', borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: '10px',
                backgroundColor: '#E0F2FE',
                color: '#0284C7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CampaignIcon sx={{ fontSize: 20 }} />
            </Box>
            <div>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', fontSize: '1.15rem' }}>
                {editingId ? 'Edit Announcement' : 'Post New Community Notice'}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Notices appear on the website header banner, homepage notices, and announcements page
              </Typography>
            </div>
          </Box>

          <IconButton
            size="small"
            onClick={() => setDialogOpen(false)}
            disabled={saving}
            sx={{ color: '#94A3B8', '&:hover': { color: 'text.primary' } }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={8}>
              <Typography sx={{ fontSize: '0.86rem', fontWeight: 700, color: 'text.primary', mb: 0.75 }}>
                Notice Title <span style={{ color: '#DC2626' }}>*</span>
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Ramadan Timetable & Taraweeh Arrangements"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px', backgroundColor: 'background.default' } }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography sx={{ fontSize: '0.86rem', fontWeight: 700, color: 'text.primary', mb: 0.75 }}>
                Badge Tag
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={formData.badgeText}
                onChange={(e) => setFormData({ ...formData, badgeText: e.target.value })}
                placeholder="e.g. Urgent, Eid, Notice"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px', backgroundColor: 'background.default' } }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography sx={{ fontSize: '0.86rem', fontWeight: 700, color: 'text.primary', mb: 0.75 }}>
                Notice Content <span style={{ color: '#DC2626' }}>*</span>
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={5}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Full announcement text, instructions, and relevant contact details..."
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px', backgroundColor: 'background.default' } }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography sx={{ fontSize: '0.86rem', fontWeight: 700, color: 'text.primary', mb: 0.75 }}>
                Automatic Expiration (Optional)
              </Typography>
              <TextField
                type="date"
                fullWidth
                size="small"
                value={formData.expiresAt}
                onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                helperText="Notice will automatically unpin and archive after this date."
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px', backgroundColor: 'background.default' } }}
              />
            </Grid>

            <Grid item xs={12}>
              <Box
                sx={{
                  p: 2,
                  border: '1px solid', borderColor: 'divider',
                  borderRadius: '12px',
                  backgroundColor: 'background.default',
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  justifyContent: 'space-between',
                  gap: 2,
                }}
              >
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isPinned}
                      onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                      color="primary"
                    />
                  }
                  label={
                    <div>
                      <Typography sx={{ fontSize: '0.88rem', fontWeight: 700 }}>Pin Announcement</Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>Keep pinned prominently at top of homepage</Typography>
                    </div>
                  }
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isPublished}
                      onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                      color="primary"
                    />
                  }
                  label={
                    <div>
                      <Typography sx={{ fontSize: '0.88rem', fontWeight: 700 }}>Publish Immediately</Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>Visible publicly on alfalahcsc.com</Typography>
                    </div>
                  }
                />
              </Box>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 2.5, borderTop: '1px solid #E2E8F0', gap: 1.5 }}>
          <Button
            onClick={() => setDialogOpen(false)}
            disabled={saving}
            sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'none', px: 2.5 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving || !formData.title.trim() || !formData.content.trim()}
            sx={{
              backgroundColor: '#3988CA',
              fontWeight: 700,
              borderRadius: '8px',
              textTransform: 'none',
              px: 3,
              py: 1,
              '&:hover': { backgroundColor: '#2b6ea6' },
            }}
          >
            {saving ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={18} color="inherit" />
                <span>Saving...</span>
              </Box>
            ) : editingId ? (
              'Save Changes'
            ) : (
              'Post Notice'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Sleek Custom Confirm Delete Modal */}
      <ConfirmDeleteModal
        open={deleteModal.open}
        onClose={() => setDeleteModal((prev) => ({ ...prev, open: false }))}
        onConfirm={handleConfirmDelete}
        title="Delete Community Announcement"
        itemName={deleteModal.title}
        loading={deleteModal.loading}
        confirmText="Delete Notice"
      />
    </Box>
  );
}
