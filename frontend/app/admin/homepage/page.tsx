'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

export default function AdminHomepageSectionsPage() {
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSection, setEditingSection] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    loadSections();
  }, []);

  async function loadSections() {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/admin/homepage-sections', { credentials: 'include' });
      if (res.ok) {
        const json = await res.json();
        setSections(json);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleSave = async () => {
    if (!editingSection) return;
    setSaving(true);
    setFeedback(null);

    try {
      const res = await fetch(`/api/v1/admin/homepage-sections/${editingSection.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(editingSection),
      });

      if (!res.ok) {
        throw new Error('Failed to save section changes');
      }

      setFeedback({ type: 'success', message: 'Homepage section updated successfully.' });
      setEditingSection(null);
      await loadSections();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Homepage Sections Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Customise titles, content copy, call-to-actions, and section visibility on the public homepage.
          </Typography>
        </div>
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
        <Grid container spacing={3}>
          {sections.map((sec) => (
            <Grid item xs={12} key={sec.id}>
              <Card>
                <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
                  <Box sx={{ flex: 1, minWidth: 280 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {sec.title || sec.sectionKey}
                      </Typography>
                      <FormControlLabel
                        control={<Switch checked={sec.isVisible} disabled size="small" />}
                        label={sec.isVisible ? 'Visible' : 'Hidden'}
                        sx={{ ml: 1 }}
                      />
                    </Box>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                      Section Key: <code>{sec.sectionKey}</code>
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', whiteSpace: 'pre-line' }}>
                      {sec.content || 'No content set.'}
                    </Typography>
                    {sec.ctaText && (
                      <Typography variant="caption" sx={{ display: 'block', mt: 1, fontWeight: 600 }}>
                        Button: {sec.ctaText} → {sec.ctaUrl}
                      </Typography>
                    )}
                  </Box>

                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={() => setEditingSection({ ...sec })}
                  >
                    Edit Section
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Edit Dialog */}
      {editingSection && (
        <Dialog open onClose={() => setEditingSection(null)} maxWidth="md" fullWidth>
          <DialogTitle sx={{ fontWeight: 800 }}>
            Edit Section: {editingSection.sectionKey}
          </DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Section Title"
              fullWidth
              value={editingSection.title || ''}
              onChange={(e) => setEditingSection({ ...editingSection, title: e.target.value })}
            />
            <TextField
              label="Subtitle / Badge Text"
              fullWidth
              value={editingSection.subtitle || ''}
              onChange={(e) => setEditingSection({ ...editingSection, subtitle: e.target.value })}
            />
            <TextField
              label="Section Main Content"
              multiline
              rows={4}
              fullWidth
              value={editingSection.content || ''}
              onChange={(e) => setEditingSection({ ...editingSection, content: e.target.value })}
            />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Button CTA Text"
                  fullWidth
                  value={editingSection.ctaText || ''}
                  onChange={(e) => setEditingSection({ ...editingSection, ctaText: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Button Destination URL"
                  fullWidth
                  value={editingSection.ctaUrl || ''}
                  onChange={(e) => setEditingSection({ ...editingSection, ctaUrl: e.target.value })}
                />
              </Grid>
            </Grid>
            <FormControlLabel
              control={
                <Switch
                  checked={editingSection.isVisible}
                  onChange={(e) => setEditingSection({ ...editingSection, isVisible: e.target.checked })}
                />
              }
              label="Show this section on public homepage"
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setEditingSection(null)} disabled={saving}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving Changes...' : 'Save Section'}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}
