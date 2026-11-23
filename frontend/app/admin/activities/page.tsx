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
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SearchIcon from '@mui/icons-material/Search';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { ConfirmDeleteModal } from '@/components/admin/ConfirmDeleteModal';
import { ImageUploadPicker } from '@/components/admin/ImageUploadPicker';

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
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
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
    setFormData({
      title: act.title || '',
      slug: act.slug || '',
      category: act.category || 'First Aid & Emergency Training',
      shortDescription: act.shortDescription || '',
      fullDescription: act.fullDescription || '',
      scheduleInfo: act.scheduleInfo || '',
      location: act.location || 'Alfalah Community Support Centre, 89 Tindal St',
      imageUrl: act.imageUrl || '',
      isPublished: act.isPublished ?? true,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      setFeedback({ type: 'error', message: 'Programme title is required.' });
      return;
    }

    try {
      setSaving(true);
      const url = editingId
        ? `/api/v1/admin/activities/${editingId}`
        : '/api/v1/admin/activities';
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
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to save programme');
      }

      setFeedback({
        type: 'success',
        message: editingId ? 'Programme updated successfully.' : 'New programme published successfully.',
      });
      setDialogOpen(false);
      await loadActivities();
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
      const res = await fetch(`/api/v1/admin/activities/${deleteModal.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to delete programme');

      setFeedback({ type: 'success', message: `Programme "${deleteModal.title}" removed successfully.` });
      setDeleteModal({ open: false, id: '', title: '', loading: false });
      await loadActivities();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
      setDeleteModal((prev) => ({ ...prev, loading: false }));
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
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A' }}>
            Activities & Community Programmes
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748B', mt: 0.5 }}>
            Manage academy workshops, certified courses, STEM labs, and community sessions.
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
          Add New Programme
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

      {/* Search Bar */}
      <Card sx={{ mb: 3, p: 1.5, borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search programmes by title, category, or syllabus..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#94A3B8' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: '#F8FAFC',
              borderRadius: '8px',
              fontSize: '0.88rem',
            },
          }}
        />
      </Card>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#3988CA' }} />
        </Box>
      ) : (
        <Card sx={{ borderRadius: '14px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#F8FAFC' }}>
                  <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.78rem' }}>PROGRAMME</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.78rem' }}>CATEGORY</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.78rem' }}>SCHEDULE</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.78rem' }}>STATUS</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, color: '#475569', fontSize: '0.78rem' }}>ACTIONS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredActivities.length > 0 ? (
                  filteredActivities.map((act) => (
                    <TableRow key={act.id} hover sx={{ '&:hover': { backgroundColor: '#F8FAFC' } }}>
                      <TableCell sx={{ minWidth: 260 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          {act.imageUrl ? (
                            <Box
                              component="img"
                              src={act.imageUrl}
                              alt={act.title}
                              sx={{
                                width: 52,
                                height: 52,
                                borderRadius: '10px',
                                objectFit: 'cover',
                                border: '1px solid #E2E8F0',
                                flexShrink: 0,
                              }}
                            />
                          ) : (
                            <Box
                              sx={{
                                width: 52,
                                height: 52,
                                borderRadius: '10px',
                                backgroundColor: '#E0F2FE',
                                color: '#0284C7',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                              }}
                            >
                              <VolunteerActivismIcon sx={{ fontSize: 24 }} />
                            </Box>
                          )}
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0F172A', fontSize: '0.92rem' }}>
                              {act.title}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                color: '#64748B',
                                display: '-webkit-box',
                                WebkitLineClamp: 1,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                fontSize: '0.8rem',
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
                          sx={{
                            fontWeight: 700,
                            fontSize: '0.72rem',
                            backgroundColor: '#F1F5F9',
                            color: '#334155',
                          }}
                        />
                      </TableCell>

                      <TableCell sx={{ color: '#64748B', fontSize: '0.85rem' }}>
                        {act.scheduleInfo || 'See timetable'}
                      </TableCell>

                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        <Chip
                          label={act.isPublished ? 'Published' : 'Draft'}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            fontSize: '0.72rem',
                            backgroundColor: act.isPublished ? '#DCFCE7' : '#F1F5F9',
                            color: act.isPublished ? '#15803D' : '#64748B',
                          }}
                        />
                      </TableCell>

                      <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                        <Tooltip title="Edit Programme">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenEdit(act)}
                            sx={{
                              color: '#3988CA',
                              border: '1px solid #E2E8F0',
                              mr: 1,
                              '&:hover': { backgroundColor: '#F0F9FF' },
                            }}
                          >
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Programme">
                          <IconButton
                            size="small"
                            onClick={() => promptDelete(act.id, act.title)}
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
                    <TableCell colSpan={5} sx={{ textAlign: 'center', py: 6, color: '#64748B' }}>
                      <VolunteerActivismIcon sx={{ fontSize: 48, color: '#94A3B8', opacity: 0.4, mb: 1, display: 'block', mx: 'auto' }} />
                      <Typography variant="body1" sx={{ fontWeight: 700, color: '#0F172A', mb: 0.5 }}>
                        No programmes found
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748B' }}>
                        Click &quot;Add New Programme&quot; above to create your first activity.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {/* Add / Edit Dialog (Professional Linear/Vercel Layout) */}
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
            borderBottom: '1px solid #E2E8F0',
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
              <AutoAwesomeIcon sx={{ fontSize: 20 }} />
            </Box>
            <div>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', fontSize: '1.15rem' }}>
                {editingId ? 'Edit Programme Details' : 'Add New Community Programme'}
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748B' }}>
                {editingId ? 'Update details, schedule, or media for this programme' : 'Publish a new workshop or certified course to the live portal'}
              </Typography>
            </div>
          </Box>

          <IconButton
            size="small"
            onClick={() => setDialogOpen(false)}
            disabled={saving}
            sx={{ color: '#94A3B8', '&:hover': { color: '#0F172A' } }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {/* Programme Title */}
            <Grid item xs={12} sm={8}>
              <Typography sx={{ fontSize: '0.86rem', fontWeight: 700, color: '#1E293B', mb: 0.75 }}>
                Programme Title <span style={{ color: '#DC2626' }}>*</span>
              </Typography>
              <TextField
                fullWidth
                size="small"
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
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px', backgroundColor: '#F8FAFC' } }}
              />
            </Grid>

            {/* Category */}
            <Grid item xs={12} sm={4}>
              <Typography sx={{ fontSize: '0.86rem', fontWeight: 700, color: '#1E293B', mb: 0.75 }}>
                Category <span style={{ color: '#DC2626' }}>*</span>
              </Typography>
              <TextField
                select
                fullWidth
                size="small"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px', backgroundColor: '#F8FAFC' } }}
              >
                {CATEGORIES.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Short Summary */}
            <Grid item xs={12}>
              <Typography sx={{ fontSize: '0.86rem', fontWeight: 700, color: '#1E293B', mb: 0.75 }}>
                Short Summary <span style={{ color: '#DC2626' }}>*</span>
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={2}
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                placeholder="Brief 1-2 sentence overview displayed on the public card..."
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px', backgroundColor: '#F8FAFC' } }}
              />
            </Grid>

            {/* Full Details & Syllabus */}
            <Grid item xs={12}>
              <Typography sx={{ fontSize: '0.86rem', fontWeight: 700, color: '#1E293B', mb: 0.75 }}>
                Full Details & Syllabus
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={formData.fullDescription}
                onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                placeholder="Detailed syllabus, qualifications provided, requirements, or what students need to bring..."
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px', backgroundColor: '#F8FAFC' } }}
              />
            </Grid>

            {/* Schedule & Location */}
            <Grid item xs={12} sm={6}>
              <Typography sx={{ fontSize: '0.86rem', fontWeight: 700, color: '#1E293B', mb: 0.75 }}>
                Schedule & Timings
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={formData.scheduleInfo}
                onChange={(e) => setFormData({ ...formData, scheduleInfo: e.target.value })}
                placeholder="e.g. Every Saturday: 10:00 AM – 12:00 PM"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px', backgroundColor: '#F8FAFC' } }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography sx={{ fontSize: '0.86rem', fontWeight: 700, color: '#1E293B', mb: 0.75 }}>
                Location / Venue
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Alfalah Community Support Centre, 89 Tindal St"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px', backgroundColor: '#F8FAFC' } }}
              />
            </Grid>

            {/* Interactive Image Upload Picker */}
            <Grid item xs={12}>
              <ImageUploadPicker
                value={formData.imageUrl}
                onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                label="Cover Image / Banner"
                helperText="Upload a photo directly from your device, or enter a custom link."
              />
            </Grid>

            {/* Visibility Toggle */}
            <Grid item xs={12}>
              <Box
                sx={{
                  p: 2,
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  backgroundColor: '#F8FAFC',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A' }}>
                    Publish to Public Website
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748B' }}>
                    When enabled, this programme is immediately visible on alfalahcsc.com/activities and the services directory.
                  </Typography>
                </div>
                <Switch
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  color="primary"
                />
              </Box>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 2.5, borderTop: '1px solid #E2E8F0', gap: 1.5 }}>
          <Button
            onClick={() => setDialogOpen(false)}
            disabled={saving}
            sx={{ color: '#64748B', fontWeight: 600, textTransform: 'none', px: 2.5 }}
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
              'Update Programme'
            ) : (
              'Publish Programme'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Sleek Custom Confirm Delete Modal */}
      <ConfirmDeleteModal
        open={deleteModal.open}
        onClose={() => setDeleteModal((prev) => ({ ...prev, open: false }))}
        onConfirm={handleConfirmDelete}
        title="Delete Community Programme"
        itemName={deleteModal.title}
        loading={deleteModal.loading}
        confirmText="Yes, Delete Programme"
      />
    </Box>
  );
}
