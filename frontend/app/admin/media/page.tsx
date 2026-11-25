'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  InputAdornment,
  useTheme,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import VideocamIcon from '@mui/icons-material/Videocam';
import CollectionsIcon from '@mui/icons-material/Collections';
import FolderZipIcon from '@mui/icons-material/FolderZip';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { ConfirmDeleteModal } from '@/components/admin/ConfirmDeleteModal';

interface MediaItem {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  storagePath: string;
  title?: string;
  category?: string;
  altText?: string;
  caption?: string;
  isGallery?: boolean;
  displayOrder?: number;
  createdAt: string;
}

const GALLERY_CATEGORIES = [
  { id: 'all', label: 'All Photos' },
  { id: 'stem', label: 'Youth STEM & Robotics' },
  { id: 'sakeena', label: 'Sakeena Learning Hub' },
  { id: 'worship', label: 'Prayers & Worship' },
  { id: 'facilities', label: 'Mosque Facilities' },
  { id: 'community', label: 'Community & Eid' },
];

const CATEGORY_LABELS: Record<string, string> = {
  stem: 'Youth STEM & Robotics',
  sakeena: 'Sakeena Learning Hub',
  worship: 'Prayers & Worship',
  facilities: 'Mosque Facilities',
  community: 'Community & Eid',
  document: 'Official Document',
  general: 'General Asset',
};

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  stem: { bg: '#E0F2FE', text: '#0369A1', border: '#BAE6FD' },
  sakeena: { bg: '#FDF4FF', text: '#A21CAF', border: '#F5D0FE' },
  worship: { bg: '#ECFDF5', text: '#047857', border: '#A7F3D0' },
  facilities: { bg: '#FEF3C7', text: '#B45309', border: '#FDE68A' },
  community: { bg: '#EEF2FF', text: '#4338CA', border: '#C7D2FE' },
  document: { bg: '#F1F5F9', text: '#475569', border: '#CBD5E1' },
  general: { bg: '#F1F5F9', text: '#475569', border: '#CBD5E1' },
};

