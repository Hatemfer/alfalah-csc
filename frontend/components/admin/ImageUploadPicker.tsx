'use client';

import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  TextField,
  IconButton,
  Alert,
  Tooltip,
} from '@mui/material';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import LinkIcon from '@mui/icons-material/Link';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface ImageUploadPickerProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  helperText?: string;
}

export function ImageUploadPicker({
  value,
  onChange,
  label = 'Cover Image',
  helperText = 'Upload a photo or choose an existing image to represent this item.',
}: ImageUploadPickerProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds the 10MB limit. Please choose a smaller image.');
      return;
    }

    try {
      setUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('altText', file.name.replace(/\.[^/.]+$/, ''));
      formData.append('caption', 'Uploaded via Admin Dashboard');

      const res = await fetch('/api/v1/admin/media/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Image upload failed. Please try again.');
      }

      const media = await res.json();
      const finalUrl = media.storagePath || `/uploads/${media.filename}`;
      onChange(finalUrl);
    } catch (err: any) {
      setError(err.message || 'Failed to upload photo');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography sx={{ fontSize: '0.86rem', fontWeight: 700, color: '#1E293B', mb: 0.5 }}>
        {label}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 1.5, py: 0.5, fontSize: '0.82rem' }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/jpeg,image/png,image/webp,image/gif"
        style={{ display: 'none' }}
      />

      {value ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            p: 1.5,
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            backgroundColor: '#F8FAFC',
          }}
        >
          <Box
            component="img"
            src={value}
            alt="Preview"
            onError={(e: any) => {
              e.target.style.display = 'none';
            }}
            sx={{
              width: 80,
              height: 60,
              borderRadius: '8px',
              objectFit: 'cover',
              border: '1px solid #CBD5E1',
              backgroundColor: '#E2E8F0',
              flexShrink: 0,
            }}
          />

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.25 }}>
              <CheckCircleIcon sx={{ fontSize: 16, color: '#10B981' }} />
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#0F172A' }}>
                Image attached
              </Typography>
            </Box>
            <Typography
              variant="caption"
              sx={{
                color: '#64748B',
                display: 'block',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                maxWidth: '100%',
              }}
            >
              {value}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
            <Button
              size="small"
              variant="outlined"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              sx={{ textTransform: 'none', fontSize: '0.78rem', fontWeight: 600, py: 0.5 }}
            >
              {uploading ? <CircularProgress size={14} /> : 'Change'}
            </Button>
            <Tooltip title="Remove photo">
              <IconButton
                size="small"
                color="error"
                onClick={() => onChange('')}
                disabled={uploading}
                sx={{ border: '1px solid #FCA5A5' }}
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      ) : (
        <Box
          onClick={() => !uploading && fileInputRef.current?.click()}
          sx={{
            border: '2px dashed #CBD5E1',
            borderRadius: '12px',
            p: 2.5,
            textAlign: 'center',
            backgroundColor: '#F8FAFC',
            cursor: uploading ? 'default' : 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': {
              borderColor: '#3988CA',
              backgroundColor: '#F0F9FF',
            },
          }}
        >
          {uploading ? (
            <Box sx={{ py: 1 }}>
              <CircularProgress size={28} sx={{ color: '#3988CA', mb: 1 }} />
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#0F172A' }}>
                Uploading image to media library...
              </Typography>
            </Box>
          ) : (
            <>
              <CloudUploadOutlinedIcon sx={{ fontSize: 36, color: '#3988CA', mb: 0.5 }} />
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#0F172A', mb: 0.25 }}>
                Click to upload cover photo
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>
                PNG, JPG, or WebP up to 10MB
              </Typography>
            </>
          )}
        </Box>
      )}

      {/* Manual URL link toggle */}
      <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="caption" sx={{ color: '#64748B' }}>
          {helperText}
        </Typography>
        <Button
          size="small"
          onClick={() => setShowUrlInput(!showUrlInput)}
          startIcon={<LinkIcon fontSize="small" />}
          sx={{ textTransform: 'none', fontSize: '0.75rem', p: 0, minWidth: 'auto', color: '#64748B' }}
        >
          {showUrlInput ? 'Hide URL field' : 'Enter URL manually'}
        </Button>
      </Box>

      {showUrlInput && (
        <Box sx={{ mt: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="e.g. /images/real/mosque.jpg or https://..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                fontSize: '0.82rem',
                backgroundColor: '#FFFFFF',
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
}
