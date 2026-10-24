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
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

export default function AdminMediaPage() {
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [altText, setAltText] = useState('');
  const [uploading, setUploading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    loadMedia();
  }, []);

  async function loadMedia() {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/admin/media', { credentials: 'include' });
      if (res.ok) {
        const json = await res.json();
        setMediaList(json);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    setFeedback(null);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('altText', altText);

    try {
      const res = await fetch('/api/v1/admin/media/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Upload failed');

      setFeedback({ type: 'success', message: `File "${selectedFile.name}" uploaded successfully.` });
      setSelectedFile(null);
      setAltText('');
      await loadMedia();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete media asset "${name}"?`)) return;

    try {
      const res = await fetch(`/api/v1/admin/media/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Delete failed');
      setFeedback({ type: 'success', message: 'Asset removed.' });
      await loadMedia();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
    }
  };

  const copyUrl = (path: string) => {
    const fullUrl = `${window.location.origin}${path}`;
    navigator.clipboard.writeText(fullUrl);
    setFeedback({ type: 'success', message: `Copied URL to clipboard: ${fullUrl}` });
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          Media Library & File Assets
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Upload and organize verified photos, flyers, and documents for the website.
        </Typography>
      </Box>

      {feedback && (
        <Alert severity={feedback.type} sx={{ mb: 3 }} onClose={() => setFeedback(null)}>
          {feedback.message}
        </Alert>
      )}

      {/* Upload Box */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Upload Media Asset (Images & PDFs up to 10MB)
          </Typography>
          <Box component="form" onSubmit={handleUpload}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={4}>
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  startIcon={<CloudUploadIcon />}
                  sx={{ height: 54 }}
                >
                  {selectedFile ? selectedFile.name : 'Select File...'}
                  <input
                    type="file"
                    hidden
                    accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setSelectedFile(e.target.files[0]);
                      }
                    }}
                  />
                </Button>
              </Grid>
              <Grid item xs={12} sm={5}>
                <TextField
                  fullWidth
                  label="Alternative Text / Description"
                  placeholder="e.g. Community Centre Exterior"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={!selectedFile || uploading}
                  sx={{ height: 54 }}
                >
                  {uploading ? 'Uploading...' : 'Upload Asset'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>

      {/* Media Grid */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {mediaList.length > 0 ? (
            mediaList.map((m) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={m.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box
                    sx={{
                      height: 160,
                      backgroundColor: 'background.default',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    {m.mimeType.startsWith('image/') ? (
                      <img
                        src={m.storagePath}
                        alt={m.altText || m.originalName}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <Typography variant="caption" sx={{ p: 2, textAlign: 'center' }}>
                        Document ({m.mimeType})
                      </Typography>
                    )}
                  </Box>
                  <CardContent sx={{ flex: 1, p: 1.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, wordBreak: 'break-all' }} noWrap>
                      {m.originalName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                      {(m.sizeBytes / 1024).toFixed(1)} KB • {new Date(m.createdAt).toLocaleDateString()}
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Tooltip title="Copy File URL">
                        <IconButton size="small" onClick={() => copyUrl(m.storagePath)}>
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete File">
                        <IconButton size="small" color="error" onClick={() => handleDelete(m.id, m.originalName)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Card sx={{ p: 4, textAlign: 'center' }}>
                <Typography color="text.secondary">
                  No uploaded files in the media library.
                </Typography>
              </Card>
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  );
}
