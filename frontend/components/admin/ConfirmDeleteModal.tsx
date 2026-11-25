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
  IconButton,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';

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
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25), 0 0 0 1px rgba(15, 23, 42, 0.05)',
          overflow: 'hidden',
          m: 2,
        },
      }}
    >
      {/* Top Header Bar */}
      <Box
        sx={{
          p: 2.5,
          pb: 2,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          borderBottom: '1px solid #F1F5F9',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.75 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '12px',
              backgroundColor: '#FEF2F2',
              border: '1px solid #FEE2E2',
              color: '#DC2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <DeleteOutlineIcon sx={{ fontSize: 24 }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', fontSize: '1.1rem', lineHeight: 1.3 }}>
              {title}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.25 }}>
              Confirm permanent deletion of this record
            </Typography>
          </Box>
        </Box>

        <IconButton
          size="small"
          onClick={onClose}
          disabled={loading}
          sx={{
            color: '#94A3B8',
            '&:hover': { color: 'text.primary', backgroundColor: 'action.hover' },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Content & Warning Card */}
      <DialogContent sx={{ p: 3, pt: 2.5, pb: 2 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6, mb: 2 }}>
          {description || 'Are you sure you want to permanently delete this item from the database? This action cannot be undone and will immediately remove it from public view.'}
        </Typography>

        {/* Item Preview Card */}
        {itemName && (
          <Box
            sx={{
              p: 2,
              borderRadius: '10px',
              backgroundColor: 'background.default',
              border: '1px solid', borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              mb: 1,
            }}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '8px',
                backgroundColor: '#FEF3C7',
                color: '#D97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <WarningAmberRoundedIcon sx={{ fontSize: 20 }} />
            </Box>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Item to be removed
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 800,
                  color: 'text.primary',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {itemName}
              </Typography>
            </Box>
          </Box>
        )}
      </DialogContent>

      {/* Footer Actions (Right-aligned enterprise standard) */}
      <DialogActions
        sx={{
          p: 2.5,
          pt: 1.5,
          borderTop: '1px solid #F1F5F9',
          backgroundColor: '#FAFAFA',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 1.5,
        }}
      >
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{
            px: 2.5,
            py: 0.9,
            color: 'text.secondary',
            borderRadius: '8px',
            fontWeight: 600,
            textTransform: 'none',
            fontSize: '0.88rem',
            '&:hover': {
              backgroundColor: 'action.hover',
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
            px: 3,
            py: 0.9,
            backgroundColor: '#DC2626',
            color: '#FFFFFF',
            borderRadius: '8px',
            fontWeight: 700,
            textTransform: 'none',
            fontSize: '0.88rem',
            whiteSpace: 'nowrap',
            boxShadow: '0 1px 3px rgba(220, 38, 38, 0.25)',
            '&:hover': {
              backgroundColor: '#B91C1C',
              boxShadow: '0 4px 6px -1px rgba(220, 38, 38, 0.3)',
            },
          }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={16} color="inherit" />
              <span>Deleting...</span>
            </Box>
          ) : (
            confirmText
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
