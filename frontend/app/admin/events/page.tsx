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
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EventIcon from '@mui/icons-material/Event';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { ConfirmDeleteModal } from '@/components/admin/ConfirmDeleteModal';

const EVENT_CATEGORIES = [
  'Spiritual Lecture',
  'Youth & STEM',
  'Course',
  'Community',
  'Workshop',
  'Family & Sisters',
  'Eid Gathering',
];

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
    endTime: new Date(Date.now() + 2 * 3600 * 1000).toISOString().slice(0, 16),
    venue: 'Alfalah Community Support Centre, 89 Tindal St, Birmingham, B12 9QU',
    registrationUrl: '',
    isFeatured: false,
    isPublished: true,
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
    loadEvents();
  }, []);

  async function loadEvents() {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/admin/events', { credentials: 'include' });
      if (res.ok) {
        const json = await res.json();
        setEvents(Array.isArray(json) ? json : []);
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
      endTime: new Date(Date.now() + 2 * 3600 * 1000).toISOString().slice(0, 16),
      venue: 'Alfalah Community Support Centre, 89 Tindal St, Birmingham, B12 9QU',
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
    if (!formData.title.trim()) {
      setFeedback({ type: 'error', message: 'Event title is required.' });
      return;
    }

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

      const json = await res.json().catch(() => ({}));
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
      const res = await fetch(`/api/v1/admin/events/${deleteModal.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to delete event');

      setFeedback({ type: 'success', message: `Event "${deleteModal.title}" deleted successfully.` });
      setDeleteModal({ open: false, id: '', title: '', loading: false });
      await loadEvents();
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
            Events & Courses Scheduling
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Manage upcoming community lectures, short courses, and centre gatherings.
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
          Schedule New Event
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
                  <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.78rem' }}>EVENT TITLE</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.78rem' }}>CATEGORY</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.78rem' }}>DATE & TIME</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.78rem' }}>VENUE</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.78rem' }}>STATUS</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.78rem' }}>ACTIONS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {events.length > 0 ? (
                  events.map((ev) => (
                    <TableRow key={ev.id} hover sx={{ '&:hover': { backgroundColor: 'background.default' } }}>
                      <TableCell sx={{ fontWeight: 700, color: 'text.primary', minWidth: 220 }}>
                        {ev.title}
                        {ev.isFeatured && (
                          <Chip label="Featured" size="small" sx={{ ml: 1, height: 20, fontSize: '0.68rem', backgroundColor: '#FEF3C7', color: '#B45309', fontWeight: 800 }} />
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={ev.category}
                          size="small"
                          sx={{ fontWeight: 700, fontSize: '0.72rem', backgroundColor: '#F1F5F9', color: 'text.primary' }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
                        {new Date(ev.startTime).toLocaleString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </TableCell>
                      <TableCell sx={{ color: 'text.secondary', fontSize: '0.82rem', maxWidth: 220 }}>
                        {ev.venue}
                      </TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        <Chip
                          label={ev.isPublished ? 'Published' : 'Draft'}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            fontSize: '0.72rem',
                            backgroundColor: ev.isPublished ? '#DCFCE7' : '#F1F5F9',
                            color: ev.isPublished ? '#15803D' : '#64748B',
                          }}
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                        <Tooltip title="Edit Event">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenEdit(ev)}
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
                        <Tooltip title="Delete Event">
                          <IconButton
                            size="small"
                            onClick={() => promptDelete(ev.id, ev.title)}
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
                    <TableCell colSpan={6} sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
                      <EventIcon sx={{ fontSize: 48, color: '#94A3B8', opacity: 0.4, mb: 1, display: 'block', mx: 'auto' }} />
                      <Typography variant="body1" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}>
                        No events scheduled
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Click &quot;Schedule New Event&quot; above to add your first lecture or course.
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
              <EventIcon sx={{ fontSize: 20 }} />
            </Box>
            <div>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', fontSize: '1.15rem' }}>
                {editingId ? 'Edit Event Details' : 'Schedule New Event'}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Configure dates, speaker, lecture notes, and venue information
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
                Event Title <span style={{ color: '#DC2626' }}>*</span>
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={formData.title}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData({
                    ...formData,
                    title: val,
                    slug: editingId ? formData.slug : generateSlug(val),
                  });
                }}
                placeholder="e.g. Weekly Quran Tafsir with Sheikh Jamal"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px', backgroundColor: 'background.default' } }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography sx={{ fontSize: '0.86rem', fontWeight: 700, color: 'text.primary', mb: 0.75 }}>
                Category <span style={{ color: '#DC2626' }}>*</span>
              </Typography>
              <TextField
                select
                fullWidth
                size="small"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px', backgroundColor: 'background.default' } }}
              >
                {EVENT_CATEGORIES.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography sx={{ fontSize: '0.86rem', fontWeight: 700, color: 'text.primary', mb: 0.75 }}>
                Start Date & Time <span style={{ color: '#DC2626' }}>*</span>
              </Typography>
              <TextField
                type="datetime-local"
                fullWidth
                size="small"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px', backgroundColor: 'background.default' } }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography sx={{ fontSize: '0.86rem', fontWeight: 700, color: 'text.primary', mb: 0.75 }}>
                End Date & Time <span style={{ color: '#DC2626' }}>*</span>
              </Typography>
              <TextField
                type="datetime-local"
                fullWidth
                size="small"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px', backgroundColor: 'background.default' } }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography sx={{ fontSize: '0.86rem', fontWeight: 700, color: 'text.primary', mb: 0.75 }}>
                Short Summary <span style={{ color: '#DC2626' }}>*</span>
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={2}
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                placeholder="Brief summary shown on events directory cards..."
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px', backgroundColor: 'background.default' } }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography sx={{ fontSize: '0.86rem', fontWeight: 700, color: 'text.primary', mb: 0.75 }}>
                Full Description & Notes
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="In-depth details, guest speaker bio, parking instructions..."
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px', backgroundColor: 'background.default' } }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography sx={{ fontSize: '0.86rem', fontWeight: 700, color: 'text.primary', mb: 0.75 }}>
                Venue Location
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                placeholder="Main Prayer Hall, 89 Tindal St, Birmingham, B12 9QU"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px', backgroundColor: 'background.default' } }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography sx={{ fontSize: '0.86rem', fontWeight: 700, color: 'text.primary', mb: 0.75 }}>
                Registration URL (Optional)
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="https://..."
                value={formData.registrationUrl}
                onChange={(e) => setFormData({ ...formData, registrationUrl: e.target.value })}
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
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      color="primary"
                    />
                  }
                  label={
                    <div>
                      <Typography sx={{ fontSize: '0.88rem', fontWeight: 700 }}>Featured Event</Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>Promote on homepage banner</Typography>
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
                      <Typography sx={{ fontSize: '0.88rem', fontWeight: 700 }}>Publish Publicly</Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>Display on alfalahcsc.com/events</Typography>
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
            disabled={saving || !formData.title.trim()}
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
              'Schedule Event'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Sleek Custom Confirm Delete Modal */}
      <ConfirmDeleteModal
        open={deleteModal.open}
        onClose={() => setDeleteModal((prev) => ({ ...prev, open: false }))}
        onConfirm={handleConfirmDelete}
        title="Delete Scheduled Event"
        itemName={deleteModal.title}
        loading={deleteModal.loading}
        confirmText="Delete Event"
      />
    </Box>
  );
}
