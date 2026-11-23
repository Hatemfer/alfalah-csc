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
  Chip,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  ButtonGroup,
  IconButton,
  Tooltip,
} from '@mui/material';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import EmailIcon from '@mui/icons-material/Email';
import SearchIcon from '@mui/icons-material/Search';
import PhoneIcon from '@mui/icons-material/Phone';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

export default function AdminContactMessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMessage, setActiveMessage] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'unread' | 'read'>('all');

  useEffect(() => {
    loadMessages();
  }, []);

  async function loadMessages() {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/admin/contact-messages', { credentials: 'include' });
      if (res.ok) {
        const json = await res.json();
        setMessages(Array.isArray(json) ? json : []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const toggleReadStatus = async (id: string, currentStatus: boolean, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      await fetch(`/api/v1/admin/contact-messages/${id}/read`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ isRead: !currentStatus }),
      });
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, isRead: !currentStatus } : m))
      );
      if (activeMessage && activeMessage.id === id) {
        setActiveMessage({ ...activeMessage, isRead: !currentStatus });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredMessages = messages.filter((m) => {
    if (filterMode === 'unread' && m.isRead) return false;
    if (filterMode === 'read' && !m.isRead) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      m.fullName?.toLowerCase().includes(q) ||
      m.email?.toLowerCase().includes(q) ||
      m.subject?.toLowerCase().includes(q) ||
      m.message?.toLowerCase().includes(q)
    );
  });

  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <Box>
      <Box sx={{ mb: 3.5, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2 }}>
        <div>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Community Inquiries Inbox
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Review and respond to messages and program inquiries submitted through the public contact form.
          </Typography>
        </div>

        <ButtonGroup size="small" variant="outlined">
          <Button
            variant={filterMode === 'all' ? 'contained' : 'outlined'}
            onClick={() => setFilterMode('all')}
          >
            All ({messages.length})
          </Button>
          <Button
            variant={filterMode === 'unread' ? 'contained' : 'outlined'}
            onClick={() => setFilterMode('unread')}
            color="error"
          >
            Unread ({unreadCount})
          </Button>
          <Button
            variant={filterMode === 'read' ? 'contained' : 'outlined'}
            onClick={() => setFilterMode('read')}
          >
            Read ({messages.length - unreadCount})
          </Button>
        </ButtonGroup>
      </Box>

      {/* Search Input */}
      <Card sx={{ mb: 3, p: 2 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search by sender name, email address, subject, or message keyword..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Card>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Sender</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Subject & Message</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Received At</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredMessages.length > 0 ? (
                  filteredMessages.map((m) => (
                    <TableRow
                      key={m.id}
                      hover
                      sx={{
                        cursor: 'pointer',
                        backgroundColor: m.isRead ? 'inherit' : 'rgba(57, 136, 202, 0.04)',
                      }}
                      onClick={() => {
                        setActiveMessage(m);
                        if (!m.isRead) toggleReadStatus(m.id, false);
                      }}
                    >
                      <TableCell sx={{ width: 100 }}>
                        <Chip
                          label={m.isRead ? 'Read' : 'New'}
                          size="small"
                          color={m.isRead ? 'default' : 'primary'}
                          sx={{
                            fontSize: '0.7rem',
                            fontWeight: 800,
                            height: 22,
                          }}
                        />
                      </TableCell>

                      <TableCell sx={{ minWidth: 180 }}>
                        <Typography variant="body2" sx={{ fontWeight: m.isRead ? 600 : 800 }}>
                          {m.fullName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          {m.email}
                        </Typography>
                      </TableCell>

                      <TableCell sx={{ maxWidth: 380 }}>
                        <Typography variant="body2" sx={{ fontWeight: m.isRead ? 500 : 700 }}>
                          {m.subject || 'No Subject'}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {m.message}
                        </Typography>
                      </TableCell>

                      <TableCell sx={{ whiteSpace: 'nowrap', color: 'text.secondary', fontSize: '0.85rem' }}>
                        {new Date(m.createdAt).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </TableCell>

                      <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                        <Tooltip title={m.isRead ? 'Mark as Unread' : 'Mark as Read'}>
                          <IconButton
                            size="small"
                            onClick={(e) => toggleReadStatus(m.id, m.isRead, e)}
                          >
                            {m.isRead ? <MarkEmailUnreadIcon fontSize="small" /> : <MarkEmailReadIcon fontSize="small" color="primary" />}
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} sx={{ textAlign: 'center', py: 5, color: 'text.secondary' }}>
                      <EmailIcon sx={{ fontSize: 44, color: 'text.secondary', opacity: 0.4, mb: 1, display: 'block', mx: 'auto' }} />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        No messages found matching current filters.
                      </Typography>
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
          <DialogTitle sx={{ fontWeight: 800, pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{activeMessage.subject || 'Community Inquiry'}</span>
            <Chip
              label={activeMessage.isRead ? 'Read' : 'New'}
              size="small"
              color={activeMessage.isRead ? 'default' : 'primary'}
              sx={{ fontWeight: 700 }}
            />
          </DialogTitle>
          <DialogContent sx={{ pt: 1 }}>
            <Box sx={{ p: 2, borderRadius: 2, backgroundColor: 'background.default', mb: 2.5, border: '1px solid', borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                  {activeMessage.fullName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  &lt;{activeMessage.email}&gt;
                </Typography>
              </Box>
              {activeMessage.phone && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <PhoneIcon fontSize="inherit" color="action" />
                  <Typography variant="caption" color="text.secondary">
                    Phone: {activeMessage.phone}
                  </Typography>
                </Box>
              )}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarTodayIcon fontSize="inherit" color="action" />
                <Typography variant="caption" color="text.secondary">
                  Sent: {new Date(activeMessage.createdAt).toLocaleString('en-GB')}
                </Typography>
              </Box>
            </Box>

            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
              Message Body:
            </Typography>
            <Box sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider', minHeight: 120 }}>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                {activeMessage.message}
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
            <Button
              size="small"
              onClick={() => toggleReadStatus(activeMessage.id, activeMessage.isRead)}
              startIcon={activeMessage.isRead ? <MarkEmailUnreadIcon /> : <MarkEmailReadIcon />}
            >
              {activeMessage.isRead ? 'Mark Unread' : 'Mark Read'}
            </Button>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                component="a"
                href={`mailto:${activeMessage.email}?subject=Re: ${encodeURIComponent(activeMessage.subject || 'Al Falah Community Inquiry')}`}
                startIcon={<EmailIcon />}
              >
                Reply via Email
              </Button>
              <Button variant="contained" onClick={() => setActiveMessage(null)}>
                Close
              </Button>
            </Box>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}