export default function AdminMediaGalleryPage() {
  const muiTheme = useTheme();
  const isDark = muiTheme.palette.mode === 'dark';
  const [activeTab, setActiveTab] = useState<number>(0);
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Gallery Filters
  const [galleryCategory, setGalleryCategory] = useState<string>('all');
  const [assetFilter, setAssetFilter] = useState<'all' | 'documents' | 'images'>('all');

  // Video Walkthrough Settings
  const [videoUrl, setVideoUrl] = useState('/videos/community-tour.mp4');
  const [videoTitle, setVideoTitle] = useState('Video Walkthrough & Centre Atmosphere');
  const [videoSubtitle, setVideoSubtitle] = useState('Experience the warm, welcoming environment at 89 Tindal Street, Balsall Heath');
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [savingVideo, setSavingVideo] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  // Add / Edit Photo Modal
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<MediaItem | null>(null);
  const [modalFile, setModalFile] = useState<File | null>(null);
  const [modalTitle, setModalTitle] = useState('');
  const [modalCategory, setModalCategory] = useState('community');
  const [modalCaption, setModalCaption] = useState('');
  const [modalOrder, setModalOrder] = useState<number>(0);
  const [modalSaving, setModalSaving] = useState(false);

  // Delete Modal
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    id: string;
    name: string;
    isGalleryItem: boolean;
    loading: boolean;
  }>({
    open: false,
    id: '',
    name: '',
    isGalleryItem: false,
    loading: false,
  });

  // General Upload in Assets tab
  const [assetFile, setAssetFile] = useState<File | null>(null);
  const [assetAltText, setAssetAltText] = useState('');
  const [assetUploading, setAssetUploading] = useState(false);

  useEffect(() => {
    loadAllData();
  }, []);

  async function loadAllData() {
    setLoading(true);
    try {
      const [mediaRes, settingsRes] = await Promise.all([
        fetch('/api/v1/admin/media', { credentials: 'include' }),
        fetch('/api/v1/site-settings'),
      ]);

      if (mediaRes.ok) {
        const mediaData = await mediaRes.json();
        if (Array.isArray(mediaData)) {
          setMediaList(mediaData);
        }
      }

      if (settingsRes.ok) {
        const settings = await settingsRes.json();
        if (settings.gallery_video_url !== undefined) setVideoUrl(settings.gallery_video_url);
        if (settings.gallery_video_title !== undefined) setVideoTitle(settings.gallery_video_title);
        if (settings.gallery_video_subtitle !== undefined) setVideoSubtitle(settings.gallery_video_subtitle);
        if (settings.gallery_video_enabled !== undefined) setVideoEnabled(settings.gallery_video_enabled !== 'false');
      }
    } catch (err: any) {
      console.error('Error loading media data:', err);
      setFeedback({ type: 'error', message: 'Failed to load media assets.' });
    } finally {
      setLoading(false);
    }
  }

  // Gallery items vs Asset items
  const galleryItems = mediaList.filter((m) => m.isGallery);
  const filteredGalleryItems = galleryCategory === 'all'
    ? galleryItems
    : galleryItems.filter((m) => m.category === galleryCategory);

  const assetItems = mediaList.filter((m) => {
    if (assetFilter === 'documents') return m.mimeType === 'application/pdf';
    if (assetFilter === 'images') return m.mimeType.startsWith('image/');
    return true;
  });

  // Handlers for Video Walkthrough
  const handleSaveVideoSettings = async () => {
    try {
      setSavingVideo(true);
      setFeedback(null);

      const updates = [
        { key: 'gallery_video_url', value: videoUrl },
        { key: 'gallery_video_title', value: videoTitle },
        { key: 'gallery_video_subtitle', value: videoSubtitle },
        { key: 'gallery_video_enabled', value: videoEnabled ? 'true' : 'false' },
      ];

      for (const item of updates) {
        const res = await fetch('/api/v1/admin/site-settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(item),
        });
        if (!res.ok) throw new Error(`Failed to save ${item.key}`);
      }

      setFeedback({ type: 'success', message: 'Featured Video Tour settings updated successfully!' });
      setVideoModalOpen(false);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to update video settings.' });
    } finally {
      setSavingVideo(false);
    }
  };

  // Handlers for Add / Edit Photo
  const handleOpenAddPhoto = () => {
    setEditingPhoto(null);
    setModalFile(null);
    setModalTitle('');
    setModalCategory(galleryCategory !== 'all' ? galleryCategory : 'community');
    setModalCaption('');
    setModalOrder(galleryItems.length + 1);
    setPhotoModalOpen(true);
  };

  const handleOpenEditPhoto = (photo: MediaItem) => {
    setEditingPhoto(photo);
    setModalFile(null);
    setModalTitle(photo.title || photo.originalName);
    setModalCategory(photo.category || 'community');
    setModalCaption(photo.caption || '');
    setModalOrder(photo.displayOrder || 0);
    setPhotoModalOpen(true);
  };

  const handleSavePhotoModal = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalSaving(true);
    setFeedback(null);

    try {
      if (editingPhoto) {
        // Update existing item metadata
        const res = await fetch(`/api/v1/admin/media/${editingPhoto.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            title: modalTitle,
            category: modalCategory,
            caption: modalCaption,
            displayOrder: Number(modalOrder) || 0,
            isGallery: true,
          }),
        });
        if (!res.ok) throw new Error('Failed to update gallery photo details');
        setFeedback({ type: 'success', message: `Gallery photo "${modalTitle}" updated successfully.` });
      } else {
        // Upload new photo
        if (!modalFile) throw new Error('Please select an image file to upload.');

        const formData = new FormData();
        formData.append('file', modalFile);
        formData.append('title', modalTitle || modalFile.name.replace(/\.[^/.]+$/, ''));
        formData.append('category', modalCategory);
        formData.append('caption', modalCaption);
        formData.append('isGallery', 'true');
        formData.append('altText', modalTitle || modalFile.name);

        const res = await fetch('/api/v1/admin/media/upload', {
          method: 'POST',
          credentials: 'include',
          body: formData,
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || 'Upload failed');
        }

        setFeedback({ type: 'success', message: `Photo "${modalTitle || modalFile.name}" added to gallery.` });
      }

      setPhotoModalOpen(false);
      await loadAllData();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setModalSaving(false);
    }
  };

  // Handlers for General File Upload (Tab 2)
  const handleUploadGeneralAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetFile) return;

    setAssetUploading(true);
    setFeedback(null);

    try {
      const formData = new FormData();
      formData.append('file', assetFile);
      formData.append('altText', assetAltText || assetFile.name);
      formData.append('title', assetFile.name);
      formData.append('category', assetFile.type === 'application/pdf' ? 'document' : 'general');
      formData.append('isGallery', 'false');

      const res = await fetch('/api/v1/admin/media/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || 'Upload failed');
      }

      setFeedback({ type: 'success', message: `File "${assetFile.name}" uploaded successfully.` });
      setAssetFile(null);
      setAssetAltText('');
      await loadAllData();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setAssetUploading(false);
    }
  };

  // Delete Action
  const promptDelete = (id: string, name: string, isGalleryItem: boolean) => {
    setDeleteModal({ open: true, id, name, isGalleryItem, loading: false });
  };

  const handleConfirmDelete = async () => {
    try {
      setDeleteModal((prev) => ({ ...prev, loading: true }));
      const res = await fetch(`/api/v1/admin/media/${deleteModal.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Delete failed');

      setFeedback({
        type: 'success',
        message: `${deleteModal.isGalleryItem ? 'Gallery item' : 'File asset'} "${deleteModal.name}" removed successfully.`,
      });
      setDeleteModal({ open: false, id: '', name: '', isGalleryItem: false, loading: false });
      await loadAllData();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
      setDeleteModal((prev) => ({ ...prev, loading: false }));
    }
  };

  const copyUrl = (path: string) => {
    const fullUrl = path.startsWith('http') ? path : `${window.location.origin}${path}`;
    navigator.clipboard.writeText(fullUrl);
    setFeedback({ type: 'success', message: `Copied URL to clipboard: ${fullUrl}` });
  };

  return (
    <Box sx={{ maxWidth: 1280, mx: 'auto', pb: 6 }}>
      {/* Header Banner */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.02em' }}>
            Gallery & Media Content Manager
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Curate photos and walkthrough video for the public gallery (alfalahcsc.com/gallery) and manage website documents.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            variant="outlined"
            size="small"
            href="/gallery"
            target="_blank"
            rel="noopener noreferrer"
            endIcon={<OpenInNewIcon fontSize="small" />}
            sx={{
              borderColor: 'divider',
              color: 'text.primary',
              textTransform: 'none',
              fontWeight: 700,
              borderRadius: '9999px',
              px: 2,
            }}
          >
            View Public Gallery
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={handleOpenAddPhoto}
            startIcon={<AddPhotoAlternateIcon />}
            sx={{
              backgroundColor: '#3988CA',
              color: '#ffffff',
              textTransform: 'none',
              fontWeight: 700,
              borderRadius: '9999px',
              px: 2.2,
              boxShadow: 'none',
              '&:hover': { backgroundColor: '#2b6ea6', boxShadow: 'none' },
            }}
          >
            Add Photo to Gallery
          </Button>
        </Box>
      </Box>

      {/* Global Feedback Alert */}
      {feedback && (
        <Alert
          severity={feedback.type}
          sx={{ mb: 3, borderRadius: '12px', fontWeight: 600 }}
          onClose={() => setFeedback(null)}
        >
          {feedback.message}
        </Alert>
      )}

      {/* Top Level Navigation Tabs */}
      <Card sx={{ mb: 3.5, borderRadius: '16px', border: '1px solid', borderColor: 'divider', boxShadow: '0 2px 8px rgba(15,23,42,0.04)' }}>
        <Tabs
          value={activeTab}
          onChange={(_, v) => setActiveTab(v)}
          sx={{
            px: 2,
            pt: 1,
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '0.95rem',
              minHeight: 52,
            },
            '& .Mui-selected': {
              color: '#3988CA',
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#3988CA',
              height: 3,
              borderRadius: '3px 3px 0 0',
            },
          }}
        >
          <Tab
            icon={<CollectionsIcon fontSize="small" />}
            iconPosition="start"
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>Community Gallery Showcase</span>
                <Chip
                  label={`${galleryItems.length} photos`}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    backgroundColor: activeTab === 0 ? 'rgba(57, 136, 202, 0.18)' : 'rgba(148, 163, 184, 0.16)',
                    color: activeTab === 0 ? '#0284C7' : '#64748B',
                  }}
                />
              </Box>
            }
          />
          <Tab
            icon={<FolderZipIcon fontSize="small" />}
            iconPosition="start"
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>All File Assets & Documents</span>
                <Chip
                  label={`${assetItems.length} files`}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    backgroundColor: activeTab === 1 ? 'rgba(57, 136, 202, 0.18)' : 'rgba(148, 163, 184, 0.16)',
                    color: activeTab === 1 ? '#0284C7' : '#64748B',
                  }}
                />
              </Box>
            }
          />
        </Tabs>
      </Card>

      {/* ============================================================== */}
      {/* TAB 0: COMMUNITY GALLERY SHOWCASE */}
      {/* ============================================================== */}
      {activeTab === 0 && (
        <Box>
          {/* Featured Video Tour Card */}
          <Card
            sx={{
              mb: 3.5,
              borderRadius: '16px',
              border: '1px solid', borderColor: 'divider',
              boxShadow: '0 2px 10px rgba(15,23,42,0.03)',
              background: isDark ? 'linear-gradient(135deg, rgba(57, 136, 202, 0.14) 0%, #111d30 100%)' : 'linear-gradient(135deg, #F0F9FF 0%, #FFFFFF 100%)',
            }}
          >
            <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: '12px',
                      backgroundColor: '#3988CA',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <VideocamIcon />
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'text.primary' }}>
                        {videoTitle}
                      </Typography>
                      <Chip
                        label={videoEnabled ? 'Active on Public Gallery' : 'Hidden from Gallery'}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          backgroundColor: videoEnabled ? 'rgba(34, 197, 94, 0.16)' : 'rgba(148, 163, 184, 0.16)',
                          color: videoEnabled ? '#15803D' : '#64748B',
                        }}
                      />
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: { xs: 260, sm: 460, md: 620 },
                      }}
                    >
                      Source: {videoUrl}
                    </Typography>
                  </Box>
                </Box>

                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<EditIcon fontSize="small" />}
                  onClick={() => setVideoModalOpen(true)}
                  sx={{
                    borderRadius: '8px',
                    borderColor: '#3988CA',
                    color: '#3988CA',
                    fontWeight: 700,
                    textTransform: 'none',
                    '&:hover': { backgroundColor: 'rgba(57, 136, 202, 0.14)', borderColor: '#2b6ea6' },
                  }}
                >
                  Configure Video Tour
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Category Filter Pills & Photo Count */}
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {GALLERY_CATEGORIES.map((cat) => {
                const isSelected = galleryCategory === cat.id;
                const count = cat.id === 'all'
                  ? galleryItems.length
                  : galleryItems.filter((i) => i.category === cat.id).length;

                return (
                  <Chip
                    key={cat.id}
                    label={`${cat.label} (${count})`}
                    onClick={() => setGalleryCategory(cat.id)}
                    sx={{
                      cursor: 'pointer',
                      fontWeight: isSelected ? 800 : 600,
                      backgroundColor: isSelected ? '#3988CA' : 'background.paper',
                      color: isSelected ? '#FFFFFF' : '#475569',
                      border: '1px solid', borderColor: isSelected ? '#3988CA' : 'divider',
                      '&:hover': {
                        backgroundColor: isSelected ? '#2b6ea6' : 'action.hover',
                      },
                    }}
                  />
                );
              })}
            </Box>

            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
              Showing {filteredGalleryItems.length} of {galleryItems.length} gallery photos
            </Typography>
          </Box>

          {/* Gallery Photos Grid */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
              <CircularProgress sx={{ color: '#3988CA' }} />
            </Box>
          ) : filteredGalleryItems.length > 0 ? (
            <Grid container spacing={2.5}>
              {filteredGalleryItems.map((item) => {
                const catColor = CATEGORY_COLORS[item.category || 'community'] || CATEGORY_COLORS.community;
                const catLabel = CATEGORY_LABELS[item.category || 'community'] || item.category;

                return (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: '16px',
                        border: '1px solid', borderColor: 'divider',
                        boxShadow: '0 2px 8px rgba(15,23,42,0.04)',
                        overflow: 'hidden',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 6px 20px rgba(15,23,42,0.08)',
                        },
                      }}
                    >
                      {/* Thumbnail Frame */}
                      <Box
                        sx={{
                          position: 'relative',
                          height: 180,
                          backgroundColor: '#0F172A',
                          overflow: 'hidden',
                        }}
                      >
                        <img
                          src={item.storagePath}
                          alt={item.title || item.originalName}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          loading="lazy"
                        />
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 10,
                            left: 10,
                            backgroundColor: catColor.bg,
                            color: catColor.text,
                            border: `1px solid ${catColor.border}`,
                            fontSize: '0.7rem',
                            fontWeight: 800,
                            px: 1,
                            py: 0.3,
                            borderRadius: '9999px',
                            backdropFilter: 'blur(4px)',
                          }}
                        >
                          {catLabel}
                        </Box>
                      </Box>

                      {/* Content */}
                      <CardContent sx={{ flex: 1, p: 2, display: 'flex', flexDirection: 'column' }}>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: 800,
                            color: 'text.primary',
                            mb: 0.5,
                            lineHeight: 1.3,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                          }}
                        >
                          {item.title || item.originalName}
                        </Typography>

                        <Typography
                          variant="caption"
                          sx={{
                            color: 'text.secondary',
                            lineHeight: 1.4,
                            flex: 1,
                            mb: 1.5,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                          }}
                        >
                          {item.caption || 'No caption entered.'}
                        </Typography>

                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            pt: 1,
                            borderTop: '1px solid', borderColor: 'divider',
                          }}
                        >
                          <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 600 }}>
                            Order: #{item.displayOrder || 0}
                          </Typography>

                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <Tooltip title="Copy Image URL">
                              <IconButton size="small" onClick={() => copyUrl(item.storagePath)}>
                                <ContentCopyIcon fontSize="small" sx={{ fontSize: 16 }} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit Title & Category">
                              <IconButton size="small" onClick={() => handleOpenEditPhoto(item)}>
                                <EditIcon fontSize="small" sx={{ fontSize: 16, color: '#3988CA' }} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete from Gallery">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => promptDelete(item.id, item.title || item.originalName, true)}
                              >
                                <DeleteIcon fontSize="small" sx={{ fontSize: 16 }} />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          ) : (
            <Card sx={{ p: 5, textAlign: 'center', borderRadius: '16px', border: '1px dashed #CBD5E1' }}>
              <AddPhotoAlternateIcon sx={{ fontSize: 44, color: '#94A3B8', mb: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}>
                No photos in this category yet
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                Click below to upload the first photograph for this category.
              </Typography>
              <Button
                variant="contained"
                onClick={handleOpenAddPhoto}
                startIcon={<AddPhotoAlternateIcon />}
                sx={{
                  backgroundColor: '#3988CA',
                  borderRadius: '9999px',
                  textTransform: 'none',
                  fontWeight: 700,
                  boxShadow: 'none',
                  '&:hover': { backgroundColor: '#2b6ea6', boxShadow: 'none' },
                }}
              >
                Add Gallery Photo
              </Button>
            </Card>
          )}
        </Box>
      )}

      {/* ============================================================== */}
      {/* TAB 1: ALL FILE ASSETS & DOCUMENTS */}
      {/* ============================================================== */}
      {activeTab === 1 && (
        <Box>
          {/* Upload Asset Bar */}
          <Card sx={{ mb: 3.5, borderRadius: '16px', border: '1px solid', borderColor: 'divider', boxShadow: '0 2px 8px rgba(15,23,42,0.04)' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'text.primary', mb: 1.5 }}>
                Upload Document or Image Asset (PDFs & Images up to 10MB)
              </Typography>

              <Box component="form" onSubmit={handleUploadGeneralAsset}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={4}>
                    <Button
                      variant="outlined"
                      component="label"
                      fullWidth
                      startIcon={<CloudUploadIcon />}
                      sx={{
                        height: 50,
                        borderRadius: '10px',
                        borderColor: 'divider',
                        color: 'text.primary',
                        textTransform: 'none',
                        fontWeight: 600,
                      }}
                    >
                      <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {assetFile ? assetFile.name : 'Select PDF or Image...'}
                      </Box>
                      <input
                        type="file"
                        hidden
                        accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setAssetFile(e.target.files[0]);
                          }
                        }}
                      />
                    </Button>
                  </Grid>

                  <Grid item xs={12} sm={5}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Alternative Text / Description"
                      placeholder="e.g. Official Bi-Monthly Timetable"
                      value={assetAltText}
                      onChange={(e) => setAssetAltText(e.target.value)}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px', height: 50 } }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      disabled={!assetFile || assetUploading}
                      sx={{
                        height: 50,
                        borderRadius: '10px',
                        backgroundColor: '#3988CA',
                        fontWeight: 700,
                        textTransform: 'none',
                        boxShadow: 'none',
                        '&:hover': { backgroundColor: '#2b6ea6', boxShadow: 'none' },
                      }}
                    >
                      {assetUploading ? 'Uploading...' : 'Upload File Asset'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>

          {/* Filter Pills */}
          <Box sx={{ mb: 2.5, display: 'flex', gap: 1 }}>
            {(['all', 'documents', 'images'] as const).map((filterKey) => (
              <Chip
                key={filterKey}
                label={
                  filterKey === 'all'
                    ? `All Files (${mediaList.length})`
                    : filterKey === 'documents'
                    ? `PDF Documents (${mediaList.filter((m) => m.mimeType === 'application/pdf').length})`
                    : `Images (${mediaList.filter((m) => m.mimeType.startsWith('image/')).length})`
                }
                onClick={() => setAssetFilter(filterKey)}
                sx={{
                  fontWeight: assetFilter === filterKey ? 800 : 600,
                  backgroundColor: assetFilter === filterKey ? '#3988CA' : 'background.paper',
                  color: assetFilter === filterKey ? '#FFFFFF' : '#475569',
                  border: '1px solid', borderColor: assetFilter === filterKey ? '#3988CA' : 'divider',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: assetFilter === filterKey ? '#2b6ea6' : 'action.hover',
                  },
                }}
              />
            ))}
          </Box>

          {/* Assets Grid */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
              <CircularProgress sx={{ color: '#3988CA' }} />
            </Box>
          ) : assetItems.length > 0 ? (
            <Grid container spacing={2.5}>
              {assetItems.map((m) => {
                const isPdf = m.mimeType === 'application/pdf';

                return (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={m.id}>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: '14px',
                        border: '1px solid', borderColor: 'divider',
                        boxShadow: '0 2px 6px rgba(15,23,42,0.03)',
                        overflow: 'hidden',
                      }}
                    >
                      {/* File Preview */}
                      <Box
                        sx={{
                          height: 140,
                          backgroundColor: isPdf ? (isDark ? 'rgba(239, 68, 68, 0.12)' : '#FEF2F2') : 'background.default',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderBottom: '1px solid', borderColor: 'divider',
                          position: 'relative',
                        }}
                      >
                        {isPdf ? (
                          <Box sx={{ textAlign: 'center', p: 2 }}>
                            <PictureAsPdfIcon sx={{ fontSize: 44, color: '#EF4444', mb: 0.5 }} />
                            <Typography variant="caption" sx={{ display: 'block', fontWeight: 700, color: '#991B1B' }}>
                              PDF Document
                            </Typography>
                          </Box>
                        ) : (
                          <img
                            src={m.storagePath}
                            alt={m.altText || m.originalName}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        )}

                        {m.isGallery && (
                          <Chip
                            label="In Gallery"
                            size="small"
                            sx={{
                              position: 'absolute',
                              top: 8,
                              right: 8,
                              height: 18,
                              fontSize: '0.65rem',
                              fontWeight: 700,
                              backgroundColor: '#DCFCE7',
                              color: '#15803D',
                            }}
                          />
                        )}
                      </Box>

                      {/* Info & Actions */}
                      <CardContent sx={{ flex: 1, p: 2 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 700,
                            color: 'text.primary',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                          title={m.originalName}
                        >
                          {m.originalName}
                        </Typography>

                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5, mb: 1.5 }}>
                          {(m.sizeBytes / 1024).toFixed(1)} KB • {new Date(m.createdAt).toLocaleDateString()}
                        </Typography>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Button
                            size="small"
                            startIcon={<ContentCopyIcon fontSize="small" />}
                            onClick={() => copyUrl(m.storagePath)}
                            sx={{
                              textTransform: 'none',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: 'text.secondary',
                              p: 0,
                              minWidth: 'auto',
                            }}
                          >
                            Copy URL
                          </Button>

                          <Tooltip title="Delete file from server">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => promptDelete(m.id, m.originalName, false)}
                            >
                              <DeleteIcon fontSize="small" sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          ) : (
            <Card sx={{ p: 4, textAlign: 'center', borderRadius: '16px' }}>
              <Typography color="text.secondary">No files found matching the filter.</Typography>
            </Card>
          )}
        </Box>
      )}

      {/* ============================================================== */}
      {/* MODAL: ADD / EDIT GALLERY PHOTO */}
      {/* ============================================================== */}
      <Dialog
        open={photoModalOpen}
        onClose={() => !modalSaving && setPhotoModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px', p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: 'text.primary', pb: 1 }}>
          {editingPhoto ? 'Edit Gallery Photo Details' : 'Add New Photograph to Public Gallery'}
        </DialogTitle>
        <Box component="form" onSubmit={handleSavePhotoModal}>
          <DialogContent sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* File Dropzone (Only for new uploads) */}
            {!editingPhoto ? (
              <Box>
                <Typography sx={{ fontSize: '0.84rem', fontWeight: 700, color: 'text.primary', mb: 0.75 }}>
                  Select Image File (JPG, PNG, WebP)
                </Typography>
                <Box
                  component="label"
                  sx={{
                    border: '2px dashed #CBD5E1',
                    borderRadius: '12px',
                    p: 2.5,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'background.default',
                    cursor: 'pointer',
                    '&:hover': { borderColor: '#3988CA', backgroundColor: 'rgba(57, 136, 202, 0.12)' },
                  }}
                >
                  <input
                    type="file"
                    hidden
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        setModalFile(file);
                        if (!modalTitle) {
                          setModalTitle(file.name.replace(/\.[^/.]+$/, ''));
                        }
                      }
                    }}
                  />
                  {modalFile ? (
                    <Box sx={{ textAlign: 'center' }}>
                      <CheckCircleOutlineIcon sx={{ fontSize: 32, color: '#16A34A', mb: 0.5 }} />
                      <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                        {modalFile.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {(modalFile.size / 1024).toFixed(1)} KB • Click to change file
                      </Typography>
                    </Box>
                  ) : (
                    <Box sx={{ textAlign: 'center' }}>
                      <CloudUploadIcon sx={{ fontSize: 36, color: '#3988CA', mb: 0.5 }} />
                      <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                        Click to browse or drop photograph here
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        High quality JPG or PNG recommended (up to 10MB)
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1.5, backgroundColor: 'background.default', borderRadius: '12px' }}>
                <img
                  src={editingPhoto.storagePath}
                  alt={editingPhoto.title || ''}
                  style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: '8px' }}
                />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    {editingPhoto.originalName}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Path: {editingPhoto.storagePath}
                  </Typography>
                </Box>
              </Box>
            )}

            {/* Photo Title */}
            <Box>
              <Typography sx={{ fontSize: '0.84rem', fontWeight: 700, color: 'text.primary', mb: 0.75 }}>
                Photo Title *
              </Typography>
              <TextField
                fullWidth
                size="small"
                required
                placeholder="e.g. Youth STEM & Robotics Workshop"
                value={modalTitle}
                onChange={(e) => setModalTitle(e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
              />
            </Box>

            {/* Category Select */}
            <Box>
              <Typography sx={{ fontSize: '0.84rem', fontWeight: 700, color: 'text.primary', mb: 0.75 }}>
                Public Gallery Category *
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={modalCategory}
                  onChange={(e) => setModalCategory(e.target.value)}
                  sx={{ borderRadius: '10px' }}
                >
                  <MenuItem value="stem">Youth STEM & Robotics</MenuItem>
                  <MenuItem value="sakeena">Sakeena Learning Hub</MenuItem>
                  <MenuItem value="worship">Prayers & Worship</MenuItem>
                  <MenuItem value="facilities">Mosque Facilities</MenuItem>
                  <MenuItem value="community">Community & Eid</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Caption / Description */}
            <Box>
              <Typography sx={{ fontSize: '0.84rem', fontWeight: 700, color: 'text.primary', mb: 0.75 }}>
                Caption / Description (Visible on card & lightbox)
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Brief summary explaining what visitors see in this photograph..."
                value={modalCaption}
                onChange={(e) => setModalCaption(e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
              />
            </Box>

            {/* Display Order */}
            <Box>
              <Typography sx={{ fontSize: '0.84rem', fontWeight: 700, color: 'text.primary', mb: 0.75 }}>
                Display Priority Order
              </Typography>
              <TextField
                type="number"
                size="small"
                value={modalOrder}
                onChange={(e) => setModalOrder(Number(e.target.value))}
                sx={{ width: 140, '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                helperText="Lower numbers appear first"
              />
            </Box>
          </DialogContent>

          <DialogActions sx={{ p: 2, pt: 1, gap: 1 }}>
            <Button
              onClick={() => setPhotoModalOpen(false)}
              disabled={modalSaving}
              sx={{ textTransform: 'none', fontWeight: 600, color: 'text.secondary' }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={modalSaving || (!editingPhoto && !modalFile)}
              sx={{
                backgroundColor: '#3988CA',
                borderRadius: '10px',
                textTransform: 'none',
                fontWeight: 700,
                px: 3,
                boxShadow: 'none',
                '&:hover': { backgroundColor: '#2b6ea6', boxShadow: 'none' },
              }}
            >
              {modalSaving ? 'Saving...' : editingPhoto ? 'Update Photo Details' : 'Add to Gallery'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* ============================================================== */}
      {/* MODAL: CONFIGURE FEATURED VIDEO TOUR */}
      {/* ============================================================== */}
      <Dialog
        open={videoModalOpen}
        onClose={() => !savingVideo && setVideoModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px', p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: 'text.primary', pb: 1 }}>
          Configure Featured Walkthrough Video
        </DialogTitle>
        <DialogContent sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            This video is prominently featured at the top of the public Gallery page (alfalahcsc.com/gallery).
          </Typography>

          <Box>
            <Typography sx={{ fontSize: '0.84rem', fontWeight: 700, color: 'text.primary', mb: 0.75 }}>
              Video File Path or Stream URL *
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="/videos/community-tour.mp4 or https://..."
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
              helperText="Default: /videos/community-tour.mp4"
            />
          </Box>

          <Box>
            <Typography sx={{ fontSize: '0.84rem', fontWeight: 700, color: 'text.primary', mb: 0.75 }}>
              Section Title
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="e.g. Video Walkthrough & Centre Atmosphere"
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
            />
          </Box>

          <Box>
            <Typography sx={{ fontSize: '0.84rem', fontWeight: 700, color: 'text.primary', mb: 0.75 }}>
              Subtitle Description
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="e.g. Experience the warm, welcoming environment at 89 Tindal Street..."
              value={videoSubtitle}
              onChange={(e) => setVideoSubtitle(e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
            />
          </Box>

          <Box sx={{ p: 1.5, backgroundColor: 'background.default', borderRadius: '12px', border: '1px solid', borderColor: 'divider' }}>
            <FormControlLabel
              control={
                <Switch
                  checked={videoEnabled}
                  onChange={(e) => setVideoEnabled(e.target.checked)}
                  color="primary"
                />
              }
              label={
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    Show Video Section on Public Gallery
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Toggle off if you wish to temporarily hide the video player on the gallery page.
                  </Typography>
                </Box>
              }
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2, pt: 1, gap: 1 }}>
          <Button
            onClick={() => setVideoModalOpen(false)}
            disabled={savingVideo}
            sx={{ textTransform: 'none', fontWeight: 600, color: 'text.secondary' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveVideoSettings}
            variant="contained"
            disabled={savingVideo}
            sx={{
              backgroundColor: '#3988CA',
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 700,
              px: 3,
              boxShadow: 'none',
              '&:hover': { backgroundColor: '#2b6ea6', boxShadow: 'none' },
            }}
          >
            {savingVideo ? 'Saving...' : 'Save Video Settings'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ============================================================== */}
      {/* CONFIRM DELETE MODAL */}
      {/* ============================================================== */}
      <ConfirmDeleteModal
        open={deleteModal.open}
        onClose={() => setDeleteModal((prev) => ({ ...prev, open: false }))}
        onConfirm={handleConfirmDelete}
        title={deleteModal.isGalleryItem ? 'Remove Photo from Gallery' : 'Delete File Asset'}
        itemName={deleteModal.name}
        loading={deleteModal.loading}
        confirmText={deleteModal.isGalleryItem ? 'Remove from Gallery' : 'Delete File'}
      />
    </Box>
  );
}
