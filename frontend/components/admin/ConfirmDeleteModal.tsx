'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  CircularProgress,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

interface ConfirmDeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  itemName?: string;
  description?: string;
  loading?: boolean;
  confirmText?: string;
}

export function ConfirmDeleteModal({
  open,
  onClose,
  onConfirm,
  title,
  itemName,
  description,
  loading = false,
  confirmText = 'Delete Permanently',
}: ConfirmDeleteModalProps) {
  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          p: 1,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        },
      }}
    >
      <DialogContent sx={{ pt: 3, pb: 2, textAlign: 'center' }}>
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            backgroundColor: '#FEE2E2',
            color: '#DC2626',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 2,
          }}
        >
          <DeleteOutlineIcon sx={{ fontSize: 30 }} />
        </Box>

        <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', mb: 1 }}>
          {title}
        </Typography>

        <Typography variant="body2" sx={{ color: '#64748B', lineHeight: 1.6, px: 1 }}>
          {description ? (
            description
          ) : (
            <>
              Are you sure you want to delete{' '}
              {itemName ? <strong style={{ color: '#0F172A' }}>&ldquo;{itemName}&rdquo;</strong> : 'this item'}?
              This action cannot be undone and will be immediately removed from the live website.
            </>
          )}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 1, gap: 1.5, justifyContent: 'center' }}>
        <Button
          onClick={onClose}
          disabled={loading}
          variant="outlined"
          sx={{
            flex: 1,
            py: 1.1,
            color: '#475569',
            borderColor: '#CBD5E1',
            borderRadius: '8px',
            fontWeight: 600,
            textTransform: 'none',
            '&:hover': {
              borderColor: '#94A3B8',
              backgroundColor: '#F8FAFC',
            },
          }}
        >
          Cancel
        </Button>

        <Button
          onClick={onConfirm}
          disabled={loading}
          variant="contained"
          sx={{
            flex: 1,
            py: 1.1,
            backgroundColor: '#DC2626',
            color: '#FFFFFF',
            borderRadius: '8px',
            fontWeight: 700,
            textTransform: 'none',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            '&:hover': {
              backgroundColor: '#B91C1C',
              boxShadow: '0 4px 6px -1px rgba(220, 38, 38, 0.2)',
            },
          }}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
