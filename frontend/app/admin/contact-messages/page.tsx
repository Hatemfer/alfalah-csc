'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';

export default function AdminContactMessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMessage, setActiveMessage] = useState<any | null>(null);

  useEffect(() => {
    loadMessages();
  }, []);

  async function loadMessages() {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/admin/contact-messages', { credentials: 'include' });
      if (res.ok) {
        const json = await res.json();
        setMessages(json);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const toggleReadStatus = async (id: string, currentStatus: boolean) => {
    try {
      await fetch(`/api/v1/admin/contact-messages/${id}/read`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ isRead: !currentStatus }),
      });
      await loadMessages();
      if (activeMessage && activeMessage.id === id) {
        setActiveMessage({ ...activeMessage, isRead: !currentStatus });
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          Community Inquiries Inbox
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Review and respond to messages submitted via the public contact form.
        </Typography>
      </Box>

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
                  <TableCell sx={{ fontWeight: 700 }}>Sender</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Email Address</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Subject</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Received At</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {messages.length > 0 ? (
                  messages.map((m) => (
                    <TableRow key={m.id} hover sx={{ cursor: 'pointer' }} onClick={() => setActiveMessage(m)}>
                      <TableCell sx={{ fontWeight: m.isRead ? 400 : 700 }}>
                        {m.name}
                      </TableCell>
                      <TableCell>{m.email}</TableCell>
                      <TableCell sx={{ fontWeight: m.isRead ? 400 : 700 }}>
                        {m.subject}
                      </TableCell>
                      <TableCell>
                        {new Date(m.createdAt).toLocaleString('en-GB')}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={m.isRead ? 'Read' : 'New'}
                          color={m.isRead ? 'default' : 'primary'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                        <Button
                          size="small"
                          onClick={() => toggleReadStatus(m.id, m.isRead)}
                          startIcon={m.isRead ? <MarkEmailUnreadIcon /> : <MarkEmailReadIcon />}
                        >
                          {m.isRead ? 'Mark New' : 'Mark Read'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                      No community inquiries in the inbox.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {/* Message Reader Dialog */}
      {activeMessage && (
        <Dialog open onClose={() => setActiveMessage(null)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 800 }}>
            {activeMessage.subject}
          </DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, pt: 1 }}>
            <Box sx={{ p: 1.5, backgroundColor: 'background.default', borderRadius: 2 }}>
              <Typography variant="body2">
                <strong>From:</strong> {activeMessage.name} &lt;{activeMessage.email}&gt;
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Received: {new Date(activeMessage.createdAt).toLocaleString('en-GB')}
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-line', py: 2 }}>
              {activeMessage.message}
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button
              onClick={() => toggleReadStatus(activeMessage.id, activeMessage.isRead)}
            >
              {activeMessage.isRead ? 'Mark as Unread' : 'Mark as Read'}
            </Button>
            <Button
              variant="contained"
              onClick={() => setActiveMessage(null)}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}
