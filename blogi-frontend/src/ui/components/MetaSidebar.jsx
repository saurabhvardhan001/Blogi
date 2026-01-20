import React from 'react';
import { Paper, Typography, Stack, Chip, Divider, IconButton, Tooltip } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import IosShareIcon from '@mui/icons-material/IosShare';
import DownloadIcon from '@mui/icons-material/Download';
import ScorePill from './ScorePill';

export default function MetaSidebar({ data, onCopy, onExport, onShare }) {
  const keywords = data?.keywords || [];

  return (
    <Paper variant="outlined" sx={{ p: 2, position: 'sticky', top: 16 }}>
      <Stack direction="row" spacing={1} justifyContent="flex-end">
        <Tooltip title="Copy content"><IconButton size="small" onClick={onCopy}><ContentCopyIcon fontSize="small" /></IconButton></Tooltip>
        <Tooltip title="Download Markdown"><IconButton size="small" onClick={onExport}><DownloadIcon fontSize="small" /></IconButton></Tooltip>
        <Tooltip title="Share"><IconButton size="small" onClick={onShare}><IosShareIcon fontSize="small" /></IconButton></Tooltip>
      </Stack>

      <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: 600 }}>SEO Meta</Typography>
      <Typography variant="body2" color="text.secondary">{data?.metaTitle || data?.title}</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{data?.metaDescription}</Typography>

      <Divider sx={{ my: 2 }} />
      <Typography variant="subtitle2">Scores</Typography>
      <Stack direction="row" flexWrap="wrap" sx={{ mt: 1 }}>
        <ScorePill label="Readability" value={data?.readabilityScore} />
        <ScorePill label="SEO" value={Math.round((data?.seoScore ?? 0) * 100)} />
        <ScorePill label="Plagiarism" value={Math.round((data?.plagiarismScore ?? 0) * 100)} colorScale="green" />
      </Stack>

      {!!keywords.length && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle2">Keywords</Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap">
            {keywords.map((k, i) => <Chip key={i} label={k} size="small" />)}
          </Stack>
        </>
      )}
    </Paper>
  );
}