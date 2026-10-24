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
  CircularProgress,
} from '@mui/material';

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLogs() {
      try {
        const res = await fetch('/api/v1/admin/audit-logs?limit=100', { credentials: 'include' });
        if (res.ok) {
          const json = await res.json();
          setLogs(json);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadLogs();
  }, []);

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          Administrative Audit Trail
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Full security logging of publishing, editing, deletion, and system actions.
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <Card>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Action</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Entity</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Staff User</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>IP Address</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>Timestamp</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {logs.length > 0 ? (
                  logs.map((log) => (
                    <TableRow key={log.id} hover>
                      <TableCell>
                        <Chip
                          label={log.action}
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={{ fontSize: '0.75rem', fontWeight: 700 }}
                        />
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>{log.entityType}</TableCell>
                      <TableCell>{log.adminEmail || 'System / Automated'}</TableCell>
                      <TableCell sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
                        {log.ipAddress || '-'}
                      </TableCell>
                      <TableCell align="right" sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
                        {new Date(log.createdAt).toLocaleString('en-GB')}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} sx={{ textAlign: 'center', py: 3, color: 'text.secondary' }}>
                      No audit records found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}
    </Box>
  );
}
