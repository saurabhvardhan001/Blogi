import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Container, Grid, Typography, Paper, Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import BlogCard from './components/BlogCard';
import MarkdownRenderer from './components/MarkdownRenderer';

export default function History(){
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchItems = async () => {
      try {
        const { data } = await api.get('/api/blog');
        if (mounted) setItems(data);
      } catch {}
    };
    // initial fetch
    fetchItems();
    // re-fetch when auth changes
    const onAuthChange = () => { fetchItems(); };
    window.addEventListener('auth:change', onAuthChange);

    return () => { mounted = false; window.removeEventListener('auth:change', onAuthChange); };
  }, []);

  const onOpen = (item) => { setActive(item); setOpen(true); };
  const onClose = () => { setOpen(false); setActive(null); };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      <Typography variant="h5" gutterBottom>Generated Blogs</Typography>
      {!items.length && (
        <Paper sx={{ p: 3 }}>
          <Typography color="text.secondary">No posts yet. Generate your first blog from the Editor.</Typography>
        </Paper>
      )}
      <Grid container spacing={2} sx={{ mt: 1 }}>
        {items.map((b) => (
          <Grid item xs={12} sm={6} md={4} key={b.id}>
            <BlogCard item={b} onClick={() => onOpen(b)} />
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle>
          {active?.metaTitle || active?.title}
          <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <MarkdownRenderer content={active?.content || ''} />
        </DialogContent>
      </Dialog>
    </Container>
  );
}