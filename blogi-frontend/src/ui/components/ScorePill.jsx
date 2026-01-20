import React from 'react';
import { Chip, Tooltip } from '@mui/material';

export default function ScorePill({ label, value, colorScale = 'green' }) {
  const val = Number(value ?? 0);
  const getColor = () => {
    if (colorScale === 'green') {
      if (val >= 80) return 'success';
      if (val >= 60) return 'info';
      if (val >= 40) return 'warning';
      return 'error';
    }
    return 'default';
  };
  return (
    <Tooltip title={`${label}: ${val}`}>
      <Chip label={`${label}: ${val}`} color={getColor()} variant="outlined" size="small" sx={{ mr: 1, mb: 1 }} />
    </Tooltip>
  );
}