import React, { useState } from 'react';
import api from '../services/api';
import {
  Container, TextField, Button, Paper, Typography, Stack, Grid,
  Snackbar, Alert, FormControl, InputLabel, Select, MenuItem, Divider, Skeleton
} from '@mui/material';
import MarkdownRenderer from './components/MarkdownRenderer';
import MetaSidebar from './components/MetaSidebar';

export default function Editor(){
  const [topic, setTopic] = useState('');
  const [keywords, setKeywords] = useState('');
  const [tone, setTone] = useState('Formal');
  const [aud, setAud] = useState('Beginners');
  const [length, setLength] = useState(800);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, type: 'success', msg: '' });

  const notify = (type, msg) => setToast({ open: true, type, msg });

  const submit = async () => {
    if (!topic.trim()) {
      notify('warning', 'Please enter a topic.');
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const { data } = await api.post('/api/blog/generate', {
        topic,
        keywords: keywords.split(',').map(k=>k.trim()).filter(Boolean),
        tone, targetAudience: aud, length: Number(length)
      });
      setResult(data);
      notify('success', 'Blog generated successfully!');
    } catch (e) {
      const msg = e?.response?.data?.message || 'Generation failed';
      notify('error', msg);
    } finally {
      setLoading(false);
    }
  };

  const onCopy = async () => {
    if (!result?.content) return;
    await navigator.clipboard.writeText(result.content);
    notify('success', 'Content copied to clipboard');
  };

  const onExport = () => {
    if (!result?.content) return;
    const blob = new Blob([result.content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const safe = (result.metaTitle || result.title || 'blogi-post').replace(/[^a-z0-9-_]+/gi, '-');
    a.download = `${safe}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const onShare = async () => {
    if (navigator.share && result?.content) {
      try {
        await navigator.share({
          title: result.metaTitle || result.title || 'Blogi Post',
          text: result.metaDescription || '',
        });
      } catch {}
    } else {
      onCopy();
    }
  };

  const leftForm = (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>AI Blog Generator</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Enter a topic and optional keywords. Choose tone/audience/length. We’ll create a polished, SEO‑aware blog post.
      </Typography>
      <Stack spacing={2}>
        <TextField label="Topic" value={topic} onChange={e=>setTopic(e.target.value)} fullWidth />
        <TextField label="Keywords (comma separated)"
          value={keywords} onChange={e=>setKeywords(e.target.value)} fullWidth
          helperText="Example: Indian tourism, cultural heritage, hill stations" />
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <FormControl fullWidth>
            <InputLabel id="tone-label">Tone</InputLabel>
            <Select labelId="tone-label" label="Tone" value={tone} onChange={e=>setTone(e.target.value)}>
              <MenuItem value="Formal">Formal</MenuItem>
              <MenuItem value="Casual">Casual</MenuItem>
              <MenuItem value="Persuasive">Persuasive</MenuItem>
              <MenuItem value="Technical">Technical</MenuItem>
              <MenuItem value="Storytelling">Storytelling</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="aud-label">Audience</InputLabel>
            <Select labelId="aud-label" label="Audience" value={aud} onChange={e=>setAud(e.target.value)}>
              <MenuItem value="Beginners">Beginners</MenuItem>
              <MenuItem value="Intermediate">Intermediate</MenuItem>
              <MenuItem value="Experts">Experts</MenuItem>
            </Select>
          </FormControl>
          <TextField label="Length (words)" type="number" value={length} onChange={e=>setLength(e.target.value)} fullWidth />
        </Stack>
        <Stack direction="row" spacing={2}>
          <Button variant="contained" onClick={submit} disabled={loading}>
            {loading ? 'Generating...' : 'Generate'}
          </Button>
          <Button variant="outlined" onClick={() => { setTopic(''); setKeywords(''); }} disabled={loading}>
            Clear
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );

  const rightPane = (
    <>
      {!result && !loading && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6">Your output will appear here</Typography>
          <Typography variant="body2" color="text.secondary">
            Generate a post to see a polished reading view with Markdown, meta details, and export options.
          </Typography>
        </Paper>
      )}

      {loading && (
        <Paper sx={{ p: 3 }}>
          <Skeleton variant="text" height={40} />
          <Skeleton variant="text" />
          <Skeleton variant="rectangular" height={220} sx={{ my: 2 }} />
          <Skeleton variant="text" />
          <Skeleton variant="text" />
          <Divider sx={{ my: 2 }} />
          <Skeleton variant="rectangular" height={120} />
        </Paper>
      )}

      {result && !loading && (
        <Stack spacing={2}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              {result.title || result.metaTitle}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {result.metaDescription}
            </Typography>
            <MarkdownRenderer content={result.content} />
          </Paper>
        </Stack>
      )}
    </>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={5} lg={4}>
          {leftForm}
        </Grid>
        <Grid item xs={12} md={7} lg={8}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={9}>
              {rightPane}
            </Grid>
            <Grid item xs={12} md={3}>
              {result && (
                <MetaSidebar data={result} onCopy={onCopy} onExport={onExport} onShare={onShare} />
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Snackbar open={toast.open} autoHideDuration={2500} onClose={()=>setToast(p=>({...p, open:false}))}>
        <Alert severity={toast.type} variant="filled" sx={{ width: '100%' }}>
          {toast.msg}
        </Alert>
      </Snackbar>
    </Container>
  );
}